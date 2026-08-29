import React from 'react';
import { ArrowRight, BookOpen, Quote, Sparkles } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

interface FeaturedStoryProps {
  onNavigateToMemories: () => void;
  onOpenStory: (storyId: string) => void;
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({
  onNavigateToMemories,
  onOpenStory,
}) => {
  const { memories } = useCareer();
  const featuredMemory = memories.find((m) => m.featured) || memories[0];

  if (!featuredMemory) return null;

  return (
    <section className="w-full border-b border-theme-subtle bg-theme-canvas px-6 sm:px-12 py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-theme-subtle">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF5D22]" />
            <span className="text-[10px] font-mono-code text-theme-muted uppercase tracking-[0.3em]">
              Archival Spotlight • The Story Behind The Data
            </span>
          </div>

          <button
            onClick={onNavigateToMemories}
            className="text-xs font-mono-code text-[#FF5D22] hover:text-theme-main uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Explore All {memories.length} Archives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-6 relative group cursor-pointer" onClick={() => onOpenStory(featuredMemory.id)}>
            <div className="relative aspect-[4/3] overflow-hidden border border-theme-subtle bg-theme-panel shadow-sm">
              <img
                src={featuredMemory.image}
                alt={featuredMemory.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest border border-white/10">
                {featuredMemory.category} • {featuredMemory.seasonLabel}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-xs font-mono-code text-white/80">
                {featuredMemory.location}
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-2 font-bold">
                {featuredMemory.team} • {featuredMemory.date}
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-theme-main leading-tight">
                {featuredMemory.title}
              </h3>
            </div>

            {featuredMemory.quote && (
              <p className="font-serif-editorial text-xl italic text-theme-muted leading-relaxed border-l-2 border-[#FF5D22] pl-5 my-4">
                "{featuredMemory.quote}"
              </p>
            )}

            <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
              {featuredMemory.excerpt}
            </p>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onOpenStory(featuredMemory.id)}
                className="px-6 py-3 bg-[#FF5D22] text-black font-bold uppercase text-xs tracking-wider font-display hover:bg-theme-main hover:text-theme-canvas transition-colors cursor-pointer flex items-center gap-2 shadow-md"
              >
                <span>Read Full Memory</span>
                <BookOpen className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToMemories}
                className="px-5 py-3 border border-theme-subtle text-theme-muted hover:text-theme-main text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer"
              >
                View Category Index
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
