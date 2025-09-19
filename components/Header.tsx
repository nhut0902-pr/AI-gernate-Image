
import React from 'react';

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-12v4m2-2h-4m2 6.5l-1.5 1.5M18 13l-1.5 1.5m-5-5l1.5 1.5M13 18l1.5 1.5" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/30 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SparklesIcon />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Image & Video Studio
          </h1>
        </div>
      </div>
    </header>
  );
};
