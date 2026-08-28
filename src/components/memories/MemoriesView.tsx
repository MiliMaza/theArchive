import React, { useState } from 'react';
import { BookOpen, Sparkles, Trophy, MapPin, Filter, Quote, X, Calendar } from 'lucide-react';
import { memoriesData } from '../../data/memories';
import { Memory } from '../../types/career';

interface MemoriesViewProps {
  onSelectSeason: (seasonId: string) => void;
  activeStoryId?: string | null;
  onClearActiveStory?: () => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({
  onSelectSeason,
  activeStoryId,
  onClearActiveStory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [readingStory, setReadingStory] = useState<Memory | null>(
    activeStoryId ? memoriesData.find((m) => m.id === activeStoryId) || null : null
  );

  const categories = [
    'ALL',
    'Championships',
    'Milestones',
    'Games',
    'People',
    'Hard Moments',
  ];

  const filteredMemories = memoriesData.filter((m) => {
    return selectedCategory === 'ALL' || m.category === selectedCategory;
  });

  return (
    <div className="w-full bg-theme-canvas min-h-screen py-12 px-6 sm:px-12 text-theme-main transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-theme-subtle pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
            <span>Subjective Archive</span>
            <span>•</span>
            <span>Personal Memories</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-theme-main uppercase mb-4">
            Archives & Personal Stories
          </h1>
          <p className="font-serif-editorial text-xl italic text-theme-muted max-w-2xl leading-relaxed">
            "A career is more than statistics. Teams, people, places, hard lessons, and personal memories tell the rest."
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-theme-subtle">
          <span className="text-xs font-mono-code text-theme-faint uppercase mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[11px] font-mono-code uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                  : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle hover:border-theme-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setReadingStory(mem)}
              className="bg-theme-panel border border-theme-subtle hover:border-[#FF5D22] transition-all duration-300 flex flex-col justify-between group cursor-pointer overflow-hidden shadow-sm"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-theme-panel">
                <img
                  src={mem.image}
                  alt={mem.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-mono-code text-[#FF5D22] uppercase tracking-wider border border-white/10">
                  {mem.category}
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono-code text-white/80">
                  {mem.seasonLabel} • {mem.country}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-theme-main group-hover:text-[#FF5D22] transition-colors leading-snug mb-3">
                    {mem.title}
                  </h3>

                  <p className="text-xs text-theme-muted font-sans-body leading-relaxed mb-4 line-clamp-3">
                    {mem.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-theme-subtle flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-theme-faint">
                    {mem.location}
                  </span>

                  <span className="text-xs font-mono-code text-[#FF5D22] font-bold flex items-center gap-1.5">
                    <span>Read Story</span>
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Story Reading Modal */}
      {readingStory && (
        <div
          onClick={() => setReadingStory(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-theme-panel border border-theme-subtle p-8 sm:p-12 relative my-auto shadow-2xl cursor-default text-theme-main"
          >
            <button
              onClick={() => setReadingStory(null)}
              className="absolute top-6 right-6 p-2 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-4 font-bold">
              <span>{readingStory.category}</span>
              <span>•</span>
              <span>{readingStory.seasonLabel}</span>
              <span>•</span>
              <span>{readingStory.date}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-theme-main mb-6">
              {readingStory.title}
            </h2>

            {readingStory.image && (
              <div className="aspect-[16/9] w-full overflow-hidden border border-theme-subtle mb-6 bg-black">
                <img
                  src={readingStory.image}
                  alt={readingStory.title}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>
            )}

            {readingStory.quote && (
              <div className="p-4 bg-theme-subtle border-l-2 border-[#FF5D22] mb-6">
                <p className="font-serif-editorial text-xl italic text-theme-main">
                  "{readingStory.quote}"
                </p>
              </div>
            )}

            <div className="space-y-4 text-sm text-theme-muted leading-relaxed font-sans-body mb-8">
              <p>{readingStory.fullStory}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-6 border-t border-theme-subtle gap-4">
              <div className="text-xs font-mono-code text-theme-muted">
                Location: <span className="text-theme-main font-bold">{readingStory.location}</span>
              </div>

              <button
                onClick={() => {
                  const seasonId = readingStory.seasonId;
                  setReadingStory(null);
                  onSelectSeason(seasonId);
                }}
                className="px-4 py-2 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-theme-main hover:text-theme-canvas transition-colors cursor-pointer"
              >
                Go to Season {readingStory.seasonId} File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
