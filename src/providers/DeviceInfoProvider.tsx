"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DeviceInfo = {
  deviceType: "Mobile" | "Tablet" | "Desktop";
  os: string;
  userAgent: string;
};

type DeviceInfoContextValue = {
  info: DeviceInfo | null;
};

const DeviceInfoContext = createContext<DeviceInfoContextValue>({
  info: null,
});

const detectDeviceInfo = (userAgent: string): DeviceInfo => {
  const normalizedUa = userAgent.toLowerCase();

  const isTablet =
    /(ipad|tablet|kindle|silk|playbook)/i.test(userAgent) ||
    (normalizedUa.includes("android") && !/mobile/i.test(userAgent));
  const isMobile =
    !isTablet &&
    /android|iphone|ipod|windows phone|blackberry|mobile/i.test(userAgent);
  const deviceType: DeviceInfo["deviceType"] = isTablet
    ? "Tablet"
    : isMobile
    ? "Mobile"
    : "Desktop";

  let os = "Unknown";
  if (normalizedUa.includes("windows nt")) {
    os = "Windows";
  } else if (normalizedUa.includes("mac os x")) {
    os = "macOS";
  } else if (normalizedUa.includes("android")) {
    os = "Android";
  } else if (normalizedUa.includes("iphone") || normalizedUa.includes("ipad")) {
    os = "iOS";
  } else if (normalizedUa.includes("linux")) {
    os = "Linux";
  }

  return {
    deviceType,
    os,
    userAgent,
  };
};

type DeviceInfoProviderProps = {
  children: ReactNode;
};

export function DeviceInfoProvider({ children }: DeviceInfoProviderProps) {
  const [info, setInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    setInfo(detectDeviceInfo(navigator.userAgent));
  }, []);

  const value = useMemo(() => ({ info }), [info]);

  return (
    <DeviceInfoContext.Provider value={value}>
      {children}
    </DeviceInfoContext.Provider>
  );
}

export const useDeviceInfo = () => useContext(DeviceInfoContext);
