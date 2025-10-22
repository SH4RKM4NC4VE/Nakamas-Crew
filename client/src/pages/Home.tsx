import React, { useState } from 'react';
import TideTV from '@/components/TideTV';
import CaptainCouncil from '@/components/CaptainCouncil';
import CoffeeBreak from '@/components/CoffeeBreak';
import Walkman from '@/components/Walkman';
import V3R_M4P4_Button from '@/components/WalkmanManifesto';
import Roadmap from '@/components/Roadmap';
import RecruitmentPact from '@/components/RecruitmentPact';

type Section = 'tidetv' | 'captain-council' | 'coffee-break' | 'walkman-music' | 'v3r-m4p4' | 'roadmap' | 'recruitment';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>('tidetv');

  const handleShowSection = (section: Section) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-black text-[#39ff14]">
      {/* TIDETV Section */}
      <section
        className={`main-section ${currentSection === 'tidetv' ? 'active' : ''}`}
      >
        <TideTV onComplete={() => handleShowSection('captain-council')} />
      </section>

      {/* Captain Council Section */}
      <section
        className={`main-section ${currentSection === 'captain-council' ? 'active' : ''}`}
      >
        <CaptainCouncil onContinue={() => handleShowSection('coffee-break')} />
      </section>

      {/* Coffee Break Section */}
      <section
        className={`main-section ${currentSection === 'coffee-break' ? 'active' : ''}`}
      >
        <CoffeeBreak onContinue={() => handleShowSection('walkman-music')} />
      </section>

      {/* Walkman Music Section */}
      <section
        className={`main-section ${currentSection === 'walkman-music' ? 'active' : ''}`}
      >
        <Walkman onContinue={() => handleShowSection('v3r-m4p4')} />
      </section>

      {/* V3R M4P4 Button Section */}
      <section
        className={`main-section ${currentSection === 'v3r-m4p4' ? 'active' : ''}`}
      >
        <V3R_M4P4_Button onContinue={() => handleShowSection('roadmap')} />
      </section>

      {/* Roadmap Section */}
      <section
        className={`main-section ${currentSection === 'roadmap' ? 'active' : ''}`}
      >
        <Roadmap isActive={currentSection === 'roadmap'} />
        <div className="flex justify-center mt-10 w-full">
          <button
            onClick={() => handleShowSection('recruitment')}
            className="button-arcade px-8 py-3 text-xl md:text-2xl"
          >
            Siguiente: Reclutamiento
          </button>
        </div>
      </section>

      {/* Recruitment Section */}
      <section
        className={`main-section ${currentSection === 'recruitment' ? 'active' : ''}`}
      >
        <RecruitmentPact isActive={currentSection === 'recruitment'} />
      </section>
    </div>
  );
}

