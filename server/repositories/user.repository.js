import { BaseRepository } from './base.repository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByUid(uid) {
    return this.findOne({ firebaseUID: uid });
  }
}

export const userRepository = new UserRepository();
export default userRepository;
