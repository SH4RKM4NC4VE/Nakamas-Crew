import React, { useState, useRef, useEffect } from 'react';

interface WalkmanProps {
  onContinue: () => void;
}

export default function Walkman({ onContinue }: WalkmanProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [waveAmplitude, setWaveAmplitude] = useState(0);
  const [volume, setVolume] = useState(0.7);
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
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
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
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
    <div className="hidden-until-active max-w-4xl w-full px-4">
      <h2 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-3xl md:text-4xl text-glow mb-8 text-center">
        Walkman NAKAMAS
      </h2>

      <div className="flex flex-col items-center justify-center gap-8">
        {/* Walkman Device */}
        <div className="relative w-full max-w-2xl">
          {/* Cuerpo del Walkman */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-[#39ff14] rounded-lg p-6 shadow-2xl"
            style={{
              boxShadow: `0 0 ${20 + waveAmplitude * 30}px #39ff14, inset 0 0 20px rgba(57, 255, 20, 0.2)`,
            }}>
            
            {/* Pantalla LCD simulada */}
            <div className="bg-black border-2 border-[#39ff14] rounded p-4 mb-6 relative overflow-hidden"
              style={{
                backgroundColor: '#1a1a1a',
                boxShadow: 'inset 0 0 10px rgba(57, 255, 20, 0.3)',
              }}>
              <div className="text-center text-[#39ff14]" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px' }}>
                <div className="mb-2">REY DE LOS EMPRENDEDORES</div>
                <div className="text-xs opacity-75">VAHOMAN - TUNOVA</div>
                <div className="text-xs opacity-50 mt-2">
                  {Math.floor(progress)}% ▓▓▓▓▓▓░░░░
                </div>
              </div>
            </div>

            {/* Casete animado */}
            <div className="bg-black border-4 border-[#39ff14] rounded-lg p-6 mb-6 relative overflow-hidden"
              style={{
                boxShadow: `inset 0 0 ${15 + waveAmplitude * 20}px rgba(217, 119, 6, 0.3)`,
              }}>
              
              <div className="flex justify-between items-center gap-8">
                {/* Rodillo izquierdo */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full border-4 border-[#39ff14] flex items-center justify-center relative"
                    style={{
                      background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
                      transform: `rotate(${isPlaying ? progress * 3.6 : 0}deg)`,
                      transition: 'transform 0.05s linear',
                    }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-6 bg-[#39ff14] opacity-60"
                        style={{
                          transform: `rotate(${i * 45}deg) translateY(-24px)`,
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xs text-[#39ff14]">A</span>
                </div>

                {/* Cinta visual */}
                <div className="flex-1 h-12 bg-black border-2 border-[#39ff14] rounded relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                  }}>
                  
                  {/* Efecto de cinta moviéndose */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 400 48" preserveAspectRatio="none">
                      <defs>
                        <pattern id="tape" x="0" y="0" width="40" height="48" patternUnits="userSpaceOnUse"
                          patternTransform={`translate(${isPlaying ? progress * 4 : 0}, 0)`}>
                          <rect x="0" y="8" width="8" height="32" fill="#39ff14" opacity="0.4" />
                          <rect x="16" y="8" width="8" height="32" fill="#39ff14" opacity="0.4" />
                          <rect x="32" y="8" width="8" height="32" fill="#39ff14" opacity="0.4" />
                        </pattern>
                      </defs>
                      <rect width="400" height="48" fill="url(#tape)" />
                    </svg>
                  </div>

                  {/* Indicador de volumen visual */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(Math.ceil(waveAmplitude * 5))].map((_, i) => (
                        <div
                          key={i}
                          className="mx-1"
                          style={{
                            width: '4px',
                            height: `${20 + waveAmplitude * 20 + i * 4}px`,
                            backgroundColor: '#39ff14',
                            opacity: 0.7 - i * 0.1,
                            borderRadius: '2px',
                            filter: `drop-shadow(0 0 ${2 + waveAmplitude * 5}px #39ff14)`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Rodillo derecho */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full border-4 border-[#39ff14] flex items-center justify-center relative"
                    style={{
                      background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
                      transform: `rotate(${isPlaying ? progress * 3.6 : 0}deg)`,
                      transition: 'transform 0.05s linear',
                    }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-6 bg-[#39ff14] opacity-60"
                        style={{
                          transform: `rotate(${i * 45}deg) translateY(-24px)`,
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xs text-[#39ff14]">B</span>
                </div>
              </div>

              {/* Etiqueta del casete */}
              <div className="absolute top-4 right-4 bg-black border-2 border-[#39ff14] px-3 py-1 rounded"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '10px',
                  color: '#39ff14',
                }}>
                CASETE
              </div>
            </div>

            {/* Controles */}
            <div className="space-y-4">
              {/* Botones de reproducción */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="button-arcade px-6 py-3 text-2xl"
                  style={{
                    boxShadow: isPlaying ? `0 0 20px #39ff14` : 'none',
                  }}>
                  {isPlaying ? '❚❚' : '▶'}
                </button>
              </div>

              {/* Control de volumen */}
              <div className="flex items-center gap-4 px-4">
                <span style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-[#39ff14] text-xs">
                  VOL
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-black border-2 border-[#39ff14] rounded appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #39ff14 0%, #39ff14 ${volume * 100}%, #000 ${volume * 100}%, #000 100%)`,
                  }}
                />
                <span style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-[#39ff14] text-xs w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* Indicador de estado */}
              {isPlaying && (
                <div className="text-center">
                  <div style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-[#39ff14] text-xs animate-pulse">
                    ♪ SUBE EL VOLUMEN ♪
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio element */}
        <audio
          ref={audioRef}
          src="/audio/vahoman.mp3"
          crossOrigin="anonymous"
        />

        {/* Botón para continuar */}
        <button
          onClick={onContinue}
          className="button-arcade px-8 py-3 text-xl md:text-2xl mt-4"
        >
          Continuar Viaje
        </button>
      </div>
    </div>
  );
}

