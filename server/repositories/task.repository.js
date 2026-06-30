import { BaseRepository } from './base.repository.js';
import Task from '../models/Task.js';

class TaskRepository extends BaseRepository {
  constructor() {
    super(Task);
  }

  async findByUserId(userId) {
    return this.find({ userId });
  }

  async findScheduled(userId) {
    return this.find({ 
      userId, 
      scheduledStart: { $ne: null }, 
      scheduledEnd: { $ne: null } 
    });
  }
}

export const taskRepository = new TaskRepository();
export default taskRepository;
