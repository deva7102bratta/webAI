import { Loader2Icon, SparklesIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa] flex items-center justify-center">

      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-zinc-200/40 via-white to-zinc-300/30 blur-3xl" />

        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-zinc-200/30 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-zinc-300/20 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Loader */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo / loader container */}
        <div className="relative flex h-20 w-20 items-center justify-center">

          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border border-zinc-200" />

          {/* Gradient ring */}
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

        {/* Brand / title */}
        <div className="mt-7 text-center">
          <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-900">
            Preparing your workspace
          </h1>

          <p className="mt-2 text-[13px] tracking-wide text-zinc-400">
            Almost there
          </p>
        </div>

        {/* Progress line */}
        <div className="mt-6 h-[2px] w-32 overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full w-1/2 rounded-full bg-zinc-900 animate-[loading_1.4s_ease-in-out_infinite]" />
        </div>

      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-300">
          Your Workspace
        </p>
      </div>

      {/* Custom animation */}
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
};

export default Loading;