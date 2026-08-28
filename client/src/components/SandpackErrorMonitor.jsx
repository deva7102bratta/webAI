import React, { useEffect } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";

const SandpackErrorMonitor = ({ onErrorChange }) => {
  const { sandpack } = useSandpack();

  useEffect(() => {
    try {
      // Safely check Sandpack state
      const error =
        sandpack?.error ??
        sandpack?.state?.error ??
        null;

      if (!error) {
        onErrorChange(true);
        return;
      }

      const message =
        typeof error === "string"
          ? error
          : error?.message || "";

      const normalizedMessage = message.toLowerCase();

      const isNetworkError =
        normalizedMessage.includes("failed to fetch") ||
        normalizedMessage.includes("csbops.io") ||
        normalizedMessage.includes("err_connection_timed_out") ||
        normalizedMessage.includes("net::err") ||
        normalizedMessage.includes("networkerror") ||
        normalizedMessage.includes("network error");

      if (isNetworkError) {
        // Hide Sandpack's overlay for network errors
        onErrorChange(false);
      } else {
        // Keep overlay for real code/runtime errors
        onErrorChange(true);
      }
    } catch (err) {
      // Never let the error monitor crash the Builder
      console.error("SandpackErrorMonitor:", err);

      onErrorChange(true);
    }
  }, [sandpack, onErrorChange]);

  return null;
};

export default SandpackErrorMonitor;