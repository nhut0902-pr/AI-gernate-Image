import React from 'react';
import { AppMode } from '../types';

interface EditorPanelProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  hasImage: boolean;
  hasResult: boolean;
  reset: () => void;
}

const ModeButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: JSX.Element;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
      isActive
        ? 'bg-cyan-600 text-white shadow-lg'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MagicWandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.121l2.121 2.121a1 1 0 01.293.707v.55l1.414 1.414a1 1 0 010 1.414l-8.485 8.485a1 1 0 01-1.414 0l-1.414-1.414v-.55a1 1 0 01.293-.707L5.879 5.121V4a1 1 0 01.707-.954l5.657-2.001zM11 5.121L5.121 11 11 5.121zM13 3v2.121L9.121 9 7 6.879V5a1 1 0 01.293-.707L8.414 3H13z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>;


export const EditorPanel: React.FC<EditorPanelProps> = ({
  mode,
  setMode,
  prompt,
  setPrompt,
  handleSubmit,
  isLoading,
  hasImage,
  hasResult,
  reset
}) => {
  const showReset = hasImage || hasResult;
  
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex bg-gray-900/50 p-1 rounded-xl space-x-1">
        <ModeButton label="Generate Image" isActive={mode === 'generate'} onClick={() => setMode('generate')} icon={<MagicWandIcon />} />
        <ModeButton label="Edit Image" isActive={mode === 'edit'} onClick={() => setMode('edit')} icon={<PhotoIcon />} />
        <ModeButton label="Create Video" isActive={mode === 'video'} onClick={() => setMode('video')} icon={<VideoIcon />} />
      </div>
      
      <div className="flex-grow flex flex-col space-y-4">
        <label htmlFor="prompt" className="text-lg font-semibold text-cyan-400">
          Your Creative Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === 'generate' ? 'e.g., A majestic lion wearing a crown, photorealistic' :
            mode === 'edit' ? 'e.g., add a futuristic city in the background' : 
            'e.g., make the car drive through a neon city'
          }
          className="w-full flex-grow p-3 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 resize-none"
          disabled={isLoading || ((mode === 'edit' || mode === 'video') && !hasImage)}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt || ((mode === 'edit' || mode === 'video') && !hasImage)}
          className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (mode === 'video' ? 'Generating Video...' : 'Generating...') : 'Generate'}
        </button>
        {showReset && (
             <button
             onClick={reset}
             disabled={isLoading}
             className="w-full py-2 px-4 bg-gray-600 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50"
            >
            Start Over
            </button>
        )}
      </div>
    </div>
  );
};