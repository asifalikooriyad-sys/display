import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceItem } from '../types';
import { Icon } from './Icons';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  onNavigate: (id: string) => void;
  accentColor?: string;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({ isOpen, onClose, services, onNavigate, accentColor = '#d97706' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-8"
      >
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
             <Icon name="Grid" className="w-8 h-8" style={{ color: accentColor }} />
             Services Menu
          </h2>
          <button onClick={onClose} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
          {services.map((service, i) => {
             // Logic: Background > Custom Image > Generated Keyword
             const bgImage = service.background || service.customImage || `https://picsum.photos/seed/${service.imageKeyword}/400/400`;
             
             return (
                 <motion.button
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      onNavigate(service.id);
                      onClose();
                    }}
                    className="group relative h-40 rounded-xl overflow-hidden border border-white/10 hover:border-white/40 transition-all text-left shadow-lg hover:shadow-2xl hover:-translate-y-1"
                 >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    
                    {/* Content: Icon alongside Title */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                       <div className="flex items-center gap-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                           <div 
                                className="p-2.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-colors shrink-0"
                                style={ service.id === 'hero' ? {} : { borderColor: `${accentColor}40` } }
                           >
                              <Icon name={service.icon} className="w-6 h-6 text-white" />
                           </div>
                           <h3 className="text-base md:text-lg font-bold text-white leading-tight group-hover:text-amber-400 transition-colors drop-shadow-md">
                             {service.title}
                           </h3>
                       </div>
                    </div>
                 </motion.button>
             );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};