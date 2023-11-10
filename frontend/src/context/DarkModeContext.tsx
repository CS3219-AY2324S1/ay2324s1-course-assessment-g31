import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

interface DarkModeProviderProps {
  children: ReactNode;
}

interface DarkModeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (newState: boolean) => void;
}

export const DarkModeContext = createContext<DarkModeContextType>({
  isDarkMode: false,
  setIsDarkMode: (newState: boolean) => {},
});

export function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.theme === "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(isDarkMode ? "light" : "dark");
    root.classList.add(isDarkMode ? "dark" : "true");

    // save theme to local storage
    localStorage.setItem("theme", isDarkMode ? "dark" : "true");
  }, [isDarkMode]);

  const value = useMemo(
    () => ({ isDarkMode, setIsDarkMode }),
    [isDarkMode, setIsDarkMode],
  );

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}
