import { createContext, useContext, useState } from "react";

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [reminders, setReminders] = useState([]);
  const [habits, setHabits] = useState([]);

  return (
    <AppDataContext.Provider
      value={{
        reminders,
        setReminders,
        habits,
        setHabits,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
