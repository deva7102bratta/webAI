import React from "react";
import {
  CheckCircle2Icon,
  CircleIcon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";

export default function AgentProgressDashboard({ project }) {
  const planned = project.filesPlanned || [];
  const completed = project.filesGenerated || [];
  const current = project.currentFile;
  const isFailed = project.status === "failed";

  const progress =
    planned.length > 0
      ? Math.round((completed.length / planned.length) * 100)
      : 0;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafafa] flex items-center justify-center">

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-zinc-200/40 via-white to-zinc-300/30 blur-3xl" />

        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-zinc-200/30 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-zinc-300/20 blur-3xl" />
      </div>

      {/* =====================================================
          SUBTLE GRID
      ====================================================== */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-5 md:p-10">

        <div className="w-full max-w-xl">

          {/* =================================================
              AI ICON
          ================================================== */}
          <div className="flex justify-center">

            <div className="relative flex h-20 w-20 items-center justify-center">

              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-zinc-200" />

              {/* Rotating ring */}
              <div className="absolute inset-1 rounded-full border border-transparent border-t-zinc-900 border-r-zinc-400 animate-spin" />

              {/* Inner glass */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">

                <div className="relative">

                  <SparklesIcon
                    size={21}
                    strokeWidth={1.7}
                    className="text-zinc-900"
                  />

                  <div className="absolute inset-0 animate-ping opacity-20">
                    <SparklesIcon
                      size={21}
                      strokeWidth={1.7}
                      className="text-zinc-900"
                    />
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* =================================================
              TITLE
          ================================================== */}
          <div className="mt-7 text-center">

            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-900">
              {isFailed
                ? "Generation failed"
                : project.status === "pending"
                  ? "Designing your workspace"
                  : "Building your workspace"}
            </h2>

            <p className="mt-2 text-[13px] tracking-wide text-zinc-400">
              {isFailed
                ? "Something went wrong during generation"
                : project.status === "pending"
                  ? "Analyzing requirements and planning architecture"
                  : current
                    ? `Writing ${current}`
                    : "Writing production-ready React code"}
            </p>

          </div>

          {/* =================================================
              PROGRESS
          ================================================== */}
          {!isFailed && planned.length > 0 && (
            <div className="mt-7">

              <div className="flex items-center justify-between px-1 mb-2">

                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                  Progress
                </span>

                <span className="text-[10px] font-semibold tracking-wide text-zinc-500">
                  {progress}%
                </span>

              </div>

              <div className="h-[2px] w-full overflow-hidden rounded-full bg-zinc-200">

                <div
                  className="h-full rounded-full bg-zinc-900 transition-all duration-700 ease-out"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>
          )}

          {/* =================================================
              FAILED MESSAGE
          ================================================== */}
          {isFailed && project.error && (
            <div className="mt-7 rounded-xl border border-red-100 bg-white/70 p-4 shadow-sm backdrop-blur-xl">

              <div className="flex gap-3">

                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <div className="min-w-0">

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-red-500">
                    Build Error
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 break-words">
                    {project.error}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              FILE LIST
          ================================================== */}
          {planned.length > 0 && !isFailed && (
            <div className="mt-7">

              {/* Header */}
              <div className="mb-3 flex items-center justify-between px-1">

                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                  Project Files
                </span>

                <span className="text-[10px] font-medium text-zinc-400">
                  {completed.length} / {planned.length}
                </span>

              </div>

              {/* Files */}
              <div className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">

                {planned.map((file) => {

                  const isCompleted = completed.includes(file.path);
                  const isGenerating = current === file.path;

                  return (
                    <div
                      key={file.path}
                      className={`
                        group relative flex items-center gap-3
                        rounded-xl border px-3 py-2.5
                        backdrop-blur-xl
                        transition-all duration-300
                        ${
                          isGenerating
                            ? "border-zinc-200 bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                            : isCompleted
                              ? "border-white/80 bg-white/45"
                              : "border-transparent bg-white/20 opacity-55"
                        }
                      `}
                    >

                      {/* Active glow */}
                      {isGenerating && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-zinc-100/30 to-transparent pointer-events-none" />
                      )}

                      {/* Icon */}
                      <div className="relative z-10 shrink-0">

                        {isCompleted ? (
                          <CheckCircle2Icon
                            size={16}
                            strokeWidth={1.8}
                            className="text-emerald-500"
                          />
                        ) : isGenerating ? (
                          <Loader2Icon
                            size={16}
                            strokeWidth={1.8}
                            className="animate-spin text-zinc-900"
                          />
                        ) : (
                          <CircleIcon
                            size={16}
                            strokeWidth={1.5}
                            className="text-zinc-300"
                          />
                        )}

                      </div>

                      {/* File information */}
                      <div className="relative z-10 min-w-0 flex-1">

                        <p
                          className={`
                            truncate text-xs font-medium
                            ${
                              isGenerating
                                ? "text-zinc-900"
                                : "text-zinc-600"
                            }
                          `}
                        >
                          {file.path}
                        </p>

                        {file.description && (
                          <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                            {file.description}
                          </p>
                        )}

                      </div>

                      {/* Active label */}
                      {isGenerating && (
                        <span className="relative z-10 shrink-0 rounded-full border border-zinc-200 bg-white px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-zinc-500 shadow-sm animate-pulse">
                          Writing
                        </span>
                      )}

                      {/* Completed indicator */}
                      {isCompleted && !isGenerating && (
                        <span className="text-[8px] font-medium uppercase tracking-wider text-zinc-300">
                          Done
                        </span>
                      )}

                    </div>
                  );
                })}

              </div>
            </div>
          )}

          {/* =================================================
              PLANNING STATE
          ================================================== */}
          {planned.length === 0 && !isFailed && (
            <div className="mt-8 flex flex-col items-center">

              <div className="flex items-center gap-2 text-zinc-400">

                <Loader2Icon
                  size={14}
                  className="animate-spin"
                />

                <span className="text-[11px] tracking-wide">
                  Analyzing requirements...
                </span>

              </div>

              <div className="mt-3 h-[1px] w-24 overflow-hidden bg-zinc-200">

                <div className="h-full w-1/2 bg-zinc-700 animate-[loading_1.4s_ease-in-out_infinite]" />

              </div>

            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          BOTTOM BRANDING
      ====================================================== */}
      <div className="absolute bottom-7 left-0 right-0 text-center">

        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-zinc-300">
          AI Workspace
        </p>

      </div>

      {/* =====================================================
          ANIMATION
      ====================================================== */}
      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(250%);
          }
        }
      `}</style>

    </div>
  );
}