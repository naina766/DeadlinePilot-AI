import Task from '../../models/Task.js';
import taskService from '../../services/task.service.js';

export const getTasksByUser = async (userId) => {
  try {
    return await Task.find({ userId });
  } catch (error) {
    console.error('Error fetching user tasks in tool:', error);
    return [];
  }
};

export const getUpcomingTasks = async (userId) => {
  try {
    const now = new Date();
    return await Task.find({ 
      userId, 
      status: { $ne: 'Completed' },
      deadline: { $gte: now } 
    }).sort({ deadline: 1 });
  } catch (error) {
    console.error('Error fetching upcoming tasks in tool:', error);
    return [];
  }
};

export const getTaskById = async (taskId, userId) => {
  try {
    return await taskService.getTaskById(taskId, userId);
  } catch (error) {
    console.error('Error fetching task by ID in tool:', error);
    return null;
  }
};

export const createTask = async (userId, taskData) => {
  try {
    return await taskService.createTask(userId, taskData);
  } catch (error) {
    console.error('Error creating task in tool:', error);
    throw error;
  }
};

export const updateTask = async (taskId, userId, updates) => {
  try {
    return await taskService.updateTask(taskId, userId, updates);
  } catch (error) {
    console.error('Error updating task in tool:', error);
    throw error;
  }
};

export const deleteTask = async (taskId, userId) => {
  try {
    return await taskService.deleteTask(taskId, userId);
  } catch (error) {
    console.error('Error deleting task in tool:', error);
    throw error;
  }
};
