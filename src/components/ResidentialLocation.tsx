/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Compass, ChevronDown } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

export default function ResidentialLocation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    audioSystem.playClickBeep();
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 text-center z-30 relative">
      {/* Action Button */}
      <button
        onClick={toggleOpen}
        className="group relative px-5 py-2.5 bg-transparent border border-brand-emerald/30 text-[10px] font-mono uppercase tracking-widest text-brand-emerald rounded-lg hover:border-brand-emerald hover:text-white transition-all duration-300 cursor-pointer glow-emerald flex items-center justify-center gap-2 mx-auto active:scale-95"
      >
        <span className="absolute inset-0 rounded-lg bg-brand-emerald/5 opacity-40 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
        <Compass className="w-3.5 h-3.5 text-brand-emerald animate-spin-slow group-hover:text-white" />
        <span>[SYS_REF: LOCATE_RESIDENTIAL_NODE]</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-brand-emerald group-hover:text-white" />
        </motion.div>
      </button>

      {/* Expandable Accordion */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="pt-5 pb-2 text-left space-y-4">
          {/* Address Text inside Holo Glass Container */}
          <div className="holo-glass p-4 rounded-xl border border-white/[0.06] flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-brand-emerald/10 border border-brand-emerald/25 shrink-0">
              <MapPin className="w-4 h-4 text-brand-emerald animate-bounce" />
            </div>
            <div className="space-y-1">
              <span className="block text-[8px] font-mono tracking-widest text-gray-500 uppercase leading-none mb-1">
                SECURE_GEOLOCATION_STATION
              </span>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-sans">
                Residential Address: <strong className="text-white">Thottathil House, Mlamala, Thengakal P.O, Vandiperiyar, Peermade Sub District, Idukki District, Kerala, India. Pin code: 685533</strong>
              </p>
            </div>
          </div>

          {/* Embedded Google Map Iframe */}
          <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Real embedded maps iframe for Vandiperiyar, Idukki, Kerala */}
            <iframe
              src="https://maps.google.com/maps?q=Vandiperiyar,%20Idukki,%20Kerala&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale brightness-90 contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            />
            {/* Neon accent frame border decoration */}
            <div className="absolute inset-0 border border-brand-emerald/10 pointer-events-none rounded-xl" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
