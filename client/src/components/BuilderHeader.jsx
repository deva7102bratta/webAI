import React from "react";
import {
  ArrowLeftIcon,
  EyeIcon,
  Code2Icon,
  ExternalLinkIcon,
  Loader2Icon,
  GlobeIcon,
  DownloadIcon,
} from "lucide-react";

import logo from "../assets/logo.svg";

const BuilderHeader = ({
  projectName,
  version,
  showCode,
  publishing,
  onToggleShowCode,
  onOpenPreview,
  onPublish,
  onDownload,
  onBack,
  onLogout,
}) => {
  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-3 border-b border-zinc-200 bg-white">

      {/* LEFT */}
      <div className="flex items-center gap-2 min-w-0">

        <button
          onClick={onBack}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 cursor-pointer"
        >
          <ArrowLeftIcon size={16} />
        </button>

        <img
          src={logo}
          alt="Logo"
          className="size-5"
        />

        <span className="text-sm font-semibold truncate max-w-38 md:max-w-50">
          {projectName}
        </span>

        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 font-medium">
          v{version}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1.5">

        {/* Code / Preview */}
        <button
          onClick={onToggleShowCode}
          className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200 text-xs font-medium rounded-lg cursor-pointer ${
            showCode
              ? "bg-zinc-100 text-zinc-900"
              : "bg-white text-zinc-600"
          } hover:bg-zinc-100 hover:text-zinc-900`}
        >
          {showCode ? (
            <>
              <EyeIcon size={13} />
              Preview
            </>
          ) : (
            <>
              <Code2Icon size={13} />
              Code
            </>
          )}
        </button>

        {/* Open Preview */}
        <button
          onClick={onOpenPreview}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white"
        >
          <ExternalLinkIcon size={13} />
          Open Preview
        </button>

        {/* Publish */}
        <button
          onClick={onPublish}
          disabled={publishing}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white disabled:opacity-50"
        >
          {publishing ? (
            <Loader2Icon
              size={13}
              className="animate-spin"
            />
          ) : (
            <GlobeIcon size={13} />
          )}

          Publish
        </button>

        {/* Export */}
        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white"
        >
          <DownloadIcon size={13} />
          Export
        </button>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white"
        >
          Sign Out
        </button>

      </div>
    </header>
  );
};

export default BuilderHeader;