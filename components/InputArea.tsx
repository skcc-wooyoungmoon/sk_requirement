import React, { useState, useCallback } from 'react';
import { readFileAsText, readFileAsBase64, readPdfAsText } from '../services/fileService';

interface InputAreaProps {
  onGenerate: (rawText: string, imageBase64?: string) => void;
  isLoading: boolean;
}

type InputMode = 'text' | 'file' | 'image';

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [isReadingFile, setIsReadingFile] = useState(false);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    setFileName(file.name);

    try {
      if (mode === 'file') {
        let fileContent = '';
        if (file.type === 'application/pdf') {
          fileContent = await readPdfAsText(file);
        } else {
          fileContent = await readFileAsText(file);
        }
        setText(fileContent);
      } else if (mode === 'image') {
        const base64 = await readFileAsBase64(file);
        setImageBase64(base64);
        setImagePreview(base64);
        setText(prev => prev || "Describe the requirements based on the attached image.");
      }
    } catch (error) {
      console.error('Error reading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      alert(`Failed to read the file: ${errorMessage}`);
      setFileName('');
      setText('');
      setImagePreview(null);
      setImageBase64('');
    } finally {
      setIsReadingFile(false);
    }
  }, [mode]);
  
  const handleSubmit = () => {
    onGenerate(text, imageBase64);
  };

  const renderInput = () => {
    switch (mode) {
      case 'file':
        return (
          <div>
            <label className="block w-full cursor-pointer rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400">
              <input type="file" className="hidden" onChange={handleFileChange} accept=".txt,.md,.csv,.pdf,application/pdf" disabled={isReadingFile} />
              {isReadingFile ? (
                <>
                  <LoadingSpinner className="mx-auto h-12 w-12 text-slate-400" />
                  <span className="mt-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Reading File...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="mt-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {fileName || 'Click to upload a document (.txt, .md, .csv, .pdf)'}
                  </span>
                </>
              )}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="File content will appear here..."
              className="mt-4 w-full h-64 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        );
      case 'image':
        return (
           <div>
            <label className="block w-full cursor-pointer rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400">
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isReadingFile} />
              {isReadingFile ? (
                <>
                  <LoadingSpinner className="mx-auto h-12 w-12 text-slate-400" />
                  <span className="mt-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Reading Image...</span>
                </>
              ) : imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-32 max-h-32 object-contain" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                   <span className="mt-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {fileName || 'Click to upload an image'}
                  </span>
                </>
              )}
            </label>
             <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Optionally add text context for the image..."
                className="mt-4 w-full h-32 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
             />
          </div>
        )
      default: // 'text'
        return (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your ideas, user stories, or raw notes here. Describe the project you want to build..."
            className="w-full h-96 p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        );
    }
  };
  
  const TabButton = ({ currentMode, targetMode, children }: { currentMode: InputMode, targetMode: InputMode, children: React.ReactNode }) => {
    const isActive = currentMode === targetMode;
    return (
      <button
        onClick={() => setMode(targetMode)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition ${
          isActive
            ? 'bg-indigo-600 text-white'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {children}
      </button>
    );
  };


  return (
    <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">1. Provide Input</h2>
      <div className="mb-4 flex space-x-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
        <TabButton currentMode={mode} targetMode="text">Paste Text</TabButton>
        <TabButton currentMode={mode} targetMode="file">Upload File</TabButton>
        <TabButton currentMode={mode} targetMode="image">Upload Image</TabButton>
      </div>

      <div className="min-h-[300px]">
        {renderInput()}
      </div>

       <button
        onClick={handleSubmit}
        disabled={isLoading || isReadingFile}
        className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
      >
        {isLoading ? (
          <>
             <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" />
            Generating...
          </>
        ) : (
          'Generate Requirements'
        )}
      </button>
    </div>
  );
};