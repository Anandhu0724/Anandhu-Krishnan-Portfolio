/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Award, Shield, Compass, Sparkles, Check, ChevronDown } from 'lucide-react';
import { LeadershipRole } from '../types';

interface LeadershipCardProps {
  role: LeadershipRole;
  index: number;
  isAdmin?: boolean;
  onUpdate?: (updatedRole: LeadershipRole) => void;
}

export default function LeadershipCard({ role, index, isAdmin = false, onUpdate }: LeadershipCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setRotateX(-(y / (rect.height / 2)) * 6);
    setRotateY((x / (rect.width / 2)) * 6);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const getRoleAesthetics = () => {
    switch (role.id) {
      case 'iic-lead':
        return {
          icon: <Shield className="w-4 h-4 text-brand-blue" />,
          borderColor: 'border-brand-blue/20 hover:border-brand-blue/50',
          textColor: 'text-brand-blue',
          bgColor: 'bg-brand-blue/10',
          glow: 'glow-blue',
        };
      case 'edc-manager':
        return {
          icon: <Award className="w-4 h-4 text-brand-emerald" />,
          borderColor: 'border-brand-emerald/20 hover:border-brand-emerald/50',
          textColor: 'text-brand-emerald',
          bgColor: 'bg-brand-emerald/10',
          glow: 'glow-emerald',
        };
      case 'kkem-ambassador':
        return {
          icon: <Compass className="w-4 h-4 text-indigo-400" />,
          borderColor: 'border-indigo-500/20 hover:border-indigo-500/50',
          textColor: 'text-indigo-400',
          bgColor: 'bg-indigo-500/10',
          glow: 'shadow-[0_0_15px_rgba(99,102,241,0.2)]',
        };
      case 'bridgegap-rep':
        return {
          icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
          borderColor: 'border-cyan-500/20 hover:border-cyan-500/50',
          textColor: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          glow: 'shadow-[0_0_15px_rgba(34,211,238,0.2)]',
        };
      default:
        return {
          icon: <Users className="w-4 h-4 text-rose-400" />,
          borderColor: 'border-rose-500/20 hover:border-rose-500/50',
          textColor: 'text-rose-400',
          bgColor: 'bg-rose-500/10',
          glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]',
        };
    }
  };

  const aesthetics = getRoleAesthetics();

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsOpen(!isOpen)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.01 : 1})`,
        transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className={`relative w-full max-w-xl mx-auto holo-glass p-3 md:p-3.5 rounded-xl border ${aesthetics.borderColor} overflow-hidden group cursor-pointer transition-colors duration-300`}
    >
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Glow dot */}
      <div className={`absolute top-3 right-3 w-1 h-1 rounded-full ${aesthetics.textColor === 'text-brand-blue' ? 'bg-brand-blue animate-pulse' : 'bg-brand-emerald animate-pulse'}`} />

      <div className="flex flex-col gap-2.5 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-1.5 rounded-lg ${aesthetics.bgColor} border border-white/5 shrink-0`}>
              {aesthetics.icon}
            </div>
            <div className="text-left min-w-0">
              <h4 
                contentEditable={isAdmin}
                suppressContentEditableWarning
                onClick={(e) => { if (isAdmin) e.stopPropagation(); }}
                onBlur={(e) => {
                  onUpdate?.({ ...role, title: e.currentTarget.textContent || '' });
                }}
                className={`font-display font-bold text-sm md:text-base text-white group-hover:text-brand-blue transition-colors leading-tight ${
                  isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 px-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text truncate-none' : 'truncate'
                }`}
              >
                {role.title}
              </h4>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider leading-none mt-1 truncate">
                <span
                  contentEditable={isAdmin}
                  suppressContentEditableWarning
                  onClick={(e) => { if (isAdmin) e.stopPropagation(); }}
                  onBlur={(e) => {
                    onUpdate?.({ ...role, organization: e.currentTarget.textContent || '' });
                  }}
                  className={isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 px-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''}
                >
                  {role.organization}
                </span>
                {' | '}
                <span 
                  contentEditable={isAdmin}
                  suppressContentEditableWarning
                  onClick={(e) => { if (isAdmin) e.stopPropagation(); }}
                  onBlur={(e) => {
                    onUpdate?.({ ...role, duration: e.currentTarget.textContent || '' });
                  }}
                  className={`${aesthetics.textColor} ${
                    isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 px-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
                  }`}
                >
                  {role.duration}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {role.metric && (
              <div className="px-2 py-0.5 rounded bg-black/40 border border-white/[0.02] text-right">
                <span 
                  contentEditable={isAdmin}
                  suppressContentEditableWarning
                  onClick={(e) => { if (isAdmin) e.stopPropagation(); }}
                  onBlur={(e) => {
                    onUpdate?.({
                      ...role,
                      metric: {
                        ...role.metric!,
                        label: e.currentTarget.textContent || ''
                      }
                    });
                  }}
                  className={`text-[8px] font-mono text-gray-500 uppercase tracking-widest block leading-none mb-0.5 ${
                    isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 px-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
                  }`}
                >
                  {role.metric.label}
                </span>
                <span 
                  contentEditable={isAdmin}
                  suppressContentEditableWarning
                  onClick={(e) => { if (isAdmin) e.stopPropagation(); }}
                  onBlur={(e) => {
                    onUpdate?.({
                      ...role,
                      metric: {
                        ...role.metric!,
                        value: e.currentTarget.textContent || ''
                      }
                    });
                  }}
                  className={`text-xs md:text-sm font-display font-extrabold tracking-tight ${aesthetics.textColor} ${aesthetics.glow} leading-none block ${
                    isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 px-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
                  }`}
                >
                  {role.metric.value}
                </span>
              </div>
            )}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500 group-hover:text-white transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>

        {/* Collapsible Details */}
        <motion.div
          initial={false}
          animate={{ height: isOpen || isAdmin ? 'auto' : 0, opacity: isOpen || isAdmin ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden text-left"
        >
          <div className="pt-2.5 border-t border-white/[0.05] mt-1 space-y-2.5">
            <p 
              contentEditable={isAdmin}
              suppressContentEditableWarning
              onClick={(e) => { if (isAdmin) e.stopPropagation(); }}
              onBlur={(e) => {
                onUpdate?.({ ...role, description: e.currentTarget.textContent || '' });
              }}
              className={`text-gray-300 text-xs leading-relaxed ${
                isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 p-1 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
              }`}
            >
              {role.description}
            </p>

            <div className="space-y-1.5">
              <span className="block text-[8px] font-mono tracking-widest text-gray-500 uppercase">
                Key Action Outcomes
              </span>
              {role.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <div className={`mt-0.5 flex items-center justify-center w-3 h-3 rounded bg-white/[0.02] border border-white/10 shrink-0`}>
                    <Check className={`w-2 h-2 ${aesthetics.textColor}`} />
                  </div>
                  <span 
                    contentEditable={isAdmin}
                    suppressContentEditableWarning
                    onClick={(e) => { if (isAdmin) e.stopPropagation(); }}
                    onBlur={(e) => {
                      const updatedHighlights = [...role.highlights];
                      updatedHighlights[idx] = e.currentTarget.textContent || '';
                      onUpdate?.({ ...role, highlights: updatedHighlights });
                    }}
                    className={`text-[11px] text-gray-400 leading-relaxed w-full ${
                      isAdmin ? 'outline-dashed outline-1 outline-brand-emerald/40 px-1 py-0.5 rounded bg-brand-emerald/5 hover:outline-brand-emerald cursor-text' : ''
                    }`}
                  >
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
