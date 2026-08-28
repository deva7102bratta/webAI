import React, { useMemo, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

import { detectDependencies } from "../utils/sandpackUtils";
import SandpackErrorMonitor from "../components/SandpackErrorMonitor.jsx";

const FullPagePreview = ({ files }) => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);

  // Convert project files into Sandpack format
  const sandpackFiles = useMemo(() => {
    if (!files) return {};

    const spfiles = {};

    for (const [path, content] of Object.entries(files)) {
      spfiles[path] = {
        code: content,
      };
    }

    return spfiles;
  }, [files]);

  // Detect dependencies from import statements
  const dependencies = useMemo(() => {
    if (!files) return {};

    try {
      return detectDependencies(files);
    } catch (error) {
      console.error("Dependency detection failed:", error);
      return {};
    }
  }, [files]);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SandpackProvider
        template="react"
        files={sandpackFiles}
        customSetup={{
          dependencies,
        }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          logLevel: 0,
        }}
      >
        {/* Error Monitor */}
        <SandpackErrorMonitor onErrorChange={setShowErrorOverlay} />

        {/* Sandpack Layout */}
        <SandpackLayout className="h-full w-full border-none bg-transparent">
          <SandpackPreview
            showNavigator={false}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
            showSandpackErrorOverlay={showErrorOverlay}
            className="h-full w-full"
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default FullPagePreview;