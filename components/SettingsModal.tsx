
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppSettings } from '../types';
import { THEMES, SERVICES, DEFAULT_SETTINGS } from '../constants';
import { Icon } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

type TabId = 'general' | 'visuals' | 'display' | 'slides' | 'content' | 'system';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) setLocalSettings(settings);
  }, [isOpen, settings]);

  const handleChange = (key: keyof AppSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBackgroundOverride = (serviceId: string, value: string) => {
      setLocalSettings(prev => {
          const currentOverrides = prev.contentOverrides || {};
          const serviceOverrides = currentOverrides[serviceId] || {};
          const updatedServiceOverrides = { ...serviceOverrides, background: value };
          if (!value) delete updatedServiceOverrides.background;
          
          return {
              ...prev,
              contentOverrides: { ...currentOverrides, [serviceId]: updatedServiceOverrides }
          };
      });
  };

  const handleUnifiedMediaChange = (serviceId: string, type: 'image' | 'video', value: string) => {
      setLocalSettings(prev => {
          const currentOverrides = prev.contentOverrides || {};
          const serviceOverrides = currentOverrides[serviceId] || {};
          
          let updatedServiceOverrides = { ...serviceOverrides };
          
          if (type === 'image') {
              updatedServiceOverrides.customImage = value;
              delete updatedServiceOverrides.videoUrl; // Clear video if image selected
              if (!value) delete updatedServiceOverrides.customImage;
          } else {
              updatedServiceOverrides.videoUrl = value;
              delete updatedServiceOverrides.customImage; // Clear image if video selected
              if (!value) delete updatedServiceOverrides.videoUrl;
          }
          
          return {
              ...prev,
              contentOverrides: {
                  ...currentOverrides,
                  [serviceId]: updatedServiceOverrides
              }
          };
      });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("File size too large. Please upload an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleService = (id: string) => {
    const current = localSettings.enabledServices;
    const next = current.includes(id) 
      ? current.filter(s => s !== id) 
      : [...current, id];
    handleChange('enabledServices', next);
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
      if (window.confirm("Are you sure you want to reset all settings to factory defaults?")) {
          setLocalSettings(DEFAULT_SETTINGS);
      }
  };

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: 'Briefcase' },
    { id: 'visuals', label: 'Visuals', icon: 'Star' },
    { id: 'display', label: 'Display', icon: 'Grid' },
    { id: 'slides', label: 'Slides', icon: 'Check' },
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'system', label: 'System', icon: 'Cog' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} 
          animate={{ scale: 1, y: 0 }} 
          className="bg-stone-900 border border-white/20 rounded-2xl w-full max-w-5xl h-[90vh] md:h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Icon name="Cog" className="w-6 h-6 text-amber-500" />
              Settings & Configuration
            </h2>
            <button onClick={onClose} className="text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs - Horizontal on mobile, Vertical on Desktop */}
            <div className="w-full md:w-64 bg-black/20 border-b md:border-b-0 md:border-r border-white/10 flex flex-row md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20 font-medium' 
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <Icon name={tab.icon} className="w-5 h-5 shrink-0" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-stone-900 to-black scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                
                {/* --- GENERAL TAB --- */}
                {activeTab === 'general' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <h3 className="text-2xl font-light text-white mb-6 border-b border-white/10 pb-4">General Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">Company Name (English)</label>
                                    <input 
                                        type="text" 
                                        value={localSettings.companyName}
                                        onChange={(e) => handleChange('companyName', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none focus:bg-white/10 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">Company Name (Arabic)</label>
                                    <input 
                                        type="text" 
                                        value={localSettings.companyNameAr}
                                        onChange={(e) => handleChange('companyNameAr', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none font-[Cairo] text-right focus:bg-white/10 transition-colors"
                                        dir="rtl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">Location Address</label>
                                    <input 
                                        type="text" 
                                        value={localSettings.location}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none focus:bg-white/10 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">Contact Phone</label>
                                    <input 
                                        type="text" 
                                        value={localSettings.contactPhone}
                                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none focus:bg-white/10 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">WhatsApp Number</label>
                                    <input 
                                        type="text" 
                                        value={localSettings.contactWhatsapp}
                                        onChange={(e) => handleChange('contactWhatsapp', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none focus:bg-white/10 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={localSettings.contactEmail}
                                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none focus:bg-white/10 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- VISUALS TAB --- */}
                {activeTab === 'visuals' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <h3 className="text-2xl font-light text-white mb-6 border-b border-white/10 pb-4">Visuals & Branding</h3>
                        
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-6">
                            <label className="block text-xs text-white/60 mb-3 uppercase tracking-wider">Upload Company Logo</label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                    {localSettings.logo ? (
                                        <img src={localSettings.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <Icon name="Home" className="text-white/20 w-8 h-8" />
                                    )}
                                    {localSettings.logo && (
                                        <button 
                                            onClick={() => handleChange('logo', null)}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 text-xs font-bold"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:uppercase file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer"
                                    />
                                    <p className="text-xs text-white/30 mt-2">Recommended: Transparent PNG, Max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-white/60 mb-3 uppercase tracking-wider">Theme Presets</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.keys(THEMES).map(key => (
                                    <button 
                                        key={key}
                                        onClick={() => handleChange('theme', key)}
                                        className={`p-3 rounded-lg border text-sm text-left transition-all ${
                                            localSettings.theme === key 
                                            ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                                            : 'border-white/10 text-white/60 hover:bg-white/5'
                                        }`}
                                    >
                                        {THEMES[key].name}
                                    </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">Custom Brand Color</label>
                                    <div className="flex gap-3 items-center">
                                        <input 
                                            type="color" 
                                            value={localSettings.customColor}
                                            onChange={(e) => {
                                                handleChange('customColor', e.target.value);
                                                handleChange('theme', 'custom');
                                            }}
                                            className="h-10 w-20 rounded bg-transparent cursor-pointer border-0"
                                        />
                                        <span className="text-white/50 text-sm font-mono bg-white/5 px-2 py-1 rounded">{localSettings.customColor}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-xs text-white/60 uppercase tracking-wider">Background Dimming</label>
                                        <span className="text-xs text-amber-500">{Math.round(localSettings.overlayOpacity * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" max="0.95" step="0.05"
                                        value={localSettings.overlayOpacity}
                                        onChange={(e) => handleChange('overlayOpacity', parseFloat(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- DISPLAY TAB --- */}
                {activeTab === 'display' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <h3 className="text-2xl font-light text-white mb-6 border-b border-white/10 pb-4">Display & Interface</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <label className="block text-xs text-white/60 mb-3 uppercase tracking-wider">Slide Duration</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="number" 
                                        min="5" max="120"
                                        value={localSettings.slideDuration}
                                        onChange={(e) => handleChange('slideDuration', parseInt(e.target.value))}
                                        className="w-20 bg-black/40 border border-white/10 rounded-lg p-3 text-center text-white focus:border-amber-500 outline-none"
                                    />
                                    <span className="text-white/50 text-sm">Seconds per slide</span>
                                </div>
                            </div>

                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <label className="block text-xs text-white/60 mb-3 uppercase tracking-wider">Clock Format</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleChange('clockFormat', '12h')}
                                        className={`flex-1 p-3 rounded-lg border text-sm transition-all ${localSettings.clockFormat === '12h' ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
                                    >
                                        12 Hours (AM/PM)
                                    </button>
                                    <button 
                                        onClick={() => handleChange('clockFormat', '24h')}
                                        className={`flex-1 p-3 rounded-lg border text-sm transition-all ${localSettings.clockFormat === '24h' ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
                                    >
                                        24 Hours
                                    </button>
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <input 
                                        type="checkbox"
                                        id="showDate"
                                        checked={localSettings.showDate}
                                        onChange={(e) => handleChange('showDate', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                                    />
                                    <label htmlFor="showDate" className="text-white text-sm">Show Date below Clock</label>
                                </div>
                            </div>

                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <label className="block text-xs text-white/60 mb-3 uppercase tracking-wider">Transition Effect</label>
                                <select 
                                    value={localSettings.transitionEffect}
                                    onChange={(e) => handleChange('transitionEffect', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                                >
                                    <option value="fade">Fade (Classic)</option>
                                    <option value="slide">Slide (Dynamic)</option>
                                    <option value="zoom">Zoom (Cinematic)</option>
                                </select>
                            </div>

                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <label className="block text-xs text-white/60 mb-3 uppercase tracking-wider">Navigation Bar</label>
                                <select 
                                    value={localSettings.navDockMode}
                                    onChange={(e) => handleChange('navDockMode', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                                >
                                    <option value="auto">Auto-Hide (Hover)</option>
                                    <option value="visible">Always Visible</option>
                                    <option value="hidden">Hidden (Clean Mode)</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-medium">News Ticker</h4>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="showTicker" className="text-white/60 text-sm">Enable</label>
                                    <input 
                                        type="checkbox"
                                        id="showTicker"
                                        checked={localSettings.showTicker}
                                        onChange={(e) => handleChange('showTicker', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-white/60 mb-1">Ticker Text Content</label>
                                    <textarea 
                                        value={localSettings.tickerText}
                                        onChange={(e) => handleChange('tickerText', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none h-20 text-sm"
                                        placeholder="Enter scrolling text here..."
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-xs text-white/60">Scroll Speed</label>
                                        <span className="text-xs text-amber-500">{localSettings.tickerSpeed}s</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="10" max="60" step="1"
                                        value={localSettings.tickerSpeed}
                                        onChange={(e) => handleChange('tickerSpeed', parseInt(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-white/30 mt-1">
                                        <span>Fast</span>
                                        <span>Slow</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- SLIDES TAB --- */}
                {activeTab === 'slides' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                            <h3 className="text-2xl font-light text-white">Active Slides</h3>
                            <span className="text-sm text-white/50">{localSettings.enabledServices.length} Selected</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {SERVICES.map(service => (
                            <button
                                key={service.id}
                                onClick={() => toggleService(service.id)}
                                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                    localSettings.enabledServices.includes(service.id)
                                    ? 'border-green-500/50 bg-green-500/10 text-white'
                                    : 'border-white/10 bg-white/5 text-white/40 grayscale'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                    localSettings.enabledServices.includes(service.id) ? 'bg-green-500 border-green-500' : 'border-white/20'
                                }`}>
                                    {localSettings.enabledServices.includes(service.id) && <Icon name="Check" className="w-3 h-3 text-white" />}
                                </div>
                                <span className="font-medium truncate">{service.title}</span>
                            </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- CONTENT TAB --- */}
                {activeTab === 'content' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="border-b border-white/10 pb-4 mb-6">
                            <h3 className="text-2xl font-light text-white">Content Management</h3>
                            <p className="text-white/50 text-sm mt-1">Override default images or add videos for specific slides.</p>
                        </div>

                        <div className="space-y-3">
                            {SERVICES.map(service => {
                                const overrides = localSettings.contentOverrides?.[service.id] || {};
                                const activeMediaType = overrides.videoUrl ? 'video' : 'image';
                                const isExpanded = expandedServiceId === service.id;
                                
                                return (
                                <div key={service.id} className={`bg-white/5 border ${isExpanded ? 'border-amber-500/30' : 'border-white/10'} rounded-xl overflow-hidden transition-colors`}>
                                    <button 
                                        onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                                        className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/5 rounded-lg text-white/70">
                                                <Icon name={service.icon} className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-white">{service.title}</span>
                                            {(overrides.customImage || overrides.videoUrl || overrides.background) && (
                                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-wider">Modified</span>
                                            )}
                                        </div>
                                        <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} className="w-4 h-4 text-white/50" />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 border-t border-white/10 space-y-6 bg-black/20">
                                                    <div>
                                                        <label className="block text-xs text-white/60 mb-2 uppercase tracking-wider">Background Wallpaper URL</label>
                                                        <input 
                                                            type="text" 
                                                            value={overrides.background || ''}
                                                            onChange={(e) => handleBackgroundOverride(service.id, e.target.value)}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none" 
                                                            placeholder="https://example.com/wallpaper.jpg"
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="block text-xs text-white/60 uppercase tracking-wider">Main Feature Content</label>
                                                            <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                                                                <button 
                                                                    onClick={() => {
                                                                        const url = overrides.videoUrl || overrides.customImage || '';
                                                                        handleUnifiedMediaChange(service.id, 'image', url);
                                                                    }}
                                                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeMediaType === 'image' ? 'bg-amber-600 text-white shadow' : 'text-white/50 hover:text-white'}`}
                                                                >
                                                                    Image
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        const url = overrides.customImage || overrides.videoUrl || '';
                                                                        handleUnifiedMediaChange(service.id, 'video', url);
                                                                    }}
                                                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeMediaType === 'video' ? 'bg-amber-600 text-white shadow' : 'text-white/50 hover:text-white'}`}
                                                                >
                                                                    Video
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <input 
                                                            type="text" 
                                                            value={activeMediaType === 'video' ? (overrides.videoUrl || '') : (overrides.customImage || '')}
                                                            onChange={(e) => handleUnifiedMediaChange(service.id, activeMediaType, e.target.value)}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                                                            placeholder={activeMediaType === 'video' ? "https://example.com/video.mp4" : "https://example.com/image.jpg"}
                                                        />
                                                        <p className="text-[10px] text-white/30 mt-2 flex items-center gap-1">
                                                            <Icon name="Bot" className="w-3 h-3" />
                                                            {activeMediaType === 'video' 
                                                                ? "Paste a direct link to an MP4/WebM video file." 
                                                                : "Paste a direct link to a PNG, JPG, or GIF image."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* --- SYSTEM TAB --- */}
                {activeTab === 'system' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <h3 className="text-2xl font-light text-white mb-6 border-b border-white/10 pb-4">System & Performance</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-4">Kiosk Behavior</h4>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                                    <label htmlFor="hideCursor" className="text-white text-sm">Hide Mouse Cursor</label>
                                    <input 
                                        type="checkbox"
                                        id="hideCursor"
                                        checked={localSettings.hideCursor}
                                        onChange={(e) => handleChange('hideCursor', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                                    <label htmlFor="showProgressBar" className="text-white text-sm">Show Progress Bar</label>
                                    <input 
                                        type="checkbox"
                                        id="showProgressBar"
                                        checked={localSettings.showProgressBar}
                                        onChange={(e) => handleChange('showProgressBar', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                                    <label htmlFor="slideShuffle" className="text-white text-sm">Shuffle Slides</label>
                                    <input 
                                        type="checkbox"
                                        id="slideShuffle"
                                        checked={localSettings.slideShuffle}
                                        onChange={(e) => handleChange('slideShuffle', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-4">Performance</h4>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                                    <label htmlFor="enableParticles" className="text-white text-sm">Particle Effects</label>
                                    <input 
                                        type="checkbox"
                                        id="enableParticles"
                                        checked={localSettings.enableParticles}
                                        onChange={(e) => handleChange('enableParticles', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                                    <label htmlFor="enableBlurEffects" className="text-white text-sm">High Quality Blur</label>
                                    <input 
                                        type="checkbox"
                                        id="enableBlurEffects"
                                        checked={localSettings.enableBlurEffects}
                                        onChange={(e) => handleChange('enableBlurEffects', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                                    <label htmlFor="showHeroCTA" className="text-white text-sm">Show Hero Buttons</label>
                                    <input 
                                        type="checkbox"
                                        id="showHeroCTA"
                                        checked={localSettings.showHeroCTA}
                                        onChange={(e) => handleChange('showHeroCTA', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-stone-900 flex justify-between gap-3 shrink-0">
             <button 
                onClick={handleReset} 
                className="px-6 py-3 rounded-lg text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors text-sm font-medium"
            >
                Reset to Default
            </button>
            <div className="flex gap-3">
                <button onClick={onClose} className="px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-colors font-medium">Cancel</button>
                <button onClick={handleSave} className="px-8 py-3 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-500 transition-colors shadow-lg shadow-amber-900/40">Save Changes</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
