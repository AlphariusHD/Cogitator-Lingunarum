import React from 'react';
import { FactionTheme } from '../types/wh40k';

interface FactionBackgroundOverlayProps {
  theme: FactionTheme;
  customBlackTemplarsBg?: string | null;
  customMechanicusBg?: string | null;
  bgOpacity: number; // 0.1 to 1.0
  frameEnabled: boolean;
}

export const FactionBackgroundOverlay: React.FC<FactionBackgroundOverlayProps> = ({
  theme,
  customBlackTemplarsBg,
  customMechanicusBg,
  bgOpacity,
  frameEnabled,
}) => {
  const isBlackTemplars = theme === 'BLACK_TEMPLARS';
  const isMechanicus = theme === 'MECHANICUS';
  const isAlphaLegion = theme === 'ALPHA_LEGION';
  const isImperialGothic = theme === 'IMPERIAL_GOTHIC';

  const customBg = isBlackTemplars ? customBlackTemplarsBg : isMechanicus ? customMechanicusBg : null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none transition-all duration-700">
      {/* 1. Custom Wallpaper Layer (if uploaded by the user) */}
      {customBg ? (
        <div className="absolute inset-0 transition-opacity duration-700 pointer-events-none" style={{ opacity: bgOpacity }}>
          {/* Main Background Image - high fidelity cover & crisp contrast */}
          <div
            className="absolute inset-0 bg-no-repeat bg-contain sm:bg-cover bg-center sm:bg-right-bottom transition-all duration-700"
            style={{
              backgroundImage: `url(${customBg})`,
              filter: 'contrast(1.15) brightness(1.02) drop-shadow(0 0 20px rgba(0,0,0,0.8))',
            }}
          />
        </div>
      ) : null}

      {/* 2. FACTION-SPECIFIC HIGH-FIDELITY PROCEDURAL ARTWORK */}
      
      {/* A. BLACK TEMPLARS (Gotycki krzyżowiec w pancerzu Warhammera) */}
      {isBlackTemplars && !customBg && (
        <div 
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: bgOpacity }}
        >
          {/* Dark Gothic Hex Plating & Atmospheric Fog */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 75% 45%, rgba(40, 20, 25, 0.45) 0%, rgba(5, 5, 8, 0.95) 80%),
                repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255, 255, 255, 0.03) 24px),
                repeating-linear-gradient(60deg, transparent, transparent 23px, rgba(255, 255, 255, 0.03) 24px),
                repeating-linear-gradient(120deg, transparent, transparent 23px, rgba(255, 255, 255, 0.03) 24px)
              `
            }}
          />

          {/* Gothic Cathedral Pointed Arches in the background */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1200 800" className="w-full h-full object-cover" fill="none">
              <path d="M100 800 L100 350 Q300 100 500 350 L500 800" stroke="#71717a" strokeWidth="3" />
              <path d="M500 800 L500 350 Q700 100 900 350 L900 800" stroke="#71717a" strokeWidth="3" />
              <path d="M900 800 L900 350 Q1050 100 1200 350 L1200 800" stroke="#71717a" strokeWidth="3" />
              {/* Hanging Iron Chains */}
              <line x1="250" y1="0" x2="250" y2="400" stroke="#52525b" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="750" y1="0" x2="750" y2="350" stroke="#52525b" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="1050" y1="0" x2="1050" y2="450" stroke="#52525b" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Majestic Gothic Crusader Knight (Black Templars) */}
          <div className="absolute right-0 bottom-0 top-0 w-full sm:w-2/3 md:w-1/2 lg:w-5/12 max-w-[560px] opacity-85 mix-blend-screen pointer-events-none flex items-end justify-end">
            <svg viewBox="0 0 500 800" className="w-full h-full object-contain object-bottom filter drop-shadow-[0_0_25px_rgba(239,68,68,0.25)]" fill="none">
              {/* Back Red Halo / Glow */}
              <circle cx="250" cy="220" r="160" fill="radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)" />
              <circle cx="250" cy="200" r="130" stroke="#7f1d1d" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

              {/* Iron Relic Greatsword (Behind knight's hands, towering up) */}
              <g id="relic-sword">
                <line x1="250" y1="40" x2="250" y2="780" stroke="#e4e4e7" strokeWidth="7" strokeLinecap="round" />
                <line x1="247" y1="45" x2="247" y2="760" stroke="#ffffff" strokeWidth="2" />
                <path d="M250 30 L257 60 L243 60 Z" fill="#ffffff" />
                {/* Crossguard */}
                <rect x="180" y="220" width="140" height="12" rx="3" fill="#27272a" stroke="#a1a1aa" strokeWidth="1.5" />
                <circle cx="250" cy="226" r="10" fill="#991b1b" stroke="#f87171" strokeWidth="1.5" />
                <path d="M246 226 L254 226 M250 222 L250 230" stroke="#fef2f2" strokeWidth="1.5" />
                {/* Pommel Skull */}
                <circle cx="250" cy="265" r="7" fill="#d4d4d8" />
              </g>

              {/* Crusader Head & Helmet */}
              <g id="helmet">
                {/* Helmet Dome */}
                <path
                  d="M210 110 C210 65, 290 65, 290 110 C300 135, 305 170, 305 210 L195 210 C195 170, 200 135, 210 110 Z"
                  fill="#18181b"
                  stroke="#71717a"
                  strokeWidth="3"
                />
                {/* Faceplate Reinforcement Ridge */}
                <line x1="250" y1="75" x2="250" y2="205" stroke="#a1a1aa" strokeWidth="3" />
                {/* Horizontal Visor Ridge */}
                <path d="M215 145 L285 145" stroke="#71717a" strokeWidth="4" />
                {/* Glowing Blood-Red Eye Lenses */}
                <ellipse cx="232" cy="145" rx="14" ry="4" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 6px #ef4444)" />
                <ellipse cx="268" cy="145" rx="14" ry="4" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 6px #ef4444)" />
                <ellipse cx="232" cy="145" rx="7" ry="2" fill="#fecaca" />
                <ellipse cx="268" cy="145" rx="7" ry="2" fill="#fecaca" />
                {/* Respirator Grill */}
                <rect x="235" y="168" width="30" height="24" rx="2" fill="#09090b" stroke="#52525b" strokeWidth="1.5" />
                <line x1="240" y1="174" x2="260" y2="174" stroke="#71717a" strokeWidth="1.5" />
                <line x1="240" y1="180" x2="260" y2="180" stroke="#71717a" strokeWidth="1.5" />
                <line x1="240" y1="186" x2="260" y2="186" stroke="#71717a" strokeWidth="1.5" />
              </g>

              {/* Pauldrons (Shoulder Armour) with Black Templars Maltese Cross */}
              <g id="pauldrons">
                {/* Left Pauldron (White with black cross) */}
                <path
                  d="M195 180 C130 195, 110 270, 140 330 C165 340, 205 320, 220 280 Z"
                  fill="#f4f4f5"
                  stroke="#3f3f46"
                  strokeWidth="3.5"
                />
                {/* Black Maltese Cross on left pauldron */}
                <path
                  d="M165 240 L175 228 L172 243 L185 248 L172 253 L175 268 L165 256 L155 268 L158 253 L145 248 L158 243 L155 228 Z"
                  fill="#09090b"
                />

                {/* Right Pauldron */}
                <path
                  d="M305 180 C370 195, 390 270, 360 330 C335 340, 295 320, 280 280 Z"
                  fill="#f4f4f5"
                  stroke="#3f3f46"
                  strokeWidth="3.5"
                />
                {/* Black Maltese Cross on right pauldron */}
                <path
                  d="M335 240 L345 228 L342 243 L355 248 L342 253 L345 268 L335 256 L325 268 L328 253 L315 248 L328 243 L325 228 Z"
                  fill="#09090b"
                />
              </g>

              {/* Torso Ceramite Armour with Imperial Aquila & Chains */}
              <g id="torso">
                <path
                  d="M210 210 L290 210 L310 380 L190 380 Z"
                  fill="#09090b"
                  stroke="#52525b"
                  strokeWidth="3"
                />
                {/* Heavy Wrapped Iron Chains */}
                <path d="M150 250 Q250 320 350 250" stroke="#71717a" strokeWidth="5" strokeDasharray="6 4" fill="none" />
                <path d="M160 270 Q250 345 340 270" stroke="#a1a1aa" strokeWidth="4" strokeDasharray="5 4" fill="none" />
                {/* Golden/White Aquila Chest Relief */}
                <path
                  d="M230 250 L250 240 L270 250 L260 270 L250 260 L240 270 Z"
                  fill="#d4d4d8"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </g>

              {/* Gauntlets gripping the sword */}
              <g id="gauntlets">
                <ellipse cx="235" cy="245" rx="16" ry="12" fill="#27272a" stroke="#71717a" strokeWidth="2" />
                <ellipse cx="265" cy="245" rx="16" ry="12" fill="#27272a" stroke="#71717a" strokeWidth="2" />
                {/* Chain wrapped around hands */}
                <ellipse cx="250" cy="246" rx="28" ry="8" stroke="#a1a1aa" strokeWidth="3" strokeDasharray="4 3" fill="none" />
              </g>

              {/* Purity Seals fluttering */}
              <g id="purity-seals">
                {/* Left Seal */}
                <circle cx="150" cy="290" r="9" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M147 298 L142 370 L154 365 L151 298" fill="#fef3c7" stroke="#d97706" strokeWidth="1" opacity="0.9" />
                <line x1="145" y1="315" x2="151" y2="315" stroke="#78350f" strokeWidth="1" />
                <line x1="144" y1="330" x2="152" y2="330" stroke="#78350f" strokeWidth="1" />
                <line x1="144" y1="345" x2="150" y2="345" stroke="#78350f" strokeWidth="1" />

                {/* Right Seal */}
                <circle cx="340" cy="300" r="9" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M337 308 L334 380 L346 376 L342 308" fill="#fef3c7" stroke="#d97706" strokeWidth="1" opacity="0.9" />
                <line x1="336" y1="325" x2="343" y2="325" stroke="#78350f" strokeWidth="1" />
                <line x1="336" y1="340" x2="344" y2="340" stroke="#78350f" strokeWidth="1" />
              </g>

              {/* Lower Body / Black Tabard with White Maltese Border */}
              <g id="tabard">
                <path d="M190 380 L140 780 L360 780 L310 380 Z" fill="#050507" stroke="#27272a" strokeWidth="2" />
                <path d="M220 380 L190 780 L310 780 L280 380 Z" fill="#18181b" />
                {/* Maltese Cross on tabard bottom */}
                <path
                  d="M250 680 L265 660 L260 685 L280 690 L260 695 L265 720 L250 705 L235 720 L240 695 L220 690 L240 685 L235 660 Z"
                  fill="#f4f4f5"
                  opacity="0.8"
                />
              </g>
            </svg>
          </div>

          {/* Left Side: High Gothic Battle Litanies & Seal */}
          <div className="absolute left-6 top-16 hidden lg:block text-neutral-400 font-cogitator text-[10px] space-y-2 max-w-xs z-0 opacity-70">
            <div className="p-3 bg-neutral-950/80 border border-neutral-700/60 rounded shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white font-gothic text-xs border-b border-neutral-700/60 pb-1.5 mb-2 font-bold tracking-widest">
                <span>✠</span>
                <span>ZAKON BLACK TEMPLARS</span>
                <span>✠</span>
              </div>
              <p className="text-neutral-300 font-mono tracking-wider text-[9px] uppercase leading-relaxed">
                "NO PITY! NO REMORSE! NO FEAR!"
              </p>
              <p className="text-neutral-500 font-mono text-[8px] mt-1">
                PRIMARCH: ROGAL DORN • FIRST HIGH MARSHAL: SIGISMUND
              </p>
              <div className="mt-2 pt-2 border-t border-neutral-800 text-[9px] text-amber-500/80 font-mono flex items-center justify-between">
                <span>KRUCJATA WIECZNA</span>
                <span>M41.999</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. ADEPTUS MECHANICUS (Techno-Gotycka Konsola Mechanicum) */}
      {isMechanicus && !customBg && (
        <div 
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: bgOpacity }}
        >
          {/* Dark Industrial Mars Bronze & Grid Background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(50, 15, 15, 0.5) 0%, rgba(12, 5, 5, 0.98) 85%),
                radial-gradient(rgba(239, 68, 68, 0.12) 1.5px, transparent 1.5px),
                linear-gradient(to right, rgba(6, 182, 212, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(239, 68, 68, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 24px 24px, 48px 48px, 48px 48px'
            }}
          />

          {/* Central Giant Machina Opus (Omnissiah Cog & Skull) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-25 pointer-events-none">
            <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_120s_linear_infinite]" fill="none">
              {/* Giant Outer Gear */}
              <circle cx="200" cy="200" r="170" stroke="#ef4444" strokeWidth="8" strokeDasharray="30 15" opacity="0.6" />
              <circle cx="200" cy="200" r="140" stroke="#06b6d4" strokeWidth="3" strokeDasharray="8 6" opacity="0.4" />
              <circle cx="200" cy="200" r="110" stroke="#ef4444" strokeWidth="2" opacity="0.5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-48 h-48" fill="none">
                {/* Half Skull, Half Bionic Gear */}
                <path d="M100 40 C70 40, 50 65, 50 95 C50 120, 70 145, 85 155 L85 175 L115 175 L115 155 C130 145, 150 120, 150 95 C150 65, 130 40, 100 40 Z" fill="#201010" stroke="#ef4444" strokeWidth="3" />
                <line x1="100" y1="40" x2="100" y2="175" stroke="#06b6d4" strokeWidth="2" />
                {/* Left Human Eye Socket */}
                <circle cx="80" cy="95" r="12" fill="#0d0505" stroke="#ef4444" strokeWidth="2" />
                {/* Right Bionic Glowing Optic Eye */}
                <circle cx="120" cy="95" r="12" fill="#082f49" stroke="#06b6d4" strokeWidth="2" />
                <circle cx="120" cy="95" r="5" fill="#38bdf8" className="animate-ping" />
              </svg>
            </div>
          </div>

          {/* Left Side: Techno-Gothic CRT Cogitator Terminal */}
          <div className="absolute left-4 top-16 hidden md:block z-0 max-w-sm">
            <div className="p-3.5 bg-black/85 border border-cyan-500/50 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.35)] backdrop-blur-md font-cogitator text-cyan-400 text-xs">
              <div className="flex items-center justify-between border-b border-cyan-900 pb-2 mb-2 font-bold text-[10px] tracking-wider text-cyan-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  COGITATOR PROTOCOL // M41.88
                </span>
                <span className="text-red-400 font-mono">FORGE WORLD MARS</span>
              </div>
              <div className="space-y-1 font-mono text-[9px] text-cyan-300/90 leading-relaxed">
                <p>&gt; OMNISSIAH RECEPTOR: [CONNECTED]</p>
                <p>&gt; MACHINE SPIRIT: APPEASED</p>
                <p className="text-emerald-400">&gt; BINARY TRANSMISSION: NOMINAL</p>
                <p className="text-amber-300/90">&gt; SACRED CHANTS: VOCALIZED</p>
                <p className="text-red-400 font-bold">&gt; DEUS EST MACHINA</p>
              </div>
              <div className="mt-3 pt-2 border-t border-cyan-950 flex items-center justify-between text-[8px] text-neutral-400 font-mono">
                <span>01001001 01001101</span>
                <span className="text-cyan-400">DATAFLOW ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Right Side: Dual Glowing Coolant Plasma Tubes */}
          <div className="absolute right-6 top-16 hidden lg:flex flex-col items-center gap-4 z-0">
            <div className="p-3 bg-black/85 border border-red-900/60 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.3)] backdrop-blur-md flex flex-col items-center gap-3">
              <span className="font-cogitator text-[9px] font-bold tracking-widest text-red-400 uppercase">
                PLASMA COOLANT
              </span>
              <div className="flex items-center gap-3">
                {/* Tube 1: Cyan Plasma */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 h-36 rounded-full border-2 border-cyan-400/70 bg-black/80 relative overflow-hidden shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                    <div className="absolute bottom-0 inset-x-0 h-4/5 bg-gradient-to-t from-cyan-900 via-cyan-500 to-cyan-300 rounded-full animate-pulse opacity-90" />
                    <div className="absolute top-3 left-1.5 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </div>
                  <span className="text-[8px] font-mono text-cyan-400 font-bold">88% CY</span>
                </div>
                {/* Tube 2: Red Plasma */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 h-36 rounded-full border-2 border-red-500/70 bg-black/80 relative overflow-hidden shadow-[0_0_12px_rgba(239,68,68,0.6)]">
                    <div className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-red-950 via-red-600 to-red-400 rounded-full animate-pulse opacity-90" />
                    <div className="absolute top-5 left-1.5 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </div>
                  <span className="text-[8px] font-mono text-red-400 font-bold">74% RD</span>
                </div>
              </div>
              <span className="text-[8px] font-mono text-neutral-400">PUMPING AT 120 PSI</span>
            </div>
          </div>
        </div>
      )}

      {/* C. ALPHA LEGION (Hydra Dominatus) */}
      {isAlphaLegion && !customBg && (
        <div 
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: bgOpacity }}
        >
          {/* Deep Teal / Cyan Hexagonal Hydra Scale Mesh */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, rgba(4, 8, 15, 0.98) 80%),
                radial-gradient(rgba(0, 229, 255, 0.12) 1.5px, transparent 1.5px)
              `,
              backgroundSize: '100% 100%, 20px 20px'
            }}
          />
          {/* Central Hydra Silhouette */}
          <div className="absolute right-10 bottom-10 w-96 h-96 opacity-15 pointer-events-none hidden sm:block">
            <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
              <path d="M100 20 Q120 70 140 100 Q160 140 100 180 Q40 140 60 100 Q80 70 100 20 Z" stroke="#00e5ff" strokeWidth="2" />
              <path d="M70 70 Q50 30 30 50 Q40 90 70 100" stroke="#00e5ff" strokeWidth="2" />
              <path d="M130 70 Q150 30 170 50 Q160 90 130 100" stroke="#00e5ff" strokeWidth="2" />
              <circle cx="50" cy="45" r="3" fill="#00e5ff" className="animate-ping" />
              <circle cx="100" cy="25" r="3" fill="#00e5ff" className="animate-ping" />
              <circle cx="150" cy="45" r="3" fill="#00e5ff" className="animate-ping" />
            </svg>
          </div>
        </div>
      )}

      {/* D. IMPERIAL GOTHIC (Adeptus Terra) */}
      {isImperialGothic && !customBg && (
        <div 
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: bgOpacity }}
        >
          {/* Stone and Gold Warm Cathedral Glow */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.12) 0%, rgba(8, 9, 12, 0.98) 85%),
                radial-gradient(rgba(245, 158, 11, 0.08) 1.5px, transparent 1.5px)
              `,
              backgroundSize: '100% 100%, 24px 24px'
            }}
          />
          {/* Golden Imperial Aquila in Background */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] opacity-15 pointer-events-none">
            <svg viewBox="0 0 500 300" className="w-full h-full" fill="none">
              <path
                d="M250 50 L270 100 L350 80 L330 140 L450 120 L400 220 L300 200 L250 250 L200 200 L100 220 L50 120 L170 140 L150 80 L230 100 Z"
                stroke="#f59e0b"
                strokeWidth="4"
              />
              <circle cx="230" cy="85" r="6" fill="#f59e0b" />
              <circle cx="270" cy="85" r="6" fill="#f59e0b" />
            </svg>
          </div>
        </div>
      )}

      {/* 3. GOTHIC ORNAMENTAL OUTER FRAME */}
      {frameEnabled && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Top border relief with center crest */}
          <div className={`absolute top-0 inset-x-0 h-1.5 border-b ${
            isBlackTemplars 
              ? 'border-neutral-600 bg-gradient-to-r from-neutral-900 via-white/40 to-neutral-900' 
              : isMechanicus 
              ? 'border-red-600 bg-gradient-to-r from-red-950 via-red-500 to-red-950'
              : isAlphaLegion
              ? 'border-cyan-500 bg-gradient-to-r from-cyan-950 via-cyan-400 to-cyan-950'
              : 'border-amber-600 bg-gradient-to-r from-amber-950 via-amber-400 to-amber-950'
          }`} />
          
          {/* Bottom border relief */}
          <div className={`absolute bottom-0 inset-x-0 h-1.5 border-t ${
            isBlackTemplars ? 'border-neutral-700 bg-neutral-900' : isMechanicus ? 'border-red-900 bg-red-950' : 'border-neutral-800'
          }`} />

          {/* Left and Right border reliefs */}
          <div className="absolute inset-y-0 left-0 w-1.5 border-r border-neutral-800/80" />
          <div className="absolute inset-y-0 right-0 w-1.5 border-l border-neutral-800/80" />

          {/* Top-Center Faction Crest */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
            {isBlackTemplars ? (
              <div className="px-3.5 py-1 bg-neutral-950 border border-neutral-600 rounded-b shadow-[0_4px_15px_rgba(0,0,0,0.9)] flex items-center gap-2 text-white">
                <span className="text-xs">✠</span>
                <span className="font-gothic text-[10px] font-bold tracking-widest text-neutral-100">BLACK TEMPLARS</span>
                <span className="text-xs">✠</span>
              </div>
            ) : isMechanicus ? (
              <div className="px-3.5 py-1 bg-black border border-red-600 rounded-b shadow-[0_4px_15px_rgba(239,68,68,0.4)] flex items-center gap-2 text-red-400">
                <span className="text-xs">⚙️</span>
                <span className="font-cogitator text-[10px] font-bold tracking-widest text-red-300">ADEPTUS MECHANICUS</span>
                <span className="text-xs">⚙️</span>
              </div>
            ) : isAlphaLegion ? (
              <div className="px-3 py-1 bg-black border border-cyan-500 rounded-b shadow-[0_4px_15px_rgba(6,182,212,0.4)] flex items-center gap-2 text-cyan-400">
                <span className="text-xs">🐉</span>
                <span className="font-cogitator text-[10px] font-bold tracking-widest text-cyan-300">ALPHA LEGION</span>
                <span className="text-xs">🐉</span>
              </div>
            ) : (
              <div className="px-3 py-1 bg-black border border-amber-500 rounded-b shadow-[0_4px_15px_rgba(245,158,11,0.4)] flex items-center gap-2 text-amber-400">
                <span className="text-xs">𝕴</span>
                <span className="font-gothic text-[10px] font-bold tracking-widest text-amber-300">ADEPTUS TERRA</span>
                <span className="text-xs">𝕴</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Soft Vignette Shadow on outer edges (lighter when custom wallpaper is loaded) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          boxShadow: customBg ? 'inset 0 0 80px rgba(0, 0, 0, 0.4)' : 'inset 0 0 120px rgba(0, 0, 0, 0.75)'
        }}
      />
    </div>
  );
};
