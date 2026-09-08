import { getSupabaseClient, getSupabaseConfig } from './supabase';

export interface UploadResult {
  url: string;
  mediaType: 'image' | 'video';
  fileName: string;
  fileSize: number;
}

/**
 * Checks whether a given media URL or item is a video
 */
export const isMediaVideo = (url?: string, mediaType?: string): boolean => {
  if (mediaType === 'video') return true;
  if (!url) return false;
  
  // Check extension or known video patterns
  const cleanUrl = url.split('?')[0].toLowerCase();
  return (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.endsWith('.m4v') ||
    cleanUrl.endsWith('.ogg') ||
    url.includes('/video/') ||
    url.includes('video%2F')
  );
};

/**
 * Uploads an image or video file directly to the Supabase "media" public storage bucket.
 */
export const uploadMediaFile = async (
  file: File,
  bucketName: string = 'media'
): Promise<UploadResult> => {
  const { isConfigured } = getSupabaseConfig();
  const supabase = getSupabaseClient();

  if (!isConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured yet. Please configure your Supabase URL and Anon Key in Admin Vault -> Supabase Cloud.'
    );
  }

  // Determine media type
  const isVideo = file.type.startsWith('video/') || isMediaVideo(file.name);
  const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';

  // Sanitize filename and create a timestamped folder path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const folder = isVideo ? 'videos' : 'photos';
  const filePath = `${folder}/${Date.now()}_${sanitizedName}`;

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '31536000', // 1 year cache
      upsert: true,
      contentType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
    });

  if (error) {
    // Provide a helpful error if the bucket doesn't exist yet
    if (
      error.message?.toLowerCase().includes('bucket not found') ||
      error.message?.toLowerCase().includes('not found')
    ) {
      throw new Error(
        `Storage bucket "${bucketName}" was not found. Please create a public bucket named "${bucketName}" in Supabase Dashboard (Storage -> New Bucket).`
      );
    }

    if (
      error.message?.toLowerCase().includes('row-level security') ||
      error.message?.toLowerCase().includes('policy')
    ) {
      throw new Error(
        'Upload blocked by Supabase Row-Level Security (RLS). Please run the storage policies SQL in your Supabase SQL Editor (or check Storage -> Policies for "media").'
      );
    }

    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get the public URL for the uploaded asset
  const { data: publicData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  if (!publicData?.publicUrl) {
    throw new Error('Failed to retrieve public URL from Supabase storage.');
  }

  return {
    url: publicData.publicUrl,
    mediaType,
    fileName: file.name,
    fileSize: file.size,
  };
};
