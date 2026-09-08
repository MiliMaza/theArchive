import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Image as ImageIcon, AlertCircle, Loader2, Video, Cloud, Film } from 'lucide-react';
import { useCareer } from '../../../context/CareerContext';
import { SeasonImage } from '../../../types/career';
import { uploadMediaFile, isMediaVideo } from '../../../lib/storage';

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PRESET_MEDIA_LIBRARY = [
  {
    src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop',
    alt: 'High-pick-and-roll transition',
    caption: 'Exploding off high pick-and-roll screen in EuroLeague matchup.',
    tag: 'Highlights',
  },
  {
    src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
    alt: 'Post-game championship embrace',
    caption: 'Lifting the domestic title with coaches and teammates.',
    tag: 'Championship',
  },
  {
    src: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=1000&auto=format&fit=crop',
    alt: 'Focused warmup shooting drill',
    caption: 'Pre-game 200 catch-and-shoot routine 90 minutes before tip-off.',
    tag: 'Training',
  },
  {
    src: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1000&auto=format&fit=crop',
    alt: 'Sold-out arena panoramic',
    caption: 'The electric atmosphere of the home crowd in full roar.',
    tag: 'Arena',
  },
  {
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
    alt: 'City transit and recovery',
    caption: 'Walking through the historic downtown following road win.',
    tag: 'Travel',
  },
  {
    src: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1000&auto=format&fit=crop',
    alt: 'Fastbreak coast-to-coast finish',
    caption: 'Finger roll finish past trailing rim protectors.',
    tag: 'Match Day',
  },
];

