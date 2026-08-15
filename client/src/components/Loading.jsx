import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="min-h-screen flex flex-col items-center justify-center bg-white gap-3"
    >
      <Loader2Icon
        size={32}
        strokeWidth={2}
        className="animate-spin text-zinc-900"
      />

      <span className="text-sm text-zinc-500">
        Loading...
      </span>
    </div>
  );
};

export default Loading;