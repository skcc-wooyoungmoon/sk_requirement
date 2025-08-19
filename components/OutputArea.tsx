
import React from 'react';
import type { Requirement } from '../types';

interface OutputAreaProps {
  markdown: string;
  requirements: Requirement[];
  isLoading: boolean;
  error: string | null;
  onDownload: (format: 'md' | 'csv') => void;
}

export const OutputArea: React.FC<OutputAreaProps> = ({ markdown, requirements, isLoading, error, onDownload }) => {
  const hasOutput = markdown.length > 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Generating Document...</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">This may take a moment. The AI is analyzing your input.</p>
        </div>
      );
    }
    if (error) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.007H12v-.007Z" />
            </svg>
            <p className="text-lg font-semibold text-red-700 dark:text-red-300">An Error Occurred</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
        </div>
      );
    }
    if (!hasOutput) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6.108V18a2.25 2.25 0 0 0 2.25 2.25h.383" />
            </svg>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Your document will appear here</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Provide your input and click "Generate Requirements".</p>
        </div>
      );
    }
    
    // Using a <pre> tag to preserve markdown formatting without a library
    return (
        <pre className="w-full h-full p-4 bg-slate-100 dark:bg-slate-900 rounded-md overflow-auto whitespace-pre-wrap font-mono text-sm text-slate-800 dark:text-slate-200">
            <code>{markdown}</code>
        </pre>
    )
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Generated Document</h2>
        <div className="flex space-x-2">
           <button 
            onClick={() => onDownload('md')} 
            disabled={!hasOutput || isLoading}
            className="px-4 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Download .md
          </button>
          <button 
            onClick={() => onDownload('csv')} 
            disabled={requirements.length === 0 || isLoading}
            className="px-4 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Export .csv
          </button>
        </div>
      </div>
      <div className="h-[500px] border border-slate-200 dark:border-slate-700 rounded-lg">
        {renderContent()}
      </div>
    </div>
  );
};
