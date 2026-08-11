import React from 'react';
import { Loader2Icon } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-zinc-200 blur-md opacity-50" />

          <Loader2Icon
            size={32}
            strokeWidth={2.5}
            className="relative animate-spin text-zinc-900"
          />
        </div>

        <p className="text-sm font-medium text-zinc-500 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;