import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { EditorPanel } from './components/EditorPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { AppMode, GenerationResult } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { generateImage, editImage, createVideoFromImage } from './services/geminiService';
import { VIDEO_GENERATION_MESSAGES } from './constants';

const MagicWandIconLarge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.121l2.121 2.121a1 1 0 01.293.707v.55l1.414 1.414a1 1 0 010 1.414l-8.485 8.485a1 1 0 01-1.414 0l-1.414-1.414v-.55a1 1 0 01.293-.707L5.879 5.121V4a1 1 0 01.707-.954l5.657-2.001zM11 5.121L5.121 11 11 5.121zM13 3v2.121L9.121 9 7 6.879V5a1 1 0 01.293-.707L8.414 3H13z" clipRule="evenodd" /></svg>
);


export default function App() {
  const [mode, setMode] = useState<AppMode>('generate');
  const [originalImage, setOriginalImage] = useState<{ b64: string; mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading && mode === 'video') {
      setLoadingMessage(VIDEO_GENERATION_MESSAGES[0]);
      let messageIndex = 0;
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % VIDEO_GENERATION_MESSAGES.length;
        setLoadingMessage(VIDEO_GENERATION_MESSAGES[messageIndex]);
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading, mode]);


  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      setResult(null);
      const { b64, mimeType } = await fileToBase64(file);
      setOriginalImage({ b64, mimeType });
    } catch (err) {
      setError('Failed to load image. Please try another file.');
      console.error(err);
    }
  }, []);
  
  const resetState = useCallback(() => {
    setOriginalImage(null);
    setResult(null);
    setPrompt('');
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!prompt) {
        setError('Please enter a prompt.');
        return;
    }
    if ((mode === 'edit' || mode === 'video') && !originalImage) {
      setError('Please upload an image for this mode.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
        if (mode === 'generate') {
            const generatedImageB64 = await generateImage(prompt);
            setResult({ type: 'image', data: `data:image/png;base64,${generatedImageB64}` });
        } else if (mode === 'edit' && originalImage) {
            const editedImageB64 = await editImage(originalImage.b64, originalImage.mimeType, prompt);
            setResult({ type: 'image', data: `data:${originalImage.mimeType};base64,${editedImageB64}` });
        } else if (mode === 'video' && originalImage) {
            const videoUrl = await createVideoFromImage(originalImage.b64, originalImage.mimeType, prompt);
            setResult({ type: 'video', data: videoUrl });
        }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [originalImage, prompt, mode]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          <div className="lg:col-span-4 bg-gray-800/50 rounded-2xl p-6 flex flex-col shadow-2xl backdrop-blur-sm border border-gray-700/50">
            <EditorPanel
              mode={mode}
              setMode={(newMode) => {
                setMode(newMode);
                resetState();
              }}
              prompt={prompt}
              setPrompt={setPrompt}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              hasImage={!!originalImage}
              hasResult={!!result}
              reset={resetState}
            />
          </div>
          
          <div className="lg:col-span-8 bg-gray-800/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[60vh] shadow-2xl backdrop-blur-sm border border-gray-700/50">
            {isLoading ? (
              <Loader message={loadingMessage} />
            ) : error ? (
              <div className="text-center text-red-400">
                <p className="text-xl font-semibold">An Error Occurred</p>
                <p className="mt-2">{error}</p>
              </div>
            ) : (
                <>
                    {mode === 'generate' && (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                        {result ? (
                            <>
                            <h3 className="text-lg font-bold text-cyan-400 mb-4">AI Generated Image</h3>
                            <ResultDisplay result={result} />
                            </>
                        ) : (
                            <div className="text-center text-gray-500 flex flex-col items-center">
                                <MagicWandIconLarge />
                                <h2 className="text-2xl font-bold mt-4">Image Generation</h2>
                                <p className="mt-2">Describe the image you want to create in the prompt panel.</p>
                            </div>
                        )}
                        </div>
                    )}

                    {(mode === 'edit' || mode === 'video') && (
                        <>
                        {!originalImage ? (
                            <ImageUploader onImageUpload={handleImageUpload} />
                        ) : (
                            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="flex flex-col items-center justify-center h-full">
                                <h3 className="text-lg font-bold text-cyan-400 mb-4">Original Image</h3>
                                <img src={`data:${originalImage.mimeType};base64,${originalImage.b64}`} alt="Original upload" className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg"/>
                            </div>
                            <div className="flex flex-col items-center justify-center h-full">
                                <h3 className="text-lg font-bold text-cyan-400 mb-4">AI Generated Result</h3>
                                <ResultDisplay result={result} />
                            </div>
                            </div>
                        )}
                        </>
                    )}
                </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}