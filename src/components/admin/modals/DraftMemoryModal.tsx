import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, BookOpen, Quote, Image } from 'lucide-react';
import { useCareer } from '../../../context/CareerContext';
import { Memory } from '../../../types/career';
import { MediaDropzone } from '../../common/MediaDropzone';

interface DraftMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DraftMemoryModal: React.FC<DraftMemoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { seasons, addMemory } = useCareer();

  const [title, setTitle] = useState('');
  const [seasonId, setSeasonId] = useState<string>(seasons[seasons.length - 1]?.id || '06');
  const [category, setCategory] = useState<Memory['category']>('Milestones');
  const [date, setDate] = useState('2024');
  const [location, setLocation] = useState('Tokyo, Japan');
  const [excerpt, setExcerpt] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [quote, setQuote] = useState('');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fullStory.trim()) return;

    const matchedSeason = seasons.find((s) => s.id === seasonId);

    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      seasonId,
      seasonLabel: matchedSeason ? `Season ${matchedSeason.id} (${matchedSeason.yearRange})` : 'Career Milestone',
      team: matchedSeason?.team || 'Tokyo Alvark',
      country: matchedSeason?.country || 'Japan',
      title: title.trim(),
      date: date.trim() || '2024',
      category,
      excerpt: excerpt.trim() || fullStory.slice(0, 160) + '...',
      fullStory: fullStory.trim(),
      quote: quote.trim() ? quote.trim() : undefined,
      image,
      featured,
      location: location.trim(),
      isPublic: true,
    };

    addMemory(newMemory);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-theme-panel border border-theme-subtle w-full max-w-2xl flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-theme-subtle bg-theme-panel">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#FF5D22] text-black font-black font-mono-code flex items-center justify-center text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block">
                Subjective Archival Log
              </span>
              <h2 className="text-xl font-black font-display uppercase tracking-tight text-theme-main">
                Draft Athlete Memory & Story
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Memory saved and added to the Curated Archives view!</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
              Story Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The 10-Minute Timeout in Istanbul"
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Memory['category'])}
                className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
              >
                <option value="Milestones">Milestones</option>
                <option value="Games">Classic Games</option>
                <option value="People">Coaches & Teammates</option>
                <option value="Travel">Travel & Culture</option>
                <option value="Hard Moments">Hard Moments / Adversity</option>
                <option value="Championships">Championships</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                Season Campaign
              </label>
              <select
                value={seasonId}
                onChange={(e) => setSeasonId(e.target.value)}
                className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    Season {s.id} ({s.team})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                Date & City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. March 2024, Tokyo"
                className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
              Highlight Quote (Optional)
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. When the arena went dead silent, that was when our spacing was loudest."
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-serif-editorial italic text-theme-main focus:border-[#FF5D22] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
              Excerpt (Short 1-2 sentence teaser)
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary shown on archive cards..."
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-sans-body text-theme-main focus:border-[#FF5D22] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
              Full Narrative Story
            </label>
            <textarea
              rows={4}
              value={fullStory}
              onChange={(e) => setFullStory(e.target.value)}
              placeholder="Write the intimate locker-room details, physical sensations, tactical adjustments, and emotional takeaway..."
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-sans-body text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
              required
            />
          </div>

          <div className="space-y-4">
            <MediaDropzone
              value={image}
              onChange={(url) => setImage(url)}
              label="Memory Photography / Video Asset"
              sublabel="Drop match photography or MP4 clip (PNG, JPG, WEBP, MP4)"
              allowVideo={true}
              aspectRatio="landscape"
              placeholder="Drop memory photo or video here or click to browse"
            />

            <div className="flex items-center gap-2 p-3 bg-theme-subtle border border-theme-subtle">
              <input
                type="checkbox"
                id="isFeaturedStory"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-[#FF5D22] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isFeaturedStory" className="text-xs font-mono-code text-theme-main cursor-pointer">
                Feature on Home Page Banner (Spotlight Memory)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-theme-subtle">
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
              <span>Save & Publish Memory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
