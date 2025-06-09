import React from 'react';

export default function LoadingScreen(): React.JSX.Element {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600">Loading Performance Review...</p>
      </div>
    </div>
  );
}