export const UploadMediaModal: React.FC<UploadMediaModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { seasons, addMediaToSeason, isSupabaseConnected } = useCareer();

  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(seasons[seasons.length - 1]?.id || '06');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [altText, setAltText] = useState<string>('Career match highlight');
  const [caption, setCaption] = useState<string>('Archived photography / footage from game vault.');
  const [tag, setTag] = useState<string>('Match Day');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Convert Google Drive links if detected
  const handleUrlChange = (val: string) => {
    let cleanVal = val.trim();

    // Check if it's a Google Drive share link
    const driveMatch = cleanVal.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      cleanVal = `https://lh3.googleusercontent.com/d/${fileId}`;
      setUploadNotice('Google Drive link detected and converted to direct CDN stream format.');
    } else {
      setUploadNotice(null);
    }

    setImageSrc(cleanVal);
    setMediaType(isMediaVideo(cleanVal) ? 'video' : 'image');
    setUploadError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadNotice(null);
    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      if (isSupabaseConnected) {
        // Direct upload to Supabase Cloud Storage
        const result = await uploadMediaFile(file);
        setImageSrc(result.url);
        setMediaType(result.mediaType);
        setUploadNotice(`Uploaded to Supabase Cloud: ${result.fileName}`);

        // Auto-fill alt text if empty
        if (!altText || altText === 'Career match highlight') {
          const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setAltText(cleanTitle);
        }
      } else {
        // Fallback when Supabase is not connected
        const isVideo = file.type.startsWith('video/') || isMediaVideo(file.name);
        if (isVideo) {
          throw new Error(
            'Supabase Cloud is required to upload and host MP4 video files. Please configure Supabase in Admin Vault -> Supabase Cloud.'
          );
        }

        // Local Data URL preview for photos
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImageSrc(result);
          setMediaType('image');
          setUploadNotice('Loaded locally. Connect Supabase Cloud to host media publicly for other visitors.');
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload media file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageSrc) {
      setUploadError('Please choose a file or enter a media URL before saving.');
      return;
    }

    const newMedia: SeasonImage = {
      src: imageSrc,
      alt: altText || 'Career match action',
      caption: caption || 'Archived media from game archive.',
      tag: tag || 'Match Day',
      mediaType: mediaType || (isMediaVideo(imageSrc) ? 'video' : 'image'),
    };

    addMediaToSeason(selectedSeasonId, newMedia);
    setSuccessMessage(`Successfully saved ${mediaType === 'video' ? 'video' : 'photo'} to Season ${selectedSeasonId}!`);
    setTimeout(() => {
      setSuccessMessage(null);
      if (onSuccess) onSuccess();
      onClose();
    }, 1000);
  };

  const isCurrentVideo = mediaType === 'video' || isMediaVideo(imageSrc);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-theme-panel border border-theme-subtle w-full max-w-2xl flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-theme-subtle bg-theme-panel">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#FF5D22] text-black font-black font-mono-code flex items-center justify-center text-sm">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block">
                Archival Media Ingestion
              </span>
              <h2 className="text-xl font-black font-display uppercase tracking-tight text-theme-main">
                Upload Media & Photography
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-theme-muted hover:text-[#FF5D22] hover:bg-theme-subtle rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cloud Storage Status Banner */}
          {isSupabaseConnected ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Supabase Cloud Storage Connected</span>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-code flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Supabase is not connected</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono-code flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadNotice && (
            <div className="p-3 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono-code flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{uploadNotice}</span>
            </div>
          )}

          {/* Target Season Picker */}
          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
              Assign to Season Campaign
            </label>
            <select
              value={selectedSeasonId}
              onChange={(e) => setSelectedSeasonId(e.target.value)}
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  Season {s.id} // {s.yearRange} — {s.team} ({s.country})
                </option>
              ))}
            </select>
          </div>

          {/* Drag and Drop File Upload */}
          <div className="space-y-3">
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase">
              Direct File Upload (PNG, JPG, WEBP, MP4)
            </label>

            <div className="border-2 border-dashed border-theme-subtle hover:border-[#FF5D22] p-6 text-center transition-colors bg-theme-subtle relative group cursor-pointer">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              {isUploading ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="w-8 h-8 text-[#FF5D22] animate-spin mb-2" />
                  <div className="text-xs font-mono-code text-theme-main font-bold">
                    Uploading {uploadedFileName} to Supabase Cloud...
                  </div>
                  <div className="text-[10px] text-theme-faint font-mono-code mt-1">
                    Storing in public media bucket...
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Upload className="w-7 h-7 text-[#FF5D22] group-hover:scale-110 transition-transform" />
                    <Film className="w-6 h-6 text-theme-muted group-hover:text-[#FF5D22] transition-colors" />
                  </div>
                  <div className="text-xs font-mono-code text-theme-main font-bold">
                    Drop photo or MP4 video here or click to browse
                  </div>
                  <div className="text-[10px] text-theme-faint font-mono-code mt-1">
                    Supports PNG, JPG, WEBP and MP4 / WEBM videos
                  </div>
                </>
              )}
            </div>

            {/* Live Media Preview if active */}
            {imageSrc && (
              <div className="p-3 bg-black/40 border border-theme-subtle rounded space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono-code text-theme-muted">
                  <span className="uppercase flex items-center gap-1.5 text-[#FF5D22]">
                    {isCurrentVideo ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    {isCurrentVideo ? 'Video Asset Preview' : 'Image Preview'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageSrc('');
                      setUploadedFileName(null);
                      setUploadNotice(null);
                    }}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <div className="max-h-56 overflow-hidden rounded flex items-center justify-center bg-black">
                  {isCurrentVideo ? (
                    <video
                      src={imageSrc}
                      controls
                      className="max-h-56 max-w-full rounded object-contain"
                    />
                  ) : (
                    <img
                      src={imageSrc}
                      alt={altText}
                      className="max-h-56 max-w-full object-contain"
                    />
                  )}
                </div>
              </div>
            )}

            <div className="text-center text-[10px] font-mono-code text-theme-faint uppercase">
              — Or use Direct URL / Preset —
            </div>

            <input
              type="text"
              value={imageSrc}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste direct image or video URL (or Google Drive link)..."
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
            />
          </div>

          {/* Tag & Caption */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                Category Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
              >
                <option value="Match Day">Match Day</option>
                <option value="Championship">Championship</option>
                <option value="Arena">Arena</option>
                <option value="Training">Training</option>
                <option value="Travel">Travel</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Highlights">Highlights</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                Media Headline
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
              Caption & Tactical Context
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-sans-body text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-theme-subtle text-theme-main text-xs font-mono-code uppercase cursor-pointer hover:bg-theme-main hover:text-theme-canvas transition-colors border border-theme-subtle"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-widest hover:bg-emerald-500 transition-colors cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save to Season Gallery</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
