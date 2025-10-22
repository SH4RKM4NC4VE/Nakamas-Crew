import React, { useState, useEffect, useCallback } from 'react';

interface TideTVProps {
  onComplete: () => void;
}

export default function TideTV({ onComplete }: TideTVProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const totalSlides = 10;

  // Mapeo de imágenes de las diapositivas
  const slideImages = [
    { main: '/slides/slide_01_img_1.webp', visual: '/slides/slide_01_img_2.webp' },
    { main: '/slides/slide_02_img_1.webp', visual: '/slides/slide_02_img_2.webp' },
    { main: '/slides/slide_03_img_1.webp', visual: '/slides/slide_03_img_2.webp' },
    { main: '/slides/slide_04_img_1.webp', visual: '/slides/slide_04_img_2.webp' },
    { main: '/slides/slide_05_img_1.webp', visual: '/slides/slide_05_img_2.webp' },
    { main: '/slides/slide_06_img_1.webp', visual: '/slides/slide_06_img_2.webp' },
    { main: '/slides/slide_07_img_1.webp', visual: '/slides/slide_07_img_2.webp' },
    { main: '/slides/slide_08_img_1.webp', visual: '/slides/slide_08_img_2.webp' },
    { main: '/slides/slide_09_img_1.webp', visual: '/slides/slide_09_img_2.webp' },
    { main: '/slides/slide_10_img_1.webp', visual: '/slides/slide_10_img_2.webp' },
  ];

  const currentImageSet = slideImages[currentSlide - 1];

  // Precargar imágenes adyacentes para transiciones suaves
  useEffect(() => {
    const preloadImages = (indices: number[]) => {
      indices.forEach((idx) => {
        if (idx >= 0 && idx < totalSlides) {
          const images = slideImages[idx];
          [images.main, images.visual].forEach((src) => {
            if (!loadedImages.includes(src)) {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                setLoadedImages((prev) => prev.includes(src) ? prev : [...prev, src]);
              };
            }
          });
        }
      });
    };

    // Precargar slide actual, siguiente y anterior
    const indicesToPreload = [
      currentSlide - 2,
      currentSlide - 1,
      currentSlide - 1, // índice actual (0-based)
      currentSlide,
      currentSlide + 1,
    ];
    preloadImages(indicesToPreload);
  }, [currentSlide, slideImages, loadedImages, totalSlides]);

  const handleNext = useCallback(() => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const handleEnter = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Enter' && currentSlide === totalSlides) handleEnter();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, handleNext, handlePrev, handleEnter, totalSlides]);

  const progress = (currentSlide / totalSlides) * 100;
  const isImageLoaded = loadedImages.includes(currentImageSet.visual);

  return (
    <div className="arcade-frame w-full max-w-4xl relative scanlines">
      <h1 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-3xl md:text-5xl text-glow mb-4">TIDETV</h1>
      
      <div className="relative aspect-video bg-black border-2 border-[#39ff14] mb-4 overflow-hidden flex items-center justify-center">
        {/* Imagen de fondo blanco (contenido) - preload */}
        <link rel="preload" as="image" href={currentImageSet.main} />
        <link rel="preload" as="image" href={currentImageSet.visual} />
        
        {/* Imagen de fondo blanco (contenido) */}
        <img
          src={currentImageSet.main}
          alt={`Diapositiva ${currentSlide} - Contenido`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        
        {/* Imagen visual superpuesta */}
        <img
          src={currentImageSet.visual}
          alt={`Diapositiva ${currentSlide} - Visual`}
          className={`relative w-full h-full object-contain transition-opacity duration-200 ${
            isImageLoaded ? 'opacity-100' : 'opacity-75'
          }`}
          loading="eager"
          decoding="async"
        />
        
        {/* Indicador de carga */}
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-[#39ff14] text-sm" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              ▓▓▓
            </div>
          </div>
        )}
      </div>

      <div className="progress-bar w-full h-4 mb-4">
        <div
          className="progress-bar-inner"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 1}
          className="button-arcade px-4 py-2 text-sm md:text-base"
          aria-label="Diapositiva anterior"
        >
          &lt; ATRÁS
        </button>
        
        <span style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-sm md:text-base">
          {currentSlide} / {totalSlides}
        </span>
        
        <button
          onClick={handleNext}
          disabled={currentSlide === totalSlides}
          className={`button-arcade px-4 py-2 text-sm md:text-base ${
            currentSlide === totalSlides ? 'hidden' : ''
          }`}
          aria-label="Siguiente diapositiva"
        >
          SIGUIENTE &gt;
        </button>
      </div>

      {currentSlide === totalSlides && (
        <button
          onClick={handleEnter}
          className="button-arcade px-8 py-3 mt-6 text-lg md:text-xl w-full md:w-auto"
        >
          ENTRAR A NAKAMAS-CREW
        </button>
      )}
    </div>
  );
}

