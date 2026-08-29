import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useCareer } from '../../../context/CareerContext';
import { SeasonImage } from '../../../types/career';

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
  const { seasons, addMediaToSeason } = useCareer();
  
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(seasons[seasons.length - 1]?.id || '06');
  const [imageSrc, setImageSrc] = useState<string>(PRESET_MEDIA_LIBRARY[0].src);
  const [altText, setAltText] = useState<string>('Match photography action');
  const [caption, setCaption] = useState<string>('Decisive fourth quarter possession in front of a sold-out arena.');
  const [tag, setTag] = useState<string>('Match Day');
  const [customFilePreview, setCustomFilePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomFilePreview(result);
        setImageSrc(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageSrc) return;

    const newMedia: SeasonImage = {
      src: imageSrc,
      alt: altText || 'Career match action',
      caption: caption || 'Archived photography from game archive.',
      tag: tag || 'Match Day',
    };

    addMediaToSeason(selectedSeasonId, newMedia);
    setSuccessMessage(`Successfully uploaded photo to Season ${selectedSeasonId}!`);
    setTimeout(() => {
      setSuccessMessage(null);
      if (onSuccess) onSuccess();
      onClose();
    }, 1000);
  };

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
                Upload High-Res Media & Photography
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
          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
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

          {/* Drag and Drop File Upload / Image Source */}
          <div className="space-y-3">
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase">
              Photo Upload / File Input
            </label>
            
            <div className="border-2 border-dashed border-theme-subtle hover:border-[#FF5D22] p-6 text-center transition-colors bg-theme-subtle relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-[#FF5D22] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono-code text-theme-main font-bold">
                Drop high-res photo here or click to browse
              </div>
              <div className="text-[10px] text-theme-faint font-mono-code mt-1">
                Supports JPG, PNG, WEBP up to 25MB
              </div>
            </div>

            <div className="text-center text-[10px] font-mono-code text-theme-faint uppercase">
              — Or use Image URL / Presets —
            </div>

            <input
              type="text"
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
              placeholder="Paste direct image URL..."
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
            />

            {/* Quick Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_MEDIA_LIBRARY.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImageSrc(preset.src);
                    setAltText(preset.alt);
                    setCaption(preset.caption);
                    setTag(preset.tag);
                  }}
                  className={`relative aspect-square border overflow-hidden transition-all cursor-pointer ${
                    imageSrc === preset.src ? 'border-[#FF5D22] ring-2 ring-[#FF5D22]' : 'border-theme-subtle opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.src} alt={preset.alt} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                </button>
              ))}
            </div>
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
                <option value="Championship">Championship / Trophy</option>
                <option value="Arena">Arena & Stadium</option>
                <option value="Training">Training & Conditioning</option>
                <option value="Travel">Travel & Culture</option>
                <option value="Lifestyle">Lifestyle & Recovery</option>
                <option value="Highlights">Highlights</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                Photo Headline / Alt Text
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
              className="px-6 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-widest hover:bg-emerald-500 transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
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
