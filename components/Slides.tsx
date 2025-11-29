
import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ServiceItem, SlideProps, ThemeConfig } from '../types';
import { Icon } from './Icons';

// -------------------- PARTICLE BACKGROUND --------------------
const ParticleBackground: React.FC<{ color: string }> = ({ color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    let animationFrameId: number;
    
    const rgb = hexToRgb(color);

    const init = () => {
      particles = [];
      // Adjust density based on screen size
      const particleCount = Math.floor((width * height) / 20000); 
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3, // Gentle speed
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
        });
      }
    };

    const animate = () => {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges (soft bounce)
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
            ctx.fill();

            // Connections
            for (let j = i; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    // Opacity based on distance
                    const alpha = (1 - distance / 150) * 0.2;
                    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        if (canvas) {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            init();
        }
    };

    init();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    }
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// -------------------- HERO SLIDE / DASHBOARD --------------------
const HeroSlide: React.FC<SlideProps> = ({ data, theme, customColor, onNavigate, activeServices, settings }) => {
  const accentColor = customColor || '#d97706'; // Gold default
  const particlesEnabled = settings?.enableParticles ?? true;
  const showCTA = settings?.showHeroCTA ?? false;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Animated Particle Network */}
        {particlesEnabled && <ParticleBackground color={accentColor} />}

        {/* Abstract Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {/* Main Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center -mt-16">
            
            {/* Logo Container with Premium 3D Levitation Effect */}
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="relative mb-10"
            >
                {/* Rotating Rings (Slower, elegant) */}
                <div className="absolute inset-[-30px] rounded-full border border-white/5 border-t-white/30 animate-[spin_15s_linear_infinite]"></div>
                <div className="absolute inset-[-15px] rounded-full border border-white/5 border-b-white/20 animate-[spin_20s_linear_infinite_reverse]"></div>
                
                {/* 3D Glass Showcase */}
                <div className="w-48 h-48 md:w-64 md:h-64 relative perspective-1000 group">
                     
                     <motion.div
                        animate={{ 
                            y: [-15, 15, -15], // Gentle floating
                            rotateX: [5, -5, 5], // Subtle 3D tilt X
                            rotateY: [-20, 20, -20] // Subtle 3D spin/sway Y
                        }}
                        transition={{
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                            rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                            rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-full h-full bg-black/40 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        style={{ transformStyle: 'preserve-3d' }}
                     >
                        {/* Dynamic Shimmer Effect */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -skew-x-12"
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
                        />
                        
                        {/* Inner Glow */}
                        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"></div>

                        {settings?.logo ? (
                            <motion.img 
                                src={settings.logo} 
                                alt="Logo" 
                                className="w-3/4 h-3/4 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                                style={{ transform: 'translateZ(20px)' }} // Push logo forward in 3D space
                            />
                        ) : (
                            <Icon name="Briefcase" className="w-24 h-24 text-white/80 drop-shadow-xl" />
                        )}
                     </motion.div>
                </div>
            </motion.div>

            {/* Typography */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-4"
            >
                <h3 className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase text-white/60">Welcome to</h3>
                <h1 
                    className="text-5xl md:text-8xl font-bold font-[Cairo] tracking-tight leading-tight uppercase drop-shadow-2xl"
                    style={{ 
                        background: `linear-gradient(to bottom, #fff, ${accentColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Excellent
                </h1>
                <h2 className="text-3xl md:text-5xl font-light text-white tracking-widest uppercase">
                    Typing & Travels
                </h2>
                 <p className="text-2xl md:text-3xl font-[Cairo] text-white/80 mt-2">
                    {settings?.companyNameAr}
                </p>
            </motion.div>
        </div>

        {/* Bottom HUD / Action Bar */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-32 md:bottom-16 left-0 right-0 flex justify-center px-4"
        >
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full p-4 md:px-10 md:py-4 flex flex-col md:flex-row items-center gap-4 md:gap-16 shadow-2xl w-auto">
                
                {/* Contact */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full text-white/70 border border-white/5">
                        <Icon name="Phone" className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="text-xs text-white/40 uppercase tracking-widest">Contact</div>
                        <div className="text-sm font-semibold text-white">{settings?.contactPhone}</div>
                    </div>
                </div>

                {showCTA && (
                    <>
                        <div className="w-full h-px bg-white/10 md:w-px md:h-10"></div>
                        {/* Center: CTA */}
                        <button 
                            onClick={() => onNavigate('MENU')}
                            className="flex-1 md:flex-none px-8 md:px-16 py-4 bg-white text-black rounded-full font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3"
                        >
                            <span>Explore Services</span>
                            <Icon name="Grid" className="w-5 h-5" />
                        </button>
                         <div className="w-full h-px bg-white/10 md:w-px md:h-10"></div>
                    </>
                )}
                
                {!showCTA && <div className="w-full h-px bg-white/10 md:w-px md:h-10"></div>}

                 {/* Location */}
                 <div className="flex items-center gap-4">
                     <div className="p-3 bg-white/5 rounded-full text-white/70 border border-white/5 md:order-2">
                        <Icon name="MapPin" className="w-5 h-5" />
                    </div>
                    <div className="text-left md:text-right md:order-1">
                        <div className="text-xs text-white/40 uppercase tracking-widest">Location</div>
                        <div className="text-sm font-semibold text-white truncate max-w-[200px]">{settings?.location}</div>
                    </div>
                </div>

            </div>
        </motion.div>
    </div>
  );
};

// -------------------- GOLDEN VISA SLIDE --------------------
const GoldenVisaSlide: React.FC<SlideProps> = ({ data, customColor, onNavigate }) => {
  const accentColor = customColor || '#f59e0b'; // Default amber-500

  return (
    <div className="h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-16 gap-12 pb-32 relative">
        <div className="flex-1 space-y-6 z-10">
             <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <span 
                    className="inline-block px-4 py-1 rounded bg-white/10 border border-white/20 font-bold uppercase tracking-widest text-sm mb-4"
                    style={{ color: accentColor, borderColor: `${accentColor}40` }}
                >
                    Premium Service
                </span>
                <h2 
                    className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg"
                    style={{ color: '#fffbeb' }} // amber-50
                >
                    {data.title}
                </h2>
                <p className="text-2xl text-white/80 font-light leading-relaxed max-w-xl">{data.description}</p>
                
                <ul className="grid grid-cols-2 gap-4 mt-8">
                    {data.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-lg text-white/90">
                            <div className="rounded-full p-1 bg-white">
                                <Icon name="Check" className="w-4 h-4 text-black" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
        
        <div className="flex-1 flex justify-center z-10">
            {/* 3D Card Effect - Landscape Credit Card Size */}
            <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative w-full max-w-[500px] aspect-[1.586/1] rounded-2xl shadow-2xl perspective-1000 group"
                style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #000 100%)`, boxShadow: `0 0 60px ${accentColor}40` }}
            >
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                
                {/* Glassy Surface */}
                <div className="h-full w-full bg-black/80 rounded-2xl flex flex-col justify-between p-6 md:p-8 border border-white/10 backdrop-blur-sm relative overflow-hidden">
                    
                    {/* Top Row: Chip & Logo */}
                    <div className="flex justify-between items-start z-10">
                         <div className="flex items-center gap-4">
                            {/* EMV Chip Graphic - Enhanced */}
                            <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-md border border-white/20 relative overflow-hidden opacity-90 shadow-inner">
                                <div className="absolute top-1/2 left-0 w-full h-px bg-black/20"></div>
                                <div className="absolute left-1/2 top-0 h-full w-px bg-black/20"></div>
                                <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-black/20 rounded-md -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                            </div>
                             <div className="hidden sm:block">
                                <Icon name="Globe" className="w-8 h-8 opacity-80" style={{ color: accentColor }} />
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="font-bold text-lg tracking-widest" style={{ color: accentColor }}>GOLDEN VISA</div>
                             <div className="text-white/40 text-[10px] tracking-[0.2em] uppercase">UAE Residency</div>
                         </div>
                    </div>

                    {/* Middle Row: Large Number */}
                    <div className="flex items-baseline gap-3 z-10 ml-2 mt-2">
                         <div 
                             className="text-7xl md:text-9xl font-serif leading-none tracking-tighter drop-shadow-2xl"
                             style={{ 
                                 color: accentColor,
                                 textShadow: `0 4px 30px ${accentColor}50` 
                            }}
                         >
                            10
                        </div>
                         <div className="flex flex-col">
                            <span className="text-white/90 text-xl md:text-2xl tracking-[0.2em] uppercase font-light">Years</span>
                            <span className="text-white/40 text-xs tracking-wider">Self-Sponsored</span>
                         </div>
                    </div>
                    
                     {/* Decorative Gloss */}
                     <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-[60px] pointer-events-none mix-blend-overlay"></div>
                </div>
            </motion.div>
        </div>
    </div>
  );
};

// -------------------- EMIRATES ID SPECIAL SLIDE (3D GLASS + PARALLAX) --------------------
const EmiratesIdSlide: React.FC<SlideProps> = ({ data, onNavigate, settings }) => {
  // Parallax Logic using mouse position relative to center of screen
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Create 3D Tilt Effect
  const rotateX = useTransform(y, [-500, 500], [10, -10]); 
  const rotateY = useTransform(x, [-800, 800], [-10, 10]);

  // Create Parallax Effect for the texture inside (moves opposite to tilt)
  const bgX = useTransform(x, [-800, 800], [50, -50]); 
  const bgY = useTransform(y, [-500, 500], [50, -50]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // Calculate position relative to the center of the window
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };
  
  const blurEnabled = settings?.enableBlurEffects ?? true;

  return (
    <div 
        className="h-full w-full flex items-center justify-center relative p-8 pb-32 overflow-hidden" 
        style={{ perspective: '2000px' }}
        onMouseMove={handleMouseMove}
    >
         {/* Floating Glass Container with 3D Tilt */}
         <motion.div
           initial={{ rotateX: 20, rotateY: -20, opacity: 0, scale: 0.8 }}
           animate={{ rotateX: 0, rotateY: 0, opacity: 1, scale: 1 }}
           style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: 'preserve-3d', // Crucial for 3D effect
                background: blurEnabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(10, 10, 10, 0.9)',
                backdropFilter: blurEnabled ? 'blur(20px)' : 'none',
                boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255,255,255,0.1)',
           }}
           transition={{ duration: 1.2, type: "spring" }}
           className="relative w-full max-w-6xl h-[70vh] rounded-[3rem] flex flex-col md:flex-row overflow-hidden border border-white/10"
         >
             {/* Dynamic Texture Overlay - Internal Parallax Layer */}
             {/* This layer moves separately inside the glass to create depth */}
            {data.customImage && (
                <motion.div 
                    className="absolute inset-[-100px] bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none filter blur-[2px] contrast-125 saturate-0"
                    style={{ 
                        backgroundImage: `url(${data.customImage})`,
                        x: bgX,
                        y: bgY,
                    }}
                />
            )}
            
            {/* Shimmer Effect Surface */}
            <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear", delay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                style={{ translateZ: 50 }} // Floating above
            />
            
            {/* Content Left */}
            <div className="flex-1 p-12 flex flex-col justify-center relative z-20" style={{ transform: 'translateZ(60px)' }}>
                <motion.div 
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                         <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                             <Icon name="IdCard" className="w-8 h-8 text-white" />
                         </div>
                         <span className="text-white/60 uppercase tracking-widest text-sm font-semibold">Federal Authority</span>
                    </div>

                    <h2 className="text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
                        Emirates ID<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">Services</span>
                    </h2>
                    
                    <p className="text-xl text-white/80 font-light leading-relaxed max-w-md mb-8">
                        {data.description}. We handle applications, renewals, and replacements with express typing.
                    </p>

                    <div className="space-y-4">
                        {data.features.map((feature, i) => (
                             <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="flex items-center gap-3"
                             >
                                 <div className="w-8 h-1 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                                 <span className="text-lg text-white font-medium">{feature}</span>
                             </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Visual Right - 3D Floating Element */}
            <div className="flex-1 relative flex items-center justify-center p-12" style={{ transform: 'translateZ(100px)' }}>
                <motion.div
                    animate={{ 
                        y: [-15, 15, -15],
                        rotateX: [5, -5, 5],
                        rotateY: [5, -5, 5]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="relative w-full max-w-md aspect-[1.58/1] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden border border-white/20 group-hover:scale-105 transition-transform duration-500 bg-slate-800"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                     {/* The ID Card Graphic using customImage directly on card too */}
                     <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ 
                            backgroundImage: data.customImage ? `url(${data.customImage})` : undefined,
                            backgroundColor: '#1e293b' // fallback
                        }}
                     />
                     
                     {/* Glass Overlay on the card itself for extra gloss */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent mix-blend-overlay"></div>
                     <div className="absolute bottom-4 left-4 right-4 h-1/3 bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center justify-between">
                         <div className="text-white text-xs">
                             <div className="opacity-50">ID NUMBER</div>
                             <div className="font-mono tracking-widest text-shadow">784-1234-56789-1</div>
                         </div>
                         <Icon name="Check" className="w-6 h-6 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                     </div>
                </motion.div>

                {/* Decorative floating particles behind the card */}
                <motion.div 
                    animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-20 right-20 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl mix-blend-screen"
                    style={{ transform: 'translateZ(-50px)' }}
                />
            </div>
         </motion.div>
    </div>
  );
};


// -------------------- STANDARD/KIDS SLIDE (UPDATED GLASS) --------------------
const ServiceSlide: React.FC<SlideProps> = ({ data, theme, customColor, onNavigate, settings }) => {
  const isKids = data.type === 'kids';
  
  // Determine accent color for shadows and highlights
  // Use custom color, or fall back to theme preset colors logic
  const accentColor = customColor || (theme.name === 'Executive Wood' ? '#d97706' : '#38bdf8');
  const blurEnabled = settings?.enableBlurEffects ?? true;

  // Logic: Background > Custom Image > Generated Keyword
  const mainImage = data.background || data.customImage || `https://picsum.photos/seed/${data.imageKeyword}/800/800`;
  const isVideo = data.videoUrl && data.videoUrl.trim() !== '';

  return (
    <div className="h-full w-full flex items-center justify-center relative p-8 pb-32">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                y: [-8, 8, -8] // Subtle floating animation
            }}
            transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
            className="relative w-full max-w-7xl flex flex-col md:flex-row gap-8 md:gap-16 p-8 md:p-12 rounded-[2.5rem] overflow-hidden"
            style={{
                // Glassmorphism vs High Performance Styles
                background: blurEnabled 
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)' 
                    : 'rgba(10, 10, 10, 0.9)',
                backdropFilter: blurEnabled ? 'blur(20px)' : 'none',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: `0 20px 60px -15px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)`
            }}
        >
             {/* Decorative colored glow based on accent - Only show if blur enabled to avoid messy look */}
            {blurEnabled && (
                <div 
                    className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none"
                    style={{ background: accentColor }}
                />
            )}
            
            {/* Content Left */}
            <div className="flex-1 flex flex-col justify-center z-10">
                {/* Header with Prominent Icon */}
                <div className="flex items-start gap-5 mb-6">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ 
                            scale: 1,
                            rotate: data.id === 'business-setup' ? [0, -10, 10, -5, 5, 0] : 0
                        }}
                        whileHover={{ y: -8, scale: 1.05 }}
                        transition={{ 
                            scale: { delay: 0.2, type: "spring" },
                            rotate: { delay: 1, duration: 3, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" },
                            y: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-lg flex items-center justify-center shrink-0 relative overflow-hidden cursor-pointer group"
                    >
                        {/* Shimmer Effect for Flights */}
                        {data.id === 'flights' && (
                             <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent skew-x-12"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2, ease: "linear" }}
                            />
                        )}
                        {/* Bounce Animation on Hover for All Icons */}
                        <motion.div
                            whileHover={{ y: [-2, 2, -2] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            <Icon name={data.icon} className="w-10 h-10" style={{ color: accentColor }} />
                        </motion.div>
                    </motion.div>
                    <div className="flex-1 pt-1">
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`text-4xl md:text-5xl font-bold text-white mb-2 leading-tight ${isKids ? 'font-sans' : ''} drop-shadow-lg`}
                        >
                            {data.title}
                        </motion.h2>
                         {data.details?.processingTime && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
                            >
                                <span className="text-xs uppercase tracking-wider text-white/60">Time:</span>
                                <span className="text-sm font-bold" style={{ color: accentColor }}>{data.details.processingTime}</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-white/80 font-light mb-8 max-w-xl leading-relaxed border-l-4 pl-4 border-white/20"
                >
                    {data.description}
                </motion.p>
                
                {data.details?.requirements ? (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-3">Documents Required</h3>
                        <div className="space-y-2">
                             {data.details.requirements.map((req, i) => (
                                 <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.05) }}
                                    className="flex items-start gap-3"
                                 >
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"></div>
                                    <span className="text-white/90">{req}</span>
                                 </motion.div>
                             ))}
                        </div>
                    </div>
                ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.features.map((feature, i) => (
                           <motion.div 
                               key={i}
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: 0.2 + (i * 0.1) }}
                               className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group"
                           >
                               <div 
                                   className={`p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors`}
                                   style={{ color: accentColor }}
                               >
                                   <Icon name="Check" className="w-5 h-5 fill-current" />
                               </div>
                               <span className="text-lg text-white/90 font-medium">{feature}</span>
                           </motion.div>
                       ))}
                   </div>
                )}
            </div>

            {/* Content Right (Image or Video) */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center gap-6">
                 <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 group"
                    style={{ boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5)` }}
                 >
                    {isVideo ? (
                        <video 
                            src={data.videoUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : (
                        <motion.img 
                            src={mainImage}
                            alt={data.title}
                            className="w-full h-full object-cover"
                            animate={data.id === 'family-visa' ? {
                                scale: [1, 1.15, 1],
                                y: [0, -15, 0]
                            } : {}}
                            transition={{ 
                                duration: 8, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                        />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                         {/* Watch Intro button removed */}
                    </div>
                 </motion.div>

                 {/* Key Features Pill Array (if details were shown on left, show features here to not lose them) */}
                 {data.details?.requirements && (
                     <div className="flex flex-wrap gap-2 justify-center">
                         {data.features.slice(0, 4).map((f, i) => (
                             <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">
                                 {f}
                             </span>
                         ))}
                     </div>
                 )}
            </div>
        </motion.div>
    </div>
  );
};

// -------------------- CONTACT SLIDE (PREMIUM 3D MAP) --------------------
const ContactSlide: React.FC<SlideProps> = ({ theme, customColor, settings }) => {
    const accentColor = customColor || '#d97706';

    return (
        <div className="h-full flex flex-col items-center justify-center relative p-8 pb-32 overflow-hidden">
             {/* Background Elements */}
             <div className="absolute -left-20 -top-20 w-[600px] h-[600px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

             <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 items-stretch h-[65vh]">
                
                {/* Left: 3D Map Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -50, rotateY: 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-[1.5] relative rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10 group perspective-1000"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Styled Map Image (Stock) */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1920&auto=format&fit=crop')` }} // Dark Map Style
                    >
                         <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
                    </div>
                    
                    {/* Floating Location Markers */}
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="relative">
                             <motion.div 
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="relative z-10"
                             >
                                 <Icon name="MapPin" className="w-16 h-16 drop-shadow-2xl" style={{ color: accentColor }} />
                             </motion.div>
                             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/50 blur-sm rounded-full animate-pulse"></div>
                             
                             {/* Ripple Effect */}
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 rounded-full opacity-0 animate-ping" style={{ borderColor: accentColor }}></div>
                         </div>
                    </div>

                    {/* Glass Overlay with Address */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center justify-between">
                         <div>
                             <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Current Location</div>
                             <div className="text-white font-semibold truncate">{settings?.location}</div>
                         </div>
                         <div className="p-2 bg-white/10 rounded-lg">
                             <Icon name="Grid" className="w-5 h-5 text-white" />
                         </div>
                    </div>
                </motion.div>

                {/* Right: Contact Details Panel */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 flex flex-col gap-4"
                >
                     {/* Info Cards */}
                     <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center gap-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">Visit Us</h2>
                            <p className="text-white/60">We are open 7 days a week</p>
                        </div>

                        <div className="space-y-6">
                             {/* Phone */}
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                     <Icon name="Phone" className="w-5 h-5 text-white" />
                                 </div>
                                 <div>
                                     <div className="text-xs text-white/40 uppercase tracking-widest">Phone Support</div>
                                     <div className="text-xl font-mono text-white" style={{ color: accentColor }}>{settings?.contactPhone}</div>
                                 </div>
                             </div>
                             
                             {/* Email */}
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                     <Icon name="Briefcase" className="w-5 h-5 text-white" />
                                 </div>
                                 <div>
                                     <div className="text-xs text-white/40 uppercase tracking-widest">Email Inquiry</div>
                                     <div className="text-lg text-white">{settings?.contactEmail}</div>
                                 </div>
                             </div>

                             {/* Hours */}
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                     <Icon name="Bot" className="w-5 h-5 text-white" />
                                 </div>
                                 <div>
                                     <div className="text-xs text-white/40 uppercase tracking-widest">Working Hours</div>
                                     <div className="text-sm text-white font-medium">Sat-Thu: 9am-1pm & 5pm-10pm</div>
                                     <div className="text-sm text-white font-medium">Fri: 9am-12pm & 5pm-10pm</div>
                                 </div>
                             </div>
                        </div>

                        <button className="mt-4 w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                             Get Directions <Icon name="MapPin" className="w-4 h-4" />
                        </button>
                     </div>
                </motion.div>
             </div>
        </div>
    );
};

