import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Memory } from '../../types/career';
import { useCareer } from '../../context/CareerContext';
import { MediaDropzone } from '../common/MediaDropzone';

interface MemoryFormModalProps {
  existingMemory?: Memory | null;
  onClose: () => void;
  onSaved: (memory: Memory) => void;
}

const CATEGORIES: Memory['category'][] = [
  'Milestones',
  'Games',
  'People',
  'Travel',
  'Hard Moments',
  'Championships',
];

export const MemoryFormModal: React.FC<MemoryFormModalProps> = ({
  existingMemory,
  onClose,
  onSaved,
}) => {
  const { seasons, addMemory, updateMemory } = useCareer();
  const isEditing = !!existingMemory;

  const [title, setTitle] = useState(existingMemory?.title || '');
  const [date, setDate] = useState(existingMemory?.date || '');
  const [category, setCategory] = useState<Memory['category']>(existingMemory?.category || 'Milestones');
  const [seasonId, setSeasonId] = useState(existingMemory?.seasonId || (seasons[0]?.id || ''));
  const [excerpt, setExcerpt] = useState(existingMemory?.excerpt || '');
  const [fullStory, setFullStory] = useState(existingMemory?.fullStory || '');
  const [quote, setQuote] = useState(existingMemory?.quote || '');
  const [image, setImage] = useState(existingMemory?.image || '');
  const [location, setLocation] = useState(existingMemory?.location || '');
  const [featured, setFeatured] = useState(existingMemory?.featured || false);
  const [isPublic, setIsPublic] = useState(existingMemory?.isPublic ?? true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!category) newErrors.category = 'Category is required';
    if (!seasonId) newErrors.seasonId = 'Season is required';
    if (!excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!fullStory.trim()) newErrors.fullStory = 'Full story is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const selectedSeason = seasons.find((s) => s.id === seasonId);
    const memory: Memory = {
      id: existingMemory?.id || `mem-${Date.now()}`,
      seasonId,
      seasonLabel: selectedSeason?.yearRange || '',
      team: selectedSeason?.team || '',
      country: selectedSeason?.country || '',
      title: title.trim(),
      date: date.trim(),
      category,
      excerpt: excerpt.trim(),
      fullStory: fullStory.trim(),
      quote: quote.trim() || undefined,
      image: image.trim() || undefined,
      featured,
      location: location.trim() || undefined,
      isPublic,
    };

    if (isEditing) {
      updateMemory(memory.id, memory);
    } else {
      addMemory(memory);
    }
    onSaved(memory);
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const inputClass =
    'w-full bg-theme-canvas border border-theme-subtle px-3 py-2.5 text-sm text-theme-main font-sans-body placeholder:text-theme-faint focus:outline-none focus:border-[#FF5D22] transition-colors';
  const labelClass =
    'text-[10px] font-mono-code text-theme-faint uppercase tracking-widest mb-1.5 block';
  const errorClass = 'text-[10px] font-mono-code text-red-500 mt-1';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-8 cursor-pointer overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-theme-panel border border-theme-subtle p-8 sm:p-10 relative my-8 shadow-2xl cursor-default text-theme-main scrollbar-thin"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#FF5D22 transparent',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-2 font-bold">
          <span>{isEditing ? 'Edit Memory' : 'New Memory'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-theme-main mb-8">
          {isEditing ? 'Edit Your Story' : 'Create a New Story'}
        </h2>

        {/* Form */}
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. THE SILENCE AT PALAU BLAUGRANA"
              className={inputClass}
            />
            {errors.title && <div className={errorClass}>{errors.title}</div>}
          </div>

          {/* Row: Category + Season + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Memory['category'])}
                className={inputClass}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <div className={errorClass}>{errors.category}</div>}
            </div>

            <div>
              <label className={labelClass}>Season *</label>
              <select
                value={seasonId}
                onChange={(e) => setSeasonId(e.target.value)}
                className={inputClass}
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    S{s.id} — {s.team}
                  </option>
                ))}
              </select>
              {errors.seasonId && <div className={errorClass}>{errors.seasonId}</div>}
            </div>

            <div>
              <label className={labelClass}>Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. June 19, 2022"
                className={inputClass}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelClass}>Excerpt *</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary that appears on the card..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
            {errors.excerpt && <div className={errorClass}>{errors.excerpt}</div>}
          </div>

          {/* Full Story */}
          <div>
            <label className={labelClass}>Full Story *</label>
            <textarea
              value={fullStory}
              onChange={(e) => setFullStory(e.target.value)}
              placeholder="The complete narrative of this memory..."
              rows={5}
              className={`${inputClass} resize-none`}
            />
            {errors.fullStory && <div className={errorClass}>{errors.fullStory}</div>}
          </div>

          {/* Quote */}
          <div>
            <label className={labelClass}>Quote (optional)</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="A personal reflection or phrase..."
              className={inputClass}
            />
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Palau Blaugrana, Barcelona"
              className={inputClass}
            />
          </div>

          {/* Media Dropzone */}
          <MediaDropzone
            value={image}
            onChange={(url) => setImage(url)}
            label="Memory Photography / Video Asset (optional)"
            sublabel="Drop match photo or video clip (PNG, JPG, WEBP, MP4)"
            allowVideo={true}
            aspectRatio="landscape"
            placeholder="Drop memory photo or video here or click to browse"
          />

          {/* Toggles: Featured + Public */}
          <div className="flex items-center gap-8 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-theme-subtle border border-theme-subtle rounded-full peer-checked:bg-[#FF5D22] transition-colors relative">
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-theme-main rounded-full transition-transform peer-checked:translate-x-4 group-[:has(:checked)]:translate-x-4 group-[:has(:checked)]:bg-black" />
              </div>
              <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-wider">
                Featured
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-theme-subtle border border-theme-subtle rounded-full peer-checked:bg-[#FF5D22] transition-colors relative">
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-theme-main rounded-full transition-transform peer-checked:translate-x-4 group-[:has(:checked)]:translate-x-4 group-[:has(:checked)]:bg-black" />
              </div>
              <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-wider">
                Public
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-theme-subtle">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-mono-code font-bold uppercase tracking-wider text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-theme-main hover:text-theme-canvas transition-colors cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Create Memory'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
