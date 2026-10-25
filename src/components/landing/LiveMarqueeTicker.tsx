import React from 'react';

const tickerItems = [
  '50 CURATED CHALLENGES',
  '5 SPECIALIZED BATTLE TRACKS',
  '₹7,00,000 WORTH PRIZE POOL',
  'VIT-AP UNIVERSITY AMARAVATI',
  'POWERED BY UNSTOP',
  'IMMUTABLE PROBLEM LOCKING',
  '48-HOUR SPRINT',
  'CYBERSECURITY & BLOCKCHAIN',
  'SPACE TECHNOLOGY',
  'QUANTUM COMPUTING',
  'INTELLIGENT FINTECH',
  'ENERGY & SUSTAINABILITY',
];

export const LiveMarqueeTicker: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/[0.08] bg-[#0A0B0F] py-3.5 select-none">
      <div className="flex w-max animate-marquee">
        {/* Render twice for continuous loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 px-6">
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.24em] font-medium text-zinc-300 whitespace-nowrap">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMarqueeTicker;
