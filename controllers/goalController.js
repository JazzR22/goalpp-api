const GoalService = require('../services/GoalService');

exports.createGoal = async (req, res, next) => {
  const { title, startDate, endDate } = req.body;
  const userId = req.user;

  try {
    const goal = await GoalService.createGoal({ userId, title, startDate, endDate });
    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
};

exports.toggleDay = async (req, res, next) => {  
  const { id: goalId } = req.params;
  const { day, completed } = req.body;
  const userId = req.user;

  try {
    const goal = await GoalService.toggleDay(goalId, day, completed, userId);
    res.json({ goal });
  } catch (err) {
    next(err);
  }
};

exports.calculatePercentage = async (req, res, next) => {
  const { id: goalId } = req.params;
  const userId = req.user;

  try {
    const percentage = await GoalService.calculatePercentage(goalId, userId);
    res.json({ percentage });
  } catch (err) {
    next(err);
  }
};

exports.getUserGoals = async (req, res, next) => {
  const userId = req.user;

  try {
    const goals = await GoalService.getUserGoals(userId);
    res.json(goals);
  } catch (err) {
    next(err);
  }
};

exports.deleteGoal = async (req, res, next) => {
  const { id: goalId } = req.params;
  const userId = req.user;

  try {
    const result = await GoalService.deleteGoal(goalId, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.extendGoalRange = async (req, res, next) => {
  const { id: goalId } = req.params;
  const { endDate } = req.body;
  const userId = req.user;

  try {
    const result = await GoalService.extendGoalRange(goalId, endDate, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getTodayGoals = async (req, res, next) => {
  const userId = req.user;

  try {
    const goals = await GoalService.getTodayGoals(userId);
    res.json(goals);
  } catch (err) {
    next(err);
  }
};

// TODO
// router.patch('/:id/title', goalController.updateTitle); // Rename goal
// router.patch('/:id/end', goalController.markEnded); // Set goal as ended
// View completion % and other stats
