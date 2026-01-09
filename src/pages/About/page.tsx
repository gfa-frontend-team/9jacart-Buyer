import HeroSection from "./HeroSection";
import VisionMissionSection from "./VisionMissionSection";
import WhatWeDoSection from "./WhatWeDoSection";
import BNPLSection from "./BNPLSection";
import PlatformFeatures from "./FeaturesSection";
import WhyWeMatter from "./ImpactSection";
import DifferentiatorsSection from "./DifferentiatorsSection";
import FutureSection from "./FutureSection";
import CTASection from "./AudienceSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Vision & Mission */}
      <VisionMissionSection />

      {/* What We Do */}
      <WhatWeDoSection />

      {/* BNPL Feature Highlight */}
      <BNPLSection />

      {/* Platform Features */}
      <PlatformFeatures />

      {/* Why We Matter */}

      <WhyWeMatter />
      {/* What Sets Us Apart */}
      <DifferentiatorsSection />

      {/* Looking Ahead */}
      <FutureSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default AboutPage;
