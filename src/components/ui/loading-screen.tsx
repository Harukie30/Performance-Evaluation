import { PenLine } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-blue-500 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-64 h-64 bg-yellow-50 rounded-lg shadow-lg p-6 transform rotate-[-2deg]">
        {/* Note paper effect */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_79px,#abced4_79px,#abced4_81px,transparent_81px)] bg-[length:100%_2em] opacity-20"></div>

        {/* Animated pen */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <PenLine className="h-10 w-10 text-blue-600 animate-[writing_2s_ease-in-out_infinite]" />
            <div className="absolute top-10 left-0 w-10 h-1 bg-yellow-400 origin-left animate-[line_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-lg font-medium text-gray-800 animate-pulse">
            Signing in...
          </p>
        </div>
      </div>
    </div>
  );
}
