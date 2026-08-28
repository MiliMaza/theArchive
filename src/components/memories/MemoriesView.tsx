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
    <div className="w-full bg-[#0F0F0F] min-h-screen py-12 px-6 sm:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
            <span>Subjective Archive</span>
            <span>•</span>
            <span>Personal Memories</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white uppercase mb-4">
            Archives & Personal Stories
          </h1>
          <p className="font-serif-editorial text-xl italic text-white/60 max-w-2xl leading-relaxed">
            "A career is more than statistics. Teams, people, places, hard lessons, and personal memories tell the rest."
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-white/10">
          <span className="text-xs font-mono-code text-white/40 uppercase mr-2 flex items-center gap-1.5">
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
                  : 'bg-white/5 text-white/70 hover:text-white border-white/10 hover:border-white/20'
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
              className="bg-[#141414] border border-white/10 hover:border-[#FF5D22] transition-all duration-300 flex flex-col justify-between group cursor-pointer overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                <img
                  src={mem.image}
                  alt={mem.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-mono-code text-[#FF5D22] uppercase tracking-wider border border-white/10">
                  {mem.category}
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono-code text-white/60">
                  {mem.seasonLabel} • {mem.country}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white group-hover:text-[#FF5D22] transition-colors leading-snug mb-3">
                    {mem.title}
                  </h3>

                  <p className="text-xs text-white/70 font-sans-body leading-relaxed mb-4 line-clamp-3">
                    {mem.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-white/40">
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-[#141414] border border-white/20 p-8 sm:p-12 relative my-auto shadow-2xl cursor-default"
          >
            <button
              onClick={() => setReadingStory(null)}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-[#FF5D22] hover:text-black rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-4">
              <span>{readingStory.category}</span>
              <span>•</span>
              <span>{readingStory.seasonLabel}</span>
              <span>•</span>
              <span>{readingStory.date}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white mb-6">
              {readingStory.title}
            </h2>

            {readingStory.image && (
              <div className="aspect-[16/9] w-full overflow-hidden border border-white/10 mb-6 bg-black">
                <img
                  src={readingStory.image}
                  alt={readingStory.title}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>
            )}

            {readingStory.quote && (
              <div className="p-4 bg-black/40 border-l-2 border-[#FF5D22] mb-6">
                <p className="font-serif-editorial text-xl italic text-white/90">
                  "{readingStory.quote}"
                </p>
              </div>
            )}

            <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans-body mb-8">
              <p>{readingStory.fullStory}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-6 border-t border-white/10 gap-4">
              <div className="text-xs font-mono-code text-white/50">
                Location: <span className="text-white font-bold">{readingStory.location}</span>
              </div>

              <button
                onClick={() => {
                  const seasonId = readingStory.seasonId;
                  setReadingStory(null);
                  onSelectSeason(seasonId);
                }}
                className="px-4 py-2 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-white transition-colors cursor-pointer"
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
