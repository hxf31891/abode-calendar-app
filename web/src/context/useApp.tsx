// external imports
import React, { createContext, useContext, useState } from "react";

// types
import { User } from "types/user";
import { ErrorProps } from "types/general";
import { AppWrapperProps, AppContextProps } from "types/context";

const AppContext = createContext<AppContextProps | null>(null);

/**
 * Wrapper that provides shared state to various components accross the app. Simple alternitive to Redux
 * @param {ReactNode} children
 */
export default function AppContextWrapper({ children }: AppWrapperProps) {
  const [error, setError] = useState<ErrorProps>({});
  const [loading, setLoading] = useState<boolean>(false);
  const user = JSON.parse(localStorage.getItem("abodeCalUser") || "{}");

  const setUser = (user: User) => {
    localStorage.setItem("abodeCalUser", JSON.stringify(user));
  };

  const appContext = {
    user,
    error,
    loading,
    setUser,
    setError,
    setLoading,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}

/**
 * Hook to access context state
 * @returns {AppContextProps}
 */
export function useApp() {
  const apppContext = useContext(AppContext);

  if (!apppContext) {
    throw new Error("useApp has to be used within <AppContext.Provider>");
  }

  return apppContext;
}
