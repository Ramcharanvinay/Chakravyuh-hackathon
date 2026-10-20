import React, { useState } from 'react';
import { ChakravyuhWheel } from './ChakravyuhWheel';
import { Track } from '../types';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Box, Layers, RefreshCw } from 'lucide-react';

interface SplineChakravyuhProps {
  tracks: Track[];
  selectedTrackId: string | null;
  onSelectTrack: (trackId: string) => void;
}

export const SplineChakravyuh: React.FC<SplineChakravyuhProps> = ({
  tracks,
  selectedTrackId,
  onSelectTrack,
}) => {
  const [viewMode, setViewMode] = useState<'geometric' | 'spline'>('geometric');
  const [splineFailed, setSplineFailed] = useState<boolean>(false);
  const [splineLoading, setSplineLoading] = useState<boolean>(false);

  const splineUrl = HACKATHON_CONFIG.splineSceneUrl;

  const handleToggleMode = (mode: 'geometric' | 'spline') => {
    if (mode === 'spline') {
      setSplineLoading(true);
      setSplineFailed(false);
    }
    setViewMode(mode);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* View Mode Mode Switcher (Tactical Pill) */}
      <div className="mb-4 z-10 flex items-center p-1 rounded-full bg-[#12141B]/80 border border-charcoal-border backdrop-blur-md text-xs">
        <button
          onClick={() => handleToggleMode('geometric')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 font-cinzel tracking-wider ${
            viewMode === 'geometric'
              ? 'bg-gold/20 text-gold border border-gold/40 shadow-gold-subtle'
              : 'text-ivory-muted hover:text-ivory'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>7-Ring Formation</span>
        </button>
        <button
          onClick={() => handleToggleMode('spline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 font-cinzel tracking-wider ${
            viewMode === 'spline'
              ? 'bg-gold/20 text-gold border border-gold/40 shadow-gold-subtle'
              : 'text-ivory-muted hover:text-ivory'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Spline 3D Scene</span>
        </button>
      </div>

      {/* Primary Display Area */}
      <div className="relative w-full flex items-center justify-center min-h-[460px]">
        {viewMode === 'geometric' || splineFailed ? (
          <ChakravyuhWheel
            tracks={tracks}
            selectedTrackId={selectedTrackId}
            onSelectTrack={onSelectTrack}
            size={520}
          />
        ) : (
          <div className="relative w-full max-w-[540px] h-[500px] flex items-center justify-center rounded-2xl overflow-hidden border border-gold/20 bg-[#0E1017]">
            {splineLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#08090D]/90 backdrop-blur-sm gap-3">
                <RefreshCw className="w-8 h-8 text-gold animate-spin" />
                <span className="font-cinzel text-xs text-gold/80 tracking-widest uppercase">
                  Summoning 3D Battlefield Projection...
                </span>
              </div>
            )}
            
            {/* Spline Custom Web Component */}
            {/* @ts-ignore */}
            <spline-viewer
              url={splineUrl}
              class="w-full h-full"
              onLoad={() => setSplineLoading(false)}
              onError={() => {
                setSplineLoading(false);
                setSplineFailed(true);
              }}
            />

            {/* In case Spline doesn't emit error event, timeout fallback is safe */}
            <div className="absolute bottom-3 right-3 text-[10px] text-ivory-muted/60 bg-[#12141B]/80 px-2 py-1 rounded border border-charcoal-border">
              Rotate & Drag in 3D Space
            </div>
          </div>
        )}
      </div>

      {splineFailed && viewMode === 'spline' && (
        <div className="mt-3 text-xs text-ember/90 bg-ember/10 border border-ember/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span>Spline scene unavailable or blocked. Reverted to dependable 7-ring geometric formation.</span>
        </div>
      )}
    </div>
  );
};
