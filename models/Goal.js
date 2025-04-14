const mongoose = require('mongoose');
const { Schema } = mongoose;

const DaySchema = new Schema({
  day: { type: Number, required: true }, // 1 - 31
  completed: { type: Boolean, default: false }
}, { _id: false });

const MonthSchema = new Schema({
  month: { type: Number, required: true }, // 0 = January
  year: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  days: { type: [DaySchema], default: [] }
}, { _id: false });

const GoalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  months: { type: [MonthSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);