import Task from '../../models/Task.js';

export const getTasksByUser = async (userId) => {
  try {
    return await Task.find({ userId });
  } catch (error) {
    console.error('Error fetching user tasks in tool:', error);
    return [];
  }
};
