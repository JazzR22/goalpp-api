const Goal = require('../models/Goal');

// Create a new goal
const create = async (goalData) => {
  return await Goal.create(goalData);
};

// Find all goals for a specific user
const findByUser = async (userId) => {
  return await Goal.find({ userId });
};

// Find a goal by its ID
const findById = async (goalId) => {
  return await Goal.findById(goalId);
};

// Save a modified goal document
const save = async (goal) => {
  return await goal.save();
};

// Delete a goal by ID
const deleteGoal = async (goalId) => {
  return await Goal.findByIdAndDelete(goalId);
};

module.exports = {
  create,
  findByUser,
  findById,
  save,
  delete: deleteGoal,
};
