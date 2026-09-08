import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Video, CheckCircle2, AlertCircle, Cloud } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { uploadMediaFile, isMediaVideo } from '../../lib/storage';

interface MediaDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  onFileUploaded?: (result: { url: string; fileName: string; mediaType: 'image' | 'video' }) => void;
  label?: string;
  sublabel?: string;
  allowVideo?: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'banner' | 'square' | 'auto';
  placeholder?: string;
  presets?: { src: string; label?: string }[];
  className?: string;
}

export const MediaDropzone: React.FC<MediaDropzoneProps> = ({
  value,
  onChange,
  onFileUploaded,
  label = 'Media Upload',
  sublabel,
  allowVideo = false,
  aspectRatio = 'landscape',
  placeholder = 'Drop photo here or click to browse',
  presets = [],
  className = '',
}) => {
  const { isSupabaseConnected } = useCareer();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'landscape'
      ? 'aspect-[16/9]'
      : 'min-h-[140px]';

  const isVideo = allowVideo && isMediaVideo(value);

  const handleProcessFile = async (file: File) => {
    setUploadError(null);
    setUploadNotice(null);
    setIsUploading(true);

    try {
      if (isSupabaseConnected) {
        const result = await uploadMediaFile(file);
        onChange(result.url);
        setUploadNotice(`Uploaded to Supabase Cloud: ${result.fileName}`);
        if (onFileUploaded) {
          onFileUploaded(result);
        }
      } else {
        const fileIsVideo = file.type.startsWith('video/') || isMediaVideo(file.name);
        if (fileIsVideo) {
          throw new Error('Supabase Cloud is required to host video files. Please configure Supabase in Admin Vault.');
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          onChange(result);
          setUploadNotice('Loaded locally. Connect Supabase in Admin Vault to share publicly.');
          if (onFileUploaded) {
            onFileUploaded({
              url: result,
              fileName: file.name,
              mediaType: 'image',
            });
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload media file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // Clear input so selecting the same file triggers change again
    e.target.value = '';
  };

  const handleUrlInput = (inputVal: string) => {
    let cleanVal = inputVal.trim();
    // Auto-convert Google Drive links
    const driveMatch = cleanVal.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      cleanVal = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
      setUploadNotice('Google Drive link detected and converted to direct stream format.');
    } else {
      setUploadNotice(null);
    }
    setUploadError(null);
    onChange(cleanVal);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label Bar */}
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-mono-code text-theme-faint uppercase">
          {label}
        </label>
        {isSupabaseConnected ? (
          <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1">
            <Cloud className="w-3 h-3" /> Cloud Storage Active
          </span>
        ) : (
          <span className="text-[10px] font-mono-code text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Local Storage (Offline)
          </span>
        )}
      </div>

      {/* Upload Feedback */}
      {uploadError && (
        <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono-code flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadNotice && (
        <div className="p-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono-code flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* Main Dropzone / Preview Area */}
      {value ? (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group border border-theme-subtle bg-black overflow-hidden rounded transition-all ${
            isDragOver ? 'ring-2 ring-[#FF5D22] scale-[1.01]' : ''
          }`}
        >
          <div className={`${aspectClass} max-h-56 w-full flex items-center justify-center overflow-hidden`}>
            {isVideo ? (
              <video src={value} controls className="max-h-56 w-full object-contain" />
            ) : (
              <img src={value} alt="Preview" className="max-h-56 w-full object-cover" />
            )}
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#FF5D22] text-black text-xs font-mono-code font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace File</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setUploadNotice(null);
              }}
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-mono-code font-bold uppercase tracking-wider hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-mono-code text-[#FF5D22] uppercase border border-white/10 flex items-center gap-1">
            {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
            <span>{isVideo ? 'Video Asset' : 'Image Loaded'}</span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed p-6 text-center transition-all bg-theme-subtle cursor-pointer relative group ${
            isDragOver
              ? 'border-[#FF5D22] bg-[#FF5D22]/10 scale-[1.01]'
              : 'border-theme-subtle hover:border-[#FF5D22]'
          }`}
        >
          {/* Native HTML5 invisible file input covering entire dropzone for reliable drag-and-drop and click */}
          <input
            type="file"
            accept={allowVideo ? 'image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm' : 'image/png,image/jpeg,image/webp,image/gif'}
            onChange={handleFileSelect}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          />

          {isUploading ? (
            <div className="flex flex-col items-center py-2">
              <Loader2 className="w-7 h-7 text-[#FF5D22] animate-spin mb-2" />
              <div className="text-xs font-mono-code text-theme-main font-bold">
                Uploading to Supabase Cloud...
              </div>
              <div className="text-[10px] text-theme-faint font-mono-code mt-0.5">
                Storing in public media bucket
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Upload className="w-6 h-6 text-[#FF5D22] group-hover:scale-110 transition-transform" />
                {allowVideo && <Video className="w-5 h-5 text-theme-muted group-hover:text-[#FF5D22] transition-colors" />}
              </div>
              <div className="text-xs font-mono-code text-theme-main font-bold">
                {isDragOver ? 'Drop file here!' : placeholder}
              </div>
              <div className="text-[10px] text-theme-faint font-mono-code mt-1">
                {sublabel || (allowVideo ? 'Supports PNG, JPG, WEBP and MP4 videos' : 'Supports PNG, JPG, WEBP up to 25MB')}
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input for Replace button */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowVideo ? 'image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm' : 'image/png,image/jpeg,image/webp,image/gif'}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Direct URL Input fallback */}
      <div className="pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => handleUrlInput(e.target.value)}
          placeholder="Or paste direct image URL / Google Drive link..."
          className="w-full bg-theme-subtle border border-theme-subtle p-2 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none placeholder:text-theme-faint"
        />
      </div>

      {/* Presets if provided */}
      {presets.length > 0 && (
        <div className="pt-1">
          <span className="text-[9px] font-mono-code text-theme-faint uppercase block mb-1">
            Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.src);
                  setUploadError(null);
                  setUploadNotice(null);
                }}
                className={`px-2 py-0.5 text-[10px] font-mono-code border transition-colors cursor-pointer ${
                  value === preset.src
                    ? 'border-[#FF5D22] text-[#FF5D22] bg-[#FF5D22]/10'
                    : 'border-theme-subtle text-theme-muted hover:text-theme-main bg-theme-panel'
                }`}
              >
                {preset.label || `Preset ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
