const GoalRepo = require('../repositories/GoalRepo');
const ErrorFactory = require('../utils/ErrorFactory');
const { buildGoalMonths, extendGoalMonths, trimGoalMonths } = require('../utils/MonthsHelper.js');

class GoalService {
  static async createGoal({ goal, userId }) {
    this.validateRequiredFields(goal)
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);
    this.#normalizeDate(startDate, endDate);

    if (startDate > endDate) {
      throw ErrorFactory.invalidDates();
    }

    // check conflict previous goals
    const goals = await GoalRepo.findByUser(userId);
    const conflict = goals.find(g =>
      g.title === goal.title &&
      ((startDate >= g.startDate && startDate <= g.endDate) ||
       (endDate >= g.startDate && endDate <= g.endDate) && !g.completed)
    );

    if (conflict) {
      const start = conflict.startDate;
      const end = conflict.endDate;
      throw ErrorFactory.duplicateGoalInRange(
        goal.title,
        `${start.getMonth() + 1}/${start.getFullYear()}`,
        `${end.getMonth() + 1}/${end.getFullYear()}`
      );
    }

    const months = buildGoalMonths(startDate, endDate);

    return await GoalRepo.create({
      userId,
      title: goal.title.trim(),
      startDate,
      endDate,
      target: goal.target,
      completed: false,
      archived: false,
      months,
      ...(goal.description?.trim() && { description: goal.description.trim() })
    });
  }
    
  static async updateGoal(goalId, updates, userId) {
    const goal = await GoalRepo.findById(goalId);
  
    if (!goal) throw new Error('Goal not found');
    if (goal.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized to edit this goal');
    }
  
    const allowedFields = ['title', 'description', 'endDate', 'target', 'completed', 'archived'];
    const updatedFields = new Set();
  
    for (const field of allowedFields) {
      const newValue = updates[field];
      if (newValue === undefined) continue;
  
      if (field === 'endDate') {
        const dateNew = new Date(newValue);
        const dateCurrent = new Date(goal.endDate);
  
        await GoalService.#normalizeDate(dateNew, dateCurrent);
  
        if (dateNew.getTime() > dateCurrent.getTime()) {
          extendGoalMonths(goal.months, dateCurrent, dateNew);
        } else if (dateNew.getTime() < dateCurrent.getTime()) {
          trimGoalMonths(goal.months, dateNew);
        }
        goal.endDate = dateNew;
        updatedFields.add('endDate');
      } else {
        if (newValue !== goal[field]) {
          goal[field] = newValue;
          updatedFields.add(field);
        }
      }
    }
  
    return GoalRepo.save(goal);
  }  

  static async toggleDay(goalId, dayDate, completed, userId) {
    dayDate = new Date(dayDate);

    if (!(dayDate instanceof Date) || isNaN(dayDate)) {
        throw ErrorFactory.invalidDates();
    }
    
    const goal = await this.#verifyAccess(goalId, userId);
    const dayNum = dayDate.getDate();
    const monthNum = dayDate.getMonth();
    const yearNum = dayDate.getFullYear();

    const month = goal.months.find(m => m.month === monthNum && m.year === yearNum);
    if (!month) {
      throw ErrorFactory.notFound(`Month not found: ${monthNum}/${yearNum}`);
    }
    const day = month.days.find(d => d.day === dayNum);
    if (!day) {
      throw ErrorFactory.notFound(`Day ${dayNum} not found in goal ${goalId}`);
    }
    day.completed = completed;

    await GoalRepo.save(goal);
    return goal;
  }

  static async calculatePercentage(goalId, userId) {
    const { days } = await this.#verifyAccess(goalId, userId);
    const percentage = days.reduce((acc, d) => acc + d.completed, 0) / days.length * 100;
    return Math.round(percentage);
  }

  static getUserGoals = (userId) => GoalRepo.findByUser(userId);

  static async getTodayGoals(userId) {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); 
    const year = today.getFullYear();
  
    const goals = await GoalRepo.findByUser(userId);
  
    const todaysGoals = goals.filter(goal => {
      return goal.months.some(m =>
        m.year === year &&
        m.month === month &&
        m.days.some(d => d.day === day)
      );
    });
  
    return todaysGoals;
  }

  static async deleteGoal(goalId, userId) {
    await this.#verifyAccess(goalId, userId);
    await GoalRepo.delete(goalId);
    return { msg: 'Goal successfully deleted' };
  }

  static async #verifyAccess(goalId, userId) {
    const goal = await GoalRepo.findById(goalId);
    if (!goal) throw ErrorFactory.notFound('Goal');
    if (goal.userId.toString() !== userId) throw ErrorFactory.unauthorized();
    return goal;
  }

  static async #normalizeDate(...dates) {
    for (const d of dates) {
      d.setHours(0, 0, 0, 0);
    }
  }
  
  static validateRequiredFields(goal) {
    if (!goal) throw ErrorFactory.missingFields('Goal data is missing');

    const { title, startDate, endDate, target } = goal;

    if (!title || typeof title !== 'string' || !title.trim()) {
      throw ErrorFactory.missingFields('Title is required');
    }

    if (!startDate || isNaN(new Date(startDate))) {
      throw ErrorFactory.invalidDates('Start date is invalid');
    }

    if (!endDate || isNaN(new Date(endDate))) {
      throw ErrorFactory.invalidDates('End date is invalid');
    }

    if (typeof target !== 'number' || isNaN(target)) {
      throw ErrorFactory.missingFields('Target must be a number');
    }
  }
}

module.exports = GoalService;