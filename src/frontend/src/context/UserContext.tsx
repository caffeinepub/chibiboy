import { type ReactNode, createContext, useContext, useState } from "react";

interface UserData {
  nombre: string;
  edad: string;
  metas: string;
}

interface UserContextValue {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

function loadUserData(): UserData {
  try {
    const stored = localStorage.getItem("chibiBoyUserData");
    if (stored) return JSON.parse(stored) as UserData;
  } catch {
    // ignore
  }
  return { nombre: "", edad: "", metas: "" };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData>(loadUserData);

  function setUserData(data: UserData) {
    localStorage.setItem("chibiBoyUserData", JSON.stringify(data));
    setUserDataState(data);
  }

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserData must be used within UserProvider");
  return ctx;
}
