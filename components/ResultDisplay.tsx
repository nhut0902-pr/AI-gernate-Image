
import React from 'react';
import { GenerationResult } from '../types';

interface ResultDisplayProps {
  result: GenerationResult | null;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-lg text-gray-500">
        <p>Your creation will appear here...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      {result.type === 'image' ? (
        <img src={result.data} alt="Generated result" className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg" />
      ) : (
        <video src={result.data} controls autoPlay loop className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg" />
      )}
      <a
        href={result.data}
        download={`ai-creation.${result.type === 'image' ? 'png' : 'mp4'}`}
        className="inline-flex items-center justify-center mt-4 py-2 px-5 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors duration-300"
      >
        <DownloadIcon />
        Download
      </a>
    </div>
  );
};
