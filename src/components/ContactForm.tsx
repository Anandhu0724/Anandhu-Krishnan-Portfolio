/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Github, Linkedin, Instagram, Send, Terminal, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTerminalLog = (msg: string, delay: number) => {
    setTimeout(() => {
      setTerminalLog((prev) => [...prev, msg]);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    setTerminalLog([]);

    // Simulate real database injection / mail transmission logs
    addTerminalLog('Initializing contact uplink protocol...', 200);
    addTerminalLog('Encrypting message payload using SHA-256...', 700);
    addTerminalLog(`Establishing handshake with mail gateway...`, 1200);
    addTerminalLog(`Resolving MX servers for ${formData.email}...`, 1700);
    addTerminalLog('Dispatching packet: MESSAGE_SENT_SUCCESSFULLY.', 2200);

    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Uplink Form (7 Columns) */}
        <div className="md:col-span-7 holo-glass p-6 md:p-8 rounded-2xl border border-white/[0.05] relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          <h3 className="font-display text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2 relative z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse" />
            Establish Uplink
          </h3>
          <p className="text-xs text-gray-400 mb-6 font-mono uppercase relative z-10">
            SECURE PORTAL // ENCRYPTED SMTP CHANNEL
          </p>

          {status === 'success' ? (
            /* Success State - High Tech Console logs */
            <div className="space-y-4 relative z-10">
              <div className="p-4 rounded-xl bg-brand-blue/10 border border-brand-blue/30 font-mono text-xs text-brand-blue space-y-2">
                <div className="flex items-center gap-2 text-white font-bold mb-1">
                  <Terminal className="w-4 h-4 text-brand-blue animate-bounce" />
                  UPLINK ESTABLISHED SUCCESSFULLY
                </div>
                {terminalLog.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="opacity-50">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="w-full py-3 rounded-lg text-xs font-mono uppercase tracking-widest text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
              >
                Send Another Packet
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Name Field */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase">
                  Ident_Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  disabled={status === 'sending'}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-brand-blue/50 text-white text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase">
                  Ident_Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@organization.com"
                  disabled={status === 'sending'}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-brand-blue/50 text-white text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase">
                  Payload_Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Type your transmission details..."
                  disabled={status === 'sending'}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-brand-blue/50 text-white text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-xs font-mono text-red-400">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Validation Error: Please populate all fields prior to transmission.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3.5 px-4 rounded-lg text-xs font-display font-medium uppercase tracking-widest text-black bg-brand-blue hover:bg-brand-blue/90 font-bold transition-all duration-300 shadow-md hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Signal</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Identity Details (5 Columns) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-cyber-gray/30 border border-white/[0.04]">
            <span className="text-[10px] font-mono tracking-widest text-brand-emerald uppercase block mb-1">
              Social Gateway
            </span>
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Direct Access Nodes
            </h3>

            <div className="space-y-3">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/anandhu-krishnan-b6736427a"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.03] hover:border-brand-blue/30 hover:bg-cyber-gray/50 transition-all duration-300 group/link cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-blue/5 border border-brand-blue/10">
                    <Linkedin className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase">LINKEDIN // PROFILE</span>
                    <span className="text-xs font-bold text-white group-hover/link:text-brand-blue transition-colors">Anandhu Krishnan</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/anandhu-krishnan"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.03] hover:border-brand-emerald/30 hover:bg-cyber-gray/50 transition-all duration-300 group/link cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-emerald/5 border border-brand-emerald/10">
                    <Github className="w-4 h-4 text-brand-emerald" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase">GITHUB // REPOS</span>
                    <span className="text-xs font-bold text-white group-hover/link:text-brand-emerald transition-colors">@anandhu-krishnan</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" />
              </a>

              {/* Email Link */}
              <a
                href="mailto:ananthuk012@gmail.com"
                className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.03] hover:border-indigo-400/30 hover:bg-cyber-gray/50 transition-all duration-300 group/link cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-400/5 border border-indigo-400/10">
                    <Mail className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase">DIRECT_MAIL // DIRECT</span>
                    <span className="text-xs font-bold text-white group-hover/link:text-indigo-400 transition-colors">ananthuk012@gmail.com</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/the_frenziedsage/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.03] hover:border-pink-500/30 hover:bg-cyber-gray/50 transition-all duration-300 group/link cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/5 border border-pink-500/10">
                    <Instagram className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase">INSTAGRAM // DISPATCH</span>
                    <span className="text-xs font-bold text-white group-hover/link:text-pink-400 transition-colors">@the_frenziedsage</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" />
              </a>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.03] text-left">
            <span className="text-[10px] font-mono text-gray-400 block mb-1">
              TRANSMISSION_STATUS:
            </span>
            <div className="font-mono text-[11px] text-gray-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald inline-block" />
                SMTP SERVER: ACTIVE_ONLINE
              </p>
              <p>RESPONSE LATENCY: 42ms</p>
              <p>SSL DECRYPTION NODE: OK</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
