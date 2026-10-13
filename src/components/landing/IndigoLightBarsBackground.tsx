'use client';

import React from 'react';

/**
 * IndigoLightBarsBackground
 * 
 * Deep indigo background with smooth animated horizontal light bars
 * inspired by Windows file-transfer progress animations.
 * 
 * Palette:
 * - Primary background: #101F55
 * - Deep background: #071936
 * - Highlight blue: #7EB8FF
 * - Accent gold glow: #E6B84A
 * - Light bars: Icy-blue (#7EB8FF) and crisp white (#FFFFFF)
 */
export const IndigoLightBarsBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full min-h-[100dvh] bg-[#071936] overflow-hidden select-none">
      {/* 1. Deep Indigo Base Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 70% at 50% 20%, #101F55 0%, #071936 85%)',
        }}
      />

      {/* 2. Soft Ambient Accent Gold Glow in Upper-Right Corner */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #E6B84A 0%, transparent 70%)',
        }}
      />

      {/* 3. Subtle Highlight Blue Ambient Center Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse, #7EB8FF 0%, transparent 70%)',
        }}
      />

      {/* 4. Windows File-Transfer Inspired Animated Light Tracks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Track 1: Near Top */}
        <div className="absolute top-[8%] left-0 right-0 h-[1px] bg-white/[0.03]">
          <div 
            className="windows-light-bar w-[140px] h-[1.5px] -top-[0.25px] bg-gradient-to-r from-transparent via-[#7EB8FF] to-transparent opacity-70"
            style={{ animationDuration: '9s', animationDelay: '0s' }}
          />
        </div>

        {/* Track 2: Upper Hero */}
        <div className="absolute top-[18%] left-0 right-0 h-[1px] bg-white/[0.04]">
          <div 
            className="windows-light-bar w-[220px] h-[1.5px] -top-[0.25px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"
            style={{ 
              animationDuration: '12s', 
              animationDelay: '2.5s',
              boxShadow: '0 0 10px rgba(126, 184, 255, 0.6), 0 0 3px rgba(255, 255, 255, 0.9)',
            }}
          />
          {/* Quick travelling pulse packet */}
          <div 
            className="windows-light-bar w-[45px] h-[2px] -top-[0.5px] bg-white opacity-90 rounded-full"
            style={{ 
              animationDuration: '5s', 
              animationDelay: '1s',
              boxShadow: '0 0 8px #FFFFFF, 0 0 14px #7EB8FF',
            }}
          />
        </div>

        {/* Track 3: Mid-Upper */}
        <div className="absolute top-[29%] left-0 right-0 h-[1px] bg-[#7EB8FF]/[0.05]">
          <div 
            className="windows-light-bar w-[95px] h-[1px] bg-gradient-to-r from-transparent via-[#7EB8FF] to-transparent opacity-75"
            style={{ animationDuration: '7.5s', animationDelay: '4s' }}
          />
        </div>

        {/* Track 4: Center Area */}
        <div className="absolute top-[42%] left-0 right-0 h-[1px] bg-white/[0.03]">
          <div 
            className="windows-light-bar w-[180px] h-[2px] -top-[0.5px] bg-gradient-to-r from-transparent via-[#7EB8FF] via-white to-transparent opacity-85"
            style={{ 
              animationDuration: '14s', 
              animationDelay: '0.5s',
              boxShadow: '0 0 12px rgba(126, 184, 255, 0.5)',
            }}
          />
          <div 
            className="windows-light-bar w-[60px] h-[1.5px] -top-[0.25px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
            style={{ animationDuration: '6s', animationDelay: '3.5s' }}
          />
        </div>

        {/* Track 5: Lower Mid */}
        <div className="absolute top-[56%] left-0 right-0 h-[1px] bg-white/[0.04]">
          <div 
            className="windows-light-bar w-[130px] h-[1.5px] -top-[0.25px] bg-gradient-to-r from-transparent via-[#7EB8FF] to-transparent opacity-65"
            style={{ animationDuration: '10s', animationDelay: '5s' }}
          />
        </div>

        {/* Track 6: Lower Form Zone */}
        <div className="absolute top-[70%] left-0 right-0 h-[1px] bg-[#7EB8FF]/[0.04]">
          <div 
            className="windows-light-bar w-[250px] h-[1.5px] -top-[0.25px] bg-gradient-to-r from-transparent via-white to-transparent opacity-75"
            style={{ 
              animationDuration: '13s', 
              animationDelay: '1.5s',
              boxShadow: '0 0 8px rgba(126, 184, 255, 0.4)',
            }}
          />
          <div 
            className="windows-light-bar w-[50px] h-[2px] -top-[0.5px] bg-white opacity-85"
            style={{ animationDuration: '4.8s', animationDelay: '6s' }}
          />
        </div>

        {/* Track 7: Lower Bottom */}
        <div className="absolute top-[84%] left-0 right-0 h-[1px] bg-white/[0.03]">
          <div 
            className="windows-light-bar w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#7EB8FF] to-transparent opacity-60"
            style={{ animationDuration: '8.5s', animationDelay: '3s' }}
          />
        </div>

        {/* Track 8: Base */}
        <div className="absolute top-[94%] left-0 right-0 h-[1px] bg-white/[0.02]">
          <div 
            className="windows-light-bar w-[160px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
            style={{ animationDuration: '11s', animationDelay: '7s' }}
          />
        </div>
      </div>

      {/* 5. Contrast Vignette (Ensures 100% crisp typography & form readability) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(7, 25, 54, 0.25) 0%, rgba(16, 31, 85, 0.1) 40%, rgba(7, 25, 54, 0.6) 100%)',
        }}
      />

      {/* 6. Content Layer */}
      <div className="relative z-10 w-full min-h-[100dvh] flex flex-col">
        {children}
      </div>

      {/* CSS Keyframes for lightweight continuous horizontal gliding */}
      <style jsx global>{`
        @keyframes windowsLightGlide {
          0% {
            transform: translate3d(-350px, 0, 0);
          }
          100% {
            transform: translate3d(calc(100vw + 350px), 0, 0);
          }
        }

        .windows-light-bar {
          position: absolute;
          animation-name: windowsLightGlide;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .windows-light-bar {
            animation: none !important;
            transform: translate3d(15vw, 0, 0) !important;
            opacity: 0.2 !important;
          }
        }
      `}</style>
    </div>
  );
};
