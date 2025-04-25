const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const goalController = require('../controllers/goalController');

// All routes below are protected
router.use(auth);

router.post('/', goalController.createGoal);
router.patch('/:id', goalController.updateGoal)
router.get('/all', goalController.getUserGoals);
router.delete('/:id', goalController.deleteGoal);
router.put('/:id/day', goalController.toggleDay);
router.get('/:id/percentage', goalController.calculatePercentage);
router.put('/:id/updateGoal', goalController.extendGoalRange);
router.get('/today', goalController.getTodayGoals);

module.exports = router;
