import { BaseRepository } from './base.repository.js';
import Analytics from '../models/Analytics.js';

class AnalyticsRepository extends BaseRepository {
  constructor() {
    super(Analytics);
  }

  async findByUserId(userId) {
    return this.find({ userId });
  }

  async findByDate(userId, date) {
    return this.findOne({ userId, date });
  }
}

export const analyticsRepository = new AnalyticsRepository();
export default analyticsRepository;
