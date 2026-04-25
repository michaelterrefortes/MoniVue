export const validateDate = (day: number) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (0=Jan, 3=Apr)

  // Get last day of current month (e.g., 30 for April, 31 for May, 28/29 for Feb)
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  // Validate or cap the day
  const validDay = Math.min(day, lastDayOfMonth);

  // Construct Date object (Month is 0-indexed, so we use month)
  const finalDate = new Date(year, month, validDay);

  const shortMonth = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(finalDate);

  //console.log(shortMonth, validDay);

  return `${shortMonth} ${validDay}`;
};

export const dateString = (date) => {
  const newDate = new Date(date);

  return `${newDate.toDateString()}`;
};

export const getMonthStats = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (Jan is 0, Feb is 1)

  // Total days: passing month + 1 and day 0 gives the last day of current month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Remaining days
  const currentDay = date.getDate();
  const remainingDays = totalDays - currentDay;

  return { totalDays, remainingDays };
};
