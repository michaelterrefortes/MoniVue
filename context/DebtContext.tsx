import { createContext, useState } from "react";
import { useColorScheme } from "react-native";

export const DebtContext = createContext();

export function DebtProvider({ children }) {
  const colorScheme = useColorScheme();

  const [debts, setDebts] = useState([]);
  const [bills, setBills] = useState([]);
  const [spending, setSpending] = useState([]);
  const [localSpending, setLocalSpending] = useState([]);
  const [totalBills, setTotalBills] = useState(0);
  const [totalDebts, setTotalDebts] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalCreditMinimum, setTotalCreditMinimum] = useState(0);
  const [localTotalSpending, setLocalTotalSpending] = useState(0);
  const [weekly, setWeekly] = useState([]);
  const [yearSummary, setYearSpending] = useState([]);

  return (
    <DebtContext.Provider
      value={{
        debts,
        setDebts,
        bills,
        setBills,
        totalBills,
        setTotalBills,
        totalDebts,
        setTotalDebts,
        spending,
        setSpending,
        totalSpending,
        setTotalSpending,
        totalCreditMinimum,
        setTotalCreditMinimum,
        localSpending,
        setLocalSpending,
        localTotalSpending,
        setLocalTotalSpending,
        weekly,
        setWeekly,
        yearSummary,
        setYearSpending,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
}
