export { AgniBackground } from './AgniBackground';
export { VajraBackground } from './VajraBackground';
export { VayuBackground } from './VayuBackground';
export { VanamBackground } from './VanamBackground';
export { SuryaBackground } from './SuryaBackground';
export { PageCulturalAtmosphere } from './PageCulturalAtmosphere';

import React from 'react';
import { AgniBackground } from './AgniBackground';
import { VajraBackground } from './VajraBackground';
import { VayuBackground } from './VayuBackground';
import { VanamBackground } from './VanamBackground';
import { SuryaBackground } from './SuryaBackground';

interface TrackCulturalBackgroundProps {
  trackId: string;
  isSelected: boolean;
  className?: string;
}

export const TrackCulturalBackground: React.FC<TrackCulturalBackgroundProps> = ({
  trackId,
  isSelected,
  className = '',
}) => {
  switch (trackId) {
    case 'track-agni':
      return <AgniBackground isSelected={isSelected} className={className} />;
    case 'track-vajra':
      return <VajraBackground isSelected={isSelected} className={className} />;
    case 'track-vayu':
      return <VayuBackground isSelected={isSelected} className={className} />;
    case 'track-vanam':
      return <VanamBackground isSelected={isSelected} className={className} />;
    case 'track-surya':
      return <SuryaBackground isSelected={isSelected} className={className} />;
    default:
      return null;
  }
};
