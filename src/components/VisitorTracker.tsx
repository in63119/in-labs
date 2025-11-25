"use client";

import { useEffect, useRef } from "react";
import { ensureVisit } from "@/lib/visitorClient";

export default function VisitorTracker() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const controller = new AbortController();
    const urlPath = `${window.location.pathname}${window.location.search}`;
    if (urlPath.length === 0) {
      return;
    }

    void ensureVisit(controller.signal, urlPath);

    return () => controller.abort();
  }, []);

  return null;
}
