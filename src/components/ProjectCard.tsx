/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, Cpu, Database, CheckCircle, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate cursor location relative to card center
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const x = e.clientX - rect.left - cardWidth / 2;
    const y = e.clientY - rect.top - cardHeight / 2;

    // Convert to rotation degrees (cap at 10 deg)
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

  const glowClass = colorTheme === 'blue' ? 'glow-blue' : 'glow-emerald';
  const textThemeClass = colorTheme === 'blue' ? 'text-brand-blue' : 'text-brand-emerald';
  const bgThemeClass = colorTheme === 'blue' ? 'bg-brand-blue/10' : 'bg-brand-emerald/10';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: 'transform 0.15s ease-out, border-color 0.3s',
      }}
      className={`relative w-full holo-glass p-6 md:p-7 rounded-2xl border ${borderClass} transition-shadow duration-500 hover:shadow-2xl overflow-hidden group flex flex-col justify-between h-full`}
    >
      {/* Background Holographic Glow Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      
      {/* Absolute Radial Gradient Tracking Cursor */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), ${colorTheme === 'blue' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(0, 255, 136, 0.08)'}, transparent)`,
        }}
      />

      {/* Decorative Technical Corner Lines */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${colorTheme === 'blue' ? 'border-brand-blue/40' : 'border-brand-emerald/40'}`} />
      <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${colorTheme === 'blue' ? 'border-brand-blue/40' : 'border-brand-emerald/40'}`} />
      <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${colorTheme === 'blue' ? 'border-brand-blue/40' : 'border-brand-emerald/40'}`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${colorTheme === 'blue' ? 'border-brand-blue/40' : 'border-brand-emerald/40'}`} />

      {/* Flex Column Layout (Text on top, interactive schematic on bottom) */}
      <div className="flex flex-col h-full justify-between gap-5 relative z-10">
        
        {/* Project Details */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-widest uppercase ${bgThemeClass} ${textThemeClass}`}>
                {project.id === 'elam-sahayi' ? 'YIP 8.0 APPROVED' : 
                 project.id === 'mbceats' ? 'DATABASE SECURED' : 
                 project.id === 'time-dilation' ? 'NASA SPACEAPPS' : 
                 project.id === 'yawnsense' ? 'CV FATIGUE LOG' : 'LLM SYSTEM ARCH'}
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

            {/* Project Title */}
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
            
            {/* Subtitle */}
            <p 
              contentEditable={isAdmin}
              suppressContentEditableWarning
              onBlur={(e) => {
                onUpdate?.({ ...project, subtitle: e.currentTarget.textContent || '' });
              }}
              className={`font-display text-xs font-medium mb-3 ${textThemeClass} ${
                isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 p-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
              }`}
            >
              {project.subtitle}
            </p>

            {/* Description */}
            <p 
              contentEditable={isAdmin}
              suppressContentEditableWarning
              onBlur={(e) => {
                onUpdate?.({ ...project, description: e.currentTarget.textContent || '' });
              }}
              className={`text-gray-300 text-xs leading-relaxed mb-4 ${
                isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 p-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
              }`}
            >
              {project.description}
            </p>

            {/* Architectural highlights */}
            {project.architectureDetails && (
              <div className="mb-4">
                <span className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase mb-1.5">
                  System Architecture
                </span>
                <ul className="space-y-1">
                  {project.architectureDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-400">
                      <CheckCircle className={`w-3 h-3 mt-0.5 shrink-0 ${textThemeClass}`} />
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
          </div>

          {/* Tags and Links */}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.04] text-[8px] font-mono text-gray-400">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 hover:text-white transition-colors group/link"
              >
                <Github className="w-3.5 h-3.5 group-hover/link:rotate-6 transition-transform" />
                <span>GitHub</span>
              </a>
              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-1.5 text-[10px] font-mono hover:underline ${textThemeClass}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Architectural Schematic SVG Animation */}
        <div className="w-full flex items-center justify-center bg-black/30 rounded-xl p-3.5 border border-white/[0.03] min-h-[160px] overflow-hidden">
          {project.id === 'elam-sahayi' ? (
            /* Cardamom Harvesting Device Schematic */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-28 h-28">
                {/* Outer radar circular grid */}
                <circle cx="80" cy="80" r="75" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="1" fill="none" />
                <circle cx="80" cy="80" r="50" stroke="rgba(0, 255, 136, 0.05)" strokeWidth="1" fill="none" />
                
                {/* Rotating scanner beam */}
                <line 
                  x1="80" y1="80" x2="155" y2="80" 
                  stroke="rgba(0, 255, 136, 0.3)" 
                  strokeWidth="1.5"
                  className="origin-[80px_80px] animate-[spin_6s_linear_infinite]"
                />

                {/* Machine Chassis outline */}
                <rect x="45" y="45" width="70" height="70" rx="6" stroke="rgba(0, 255, 136, 0.3)" strokeWidth="1" fill="rgba(0, 255, 136, 0.02)" />
                <circle cx="80" cy="80" r="16" stroke="rgba(0, 255, 136, 0.4)" strokeWidth="1" fill="none" strokeDasharray="3,3" />

                {/* Picking mechanism claw/gear outline */}
                <g className="origin-[80px_80px] animate-[spin_10s_linear_infinite]">
                  <path d="M 65,80 A 15,15 0 0,1 95,80" stroke="rgba(0, 255, 136, 0.5)" strokeWidth="1.5" fill="none" />
                  <circle cx="65" cy="80" r="3" fill="#00ff88" />
                  <circle cx="95" cy="80" r="3" fill="#00ff88" />
                </g>

                {/* Sensor nodes flashing */}
                <circle cx="55" cy="55" r="4" fill="none" stroke="#00ff88" strokeWidth="1">
                  <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="55" y="45" fill="#00ff88" fontSize="6" fontFamily="monospace" textAnchor="middle">GAS SENS</text>

                <circle cx="105" cy="105" r="4" fill="none" stroke="#00ff88" strokeWidth="1">
                  <animate attributeName="r" values="6;3;6" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <text x="105" y="118" fill="#00ff88" fontSize="6" fontFamily="monospace" textAnchor="middle">PICKER ARM</text>

                {/* Grid markings */}
                <line x1="20" y1="80" x2="140" y2="80" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="0.5" />
                <line x1="80" y1="20" x2="80" y2="140" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="0.5" />
              </svg>
              <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-emerald/70 uppercase">
                HARVESTER_DIAGNOSTIC_V8.0
              </span>
            </div>
          ) : project.id === 'mbceats' ? (
            /* MBCeats Database Schematics */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-28 h-28">
                {/* Database tables floating */}
                {/* Orders Table */}
                <g className="translate-x-[5px] translate-y-[15px] hover:translate-x-[10px] transition-transform duration-300">
                  <rect x="5" y="5" width="55" height="40" rx="3" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" fill="rgba(0, 240, 255, 0.04)" />
                  <line x1="5" y1="17" x2="60" y2="17" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
                  <text x="10" y="13" fill="#00f0ff" fontSize="6" fontFamily="monospace" fontWeight="bold">TBL_ORDERS</text>
                  <text x="10" y="25" fill="rgba(255,255,255,0.5)" fontSize="5" fontFamily="monospace">id_PK (BIGINT)</text>
                  <text x="10" y="32" fill="rgba(255,255,255,0.5)" fontSize="5" fontFamily="monospace">stu_id_FK (INT)</text>
                </g>

                {/* Queue Manager Table */}
                <g className="translate-x-[85px] translate-y-[55px]">
                  <rect x="5" y="5" width="60" height="45" rx="3" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" fill="rgba(0, 240, 255, 0.04)" />
                  <line x1="5" y1="17" x2="65" y2="17" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
                  <text x="10" y="13" fill="#00f0ff" fontSize="6" fontFamily="monospace" fontWeight="bold">TBL_QUEUE</text>
                  <text x="10" y="25" fill="rgba(255,255,255,0.5)" fontSize="5" fontFamily="monospace">q_no_PK (INT)</text>
                  <text x="10" y="32" fill="rgba(255,255,255,0.5)" fontSize="5" fontFamily="monospace">order_id_FK (INT)</text>
                </g>

                {/* Relationship Lines linking tables */}
                <path 
                  d="M 60,32 Q 78,32 78,65 L 90,65" 
                  stroke="#00f0ff" 
                  strokeWidth="1" 
                  fill="none" 
                  strokeDasharray="3,3"
                  className="animate-[dash_10s_linear_infinite]"
                />
                
                {/* Circle data points moving along relationship path */}
                <circle cx="75" cy="40" r="2.5" fill="#00f0ff">
                  <animateMotion 
                    path="M 60,32 Q 78,32 78,65 L 90,65" 
                    dur="3s" 
                    repeatCount="indefinite" 
                  />
                </circle>

                {/* Status Indicator Panel */}
                <rect x="15" y="115" width="130" height="20" rx="3" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" fill="rgba(0, 0, 0, 0.5)" />
                <circle cx="27" cy="125" r="3" fill="#00f0ff">
                  <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x="36" y="127" fill="rgba(255, 255, 255, 0.8)" fontSize="6.5" fontFamily="monospace">SQL CONNECTED - 3000</text>
              </svg>
              <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-blue/70 uppercase">
                RELATIONAL_DATABASE_MODEL
              </span>
            </div>
          ) : project.id === 'time-dilation' ? (
            /* Time Dilation Astrophysics Schematic */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-28 h-28">
                {/* Concentric warped gravity circles */}
                <circle cx="80" cy="80" r="70" stroke="rgba(0, 240, 255, 0.06)" strokeWidth="1" fill="none" />
                <circle cx="80" cy="80" r="50" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="1.2" fill="none" />
                <circle cx="80" cy="80" r="30" stroke="rgba(0, 240, 255, 0.18)" strokeWidth="1.5" fill="none" />
                
                {/* Gravity Warp grid lines */}
                <path d="M 10,80 Q 80,40 150,80" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" fill="none" />
                <path d="M 80,10 Q 40,80 80,150" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" fill="none" />
                <path d="M 10,80 Q 80,120 150,80" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" fill="none" />
                <path d="M 80,10 Q 120,80 80,150" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" fill="none" />

                {/* Massive black hole/gravity well core */}
                <circle cx="80" cy="80" r="14" fill="#04060a" stroke="#00f0ff" strokeWidth="1.5" className="glow-blue" />
                <circle cx="80" cy="80" r="10" fill="#000000" />
                
                {/* Pulsing event horizon glow */}
                <circle cx="80" cy="80" r="18" fill="none" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1" strokeDasharray="4,4">
                  <animate attributeName="r" values="16;22;16" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Orbiting test mass */}
                <circle cx="0" cy="0" r="3.5" fill="#00f0ff">
                  <animateMotion 
                    path="M 80,80 m -40,0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0" 
                    dur="5s" 
                    repeatCount="indefinite" 
                  />
                </circle>

                {/* Dilation Formula Display */}
                <text x="80" y="142" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" className="animate-pulse">
                  t' = t / sqrt(1 - 2GM/rc²)
                </text>
              </svg>
              <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-blue/70 uppercase">
                SPACETIME_GEOMETRY_WARP
              </span>
            </div>
          ) : project.id === 'yawnsense' ? (
            /* YawnSense OpenCV Face Tracking Schematic */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-28 h-28">
                {/* Camera Viewfinder Corners */}
                <path d="M 15,25 L 15,15 L 25,15" stroke="#00ff88" strokeWidth="1.5" fill="none" />
                <path d="M 145,25 L 145,15 L 135,15" stroke="#00ff88" strokeWidth="1.5" fill="none" />
                <path d="M 15,135 L 15,145 L 25,145" stroke="#00ff88" strokeWidth="1.5" fill="none" />
                <path d="M 145,135 L 145,145 L 135,145" stroke="#00ff88" strokeWidth="1.5" fill="none" />

                {/* Face wireframe overlay */}
                <g className="translate-y-5">
                  {/* Head shape */}
                  <path d="M 50,40 Q 80,20 110,40 Q 120,70 110,100 Q 80,120 50,100 Q 40,70 50,40 Z" stroke="rgba(0, 255, 136, 0.15)" strokeWidth="1" fill="none" />
                  
                  {/* Eye markers */}
                  <circle cx="68" cy="55" r="3" stroke="#00ff88" strokeWidth="0.8" fill="none" />
                  <circle cx="68" cy="55" r="1" fill="#00ff88" />
                  
                  <circle cx="92" cy="55" r="3" stroke="#00ff88" strokeWidth="0.8" fill="none" />
                  <circle cx="92" cy="55" r="1" fill="#00ff88" />

                  {/* Nose vector */}
                  <path d="M 80,52 L 80,72 L 75,76" stroke="#00ff88" strokeWidth="1" fill="none" />

                  {/* Open mouth tracking ellipse (yawns!) */}
                  <ellipse cx="80" cy="90" rx="10" ry="12" stroke="#00ff88" strokeWidth="1.5" fill="rgba(0, 255, 136, 0.05)" className="animate-pulse">
                    <animate attributeName="ry" values="4;14;4" dur="3s" repeatCount="indefinite" />
                  </ellipse>

                  {/* Tracking dot mesh points */}
                  <circle cx="50" cy="70" r="1.5" fill="#00ff88" opacity="0.6" />
                  <circle cx="110" cy="70" r="1.5" fill="#00ff88" opacity="0.6" />
                  <circle cx="80" cy="110" r="1.5" fill="#00ff88" opacity="0.8" />
                </g>

                {/* Blinking track status */}
                <circle cx="30" cy="30" r="3" fill="#00ff88">
                  <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x="38" y="32" fill="#00ff88" fontSize="6.5" fontFamily="monospace" fontWeight="bold">REC_ACTIVE</text>
                <text x="80" y="145" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace" textAnchor="middle">MAR_FATIGUE_MAX: 0.88</text>
              </svg>
              <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-emerald/70 uppercase">
                OPENCV_LANDMARK_ENGINE
              </span>
            </div>
          ) : (
            /* Prompt Engineering Workflows Diagram */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-28 h-28">
                {/* Node layout */}
                {/* Node 1: System */}
                <rect x="5" y="15" width="40" height="20" rx="3" stroke="rgba(0, 255, 136, 0.4)" strokeWidth="1" fill="rgba(0, 255, 136, 0.02)" />
                <text x="25" y="27" fill="#00ff88" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SYS_INST</text>

                {/* Node 2: Context */}
                <rect x="5" y="60" width="40" height="20" rx="3" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" fill="rgba(0, 240, 255, 0.02)" />
                <text x="25" y="72" fill="#00f0ff" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">CONTEXT</text>

                {/* Node 3: LLM Compiler */}
                <circle cx="105" cy="47" r="22" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" fill="rgba(18, 24, 36, 0.6)" />
                <circle cx="105" cy="47" r="16" stroke="#00f0ff" strokeWidth="1" fill="none" strokeDasharray="3,3" className="animate-[spin_20s_linear_infinite]" />
                <text x="105" y="49" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LLM_CORE</text>

                {/* Node 4: Alignment Output */}
                <rect x="65" y="115" width="80" height="20" rx="3" stroke="rgba(0, 255, 136, 0.4)" strokeWidth="1" fill="rgba(0, 255, 136, 0.02)" />
                <text x="105" y="127" fill="#00ff88" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ALIGN_VERIFIED</text>

                {/* Connection lines */}
                {/* Line 1: System to LLM */}
                <path d="M 45,25 Q 70,25 85,38" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                <circle cx="65" cy="25" r="2" fill="#00ff88">
                  <animateMotion path="M 45,25 Q 70,25 85,38" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Line 2: Context to LLM */}
                <path d="M 45,70 Q 70,70 85,56" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                <circle cx="65" cy="70" r="2" fill="#00f0ff">
                  <animateMotion path="M 45,70 Q 70,70 85,56" dur="2.5s" repeatCount="indefinite" />
                </circle>

                {/* Line 3: LLM to Output */}
                <path d="M 105,69 L 105,115" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                <circle cx="105" cy="92" r="2" fill="#00ff88">
                  <animateMotion path="M 105,69 L 105,115" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </svg>
              <span className="absolute bottom-0 text-[8px] font-mono tracking-widest text-brand-emerald/70 uppercase">
                CHAIN_OF_THOUGHT_FLOW
              </span>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