// -------------------- REVIEWS SLIDE (TESTIMONIAL CAROUSEL) --------------------
const ReviewsSlide: React.FC<SlideProps> = ({ customColor }) => {
    const accentColor = customColor || '#d97706';
    
    // Internal state for carousel
    const [currentIndex, setCurrentIndex] = useState(0);

    const TESTIMONIALS = [
        { name: 'Mohammed Al Futtaim', role: 'Business Owner', text: 'Excellent Typing processed my company trade license renewal in record time. Highly recommended!', rating: 5 },
        { name: 'Sarah Jenkins', role: 'Teacher', text: 'The Golden Visa process was so smooth. They handled all the attestations and documents perfectly.', rating: 5 },
        { name: 'Rajesh Kumar', role: 'Engineer', text: 'Best service for family visa sponsorship. The staff is very knowledgeable about the new rules.', rating: 5 },
        { name: 'Elena Petrova', role: 'Tourist', text: 'Got my 90-day visit visa approved within 4 hours. Super fast and reliable!', rating: 5 }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [TESTIMONIALS.length]);

    return (
        <div className="h-full flex flex-col items-center justify-center relative p-8 pb-32">
             <div className="text-center mb-12">
                 <h2 className="text-4xl text-white font-light uppercase tracking-[0.3em] mb-2 drop-shadow-lg">Customer Stories</h2>
                 <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
             </div>

             <div className="w-full max-w-4xl h-[400px] relative">
                 <AnimatePresence mode="wait">
                     <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex items-center justify-center"
                     >
                         <div 
                            className="w-full max-w-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-[3rem] p-12 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center text-center"
                            style={{ boxShadow: `0 20px 60px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)` }}
                        >
                             {/* Quote Icon */}
                             <div className="absolute -top-6 bg-black border border-white/20 p-4 rounded-full shadow-lg">
                                 <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                             </div>

                             <p className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed mb-8">
                                 "{TESTIMONIALS[currentIndex].text}"
                             </p>

                             <div className="flex flex-col items-center gap-2">
                                 <div className="flex gap-1 mb-2">
                                     {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                                         <Icon key={i} name="Star" className="w-5 h-5 fill-amber-400 text-amber-400" />
                                     ))}
                                 </div>
                                 <h3 className="text-xl font-bold text-white uppercase tracking-wide">{TESTIMONIALS[currentIndex].name}</h3>
                                 <span className="text-sm text-white/50">{TESTIMONIALS[currentIndex].role}</span>
                             </div>
                        </div>
                     </motion.div>
                 </AnimatePresence>

                 {/* Indicators */}
                 <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-3">
                     {TESTIMONIALS.map((_, i) => (
                         <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-white' : 'bg-white/20'}`}
                         />
                     ))}
                 </div>
             </div>
        </div>
    );
};

