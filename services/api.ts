import { Alert } from "react-native";
import { url } from "../constants/url";
import { getAccessToken } from "./auth";

export const fetchBills = async () => {
  const token = await getAccessToken();

  const response = await fetch(`${url}/bills`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    // @ts-ignore
    //console.log(response);
    //throw new Error("Failed to fetch bills", response.statusText);
    Alert.alert("Error", result.error);
    return [];
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

  const token = await getAccessToken();

  const response = await fetch(`${url}/spending/${month}_${year}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  //console.log(date);
  const result = await response.json();

  //console.log(result);

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to fetch spending", response.statusText);
    Alert.alert("Error", result.error);
    return [];
  }
  //console.log(result);
  return result;
};

export const fetchSpendingWeek = async (start, end) => {
  //console.log(month, year);
  const token = await getAccessToken();
  const response = await fetch(`${url}/spending/week/${start}_${end}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  //console.log(date);
  const result = await response.json();

  //console.log(result);

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to fetch spending", response.statusText);
    Alert.alert("Error", result.error);
    return [];
  }
  //console.log(result);
  return result;
};

export const fetchSpendingYear = async (year) => {
  //console.log(month, year);
  const token = await getAccessToken();
  const response = await fetch(`${url}/spending/year/${year}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  //console.log(date);
  const result = await response.json();

  //console.log(result);

  //console.log(result);

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to fetch spending", response.statusText);
    Alert.alert("Error", result.error);
    return [];
  }
  //console.log(result);
  return result;
};

export const fetchCredit = async () => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/credit`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to fetch credit cards", response.statusText);
    Alert.alert("Error", result.error);
    return [];
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
  const token = await getAccessToken();
  const response = await fetch(`${url}/credit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

  const result = await response.json();

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to save credit cards", response.statusText);
    //Alert.alert("Error", result.error);
    return { success: false, error: result.error };
  }

  return result;
};

export const editCreditCard = async (
  id,
  name,
  balance,
  limit,
  apr,
  minimum,
  date,
) => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/credit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: id,
      credit_name: name,
      balance: balance,
      credit_limit: limit,
      apr: apr,
      minimum: minimum,
      statement_date: date.getDate(),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to edit credit", response.statusText);
    //Alert.alert("Error", result.error);
    return { success: false, error: result.error };
  }

  return result;
};

export const addBills = async (name, variation, price, type, date) => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/bills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bill_name: name,
      type_bill: type,
      price: price,
      variable: variation,
      payment_date: date.getDate(),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to save bill", response.statusText);
    //Alert.alert("Error", result.error);
    return { success: false, error: result.error };
  }

  return result;
};

export const editBills = async (id, name, variation, price, type, date) => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/bills`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: id,
      bill_name: name,
      type_bill: type,
      price: price,
      variable: variation,
      payment_date: date.getDate(),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to edit bill", response.statusText);

    //Alert.alert("Error", result.error);
    return { success: false, error: result.error };
  }

  return result;
};

export const addSpending = async (name, amount, type, date) => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/spending`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      spending_name: name,
      type_spending: type,
      amount: amount,
      spending_date: date,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to save spending", response.statusText);
    //Alert.alert("Error", result.error);
    return { success: false, error: result.error };
  }

  return result;
};

export const editSpending = async (id, name, amount, type, date) => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/spending`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: id,
      spending_name: name,
      type_spending: type,
      amount: amount,
      spending_date: date,
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to edit spending", response.statusText);

    //Alert.alert("Error", result.error);
    return { success: false, error: result.error };
  }

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

export const profileProcess = async (income) => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      income: income,
    }),
  });
  const result = await response.json();

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to login", response.statusText);

    //Alert.alert("Error", result.error);
    return { success: false, error: result.error };
  }

  return result;
};

export const updateProfile = async (income) => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      income: income,
    }),
  });
  const result = await response.json();

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to login", response.statusText);
    //Alert.alert("Error", result.error);
    return { success: false, error: result.error };
  }

  return result;
};

export const fetchProfile = async () => {
  const token = await getAccessToken();
  const response = await fetch(`${url}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    // @ts-ignore
    //throw new Error("Failed to fetch profile", response.statusText);

    Alert.alert("Error", result.error);
    return [];
  }

  return result;
};
