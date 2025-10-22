import React, { useState, useEffect } from 'react';
import { uploadToIPFS } from '../utils/nftStorage';

interface RecruitmentPactProps {
  isActive: boolean;
}

interface FormData {
  wallet: string;
  portfolio: string;
  alias: string;
  role: string;
  contribution: string;
}

export default function RecruitmentPact({ isActive }: RecruitmentPactProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    wallet: '',
    portfolio: '',
    alias: '',
    role: '',
    contribution: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nftLink, setNftLink] = useState<string | null>(null);
  const [signedPact, setSignedPact] = useState(false);
  const [bottlePosition, setBottlePosition] = useState({ x: 0, y: 0 });

  // Check if pact was already signed
  useEffect(() => {
    const stored = localStorage.getItem('nakamas_crew_pact_signed');
    if (stored) {
      const pactData = JSON.parse(stored);
      setNftLink(`https://ipfs.io/ipfs/${pactData.cid}`);
      setSignedPact(true);
    }
  }, []);

  // Animación de la botella flotando en las olas
  useEffect(() => {
    if (!isActive) return;
    
    let frame = 0;
    const animate = () => {
      frame += 0.02;
      const x = Math.sin(frame) * 30;
      const y = Math.cos(frame * 0.8) * 20;
      setBottlePosition({ x, y });
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Crear 3 copias del pacto
      const timestamp = new Date().toISOString();
      
      // Copia 1: Para el postulante
      const pactPostulante = {
        ...formData,
        timestamp,
        type: 'NAKAMAS_CREW_PACT',
        recipient: 'POSTULANTE',
        alias: formData.alias
      };
      
      // Copia 2: Para TIDElabs
      const pactTIDElabs = {
        ...formData,
        timestamp,
        type: 'NAKAMAS_CREW_PACT',
        recipient: 'TIDELABS'
      };
      
      // Copia 3: Para el Capitán
      const pactCapitan = {
        ...formData,
        timestamp,
        type: 'NAKAMAS_CREW_PACT',
        recipient: 'CAPITAN'
      };
      
      // Subir las 3 copias a IPFS
      const [cid1, cid2, cid3] = await Promise.all([
        uploadToIPFS(pactPostulante),
        uploadToIPFS(pactTIDElabs),
        uploadToIPFS(pactCapitan)
      ]);
      
      const cid = cid1; // Usar el CID del postulante como principal

      const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;

      // Save to localStorage
      localStorage.setItem(
        'nakamas_crew_pact_signed',
        JSON.stringify({ ...formData, cid, signedAt: new Date().toISOString() })
      );

      setNftLink(ipfsUrl);
      setSignedPact(true);
      setFormData({ wallet: '', portfolio: '', alias: '', role: '', contribution: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('Error: No se pudo sellar el pacto. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hidden-until-active w-full max-w-4xl mx-auto text-center px-4">
      <h2 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-3xl md:text-4xl text-glow mb-6">
        Únete a la Tripulación Mugiwara
      </h2>

      <div className="arcade-frame mb-8">
        <p className="text-lg md:text-xl mb-6">
          Este es tu momento. Sella el pacto y conviértete en parte de la leyenda.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="button-arcade px-8 py-4 text-xl md:text-2xl mb-8"
        >
          Sellar Pacto
        </button>

        {/* Océano Blockchain con Botella Flotante */}
        <div className="relative w-full h-64 blockchain-ocean overflow-hidden rounded-lg mb-8">
          {/* Olas animadas */}
          <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#39ff14" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#39ff14" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00bfff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00bfff" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Ola 1 */}
            <path 
              d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z" 
              fill="url(#waveGradient1)"
              className="animate-wave"
            />
            
            {/* Ola 2 */}
            <path 
              d="M0,80 Q300,50 600,80 T1200,80 L1200,120 L0,120 Z" 
              fill="url(#waveGradient2)"
              className="animate-wave-slow"
            />
          </svg>

          {/* Botella flotante con mensaje - Clickeable */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
            style={{
              transform: `translate(calc(-50% + ${bottlePosition.x}px), calc(-50% + ${bottlePosition.y}px))`,
              transition: 'transform 0.1s linear',
            }}
            onClick={() => setShowModal(true)}
          >
            <div className="relative">
              {/* Botella SVG Pirata */}
              <svg width="120" height="160" viewBox="0 0 120 160" className="filter drop-shadow-[0_0_20px_#39ff14]">
                {/* Cuello de la botella */}
                <rect x="50" y="10" width="20" height="30" fill="#39ff14" opacity="0.3" stroke="#39ff14" strokeWidth="2"/>
                
                {/* Corcho */}
                <rect x="48" y="5" width="24" height="10" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
                
                {/* Cuerpo de la botella */}
                <path 
                  d="M 45 40 Q 35 50, 35 80 L 35 130 Q 35 145, 50 145 L 70 145 Q 85 145, 85 130 L 85 80 Q 85 50, 75 40 Z" 
                  fill="#39ff14" 
                  opacity="0.2" 
                  stroke="#39ff14" 
                  strokeWidth="3"
                />
                
                {/* Papel del mensaje dentro */}
                <rect x="45" y="60" width="30" height="40" fill="#f5f5dc" opacity="0.8" stroke="#8B4513" strokeWidth="1" rx="2"/>
                
                {/* Texto del mensaje */}
                <text x="60" y="75" fontSize="8" fill="#000" textAnchor="middle" fontFamily="monospace">PACTO</text>
                <text x="60" y="85" fontSize="6" fill="#000" textAnchor="middle" fontFamily="monospace">NAKAMA</text>
                <text x="60" y="93" fontSize="5" fill="#000" textAnchor="middle" fontFamily="monospace">CLICK</text>
                
                {/* Brillo */}
                <ellipse cx="55" cy="70" rx="8" ry="15" fill="#fff" opacity="0.3"/>
              </svg>
              
              {/* Glow pulsante */}
              <div 
                className="absolute inset-0 rounded-full opacity-40 animate-pulse"
                style={{
                  background: 'radial-gradient(circle, #39ff14 0%, transparent 70%)',
                  filter: 'blur(25px)',
                }}
              />
            </div>
          </div>

          {/* Partículas flotantes (bloques de blockchain) */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 border border-[#39ff14] bg-[#39ff14]/20 animate-float-particle"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            />
          ))}
        </div>

        <p className="mt-8 text-lg md:text-xl max-w-2xl mx-auto">
          Este no es solo un pacto. Es tu juramento para unirte a una tripulación que
          cambiará el mundo. Cada contribución, cada idea, es un paso más en nuestro
          viaje para que el capitán cumpla su sueño.
        </p>

        <p className="mt-6 text-2xl font-pixel">
          <a
            href="https://t.me/Web3Sh4rK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00bfff] underline hover:text-[#39ff14] transition-colors"
          >
            Voy a ser el Rey de los Emprendedores @Web3Sh4rK
          </a>
        </p>
      </div>

      {/* NDA Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="arcade-frame max-w-2xl w-full text-left relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 font-pixel text-red-500 text-2xl hover:text-[#39ff14]"
            >
              ×
            </button>

            <h3 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-2xl text-glow text-center mb-4">
              Pacto de Unión Mugiwara
            </h3>

            {!signedPact ? (
              <div>
                <p className="mb-4">
                  Para unirte a la tripulación y acceder a los tesoros, sella el pacto.
                  Esta información es tu identidad en nuestro nuevo mundo.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="wallet"
                    placeholder="Tu Dirección de Wallet (0x...)"
                    value={formData.wallet}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-black border border-[#39ff14] text-[#39ff14] placeholder-[#39ff14]/50 focus:outline-none focus:ring-2 focus:ring-[#39ff14]"
                  />

                  <input
                    type="url"
                    name="portfolio"
                    placeholder="Enlace a tu Portfolio / Red Social"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-black border border-[#39ff14] text-[#39ff14] placeholder-[#39ff14]/50 focus:outline-none focus:ring-2 focus:ring-[#39ff14]"
                  />

                  <input
                    type="text"
                    name="alias"
                    placeholder="Tu Alias Pirata"
                    value={formData.alias}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-black border border-[#39ff14] text-[#39ff14] placeholder-[#39ff14]/50 focus:outline-none focus:ring-2 focus:ring-[#39ff14]"
                  />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-black border border-[#39ff14] text-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]"
                  >
                    <option value="">Tu Rol en la Tripulación...</option>
                    <option value="Artista">Artista</option>
                    <option value="Desarrollador">Desarrollador</option>
                    <option value="Curador">Curador</option>
                    <option value="Inversor">Inversor</option>
                    <option value="Fan">Fan</option>
                  </select>

                  <textarea
                    name="contribution"
                    placeholder="¿Cómo puedes contribuir a la tripulación para ayudar al capitán a ser el Rey de los Emprendedores?"
                    value={formData.contribution}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full p-2 bg-black border border-[#39ff14] text-[#39ff14] placeholder-[#39ff14]/50 focus:outline-none focus:ring-2 focus:ring-[#39ff14]"
                  />

                  <div className="text-center text-xs text-[#00bfff] mt-2">
                    <a href="https://t.me/Web3Sh4rK" target="_blank" rel="noopener noreferrer" className="hover:text-[#39ff14] transition-colors">
                      Contacta al Capitán en Telegram: @Web3Sh4rK
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-arcade w-full py-3 text-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Forjando NFT...' : 'Firmar Pacto y Generar NFT'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center">
                <h4 style={{ fontFamily: "'Press Start 2P', cursive" }} className="text-xl text-glow mb-4">¡Pacto Sellado!</h4>
                <p className="mb-2">
                  Tu identidad de Mugiwara Web3 ha sido forjada. ¡Bienvenido a bordo,
                  Nakama!
                </p>
                <p className="mb-4 text-sm break-all">
                  Tu NFT Génesis está en IPFS:{' '}
                  <a
                    href={nftLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00bfff] underline"
                  >
                    {nftLink?.substring(0, 50)}...
                  </a>
                </p>
                <a
                  href="https://t.me/Web3Sh4rK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-arcade py-3 px-6 text-lg inline-block"
                >
                  Contactar al Capitán en Telegram
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

