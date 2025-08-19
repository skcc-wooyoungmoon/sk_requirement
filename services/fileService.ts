import type { Requirement } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// @ts-ignore - Set worker path for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

export const readPdfAsText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    let fullText = '';
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + (i < numPages ? '\n\n' : ''); // Add double newline for better separation between pages.
    }
    return fullText;
  } catch (error: any) {
    if (error.name === 'PasswordException') {
      throw new Error(
        'This PDF is password-protected. Please provide an unprotected file.'
      );
    } else {
      console.error('Failed to read PDF:', error);
      throw new Error(
        'Could not read the PDF file. It might be corrupted or in an unsupported format.'
      );
    }
  }
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      try {
        // Try decoding with UTF-8 first, as it's the web standard.
        // The 'fatal: true' option makes it throw an error on malformed input.
        const decoder = new TextDecoder('utf-8', { fatal: true });
        const text = decoder.decode(buffer);
        resolve(text);
      } catch (e) {
        console.warn('UTF-8 decoding failed, trying EUC-KR as a fallback.');
        try {
          // Fallback to EUC-KR for legacy Korean files.
          const decoder = new TextDecoder('euc-kr');
          const text = decoder.decode(buffer);
          resolve(text);
        } catch (e2) {
          reject(new Error('Failed to decode the file. Please ensure it is saved with UTF-8 or EUC-KR encoding.'));
        }
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};


export const downloadFile = (content: string, fileName: string, mimeType: string) => {
  // Add a BOM for CSV files to ensure Excel opens them with correct UTF-8 encoding for Korean characters.
  const finalContent = mimeType.includes('csv') ? '\uFEFF' + content : content;
  const blob = new Blob([finalContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const convertToCsv = (data: Requirement[]): string => {
  if (data.length === 0) return '';
  
  const headers = ['요구사항 ID', '이름', '설명', '출처'];
  const rows = data.map(req => [
    `"${req.id || ''}"`,
    `"${(req.name || '').replace(/"/g, '""')}"`,
    `"${(req.description || '').replace(/"/g, '""')}"`,
    `"${(req.source || 'N/A').replace(/"/g, '""')}"`
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};