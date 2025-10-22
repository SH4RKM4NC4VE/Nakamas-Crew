import React, { useState, Suspense, lazy } from 'react';

// Lazy load components for better performance
const TideTV = lazy(() => import('@/components/TideTV'));
const CaptainCouncil = lazy(() => import('@/components/CaptainCouncil'));
const CoffeeBreak = lazy(() => import('@/components/CoffeeBreak'));
const Walkman = lazy(() => import('@/components/Walkman'));
const V3R_M4P4_Button = lazy(() => import('@/components/WalkmanManifesto'));
const Roadmap = lazy(() => import('@/components/Roadmap'));
const RecruitmentPact = lazy(() => import('@/components/RecruitmentPact'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="text-[#39ff14] text-center">
      <div className="animate-spin text-4xl mb-4">⚓</div>
      <p style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-sm">
        CARGANDO...
      </p>
    </div>
  </div>
);

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
        <Suspense fallback={<LoadingSpinner />}>
          <TideTV onComplete={() => handleShowSection('captain-council')} />
        </Suspense>
      </section>

      {/* Captain Council Section */}
      <section
        className={`main-section ${currentSection === 'captain-council' ? 'active' : ''}`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <CaptainCouncil onContinue={() => handleShowSection('coffee-break')} />
        </Suspense>
      </section>

      {/* Coffee Break Section */}
      <section
        className={`main-section ${currentSection === 'coffee-break' ? 'active' : ''}`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <CoffeeBreak onContinue={() => handleShowSection('walkman-music')} />
        </Suspense>
      </section>

      {/* Walkman Music Section */}
      <section
        className={`main-section ${currentSection === 'walkman-music' ? 'active' : ''}`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Walkman onContinue={() => handleShowSection('v3r-m4p4')} />
        </Suspense>
      </section>

      {/* V3R M4P4 Button Section */}
      <section
        className={`main-section ${currentSection === 'v3r-m4p4' ? 'active' : ''}`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <V3R_M4P4_Button onContinue={() => handleShowSection('roadmap')} />
        </Suspense>
      </section>

      {/* Roadmap Section */}
      <section
        className={`main-section ${currentSection === 'roadmap' ? 'active' : ''}`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Roadmap isActive={currentSection === 'roadmap'} />
        </Suspense>
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
        <Suspense fallback={<LoadingSpinner />}>
          <RecruitmentPact isActive={currentSection === 'recruitment'} />
        </Suspense>
      </section>
    </div>
  );
}

