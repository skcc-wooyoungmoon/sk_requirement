
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { OutputArea } from './components/OutputArea';
import { generateRequirements } from './services/geminiService';
import type { Requirement } from './types';
import { downloadFile, convertToCsv } from './services/fileService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  const [generatedRequirements, setGeneratedRequirements] = useState<Requirement[]>([]);

  const handleGenerate = useCallback(async (rawText: string, imageBase64?: string) => {
    if (!rawText.trim() && !imageBase64) {
      setError('Please provide some input text, a file, or an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedMarkdown('');
    setGeneratedRequirements([]);

    try {
      const { markdown, requirements } = await generateRequirements(rawText, imageBase64);
      setGeneratedMarkdown(markdown);
      setGeneratedRequirements(requirements);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = useCallback((format: 'md' | 'csv') => {
    if (format === 'md') {
      if (generatedMarkdown) {
        downloadFile(generatedMarkdown, 'requirements.md', 'text/markdown');
      }
    } else if (format === 'csv') {
      if (generatedRequirements.length > 0) {
        const csvContent = convertToCsv(generatedRequirements);
        downloadFile(csvContent, 'requirements.csv', 'text/csv;charset=utf-8;');
      }
    }
  }, [generatedMarkdown, generatedRequirements]);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputArea onGenerate={handleGenerate} isLoading={isLoading} />
          <OutputArea
            markdown={generatedMarkdown}
            requirements={generatedRequirements}
            isLoading={isLoading}
            error={error}
            onDownload={handleDownload}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
