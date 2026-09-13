import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GiftPresentationSettings, GiftSlide } from '../types';
import { 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  RotateCcw,
  Scissors,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { luxuryAudio } from '../utils/giftSoundEffects';
import { safeStorage } from '../utils/safeStorage';

interface GiftPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: GiftPresentationSettings;
  storeName?: string;
  monogram?: string;
}

const SLIDE_DURATION_MS = 50000; // ~50 segundos (quase um minuto por imagem)

export const GiftPresentationModal: React.FC<GiftPresentationModalProps> = ({
  isOpen,
  onClose,
  settings,
  storeName = 'Maison Entrelaço',
  monogram = 'ME'
}) => {
  // Current step: 0 to N-1 are image slides, step N is the ribbon cut ceremony in front of the store
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isRibbonCut, setIsRibbonCut] = useState(false);
  const [isCuttingAnimation, setIsCuttingAnimation] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // Default 7-image sequence with 100% original resolution lossless assets
  const defaultSlides: GiftSlide[] = [
    {
      id: 'slide-1',
      title: 'Imagem 1',
      message: '',
      imageUrl: '/presentation/slide-1.png'
    },
    {
      id: 'slide-2',
      title: 'Imagem 2',
      message: '',
      imageUrl: '/presentation/slide-2.png'
    },
    {
      id: 'slide-3',
      title: 'Imagem 3',
      message: '',
      imageUrl: '/presentation/slide-3.png'
    },
    {
      id: 'slide-4',
      title: 'Imagem 4',
      message: '',
      imageUrl: '/presentation/slide-4.png'
    },
    {
      id: 'slide-5',
      title: 'Imagem 5',
      message: '',
      imageUrl: '/presentation/slide-5.png'
    },
    {
      id: 'slide-6',
      title: 'Imagem 6',
      message: '',
      imageUrl: '/presentation/slide-6.png'
    },
    {
      id: 'slide-7',
      title: 'Imagem 7',
      message: '',
      imageUrl: '/presentation/slide-7.png'
    }
  ];

  const slides = settings?.slides && settings.slides.length > 0
    ? settings.slides
    : defaultSlides;

  // Total stages: all image slides + 1 ribbon cutting ceremony stage
  const totalImageSlides = slides.length;
  const isCeremonyStage = currentSlideIndex >= totalImageSlides;

  // Avançar imagens (só para frente)
  const handleAdvance = useCallback(() => {
    if (currentSlideIndex < totalImageSlides) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      setSlideProgress(0);
      luxuryAudio.playSlideChime(nextIndex);
    }
  }, [currentSlideIndex, totalImageSlides]);

  // Temporizador de quase 1 minuto por imagem com barra de progresso suave
  useEffect(() => {
    if (!isOpen || isCeremonyStage) {
      setSlideProgress(0);
      return;
    }

    setSlideProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / SLIDE_DURATION_MS) * 100, 100);
      setSlideProgress(progress);

      if (elapsed >= SLIDE_DURATION_MS) {
        clearInterval(interval);
        handleAdvance();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentSlideIndex, isOpen, isCeremonyStage, handleAdvance]);

  // Preload all 7 slides in memory for instant 100% crisp presentation
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.imageUrl) {
        const img = new Image();
        img.src = slide.imageUrl;
      }
    });
  }, [slides]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(0);
      setIsRibbonCut(false);
      setIsCuttingAnimation(false);
      setSlideProgress(0);
      document.body.style.overflow = 'hidden';
      // Play opening gentle chime
      setTimeout(() => {
        luxuryAudio.playSlideChime(0);
      }, 300);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    luxuryAudio.setMuted(nextMuted);
  };

  // Trigger grand celebration confetti explosion
  const triggerConfettiExplosion = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([120, 60, 180, 60, 250]);
    }

    const colors = ['#D4AF37', '#F3E5AB', '#E5BBA5', '#FFFFFF', '#C5A059', '#FFDF73', '#FF6B6B'];

    // Center burst
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.5 },
      colors
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 85,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors
      });
    }, 200);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 85,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors
      });
    }, 400);

    // Golden stars shower
    setTimeout(() => {
      confetti({
        particleCount: 140,
        spread: 130,
        origin: { y: 0.35 },
        shapes: ['circle', 'square'],
        colors
      });
    }, 700);
  };

  // Perform ribbon cutting ceremony with sound + confetti
  const handleCutRibbon = () => {
    if (isRibbonCut || isCuttingAnimation) return;

    setIsCuttingAnimation(true);

    // Play golden harp fanfare + realistic scissor snip
    luxuryAudio.playGrandOpeningFanfare();

    setTimeout(() => {
      setIsRibbonCut(true);
      setIsCuttingAnimation(false);
      triggerConfettiExplosion();
    }, 450);
  };

  // Entrar definitivamente na loja
  const handleFinishAndEnter = () => {
    safeStorage.setItem('maison_gift_seen', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const currentSlide = !isCeremonyStage ? slides[currentSlideIndex] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black select-none overflow-hidden"
      >
        {/* Container em formato mobile / tela cheia imersiva */}
        <div className="relative w-full h-full max-w-md mx-auto flex flex-col justify-between text-white overflow-hidden bg-[#0D0907] shadow-2xl">
          
          {/* ========================================================================= */}
          {/* 1. CENÁRIO DE FUNDO: IMAGEM DO SLIDE OU FACHADA DA LOJA COM O LAÇO        */}
          {/* ========================================================================= */}
          <div 
            className="absolute inset-0 z-0 cursor-pointer"
            onClick={!isCeremonyStage ? handleAdvance : (!isRibbonCut ? handleCutRibbon : undefined)}
          >
            <AnimatePresence mode="wait">
              {!isCeremonyStage ? (
                /* Slides de Imagens 1 a 7 com 100% fidelidade e qualidade original */
                <motion.div
                  key={currentSlide?.id || currentSlideIndex}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden"
                >
                  <img
                    src={currentSlide?.imageUrl || `/presentation/slide-${currentSlideIndex + 1}.png`}
                    alt={`Apresentação - Imagem ${currentSlideIndex + 1}`}
                    className="w-full h-full object-cover object-center select-none"
                    style={{ imageRendering: 'auto' }}
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ) : (
                /* Fachada da Loja Iluminada para o Corte do Laço */
                <motion.div
                  key="store-facade"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center bg-[#18110D]"
                >
                  {/* Foto de alta classe da boutique em frente à vitrine */}
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=90"
                    alt="Fachada da Boutique"
                    className={`w-full h-full object-cover object-center transition-all duration-1000 ${
                      isRibbonCut ? 'brightness-105 saturate-110' : 'brightness-[0.45] saturate-75 filter blur-[1px]'
                    }`}
                    referrerPolicy="no-referrer"
                  />

                  {/* Efeito de iluminação dourada após o corte */}
                  {isRibbonCut && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-t from-[#2B1A1B]/90 via-[#3E2123]/40 to-transparent pointer-events-none"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ========================================================================= */}
          {/* 2. BARRAS SUPERIORES (APENAS NA ETAPA FINAL DE INAUGURAÇÃO)               */}
          {/* ========================================================================= */}
          {isCeremonyStage ? (
            <div className="relative z-30 pt-[max(env(safe-area-inset-top,0px),12px)] px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-medium tracking-widest text-[#E5BBA5] drop-shadow-md bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10">
                Inauguração
              </span>

              <button
                onClick={toggleSound}
                className="p-1.5 rounded-full bg-black/40 border border-white/15 text-[#E5BBA5] hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Ativar Som' : 'Desativar Som'}
                aria-label="Controle de Áudio"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : null}

          {/* ========================================================================= */}
          {/* 3. ELEMENTO CENTRAL: LAÇO SENDO CORTADO EM FRENTE À LOJA                  */}
          {/* ========================================================================= */}
          <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4">
            {isCeremonyStage && (
              <div className="w-full flex flex-col items-center justify-center text-center space-y-6">
                
                {/* Mensagem Nobre de Inauguração */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-1.5"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E5BBA5]/20 border border-[#E5BBA5]/40 text-[#FAF5EE] text-[10px] uppercase tracking-widest font-semibold backdrop-blur-xs">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>Inauguração Oficial</span>
                  </div>
                  
                  <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {!isRibbonCut ? 'Corte a Fita de Entrada' : '✨ Boutique Oficialmente Aberta! ✨'}
                  </h2>
                  <p className="text-xs text-[#FAF5EE]/90 max-w-xs mx-auto drop-shadow-md font-light">
                    {!isRibbonCut 
                      ? 'Toque na tesoura ou no laço para inaugurar a loja com a bênção da Maison.'
                      : 'Seja muito bem-vindo ao seu novo universo de alta costura e aconchego.'}
                  </p>
                </motion.div>

                {/* Estrutura do Laço de Fita de Cetim e Lacre Central */}
                <div className="relative w-full h-36 flex items-center justify-center my-2">
                  
                  {/* Fita Esquerda */}
                  <motion.div
                    animate={
                      isRibbonCut
                        ? { x: -260, rotate: -25, opacity: 0 }
                        : isCuttingAnimation
                          ? { x: -10 }
                          : { x: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.65, ease: 'easeInOut' }}
                    className="absolute left-0 right-1/2 h-10 bg-gradient-to-r from-[#5B1019] via-[#8C1D2A] to-[#A32232] border-y border-[#D4AF37]/80 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-end overflow-hidden"
                  >
                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(212,175,55,0.15)_10px,rgba(212,175,55,0.15)_20px)]" />
                  </motion.div>

                  {/* Fita Direita */}
                  <motion.div
                    animate={
                      isRibbonCut
                        ? { x: 260, rotate: 25, opacity: 0 }
                        : isCuttingAnimation
                          ? { x: 10 }
                          : { x: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.65, ease: 'easeInOut' }}
                    className="absolute left-1/2 right-0 h-10 bg-gradient-to-r from-[#A32232] via-[#8C1D2A] to-[#5B1019] border-y border-[#D4AF37]/80 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-start overflow-hidden"
                  >
                    <div className="w-full h-full bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(212,175,55,0.15)_10px,rgba(212,175,55,0.15)_20px)]" />
                  </motion.div>

                  {/* Laço Central & Lacre de Cera */}
                  <motion.div
                    onClick={!isRibbonCut ? handleCutRibbon : undefined}
                    animate={
                      isRibbonCut
                        ? { scale: 0, rotate: 45, opacity: 0 }
                        : isCuttingAnimation
                          ? { scale: [1, 1.2, 0.9] }
                          : { scale: [1, 1.04, 1] }
                    }
                    transition={
                      isRibbonCut 
                        ? { duration: 0.45 } 
                        : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                    }
                    className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-[#997022] via-[#E8C26E] to-[#FFF4D4] p-1 shadow-[0_0_30px_rgba(212,175,55,0.8)] flex items-center justify-center cursor-pointer group"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8C1D2A] via-[#5C1019] to-[#3B070E] border-2 border-[#D4AF37] flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                      {/* Brilho animado */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      
                      <span className="font-serif text-lg font-bold text-[#FAF5EE] tracking-widest drop-shadow-md">
                        {monogram}
                      </span>
                      <span className="text-[7.5px] uppercase tracking-widest text-[#E5BBA5] font-semibold">
                        MAISON
                      </span>
                    </div>

                    {/* Ícone de Tesoura Dourada Flutuante */}
                    {!isRibbonCut && (
                      <motion.div
                        animate={{ 
                          x: isCuttingAnimation ? 0 : [8, -8, 8],
                          rotate: isCuttingAnimation ? [0, -30, 0] : [-15, 15, -15]
                        }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF2E0] to-[#C5A059] flex items-center justify-center text-[#2B1A1B] shadow-lg border border-amber-300"
                      >
                        <Scissors className="w-5 h-5 fill-current" />
                      </motion.div>
                    )}
                  </motion.div>

                </div>

              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 4. BARRA INFERIOR: SETA DELICADA DE PONTA A PONTA (OU BOTÕES NA CERIMÔNIA) */}
          {/* ========================================================================= */}
          <div className="relative z-30 pb-[max(env(safe-area-inset-bottom,0px),6px)] px-3 pt-0">
            {!isCeremonyStage ? (
              /* Seta fininha, longa e delicada de um lado para o outro com ponta de seta bem embaixo */
              <div 
                onClick={handleAdvance}
                className="w-full py-3 px-1 cursor-pointer flex items-center justify-center group select-none"
                role="button"
                tabIndex={0}
                aria-label="Prosseguir para a próxima imagem"
              >
                <div className="w-full flex items-center justify-end relative h-7">
                  {/* Linha fina comprida da seta */}
                  <div className="w-full h-[1.5px] bg-gradient-to-r from-white/10 via-white/40 to-[#FAF5EE] rounded-full group-hover:via-[#E5BBA5] group-hover:to-[#D4AF37] transition-all duration-300 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
                  
                  {/* Cabeça / Ponta da Seta na extremidade direita */}
                  <div className="shrink-0 flex items-center -ml-[3px] text-[#FAF5EE] group-hover:text-[#D4AF37] transition-colors duration-300 transform group-hover:translate-x-1">
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    >
                      <polyline points="10 5 18 12 10 19" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : !isRibbonCut ? (
              /* Botão de Cortar o Laço */
              <button
                onClick={handleCutRibbon}
                disabled={isCuttingAnimation}
                className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-[#E5BBA5] via-[#D4AF37] to-[#FFF2E0] text-[#241314] font-serif text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-amber-200"
              >
                <Scissors className="w-4 h-4 text-[#8C1D2A] fill-current animate-bounce" />
                <span>Cortar o Laço de Inauguração</span>
              </button>
            ) : (
              /* Botão de Entrar na Loja (Pós-Corte do Laço) */
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                <button
                  onClick={handleFinishAndEnter}
                  className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-[#E5BBA5] via-[#D4AF37] to-[#FFF2E0] text-[#241314] font-serif text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_35px_rgba(212,175,55,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-[#8C1D2A]" />
                  <span>Entrar na Loja</span>
                  <ArrowRight className="w-4 h-4 text-[#8C1D2A]" />
                </button>

                <button
                  onClick={() => {
                    setCurrentSlideIndex(0);
                    setIsRibbonCut(false);
                    setIsCuttingAnimation(false);
                    setSlideProgress(0);
                    setTimeout(() => luxuryAudio.playSlideChime(0), 200);
                  }}
                  className="w-full text-center text-[10px] uppercase tracking-wider text-[#E5BBA5]/80 hover:text-[#E5BBA5] py-1 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rever apresentação do início</span>
                </button>
              </motion.div>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
