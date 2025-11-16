import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sidenav_collapsed";

export const useSideNavCollasped = () => {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (saved !== null) setCollapsed(saved === "true");
    } catch {
      // ignore read errors
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // ignore write errors
    }
  }, [collapsed]);

  const toggle = useCallback(() => setCollapsed(v => !v), []);

  return { collapsed, toggle, setCollapsed };
};
