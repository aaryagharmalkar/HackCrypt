import { supabase } from './supabase';

/**
 * Initialize the PDF storage system
 * This should be called once to set up the required storage bucket
 */
export async function initializePDFStorage(): Promise<boolean> {
  try {
    const bucketName = 'pdf-documents';
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (!bucketExists) {
      // Create the bucket
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
        allowedMimeTypes: ['application/pdf']
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }

      console.log('PDF documents bucket created successfully');
    } else {
      console.log('PDF documents bucket already exists');
    }

    return true;
  } catch (error) {
    console.error('Error initializing PDF storage:', error);
    return false;
  }
}

/**
 * Check if PDF storage is properly configured
 */
export async function checkPDFStorageHealth(): Promise<{
  bucketExists: boolean;
  canUpload: boolean;
  error?: string;
}> {
  try {
    const bucketName = 'pdf-documents';
    
    // Check bucket existence
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      return { bucketExists: false, canUpload: false, error: listError.message };
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName) || false;
    
    if (!bucketExists) {
      return { bucketExists: false, canUpload: false, error: 'PDF documents bucket does not exist' };
    }

    // Test upload capability (without actually uploading)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { bucketExists: true, canUpload: false, error: 'User not authenticated' };
    }

    return { bucketExists: true, canUpload: true };
  } catch (error) {
    return { 
      bucketExists: false, 
      canUpload: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}