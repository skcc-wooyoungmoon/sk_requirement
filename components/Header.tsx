
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 text-indigo-500 mr-3"
        >
          <path
            fillRule="evenodd"
            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a.375.375 0 01-.375-.375V6.75A3.75 3.75 0 0010.5 3h-4.875A1.875 1.875 0 003.75 4.875v-.375c0-1.036.84-1.875 1.875-1.875zM12.75 12.75a.75.75 0 000-1.5h-3a.75.75 0 000 1.5h3z"
            clipRule="evenodd"
          />
          <path d="M14.25 6a.75.75 0 00-.75-.75h-3a.75.75 0 000 1.5h3a.75.75 0 00.75-.75zm.75 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM16.5 9a.75.75 0 00-.75.75v.008a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008z" />
        </svg>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Requirements Definition Generator
        </h1>
      </div>
    </header>
  );
};
