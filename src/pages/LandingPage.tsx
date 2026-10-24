import React, { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import LiveMarqueeTicker from '../components/landing/LiveMarqueeTicker';
import ProtocolSection from '../components/landing/ProtocolSection';
import TracksSection from '../components/landing/TracksSection';
import PrizePoolSection from '../components/landing/PrizePoolSection';
import SponsorsSection from '../components/landing/SponsorsSection';
import ClubsSection from '../components/landing/ClubsSection';
import RulesSection from '../components/landing/RulesSection';
import VenueSection from '../components/landing/VenueSection';
import LandingFooter from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F3F4F6] overflow-x-hidden selection:bg-white selection:text-black">
      <LandingNavbar />
      <main>
        <HeroSection />
        <LiveMarqueeTicker />
        <ProtocolSection />
        <TracksSection />
        <PrizePoolSection />
        <SponsorsSection />
        <ClubsSection />
        <RulesSection />
        <VenueSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
