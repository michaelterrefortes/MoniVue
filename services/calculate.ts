export const calculateInterest = (
  balance: number,
  apr: number,
  minimum: number,
) => {
  //console.log(balance, apr, minimum);

  const aprMonthly = apr / 100 / 12;
  let months = 0;
  let interest = 0;
  let totalInterest = 0;

  //console.log("aqui");

  while (balance > 0) {
    interest = balance * aprMonthly;
    totalInterest += interest;

    balance += interest;
    balance -= minimum;
    months += 1;
    //console.log("aqui", months);
  }
  //console.log(interest, months);

  return { interest: totalInterest.toFixed(2), months: months };
};
