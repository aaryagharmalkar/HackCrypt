"use client";

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PDFHandler, PDFMetadata } from '@/lib/pdf-handler';
import { cn } from '@/lib/utils';

interface PDFUploaderProps {
  onUploadSuccess?: (metadata: PDFMetadata) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  maxFileSize?: number; // in MB
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  className,
  maxFileSize = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedMetadata, setUploadedMetadata] = useState<PDFMetadata | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setErrorMessage('');
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please select a PDF file only.');
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      setErrorMessage(`File size must be less than ${maxFileSize}MB.`);
      return;
    }

    setSelectedFile(file);
    setCustomFileName(file.name.replace('.pdf', ''));
    setUploadStatus('idle');
  }, [maxFileSize]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      setErrorMessage('');

      // Simulate progress (since we don't have real upload progress from Supabase)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const metadata = await PDFHandler.uploadPDF(
        selectedFile,
        customFileName || undefined
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      setUploadedMetadata(metadata);
      
      
      onUploadSuccess?.(metadata);

    } catch (error) {
      setUploadStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      setErrorMessage(errorMsg);
      onUploadError?.(errorMsg);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCustomFileName('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
    setUploadedMetadata(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={20} />
          PDF Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadStatus === 'success' && uploadedMetadata ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-green-700 font-medium">PDF uploaded successfully!</span>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Upload Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">File Name:</span>
                  <p className="font-medium">{uploadedMetadata.fileName}</p>
                </div>
                <div>
                  <span className="text-gray-500">File Size:</span>
                  <p className="font-medium">{uploadedMetadata.fileSize ? formatFileSize(uploadedMetadata.fileSize) : 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Public URL:</span>
                  <p className="font-medium text-blue-600 break-all">
                    <a href={uploadedMetadata.publicUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {uploadedMetadata.publicUrl}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => window.open(uploadedMetadata.publicUrl, '_blank')}
                variant="outline"
                size="sm"
              >
                View PDF
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
                size="sm"
              >
                Upload Another
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!selectedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drop your PDF here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="inline-block">
                  <Button variant="outline" className="cursor-pointer">
                    Browse Files
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-4">
                  Maximum file size: {maxFileSize}MB. PDF files only.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText size={24} className="text-red-600" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    disabled={uploadStatus === 'uploading'}
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Custom File Name (optional)
                  </label>
                  <Input
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder="Enter custom name (without .pdf extension)"
                    disabled={uploadStatus === 'uploading'}
                  />
                </div>

                {uploadStatus === 'uploading' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Uploading... {uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadStatus !== 'uploading' && (
                  <Button
                    onClick={handleUpload}
                    className="w-full"
                    disabled={uploadStatus === 'uploading'}
                  >
                    {uploadStatus === 'uploading' ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        Upload PDF
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={20} className="text-red-600" />
                <span className="text-red-700">{errorMessage}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};