import { url } from "../constants/url";

export const fetchBills = async () => {
  const response = await fetch(`${url}/bills`);
  const result = await response.json();
  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to fetch bills", response.statusText);
  }
  //console.log(result);
  return result;
};

export const fetchSpending = async (date = null) => {
  let month = 0;
  let year = 0;
  if (date === null) {
    let date2 = new Date();
    month = date2.getMonth() + 1;

    year = date2.getFullYear();
  } else {
    month = date.getMonth() + 1;

    year = date.getFullYear();
  }

  //console.log(month, year);

  const response = await fetch(`${url}/spending/${month}_${year}`);
  //console.log(date);
  const result = await response.json();

  console.log(result);

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to fetch spending", response.statusText);
  }
  //console.log(result);
  return result;
};

export const fetchCredit = async () => {
  const response = await fetch(`${url}/credit`);
  const result = await response.json();
  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to fetch credit cards", response.statusText);
  }
  //console.log(result);
  return result;
};

export const addCreditCard = async (
  name,
  balance,
  limit,
  apr,
  minimum,
  date,
) => {
  const response = await fetch(`${url}/credit/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credit_name: name,
      balance: balance,
      credit_limit: limit,
      apr: apr,
      minimum: minimum,
      statement_date: date.getDate(),
    }),
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to save credit cards", response.statusText);
  }

  const result = response.json();

  return result;
};

export const addBills = async (name, variation, price, type, date) => {
  const response = await fetch(`${url}/bills/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bill_name: name,
      type_bill: type,
      price: price,
      variable: variation,
      payment_date: date.getDate(),
    }),
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to save bill", response.statusText);
  }

  const result = response.json();

  return result;
};

export const addSpending = async (name, amount, type, date) => {
  const response = await fetch(`${url}/spending/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      spending_name: name,
      type_spending: type,
      amount: amount,
      spending_date: date,
    }),
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to save spending", response.statusText);
  }

  const result = response.json();

  return result;
};

export const fetchTotals = async () => {
  const bills = await fetchBills();
  const debts = await fetchCredit();
  const spending = await fetchSpending();

  const totalBills = bills.reduce((acc, curr) => acc + curr.price, 0);
  const totalDebts = debts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalSpending = spending.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMinimum = debts.reduce((acc, curr) => acc + curr.minimum, 0);

  return {
    bills: totalBills,
    debts: totalDebts,
    spending: totalSpending,
    minimum: totalMinimum,
  };
};
