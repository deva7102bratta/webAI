import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";

import { detectDependencies } from "../utils/sandpackUtils.js";
import { useAppContext } from "../contexts/AppContext";
import SandpackErrorMonitor from "../components/SandpackErrorMonitor.jsx";


// ======================================================
// Sandpack File Watcher
// ======================================================

function SandpackFileWatcher({ onLiveFilesChange }) {
  const { sandpack } = useSandpack();
  const { files } = sandpack;

  const {
    activeProject,
    updateProjectFiles,
  } = useAppContext();

  const activeProjectRef = useRef(activeProject);
  const lastFilesRef = useRef("");


  // Keep active project reference updated
  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);


  // Watch Sandpack files
  useEffect(() => {
    const project = activeProjectRef.current;

    if (!project || !files) {
      return;
    }

    const updatedFiles = {};
    let hasChanges = false;


    for (const [path, fileObj] of Object.entries(files)) {
      const fileCode =
        typeof fileObj === "string"
          ? fileObj
          : fileObj?.code || "";

      updatedFiles[path] = fileCode;


      const originalFile = project.files?.[path];

      const originalContent =
        typeof originalFile === "string"
          ? originalFile
          : originalFile?.content;


      if (
        originalContent !== undefined &&
        originalContent !== fileCode
      ) {
        hasChanges = true;
      }
    }


    const serializedFiles =
      JSON.stringify(updatedFiles);


    // Prevent duplicate updates
    if (lastFilesRef.current === serializedFiles) {
      return;
    }


    lastFilesRef.current = serializedFiles;


    // Update live state
    onLiveFilesChange(updatedFiles);


    // Save to database
    if (hasChanges) {
      updateProjectFiles(updatedFiles);
    }

  }, [
    files,
    onLiveFilesChange,
    updateProjectFiles,
  ]);


  return null;
}


// ======================================================
// Preview Panel
// ======================================================

const PreviewPanel = ({
  project,
  activeFile,
  showCode,
}) => {

  const [
    showErrorOverlay,
    setShowErrorOverlay,
  ] = useState(true);


  const [
    liveFiles,
    setLiveFiles,
  ] = useState(project?.files || {});


  const projectKey =
    `${project?._id}-${project?.version}`;


  const previousProjectKey = useRef(projectKey);


  // ====================================================
  // Reset files when project changes
  // ====================================================

  useEffect(() => {

    if (
      previousProjectKey.current !== projectKey
    ) {
      previousProjectKey.current = projectKey;

      setLiveFiles(
        project?.files || {}
      );
    }

  }, [
    projectKey,
    project?.files,
  ]);


  // ====================================================
  // Receive live Sandpack changes
  // ====================================================

  const handleLiveFilesChange = useCallback(
    (newFiles) => {

      setLiveFiles((previousFiles) => {

        const previousSerialized =
          JSON.stringify(previousFiles);

        const newSerialized =
          JSON.stringify(newFiles);


        if (
          previousSerialized ===
          newSerialized
        ) {
          return previousFiles;
        }


        return newFiles;
      });

    },
    []
  );


  // ====================================================
  // Convert files to Sandpack format
  // ====================================================

  const sandpackFiles = useMemo(() => {

    const files = {};


    for (
      const [path, content]
      of Object.entries(liveFiles || {})
    ) {

      const code =
        typeof content === "string"
          ? content
          : content?.content || "";


      files[path] = {
        code,
        active: path === activeFile,
      };
    }


    return files;

  }, [
    liveFiles,
    activeFile,
  ]);


  // ====================================================
  // Detect dependencies
  // ====================================================

  const dependencies = useMemo(() => {

    try {
      return detectDependencies(
        liveFiles
      );
    } catch (error) {

      console.error(
        "Dependency detection failed:",
        error
      );

      return {};
    }

  }, [liveFiles]);


  // ====================================================
  // Render
  // ====================================================

  return (
    <div className="h-full w-full overflow-hidden">

      <SandpackProvider
        key={projectKey}
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

          classes: {
            "sp-wrapper": "sp-wrapper",
            "sp-layout": "sp-layout",
            "sp-preview": "sp-preview",
          },

          logLevel: 0,
        }}

        theme={{
          colors: {
            surface1: "#ffffff",
            surface2: "#f4f4f5",
            surface3: "#e4e4e7",

            clickable: "#71717a",
            base: "#09090b",
            disabled: "#a1a1aa",
            hover: "#18181b",
            accent: "#18181b",

            error: "#ef4444",
            errorSurface: "#fef2f2",
          },

          font: {
            body:
              "'Urbanist', system-ui, -apple-system, sans-serif",

            mono:
              "'Geist Mono', ui-monospace, monospace",

            size: "13px",
            lineHeight: "1.6",
          },
        }}
      >

        {/* ============================================
            Error Monitor
        ============================================ */}

        <SandpackErrorMonitor
          onErrorChange={
            setShowErrorOverlay
          }
        />


        {/* ============================================
            File Watcher
        ============================================ */}

        <SandpackFileWatcher
          onLiveFilesChange={
            handleLiveFilesChange
          }
        />


        {/* ============================================
            Sandpack Layout
        ============================================ */}

        <SandpackLayout
          style={{
            height: "100%",
            width: "100%",
            border: "none",
            borderRadius: 0,
            background: "transparent",
            overflow: "hidden",
          }}
        >

          {/* Code Editor */}

          {showCode && (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent

              style={{
                height: "100%",
                flex: 1,
                minWidth: 0,
              }}
            />
          )}


          {/* Preview */}

          <SandpackPreview
            showNavigator={false}
            showRefreshButton
            showOpenInCodeSandbox={false}

            showSandpackErrorOverlay={
              showErrorOverlay
            }

            style={{
              height: "100%",
              flex: showCode ? 1 : 2,
              minWidth: 0,
            }}
          />

        </SandpackLayout>

      </SandpackProvider>

    </div>
  );
};


export default PreviewPanel;