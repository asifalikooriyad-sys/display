
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES, THEMES, DEFAULT_SETTINGS } from './constants';
import { AppSettings, ServiceItem } from './types';
import { SlideRenderer } from './components/Slides';
import { Icon } from './components/Icons';
import { SettingsModal } from './components/SettingsModal';
import { Assistant } from './components/Assistant';
import { NavigationModal } from './components/NavigationModal';

const STORAGE_KEY = 'typing_center_settings_v2';

const App: React.FC = () => {
  // State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDockHovered, setIsDockHovered] = useState(false);
  
  // Progress Bar State
  const [progress, setProgress] = useState(0);

  // Load Settings
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Cursor Hiding
  useEffect(() => {
    if (settings.hideCursor) {
        document.body.style.cursor = 'none';
    } else {
        document.body.style.cursor = 'auto';
    }
    return () => { document.body.style.cursor = 'auto'; }
  }, [settings.hideCursor]);

  // Filter Active Slides & Apply Overrides
  const activeSlides = React.useMemo(() => {
    return SERVICES
      .filter(s => settings.enabledServices.includes(s.id))
      .map(s => {
          const overrides = settings.contentOverrides?.[s.id];
          if (overrides) {
              return { 
                  ...s, 
                  ...overrides,
                  // Ensure we use override if present, else fallback to original
                  background: overrides.background || s.background,
                  customImage: overrides.customImage || s.customImage,
                  videoUrl: overrides.videoUrl || s.videoUrl
              };
          }
          return s;
      });
  }, [settings.enabledServices, settings.contentOverrides]);

  // Handle Rotation & Shuffle
  const nextSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    
    if (settings.slideShuffle && activeSlides.length > 1) {
        // Random Index that is not the current one
        let nextIndex = Math.floor(Math.random() * activeSlides.length);
        while (nextIndex === currentSlideIndex) {
            nextIndex = Math.floor(Math.random() * activeSlides.length);
        }
        setCurrentSlideIndex(nextIndex);
    } else {
        setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }
    setProgress(0); // Reset progress on slide change
  }, [activeSlides.length, settings.slideShuffle, currentSlideIndex]);

  const prevSlide = useCallback(() => {
     if (activeSlides.length === 0) return;

     if (settings.slideShuffle && activeSlides.length > 1) {
        let nextIndex = Math.floor(Math.random() * activeSlides.length);
        setCurrentSlideIndex(nextIndex);
    } else {
        setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
    setProgress(0);
  }, [activeSlides.length, settings.slideShuffle]);

  // Jump to specific service
  const jumpToService = (id: string) => {
    // Handle special menu navigation from Hero Slide
    if (id === 'MENU') {
        setShowNavModal(true);
        return;
    }

    const index = activeSlides.findIndex(s => s.id === id);
    if (index !== -1) {
      setCurrentSlideIndex(index);
      // Optional: Pause rotation when manually navigating so user can read
      setIsPlaying(false);
      setProgress(0);
    }
  };

  // Timer & Progress Effect
  useEffect(() => {
    if (!isPlaying || activeSlides.length === 0) {
        setProgress(0);
        return;
    }
    
    const startTime = Date.now();
    const duration = settings.slideDuration * 1000;
    
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(newProgress);

        if (elapsed >= duration) {
             nextSlide();
        }
    }, 100); // Update every 100ms for smooth progress bar

    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, settings.slideDuration, currentSlideIndex, activeSlides.length]);

  // Current Theme Config
  let theme = THEMES[settings.theme] || THEMES.wood;
  
  // Custom Styles Construction
  const customStyles: React.CSSProperties = settings.theme === 'custom' 
    ? {
        '--theme-color': settings.customColor,
        '--theme-text': settings.customColor,
        '--theme-border': `${settings.customColor}4d`, // 30% opacity
        '--theme-bg': `${settings.customColor}1a` // 10% opacity
      } as React.CSSProperties
    : {};

  // Render Helpers
  const currentSlideData = activeSlides[currentSlideIndex] || SERVICES[0];

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    // Reset slide index if current slide is disabled
    setCurrentSlideIndex(0);
    setProgress(0);
  };
  
  // Animation Variants based on Transition Effect
  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -100, opacity: 0 },
    },
    zoom: {
      initial: { scale: 0.95, opacity: 0, filter: 'blur(10px)' },
      animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
      exit: { scale: 1.05, opacity: 0, filter: 'blur(10px)' },
    }
  };

  const currentVariant = transitionVariants[settings.transitionEffect] || transitionVariants.fade;

  if (!currentSlideData) return <div className="text-white">No slides enabled.</div>;
  
  // Resolve background image: background > customImage > keyword
  const bgImage = currentSlideData.background || currentSlideData.customImage || `https://picsum.photos/seed/${currentSlideData.imageKeyword}/1920/1080`;

  return (
    <div 
        className={`relative w-full h-screen overflow-hidden font-sans selection:bg-white/30`}
        style={customStyles}
    >
      {/* Dynamic Background Layer */}
      <div className={`absolute inset-0 z-0 bg-black transition-colors duration-1000 ${settings.theme !== 'custom' ? theme.bgClass : ''}`}>
           {/* Service Specific Image Background with Overlay */}
           <AnimatePresence mode="wait">
             <motion.div
                key={currentSlideData.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                    backgroundImage: `url(${bgImage})`,
                    filter: 'blur(5px) grayscale(50%)' 
                }}
             />
           </AnimatePresence>
           <div className="absolute inset-0 bg-black" style={{ opacity: settings.overlayOpacity }}></div>
      </div>

      {/* Decorative Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-30 p-8 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="w-20 h-20 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                 {settings.logo ? (
                     <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                 ) : (
                     <Icon name="Briefcase" className={`w-10 h-10 text-white/50`} />
                 )}
            </div>
            
            <div className="flex flex-col">
                <h1 
                    className={`text-3xl font-bold tracking-widest uppercase mb-1 drop-shadow-md`}
                    style={settings.theme === 'custom' ? { color: settings.customColor } : { color: 'white' }}
                >
                    {settings.companyName}
                </h1>
                <h2 className={`text-2xl font-bold font-[Cairo] text-white/90`}>
                    {settings.companyNameAr}
                </h2>
            </div>
        </div>
        
        <div className="flex flex-col items-end text-white/90">
            <div 
                className="text-5xl font-extralight tracking-tighter"
                style={settings.theme === 'custom' ? { color: settings.customColor } : {}}
            >
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: settings.clockFormat === '12h' })}
            </div>
            {settings.showDate && (
                <div className="text-sm uppercase tracking-widest opacity-60 mt-1">
                    {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
            )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative w-full h-full pt-32 pb-0 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideData.id}
            initial={currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <SlideRenderer 
                data={currentSlideData} 
                theme={theme} 
                customColor={settings.theme === 'custom' ? settings.customColor : undefined} 
                onNavigate={jumpToService}
                activeServices={activeSlides}
                settings={settings}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Area */}
      <footer className="absolute bottom-0 left-0 w-full z-40 flex flex-col items-center">
            
            {/* Progress Bar (if enabled) */}
            {settings.showProgressBar && isPlaying && (
                 <div className="w-full h-1 bg-white/10 absolute top-0 left-0 z-50">
                     <motion.div 
                        className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        style={{ 
                            width: `${progress}%`,
                            backgroundColor: settings.theme === 'custom' ? settings.customColor : undefined
                        }}
                     />
                 </div>
            )}

            {/* Auto-Minimizing Navigation Dock */}
            {settings.navDockMode !== 'hidden' && (
                <motion.div 
                    className="mb-6 z-50 flex items-center justify-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onMouseEnter={() => setIsDockHovered(true)}
                    onMouseLeave={() => setIsDockHovered(false)}
                >
                    <motion.div 
                        className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center overflow-hidden shadow-2xl transition-all duration-500 ease-out"
                        animate={{
                            width: (isDockHovered || settings.navDockMode === 'visible') ? 'auto' : '60px',
                            padding: (isDockHovered || settings.navDockMode === 'visible') ? '8px' : '0px',
                            backgroundColor: (isDockHovered || settings.navDockMode === 'visible') ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)'
                        }}
                    >
                        {/* Collapsed View (Play/Pause indicator) */}
                        <div className="w-[60px] h-[50px] flex items-center justify-center shrink-0 absolute left-0 top-0 pointer-events-none">
                             <AnimatePresence>
                                 {(!isDockHovered && settings.navDockMode !== 'visible') && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                         <Icon name={isPlaying ? 'Play' : 'Pause'} className="w-6 h-6 text-white/70" />
                                    </motion.div>
                                 )}
                             </AnimatePresence>
                        </div>

                        {/* Expanded Controls */}
                        <motion.div 
                            className="flex items-center gap-2 overflow-hidden"
                            animate={{ 
                                opacity: (isDockHovered || settings.navDockMode === 'visible') ? 1 : 0,
                                paddingLeft: (isDockHovered || settings.navDockMode === 'visible') ? '0px' : '60px' // Push content out when collapsed
                            }}
                        >
                            {/* New Home Button */}
                            <button 
                                onClick={() => jumpToService('hero')} 
                                className="p-3 hover:bg-white/20 rounded-full text-white transition-colors" 
                                title="Home"
                            >
                                <Icon name="Home" className="w-5 h-5" />
                            </button>

                            <button onClick={prevSlide} className="p-3 hover:bg-white/20 rounded-full text-white transition-colors" title="Previous">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            
                            <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 hover:bg-white/20 rounded-full text-white transition-colors" title={isPlaying ? "Pause" : "Play"}>
                                <Icon name={isPlaying ? 'Pause' : 'Play'} className="w-5 h-5 fill-current" />
                            </button>

                            <button onClick={nextSlide} className="p-3 hover:bg-white/20 rounded-full text-white transition-colors" title="Next">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>

                            <div className="w-px h-6 bg-white/20 mx-1"></div>

                            <button 
                                onClick={() => setShowNavModal(true)} 
                                className="p-3 hover:bg-white/20 rounded-full text-white transition-colors flex items-center gap-2"
                                title="All Services"
                            >
                                <Icon name="Grid" className="w-5 h-5" />
                            </button>

                             <button 
                                onClick={() => setShowAssistant(true)}
                                className="p-3 hover:bg-white/20 rounded-full text-white transition-colors"
                                title="AI Assistant"
                                style={settings.theme === 'custom' ? { color: settings.customColor } : { color: '#60a5fa' }}
                            >
                                <Icon name="Bot" className="w-5 h-5" />
                            </button>
                            
                             <button 
                                onClick={() => setShowSettings(true)} 
                                className="p-3 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-colors"
                                title="Settings"
                            >
                                <Icon name="Cog" className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}

            {/* Ticker - Always Visible */}
            {settings.showTicker && (
                <div className="w-full h-12 bg-black/90 backdrop-blur-md border-t border-white/10 flex items-center relative z-40">
                    <div className="px-6 h-full flex items-center bg-white/5 z-20 text-xs font-bold uppercase tracking-widest text-amber-500 shadow-xl">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                        Updates
                    </div>
                    <div className="whitespace-nowrap overflow-hidden flex-1 relative h-full flex items-center">
                        <motion.div
                            animate={{ x: ["100%", "-100%"] }}
                            transition={{ repeat: Infinity, duration: settings.tickerSpeed, ease: "linear" }}
                            className="inline-block px-4 text-white/90 text-lg font-light tracking-wide"
                        >
                            {settings.tickerText}
                        </motion.div>
                    </div>
                </div>
            )}
      </footer>

      {/* Modals */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <Assistant 
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        accentColor={theme.accentClass}
      />

      <NavigationModal 
        isOpen={showNavModal}
        onClose={() => setShowNavModal(false)}
        services={activeSlides}
        onNavigate={jumpToService}
        accentColor={settings.theme === 'custom' ? settings.customColor : undefined}
      />
    </div>
  );
};

export default App;