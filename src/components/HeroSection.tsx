import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Camera,
  UploadCloud,
  Plus,
  Trash2,
  X,
  Sliders,
  Check,
  Type,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { HeroSettings, HeroSlide } from '../types';
import { uploadImageToSupabase } from '../lib/supabase';

interface HeroSectionProps {
  settings: HeroSettings;
  onDiscover: () => void;
  onExploreStories: () => void;
  isEditorMode?: boolean;
  onUpdateSettings?: (newSettings: HeroSettings) => void;
}

type HeroPopoverType = 'media' | 'tagline' | 'headline' | 'subtitle' | 'buttons' | 'settings' | null;

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onDiscover,
  onExploreStories,
  isEditorMode = false,
  onUpdateSettings
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activePopover, setActivePopover] = useState<HeroPopoverType>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Curated slides from settings or fallback
  const slides: HeroSlide[] = (settings.slides && settings.slides.length > 0)
    ? settings.slides
    : [
        {
          id: 'slide-1',
          type: settings.desktopMedia?.type || 'video',
          title: 'Atelier Maison Entrelaço',
          desktopUrl: settings.desktopMedia?.url || 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
          mobileUrl: settings.mobileMedia?.useSeparateMedia ? settings.mobileMedia.url : (settings.desktopMedia?.url || 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4'),
          posterUrl: settings.desktopMedia?.posterUrl
        }
      ];

  // Auto-rotation with clean Fade In / Fade Out
  useEffect(() => {
    if (!settings.carouselAutoplay || slides.length <= 1) return;

    const intervalSeconds = settings.carouselInterval || 6;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [settings.carouselAutoplay, settings.carouselInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Upload direto de foto ou vídeo do celular / computador
  const handleMediaUpload = async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) {
      alert('Por favor, selecione um arquivo de imagem ou vídeo válido (JPG, PNG, WebP, MP4, WebM).');
      return;
    }

    try {
      const url = await uploadImageToSupabase(file, 'hero-media');
      if (url && onUpdateSettings) {
        const updatedSlides = [...slides];
        const targetIndex = currentSlideIndex < updatedSlides.length ? currentSlideIndex : 0;
        
        updatedSlides[targetIndex] = {
          ...updatedSlides[targetIndex],
          type: isVideo ? 'video' : 'image',
          desktopUrl: url,
          mobileUrl: url
        };

        onUpdateSettings({
          ...settings,
          slides: updatedSlides,
          desktopMedia: {
            ...settings.desktopMedia,
            type: isVideo ? 'video' : 'image',
            url
          }
        });
      }
    } catch (err) {
      console.warn('Erro ao carregar mídia para o Hero:', err);
    }
  };

  const handleAddSlide = () => {
    if (!onUpdateSettings) return;
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      type: 'image',
      title: `Casa e Atelier • Slide ${slides.length + 1}`,
      desktopUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90',
      mobileUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=90',
      posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90'
    };
    const updated = [...slides, newSlide];
    onUpdateSettings({
      ...settings,
      slides: updated
    });
    setCurrentSlideIndex(updated.length - 1);
  };

  const handleRemoveSlide = (index: number) => {
    if (!onUpdateSettings || slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== index);
    onUpdateSettings({
      ...settings,
      slides: updated
    });
    setCurrentSlideIndex(Math.max(0, index - 1));
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const getSectionHeight = () => {
    switch (settings.height) {
      case 'medium':
        return 'h-[65vh] min-h-[440px]';
      case 'large':
        return 'h-[80vh] min-h-[520px]';
      case 'full':
      default:
        return 'h-screen min-h-[640px]';
    }
  };

  const getOverlayClass = () => {
    if (!settings.overlay.enabled) return 'bg-black/10';
    switch (settings.overlay.intensity) {
      case 'subtle':
        return 'bg-gradient-to-t from-[#241E1A]/80 via-black/15 to-black/25';
      case 'dark':
        return 'bg-gradient-to-t from-[#241E1A] via-black/55 to-black/70';
      case 'medium':
      default:
        return 'bg-gradient-to-t from-[#241E1A] via-black/30 to-black/40';
    }
  };

  const getAlignmentClass = () => {
    switch (settings.alignment) {
      case 'left':
        return 'items-start text-left';
      case 'right':
        return 'items-end text-right';
      case 'center':
      default:
        return 'items-center text-center';
    }
  };

  const getHeadlineSize = () => {
    switch (settings.elements.headline.size) {
      case 'medium':
        return 'text-2xl sm:text-4xl md:text-5xl';
      case 'huge':
        return 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl';
      case 'large':
      default:
        return 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl';
    }
  };

  // Check if any editorial element is enabled
  const hasEditorialContent =
    settings.elements.tagline.enabled ||
    settings.elements.headline.enabled ||
    settings.elements.subtitle.enabled ||
    settings.elements.primaryButton.enabled ||
    settings.elements.secondaryButton.enabled;

  return (
    <section
      id="hero"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full ${getSectionHeight()} flex items-center justify-center overflow-hidden bg-[#1C1714] select-none`}
    >
      {/* ========================================================================= */}
      {/* PONTOS DE TOQUE / BEACONS FLUTUANTES NO MODO EDITOR */}
      {/* ========================================================================= */}
      {isEditorMode && (
        <>
          {/* Beacon Superior Esquerdo: Mídia de Fundo & Slides */}
          <div className="absolute top-4 left-4 z-40">
            <button
              onClick={() => setActivePopover(activePopover === 'media' ? null : 'media')}
              className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#C5A059]/70 text-white hover:bg-black/95 text-[11px] font-medium tracking-wide flex items-center gap-2 shadow-2xl transition-all cursor-pointer group"
              title="Toque para trocar foto, vídeo ou gerenciar slides da Hero"
            >
              <span className="lottie-beacon-dot">
                <span className="lottie-beacon-wave" />
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_10px_rgba(212,175,55,0.95)]" />
              </span>
              <Camera className="w-3.5 h-3.5 text-[#E8E0D4] transition-transform group-hover:scale-110" />
              <span>Mídia de Fundo • Slide {currentSlideIndex + 1}/{slides.length}</span>
            </button>
          </div>

          {/* Beacon Superior Direito: Ajustes de Altura e Filtros */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
            <button
              onClick={() => setActivePopover(activePopover === 'settings' ? null : 'settings')}
              className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white hover:bg-black/95 text-[10.5px] uppercase tracking-wider flex items-center gap-1.5 shadow-2xl transition-all cursor-pointer group"
              title="Ajustar Altura, Escurecimento e Alinhamento da Hero"
            >
              <Sliders className="w-3 h-3 text-[#E8E0D4] transition-transform group-hover:rotate-45" />
              <span className="hidden sm:inline">Ajustes da Hero</span>
            </button>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 1. CINEMATIC CAROUSEL: FADE-IN / FADE-OUT (IMAGES & VIDEOS) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          const isVideo = slide.type === 'video';

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                  : 'opacity-0 scale-[1.04] z-0 pointer-events-none'
              }`}
            >
              {/* Desktop / Primary View */}
              {isVideo ? (
                <div className="w-full h-full relative bg-[#2A2420]">
                  <img
                    src={slide.posterUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90'}
                    alt={slide.title || 'Atelier Maison Entrelaço'}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-[1.04]"
                  />
                  <video
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    poster={slide.posterUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90'}
                    className="relative z-1 w-full h-full object-cover filter brightness-[0.88] contrast-[1.04]"
                  >
                    <source src={slide.desktopUrl} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <img
                  src={slide.desktopUrl}
                  alt={slide.title || 'Maison Entrelaço'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.02]"
                />
              )}
            </div>
          );
        })}

        {/* Chiaroscuro Atmospheric Overlay */}
        <div className={`absolute inset-0 z-10 pointer-events-none ${getOverlayClass()}`} />
        {settings.overlay.vignette && (
          <div className="absolute inset-0 z-10 bg-radial from-transparent via-black/15 to-black/60 pointer-events-none" />
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. EDITORIAL CONTENT & DIRECT TOUCH BEACONS */}
      {/* ========================================================================= */}
      {(hasEditorialContent || isEditorMode) && (
        <div className={`relative z-20 max-w-4xl mx-auto px-6 sm:px-8 text-white flex flex-col ${getAlignmentClass()}`}>
          {/* TAGLINE SUPERIOR */}
          {settings.elements.tagline.enabled ? (
            <div className="relative inline-block mb-6 sm:mb-8">
              <button
                onClick={() => isEditorMode && setActivePopover(activePopover === 'tagline' ? null : 'tagline')}
                className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 animate-in fade-in duration-700 transition-all ${
                  isEditorMode ? 'cursor-pointer hover:border-[#C5A059] hover:bg-white/20' : ''
                }`}
                title={isEditorMode ? "Toque para editar a Tagline" : undefined}
              >
                {settings.elements.tagline.icon && <Sparkles className="w-3.5 h-3.5 text-[#E8E0D4]" />}
                <span className="text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-[#F7F4EF] font-light">
                  {settings.elements.tagline.text}
                </span>
              </button>
              {isEditorMode && (
                <button
                  onClick={() => setActivePopover(activePopover === 'tagline' ? null : 'tagline')}
                  className="absolute -top-1.5 -right-2 lottie-beacon-dot cursor-pointer"
                  title="Editar Tagline"
                >
                  <span className="lottie-beacon-wave" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                </button>
              )}
            </div>
          ) : isEditorMode ? (
            <button
              onClick={() => setActivePopover('tagline')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-white/35 bg-black/40 text-white/70 hover:text-white hover:border-[#C5A059] mb-6 text-[10.5px] uppercase tracking-widest cursor-pointer transition-all"
              title="Ativar e escrever a Tagline superior"
            >
              <span className="lottie-beacon-dot">
                <span className="lottie-beacon-wave" />
                <span className="w-2 h-2 rounded-full bg-amber-400 lottie-beacon-core" />
              </span>
              <span>+ Tagline Superior</span>
            </button>
          ) : null}

          {/* HEADLINE (TÍTULO PRINCIPAL) */}
          {settings.elements.headline.enabled ? (
            <div className="relative inline-block mb-5 sm:mb-6">
              <h1
                onClick={() => isEditorMode && setActivePopover(activePopover === 'headline' ? null : 'headline')}
                className={`font-serif ${getHeadlineSize()} font-light tracking-wide leading-[1.15] text-[#F7F4EF] max-w-3xl drop-shadow-md transition-all ${
                  isEditorMode ? 'cursor-pointer hover:opacity-90' : ''
                }`}
                title={isEditorMode ? "Toque para editar o Título Principal" : undefined}
              >
                {settings.elements.headline.text}
              </h1>
              {isEditorMode && (
                <button
                  onClick={() => setActivePopover(activePopover === 'headline' ? null : 'headline')}
                  className="absolute -top-2.5 -right-3 sm:-right-5 lottie-beacon-dot cursor-pointer"
                  title="Editar Título Principal"
                >
                  <span className="lottie-beacon-wave" />
                  <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_10px_rgba(212,175,55,0.95)]" />
                </button>
              )}
            </div>
          ) : isEditorMode ? (
            <button
              onClick={() => setActivePopover('headline')}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xs border border-dashed border-white/40 bg-black/40 text-white/80 hover:text-white hover:border-[#C5A059] mb-6 text-sm font-serif cursor-pointer transition-all"
              title="Ativar e digitar o Título Principal da Hero"
            >
              <span className="lottie-beacon-dot">
                <span className="lottie-beacon-wave" />
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_10px_rgba(212,175,55,0.95)]" />
              </span>
              <span>+ Ativar Título Principal (Headline)</span>
            </button>
          ) : null}

          {/* SUBTITLE (SUBTÍTULO / DESCRIÇÃO) */}
          {settings.elements.subtitle.enabled ? (
            <div className="relative inline-block mb-8 sm:mb-12">
              <p
                onClick={() => isEditorMode && setActivePopover(activePopover === 'subtitle' ? null : 'subtitle')}
                className={`font-sans text-xs sm:text-sm md:text-base font-light tracking-widest text-white/90 max-w-xl uppercase leading-relaxed drop-shadow-sm transition-all ${
                  isEditorMode ? 'cursor-pointer hover:text-white' : ''
                }`}
                title={isEditorMode ? "Toque para editar o Subtítulo" : undefined}
              >
                {settings.elements.subtitle.text}
              </p>
              {isEditorMode && (
                <button
                  onClick={() => setActivePopover(activePopover === 'subtitle' ? null : 'subtitle')}
                  className="absolute -top-2 -right-3.5 lottie-beacon-dot cursor-pointer"
                  title="Editar Subtítulo"
                >
                  <span className="lottie-beacon-wave" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                </button>
              )}
            </div>
          ) : isEditorMode ? (
            <button
              onClick={() => setActivePopover('subtitle')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xs border border-dashed border-white/30 bg-black/35 text-white/65 hover:text-white hover:border-[#C5A059] mb-8 text-xs font-sans uppercase tracking-wider cursor-pointer transition-all"
              title="Ativar e escrever a frase de apoio / subtítulo"
            >
              <span className="lottie-beacon-dot">
                <span className="lottie-beacon-wave" />
                <span className="w-2 h-2 rounded-full bg-amber-400 lottie-beacon-core" />
              </span>
              <span>+ Subtítulo / Descrição</span>
            </button>
          ) : null}

          {/* ACTION BUTTONS (BOTÕES DE AÇÃO) */}
          {(settings.elements.primaryButton.enabled || settings.elements.secondaryButton.enabled) ? (
            <div className="relative inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              {settings.elements.primaryButton.enabled && (
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (isEditorMode) {
                        setActivePopover('buttons');
                      } else {
                        onDiscover();
                      }
                    }}
                    className="w-full sm:w-auto group px-7 sm:px-8 py-3.5 sm:py-4 bg-[#F7F4EF] text-[#3D3229] hover:bg-[#E8E0D4] text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
                    title={isEditorMode ? "Toque para configurar os botões de ação" : undefined}
                  >
                    <span>{settings.elements.primaryButton.text}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  {isEditorMode && (
                    <button
                      onClick={() => setActivePopover('buttons')}
                      className="absolute -top-1.5 -right-1.5 lottie-beacon-dot cursor-pointer"
                      title="Editar Botões de Ação"
                    >
                      <span className="lottie-beacon-wave" />
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                    </button>
                  )}
                </div>
              )}

              {settings.elements.secondaryButton.enabled && (
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (isEditorMode) {
                        setActivePopover('buttons');
                      } else {
                        onExploreStories();
                      }
                    }}
                    className="w-full sm:w-auto text-xs uppercase tracking-[0.25em] text-white/90 hover:text-white font-light py-3 border-b border-white/30 hover:border-white transition-all duration-300 text-center cursor-pointer"
                    title={isEditorMode ? "Toque para configurar os botões de ação" : undefined}
                  >
                    {settings.elements.secondaryButton.text}
                  </button>
                  {isEditorMode && !settings.elements.primaryButton.enabled && (
                    <button
                      onClick={() => setActivePopover('buttons')}
                      className="absolute -top-1.5 -right-1.5 lottie-beacon-dot cursor-pointer"
                      title="Editar Botões de Ação"
                    >
                      <span className="lottie-beacon-wave" />
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : isEditorMode ? (
            <button
              onClick={() => setActivePopover('buttons')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xs border border-dashed border-white/40 bg-black/40 text-white/80 hover:text-white hover:border-[#C5A059] text-xs uppercase tracking-widest cursor-pointer transition-all"
              title="Ativar botões de chamada para ação"
            >
              <span className="lottie-beacon-dot">
                <span className="lottie-beacon-wave" />
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_10px_rgba(212,175,55,0.95)]" />
              </span>
              <span>+ Botões de Ação (Explorar / Casas)</span>
            </button>
          ) : null}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DETALHES DO CARROSSEL (ESTRITAMENTE CENTRALIZADOS) E ÍCONE DE SOM PURO */}
      {/* ========================================================================= */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center">
          {/* Container dos Detalhes do Carrossel - Centralizado na tela sem desvio */}
          <div className="flex items-center gap-2.5 sm:gap-4 px-3.5 sm:px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-2xl transition-all duration-300 hover:bg-black/60">
            
            {/* Seta Anterior */}
            <button
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Slide anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Barras de Segmento / Detalhes de Cada Slide */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {slides.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(idx)}
                    className="group py-2 px-0.5 focus:outline-hidden"
                    aria-label={`Ir para o slide ${idx + 1}: ${slide.title || ''}`}
                    title={slide.title || `Slide ${idx + 1}`}
                  >
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${
                        isActive
                          ? 'w-6 sm:w-10 bg-[#E8E0D4] shadow-[0_0_8px_rgba(232,224,212,0.8)]'
                          : 'w-2.5 sm:w-4 bg-white/30 group-hover:bg-white/60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Contador Numérico Elegante */}
            <div className="font-serif text-[10px] sm:text-[11px] tracking-widest text-[#E8E0D4] font-light min-w-[32px] sm:min-w-[36px] text-center border-l border-white/20 pl-2 sm:pl-3 shrink-0">
              0{currentSlideIndex + 1} <span className="text-white/40 text-[9px]">/ 0{slides.length}</span>
            </div>

            {/* Seta Próximo */}
            <button
              onClick={nextSlide}
              aria-label="Próximo slide"
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Próximo slide"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Ícone de Som Puro: Fora do Container, Sem Caixa/Pai, Gap Ideal */}
          {settings.elements.ambientAudio.enabled && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Ativar som ambiente" : "Silenciar som"}
              className="absolute left-[calc(100%+14px)] sm:left-[calc(100%+18px)] top-1/2 -translate-y-1/2 text-white/80 hover:text-[#E8E0D4] transition-colors p-1 cursor-pointer focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
              title={isMuted ? "Ativar som ambiente" : "Silenciar som"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 opacity-75" strokeWidth={1.5} />
              ) : (
                <Volume2 className="w-4 h-4 text-[#E8E0D4]" strokeWidth={1.5} />
              )}
            </button>
          )}
        </div>
      )}

      {/* Caso haja apenas 1 slide */}
      {settings.elements.ambientAudio.enabled && slides.length <= 1 && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? "Ativar som ambiente" : "Silenciar som"}
          className="absolute bottom-8 right-6 z-30 text-white/80 hover:text-[#E8E0D4] transition-colors p-1 cursor-pointer focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
          title={isMuted ? "Ativar som ambiente" : "Silenciar som"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 opacity-75" strokeWidth={1.5} />
          ) : (
            <Volume2 className="w-4 h-4 text-[#E8E0D4]" strokeWidth={1.5} />
          )}
        </button>
      )}

      {/* ========================================================================= */}
      {/* 5. INDICADOR DE ROLAGEM (OPCIONAL) */}
      {/* ========================================================================= */}
      {settings.elements.scrollIndicator.enabled && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/80 font-light">
            {settings.elements.scrollIndicator.label}
          </span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-white/80 to-transparent animate-pulse" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAIS / POPOVERS DE EDIÇÃO DIRETA NO ITEM */}
      {/* ========================================================================= */}
      {isEditorMode && activePopover && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePopover(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF8F5] text-[#3D3229] rounded-xs border border-[#BFAE9C]/50 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setActivePopover(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#7A5B43] hover:bg-[#EAE4D9] transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ------------------------------------------------------------- */}
            {/* POPOVER 1: MÍDIA DE FUNDO & CARROSSEL                         */}
            {/* ------------------------------------------------------------- */}
            {activePopover === 'media' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Camera className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">Hero • Mídia & Carrossel</span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Mídia de Fundo do Atelier
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Alterne ou carregue fotos e vídeos cinematográficos para os slides de abertura da Maison.
                  </p>
                </div>

                {/* Seleção de Slide Ativo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Slide Selecionado ({currentSlideIndex + 1} de {slides.length})
                    </label>
                    <button
                      onClick={handleAddSlide}
                      className="text-[10.5px] text-[#7A5B43] hover:text-[#2C231C] font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Adicionar Slide</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {slides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => goToSlide(idx)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                          idx === currentSlideIndex
                            ? 'bg-[#7A5B43] text-white shadow-xs'
                            : 'bg-white border border-[#BFAE9C]/40 text-[#3D3229] hover:bg-[#F2EDE4]'
                        }`}
                      >
                        {slide.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        <span>Slide 0{idx + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alternador de Tipo: Foto vs Vídeo */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Tipo de Mídia do Slide
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-[#EFE9DF] p-1 rounded-xs">
                    <button
                      onClick={() => {
                        const updated = [...slides];
                        updated[currentSlideIndex] = { ...updated[currentSlideIndex], type: 'image' };
                        onUpdateSettings?.({ ...settings, slides: updated });
                      }}
                      className={`py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                        currentSlide?.type === 'image'
                          ? 'bg-[#7A5B43] text-white shadow-xs'
                          : 'text-[#3D3229] hover:bg-white/50'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Imagem / Foto</span>
                    </button>
                    <button
                      onClick={() => {
                        const updated = [...slides];
                        updated[currentSlideIndex] = { ...updated[currentSlideIndex], type: 'video' };
                        onUpdateSettings?.({ ...settings, slides: updated });
                      }}
                      className={`py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                        currentSlide?.type === 'video'
                          ? 'bg-[#7A5B43] text-white shadow-xs'
                          : 'text-[#3D3229] hover:bg-white/50'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Vídeo MP4 em Loop</span>
                    </button>
                  </div>
                </div>

                {/* Upload do Celular / Computador */}
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={mediaFileInputRef}
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMediaUpload(file);
                    }}
                  />
                  <button
                    onClick={() => mediaFileInputRef.current?.click()}
                    className="w-full py-3 px-4 bg-[#E8DFD3] hover:bg-[#DED2C3] active:scale-98 border border-dashed border-[#7A5B43] rounded flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#7A5B43] transition-all shadow-xs cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Carregar do Dispositivo (Foto ou Vídeo)</span>
                  </button>
                </div>

                {/* URL / Link Direto da Mídia */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Ou Cole o Link / URL da Mídia
                  </label>
                  <input
                    type="text"
                    value={currentSlide?.desktopUrl || ''}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[currentSlideIndex] = {
                        ...updated[currentSlideIndex],
                        desktopUrl: e.target.value,
                        mobileUrl: e.target.value
                      };
                      onUpdateSettings?.({
                        ...settings,
                        slides: updated,
                        desktopMedia: {
                          ...settings.desktopMedia,
                          url: e.target.value
                        }
                      });
                    }}
                    placeholder="https://exemplo.com/video.mp4 ou imagem.jpg"
                    className="w-full text-xs font-mono bg-white border border-[#BFAE9C]/60 rounded-xs p-2.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Título do Slide */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Título do Slide
                  </label>
                  <input
                    type="text"
                    value={currentSlide?.title || ''}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[currentSlideIndex] = {
                        ...updated[currentSlideIndex],
                        title: e.target.value
                      };
                      onUpdateSettings?.({ ...settings, slides: updated });
                    }}
                    placeholder="Casa I • Velas Aromáticas & Cera Vegetal"
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Excluir Slide */}
                {slides.length > 1 && (
                  <div className="pt-1">
                    <button
                      onClick={() => handleRemoveSlide(currentSlideIndex)}
                      className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1.5 font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir este slide</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* POPOVER 2: TAGLINE SUPERIOR                                   */}
            {/* ------------------------------------------------------------- */}
            {activePopover === 'tagline' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">Hero • Tagline Superior</span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Tagline de Abertura
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Pequena insígnia sutil que antecede a headline principal.
                  </p>
                </div>

                {/* Ativar/Desativar */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <span className="text-xs font-semibold text-[#3D3229]">Exibir Tagline na Hero</span>
                  <input
                    type="checkbox"
                    checked={settings.elements.tagline.enabled}
                    onChange={(e) => {
                      onUpdateSettings?.({
                        ...settings,
                        elements: {
                          ...settings.elements,
                          tagline: {
                            ...settings.elements.tagline,
                            enabled: e.target.checked
                          }
                        }
                      });
                    }}
                    className="w-4 h-4 accent-[#7A5B43]"
                  />
                </label>

                {/* Texto da Tagline */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Texto da Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.elements.tagline.text}
                    onChange={(e) => {
                      onUpdateSettings?.({
                        ...settings,
                        elements: {
                          ...settings.elements,
                          tagline: {
                            ...settings.elements.tagline,
                            text: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder="Atelier Maison Entrelaço"
                    className="w-full text-xs font-sans uppercase tracking-widest bg-white border border-[#BFAE9C]/60 rounded-xs p-2.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Ícone de Brilho */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <span className="text-xs font-semibold text-[#3D3229] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#7A5B43]" />
                    <span>Exibir Ícone de Brilho ✨</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.elements.tagline.icon}
                    onChange={(e) => {
                      onUpdateSettings?.({
                        ...settings,
                        elements: {
                          ...settings.elements,
                          tagline: {
                            ...settings.elements.tagline,
                            icon: e.target.checked
                          }
                        }
                      });
                    }}
                    className="w-4 h-4 accent-[#7A5B43]"
                  />
                </label>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* POPOVER 3: TÍTULO PRINCIPAL (HEADLINE)                        */}
            {/* ------------------------------------------------------------- */}
            {activePopover === 'headline' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Type className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">Hero • Título Principal</span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Título Principal da Loja (Headline)
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    A frase de impacto que define o universo artesanal da Maison Entrelaço.
                  </p>
                </div>

                {/* Ativar/Desativar */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <span className="text-xs font-semibold text-[#3D3229]">Exibir Título Principal na Hero</span>
                  <input
                    type="checkbox"
                    checked={settings.elements.headline.enabled}
                    onChange={(e) => {
                      onUpdateSettings?.({
                        ...settings,
                        elements: {
                          ...settings.elements,
                          headline: {
                            ...settings.elements.headline,
                            enabled: e.target.checked
                          }
                        }
                      });
                    }}
                    className="w-4 h-4 accent-[#7A5B43]"
                  />
                </label>

                {/* Texto do Título */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Texto do Título
                  </label>
                  <textarea
                    rows={3}
                    value={settings.elements.headline.text}
                    onChange={(e) => {
                      onUpdateSettings?.({
                        ...settings,
                        elements: {
                          ...settings.elements,
                          headline: {
                            ...settings.elements.headline,
                            text: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder="A Poesia do Feito à Mão."
                    className="w-full text-sm font-serif bg-white border border-[#BFAE9C]/60 rounded-xs p-3 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] leading-relaxed"
                  />
                </div>

                {/* Tamanho da Fonte */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Tamanho da Tipografia
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-[#EFE9DF] p-1 rounded-xs">
                    {(['medium', 'large', 'huge'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          onUpdateSettings?.({
                            ...settings,
                            elements: {
                              ...settings.elements,
                              headline: {
                                ...settings.elements.headline,
                                size
                              }
                            }
                          });
                        }}
                        className={`py-1.5 rounded text-xs font-medium capitalize transition-all ${
                          settings.elements.headline.size === size
                            ? 'bg-[#7A5B43] text-white shadow-xs font-semibold'
                            : 'text-[#3D3229] hover:bg-white/50'
                        }`}
                      >
                        {size === 'medium' ? 'Médio' : size === 'large' ? 'Grande' : 'Gigante'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* POPOVER 4: SUBTÍTULO / DESCRIÇÃO                              */}
            {/* ------------------------------------------------------------- */}
            {activePopover === 'subtitle' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Type className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">Hero • Subtítulo & Descrição</span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Subtítulo / Frase de Apoio
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Descrição refinada posicionada logo abaixo do título principal.
                  </p>
                </div>

                {/* Ativar/Desativar */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <span className="text-xs font-semibold text-[#3D3229]">Exibir Subtítulo na Hero</span>
                  <input
                    type="checkbox"
                    checked={settings.elements.subtitle.enabled}
                    onChange={(e) => {
                      onUpdateSettings?.({
                        ...settings,
                        elements: {
                          ...settings.elements,
                          subtitle: {
                            ...settings.elements.subtitle,
                            enabled: e.target.checked
                          }
                        }
                      });
                    }}
                    className="w-4 h-4 accent-[#7A5B43]"
                  />
                </label>

                {/* Texto do Subtítulo */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Texto do Subtítulo
                  </label>
                  <textarea
                    rows={3}
                    value={settings.elements.subtitle.text}
                    onChange={(e) => {
                      onUpdateSettings?.({
                        ...settings,
                        elements: {
                          ...settings.elements,
                          subtitle: {
                            ...settings.elements.subtitle,
                            text: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder="Europa monárquica · Botânica nobre · Feito à mão"
                    className="w-full text-xs font-sans bg-white border border-[#BFAE9C]/60 rounded-xs p-3 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* POPOVER 5: BOTÕES DE AÇÃO (CTAS)                              */}
            {/* ------------------------------------------------------------- */}
            {activePopover === 'buttons' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">Hero • Botões de Ação</span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Botões de Convite e Exploração
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Defina os botões que guiam os visitantes pelas Três Casas ou pela História do Atelier.
                  </p>
                </div>

                {/* Botão Principal */}
                <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C231C] uppercase tracking-wider">Botão Principal (Destaque)</span>
                    <input
                      type="checkbox"
                      checked={settings.elements.primaryButton.enabled}
                      onChange={(e) => {
                        onUpdateSettings?.({
                          ...settings,
                          elements: {
                            ...settings.elements,
                            primaryButton: {
                              ...settings.elements.primaryButton,
                              enabled: e.target.checked
                            }
                          }
                        });
                      }}
                      className="w-4 h-4 accent-[#7A5B43]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={settings.elements.primaryButton.text}
                      onChange={(e) => {
                        onUpdateSettings?.({
                          ...settings,
                          elements: {
                            ...settings.elements,
                            primaryButton: {
                              ...settings.elements.primaryButton,
                              text: e.target.value
                            }
                          }
                        });
                      }}
                      placeholder="Descobrir as Três Casas"
                      className="w-full text-xs uppercase tracking-wider bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                </div>

                {/* Botão Secundário */}
                <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C231C] uppercase tracking-wider">Botão Secundário (Link Sutil)</span>
                    <input
                      type="checkbox"
                      checked={settings.elements.secondaryButton.enabled}
                      onChange={(e) => {
                        onUpdateSettings?.({
                          ...settings,
                          elements: {
                            ...settings.elements,
                            secondaryButton: {
                              ...settings.elements.secondaryButton,
                              enabled: e.target.checked
                            }
                          }
                        });
                      }}
                      className="w-4 h-4 accent-[#7A5B43]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={settings.elements.secondaryButton.text}
                      onChange={(e) => {
                        onUpdateSettings?.({
                          ...settings,
                          elements: {
                            ...settings.elements,
                            secondaryButton: {
                              ...settings.elements.secondaryButton,
                              text: e.target.value
                            }
                          }
                        });
                      }}
                      placeholder="Nossa História & Atelier"
                      className="w-full text-xs uppercase tracking-wider bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* POPOVER 6: AJUSTES DA HERO (ALTURA, OVERLAY & ALINHAMENTO)    */}
            {/* ------------------------------------------------------------- */}
            {activePopover === 'settings' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Sliders className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">Hero • Ajustes Gerais</span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Proporções & Atmosfera
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Defina a altura de exibição, filtro de contraste e rotação dos slides.
                  </p>
                </div>

                {/* Altura da Hero */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Altura da Seção Hero
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-[#EFE9DF] p-1 rounded-xs">
                    {(['medium', 'large', 'full'] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => onUpdateSettings?.({ ...settings, height: h })}
                        className={`py-1.5 rounded text-xs font-medium transition-all ${
                          settings.height === h
                            ? 'bg-[#7A5B43] text-white shadow-xs font-semibold'
                            : 'text-[#3D3229] hover:bg-white/50'
                        }`}
                      >
                        {h === 'medium' ? 'Média (65vh)' : h === 'large' ? 'Grande (80vh)' : 'Tela Cheia'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Escurecimento (Overlay) */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Filtro de Contraste (Overlay)
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-[#EFE9DF] p-1 rounded-xs">
                    {(['subtle', 'medium', 'dark'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          onUpdateSettings?.({
                            ...settings,
                            overlay: {
                              ...settings.overlay,
                              intensity: level
                            }
                          });
                        }}
                        className={`py-1.5 rounded text-xs font-medium transition-all ${
                          settings.overlay.intensity === level
                            ? 'bg-[#7A5B43] text-white shadow-xs font-semibold'
                            : 'text-[#3D3229] hover:bg-white/50'
                        }`}
                      >
                        {level === 'subtle' ? 'Sutil' : level === 'medium' ? 'Médio' : 'Escuro'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alinhamento dos Textos */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Alinhamento dos Textos
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-[#EFE9DF] p-1 rounded-xs">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => onUpdateSettings?.({ ...settings, alignment: align })}
                        className={`py-1.5 rounded text-xs font-medium transition-all ${
                          settings.alignment === align
                            ? 'bg-[#7A5B43] text-white shadow-xs font-semibold'
                            : 'text-[#3D3229] hover:bg-white/50'
                        }`}
                      >
                        {align === 'left' ? 'Esquerda' : align === 'center' ? 'Centro' : 'Direita'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotação Automática (Autoplay) e Intervalo */}
                <div className="space-y-2 bg-white p-3 rounded-xs border border-[#BFAE9C]/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#3D3229] block">Giro Automático de Slides</span>
                      <span className="text-[10px] text-[#7A5B43]">Alterna os slides suavemente</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.carouselAutoplay}
                      onChange={(e) => {
                        onUpdateSettings?.({
                          ...settings,
                          carouselAutoplay: e.target.checked
                        });
                      }}
                      className="w-4 h-4 accent-[#7A5B43] cursor-pointer"
                    />
                  </div>

                  {settings.carouselAutoplay && (
                    <div className="pt-2 border-t border-[#BFAE9C]/30 flex items-center justify-between">
                      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                        Tempo por Slide:
                      </span>
                      <div className="flex items-center gap-1">
                        {[3, 5, 8, 12, 15].map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => {
                              onUpdateSettings?.({
                                ...settings,
                                carouselInterval: sec
                              });
                            }}
                            className={`px-2 py-1 text-[10.5px] rounded-xs font-mono font-medium transition-all ${
                              (settings.carouselInterval || 5) === sec
                                ? 'bg-[#7A5B43] text-white font-bold shadow-2xs'
                                : 'bg-[#FAF8F5] text-[#3D3229] hover:bg-[#E8E0D4]'
                            }`}
                          >
                            {sec}s
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Efeito Vinheta Escura nas Bordas */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40">
                  <div>
                    <span className="text-xs font-semibold text-[#3D3229] block">Efeito Vinheta Escura</span>
                    <span className="text-[10px] text-[#7A5B43]">Sombreamento sutil nas bordas para estética cinematográfica</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.overlay?.vignette ?? false}
                    onChange={(e) => {
                      onUpdateSettings?.({
                        ...settings,
                        overlay: {
                          ...settings.overlay,
                          vignette: e.target.checked
                        }
                      });
                    }}
                    className="w-4 h-4 accent-[#7A5B43] cursor-pointer"
                  />
                </div>

                {/* Modo de Mídia */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Modo de Mídia da Hero
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-[#EFE9DF] p-1 rounded-xs">
                    {(['both', 'video', 'image'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => onUpdateSettings?.({ ...settings, mediaMode: mode })}
                        className={`py-1.5 rounded text-xs font-medium transition-all ${
                          (settings.mediaMode || 'both') === mode
                            ? 'bg-[#7A5B43] text-white shadow-xs font-semibold'
                            : 'text-[#3D3229] hover:bg-white/50'
                        }`}
                      >
                        {mode === 'both' ? 'Híbrido' : mode === 'video' ? 'Apenas Vídeo' : 'Apenas Foto'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Áudio Ambiente & Indicador de Scroll */}
                <div className="space-y-2 bg-white p-3 rounded-xs border border-[#BFAE9C]/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#3D3229] block">Botão de Áudio Ambiente</span>
                      <span className="text-[10px] text-[#7A5B43]">Permite ao visitante ativar a trilha sonora sensorial</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.elements.ambientAudio?.enabled ?? false}
                      onChange={(e) => {
                        onUpdateSettings?.({
                          ...settings,
                          elements: {
                            ...settings.elements,
                            ambientAudio: {
                              ...settings.elements.ambientAudio,
                              enabled: e.target.checked,
                              label: settings.elements.ambientAudio?.label || 'Som do Atelier'
                            }
                          }
                        });
                      }}
                      className="w-4 h-4 accent-[#7A5B43] cursor-pointer"
                    />
                  </div>

                  {settings.elements.ambientAudio?.enabled && (
                    <div className="pt-2 border-t border-[#BFAE9C]/20">
                      <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] block mb-1">
                        Texto do Botão de Áudio:
                      </label>
                      <input
                        type="text"
                        value={settings.elements.ambientAudio?.label || ''}
                        onChange={(e) => {
                          onUpdateSettings?.({
                            ...settings,
                            elements: {
                              ...settings.elements,
                              ambientAudio: {
                                ...settings.elements.ambientAudio,
                                enabled: true,
                                label: e.target.value
                              }
                            }
                          });
                        }}
                        placeholder="Som do Atelier"
                        className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Indicador de Rolagem (Scroll) */}
                <div className="space-y-2 bg-white p-3 rounded-xs border border-[#BFAE9C]/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#3D3229] block">Indicador de Rolagem (Scroll)</span>
                      <span className="text-[10px] text-[#7A5B43]">Seta animada convidando a descer a página</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.elements.scrollIndicator?.enabled ?? true}
                      onChange={(e) => {
                        onUpdateSettings?.({
                          ...settings,
                          elements: {
                            ...settings.elements,
                            scrollIndicator: {
                              ...settings.elements.scrollIndicator,
                              enabled: e.target.checked,
                              label: settings.elements.scrollIndicator?.label || 'Deslize para explorar'
                            }
                          }
                        });
                      }}
                      className="w-4 h-4 accent-[#7A5B43] cursor-pointer"
                    />
                  </div>

                  {settings.elements.scrollIndicator?.enabled && (
                    <div className="pt-2 border-t border-[#BFAE9C]/20">
                      <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] block mb-1">
                        Texto da Rolagem:
                      </label>
                      <input
                        type="text"
                        value={settings.elements.scrollIndicator?.label || ''}
                        onChange={(e) => {
                          onUpdateSettings?.({
                            ...settings,
                            elements: {
                              ...settings.elements,
                              scrollIndicator: {
                                ...settings.elements.scrollIndicator,
                                enabled: true,
                                label: e.target.value
                              }
                            }
                          });
                        }}
                        placeholder="Deslize para explorar"
                        className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rodapé do Popover */}
            <div className="pt-3 border-t border-[#BFAE9C]/30 flex items-center justify-end gap-2">
              <button
                onClick={() => setActivePopover(null)}
                className="w-full py-2.5 bg-[#7A5B43] hover:bg-[#634832] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Concluir Edição</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

