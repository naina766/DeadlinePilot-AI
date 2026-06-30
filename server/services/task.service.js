import taskRepository from '../repositories/task.repository.js';
import userRepository from '../repositories/user.repository.js';
import aiOrchestrator from '../ai/orchestrator/aiOrchestrator.js';
export const taskService = {
  getTasksForUser: async (userId) => {
    return taskRepository.findByUserId(userId);
  },
  getTaskById: async (taskId, userId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) return null;
    if (task.userId !== userId) throw new Error('Forbidden');
    return task;
  },
  createTask: async (userId, taskData) => {
    const { title, description, deadline, estimatedHours, category, tags, priority, attachments } = taskData;

    let habits = { avgCompletionSpeed: 1.0, delayRatio: 0.15 };
    const user = await userRepository.findByUid(userId);
    if (user && user.settings && user.settings.habits) {
      habits = user.settings.habits;
    }

    const aiAnalysis = await aiOrchestrator.evaluateNewTask(
      title,
      description,
      deadline,
      estimatedHours,
      habits
    );
    const finalPriority = priority || aiAnalysis.priority || 'Medium';
    const finalRisk = aiAnalysis.deadlineRiskPercent || 0.0;
    const subtasks = aiAnalysis.subtasks || [];
    const task = await taskRepository.create({
      userId,
      title,
      description: description || '',
      deadline: new Date(deadline),
      priority: finalPriority,
      estimatedHours: estimatedHours || 1.0,
      status: 'Pending',
      category: category || 'General',
      tags: tags || [],
      attachments: attachments || [],
      aiRiskScore: finalRisk,
      subtasks
    });
    return task;
  },
  updateTask: async (taskId, userId, updates) => {
    const task = await taskRepository.findById(taskId);
    if (!task) return null;
    if (task.userId !== userId) throw new Error('Forbidden');

    if (updates.deadline || updates.estimatedHours || updates.priority) {
      let habits = { avgCompletionSpeed: 1.0, delayRatio: 0.15 };
      const user = await userRepository.findByUid(userId);
      if (user && user.settings && user.settings.habits) {
        habits = user.settings.habits;
      }
      const title = updates.title || task.title;
      const desc = updates.description || task.description;
      const dline = updates.deadline || task.deadline.toISOString();
      const hours = updates.estimatedHours || task.estimatedHours;
      const aiAnalysis = await aiOrchestrator.evaluateNewTask(title, desc, dline, hours, habits);
      updates.aiRiskScore = aiAnalysis.deadlineRiskPercent;
      if (!updates.priority) {
        updates.priority = aiAnalysis.priority;
      }
    }
    return taskRepository.update(taskId, updates);
  },
  deleteTask: async (taskId, userId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) return null;
    if (task.userId !== userId) throw new Error('Forbidden');
    await taskRepository.delete(taskId);
    return true;
  }
};
export default taskService;
