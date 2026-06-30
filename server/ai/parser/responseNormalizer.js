/**
 * Response Normalizer
 * Standardizes schema structures and keys returned by the Gemini AI models
 */

export const responseNormalizer = {
  normalize: (rawJson) => {
    if (!rawJson || typeof rawJson !== 'object') {
      return null;
    }

    const normalized = { ...rawJson };

    // Standardize basic fields
    normalized.type = normalized.type || 'general';
    normalized.title = normalized.title || 'Executive Co-Pilot';
    normalized.summary = normalized.summary || '';

    // Standardize cards collection
    if (!normalized.cards) {
      normalized.cards = [];
    }

    normalized.cards = normalized.cards.map(card => {
      if (!card || typeof card !== 'object') return null;
      
      const cleanCard = { ...card };
      cleanCard.data = cleanCard.data || {};

      // Normalize Schedule events structure
      if (cleanCard.type === 'schedule' && cleanCard.data.events) {
        cleanCard.data.events = cleanCard.data.events.map(ev => ({
          title: ev.title || ev.name || 'Event',
          start: ev.start || ev.startTime || '09:00 AM',
          end: ev.end || ev.endTime || '10:00 AM',
          type: ev.type || 'task',
          priority: ev.priority || 'Medium',
          duration: ev.duration || '1h',
          status: ev.status || 'Scheduled'
        }));
      }

      // Normalize Task cards list structure
      if (cleanCard.type === 'tasks' && cleanCard.data.tasks) {
        cleanCard.data.tasks = cleanCard.data.tasks.map(t => ({
          title: t.title || t.name || 'Task',
          priority: t.priority || 'Medium',
          deadline: t.deadline || t.due || 'Tomorrow',
          riskScore: t.riskScore !== undefined ? t.riskScore : (t.risk || t.deadlineRiskPercent || 15),
          completionPercent: t.completionPercent !== undefined ? t.completionPercent : (t.completionPercentage || 0)
        }));
      }

      // Normalize Analytics focus values
      if (cleanCard.type === 'analytics') {
        cleanCard.data = {
          focusHours: cleanCard.data.focusHours || cleanCard.data.hours || 0,
          productivityScore: cleanCard.data.productivityScore || cleanCard.data.score || 0,
          completedTasks: cleanCard.data.completedTasks || cleanCard.data.completed || 0,
          weeklyTrend: cleanCard.data.weeklyTrend || []
        };
      }

      return cleanCard;
    }).filter(Boolean);

    // Standardize quick actions list
    if (!normalized.quickActions || !Array.isArray(normalized.quickActions)) {
      normalized.quickActions = [
        "📅 Show today's schedule",
        "📋 Show pending tasks",
        "📈 Show analytics",
        "🧠 Generate study plan"
      ];
    }

    return normalized;
  }
};

export default responseNormalizer;
