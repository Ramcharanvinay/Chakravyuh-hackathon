import React, { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import IntroGrandSection from '../components/landing/IntroGrandSection';
import HeroSection from '../components/landing/HeroSection';
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
    <div className="min-h-screen bg-[#08090B] text-[#C7BDA9] overflow-x-hidden selection:bg-[#C6A15B] selection:text-[#08090B]">
      <LandingNavbar />
      <main>
        <IntroGrandSection />
        <HeroSection />
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
