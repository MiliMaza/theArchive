import React from 'react';
import { ArrowRight, BookOpen, Quote, Sparkles } from 'lucide-react';
import { memoriesData } from '../../data/memories';

interface FeaturedStoryProps {
  onNavigateToMemories: () => void;
  onOpenStory: (storyId: string) => void;
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({
  onNavigateToMemories,
  onOpenStory,
}) => {
  const featuredMemory = memoriesData.find((m) => m.featured) || memoriesData[0];

  return (
    <section className="w-full border-b border-white/10 bg-[#0F0F0F] px-6 sm:px-12 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF5D22]" />
            <span className="text-[10px] font-mono-code text-white/50 uppercase tracking-[0.3em]">
              Archival Spotlight • The Story Behind The Data
            </span>
          </div>

          <button
            onClick={onNavigateToMemories}
            className="text-xs font-mono-code text-[#FF5D22] hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Explore All 7 Archives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-6 relative group cursor-pointer" onClick={() => onOpenStory(featuredMemory.id)}>
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#1A1A1A]">
              <img
                src={featuredMemory.image}
                alt={featuredMemory.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest border border-white/10">
                {featuredMemory.category} • {featuredMemory.seasonLabel}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-xs font-mono-code text-white/60">
                {featuredMemory.location}
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-2">
                {featuredMemory.team} • {featuredMemory.date}
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white leading-tight">
                {featuredMemory.title}
              </h3>
            </div>

            <p className="font-serif-editorial text-xl italic text-white/80 leading-relaxed border-l-2 border-[#FF5D22] pl-5 my-4">
              "{featuredMemory.quote}"
            </p>

            <p className="text-sm text-white/60 leading-relaxed font-sans-body">
              {featuredMemory.excerpt}
            </p>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onOpenStory(featuredMemory.id)}
                className="px-6 py-3 bg-[#FF5D22] text-black font-bold uppercase text-xs tracking-wider font-display hover:bg-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Read Full Memory</span>
                <BookOpen className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToMemories}
                className="px-5 py-3 border border-white/20 text-white/70 hover:text-white text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer"
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
