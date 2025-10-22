import React, { useState, useRef, useEffect } from 'react';

interface CoffeeBreakProps {
  onContinue: () => void;
}

export default function CoffeeBreak({ onContinue }: CoffeeBreakProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const [waveAmplitude, setWaveAmplitude] = useState(0);
  const animationFrameRef = useRef<number>();

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
        
        // Inicializar Web Audio API
        if (!audioContextRef.current) {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          
          const source = audioContext.createMediaElementAudioSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          
          audioContextRef.current = audioContext;
          analyserRef.current = analyser;
          dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
      setCanContinue(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Permitir continuar después de 1 minuto
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanContinue(true);
    }, 60000); // 60 segundos
    return () => clearTimeout(timer);
  }, []);

  // Animación de ondas sincronizadas con el audio
  useEffect(() => {
    const updateWaves = () => {
      if (isPlaying && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
        setWaveAmplitude(average / 255);
      } else {
        setWaveAmplitude(0);
      }
      animationFrameRef.current = requestAnimationFrame(updateWaves);
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateWaves);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="hidden-until-active max-w-3xl w-full px-4">
      <h2 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-3xl md:text-4xl text-glow mb-6 text-center">
        Café y Podcast
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        {/* Coffee Cup Animation - Mejorado */}
        <div className="relative w-48 h-64 flex items-center justify-center">
          {/* Contenedor de la taza con efecto de glow pulsante */}
          <div className="absolute inset-0 rounded-sm border-4 border-[#39ff14] bg-black overflow-hidden coffee-cup-container"
            style={{
              boxShadow: `0 0 ${15 + waveAmplitude * 20}px #39ff14, inset 0 0 ${15 + waveAmplitude * 20}px #39ff14`,
              transition: 'box-shadow 0.1s ease-out'
            }}>
            
            {/* Líquido del café con animación de ondas - Se va bebiendo */}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700 coffee-liquid"
              style={{
                height: `${80 - progress * 0.8}%`, // Se va bebiendo a medida que avanza el podcast
                filter: `drop-shadow(0 0 ${5 + waveAmplitude * 10}px #d97706)`,
                transition: 'height 0.3s ease-out',
              }}>
              
              {/* Ondas visuales sincronizadas con el audio */}
              {isPlaying && (
                <>
                  {/* Capas de ondas para un efecto más pixelado y profundo */}
                  {[...Array(3)].map((_, i) => (
                    <svg
                      key={i}
                      className="absolute top-0 left-0 w-full h-full"
                      viewBox="0 0 200 100"
                      preserveAspectRatio="none"
                      style={{
                        opacity: Math.min(waveAmplitude * (0.3 + i * 0.2), 0.8),
                        transform: `translateY(${i * 2}px)`,
                      }}>
                      <defs>
                        <linearGradient id={`waveGradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M 0,${50 - waveAmplitude * (15 + i * 5)} Q 50,${50 - waveAmplitude * (25 + i * 5)} 100,${50 - waveAmplitude * (15 + i * 5)} T 200,${50 - waveAmplitude * (15 + i * 5)} L 200,100 L 0,100 Z`}
                        fill={`url(#waveGradient${i})`}
                        style={{
                          transition: 'all 0.05s ease-out',
                          filter: `drop-shadow(0 0 ${2 + waveAmplitude * 5}px #d97706)`,
                        }}
                      />
                    </svg>
                  ))}
                </>
              )}
            </div>

            {/* Vapor animado */}
            {isPlaying && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-20 pointer-events-none">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 rounded-full border-2 border-[#39ff14] opacity-40"
                    style={{
                      left: `${i * 20 - 20}px`,
                      animation: `steam-rise ${2 + i * 0.3}s ease-in infinite`,
                      animationDelay: `${i * 0.3}s`,
                      opacity: waveAmplitude * 0.6,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Texto "BEBIENDO..." o "LISTO" */}
            <span 
              className="absolute z-10 text-white text-xs md:text-sm font-bold"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                textShadow: `0 0 ${5 + waveAmplitude * 10}px #39ff14`,
                bottom: '10px',
              }}>
              {isPlaying ? 'BEBIENDO...' : (progress > 0 ? 'LISTO' : 'LISTO')}
            </span>
          </div>
        </div>

        {/* Podcast Player */}
        <div className="arcade-frame max-w-md w-full text-left p-4">
          <h3 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-lg text-glow mb-4">
            Podcast: Destripando TIDElabs...
          </h3>
          
          <audio
            ref={audioRef}
            src="/audio/podcast.m4a"
            crossOrigin="anonymous"
          />

          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="button-arcade text-2xl px-4 py-2 flex-shrink-0"
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            
            <div className="progress-bar h-3 flex-grow">
              <div
                className="progress-bar-inner"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

       <div className="text-center mt-8">
        {canContinue && (
          <button
            onClick={onContinue}
            className="button-arcade px-8 py-4 text-xl md:text-2xl"
          >
            Continuar Viaje
          </button>
        )}
      </div>
    </div>
  );
}

