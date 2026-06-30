/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, ShieldCheck, Trophy, Award, Briefcase, 
  Cpu, ChevronDown 
} from 'lucide-react';
import { TECH_SKILLS, CREDENTIALS } from '../data';

function ExpandableCredentialCard({ cred }: { key?: string; cred: typeof CREDENTIALS[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className="p-3 rounded-xl bg-cyber-gray/30 border border-white/[0.04] transition-all duration-300 hover:border-white/[0.08] hover:bg-cyber-gray/50 group cursor-pointer text-left"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="shrink-0">
          {cred.type === 'honor' ? (
            <div className="p-1.5 rounded-lg bg-brand-emerald/10 border border-brand-emerald/25">
              <Trophy className="w-4 h-4 text-brand-emerald" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/25">
              <Briefcase className="w-4 h-4 text-brand-blue" />
            </div>
          )}
        </div>

        {/* Details Summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-mono text-gray-500 uppercase truncate">
              {cred.date} | {cred.issuer}
            </span>
            <span className={`text-[8px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded shrink-0 ${
              cred.type === 'honor' ? 'bg-brand-emerald/5 text-brand-emerald border border-brand-emerald/10' : 'bg-brand-blue/5 text-brand-blue border border-brand-blue/10'
            }`}>
              {cred.type}
            </span>
          </div>

          <h4 className="font-display font-bold text-white text-xs md:text-sm group-hover:text-brand-blue transition-colors truncate mt-0.5">
            {cred.title}
          </h4>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500 group-hover:text-white transition-colors shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </div>

      {/* Expanded Content */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="pt-2.5 mt-2 border-t border-white/[0.05]">
          <p className="text-xs text-gray-400 leading-relaxed">
            {cred.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function TechStackDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'languages' | 'systems' | 'databases'>('all');
  const [selectedOS, setSelectedOS] = useState<'garuda' | 'wsl' | 'debian'>('garuda');

  const filteredSkills = TECH_SKILLS.filter(skill => {
    if (activeTab === 'all') return true;
    return skill.category === activeTab;
  });

  // OS Simulated terminal outputs to display
  const getTerminalOutput = () => {
    switch (selectedOS) {
      case 'garuda':
        return {
          prompt: '[anandhu@garuda-plasma ~]$',
          command: 'neofetch --backend shell',
          output: `OS: Garuda Linux x86_64
Kernel: 6.9.1-zen1-1-zen
Shell: fish 3.7.1
DE: KDE Plasma 6.0.4
WM: KWin (Wayland)
Terminal: Alacritty
CPU: AMD Ryzen 5 with Radeon Graphics
Graphics: Garuda Dr460nized Theme
Theme: Sweet-Ambar-Blue-Dark [GTK2/3]
Memory: Optimised for low-latency Java compilation & Docker development`
        };
      case 'wsl':
        return {
          prompt: 'anandhu@WSL-Ubuntu22-04:~$',
          command: 'wsl --status && uname -r',
          output: `Default Distribution: Ubuntu-22.04
Default Version: 2
WSLg (GUI support): Enabled
WSL Kernel version: 5.15.150.1-microsoft-standard-WSL2
Systemd init: Enabled (/etc/wsl.conf)
Interoperability: Path binding with Windows 11 host optimized
Integrated development path: /home/anandhu/workspace/mbceats`
        };
      case 'debian':
        return {
          prompt: 'root@debian-canteen-server:~#',
          command: 'systemctl status postgresql.service && java -version',
          output: `● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/lib/systemd/system/postgresql.service; enabled)
     Active: active (running) since Tue 2026-06-30 00:05:12 UTC
     Main PID: 8045 (postgres)
     Tasks: 8 (limit: 4915)

openjdk version "21.0.2" 2024-01-16
OpenJDK Runtime Environment (build 21.0.2+13-Debian-1)
OpenJDK 64-Bit Server VM (build 21.0.2+13-Debian-1, mixed mode)`
        };
    }
  };

  const term = getTerminalOutput();

  return (
    <div className="w-full max-w-6xl mx-auto p-1 md:p-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: System Terminal & Technology Inventory (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase">
                System Diagnostics
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                Development Ecosystem
              </h3>
            </div>
            {/* Tab controls */}
            <div className="flex flex-wrap gap-1 p-1 bg-cyber-gray/40 border border-white/5 rounded-lg w-fit">
              {(['all', 'languages', 'systems', 'databases'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/20'
                      : 'text-gray-400 hover:text-white border border-transparent'
                  }`}
                >
                  {tab === 'all' ? 'All Core' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Inventory Grid - Extremely Compact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSkills.map((skill) => (
              <div 
                key={skill.name} 
                className="px-3 py-2.5 rounded-xl bg-cyber-gray/30 border border-white/[0.04] hover:border-brand-blue/30 transition-all duration-300 group"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-mono font-bold text-white group-hover:text-brand-blue transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500">
                    {skill.level}% Optimized
                  </span>
                </div>
                
                {/* Simulated Segmented Progress Bar */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const threshold = (idx + 1) * 10;
                    const isActive = skill.level >= threshold;
                    return (
                      <div
                        key={idx}
                        className={`h-1 flex-1 rounded-xs transition-colors duration-500 ${
                          isActive 
                            ? skill.category === 'languages' || skill.category === 'systems'
                              ? 'bg-brand-blue/80 glow-blue'
                              : 'bg-brand-emerald/80 glow-emerald'
                            : 'bg-white/[0.05]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* OS Environment Terminal Container - Compacted */}
          <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-[#030508]/90 shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0a0f18]/80 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-brand-blue" />
                <span className="text-[10px] font-mono text-gray-300">anandhu@kernel_node_1</span>
              </div>
              
              {/* OS Switches */}
              <div className="flex gap-1">
                {[
                  { key: 'garuda', label: 'Garuda OS' },
                  { key: 'wsl', label: 'WSL2' },
                  { key: 'debian', label: 'Debian' }
                ].map((os) => (
                  <button
                    key={os.key}
                    onClick={() => setSelectedOS(os.key as any)}
                    className={`px-1.5 py-0.5 text-[8px] font-mono rounded cursor-pointer transition-colors ${
                      selectedOS === os.key
                        ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/20'
                        : 'bg-white/[0.02] text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {os.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Screen - Compact Height */}
            <div className="p-3.5 font-mono text-[10px] leading-relaxed text-gray-300 space-y-2 min-h-[130px] overflow-y-auto no-scrollbar">
              <div className="flex items-center gap-1.5">
                <span className="text-brand-emerald">{term.prompt}</span>
                <span className="text-white">{term.command}</span>
              </div>
              <pre className="text-gray-400 whitespace-pre-wrap select-none opacity-90 font-mono text-[9px] md:text-[10px]">
                {term.output}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Side: Credentials & Awards (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-brand-emerald uppercase">
              Verifiable Milestones
            </span>
            <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
              Honors & Internships
            </h3>
          </div>

          <div className="space-y-3">
            {CREDENTIALS.map((cred) => (
              <ExpandableCredentialCard key={cred.id} cred={cred} />
            ))}
          </div>

          {/* Verification Footnote Panel - Compact */}
          <div className="p-3.5 rounded-xl bg-brand-emerald/5 border border-brand-emerald/10 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-brand-emerald shrink-0 animate-pulse" />
            <div className="text-left min-w-0">
              <span className="text-[8px] font-mono text-brand-emerald tracking-widest uppercase block leading-none mb-0.5">
                CREDENTIALS VERIFIED
              </span>
              <span className="text-[10px] text-gray-400 leading-tight block">
                All awards and internships are officially signed, verifiable via academic portals.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
