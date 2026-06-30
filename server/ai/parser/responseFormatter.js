import { parseJsonResponse } from './jsonParser.js';
import responseNormalizer from './responseNormalizer.js';
import markdownCleaner from './markdownCleaner.js';
import responseValidator from './responseValidator.js';

export const responseFormatter = {
  /**
   * Primary entrypoint for formatting and validating Gemini AI outputs.
   * Pipeline: Raw Gemini -> JSON Parse -> Normalize -> Clean Markdown -> Validate -> Local Fallback if invalid
   */
  formatResponse: (rawText, contextBlocks = [], actions = [], userName = 'Pilot', clientTime = new Date(), parsedIntents = []) => {
    let parsed = null;
    
    // 1. Try parsing rawText if it is a JSON string
    if (rawText && typeof rawText === 'string') {
      try {
        parsed = parseJsonResponse(rawText.trim());
      } catch (e) {
        console.warn("Failed to parse rawText as JSON directly in responseFormatter:", e);
      }
    } else if (rawText && typeof rawText === 'object') {
      parsed = rawText;
    }

    // 2. Normalize JSON properties and data keys
    if (parsed) {
      parsed = responseNormalizer.normalize(parsed);
    }

    // 3. Clean markdown headers and symbols from the summary
    if (parsed && parsed.summary) {
      parsed.summary = markdownCleaner.clean(parsed.summary);
    }

    // 4. Validate structure; fall back to local generation if structure is incorrect
    if (!parsed || !responseValidator.isValid(parsed)) {
      console.warn("Response validation failed. Emitting local fallback response.");
      parsed = responseFormatter.generateLocalFallback(contextBlocks, actions, userName, clientTime, parsedIntents);
    }

    return parsed;
  },

  /**
   * Generates a fully compliant, clean JSON payload when Gemini is offline, rate-limited, or fails
   */
  generateLocalFallback: (contextBlocks = [], actions = [], userName = 'Pilot', clientTime = new Date(), parsedIntents = []) => {
    const cards = [];
    const hr = new Date(clientTime).getHours();
    let greeting = "Hello";
    if (hr < 12) greeting = "Good morning";
    else if (hr < 17) greeting = "Good afternoon";
    else greeting = "Good evening";

    const summaryParts = [`${greeting}, ${userName}.`];

    // Parse context blocks to construct card components
    contextBlocks.forEach(block => {
      const blockStr = block.trim();
      if (!blockStr) return;

      if (blockStr.includes("Schedule") || blockStr.includes("Busy")) {
        const events = [];
        const lines = blockStr.split('\n').map(l => l.trim()).filter(Boolean);
        lines.slice(1).forEach(line => {
          if (line.includes("-")) {
            const colonIdx = line.indexOf(':');
            if (colonIdx > -1) {
              const timeRange = line.slice(0, colonIdx).replace(/^-\s*/, '').trim();
              const details = line.slice(colonIdx + 1).trim();
              
              const hyphenIdx = timeRange.indexOf(' - ');
              let start = "09:00 AM";
              let end = "05:00 PM";
              if (hyphenIdx > -1) {
                start = timeRange.slice(0, hyphenIdx).trim();
                end = timeRange.slice(hyphenIdx + 3).trim();
              } else {
                const times = timeRange.split('-');
                if (times.length > 1) {
                  start = times[0].trim();
                  end = times[1].trim();
                }
              }

              events.push({
                title: details.replace(/\s*\(.*\)$/, ''),
                start,
                end,
                type: details.toLowerCase().includes('task') ? 'task' : 'meeting',
                priority: 'Medium',
                duration: '2h',
                status: 'Scheduled'
              });
            }
          }
        });

        if (events.length > 0) {
          summaryParts.push("Your schedule has been compiled. You have scheduled work blocks today.");
          cards.push({
            type: "schedule",
            data: { events }
          });
        }
      }

      else if (blockStr.includes("Tasks") || blockStr.includes("Deadlines")) {
        const tasks = [];
        const lines = blockStr.split('\n').map(l => l.trim()).filter(Boolean);
        lines.slice(1).forEach(line => {
          const cleanLine = line.replace(/^-\s*\[ID:[^\]]+\]\s*/, '').replace(/^-\s*/, '');
          if (cleanLine) {
            const titleMatch = cleanLine.match(/^"([^"]+)"/);
            const title = titleMatch ? titleMatch[1] : cleanLine.split('(')[0]?.trim();
            const estMatch = cleanLine.match(/Est:\s*([\d.]+)h/);
            const priorityMatch = cleanLine.match(/Priority:\s*(\w+)/);
            const riskMatch = cleanLine.match(/Risk:\s*(\d+)%/);
            const dueMatch = cleanLine.match(/Due:\s*([\d\-]+)/);

            tasks.push({
              title: title || "Task Block",
              priority: priorityMatch ? priorityMatch[1] : "Medium",
              deadline: dueMatch ? dueMatch[1] : "Tomorrow",
              riskScore: riskMatch ? parseInt(riskMatch[1]) : 15,
              completionPercent: 0
            });
          }
        });

        if (tasks.length > 0) {
          summaryParts.push(`I found ${tasks.length} active pending tasks in your dashboard.`);
          cards.push({
            type: "tasks",
            data: { tasks }
          });
        }
      }

      else if (blockStr.includes("Analytics")) {
        const lines = blockStr.split('\n').map(l => l.trim()).filter(Boolean);
        let completion = 75;
        let completed = 4;
        let hours = 8.5;
        let score = 82;

        lines.forEach(l => {
          if (l.includes("Completion Rate")) completion = parseInt(l.match(/\d+/) || 75);
          if (l.includes("Tasks Completed")) completed = parseInt(l.match(/\d+/) || 4);
          if (l.includes("Focus Duration")) hours = parseFloat(l.match(/[\d.]+/) || 8.5);
          if (l.includes("Productivity Score")) score = parseInt(l.match(/\d+/) || 82);
        });

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayName = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(new Date());
        const todayIdx = days.indexOf(dayName);
        const weeklyTrend = [];
        for (let i = 1; i <= Math.max(1, todayIdx); i++) {
          weeklyTrend.push({
            day: days[i],
            hours: i === todayIdx ? hours : Math.max(1, hours - (todayIdx - i) * 1.5)
          });
        }

        cards.push({
          type: "analytics",
          data: {
            focusHours: hours,
            productivityScore: score,
            completedTasks: completed,
            weeklyTrend
          }
        });
      }
    });

    if (actions.length > 0) {
      actions.forEach(act => {
        const actionType = act.type === 'created_task' ? 'Task completed.' : act.type === 'updated_task' ? 'Task updated.' : 'Task removed.';
        summaryParts.push(`Action successfully executed. ${actionType}`);
        cards.push({
          type: "recommendation",
          data: {
            recommendation: `Successfully processed: ${act.type === 'created_task' ? '📅 Created & Auto-scheduled' : act.type === 'updated_task' ? '✏️ Updated' : '❌ Removed'} task "${act.title || 'Task'}".`,
            estimatedImpact: "High",
            timeRange: act.scheduledStart ? new Date(act.scheduledStart).toLocaleTimeString() : undefined
          }
        });
      });
    }

    if (cards.length === 0) {
      summaryParts.push("Looks like your calendar is completely free today. Great opportunity to make progress!");
    }

    return {
      type: "general",
      title: "📋 Workspace Summary",
      summary: summaryParts.join(' '),
      cards: cards,
      quickActions: [
        "📅 Show today's schedule",
        "📋 Show pending tasks",
        "📈 Show analytics",
        "🧠 Generate study plan"
      ]
    };
  }
};

export default responseFormatter;
