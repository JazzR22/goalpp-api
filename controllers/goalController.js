const GoalService = require('../services/GoalService');

exports.createGoal = async (req, res, next) => {

  const goal = req.body;
  const userId = req.user;

  try {
    const createdGoal = await GoalService.createGoal({ goal, userId });
    res.status(201).json(createdGoal);
  } catch (err) {
    next(err);
  }
};

exports.updateGoal = async (req, res, next) => {
  const { id: goalId } = req.params
  const updates = req.body
  const userId = req.user


  console.log(req);
  try {
    const updatedGoal = await GoalService.updateGoal(goalId, updates, userId)
    res.json({ goal: updatedGoal })
  } catch (err) {
    next(err)
  }
}

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

exports.getTodayGoals = async (req, res, next) => {
  const userId = req.user;

  try {
    const goals = await GoalService.getTodayGoals(userId);
    res.json(goals);
  } catch (err) {
    next(err);
  }
};