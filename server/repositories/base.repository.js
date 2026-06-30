export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async find(filter = {}, sort = null) {
    let query = this.model.find(filter);
    if (sort) {
      query = query.sort(sort);
    }
    return query;
  }

  async findOne(filter = {}) {
    return this.model.findOne(filter);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}
