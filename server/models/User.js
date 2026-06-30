import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true, index: true, alias: 'uid' },
  name: { type: String, default: '' },
  email: { type: String, required: true, index: true },
  photoURL: { type: String, default: '' },
  timezone: { type: String, default: 'UTC' },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  productivityScore: { type: Number, default: 70 },
  streak: { type: Number, default: 0 },
  settings: {
    workStart: { type: String, default: '09:00' },
    workEnd: { type: String, default: '17:00' },
    sleepStart: { type: String, default: '23:00' },
    sleepEnd: { type: String, default: '07:00' },
    classes: [
      {
        name: String,
        days: [Number],
        start: String,
        end: String
      }
    ],
    habits: {
      avgCompletionSpeed: { type: Number, default: 1.0 },
      delayRatio: { type: Number, default: 0.15 }
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

// Virtuals for backwards compatibility with legacy properties
UserSchema.virtual('workStart').get(function() {
  return this.settings?.workStart;
}).set(function(val) {
  this.settings = this.settings || {};
  this.settings.workStart = val;
});

UserSchema.virtual('workEnd').get(function() {
  return this.settings?.workEnd;
}).set(function(val) {
  this.settings = this.settings || {};
  this.settings.workEnd = val;
});

UserSchema.virtual('sleepStart').get(function() {
  return this.settings?.sleepStart;
}).set(function(val) {
  this.settings = this.settings || {};
  this.settings.sleepStart = val;
});

UserSchema.virtual('sleepEnd').get(function() {
  return this.settings?.sleepEnd;
}).set(function(val) {
  this.settings = this.settings || {};
  this.settings.sleepEnd = val;
});

UserSchema.virtual('classes').get(function() {
  return this.settings?.classes || [];
}).set(function(val) {
  this.settings = this.settings || {};
  this.settings.classes = val;
});

UserSchema.virtual('habits').get(function() {
  return this.settings?.habits || { avgCompletionSpeed: 1.0, delayRatio: 0.15 };
}).set(function(val) {
  this.settings = this.settings || {};
  this.settings.habits = val;
});

const User = mongoose.model('User', UserSchema);

export default User;
export { User };
