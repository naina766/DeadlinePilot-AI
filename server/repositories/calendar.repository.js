import { BaseRepository } from './base.repository.js';
import CalendarEvent from '../models/CalendarEvent.js';

class CalendarRepository extends BaseRepository {
  constructor() {
    super(CalendarEvent);
  }

  async findByUserId(userId) {
    return this.find({ userId });
  }
}

export const calendarRepository = new CalendarRepository();
export default calendarRepository;
