"use client";

import React, { useEffect, useState } from 'react';
import { FileText, Download, Trash2, Edit, Eye, Calendar, HardDrive, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PDFHandler, PDFMetadata } from '@/lib/pdf-handler';
import { cn } from '@/lib/utils';

interface PDFListProps {
  onPDFDeleted?: (pdfId: string) => void;
  onPDFUpdated?: (metadata: PDFMetadata) => void;
  className?: string;
}

export const PDFList: React.FC<PDFListProps> = ({
  onPDFDeleted,
  onPDFUpdated,
  className
}) => {
  const [pdfs, setPdfs] = useState<PDFMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; pdf: PDFMetadata | null }>({ open: false, pdf: null });
  const [editModal, setEditModal] = useState<{ open: boolean; pdf: PDFMetadata | null }>({ open: false, pdf: null });
  const [editingName, setEditingName] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
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

  const handleDelete = async (pdf: PDFMetadata) => {
    if (!pdf.id) return;

    try {
      setActionLoading(pdf.id);
      await PDFHandler.deletePDF(pdf.id);
      setPdfs(prev => prev.filter(p => p.id !== pdf.id));
      setDeleteModal({ open: false, pdf: null });
      onPDFDeleted?.(pdf.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete PDF';
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async () => {
    if (!editModal.pdf?.id || !editingName.trim()) return;

    try {
      setActionLoading(editModal.pdf.id);
      const updatedPDF = await PDFHandler.updatePDFMetadata(editModal.pdf.id, {
        fileName: editingName.endsWith('.pdf') ? editingName : `${editingName}.pdf`
      });
      
      setPdfs(prev => prev.map(p => p.id === updatedPDF.id ? updatedPDF : p));
      setEditModal({ open: false, pdf: null });
      setEditingName('');
      onPDFUpdated?.(updatedPDF);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update PDF';
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteModal = (pdf: PDFMetadata) => {
    setDeleteModal({ open: true, pdf });
  };

  const openEditModal = (pdf: PDFMetadata) => {
    setEditModal({ open: true, pdf });
    setEditingName(pdf.fileName.replace('.pdf', ''));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const downloadPDF = (pdf: PDFMetadata) => {
    const link = document.createElement('a');
    link.href = pdf.publicUrl;
    link.download = pdf.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading PDFs...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
          <Button onClick={fetchPDFs} variant="outline" size="sm" className="ml-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            PDF Documents ({pdfs.length})
          </CardTitle>
          <Button onClick={fetchPDFs} variant="outline" size="sm">
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {pdfs.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-600 mb-2">No PDFs uploaded yet</p>
              <p className="text-sm text-gray-500">Upload your first PDF to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <FileText size={24} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {pdf.fileName}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <HardDrive size={14} />
                          {formatFileSize(pdf.fileSize)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(pdf.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="hidden sm:flex">
                      {pdf.contentType || 'application/pdf'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(pdf.publicUrl, '_blank')}
                      title="View PDF"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadPDF(pdf)}
                      title="Download PDF"
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(pdf)}
                      title="Edit name"
                      disabled={actionLoading === pdf.id}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteModal(pdf)}
                      title="Delete PDF"
                      disabled={actionLoading === pdf.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      {actionLoading === pdf.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, pdf: null })}
        title="Delete PDF"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{deleteModal.pdf?.fileName}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, pdf: null })}
              disabled={actionLoading !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModal.pdf && handleDelete(deleteModal.pdf)}
              disabled={actionLoading !== null}
            >
              {actionLoading === deleteModal.pdf?.id ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => {
          setEditModal({ open: false, pdf: null });
          setEditingName('');
        }}
        title="Edit PDF Name"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              File Name
            </label>
            <Input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Enter new name (without .pdf extension)"
              disabled={actionLoading !== null}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setEditModal({ open: false, pdf: null });
                setEditingName('');
              }}
              disabled={actionLoading !== null}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={actionLoading !== null || !editingName.trim()}
            >
              {actionLoading === editModal.pdf?.id ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};