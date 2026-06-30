import { BaseRepository } from './base.repository.js';
import Reminder from '../models/Reminder.js';

class ReminderRepository extends BaseRepository {
  constructor() {
    super(Reminder);
  }

  async findByUserId(userId) {
    return this.find({ userId });
  }

  async findUndelivered(userId) {
    return this.find({ userId, delivered: false });
  }
}

export const reminderRepository = new ReminderRepository();
export default reminderRepository;
