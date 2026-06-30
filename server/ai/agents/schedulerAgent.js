import { getGeminiModel } from '../../config/gemini.js';
import { SCHEDULER_SYSTEM_PROMPT } from '../prompts/scheduler.system.js';
import { getSchedulerUserPrompt } from '../prompts/scheduler.user.js';
import { SCHEDULE_SCHEMA } from '../schema/schedule.schema.js';
import { parseJsonResponse } from '../parser/jsonParser.js';

export const schedulerAgent = {
  findOptimalSlot: async (taskTitle, estimatedHours, deadlineStr, busyEvents = [], userProfile = {}) => {
    // 1. Algorithmic slot search
    const now = new Date();
    const deadline = new Date(deadlineStr);
    
    const sleepStartStr = userProfile.sleepStart || '23:00';
    const sleepEndStr = userProfile.sleepEnd || '07:00';
    const workStartStr = userProfile.workStart || '09:00';
    const workEndStr = userProfile.workEnd || '17:00';
    const classes = userProfile.classes || [];
    
    const parseTime = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return { hours: h, minutes: m };
    };

    const sleepS = parseTime(sleepStartStr);
    const sleepE = parseTime(sleepEndStr);
    
    const parsedBusy = busyEvents.map(ev => ({
      start: new Date(ev.start),
      end: new Date(ev.end)
    })).filter(ev => !isNaN(ev.start) && !isNaN(ev.end));

    const slotDurationMs = estimatedHours * 60 * 60 * 1000;
    const maxSearchTime = Math.min(now.getTime() + 7 * 24 * 60 * 60 * 1000, deadline.getTime());
    
    let checkTime = new Date(now.getTime() + 30 * 60 * 1000); // Start check 30m from now
    checkTime.setSeconds(0, 0);
    const mins = checkTime.getMinutes();
    if (mins > 0 && mins < 30) {
      checkTime.setMinutes(30);
    } else if (mins > 30) {
      checkTime.setMinutes(0);
      checkTime.setHours(checkTime.getHours() + 1);
    }

    let foundSlot = null;

    while (checkTime.getTime() + slotDurationMs <= maxSearchTime) {
      const slotStart = new Date(checkTime);
      const slotEnd = new Date(checkTime.getTime() + slotDurationMs);
      
      let hasOverlap = false;

      const checkOverlapSleep = (date) => {
        const hr = date.getHours();
        if (sleepS.hours > sleepE.hours) { // spans midnight
          return (hr >= sleepS.hours || hr < sleepE.hours);
        } else {
          return (hr >= sleepS.hours && hr < sleepE.hours);
        }
      };

      for (let offset = 0; offset <= slotDurationMs; offset += 15 * 60 * 1000) {
        const sampleDate = new Date(slotStart.getTime() + offset);
        if (checkOverlapSleep(sampleDate)) {
          hasOverlap = true;
          break;
        }
      }

      if (hasOverlap) {
        checkTime.setMinutes(checkTime.getMinutes() + 30);
        continue;
      }

      const weekday = slotStart.getDay();
      for (const cl of classes) {
        if (cl.days && cl.days.includes(weekday)) {
          const [sh, sm] = cl.start.split(':').map(Number);
          const [eh, em] = cl.end.split(':').map(Number);
          
          const classStart = new Date(slotStart);
          classStart.setHours(sh, sm, 0, 0);
          const classEnd = new Date(slotStart);
          classEnd.setHours(eh, em, 0, 0);

          if (!(slotEnd <= classStart || slotStart >= classEnd)) {
            hasOverlap = true;
            break;
          }
        }
      }

      if (hasOverlap) {
        checkTime.setMinutes(checkTime.getMinutes() + 30);
        continue;
      }

      for (const busy of parsedBusy) {
        if (!(slotEnd <= busy.start || slotStart >= busy.end)) {
          hasOverlap = true;
          break;
        }
      }

      if (hasOverlap) {
        checkTime.setMinutes(checkTime.getMinutes() + 30);
        continue;
      }

      foundSlot = {
        start: slotStart.toISOString(),
        end: slotEnd.toISOString()
      };
      break;
    }

    if (!foundSlot) {
      const fallbackStart = new Date(now.getTime() + 60 * 60 * 1000);
      foundSlot = {
        start: fallbackStart.toISOString(),
        end: new Date(fallbackStart.getTime() + slotDurationMs).toISOString()
      };
    }

    const model = getGeminiModel();
    if (!model) {
      return {
        ...foundSlot,
        explanation: 'Algorithmic calendar scheduler fallback. Slotted in first available daylight gap.'
      };
    }

    try {
      const userPrompt = getSchedulerUserPrompt(
        taskTitle,
        estimatedHours,
        foundSlot.start,
        foundSlot.end,
        sleepStartStr,
        sleepEndStr,
        workStartStr,
        workEndStr,
        deadlineStr
      );

      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        systemInstruction: SCHEDULER_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: SCHEDULE_SCHEMA
        }
      });

      const data = parseJsonResponse(result.response.text().trim());
      return {
        start: data.start || foundSlot.start,
        end: data.end || foundSlot.end,
        explanation: data.explanation || 'Optimal slot scheduled near active study/work hours.'
      };
    } catch (error) {
      console.error('Error running SchedulingAgent:', error);
      return {
        ...foundSlot,
        explanation: 'Conflict-free algorithmic schedule allocation.'
      };
    }
  }
};
export default schedulerAgent;
