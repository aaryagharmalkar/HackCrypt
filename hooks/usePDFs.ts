"use client";

import { useState, useEffect } from 'react';
import { PDFHandler, PDFMetadata } from '@/lib/pdf-handler';

interface UsePDFsReturn {
  pdfs: PDFMetadata[];
  loading: boolean;
  error: string | null;
  uploadPDF: (file: File, customName?: string) => Promise<PDFMetadata>;
  deletePDF: (pdfId: string) => Promise<boolean>;
  updatePDF: (pdfId: string, updates: { fileName?: string }) => Promise<PDFMetadata>;
  refreshPDFs: () => Promise<void>;
}

/**
 * Custom hook for managing PDF documents
 * Provides all necessary functions to work with PDFs in your components
 */
export function usePDFs(): UsePDFsReturn {
  const [pdfs, setPdfs] = useState<PDFMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPDFs = async () => {
    try {
      setLoading(true);
      setError(null);
      const userPDFs = await PDFHandler.getUserPDFs();
      setPdfs(userPDFs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch PDFs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadPDF = async (file: File, customName?: string): Promise<PDFMetadata> => {
    try {
      setError(null);
      const metadata = await PDFHandler.uploadPDF(file, customName);
      // Add to local state immediately
      setPdfs(prev => [metadata, ...prev]);
      return metadata;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload PDF';
      setError(errorMessage);
      throw err;
    }
  };

  const deletePDF = async (pdfId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await PDFHandler.deletePDF(pdfId);
      if (success) {
        // Remove from local state immediately
        setPdfs(prev => prev.filter(pdf => pdf.id !== pdfId));
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete PDF';
      setError(errorMessage);
      throw err;
    }
  };

  const updatePDF = async (
    pdfId: string, 
    updates: { fileName?: string }
  ): Promise<PDFMetadata> => {
    try {
      setError(null);
      const updatedMetadata = await PDFHandler.updatePDFMetadata(pdfId, updates);
      // Update local state immediately
      setPdfs(prev => prev.map(pdf => pdf.id === pdfId ? updatedMetadata : pdf));
      return updatedMetadata;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update PDF';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    refreshPDFs();
  }, []);

  return {
    pdfs,
    loading,
    error,
    uploadPDF,
    deletePDF,
    updatePDF,
    refreshPDFs,
  };
}

/**
 * Example of how to use this hook in a component:
 * 
 * function MyComponent() {
 *   const { pdfs, loading, error, uploadPDF } = usePDFs();
 * 
 *   const handleFileUpload = async (file: File) => {
 *     try {
 *       const metadata = await uploadPDF(file, 'my-custom-name');
 *       console.log('Upload successful:', metadata);
 *       // The pdfs array will be automatically updated
 *     } catch (error) {
 *       console.error('Upload failed:', error);
 *     }
 *   };
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       {pdfs.map(pdf => (
 *         <div key={pdf.id}>
 *           <a href={pdf.publicUrl} target="_blank">
 *             {pdf.fileName}
 *           </a>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */