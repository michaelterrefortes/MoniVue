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

export const formatPlotData = (localSpending, selectedDate) => {
  const weeklyTotals = new Map();

  const year = new Date(selectedDate).getFullYear();
  const month = new Date(selectedDate).getMonth();

  //const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();

  // Loop through weeks in 7-day increments
  for (let i = 1; i <= numDays; i += 7) {
    const start = i;
    const end = Math.min(i + 6, numDays);
    const key = `${start}-${end}`;
    weeklyTotals.set(key, 0); // Initialize with empty array
    //console.log(weeklyTotals);
  }

  //console.log(weeklyTotals);

  localSpending.forEach((t) => {
    const day = new Date(t.date_spending).getDate();
    // Determine 7-day bucket (1-7, 8-14, 15-21, 22-31)
    const weekBucket = Math.ceil(day / 7);
    const startDay = (weekBucket - 1) * 7 + 1;
    let endDay = weekBucket * 7;

    // Adjust end day for last week of month
    const lastDayOfMonth = new Date(
      new Date(t.date_spending).getFullYear(),
      new Date(t.date_spending).getMonth() + 1,
      0,
    ).getDate();
    if (endDay > lastDayOfMonth) endDay = lastDayOfMonth;

    const label = `${startDay}-${endDay}`;

    weeklyTotals.set(label, (weeklyTotals.get(label) || 0) + t.amount);
  });

  //console.log("aqui", JSON.stringify(Object.fromEntries(weeklyTotals)));

  const arrayTotals = Array.from(weeklyTotals, ([label, value]) => ({
    label,
    value,
    //frontColor: value !== 0 ? "#d3ff00" : "#d1d5db",
    //gradientColor: value !== 0 ? "#12ff00" : "#d1d5db",
  }));

  //console.log(arrayTotals);

  return arrayTotals;
};

export const formatWeeklyData = (weeklySpending) => {
  //console.log(weeklySpending);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  let summaryWeekly = [
    { label: "Mon", value: 0 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 0 },
    { label: "Thu", value: 0 },
    { label: "Fri", value: 0 },
    { label: "Sat", value: 0 },
    { label: "Sun", value: 0 },
  ];

  for (const purchase of weeklySpending) {
    const purchaseDate = new Date(purchase.date_spending).toLocaleDateString(
      "en-US",
      { weekday: "short" },
    );

    const index = dayNames.indexOf(purchaseDate);

    summaryWeekly[index].value += purchase.amount;
  }

  //console.log(summaryWeekly);

  return summaryWeekly;
};

export const formatYearly = (yearlySpending) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let summaryMonths = [
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 0 },
    { label: "May", value: 0 },
    { label: "Jun", value: 0 },
    { label: "Jul", value: 0 },
    { label: "Aug", value: 0 },
    { label: "Sep", value: 0 },
    { label: "Oct", value: 0 },
    { label: "Nov", value: 0 },
    { label: "Dec", value: 0 },
  ];

  for (const month of yearlySpending) {
    const monthElement = new Date(month.month_start).toLocaleDateString(
      "en-US",
      { month: "short" },
    );

    const index = monthNames.indexOf(monthElement);

    summaryMonths[index].value += month.total_sum;
  }

  //console.log(summaryWeekly);

  console.log("en format year data", yearlySpending);

  return summaryMonths;
};
