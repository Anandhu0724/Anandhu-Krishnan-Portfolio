/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, KeyRound, Mail, X, Check, DatabaseBackup } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  onResetData: () => void;
}

export default function AdminConsole({ 
  isOpen, 
  onClose, 
  isAdmin, 
  setIsAdmin,
  onResetData
}: AdminConsoleProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Trigger login process
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioSystem.playClickBeep();

    if (!email.trim()) {
      setError('AUTHORIZATION REFUSED: EMAIL REQUIRED');
      audioSystem.playBeep(250, 0.25, 'sawtooth');
      return;
    }

    if (password === 'Azazel') {
      setError('');
      setSuccess(true);
      audioSystem.playBeep(600, 0.1, 'sine');
      setTimeout(() => audioSystem.playBeep(900, 0.15, 'sine'), 80);

      setTimeout(() => {
        setIsAdmin(true);
        localStorage.setItem('portfolio_admin_active', 'true');
        setSuccess(false);
        onClose();
      }, 1000);
    } else {
      setError('SECURITY FAULT: DECRYPTION KEY REFUSED');
      audioSystem.playBeep(180, 0.3, 'sawtooth');
    }
  };

  const handleLogout = () => {
    audioSystem.playClickBeep();
    setIsAdmin(false);
    localStorage.removeItem('portfolio_admin_active');
    onClose();
  };

  const handleResetPayload = () => {
    if (window.confirm('WARNING: This will clear all inline edits and restore defaults. Proceed?')) {
      audioSystem.playClickBeep();
      onResetData();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Console Modal Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#04060a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden z-10 font-mono"
          >
            {/* Holographic scanning effect line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-blue to-transparent animate-[shimmer_3s_infinite]" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#0a0f18]/80 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${isAdmin ? 'text-brand-emerald animate-pulse' : 'text-brand-blue'}`} />
                <span className="text-xs uppercase tracking-widest text-white font-bold">
                  {isAdmin ? 'ADMIN_CONSOLE_OVERLAYS' : 'GATEWAY_HANDSHAKE_INIT'}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5">
              {isAdmin ? (
                // IF ALREADY AUTHENTICATED
                <div className="space-y-4 text-center">
                  <div className="inline-flex p-3 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald mb-2">
                    <Check className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Administrative Override Active
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                    System mutation metrics are unlocked. You can now click directly on dashboard content, cards, headers, descriptions, and metrics to alter text in real-time.
                  </p>

                  <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                    <button
                      onClick={handleResetPayload}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      <DatabaseBackup className="w-3.5 h-3.5" />
                      <span>Reset Override Data</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 px-4 rounded-lg bg-red-950/20 border border-red-500/20 text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      Disable Override Mode
                    </button>
                  </div>
                </div>
              ) : (
                // LOGIN GATEWAY
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center pb-2">
                    <span className="text-[10px] text-brand-blue tracking-widest block mb-1">
                      CIPHER SECURITY CHALLENGE
                    </span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Handshake validation required. Enter credential tags to bypass production protection barriers.
                    </p>
                  </div>

                  {/* Input 1: Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[8px] tracking-widest uppercase text-gray-400">
                      Administrative Identity (Email)
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="identity@operations.sys"
                        className="w-full bg-[#080d14] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-gray-600"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Input 2: Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[8px] tracking-widest uppercase text-gray-400">
                      Decrypt Cipher Code
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-3 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#080d14] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-2.5 rounded bg-red-950/20 border border-red-500/20 text-[10px] text-red-400 leading-normal">
                      ⚠ {error}
                    </div>
                  )}

                  {/* Success Animation */}
                  {success && (
                    <div className="p-2.5 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-[10px] text-brand-emerald leading-normal flex items-center gap-2 justify-center">
                      <Check className="w-3.5 h-3.5 animate-bounce" />
                      <span>ACCESS KEY VALIDATED. INITIALIZING INJECTORS...</span>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-2 rounded-lg bg-[#080d14] hover:bg-white/5 border border-white/5 hover:border-white/10 text-xs text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={success}
                      className="flex-1 py-2 rounded-lg bg-brand-blue/15 hover:bg-brand-blue/25 border border-brand-blue/30 text-xs font-bold text-brand-blue hover:text-white transition-all cursor-pointer glow-blue disabled:opacity-50"
                    >
                      Validate Credentials
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