// -------------------- PARTNERS SLIDE --------------------
const PartnersSlide: React.FC<SlideProps> = ({ theme, customColor, onNavigate }) => {
    // UPDATED: Abu Dhabi specific entities & Federal
    const partners = [
        { name: 'TAMM', sub: 'Abu Dhabi Govt', icon: 'Globe' },
        { name: 'ICP', sub: 'Federal Identity', icon: 'IdCard' },
        { name: 'MOHRE', sub: 'Labor Ministry', icon: 'Building' }, // Added
        { name: 'AD Judicial', sub: 'Judicial Dept', icon: 'Shield' },
        { name: 'ADDED', sub: 'Economic Dept', icon: 'Briefcase' },
        { name: 'DOH', sub: 'Dept of Health', icon: 'Activity' },
        { name: 'AD Police', sub: 'Abu Dhabi Police', icon: 'Badge' }, // Changed to Badge
        { name: 'MOFA', sub: 'Foreign Affairs', icon: 'FileText' }, // Added
        { name: 'FTA', sub: 'Tax Authority', icon: 'Calculator' }, // Added
        { name: 'Etisalat', sub: 'Telecom', icon: 'Globe' },
        { name: 'Du', sub: 'Telecom', icon: 'Globe' },
        { name: 'ADCB', sub: 'Banking', icon: 'Briefcase' },
        { name: 'FAB', sub: 'Banking', icon: 'Briefcase' }
    ];

    const accentColor = customColor || (theme.name === 'Executive Wood' ? '#d97706' : '#fff');

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 pb-32 relative">
            <h2 className="text-4xl text-white font-light uppercase tracking-[0.5em] mb-12 drop-shadow-lg">Government Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl px-4 overflow-y-auto max-h-[60vh] pb-10 scrollbar-hide">
                {partners.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="w-full h-32 md:h-40 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md hover:border-white/40 hover:bg-white/10 transition-all shadow-xl group cursor-pointer hover:-translate-y-2"
                    >
                         <div className="mb-2 p-3 bg-white/5 rounded-full shadow-inner">
                            <Icon name={p.icon} className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
                         </div>
                         <div 
                            className="text-xl md:text-2xl font-bold text-white/80 group-hover:text-white transition-colors text-center px-2 truncate w-full"
                            style={customColor ? { color: customColor } : {}}
                        >
                            {p.name}
                        </div>
                         <div className="text-xs text-white/40 mt-1 uppercase tracking-widest">{p.sub}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// -------------------- MAIN SWITCHER --------------------
export const SlideRenderer: React.FC<SlideProps> = (props) => {
  if (props.data.id === 'emirates-id') {
      return <EmiratesIdSlide {...props} />;
  }

  switch (props.data.type) {
    case 'hero':
      return <HeroSlide {...props} />;
    case 'golden':
      return <GoldenVisaSlide {...props} />;
    case 'partners':
        return <PartnersSlide {...props} />;
    case 'contact':
        return <ContactSlide {...props} />;
    case 'reviews':
        return <ReviewsSlide {...props} />;
    case 'standard':
    case 'kids':
      return <ServiceSlide {...props} />;
    default:
      return <ServiceSlide {...props} />;
  }
};
