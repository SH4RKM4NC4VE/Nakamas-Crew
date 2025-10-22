import React, { useState, useEffect, useRef } from 'react';

interface RoadmapProps {
  isActive: boolean;
}

export default function Roadmap({ isActive }: RoadmapProps) {
  const [shipPosition, setShipPosition] = useState(20);
  const roadmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleScroll = () => {
      if (!roadmapRef.current) return;

      const rect = roadmapRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const totalRoadmapHeight = roadmapRef.current.scrollHeight;
        const visibleRoadmapHeight = windowHeight;
        const scrollProgressMax = totalRoadmapHeight - visibleRoadmapHeight + 200;
        let scrollPosition =
          window.scrollY - (roadmapRef.current.offsetTop - windowHeight / 2);
        const progress = Math.max(0, Math.min(1, scrollPosition / scrollProgressMax));
        setShipPosition(20 + progress * 60);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isActive]);

  return (
    <div className="w-full">
      {/* Ship Container */}
      <div
        className="ship-container hidden md:flex justify-center items-center"
        style={{ top: `${shipPosition}%` }}
      >
        <div className="text-4xl" style={{ transform: 'rotate(-15deg)' }}>
          🏴‍☠️
        </div>
      </div>

      {/* Roadmap Content */}
      <div
        ref={roadmapRef}
        id="roadmap-content"
        className="hidden-until-active w-full max-w-4xl mx-auto text-center px-4"
      >
        <h2 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-3xl md:text-4xl text-glow mb-6">
          El Mapa del Grand Line
        </h2>

        <div className="space-y-16 text-left">
          {/* SAGA 1 */}
          <div className="arcade-frame">
            <h3 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-2xl text-yellow-300 mb-4">
              SAGA 1: EL EAST BLUE
            </h3>
            <p className="mb-6 text-lg">
              La Saga del Reclutamiento (Q4 2025 / Q1 2026)
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-black border border-[#39ff14]/50">
                <h4 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xl mb-2">
                  Arco 1: Isla del Amanecer (Tunova.io)
                </h4>
                <p className="mb-1">
                  <strong>Objetivo:</strong> Lanzamiento de la waitlist gamificada.
                </p>
                <p className="mb-1">
                  <strong>Hito:</strong> Reclutar a los primeros 10,000 NAKAMAS.
                </p>
                <p>
                  <strong>Recompensa:</strong> Puntos de Airdrop y "Casete Génesis"
                  NFT.
                </p>
              </div>

              <div className="p-4 bg-black border border-[#39ff14]/50">
                <h4 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xl mb-2">
                  Arco 2: Isla del Filo (NovaResearch)
                </h4>
                <p className="mb-1">
                  <strong>Objetivo:</strong> Beta cerrada del SaaS de scraping
                  musical.
                </p>
                <p className="mb-1">
                  <strong>Hito:</strong> Invitar a Artistas y Productores validados.
                </p>
                <p>
                  <strong>Recompensa:</strong> Acceso gratuito de por vida al SaaS.
                </p>
              </div>
            </div>
          </div>

          {/* SAGA 2 */}
          <div className="arcade-frame">
            <h3 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-2xl text-yellow-300 mb-4">
              SAGA 2: EL GRAND LINE
            </h3>
            <p className="mb-6 text-lg">
              La Saga de la Expansión (Q2 2026 / Q4 2026)
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-black border border-[#39ff14]/50">
                <h4 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xl mb-2">
                  Arco 3: Archipiélago Canario (TRB - MVP)
                </h4>
                <p>
                  <strong>Objetivo:</strong> Lanzamiento del MVP de la app TRB en
                  Tenerife.
                </p>
              </div>

              <div className="p-4 bg-black border border-[#39ff14]/50">
                <h4 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xl mb-2">
                  Arco 4: Loguetown del E-commerce (razAzar.shop)
                </h4>
                <p>
                  <strong>Objetivo:</strong> Lanzamiento del marketplace "Raza" y
                  "Azar".
                </p>
              </div>

              <div className="p-4 bg-black border border-[#39ff14]/50">
                <h4 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xl mb-2">
                  Arco 5: El Reverse Mountain (Lanzamiento $TIDE)
                </h4>
                <p>
                  <strong>Objetivo:</strong> Evento de Generación de Token (TGE).
                </p>
              </div>
            </div>
          </div>

          {/* SAGA 3 */}
          <div className="arcade-frame">
            <h3 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-2xl text-yellow-300 mb-4">
              SAGA 3: EL NUEVO MUNDO
            </h3>
            <p className="mb-6 text-lg">
              La Saga de la Consolidación (Q1 2027 / Q4 2027)
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-black border border-[#39ff14]/50">
                <h4 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xl mb-2">
                  Arco 6: Wano Country (Expansión Global)
                </h4>
                <p>
                  <strong>Objetivo:</strong> Expansión a mercados internacionales.
                </p>
              </div>

              <div className="p-4 bg-black border border-[#39ff14]/50">
                <h4 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xl mb-2">
                  Arco 7: Egghead (Innovación IA)
                </h4>
                <p>
                  <strong>Objetivo:</strong> Integración de tecnología de IA
                  avanzada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

