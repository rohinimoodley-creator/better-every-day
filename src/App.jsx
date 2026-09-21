import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { WellnessProvider } from './context/WellnessContext';
import { AudioProvider } from './context/AudioContext';
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import HomeScreen from './components/home/HomeScreen';
import WellnessHub from './components/wellness/WellnessHub';
import RecordHub from './components/record/RecordHub';
import InsightsHub from './components/insights/InsightsHub';
import ProfileSettings from './components/profile/ProfileSettings';
import TogetherHub from './components/together/TogetherHub';

import WhatCanITrackDrawer from './components/navigation/WhatCanITrackDrawer';
import BodySignalsModal from './components/body/BodySignalsModal';
import DuplicateDataAlertModal from './components/trust/DuplicateDataAlertModal';
import { syncStatusBarTheme, hideSplashScreen, initAndroidBackButton } from './services/nativeService';
import { useWellness } from './context/WellnessContext';

function AppContent() {
  const { theme } = useWellness();
  const [activeTab, setActiveTab] = useState('HOME');
  const [wellnessCategory, setWellnessCategory] = useState('move');
  const [insightsTab, setInsightsTab] = useState('overview');
  const [youSection, setYouSection] = useState('how_i_thrive');
  const [isWhatCanITrackOpen, setIsWhatCanITrackOpen] = useState(false);
  const [isBodySignalsOpen, setIsBodySignalsOpen] = useState(false);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, wellnessCategory, insightsTab, youSection]);

  // Native Mobile Initialization
  useEffect(() => {
    hideSplashScreen();
  }, []);

  useEffect(() => {
    syncStatusBarTheme(theme);
  }, [theme]);

  useEffect(() => {
    const cleanup = initAndroidBackButton(() => {
      if (isWhatCanITrackOpen) {
        setIsWhatCanITrackOpen(false);
        return true;
      }
      if (isBodySignalsOpen) {
        setIsBodySignalsOpen(false);
        return true;
      }
      if (activeTab !== 'HOME') {
        setActiveTab('HOME');
        return true;
      }
      return false;
    });
    return cleanup;
  }, [isWhatCanITrackOpen, isBodySignalsOpen, activeTab]);

  const handleNavigate = (tab, params = {}) => {
    // Category mapping to Wellness
    const wellnessCategories = ['MOVE', 'NOURISH', 'HYDRATE', 'REST', 'SKINCARE', 'SKIN', 'MIND', 'BREATHWORK', 'BREATH', 'CYCLE', 'CALENDAR'];
    const lowerCategoryMap = {
      'MOVE': 'move',
      'NOURISH': 'nourish',
      'HYDRATE': 'hydrate',
      'REST': 'rest',
      'SKINCARE': 'skincare',
      'SKIN': 'skincare',
      'MIND': 'mind',
      'BREATHWORK': 'breathwork',
      'BREATH': 'breathwork',
      'CYCLE': 'cycle',
      'CALENDAR': 'calendar'
    };

    if (wellnessCategories.includes(tab?.toUpperCase())) {
      setWellnessCategory(lowerCategoryMap[tab.toUpperCase()]);
      setActiveTab('WELLNESS');
      return;
    }

    if (tab === 'TODAY') {
      setActiveTab('HOME');
      return;
    }

    if (tab === 'PROFILE') {
      if (params.section) setYouSection(params.section);
      setActiveTab('YOU');
      return;
    }

    if (tab === 'INTELLIGENCE') {
      if (params.tab) setInsightsTab(params.tab);
      setActiveTab('INSIGHTS');
      return;
    }

    if (tab === 'WELLNESS') {
      if (params.category) setWellnessCategory(params.category);
      setActiveTab('WELLNESS');
      return;
    }

    if (tab === 'INSIGHTS') {
      if (params.tab) setInsightsTab(params.tab);
      setActiveTab('INSIGHTS');
      return;
    }

    if (tab === 'YOU') {
      if (params.section) setYouSection(params.section);
      setActiveTab('YOU');
      return;
    }

    if (params.category) setWellnessCategory(params.category);
    if (params.tab) setInsightsTab(params.tab);
    if (params.section) setYouSection(params.section);

    setActiveTab(tab);
  };

  const handleOpenModal = (modalId) => {
    if (modalId === 'body_signals') {
      setIsBodySignalsOpen(true);
    }
  };

  return (
    <div className="app-container">
      <Header 
        onNavigateTab={handleNavigate} 
        onOpenWhatCanITrack={() => setIsWhatCanITrackOpen(true)}
      />

      {isOffline && (
        <aside className="offline-banner" role="status" aria-live="polite">
          <span>📡</span>
          <span>Offline mode • All wellness logs and reflections are safely preserved on your device.</span>
        </aside>
      )}
      
      <main className="main-content">
        {activeTab === 'HOME' && <HomeScreen onNavigateTab={handleNavigate} />}
        {activeTab === 'WELLNESS' && (
          <WellnessHub 
            initialCategory={wellnessCategory} 
            onNavigateTab={handleNavigate} 
          />
        )}
        {activeTab === 'RECORD' && <RecordHub onNavigateTab={handleNavigate} />}
        {activeTab === 'INSIGHTS' && (
          <InsightsHub 
            initialTab={insightsTab} 
            onNavigateTab={handleNavigate} 
          />
        )}
        {activeTab === 'YOU' && <ProfileSettings initialSection={youSection} />}
        {activeTab === 'TOGETHER' && <TogetherHub />}
      </main>

      {/* Global Explore / What Can I Track Drawer */}
      <WhatCanITrackDrawer 
        isOpen={isWhatCanITrackOpen}
        onClose={() => setIsWhatCanITrackOpen(false)}
        activeTab={activeTab}
        onNavigateTab={handleNavigate}
        onOpenModal={handleOpenModal}
      />

      {/* Global Body Signals Modal */}
      <BodySignalsModal 
        isOpen={isBodySignalsOpen}
        onClose={() => setIsBodySignalsOpen(false)}
      />

      {/* Duplicate Data Pop-Up Notification (Hidden for now) */}
      {/* <DuplicateDataAlertModal onNavigateTab={handleNavigate} /> */}

      <Navbar activeTab={activeTab} onSelectTab={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WellnessProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </WellnessProvider>
    </AuthProvider>
  );
}
