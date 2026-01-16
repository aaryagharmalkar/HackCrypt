import { supabase } from './supabase';

export interface PDFMetadata {
  id?: string;
  fileName: string;
  filePath: string;
  publicUrl: string;
  fileSize?: number;
  contentType?: string;
  uploadedAt?: string;
}

export class PDFHandler {
  private static readonly BUCKET_NAME = 'pdf-documents';

  /**
   * Upload PDF file to Supabase Storage and save metadata to database
   * @param file The PDF file to upload
   * @param customFileName Optional custom filename (without extension)
   * @returns Promise with the PDF metadata
   */
  static async uploadPDF(file: File, customFileName?: string): Promise<PDFMetadata> {
    try {
      // Check Supabase configuration
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase environment variables are not configured. Please check your .env.local file.');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Auth error:', userError);
        throw new Error('User not authenticated. Please log in first.');
      }

      console.log('Authenticated user ID:', user.id);

      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      // Generate filename
      const timestamp = new Date().getTime();
      const originalName = file.name.replace('.pdf', '');
      const fileName = customFileName || originalName;
      const filePath = `${user.id}/${timestamp}_${fileName}.pdf`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(PDFHandler.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message || JSON.stringify(uploadError)}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(PDFHandler.BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Save metadata to database
      const pdfMetadata: Omit<PDFMetadata, 'id'> = {
        fileName: `${fileName}.pdf`,
        filePath: uploadData.path,
        publicUrl: publicUrlData.publicUrl,
        fileSize: file.size,
        contentType: file.type,
        uploadedAt: new Date().toISOString()
      };

      // Debug: Log user ID and metadata before insert
      console.log('Inserting PDF document for user:', user.id);
      console.log('PDF metadata:', pdfMetadata);

      const { data: dbData, error: dbError } = await supabase
        .from('pdf_documents')
        .insert([{
          user_id: user.id,
          file_name: pdfMetadata.fileName,
          file_path: pdfMetadata.filePath,
          public_url: pdfMetadata.publicUrl,
          file_size: pdfMetadata.fileSize,
          content_type: pdfMetadata.contentType,
          uploaded_at: pdfMetadata.uploadedAt
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        console.error('Error details:', {
          message: dbError.message,
          details: dbError.details,
          hint: dbError.hint,
          code: dbError.code
        });
        // If database insert fails, try to clean up the uploaded file
        await PDFHandler.deleteFile(filePath);
        throw new Error(`Database insert failed: ${dbError.message || dbError.hint || 'Unknown error. This may be due to RLS policies. Please ensure the table and policies are set up correctly.'}`);
      }

      console.log('PDF saved to database successfully, triggering webhook...');

      // Trigger webhook notification via API route (to avoid CORS issues)
      try {
        const webhookPayload = {
          pdf_id: dbData.id,
          user_id: user.id,
          public_url: pdfMetadata.publicUrl,
          file_name: pdfMetadata.fileName
        };

        console.log('Sending webhook via API route');
        console.log('Webhook payload:', webhookPayload);

        const response = await fetch('/api/webhook/pdf-upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookPayload)
        });

        console.log('Webhook API response status:', response.status);
        const responseData = await response.json();
        console.log('Webhook API response:', responseData);

        if (!response.ok) {
          console.error('Webhook API returned non-OK status:', response.status);
        } else {
          console.log('Webhook notification sent successfully');
        }
      } catch (webhookError) {
        // Log webhook errors but don't fail the upload
        console.error('Failed to send webhook notification:', webhookError);
        if (webhookError instanceof Error) {
          console.error('Webhook error message:', webhookError.message);
          console.error('Webhook error stack:', webhookError.stack);
        }
      }

      return {
        id: dbData.id,
        ...pdfMetadata
      };

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error('Error uploading PDF:', error);
      throw new Error(`Upload failed: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Get all PDFs for the current user
   * @returns Promise with array of PDF metadata
   */
  static async getUserPDFs(): Promise<PDFMetadata[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        fileName: item.file_name,
        filePath: item.file_path,
        publicUrl: item.public_url,
        fileSize: item.file_size,
        contentType: item.content_type,
        uploadedAt: item.uploaded_at
      }));

    } catch (error) {
      console.error('Error fetching user PDFs:', error);
      throw error;
    }
  }

  /**
   * Delete a PDF file and its metadata
   * @param pdfId The ID of the PDF document in the database
   * @returns Promise<boolean>
   */
  static async deletePDF(pdfId: string): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Get PDF metadata first
      const { data: pdfData, error: fetchError } = await supabase
        .from('pdf_documents')
        .select('file_path')
        .eq('id', pdfId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !pdfData) {
        throw new Error('PDF not found or access denied');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(PDFHandler.BUCKET_NAME)
        .remove([pdfData.file_path]);

      if (storageError) {
        console.warn('Error deleting from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', pdfId)
        .eq('user_id', user.id);

      if (dbError) {
        throw dbError;
      }

      return true;

    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  }

  /**
   * Get PDF metadata by ID
   * @param pdfId The ID of the PDF document
   * @returns Promise with PDF metadata
   */
  static async getPDFById(pdfId: string): Promise<PDFMetadata | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('id', pdfId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }

      return {
        id: data.id,
        fileName: data.file_name,
        filePath: data.file_path,
        publicUrl: data.public_url,
        fileSize: data.file_size,
        contentType: data.content_type,
        uploadedAt: data.uploaded_at
      };

    } catch (error) {
      console.error('Error fetching PDF by ID:', error);
      throw error;
    }
  }

  /**
   * Update PDF metadata
   * @param pdfId The ID of the PDF document
   * @param updates The fields to update
   * @returns Promise with updated PDF metadata
   */
  static async updatePDFMetadata(
    pdfId: string, 
    updates: Partial<Pick<PDFMetadata, 'fileName'>>
  ): Promise<PDFMetadata> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const updateData: any = {};
      if (updates.fileName) {
        updateData.file_name = updates.fileName;
      }

      const { data, error } = await supabase
        .from('pdf_documents')
        .update(updateData)
        .eq('id', pdfId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        fileName: data.file_name,
        filePath: data.file_path,
        publicUrl: data.public_url,
        fileSize: data.file_size,
        contentType: data.content_type,
        uploadedAt: data.uploaded_at
      };

    } catch (error) {
      console.error('Error updating PDF metadata:', error);
      throw error;
    }
  }

  /**
   * Private method to delete a file from storage
   * @param filePath The path of the file in storage
   */
  private static async deleteFile(filePath: string): Promise<void> {
    try {
      await supabase.storage
        .from(PDFHandler.BUCKET_NAME)
        .remove([filePath]);
    } catch (error) {
      console.warn('Error cleaning up file:', error);
    }
  }

  /**
   * Check if the storage bucket exists, create if it doesn't
   * @returns Promise<boolean>
   */
  static async ensureBucketExists(): Promise<boolean> {
    try {
      // Try to get bucket info
      const { data, error } = await supabase.storage.getBucket(PDFHandler.BUCKET_NAME);
      
      if (error && error.message === 'Bucket not found') {
        // Create bucket if it doesn't exist
        const { data: createData, error: createError } = await supabase.storage.createBucket(
          PDFHandler.BUCKET_NAME,
          {
            public: true,
            fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
            allowedMimeTypes: ['application/pdf']
          }
        );

        if (createError) {
          console.error('Error creating bucket:', createError);
          return false;
        }

        return true;
      }

      return !error;
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
      return false;
    }
  }
}