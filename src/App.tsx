import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CareerProvider } from './context/CareerContext';
import { Navbar } from './components/layout/Navbar';
import { MarqueeBanner } from './components/layout/MarqueeBanner';
import { Footer } from './components/layout/Footer';
import { ArtisticHeroGrid } from './components/home/ArtisticHeroGrid';
import { CurrentSeasonBanner } from './components/home/CurrentSeasonBanner';
import { FeaturedStory } from './components/home/FeaturedStory';
import { CareerTimeline } from './components/career/CareerTimeline';
import { SeasonDetailView } from './components/season-detail/SeasonDetailView';
import { MemoriesView } from './components/memories/MemoriesView';
import { StatsMatrixView } from './components/stats/StatsMatrixView';
import { AboutView } from './components/about/AboutView';
import { AdminVaultView } from './components/admin/AdminVaultView';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const { isLight } = useTheme();

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('season-')) {
        const id = hash.replace('season-', '');
        setSelectedSeasonId(id);
        setCurrentView('season-detail');
      } else if (hash === 'career') {
        setCurrentView('career');
        setSelectedSeasonId(null);
      } else if (hash === 'memories' || hash === 'archives') {
        setCurrentView('memories');
        setSelectedSeasonId(null);
      } else if (hash === 'stats' || hash === 'statistics') {
        setCurrentView('stats');
        setSelectedSeasonId(null);
      } else if (hash === 'about') {
        setCurrentView('about');
        setSelectedSeasonId(null);
      } else if (hash === 'vault') {
        setIsAdminOpen(true);
      } else {
        setCurrentView('home');
        setSelectedSeasonId(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (view: string, seasonId?: string) => {
    setIsAdminOpen(false);
    if (seasonId) {
      setSelectedSeasonId(seasonId);
      setCurrentView('season-detail');
      window.location.hash = `season-${seasonId}`;
    } else {
      setSelectedSeasonId(null);
      setCurrentView(view);
      window.location.hash = view === 'home' ? '' : view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSeason = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    setCurrentView('season-detail');
    window.location.hash = `season-${seasonId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentView('memories');
    window.location.hash = 'memories';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-canvas text-theme-main font-sans-body selection:bg-[#FF5D22] selection:text-black transition-colors duration-300">
      {/* Top Navbar with Theme Switcher */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isAdminOpen={isAdminOpen}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
      />

      {/* Main Experience Router */}
      <main className="flex-1 flex flex-col">
        {isAdminOpen ? (
          <AdminVaultView
            onClose={() => setIsAdminOpen(false)}
            onSelectSeason={(seasonId) => {
              setIsAdminOpen(false);
              handleSelectSeason(seasonId);
            }}
          />
        ) : (
          <>
            {/* VIEW: HOME PORTFOLIO */}
            {currentView === 'home' && (
              <div className="flex flex-col flex-1">
                {/* Signature Artistic Flair 12-Column Hero Matrix */}
                <ArtisticHeroGrid
                  onSelectSeason={handleSelectSeason}
                  onExploreCareer={() => handleNavigate('career')}
                />

                {/* High Contrast Accolades Marquee Banner */}
                <MarqueeBanner variant={isLight ? 'accent' : 'light'} />

                {/* Current Season 06 Active Spotlight */}
                <CurrentSeasonBanner onSelectSeason={handleSelectSeason} />

                {/* Featured Story & Emotional Archival Spotlight */}
                <FeaturedStory
                  onNavigateToMemories={() => handleNavigate('memories')}
                  onOpenStory={handleOpenStory}
                />
              </div>
            )}

            {/* VIEW: CAREER TIMELINE & CHAPTERS */}
            {currentView === 'career' && (
              <CareerTimeline onSelectSeason={handleSelectSeason} />
            )}

            {/* VIEW: DYNAMIC SEASON DETAIL (1 to 6) */}
            {currentView === 'season-detail' && selectedSeasonId && (
              <SeasonDetailView
                seasonId={selectedSeasonId}
                onNavigateBack={() => handleNavigate('career')}
                onSelectSeason={handleSelectSeason}
                isAdminMode={isAdminOpen}
              />
            )}

            {/* VIEW: ARCHIVES & MEMORIES */}
            {currentView === 'memories' && (
              <MemoriesView
                onSelectSeason={handleSelectSeason}
                activeStoryId={selectedStoryId}
                onClearActiveStory={() => setSelectedStoryId(null)}
              />
            )}

            {/* VIEW: STATISTICS & ADVANCED ANALYTICS */}
            {currentView === 'stats' && (
              <StatsMatrixView onSelectSeason={handleSelectSeason} />
            )}

            {/* VIEW: ATHLETE PROFILE & ABOUT */}
            {currentView === 'about' && (
              <AboutView onSelectSeason={handleSelectSeason} />
            )}
          </>
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CareerProvider>
        <AppContent />
      </CareerProvider>
    </ThemeProvider>
  );
}
