import Habit from '../../models/Habit.js';
import User from '../../models/User.js';

export const getHabitChecklist = async (userId) => {
  try {
    return await Habit.find({ userId });
  } catch (error) {
    console.error('Error fetching habit checklist in tool:', error);
    return [];
  }
};

export const getUserProfileHabits = async (userId) => {
  try {
    const user = await User.findOne({ firebaseUID: userId });
    return user?.settings?.habits || { avgCompletionSpeed: 1.0, delayRatio: 0.15 };
  } catch (error) {
    console.error('Error fetching profile habits in tool:', error);
    return { avgCompletionSpeed: 1.0, delayRatio: 0.15 };
  }
};

export const createHabit = async (userId, title, frequency = 'daily') => {
  try {
    return await Habit.create({
      userId,
      title,
      frequency,
      streak: 0,
      completedDates: []
    });
  } catch (error) {
    console.error('Error creating habit in tool:', error);
    throw error;
  }
};

export const completeHabit = async (habitId, userId) => {
  try {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyDone = habit.completedDates.some(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });

    if (!alreadyDone) {
      habit.completedDates.push(today);
      habit.streak += 1;
      await habit.save();
    }
    return habit;
  } catch (error) {
    console.error('Error completing habit in tool:', error);
    throw error;
  }
};
