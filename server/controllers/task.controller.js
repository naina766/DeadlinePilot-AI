import taskService from '../services/task.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator.js';

export const taskController = {
  // GET /api/tasks
  getTasks: async (req, res) => {
    try {
      const userId = req.user.uid;
      const tasks = await taskService.getTasksForUser(userId);
      return sendSuccess(res, tasks);
    } catch (error) {
      return sendError(res, 'Failed to fetch tasks', 500, error.message);
    }
  },

  // GET /api/tasks/:id
  getTaskById: async (req, res) => {
    try {
      const userId = req.user.uid;
      const taskId = req.params.id;
      const task = await taskService.getTaskById(taskId, userId);
      
      if (!task) {
        return sendError(res, 'Task not found', 404);
      }
      return sendSuccess(res, task);
    } catch (error) {
      if (error.message === 'Forbidden') {
        return sendError(res, 'Forbidden', 403);
      }
      return sendError(res, 'Failed to fetch task', 500, error.message);
    }
  },

  // POST /api/tasks
  createTask: async (req, res) => {
    // Validate request body with Zod
    const validation = createTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 'Validation error', 400, validation.error.format());
    }

    try {
      const userId = req.user.uid;
      const task = await taskService.createTask(userId, validation.data);
      return sendSuccess(res, task, 201);
    } catch (error) {
      return sendError(res, 'Failed to create task', 500, error.message);
    }
  },

  // PUT /api/tasks/:id
  updateTask: async (req, res) => {
    // Validate request body with Zod
    const validation = updateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 'Validation error', 400, validation.error.format());
    }

    try {
      const userId = req.user.uid;
      const taskId = req.params.id;
      const task = await taskService.updateTask(taskId, userId, validation.data);

      if (!task) {
        return sendError(res, 'Task not found', 404);
      }
      return sendSuccess(res, task);
    } catch (error) {
      if (error.message === 'Forbidden') {
        return sendError(res, 'Forbidden', 403);
      }
      return sendError(res, 'Failed to update task', 500, error.message);
    }
  },

  // DELETE /api/tasks/:id
  deleteTask: async (req, res) => {
    try {
      const userId = req.user.uid;
      const taskId = req.params.id;
      const success = await taskService.deleteTask(taskId, userId);

      if (!success) {
        return sendError(res, 'Task not found', 404);
      }
      return sendSuccess(res, { message: 'Task deleted successfully' });
    } catch (error) {
      if (error.message === 'Forbidden') {
        return sendError(res, 'Forbidden', 403);
      }
      return sendError(res, 'Failed to delete task', 500, error.message);
    }
  }
};

export default taskController;
