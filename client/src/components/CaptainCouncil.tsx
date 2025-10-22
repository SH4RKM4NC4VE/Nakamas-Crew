import React from 'react';

interface CaptainCouncilProps {
  onContinue: () => void;
}

export default function CaptainCouncil({ onContinue }: CaptainCouncilProps) {
  return (
    <div className="hidden-until-active max-w-3xl w-full px-4">
      <h2 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-3xl md:text-4xl text-glow mb-6 text-center">
        Un Consejo del Capitán
      </h2>
      
      <div className="space-y-6 text-center">
        <p className="text-xl md:text-2xl leading-relaxed">
          "¡Nakama! Antes de zarpar hacia el Grand Line de la Web3, todo buen pirata necesita un momento para centrarse."
        </p>
        
        <p className="text-xl md:text-2xl leading-relaxed">
          "Ve y prepárate un buen café. Lo necesitarás para la aventura que nos espera. Te espero en el siguiente puesto de avanzada." - @Web3Sh4rK
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onContinue}
          className="button-arcade px-8 py-4 text-xl md:text-2xl"
        >
          Preparar Café
        </button>
      </div>
    </div>
  );
}

