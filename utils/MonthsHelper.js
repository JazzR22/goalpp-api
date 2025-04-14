const buildGoalMonths = (startDate, endDate) => {
  const months = [];
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  const endMonthDate = new Date(endYear, endMonth, 1);

  for (
    let current = new Date(startYear, startMonth, 1);
    current <= endMonthDate;
    current.setMonth(current.getMonth() + 1)
  ) {
    const year = current.getFullYear();
    const month = current.getMonth();

    const isFirst = year === startYear && month === startMonth;
    const isLast = year === endYear && month === endMonth;

    const firstDay = isFirst ? startDate.getDate() : 1;
    const lastDay = isLast
      ? endDate.getDate()
      : new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: lastDay - firstDay + 1 }, (_, i) => ({
      day: firstDay + i,
      completed: false,
    }));

    months.push({ month, year, completed: false, days });
  }

  return months;
};

const extendGoalMonths = (months, prevEndDate, newEndDate) => {
  const lastMonth = months[months.length - 1];
  const lastDayNum = prevEndDate.getDate();
  const newLastDayNum = newEndDate.getDate();
  const newLastYearNum = newEndDate.getFullYear();
  const newLastMonthNum = newEndDate.getMonth();

  // SAME MONTH: only extend days
  if (
    prevEndDate.getMonth() === newLastMonthNum &&
    prevEndDate.getFullYear() === newLastYearNum
  ) {
    for (let d = lastDayNum + 1; d <= newLastDayNum; d++) {
      lastMonth.days.push({ day: d, completed: false });
    }
    return;
  }

  // STEP 1: complete the current last month
  const fullLastMonthDays = new Date(lastMonth.year, lastMonth.month + 1, 0).getDate();
  for (let d = lastMonth.days.length + 1; d <= fullLastMonthDays; d++) {
    lastMonth.days.push({ day: d, completed: false });
  }

  // STEP 2: add new months
  const newEndMonthDate = new Date(newLastYearNum, newLastMonthNum, 1);

  for (
    let cursor = new Date(lastMonth.year, lastMonth.month + 1, 1);
    cursor <= newEndMonthDate;
    cursor.setMonth(cursor.getMonth() + 1)
  ) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();

    const isLast = month === newLastMonthNum && year === newLastYearNum;
    const lastDay = isLast
      ? newLastDayNum
      : new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: lastDay }, (_, i) => ({
      day: i + 1,
      completed: false,
    }));

    months.push({ month, year, completed: false, days });
  }
};

module.exports = { buildGoalMonths, extendGoalMonths };
