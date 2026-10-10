import React from 'react';
import { SEO } from '../components/common/SEO/SEO';
import { HeroSection } from '../sections/HeroSection';
import { IntroductionSection } from '../sections/IntroductionSection';
import { WhatIsDobatoSection } from '../sections/WhatIsDobatoSection';
import { MeaningOfDobatoSection } from '../sections/MeaningOfDobatoSection';
import { GrandLaunchSection } from '../sections/GrandLaunchSection';
import { EventExperienceSection } from '../components/common/EventExperienceSection/EventExperienceSection';
import { EventHighlightSection } from '../sections/EventHighlightSection';
import { PoetrySection } from '../sections/PoetrySection';
import { MusicSection } from '../sections/MusicSection';
import { VenueSection } from '../components/common/VenueSection/VenueSection';
import { PrizeTeaserSection } from '../sections/PrizeTeaserSection';
import { WhyDobatoSection } from '../sections/WhyDobatoSection';
import { FinalCTASection } from '../sections/FinalCTASection';
import { BRAND_NAME, BRAND_SLOGAN, EVENT_DATE } from '../constants/brand';

export const Home: React.FC = () => {
  return (
    <>
      <SEO
        title={`${BRAND_NAME} — ${BRAND_SLOGAN}`}
        description={`Dobatoo is a Nepali dating and meaningful-connection platform where two paths can meet and become one connection. Join the Dobatoo Grand Launch on ${EVENT_DATE}.`}
      />

      {/* Dobatoo Promotional Homepage Section Sequence */}
      <HeroSection />
      <IntroductionSection />
      <WhatIsDobatoSection />
      <MeaningOfDobatoSection />
      <GrandLaunchSection />
      <EventExperienceSection />
      <EventHighlightSection />
      <PoetrySection />
      <MusicSection />
      <VenueSection />
      <PrizeTeaserSection />
      <WhyDobatoSection />
      <FinalCTASection />
    </>
  );
};
