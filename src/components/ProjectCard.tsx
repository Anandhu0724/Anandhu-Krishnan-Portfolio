/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, CheckCircle, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { audioSystem } from '../utils/audioSystem';

interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  colorTheme: 'blue' | 'emerald';
  isAdmin?: boolean;
  onUpdate?: (updatedProject: Project) => void;
}

export default function ProjectCard({ project, colorTheme, isAdmin = false, onUpdate }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate cursor location relative to card center
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const x = e.clientX - rect.left - cardWidth / 2;
    const y = e.clientY - rect.top - cardHeight / 2;

    // Convert to rotation degrees (cap at 12 deg)
    const degX = -(y / (cardHeight / 2)) * 12;
    const degY = (x / (cardWidth / 2)) * 12;

    setRotateX(degX);
    setRotateY(degY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const borderClass = colorTheme === 'blue' 
    ? 'border-brand-blue/20 hover:border-brand-blue/50' 
    : 'border-brand-emerald/20 hover:border-brand-emerald/50';

  const textThemeClass = colorTheme === 'blue' ? 'text-brand-blue' : 'text-brand-emerald';
  const bgThemeClass = colorTheme === 'blue' ? 'bg-brand-blue/10' : 'bg-brand-emerald/10';

  return (
    <>
      {/* Compact Glass Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          audioSystem.playClickBeep();
          setIsExpanded(true);
        }}
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: 'transform 0.15s ease-out, border-color 0.3s',
        }}
        className={`relative w-full h-44 holo-glass p-5 rounded-xl border ${borderClass} transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] overflow-hidden group flex flex-col justify-between cursor-pointer`}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-35" />
        
        {/* Decorative Corner lines */}
        <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${colorTheme === 'blue' ? 'border-brand-blue/35' : 'border-brand-emerald/35'}`} />
        <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${colorTheme === 'blue' ? 'border-brand-blue/35' : 'border-brand-emerald/35'}`} />
        <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${colorTheme === 'blue' ? 'border-brand-blue/35' : 'border-brand-emerald/35'}`} />
        <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${colorTheme === 'blue' ? 'border-brand-blue/35' : 'border-brand-emerald/35'}`} />

        <div className="flex flex-col justify-between h-full z-10 relative">
          <div>
            <div className="flex justify-between items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[7px] font-mono tracking-widest uppercase ${bgThemeClass} ${textThemeClass}`}>
                {project.id.toUpperCase().replace('-', '_')}
              </span>
              {project.metric && (
                <span className="text-[8px] font-mono text-gray-500">
                  ⚡ {project.metric}
                </span>
              )}
            </div>

            <h3 className="font-display text-md font-bold text-white group-hover:text-brand-blue transition-colors duration-300">
              {project.title}
            </h3>
            <p className={`text-[10px] font-mono mt-0.5 ${textThemeClass}`}>
              {project.subtitle}
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.04] text-[7px] font-mono text-gray-400">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-1 py-0.5 text-[7px] font-mono text-gray-500">
                  +{project.tags.length - 3} MORE
                </span>
              )}
            </div>

            <div className="text-[7.5px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors duration-300">
              <span>[DECRYPT_TELEMETRY // CLICK_TO_EXPAND]</span>
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                audioSystem.playClickBeep();
                setIsExpanded(false);
              }}
              className="fixed inset-0 bg-cyber-dark/95 backdrop-blur-md cursor-pointer"
            />

            {/* Panel Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative holo-glass max-w-3xl w-full border border-brand-blue/30 rounded-2xl p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[90vh] shadow-[0_0_40px_rgba(0,240,255,0.15)] z-10 font-mono text-left"
            >
              {/* Tech Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-blue/60" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-blue/60" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-blue/60" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-blue/60" />

              {/* Holographic matrix grids */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] [background-size:100%_4px,3px_100%]" />

              {/* Close Button Header */}
              <div className="flex justify-between items-center mb-5 border-b border-white/[0.08] pb-3">
                <span className="text-[10px] text-brand-blue font-mono tracking-widest uppercase flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-ping" />
                  [SECURE_PROJECT_INTELLIGENCE // REPO_LOADED]
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audioSystem.playClickBeep();
                    setIsExpanded(false);
                  }}
                  className="px-3 py-1.5 rounded border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400 hover:text-white text-[10px] font-mono transition-all duration-200 cursor-pointer uppercase tracking-widest"
                >
                  [X_CLOSE_TERMINAL]
                </button>
              </div>

              {/* Two-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                {/* LEFT COLUMN: Project Details */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2.5 py-1 rounded text-[8px] font-mono tracking-widest uppercase ${bgThemeClass} ${textThemeClass}`}>
                        {project.id.toUpperCase().replace('-', '_')}
                      </span>
                      {project.metric && (
                        <span 
                          contentEditable={isAdmin}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            onUpdate?.({ ...project, metric: e.currentTarget.textContent?.replace('⚡ ', '').trim() || '' });
                          }}
                          className={`text-[9px] font-mono text-gray-400 shrink-0 ${
                            isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 px-1.5 py-0.5 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
                          }`}
                        >
                          ⚡ {project.metric}
                        </span>
                      )}
                    </div>

                    <h3 
                      contentEditable={isAdmin}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        onUpdate?.({ ...project, title: e.currentTarget.textContent || '' });
                      }}
                      className={`font-display text-xl md:text-2xl font-bold tracking-tight text-white mb-1 leading-tight ${
                        isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 p-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
                      }`}
                    >
                      {project.title}
                    </h3>
                    
                    <p 
                      contentEditable={isAdmin}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        onUpdate?.({ ...project, subtitle: e.currentTarget.textContent || '' });
                      }}
                      className={`font-mono text-xs font-medium mb-3 ${textThemeClass} ${
                        isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 p-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
                      }`}
                    >
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
                    <p 
                      contentEditable={isAdmin}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        onUpdate?.({ ...project, description: e.currentTarget.textContent || '' });
                      }}
                      className={`text-gray-300 text-xs leading-relaxed ${
                        isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 p-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
                      }`}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* Architectural highlights */}
                  {project.architectureDetails && (
                    <div className="space-y-2">
                      <span className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">
                        System Architecture
                      </span>
                      <ul className="space-y-1">
                        {project.architectureDetails.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-400">
                            <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${textThemeClass}`} />
                            <span
                              contentEditable={isAdmin}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const updatedDetails = [...(project.architectureDetails || [])];
                                updatedDetails[idx] = e.currentTarget.textContent || '';
                                onUpdate?.({ ...project, architectureDetails: updatedDetails });
                              }}
                              className={isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 px-1 py-0.5 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text w-full' : ''}
                            >
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags and Links */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.04] text-[8px] font-mono text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 border-t border-white/[0.05] pt-3">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 hover:text-white transition-colors group/link"
                      >
                        <Github className="w-4 h-4 group-hover/link:rotate-6 transition-transform" />
                        <span>GitHub Repository</span>
                      </a>
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-1.5 text-[11px] font-mono hover:underline ${textThemeClass}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Schematic diagram */}
                <div className="md:col-span-5 flex flex-col items-center w-full bg-black/30 rounded-xl p-4 border border-white/[0.03] min-h-[220px] overflow-hidden justify-center relative">
                  {project.id === 'elam-sahayi' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <circle cx="80" cy="80" r="75" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="1" fill="none" />
                        <circle cx="80" cy="80" r="50" stroke="rgba(0, 255, 136, 0.05)" strokeWidth="1" fill="none" />
                        <line x1="80" y1="80" x2="155" y2="80" stroke="rgba(0, 255, 136, 0.3)" strokeWidth="1.5" className="origin-[80px_80px] animate-[spin_6s_linear_infinite]" />
                        <rect x="45" y="45" width="70" height="70" rx="6" stroke="rgba(0, 255, 136, 0.3)" strokeWidth="1" fill="rgba(0, 255, 136, 0.02)" />
                        <circle cx="80" cy="80" r="16" stroke="rgba(0, 255, 136, 0.4)" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                        <g className="origin-[80px_80px] animate-[spin_10s_linear_infinite]">
                          <path d="M 65,80 A 15,15 0 0,1 95,80" stroke="rgba(0, 255, 136, 0.5)" strokeWidth="1.5" fill="none" />
                          <circle cx="65" cy="80" r="3" fill="#00ff88" />
                          <circle cx="95" cy="80" r="3" fill="#00ff88" />
                        </g>
                        <circle cx="55" cy="55" r="4" fill="none" stroke="#00ff88" strokeWidth="1">
                          <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <text x="55" y="45" fill="#00ff88" fontSize="6.5" fontFamily="monospace" textAnchor="middle">GAS_SENS</text>
                        <circle cx="105" cy="105" r="4" fill="none" stroke="#00ff88" strokeWidth="1">
                          <animate attributeName="r" values="6;3;6" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                        <text x="105" y="118" fill="#00ff88" fontSize="6.5" fontFamily="monospace" textAnchor="middle">PICKER_ARM</text>
                        <line x1="20" y1="80" x2="140" y2="80" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="0.5" />
                        <line x1="80" y1="20" x2="80" y2="140" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="0.5" />
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-emerald/75 uppercase">
                        HARVESTER_DIAGNOSTIC_V8.0
                      </span>
                    </div>
                  ) : project.id === 'mbceats' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <g className="translate-x-[5px] translate-y-[15px]">
                          <rect x="5" y="5" width="55" height="40" rx="3" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" fill="rgba(0, 240, 255, 0.04)" />
                          <line x1="5" y1="17" x2="60" y2="17" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
                          <text x="10" y="13" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" fontWeight="bold">TBL_ORDERS</text>
                          <text x="10" y="25" fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">id_PK (BIGINT)</text>
                          <text x="10" y="33" fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">stu_id_FK (INT)</text>
                        </g>
                        <g className="translate-x-[85px] translate-y-[55px]">
                          <rect x="5" y="5" width="60" height="45" rx="3" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" fill="rgba(0, 240, 255, 0.04)" />
                          <line x1="5" y1="17" x2="65" y2="17" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
                          <text x="10" y="13" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" fontWeight="bold">TBL_QUEUE</text>
                          <text x="10" y="25" fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">q_no_PK (INT)</text>
                          <text x="10" y="33" fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">order_id_FK (INT)</text>
                        </g>
                        <path d="M 60,32 Q 78,32 78,65 L 90,65" stroke="#00f0ff" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                        <circle cx="75" cy="40" r="2.5" fill="#00f0ff">
                          <animateMotion path="M 60,32 Q 78,32 78,65 L 90,65" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <rect x="15" y="115" width="130" height="20" rx="3" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" fill="rgba(0, 0, 0, 0.5)" />
                        <circle cx="27" cy="125" r="3" fill="#00f0ff">
                          <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
                        </circle>
                        <text x="36" y="127" fill="rgba(255, 255, 255, 0.8)" fontSize="6.5" fontFamily="monospace">SQL_CONNECTED // PORT_3000</text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-blue/70 uppercase">
                        RELATIONAL_DATABASE_MODEL
                      </span>
                    </div>
                  ) : project.id === 'time-dilation' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <circle cx="80" cy="80" r="70" stroke="rgba(0, 240, 255, 0.06)" strokeWidth="1" fill="none" />
                        <circle cx="80" cy="80" r="50" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="1.2" fill="none" />
                        <circle cx="80" cy="80" r="30" stroke="rgba(0, 240, 255, 0.18)" strokeWidth="1.5" fill="none" />
                        <path d="M 10,80 Q 80,40 150,80" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" fill="none" />
                        <path d="M 80,10 Q 40,80 80,150" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" fill="none" />
                        <path d="M 10,80 Q 80,120 150,80" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" fill="none" />
                        <path d="M 80,10 Q 120,80 80,150" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" fill="none" />
                        <circle cx="80" cy="80" r="14" fill="#04060a" stroke="#00f0ff" strokeWidth="1.5" className="glow-blue" />
                        <circle cx="80" cy="80" r="10" fill="#000000" />
                        <circle cx="80" cy="80" r="18" fill="none" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1" strokeDasharray="4,4">
                          <animate attributeName="r" values="16;22;16" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="3.5" fill="#00f0ff">
                          <animateMotion path="M 80,80 m -40,0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0" dur="5s" repeatCount="indefinite" />
                        </circle>
                        <text x="80" y="145" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" className="animate-pulse">
                          t' = t / sqrt(1 - 2GM/rc²)
                        </text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-blue/70 uppercase">
                        SPACETIME_GEOMETRY_WARP
                      </span>
                    </div>
                  ) : project.id === 'yawnsense' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <path d="M 15,25 L 15,15 L 25,15" stroke="#00ff88" strokeWidth="1.5" fill="none" />
                        <path d="M 145,25 L 145,15 L 135,15" stroke="#00ff88" strokeWidth="1.5" fill="none" />
                        <path d="M 15,135 L 15,145 L 25,145" stroke="#00ff88" strokeWidth="1.5" fill="none" />
                        <path d="M 145,135 L 145,145 L 135,145" stroke="#00ff88" strokeWidth="1.5" fill="none" />
                        <g className="translate-y-5">
                          <path d="M 50,40 Q 80,20 110,40 Q 120,70 110,100 Q 80,120 50,100 Q 40,70 50,40 Z" stroke="rgba(0, 255, 136, 0.15)" strokeWidth="1" fill="none" />
                          <circle cx="68" cy="55" r="3" stroke="#00ff88" strokeWidth="0.8" fill="none" />
                          <circle cx="68" cy="55" r="1" fill="#00ff88" />
                          <circle cx="92" cy="55" r="3" stroke="#00ff88" strokeWidth="0.8" fill="none" />
                          <circle cx="92" cy="55" r="1" fill="#00ff88" />
                          <path d="M 80,52 L 80,72 L 75,76" stroke="#00ff88" strokeWidth="1" fill="none" />
                          <ellipse cx="80" cy="90" rx="10" ry="12" stroke="#00ff88" strokeWidth="1.5" fill="rgba(0, 255, 136, 0.05)">
                            <animate attributeName="ry" values="4;14;4" dur="3s" repeatCount="indefinite" />
                          </ellipse>
                          <circle cx="50" cy="70" r="1.5" fill="#00ff88" opacity="0.6" />
                          <circle cx="110" cy="70" r="1.5" fill="#00ff88" opacity="0.6" />
                          <circle cx="80" cy="110" r="1.5" fill="#00ff88" opacity="0.8" />
                        </g>
                        <circle cx="30" cy="30" r="3" fill="#00ff88">
                          <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
                        </circle>
                        <text x="38" y="32" fill="#00ff88" fontSize="6.5" fontFamily="monospace" fontWeight="bold">REC_ACTIVE</text>
                        <text x="80" y="148" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace" textAnchor="middle">MAR_FATIGUE_MAX: 0.88</text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-emerald/75 uppercase">
                        OPENCV_LANDMARK_ENGINE
                      </span>
                    </div>
                  ) : project.id === 'demonic-tic-tac-toe' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <line x1="55" y1="20" x2="55" y2="140" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" />
                        <line x1="105" y1="20" x2="105" y2="140" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" />
                        <line x1="20" y1="55" x2="140" y2="55" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" />
                        <line x1="20" y1="105" x2="140" y2="105" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" />
                        <polygon points="80,25 115,115 35,60 125,60 45,115" stroke="rgba(239, 68, 68, 0.05)" strokeWidth="1" fill="none" />
                        <g>
                          <line x1="30" y1="30" x2="45" y2="45" stroke="#ef4444" strokeWidth="2" className="animate-pulse" />
                          <line x1="45" y1="30" x2="30" y2="45" stroke="#ef4444" strokeWidth="2" className="animate-pulse" />
                          <circle cx="80" cy="80" r="10" stroke="#00f0ff" strokeWidth="2" fill="none">
                            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <line x1="115" y1="115" x2="130" y2="130" stroke="#ef4444" strokeWidth="2">
                            <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                          </line>
                          <line x1="130" y1="115" x2="115" y2="130" stroke="#ef4444" strokeWidth="2">
                            <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                          </line>
                        </g>
                        <text x="80" y="145" fill="#ef4444" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold" className="animate-pulse">
                          DIABOLICAL_MODE_ACTIVE
                        </text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-red-500/70 uppercase">
                        ADVERSARIAL_MINIMAX_AI
                      </span>
                    </div>
                  ) : project.id === 'chaya-kaapi-kaddi' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <path d="M 30,80 A 50,50 0 0,1 130,80" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="1" fill="none" />
                        <path d="M 30,80 A 50,50 0 0,0 130,80" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                        <path d="M 65,45 L 95,45 L 88,105 L 72,105 Z" stroke="#f97316" strokeWidth="1.5" fill="rgba(249, 115, 22, 0.05)" />
                        <path d="M 72,35 Q 75,25 72,15" stroke="#f97316" strokeWidth="1" fill="none">
                          <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite" />
                        </path>
                        <path d="M 80,35 Q 83,25 80,15" stroke="#f97316" strokeWidth="1" fill="none">
                          <animate attributeName="stroke-dashoffset" values="0;10" dur="1.8s" repeatCount="indefinite" />
                        </path>
                        <path d="M 88,35 Q 91,25 88,15" stroke="#f97316" strokeWidth="1" fill="none">
                          <animate attributeName="stroke-dashoffset" values="5;15" dur="2.2s" repeatCount="indefinite" />
                        </path>
                        <line x1="70" y1="70" x2="90" y2="70" stroke="#f97316" strokeWidth="2" />
                        <rect x="110" y="30" width="12" height="12" rx="2" stroke="#f97316" strokeWidth="1" fill="none" />
                        <line x1="116" y1="30" x2="116" y2="42" stroke="rgba(249,115,22,0.4)" strokeWidth="0.8" />
                        <text x="80" y="125" fill="#f97316" fontSize="6.5" fontFamily="monospace" textAnchor="middle">MALAYALAM_TEA_STALL</text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-orange-500/70 uppercase">
                        REGIONAL_DISH_REGISTRY
                      </span>
                    </div>
                  ) : project.id === 'certificate-generator' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <rect x="35" y="30" width="90" height="95" rx="3" stroke="#00f0ff" strokeWidth="1.5" fill="rgba(0, 240, 255, 0.03)" />
                        <line x1="45" y1="45" x2="115" y2="45" stroke="rgba(0, 240, 255, 0.6)" strokeWidth="1.5" />
                        <line x1="55" y1="65" x2="105" y2="65" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                        <line x1="50" y1="78" x2="110" y2="78" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                        <line x1="60" y1="90" x2="100" y2="90" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                        <circle cx="95" cy="105" r="9" stroke="#00ff88" strokeWidth="1" fill="rgba(0, 255, 136, 0.1)">
                          <animate attributeName="r" values="7;10;7" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <polygon points="95,100 97,105 102,105 98,108 100,113 95,110 90,113 92,108 88,105 93,105" fill="#00ff88" />
                        <rect x="45" y="115" width="70" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
                        <rect x="45" y="115" width="50" height="2" rx="1" fill="#00f0ff">
                          <animate attributeName="width" values="10;70;10" dur="4s" repeatCount="indefinite" />
                        </rect>
                        <text x="80" y="145" fill="rgba(255,255,255,0.5)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">BULK_PDF_COMPILE: SUCCESS</text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-blue/70 uppercase">
                        DYNAMIC_PDF_COMPILER
                      </span>
                    </div>
                  ) : project.id === 'mythical-weather-app' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <circle cx="80" cy="65" r="16" fill="rgba(0, 255, 136, 0.05)" stroke="#00ff88" strokeWidth="1" />
                        <g className="origin-[80px_65px] animate-[spin_12s_linear_infinite]">
                          <line x1="80" y1="43" x2="80" y2="47" stroke="#00ff88" strokeWidth="1" />
                          <line x1="80" y1="83" x2="80" y2="87" stroke="#00ff88" strokeWidth="1" />
                          <line x1="58" y1="65" x2="62" y2="65" stroke="#00ff88" strokeWidth="1" />
                          <line x1="98" y1="65" x2="102" y2="65" stroke="#00ff88" strokeWidth="1" />
                        </g>
                        <path d="M 55,85 A 12,12 0 0,1 75,75 A 16,16 0 0,1 105,78 A 12,12 0 0,1 115,90 L 55,90 Z" fill="rgba(18, 24, 36, 0.85)" stroke="#00f0ff" strokeWidth="1.2" />
                        <polygon points="80,92 72,110 82,110 76,128 92,108 82,108" fill="#00ff88">
                          <animate attributeName="opacity" values="0.1;0.9;0.1;0.9;0.1" dur="2s" repeatCount="indefinite" />
                        </polygon>
                        <text x="80" y="142" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">WEATHER_COORDINATES: OK</text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-emerald/75 uppercase">
                        ATMOSPHERIC_FANTASY_SYNC
                      </span>
                    </div>
                  ) : project.id === 'budgetmaster' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <circle cx="80" cy="70" r="45" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
                        <circle cx="80" cy="70" r="45" stroke="#00f0ff" strokeWidth="8" fill="none" strokeDasharray="282" strokeDashoffset="80">
                          <animate attributeName="strokeDashoffset" values="280;120;280" dur="4s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="80" cy="70" r="45" stroke="#00ff88" strokeWidth="8" fill="none" strokeDasharray="282" strokeDashoffset="220" />
                        <text x="80" y="73" fill="#ffffff" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">$9,480</text>
                        <text x="80" y="82" fill="rgba(255,255,255,0.4)" fontSize="5.5" fontFamily="monospace" textAnchor="middle">SAVED_35%</text>
                        <line x1="30" y1="125" x2="130" y2="125" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
                        <rect x="50" y="130" width="60" height="12" rx="2" fill="rgba(0, 240, 255, 0.05)" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="0.8" />
                        <text x="80" y="138" fill="#00f0ff" fontSize="5.5" fontFamily="monospace" textAnchor="middle" className="animate-pulse">STATUS: BUDGET_SECURE</text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-blue/70 uppercase">
                        LEDGER_TELEMETRY_ENGINE
                      </span>
                    </div>
                  ) : project.id === 'team-vajram' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <ellipse cx="80" cy="80" rx="70" ry="25" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.2" fill="none" />
                        <ellipse cx="80" cy="80" rx="55" ry="18" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="1" fill="none" strokeDasharray="4,4" />
                        <circle cx="80" cy="80" r="15" fill="#04060a" stroke="#00f0ff" strokeWidth="1.5" className="glow-blue" />
                        <circle cx="80" cy="80" r="12" fill="rgba(0, 240, 255, 0.1)" />
                        <g>
                          <circle cx="0" cy="0" r="3.5" fill="#00ff88">
                            <animateMotion path="M 80,80 m -70,0 a 70,25 0 1,0 140,0 a 70,25 0 1,0 -140,0" dur="6s" repeatCount="indefinite" />
                          </circle>
                          <circle cx="0" cy="0" r="2.5" fill="#00f0ff">
                            <animateMotion path="M 80,80 m -55,0 a 55,18 0 1,0 110,0 a 55,18 0 1,0 -110,0" dur="4s" repeatCount="indefinite" />
                          </circle>
                        </g>
                        <line x1="20" y1="130" x2="140" y2="130" stroke="rgba(0,255,136,0.15)" strokeWidth="0.8" />
                        <text x="80" y="142" fill="#00ff88" fontSize="6.5" fontFamily="monospace" textAnchor="middle">NASA_API_TELEMETRY: ACTIVE</text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-emerald/75 uppercase">
                        VAJRAM_SATELLITE_ORBIT
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-32 h-32">
                        <rect x="60" y="20" width="40" height="20" rx="2" stroke="#00ff88" strokeWidth="1" fill="rgba(0,255,136,0.05)" />
                        <text x="80" y="32" fill="#00ff88" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Main.class</text>
                        <rect x="20" y="70" width="50" height="20" rx="2" stroke="#00f0ff" strokeWidth="1" fill="rgba(0,240,255,0.05)" />
                        <text x="45" y="82" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">SystemCore</text>
                        <rect x="90" y="70" width="50" height="20" rx="2" stroke="#00f0ff" strokeWidth="1" fill="rgba(0,240,255,0.05)" />
                        <text x="115" y="82" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">DataStream</text>
                        <path d="M 80,40 L 80,55 L 45,55 L 45,70" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
                        <path d="M 80,40 L 80,55 L 115,55 L 115,70" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
                        <rect x="25" y="115" width="110" height="20" rx="2" fill="#04060a" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        <circle cx="35" cy="125" r="2.5" fill="#00ff88" />
                        <text x="44" y="127" fill="rgba(255,255,255,0.7)" fontSize="6.5" fontFamily="monospace">JVM_EXECUTION: ONLINE</text>
                      </svg>
                      <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-emerald/75 uppercase">
                        OOP_COMPILER_SCHEMA
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
