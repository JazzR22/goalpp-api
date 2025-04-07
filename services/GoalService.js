const GoalRepo = require('../repositories/GoalRepo');
const ErrorFactory = require('../utils/ErrorFactory');
const { buildGoalMonths, extendGoalMonths } = require('../utils/MonthsHelper.js');

class GoalService {
  static async createGoal({ userId, title, startDate, endDate }) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    this.#normalizeDate(startDate, endDate);

    if (startDate > endDate) {
      throw ErrorFactory.invalidDates();
    }

    const goals = await GoalRepo.findByUser(userId);
    const conflict = goals.find(g =>
      g.title === title &&
      ((startDate >= g.startDate && startDate <= g.endDate) ||
       (endDate >= g.startDate && endDate <= g.endDate))
    );

    if (conflict) {
      const start = conflict.startDate;
      const end = conflict.endDate;
      throw ErrorFactory.duplicateGoalInRange(
        title,
        `${start.getMonth() + 1}/${start.getFullYear()}`,
        `${end.getMonth() + 1}/${end.getFullYear()}`
      );
    }

    const months = buildGoalMonths(startDate, endDate);

    return await GoalRepo.create({
      userId,
      title,
      startDate,
      endDate,
      completed: false,
      months
    });
  }

  static async extendGoalRange(goalId, newEnd, userId) {
    newEnd = new Date(newEnd);

    if (!(newEnd instanceof Date)) {
      throw ErrorFactory.invalidDates();
    }

    const today = new Date();
    const goal = await this.#verifyAccess(goalId, userId);
    this.#normalizeDate(newEnd, today, goal.endDate);

    if (newEnd <= goal.endDate || newEnd <= today) {
      throw ErrorFactory.invalidDates();
    }

    extendGoalMonths(goal.months, goal.endDate, newEnd);
    goal.endDate = newEnd;

    await GoalRepo.save(goal);
    return { msg: 'Goal updated successfully' };
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
    month.completed = month.days.every(d => d.completed);

    if (month.completed) {
      goal.completed = goal.months.every(m => m.completed);
    }

    await GoalRepo.save(goal);
    return goal;
  }

  static async calculatePercentage(goalId, userId) {
    const { days } = await this.#verifyAccess(goalId, userId);
    const percentage = days.reduce((acc, d) => acc + d.completed, 0) / days.length * 100;
    return Math.round(percentage);
  }

  static getUserGoals = (userId) => GoalRepo.findByUser(userId);

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
}

module.exports = GoalService;
