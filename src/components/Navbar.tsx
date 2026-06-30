/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { Cpu, FileText, Volume2, VolumeX, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { downloadResume } from '../utils/resumeGenerator';
import { audioSystem } from '../utils/audioSystem';
import { PROFILE_DATABASE } from '../data';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMuted, setIsMuted] = useState(audioSystem.getMuteState());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [btnImgErr, setBtnImgErr] = useState(false);
  const previousSectionRef = useRef('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home-section', 
        'journey-section', 
        'impact-section', 
        'academics-section', 
        'credentials-section', 
        'contact-section'
      ];
      const sectionKeys = ['home', 'journey', 'impact', 'academics', 'credentials', 'contact'];
      
      let nextSection = 'home';
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const offsetTop = el.offsetTop;
          if (scrollPosition >= offsetTop) {
            nextSection = sectionKeys[i];
          }
        }
      }

      if (nextSection !== previousSectionRef.current) {
        setActiveSection(nextSection);
        previousSectionRef.current = nextSection;
        audioSystem.playScrollTransition();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioSystem.setMuteState(nextMute);
  };

  const openProfile = () => {
    audioSystem.playClickBeep();
    setIsProfileOpen(true);
  };

  const scrollToSection = (id: string) => {
    audioSystem.playClickBeep();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 bg-gradient-to-b from-cyber-dark/85 to-transparent backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Name - Interactive Profile Trigger */}
          <button
            onClick={openProfile}
            className="flex items-center gap-2.5 group cursor-pointer"
            title="Access Secure Operator Profile Dossier"
          >
            <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-cyber-gray border border-white/10 group-hover:border-brand-blue/60 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.05)] overflow-hidden">
              {!btnImgErr ? (
                <img
                  src={`/${PROFILE_DATABASE.avatarUrl}`}
                  alt="Anandhu Krishnan Profile Thumbnail"
                  onError={() => setBtnImgErr(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <Cpu className="w-4 h-4 text-brand-blue group-hover:scale-110 group-hover:text-[#00f0ff] transition-all duration-300" />
              )}
              <div className="absolute inset-0 rounded-lg bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xs" />
            </div>
            <span className="font-mono font-bold tracking-widest text-[11px] text-white group-hover:text-brand-blue group-hover:[text-shadow:0_0_8px_rgba(0,240,255,0.4)] transition-all duration-300 relative uppercase">
              [ANANDHU KRISHNAN]
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-blue group-hover:w-full transition-all duration-300" />
            </span>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-gray/50 border border-white/[0.06] backdrop-blur-lg">
            {[
              { key: 'home', label: 'Home', id: 'home-section' },
              { key: 'journey', label: 'Journey', id: 'journey-section' },
              { key: 'impact', label: 'Impact', id: 'impact-section' },
              { key: 'academics', label: 'Academics', id: 'academics-section' },
              { key: 'credentials', label: 'Credentials', id: 'credentials-section' },
              { key: 'contact', label: 'Contact', id: 'contact-section' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-1.5 text-xs font-medium uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer ${
                  activeSection === item.key
                    ? 'text-brand-blue bg-brand-blue/10 border border-brand-blue/20'
                    : 'text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions Cluster: Audio Toggle + Resume Button */}
          <div className="flex items-center gap-3">
            {/* Audio HUD Toggle */}
            <button
              onClick={toggleMute}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
                !isMuted 
                  ? 'text-brand-blue bg-brand-blue/5 border-brand-blue/40 glow-blue' 
                  : 'text-gray-500 bg-cyber-dark/40 border-white/10 hover:border-white/20 hover:text-white'
              }`}
              title={isMuted ? 'Unmute system audio' : 'Mute system audio'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">AUDIO_0</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-brand-blue" />
                  <span className="hidden sm:inline text-brand-blue">AUDIO_1</span>
                </>
              )}
            </button>

            {/* Resume Button with Glowing Border */}
            <button
              onClick={(e) => {
                e.preventDefault();
                audioSystem.playClickBeep();
                downloadResume();
              }}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-medium uppercase tracking-wider text-white bg-cyber-dark border border-brand-blue/30 overflow-hidden group transition-all duration-300 hover:border-brand-blue glow-blue cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-brand-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <FileText className="w-3.5 h-3.5 text-brand-blue group-hover:text-brand-emerald transition-colors duration-300" />
              <span className="relative z-10">Resume</span>
              <span className="absolute -left-full top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </div>
        </div>
      </nav>

      {/* FUTURISTIC OPERATOR PROFILE OVERLAY MODAL */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 bg-cyber-dark/90 backdrop-blur-md cursor-pointer"
            />

            {/* Panel Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative holo-glass max-w-2xl w-full border border-brand-blue/30 rounded-2xl p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.15)] z-10 font-mono text-left"
            >
              {/* Tech Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-blue/60" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-blue/60" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-blue/60" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-blue/60" />

              {/* Holographic matrix grids */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] [background-size:100%_4px,3px_100%]" />

              {/* Close Button Header */}
              <div className="flex justify-between items-center mb-6 border-b border-white/[0.08] pb-4">
                <span className="text-[10px] text-brand-blue font-mono tracking-widest uppercase flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-ping" />
                  [SECURE_OPERATOR_DOSSIER // ACCESS_GRANTED]
                </span>
                <button
                  onClick={() => {
                    audioSystem.playClickBeep();
                    setIsProfileOpen(false);
                  }}
                  className="px-3 py-1.5 rounded border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400 hover:text-white text-[10px] font-mono transition-all duration-200 cursor-pointer uppercase tracking-widest"
                >
                  [X_CLOSE_TERMINAL]
                </button>
              </div>

              {/* Two-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                {/* LEFT COLUMN: Visual Identification */}
                <div className="md:col-span-5 flex flex-col items-center w-full">
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-brand-emerald bg-[#04060a] group/avatar shadow-[0_0_20px_rgba(0,255,136,0.1)] flex items-center justify-center">
                    {/* Primary Photo representation */}
                    <img
                      src={`/${PROFILE_DATABASE.avatarUrl}`}
                      alt={`${PROFILE_DATABASE.name} Profile Headshot`}
                      onError={() => setImgErr(true)}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-105 ${imgErr ? 'hidden' : 'block'}`}
                    />

                    {/* Animated scanning laser line overlay */}
                    <motion.div
                      className="absolute left-0 w-full h-[2px] bg-brand-emerald shadow-[0_0_8px_#00ff88] z-20"
                      animate={{ y: [0, 240, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Hologram Overlay when loading/fallback */}
                    {imgErr && (
                      <div className="absolute inset-0 bg-[#04060a] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px]" />
                        
                        {/* Animated rotating outer reticle */}
                        <div className="relative w-28 h-28 border border-dashed border-brand-emerald/40 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite] mb-2">
                          <div className="absolute inset-2 border border-brand-blue/30 rounded-full animate-pulse" />
                        </div>

                        <div className="absolute flex flex-col items-center gap-1.5">
                          <div className="w-16 h-16 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald shadow-[0_0_15px_rgba(0,255,136,0.25)]">
                            <User className="w-8 h-8" />
                          </div>
                          <span className="text-[9px] text-brand-emerald tracking-widest font-mono animate-pulse uppercase mt-1">
                            [STREAM_PENDING]
                          </span>
                          <span className="text-[8px] text-gray-500 font-mono break-all max-w-full px-2 text-center">
                            /{PROFILE_DATABASE.avatarUrl}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operational Hash identifier */}
                  <span className="text-[9px] text-gray-500 mt-3 font-mono tracking-widest uppercase">
                    OPERATOR_HASH // {PROFILE_DATABASE.operatorHash}
                  </span>
                </div>

                {/* RIGHT COLUMN: Executive Dossier */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <span className="text-[9px] text-brand-emerald font-mono tracking-widest block uppercase mb-1">
                      // IDENT_DOSSIER_METRICS
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight">
                      {PROFILE_DATABASE.title}
                    </h3>
                    <div className="inline-block mt-2 px-2.5 py-1 rounded bg-brand-blue/10 border border-brand-blue/25 text-[9px] text-brand-blue font-mono tracking-wider uppercase font-bold leading-none">
                      {PROFILE_DATABASE.subtitle}
                    </div>
                  </div>

                  {/* Core Summary Panel */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
                    <p className="font-sans text-[12px] md:text-xs text-gray-300 leading-relaxed">
                      {PROFILE_DATABASE.summary}
                    </p>
                  </div>

                  {/* PERSONAL INTERESTS TERMINAL */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-brand-blue font-mono tracking-widest block uppercase">
                      // PERSONAL INTERESTS TERMINAL:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PROFILE_DATABASE.hobbies.map((hobby, index) => {
                        const neonBorderHover = hobby.themeColor === 'blue' 
                          ? 'hover:border-brand-blue/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]' 
                          : hobby.themeColor === 'emerald' 
                          ? 'hover:border-brand-emerald/50 hover:shadow-[0_0_15px_rgba(0,255,136,0.25)]' 
                          : 'hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]';
                        
                        const bgIndicator = hobby.themeColor === 'blue'
                          ? 'bg-brand-blue'
                          : hobby.themeColor === 'emerald'
                          ? 'bg-brand-emerald'
                          : 'bg-purple-500';

                        const titleGlow = hobby.themeColor === 'blue'
                          ? 'group-hover:text-brand-blue group-hover:[text-shadow:0_0_8px_rgba(0,240,255,0.4)]'
                          : hobby.themeColor === 'emerald'
                          ? 'group-hover:text-brand-emerald group-hover:[text-shadow:0_0_8px_rgba(0,255,136,0.4)]'
                          : 'group-hover:text-purple-400 group-hover:[text-shadow:0_0_8px_rgba(168,85,247,0.4)]';

                        return (
                          <motion.div 
                            key={index} 
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`p-3 rounded-xl holo-glass border border-white/[0.05] ${neonBorderHover} transition-all duration-300 relative overflow-hidden group cursor-pointer`}
                          >
                            <div className={`absolute top-0 left-0 w-1 h-full ${bgIndicator}`} />
                            <span className={`text-[9px] font-bold text-white block mb-1 uppercase font-mono tracking-wider pl-1.5 transition-colors duration-300 ${titleGlow}`}>
                              {hobby.title}
                            </span>
                            <p className="text-[8px] text-gray-400 font-sans leading-normal pl-1.5 group-hover:text-gray-300 transition-colors duration-300">
                              {hobby.description}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Telemetry Matrix Grid */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-2.5 rounded-lg border border-white/[0.04] bg-cyber-dark">
                      <span className="text-[8px] text-gray-500 uppercase block font-mono">SECURITY_LVL</span>
                      <span className="text-[11px] text-brand-blue font-bold font-mono">{PROFILE_DATABASE.securityLevel}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-white/[0.04] bg-cyber-dark">
                      <span className="text-[8px] text-gray-500 uppercase block font-mono">SYS_STATUS</span>
                      <span className="text-[11px] text-brand-emerald font-bold font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                        {PROFILE_DATABASE.systemStatus}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-white/[0.04] bg-cyber-dark">
                      <span className="text-[8px] text-gray-500 uppercase block font-mono">CURRENT_NODE</span>
                      <span className="text-[11px] text-white font-mono leading-none block mt-0.5">{PROFILE_DATABASE.coordinates}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-white/[0.04] bg-cyber-dark">
                      <span className="text-[8px] text-gray-500 uppercase block font-mono">ENCRYPTION</span>
                      <span className="text-[11px] text-white font-mono leading-none block mt-0.5">{PROFILE_DATABASE.encryption}</span>
                    </div>
                  </div>

                  {/* Micro Diagnostics Terminal Footer */}
                  <div className="text-[8px] text-gray-500 font-mono flex items-center justify-between gap-2 pt-3 border-t border-white/[0.05]">
                    <span className="text-brand-blue">[STDLINK_SECURE_NODE]</span>
                    <span>HOST: 0.0.0.0:3000</span>
                    <span className="text-brand-emerald">PING: 14MS</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
