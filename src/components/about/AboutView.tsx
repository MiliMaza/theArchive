import React, { useState } from 'react';
import { Trophy, Shield, MapPin, Globe, Sparkles, Activity, FileText, ArrowRight, User, Edit } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { EditAthleteProfileModal } from '../admin/modals/EditAthleteProfileModal';

interface AboutViewProps {
  onSelectSeason: (seasonId: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectSeason }) => {
  const { seasons, playerProfile } = useCareer();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <div className="w-full bg-theme-canvas min-h-screen py-12 px-6 sm:px-12 text-theme-main transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-theme-subtle pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
              <span>Athlete Profile</span>
              <span>•</span>
              <span>Personal Identity</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-theme-main uppercase mb-4">
              {playerProfile.name}
            </h1>
            <p className="font-serif-editorial text-2xl italic text-theme-muted max-w-3xl leading-relaxed">
              "{playerProfile.tagline}"
            </p>
          </div>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-5 py-2.5 bg-theme-subtle hover:bg-[#FF5D22] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto shadow-sm"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Athlete Profile</span>
          </button>
        </div>

        {/* Grid Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Portrait & Physical Blueprint */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative aspect-[3/4] bg-theme-panel border border-theme-subtle overflow-hidden shadow-sm">
              <img
                src={playerProfile.profileImage || "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop"}
                alt={playerProfile.name}
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono-code bg-[#FF5D22] text-black px-2.5 py-1 font-bold uppercase tracking-widest block w-max mb-2">
                  #{playerProfile.jerseyNumber} • {playerProfile.role}
                </span>
                <div className="text-2xl font-black font-display uppercase text-white drop-shadow">
                  {playerProfile.name}
                </div>
                <div className="text-xs font-mono-code text-white/80 drop-shadow">
                  {playerProfile.currentTeam} ({playerProfile.currentCountry})
                </div>
              </div>
            </div>

            {/* Physical Metrics Card */}
            <div className="bg-theme-panel border border-theme-subtle p-6 space-y-4 shadow-sm">
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block">
                Physical Specifications
              </span>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono-code">
                <div className="p-3 bg-theme-subtle border border-theme-subtle">
                  <div className="text-theme-faint text-[10px]">Height</div>
                  <div className="text-lg font-bold text-theme-main mt-0.5">{playerProfile.height}</div>
                </div>
                <div className="p-3 bg-theme-subtle border border-theme-subtle">
                  <div className="text-theme-faint text-[10px]">Wingspan</div>
                  <div className="text-lg font-bold text-theme-main mt-0.5">{playerProfile.wingspan}</div>
                </div>
                <div className="p-3 bg-theme-subtle border border-theme-subtle">
                  <div className="text-theme-faint text-[10px]">Weight</div>
                  <div className="text-lg font-bold text-theme-main mt-0.5">{playerProfile.weight}</div>
                </div>
                <div className="p-3 bg-theme-subtle border border-theme-subtle">
                  <div className="text-theme-faint text-[10px]">Position</div>
                  <div className="text-sm font-bold text-[#FF5D22] mt-0.5">{playerProfile.position}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Narrative & Basketball Philosophy */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-black font-display uppercase tracking-tight text-theme-main">
                The Journey & Story
              </h2>
              <p className="text-base text-theme-muted leading-relaxed font-sans-body">
                {playerProfile.bioSummary}
              </p>
              <div className="p-6 bg-theme-panel border-l-2 border-[#FF5D22] border-y border-r border-theme-subtle my-6 shadow-sm">
                <p className="font-serif-editorial text-xl italic text-theme-muted leading-relaxed">
                  "{playerProfile.quote}"
                </p>
              </div>
            </div>

            {/* Basketball Philosophy Pillars */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block">
                The Four Tenets of Floor Craft
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playerProfile.philosophy.map((tenet, idx) => (
                  <div key={idx} className="p-4 bg-theme-panel border border-theme-subtle flex items-start gap-3 shadow-sm">
                    <span className="text-sm font-black font-display text-[#FF5D22]">
                      0{idx + 1}
                    </span>
                    <p className="text-xs text-theme-muted font-sans-body leading-relaxed">{tenet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Passport: 6 Clubs in 5 Countries */}
            <div className="space-y-4 pt-4 border-t border-theme-subtle">
              <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest block">
                Global Career Passport
              </span>
              <div className="space-y-3">
                {seasons.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectSeason(s.id)}
                    className="p-3.5 bg-theme-panel border border-theme-subtle hover:border-[#FF5D22] flex items-center justify-between cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono-code text-[#FF5D22] font-bold">
                        {s.yearRange}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-theme-main group-hover:text-[#FF5D22] transition-colors font-display">
                          {s.team}
                        </span>
                        <span className="text-xs text-theme-faint font-mono-code ml-2">
                          ({s.city}, {s.country})
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-theme-faint group-hover:text-[#FF5D22] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditAthleteProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
