
import React from 'react';

interface LoaderProps {
    message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
      <h2 className="text-xl font-semibold text-gray-200 mt-6">Generating Your Creation...</h2>
      {message && <p className="text-gray-400 mt-2 max-w-sm">{message}</p>}
    </div>
  );
};
