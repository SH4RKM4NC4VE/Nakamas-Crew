import React, { useState } from 'react';

interface V3R_M4P4_ButtonProps {
  onContinue: () => void;
}

export default function V3R_M4P4_Button({ onContinue }: V3R_M4P4_ButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, dx: number, dy: number}>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true);
    
    // Generar partículas desde el centro del botón
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: centerX,
      y: centerY,
      dx: (Math.random() - 0.5) * 400,
      dy: (Math.random() - 0.5) * 400,
    }));
    
    setParticles(newParticles);
    
    // Simular la animación de explosión y luego continuar
    setTimeout(() => {
      onContinue();
    }, 1000); // Duración de la animación
  };

  return (
    <div className="hidden-until-active flex flex-col items-center justify-center min-h-screen px-4">
      <button
        onClick={handleClick}
        disabled={isClicked}
        className={`relative button-arcade-premium px-16 py-8 text-5xl md:text-6xl font-bold transition-all duration-300 ease-out
          ${isClicked ? 'animate-explode' : ''}`}
        style={{
          fontFamily: "'Press Start 2P', cursive",
          overflow: 'visible',
          boxShadow: isClicked 
            ? '0 0 100px #00bfff, 0 0 150px #00bfff, 0 0 200px #00bfff' 
            : '0 0 30px #00bfff, 0 0 60px #00bfff, 0 0 90px #00bfff',
          transition: 'all 0.3s ease-in-out',
          transform: isClicked ? 'scale(1.2)' : 'scale(1)',
          opacity: isClicked ? 0 : 1,
        }}
      >
        V3R M4P4
        
        {/* Partículas de explosión */}
        {isClicked && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-[#00bfff] rounded-sm animate-pixel-explode"
            style={{
              width: `${Math.random() * 12 + 6}px`,
              height: `${Math.random() * 12 + 6}px`,
              top: `${particle.y}px`,
              left: `${particle.x}px`,
              boxShadow: '0 0 10px #00bfff, 0 0 20px #00bfff',
              '--dx': `${particle.dx}px`,
              '--dy': `${particle.dy}px`,
            } as React.CSSProperties}
          />
        ))}
        
        {/* Efecto de onda expansiva */}
        {isClicked && (
          <>
            <div 
              className="absolute inset-0 border-4 border-[#00bfff] rounded-lg animate-shockwave"
              style={{
                boxShadow: '0 0 30px #00bfff',
              }}
            />
            <div 
              className="absolute inset-0 border-4 border-[#39ff14] rounded-lg animate-shockwave"
              style={{
                animationDelay: '0.1s',
                boxShadow: '0 0 30px #39ff14',
              }}
            />
          </>
        )}
      </button>
    </div>
  );
}

