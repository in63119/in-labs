"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminAuthContextValue = {
  isVerified: boolean;
  adminCode: string | null;
  setVerified: (code: string | null) => void;
  reset: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

type AdminAuthProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY = "adminAuthCode";

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [adminCode, setAdminCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAdminCode(stored);
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setAdminCode(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setVerified = useCallback((code: string | null) => {
    if (typeof window === "undefined") {
      return;
    }
    if (code) {
      window.localStorage.setItem(STORAGE_KEY, code);
      setAdminCode(code);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
      setAdminCode(null);
    }
  }, []);

  const reset = useCallback(() => {
    setVerified(null);
  }, [setVerified]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isVerified: Boolean(adminCode),
      adminCode,
      setVerified,
      reset,
    }),
    [adminCode, reset, setVerified]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
};
