import React, { useState, useRef } from 'react';
import { BrandQuoteSettings } from '../types';
import { uploadImageToSupabase } from '../lib/supabase';
import { BRAND_QUOTE_PALETTES } from '../data/defaultSettings';
import {
  BRAND_QUOTE_SEAL_GALLERY,
  SealGalleryItem
} from '../data/brandQuoteGallery';
import {
  X,
  Check,
  Upload,
  Camera,
  Video,
  Type,
  EyeOff,
  Palette,
  Edit3,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Film
} from 'lucide-react';

export interface BrandQuoteSectionProps {
  settings?: BrandQuoteSettings;
  isEditorMode?: boolean;
  onUpdateSettings?: (newSettings: BrandQuoteSettings) => void;
}

type QuoteModalTab = 'palettes' | 'background' | 'logo' | 'texts';

export const BrandQuoteSection: React.FC<BrandQuoteSectionProps> = ({
  settings,
  isEditorMode = false,
  onUpdateSettings
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<QuoteModalTab>('palettes');

  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Default values
  const isEnabled = settings?.enabled !== false;
  const logo = settings?.logo || {
    enabled: true,
    type: 'monogram' as const,
    monogramText: 'M',
    imageUrl: '',
    size: 'md' as const
  };

  const quote = settings?.quote || {
    enabled: true,
    text: '“Há coisas que não precisam ser explicadas. Basta senti-las.”',
    textColor: '#3D3229',
    fontSize: 'lg' as const
  };

  const authorTagline = settings?.authorTagline || {
    enabled: true,
    text: 'MAISON ENTRELAÇO — ATEMPORALIDADE & SENTIDO',
    textColor: '#7A5B43'
  };

  const background = settings?.background || {
    type: 'video' as const,
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=90',
    overlayColor: '#E8E0D4',
    overlayOpacity: 88,
    blur: 2
  };

  const paddingY = settings?.paddingY || 'normal';

  const getCurrentSettings = (): BrandQuoteSettings => ({
    enabled: isEnabled,
    logo: { ...logo },
    quote: { ...quote },
    authorTagline: { ...authorTagline },
    background: { ...background },
    paddingY
  });

  const updateField = (partial: Partial<BrandQuoteSettings>) => {
    if (!onUpdateSettings) return;
    onUpdateSettings({
      ...getCurrentSettings(),
      ...partial
    });
  };

  // Open modal focused on specific tab
  const openTab = (tab: QuoteModalTab) => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  // Direct file uploads from device via Supabase Storage
  const handleBgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      try {
        const result = await uploadImageToSupabase(file, 'quote-backgrounds');
        if (result) {
          updateField({
            background: {
              ...background,
              type: isVid ? 'video' : 'image',
              mediaUrl: result
            }
          });
        }
      } catch (err) {
        console.warn('Erro no upload de fundo da citação:', err);
      }
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadImageToSupabase(file, 'quote-logos');
        if (result) {
          updateField({
            logo: {
              ...logo,
              type: 'image',
              imageUrl: result
            }
          });
        }
      } catch (err) {
        console.warn('Erro no upload do selo/logo da citação:', err);
      }
    }
  };

  // Font size classes for the quote
  const getQuoteSizeClass = (size?: string) => {
    switch (size) {
      case 'sm':
        return 'text-2xl sm:text-3xl md:text-4xl';
      case 'md':
        return 'text-2xl sm:text-4xl md:text-5xl';
      case 'xl':
        return 'text-3xl sm:text-5xl md:text-7xl';
      case 'lg':
      default:
        return 'text-3xl sm:text-5xl md:text-6xl';
    }
  };

  // Padding classes
  const getPaddingClass = (p?: string) => {
    switch (p) {
      case 'compact':
        return 'py-16 sm:py-24';
      case 'spacious':
        return 'py-36 sm:py-56';
      case 'normal':
      default:
        return 'py-28 sm:py-40';
    }
  };

  // Monogram size classes
  const getLogoSizeClass = (size?: string) => {
    switch (size) {
      case 'sm':
        return 'w-10 h-10 text-xs';
      case 'lg':
        return 'w-18 h-18 text-base';
      case 'md':
      default:
        return 'w-14 h-14 text-sm';
    }
  };

  if (!isEnabled) {
    if (isEditorMode) {
      return (
        <div className="w-full bg-[#EFE9DF] border-y border-dashed border-[#BFAE9C]/70 py-4 px-6 text-center animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-[#7A5B43]" />
            <span className="text-xs text-[#7A5B43] font-serif italic">
              Seção "Frase Poética da Maison" está oculta na loja.
            </span>
            <button
              onClick={() => updateField({ enabled: true })}
              className="px-3 py-1 bg-[#7A5B43] text-white text-[10.5px] uppercase tracking-wider rounded-xs hover:bg-[#6F775C] transition-colors cursor-pointer shadow-xs"
            >
              Reativar Seção
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <section 
      id="secao-frase-marca"
      className="relative w-full border-none outline-none overflow-hidden m-0 p-0 left-0 right-0 transition-colors duration-300"
    >
      {/* Hidden File Inputs for Direct Device Uploads */}
      <input
        ref={bgFileInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleBgFileUpload}
        className="hidden"
      />
      <input
        ref={logoFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoFileUpload}
        className="hidden"
      />

      {/* Editor Floating Action Controls */}
      {isEditorMode && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#BFAE9C]/60 shadow-md">
          <button
            type="button"
            onClick={() => openTab('palettes')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7A5B43] hover:text-[#211E1B] cursor-pointer transition-colors"
            title="Escolher Paleta de Cores"
          >
            <Palette className="w-3.5 h-3.5 text-[#7A5B43]" />
            <span>Paletas & Cores</span>
          </button>
          <div className="w-px h-3.5 bg-[#BFAE9C]/50 mx-0.5" />
          <button
            type="button"
            onClick={() => openTab('background')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7A5B43] hover:text-[#211E1B] cursor-pointer transition-colors"
            title="Fazer Upload de Vídeo ou Imagem de Fundo"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Fundo</span>
          </button>
          <div className="w-px h-3.5 bg-[#BFAE9C]/50 mx-0.5" />
          <button
            type="button"
            onClick={() => openTab('texts')}
            className="p-1 text-[#7A5B43] hover:text-[#211E1B] rounded-full hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            title="Editar Frase & Textos"
          >
            <Type className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-[#BFAE9C]/50 mx-0.5" />
          <button
            type="button"
            onClick={() => updateField({ enabled: false })}
            className="p-1 text-[#8C7561] hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
            title="Ocultar esta seção"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 01. FULL-BLEED BACKGROUND (VÍDEO, IMAGEM OU COR DA PALETA)                */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {background.type === 'video' && background.mediaUrl && (
          <video
            src={background.mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            poster={background.posterUrl}
            className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
          />
        )}

        {background.type === 'image' && background.mediaUrl && (
          <img
            src={background.mediaUrl}
            alt="Fundo Poético da Maison"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        )}

        {/* Soft Colored Overlay with Blur */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            backgroundColor: background.overlayColor || '#E8E0D4',
            opacity: (background.overlayOpacity ?? 88) / 100,
            backdropFilter: background.blur ? `blur(${background.blur}px)` : undefined,
            WebkitBackdropFilter: background.blur ? `blur(${background.blur}px)` : undefined
          }}
        />

        {/* Quick Edit Background button when hovering in Editor Mode */}
        {isEditorMode && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/15 pointer-events-auto flex items-end justify-center pb-6">
            <button
              type="button"
              onClick={() => openTab('background')}
              className="px-4 py-2 bg-white/95 text-[#7A5B43] text-xs font-semibold rounded-full border border-[#BFAE9C]/60 shadow-md hover:bg-white flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Fazer Upload de Vídeo ou Imagem de Fundo</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 02. CONTEÚDO TIPOGRÁFICO CENTRAL                                          */}
      {/* ========================================================================= */}
      <div className={`relative z-10 ${getPaddingClass(paddingY)} max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-7 sm:space-y-8`}>
        
        {/* Subtle Brand Watermark Monogram / Seal Logo */}
        {logo.enabled && (
          <div className="relative group/logo inline-block mx-auto">
            {logo.type === 'image' && logo.imageUrl ? (
              <img
                src={logo.imageUrl}
                alt={logo.imageAlt || "Selo Oficial da Maison"}
                referrerPolicy="no-referrer"
                onClick={() => isEditorMode && openTab('logo')}
                className={`${getLogoSizeClass(logo.size)} mx-auto rounded-full object-contain transition-all ${
                  isEditorMode ? 'cursor-pointer hover:scale-105 ring-2 ring-[#7A5B43]/50' : ''
                }`}
              />
            ) : (
              <div 
                onClick={() => isEditorMode && openTab('logo')}
                className={`${getLogoSizeClass(logo.size)} mx-auto rounded-full border border-[#7A5B43]/30 flex items-center justify-center font-cinzel tracking-widest transition-all ${
                  isEditorMode ? 'cursor-pointer hover:bg-white/70 hover:scale-105 ring-1 ring-[#7A5B43]' : ''
                }`}
                style={{ color: authorTagline.textColor || '#7A5B43' }}
                title={isEditorMode ? "Clique para trocar o selo ou monograma" : undefined}
              >
                {logo.monogramText || 'M'}
              </div>
            )}

            {isEditorMode && (
              <button
                type="button"
                onClick={() => openTab('logo')}
                className="absolute -top-1 -right-4 opacity-0 group-hover/logo:opacity-100 p-1 bg-white text-[#7A5B43] rounded-full border border-[#BFAE9C]/50 shadow-xs transition-opacity cursor-pointer"
                title="Trocar Selo ou Monograma"
              >
                <Edit3 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        )}

        {/* Large Typographic Quote */}
        {quote.enabled && (
          <div className="relative group/quote max-w-4xl mx-auto">
            <h2 
              onClick={() => isEditorMode && openTab('texts')}
              className={`font-serif ${getQuoteSizeClass(quote.fontSize)} font-light italic leading-tight tracking-tight transition-all ${
                isEditorMode ? 'cursor-pointer hover:bg-white/60 hover:p-2 rounded-xs ring-1 ring-transparent hover:ring-[#7A5B43]/30' : ''
              }`}
              style={{ color: quote.textColor || '#3D3229' }}
              title={isEditorMode ? "Clique para editar a frase" : undefined}
            >
              {quote.text}
            </h2>

            {isEditorMode && (
              <button
                type="button"
                onClick={() => openTab('texts')}
                className="absolute top-0 right-0 opacity-0 group-hover/quote:opacity-100 px-2 py-1 bg-white text-[#7A5B43] text-[10px] font-semibold uppercase tracking-wider rounded-xs border border-[#BFAE9C]/60 shadow-xs transition-opacity flex items-center gap-1 cursor-pointer"
                title="Editar Frase"
              >
                <Edit3 className="w-3 h-3" />
                <span>Editar Frase</span>
              </button>
            )}
          </div>
        )}

        {/* Subtle Footer Accent / Author Tagline */}
        {authorTagline.enabled && (
          <div className="relative group/tagline pt-2 max-w-xl mx-auto">
            <p 
              onClick={() => isEditorMode && openTab('texts')}
              className={`font-sans text-xs uppercase tracking-[0.3em] font-light transition-all ${
                isEditorMode ? 'cursor-pointer hover:bg-white/60 hover:px-3 hover:py-1 rounded-xs ring-1 ring-transparent hover:ring-[#7A5B43]/30' : ''
              }`}
              style={{ color: authorTagline.textColor || '#7A5B43' }}
              title={isEditorMode ? "Clique para editar a assinatura" : undefined}
            >
              {authorTagline.text}
            </p>

            {isEditorMode && (
              <button
                type="button"
                onClick={() => openTab('texts')}
                className="opacity-0 group-hover/tagline:opacity-100 ml-2 p-1 bg-white text-[#7A5B43] rounded-full border border-[#BFAE9C]/50 shadow-xs inline-flex items-center cursor-pointer"
                title="Editar Assinatura"
              >
                <Edit3 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL EDITOR ORGANIZADO — UPLOAD DE ARQUIVOS BONITO & SEM LINKS           */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <BrandQuoteEditorModal
          initialTab={activeTab}
          settings={getCurrentSettings()}
          onClose={() => setIsModalOpen(false)}
          onSave={(newSettings) => {
            onUpdateSettings?.(newSettings);
            setIsModalOpen(false);
          }}
          onOpenBgUpload={() => bgFileInputRef.current?.click()}
          onOpenLogoUpload={() => logoFileInputRef.current?.click()}
        />
      )}
    </section>
  );
};

// ============================================================================
// MODAL EDITOR (DESIGN DE UPLOAD LIMPO, ORGANIZADO E SEM ITENS DE LINK)
// ============================================================================
interface BrandQuoteEditorModalProps {
  initialTab?: QuoteModalTab;
  settings: BrandQuoteSettings;
  onClose: () => void;
  onSave: (settings: BrandQuoteSettings) => void;
  onOpenBgUpload: () => void;
  onOpenLogoUpload: () => void;
}

const BrandQuoteEditorModal: React.FC<BrandQuoteEditorModalProps> = ({
  initialTab = 'palettes',
  settings,
  onClose,
  onSave,
  onOpenLogoUpload
}) => {
  const [currentTab, setCurrentTab] = useState<QuoteModalTab>(initialTab);

  // States
  const [isSectionEnabled, setIsSectionEnabled] = useState(settings.enabled);
  
  // Texts
  const [quoteEnabled, setQuoteEnabled] = useState(settings.quote?.enabled !== false);
  const [quoteText, setQuoteText] = useState(settings.quote?.text || '');
  const [quoteTextColor, setQuoteTextColor] = useState(settings.quote?.textColor || '#3D3229');
  const [quoteFontSize, setQuoteFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(settings.quote?.fontSize || 'lg');

  const [authorEnabled, setAuthorEnabled] = useState(settings.authorTagline?.enabled !== false);
  const [authorText, setAuthorText] = useState(settings.authorTagline?.text || '');
  const [authorTextColor, setAuthorTextColor] = useState(settings.authorTagline?.textColor || '#7A5B43');

  // Background state (Upload-Focused, Zero Links)
  const [bgType, setBgType] = useState<'video' | 'image' | 'color'>(settings.background?.type || 'video');
  const [bgMediaUrl, setBgMediaUrl] = useState(settings.background?.mediaUrl || '');
  const [bgPosterUrl, setBgPosterUrl] = useState(settings.background?.posterUrl || '');
  const [bgOverlayColor, setBgOverlayColor] = useState(settings.background?.overlayColor || '#E8E0D4');
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(settings.background?.overlayOpacity ?? 88);
  const [bgBlur, setBgBlur] = useState(settings.background?.blur ?? 2);
  const [isDragOver, setIsDragOver] = useState(false);

  // Internal file input refs for background upload inside modal
  const modalVideoInputRef = useRef<HTMLInputElement>(null);
  const modalImageInputRef = useRef<HTMLInputElement>(null);
  const modalAnyMediaInputRef = useRef<HTMLInputElement>(null);

  // Logo / Seal state
  const [logoEnabled, setLogoEnabled] = useState(settings.logo?.enabled !== false);
  const [logoType, setLogoType] = useState<'monogram' | 'image'>(settings.logo?.type || 'monogram');
  const [monogramText, setMonogramText] = useState(settings.logo?.monogramText || 'M');
  const [logoImageUrl, setLogoImageUrl] = useState(settings.logo?.imageUrl || '');
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg'>(settings.logo?.size || 'md');

  // Padding
  const [paddingY, setPaddingY] = useState<'compact' | 'normal' | 'spacious'>(settings.paddingY || 'normal');

  // Apply palette helper
  const handleApplyPalette = (palette: typeof BRAND_QUOTE_PALETTES[0]) => {
    setBgOverlayColor(palette.overlayColor);
    setQuoteTextColor(palette.textColor);
    setAuthorTextColor(palette.accentColor);
  };

  // Direct File Upload Processor for Background via Supabase Storage
  const processUploadedFile = async (file: File) => {
    const isVideo = file.type.startsWith('video');
    try {
      const dataUrl = await uploadImageToSupabase(file, 'quote-backgrounds');
      if (dataUrl) {
        setBgType(isVideo ? 'video' : 'image');
        setBgMediaUrl(dataUrl);
      }
    } catch (err) {
      console.warn('Erro ao processar imagem no modal:', err);
    }
  };

  const handleModalMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('video') || file.type.startsWith('image'))) {
      processUploadedFile(file);
    }
  };

  // Select item directly from Seal Gallery
  const handleSelectSealItem = (item: SealGalleryItem) => {
    setLogoType('image');
    setLogoImageUrl(item.imageUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      enabled: isSectionEnabled,
      logo: {
        enabled: logoEnabled,
        type: logoType,
        monogramText: monogramText.trim(),
        imageUrl: logoImageUrl,
        size: logoSize
      },
      quote: {
        enabled: quoteEnabled,
        text: quoteText.trim(),
        textColor: quoteTextColor,
        fontSize: quoteFontSize
      },
      authorTagline: {
        enabled: authorEnabled,
        text: authorText.trim(),
        textColor: authorTextColor
      },
      background: {
        type: bgType,
        mediaUrl: bgMediaUrl,
        posterUrl: bgPosterUrl,
        overlayColor: bgOverlayColor,
        overlayOpacity: Number(bgOverlayOpacity),
        blur: Number(bgBlur)
      },
      paddingY
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Hidden File Inputs inside Modal */}
      <input
        ref={modalAnyMediaInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleModalMediaChange}
        className="hidden"
      />
      <input
        ref={modalVideoInputRef}
        type="file"
        accept="video/*"
        onChange={handleModalMediaChange}
        className="hidden"
      />
      <input
        ref={modalImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleModalMediaChange}
        className="hidden"
      />

      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#BFAE9C] rounded-xs shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#7A5B43] hover:text-[#2C231C] hover:bg-[#EDE6DC] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#BFAE9C]/30 pb-3 mb-4">
          <div className="flex items-center gap-2 text-[#7A5B43]">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10.5px] uppercase tracking-widest font-semibold">
              Design & Personalização da Seção
            </span>
          </div>
          <h4 className="font-serif text-xl text-[#2C231C] font-semibold mt-0.5">
            Frase Poética da Marca
          </h4>
          <p className="text-xs text-[#7A5B43]">
            Escolha sua paleta de cores, faça o upload direto do seu vídeo ou imagem de fundo e organize seus textos.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#BFAE9C]/30 mb-5 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setCurrentTab('palettes')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'palettes'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/80 shadow-2xs'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Paletas de Cores</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('background')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'background'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/80 shadow-2xs'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Fundo (Vídeo / Foto)</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('logo')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'logo'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/80 shadow-2xs'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Selo / Emblemas</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('texts')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'texts'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/80 shadow-2xs'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Frase & Textos</span>
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ================================================================= */}
          {/* TAB 1: PALETAS DE COR (1 TOQUE, VISÍVEIS)                          */}
          {/* ================================================================= */}
          {currentTab === 'palettes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Selecione a Paleta Oficial da Maison:
                  </label>
                  <span className="text-[10px] text-[#8C7561]">
                    Harmonia perfeita entre fundo e tipografia
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BRAND_QUOTE_PALETTES.map((pal) => {
                    const isCurrent =
                      bgOverlayColor.toLowerCase() === pal.overlayColor.toLowerCase() &&
                      quoteTextColor.toLowerCase() === pal.textColor.toLowerCase() &&
                      authorTextColor.toLowerCase() === pal.accentColor.toLowerCase();

                    return (
                      <button
                        key={pal.id || pal.name}
                        type="button"
                        onClick={() => handleApplyPalette(pal)}
                        className={`p-3 rounded-xs border text-left transition-all cursor-pointer shadow-xs group relative flex flex-col justify-between overflow-hidden ${
                          isCurrent
                            ? 'border-[#7A5B43] bg-white ring-2 ring-[#7A5B43]'
                            : 'border-[#BFAE9C]/50 bg-white/90 hover:bg-white hover:border-[#7A5B43]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest font-semibold bg-[#EFE7DC] text-[#7A5B43] rounded-xs">
                              {pal.tag || 'MAISON'}
                            </span>
                            
                            {/* Color Swatch Circles */}
                            <div className="flex items-center gap-1.5">
                              <span
                                title="Fundo / Camada"
                                className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                                style={{ backgroundColor: pal.bgColor }}
                              />
                              <span
                                title="Texto da Frase"
                                className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                                style={{ backgroundColor: pal.textColor }}
                              />
                              <span
                                title="Selo & Assinatura"
                                className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                                style={{ backgroundColor: pal.accentColor }}
                              />
                            </div>
                          </div>

                          <h5 className="text-xs font-serif font-semibold text-[#2C231C] group-hover:text-[#7A5B43] leading-snug">
                            {pal.name}
                          </h5>

                          <p className="text-[10px] text-[#8C7561] line-clamp-2 mt-1 leading-relaxed">
                            {pal.description}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-[#BFAE9C]/20 flex items-center justify-between">
                          <span
                            className="font-serif italic text-xs truncate max-w-[170px]"
                            style={{ color: pal.textColor }}
                          >
                            “Sentir a essência...”
                          </span>

                          {isCurrent ? (
                            <span className="text-[10.5px] font-semibold text-[#7A5B43] flex items-center gap-1 bg-[#EFE7DC]/60 px-2 py-0.5 rounded-xs">
                              <Check className="w-3 h-3 text-[#7A5B43]" />
                              Selecionada
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-[#8C7561] group-hover:text-[#7A5B43] font-medium">
                              Escolher
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status da Seção */}
              <div className="p-3 bg-white/80 border border-[#BFAE9C]/50 rounded-xs flex items-center justify-between">
                <div>
                  <label className="text-xs text-[#3D3229] font-medium block">
                    Exibir esta seção na loja online
                  </label>
                  <span className="text-[10.5px] text-[#8C7561]">
                    Desmarque se desejar ocultar temporariamente
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isSectionEnabled}
                  onChange={(e) => setIsSectionEnabled(e.target.checked)}
                  className="accent-[#7A5B43] rounded w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: FUNDO (UPLOAD ORGANIZADO, ZERO ITENS PRÉ-DEFINIDOS)        */}
          {/* ================================================================= */}
          {currentTab === 'background' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Informação & Status Atual */}
              <div className="flex items-center justify-between border-b border-[#BFAE9C]/30 pb-2">
                <div>
                  <h5 className="text-xs font-serif font-semibold text-[#2C231C]">
                    Mídia de Fundo da Seção
                  </h5>
                  <p className="text-[11px] text-[#8C7561]">
                    Carregue seu próprio vídeo em movimento ou foto em alta resolução.
                  </p>
                </div>

                {bgType !== 'color' && bgMediaUrl ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {bgType === 'video' ? 'Vídeo Ativo' : 'Foto Ativa'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE9DF] text-[#7A5B43] border border-[#BFAE9C]/50">
                    Cor Pura da Paleta
                  </span>
                )}
              </div>

              {/* MÍDIA ATIVA: CARD VISUAL DE PREVIEW SE HOUVER ARQUIVO CARREGADO */}
              {bgType !== 'color' && bgMediaUrl && (
                <div className="p-3.5 bg-white border border-[#BFAE9C]/70 rounded-xs shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Mídia Atualmente em Uso no Fundo
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setBgType('color');
                        setBgMediaUrl('');
                      }}
                      className="text-[11px] text-red-700 hover:text-red-900 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remover Mídia</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-[#FAF8F5] p-2.5 rounded-xs border border-[#BFAE9C]/40">
                    {/* Miniatura com Player ou Imagem */}
                    <div className="w-28 h-18 sm:w-36 sm:h-20 rounded-xs overflow-hidden bg-black/5 shrink-0 relative border border-[#BFAE9C]/40">
                      {bgType === 'video' ? (
                        <video
                          src={bgMediaUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={bgMediaUrl}
                          alt="Prévia de fundo"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-[8px] font-mono uppercase px-1 py-0.5 rounded-xs flex items-center gap-1">
                        {bgType === 'video' ? <Film className="w-2 h-2" /> : <ImageIcon className="w-2 h-2" />}
                        <span>{bgType === 'video' ? 'Vídeo' : 'Foto'}</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-xs font-serif font-semibold text-[#2C231C] truncate">
                        {bgType === 'video' ? 'Vídeo em Movimento do Fundo' : 'Imagem Fotográfica do Fundo'}
                      </p>
                      <p className="text-[10px] text-[#8C7561] leading-relaxed">
                        Exibido em tela cheia com a camada de cor e desfoque suave configurados abaixo.
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => modalAnyMediaInputRef.current?.click()}
                          className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-white text-[#7A5B43] border border-[#BFAE9C]/70 text-[10.5px] font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Substituir Arquivo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ÁREA DE UPLOAD ELEGANTE (DRAG & DROP + BOTÕES DE UPLOAD) */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xs p-6 text-center transition-all cursor-pointer group ${
                  isDragOver
                    ? 'border-[#7A5B43] bg-[#EFE7DC]/50 scale-[0.99]'
                    : 'border-[#BFAE9C]/70 hover:border-[#7A5B43] bg-white/80 hover:bg-white'
                }`}
                onClick={() => modalAnyMediaInputRef.current?.click()}
              >
                {/* Ícone de Upload em Destaque */}
                <div className="w-13 h-13 mx-auto rounded-full bg-[#FAF8F5] border border-[#BFAE9C]/60 flex items-center justify-center text-[#7A5B43] group-hover:scale-110 group-hover:bg-[#EFE7DC] transition-all shadow-2xs mb-3">
                  <Upload className="w-6 h-6 text-[#7A5B43]" />
                </div>

                <h6 className="font-serif text-sm font-semibold text-[#2C231C] mb-1">
                  Clique para carregar ou arraste seu arquivo aqui
                </h6>
                <p className="text-[11px] text-[#8C7561] max-w-sm mx-auto mb-3">
                  Envie vídeos (MP4, MOV, WebM) ou imagens (JPG, PNG, WebP) direto do seu celular ou computador.
                </p>

                {/* Formatos Aceitos */}
                <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-mono uppercase tracking-wider bg-[#FAF8F5] text-[#7A5B43] border border-[#BFAE9C]/50 flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    <span>Vídeos (MP4 / WebM / MOV)</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-mono uppercase tracking-wider bg-[#FAF8F5] text-[#7A5B43] border border-[#BFAE9C]/50 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Fotos (JPG / PNG / WebP)</span>
                  </span>
                </div>
              </div>

              {/* BOTÕES ESPECÍFICOS DE UPLOAD: VÍDEO OU FOTO */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => modalVideoInputRef.current?.click()}
                  className="p-2.5 bg-white hover:bg-[#FAF8F5] border border-[#BFAE9C]/60 hover:border-[#7A5B43] rounded-xs text-left transition-all cursor-pointer shadow-2xs group flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EFE7DC]/60 flex items-center justify-center text-[#7A5B43] group-hover:bg-[#7A5B43] group-hover:text-white transition-colors shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-serif font-semibold text-[#2C231C] block leading-snug">
                      Carregar Vídeo
                    </span>
                    <span className="text-[9.5px] text-[#8C7561] block">
                      MP4, MOV ou WebM
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => modalImageInputRef.current?.click()}
                  className="p-2.5 bg-white hover:bg-[#FAF8F5] border border-[#BFAE9C]/60 hover:border-[#7A5B43] rounded-xs text-left transition-all cursor-pointer shadow-2xs group flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EFE7DC]/60 flex items-center justify-center text-[#7A5B43] group-hover:bg-[#7A5B43] group-hover:text-white transition-colors shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-serif font-semibold text-[#2C231C] block leading-snug">
                      Carregar Foto
                    </span>
                    <span className="text-[9.5px] text-[#8C7561] block">
                      JPG, PNG ou WebP
                    </span>
                  </div>
                </button>
              </div>

              {/* OPÇÃO DE USAR APENAS A COR SÓLIDA DA PALETA */}
              <div className={`p-3 rounded-xs border transition-all flex items-center justify-between ${
                bgType === 'color' || !bgMediaUrl
                  ? 'bg-white border-[#7A5B43] ring-1 ring-[#7A5B43]'
                  : 'bg-white/70 border-[#BFAE9C]/40'
              }`}>
                <div>
                  <span className="text-xs font-serif font-semibold text-[#2C231C] block">
                    Usar apenas a Cor Suave da Paleta
                  </span>
                  <span className="text-[10.5px] text-[#8C7561]">
                    Fundo liso minimalista sem vídeo ou foto
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBgType('color');
                    setBgMediaUrl('');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xs border cursor-pointer transition-all ${
                    bgType === 'color' || !bgMediaUrl
                      ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                      : 'bg-white text-[#7A5B43] border-[#BFAE9C]/60 hover:bg-[#FAF8F5]'
                  }`}
                >
                  {bgType === 'color' || !bgMediaUrl ? '✓ Cor Pura Ativa' : 'Aplicar Cor Pura'}
                </button>
              </div>

              {/* CONTROLES DE CAMADA (OPACIDADE & DESFOQUE) */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-3">
                <div className="flex items-center gap-1.5 text-[#7A5B43] border-b border-[#BFAE9C]/20 pb-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    Ajustes de Camada Visual
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10.5px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                    <span>Opacidade da Camada da Paleta</span>
                    <span>{bgOverlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={bgOverlayOpacity}
                    onChange={(e) => setBgOverlayOpacity(Number(e.target.value))}
                    className="w-full accent-[#7A5B43] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#8C7561]">
                    <span>Mais transparente (revela mais o fundo)</span>
                    <span>Mais opaco (mais sutil)</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10.5px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                    <span>Suavidade do Fundo (Desfoque / Blur)</span>
                    <span>{bgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={bgBlur}
                    onChange={(e) => setBgBlur(Number(e.target.value))}
                    className="w-full accent-[#7A5B43] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#8C7561]">
                    <span>0px (nítido)</span>
                    <span>10px (sonhador & difuso)</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: SELOS & EMBLEMAS (ORGANIZADO, SEM LINKS)                   */}
          {/* ================================================================= */}
          {currentTab === 'logo' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Selo / Monograma Superior
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={logoEnabled}
                      onChange={(e) => setLogoEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir Selo</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoType('monogram')}
                    disabled={!logoEnabled}
                    className={`p-2 rounded-xs border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 ${
                      logoType === 'monogram'
                        ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                        : 'bg-white text-[#5C4D41] border-[#BFAE9C]/50 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Monograma (Texto)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLogoType('image')}
                    disabled={!logoEnabled}
                    className={`p-2 rounded-xs border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 ${
                      logoType === 'image'
                        ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                        : 'bg-white text-[#5C4D41] border-[#BFAE9C]/50 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Galeria de Selos</span>
                  </button>
                </div>

                {/* Subseção A: Monograma Tipográfico */}
                {logoType === 'monogram' ? (
                  <div className="space-y-2 p-3 bg-[#FAF8F5] border border-[#BFAE9C]/40 rounded-xs">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold block">
                      Letra ou Iniciais do Monograma
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        maxLength={4}
                        value={monogramText}
                        onChange={(e) => setMonogramText(e.target.value)}
                        placeholder="M"
                        disabled={!logoEnabled}
                        className="w-20 text-center font-cinzel text-xl font-bold bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50 shadow-2xs"
                      />
                      <span className="text-xs text-[#8C7561]">
                        Exemplo: <strong>M</strong> (Maison), <strong>ME</strong> (Maison Entrelaço)
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Subseção B: Galeria de Selos & Upload */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                        Escolha um Selo da Maison:
                      </span>
                      <button
                        type="button"
                        onClick={onOpenLogoUpload}
                        disabled={!logoEnabled}
                        className="px-2.5 py-1 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-[10.5px] font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Enviar Meu Logo</span>
                      </button>
                    </div>

                    {/* Grid dos Selos da Maison */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {BRAND_QUOTE_SEAL_GALLERY.map((seal) => {
                        const isSelected = logoType === 'image' && logoImageUrl === seal.imageUrl;

                        return (
                          <div
                            key={seal.id}
                            onClick={() => handleSelectSealItem(seal)}
                            className={`p-2.5 rounded-xs border text-center cursor-pointer transition-all flex flex-col items-center justify-between group bg-white shadow-2xs ${
                              isSelected
                                ? 'border-[#7A5B43] ring-2 ring-[#7A5B43]'
                                : 'border-[#BFAE9C]/40 hover:border-[#7A5B43]'
                            }`}
                          >
                            <div className="w-14 h-14 rounded-full flex items-center justify-center p-1 bg-[#FAF8F5] border border-[#BFAE9C]/30 my-1 group-hover:scale-105 transition-transform">
                              <img
                                src={seal.imageUrl}
                                alt={seal.name}
                                className="w-12 h-12 object-contain"
                              />
                            </div>

                            <span className="text-[9px] font-mono uppercase tracking-wider text-[#7A5B43] font-semibold block mt-1">
                              {seal.tag}
                            </span>
                            <span className="text-[10.5px] font-serif font-medium text-[#2C231C] line-clamp-1 leading-snug">
                              {seal.name}
                            </span>

                            <span className={`text-[9.5px] mt-1.5 font-medium ${isSelected ? 'text-[#7A5B43] font-semibold' : 'text-[#8C7561] group-hover:text-[#7A5B43]'}`}>
                              {isSelected ? '✓ Selecionado' : 'Aplicar'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tamanho do Selo */}
                <div className="space-y-1 pt-1 border-t border-[#BFAE9C]/30">
                  <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                    Tamanho Visual do Selo
                  </label>
                  <select
                    value={logoSize}
                    onChange={(e) => setLogoSize(e.target.value as any)}
                    disabled={!logoEnabled}
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                  >
                    <option value="sm">Pequeno & Delicado</option>
                    <option value="md">Médio & Equilibrado (Padrão)</option>
                    <option value="lg">Grande & Monumental</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: TEXTOS & FRASE (SEM ESPECTRO / SEM LINKS)                  */}
          {/* ================================================================= */}
          {currentTab === 'texts' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Frase Principal */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Frase Poética em Destaque
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quoteEnabled}
                      onChange={(e) => setQuoteEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir</span>
                  </label>
                </div>

                <textarea
                  rows={3}
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="“Há coisas que não precisam ser explicadas. Basta senti-las.”"
                  disabled={!quoteEnabled}
                  className="w-full text-sm font-serif italic bg-white border border-[#BFAE9C]/60 rounded-xs p-2.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                />

                <div className="space-y-1 pt-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                    Tamanho da Tipografia
                  </label>
                  <select
                    value={quoteFontSize}
                    onChange={(e) => setQuoteFontSize(e.target.value as any)}
                    disabled={!quoteEnabled}
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                  >
                    <option value="sm">Discreta (Pequena)</option>
                    <option value="md">Elegante (Média)</option>
                    <option value="lg">Monumental (Grande - Padrão)</option>
                    <option value="xl">Extra Grande</option>
                  </select>
                </div>
              </div>

              {/* Assinatura / Subtítulo */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Assinatura / Tagline Inferior
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={authorEnabled}
                      onChange={(e) => setAuthorEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={authorText}
                  onChange={(e) => setAuthorText(e.target.value)}
                  placeholder="MAISON ENTRELAÇO — ATEMPORALIDADE & SENTIDO"
                  disabled={!authorEnabled}
                  className="w-full text-xs uppercase tracking-wider bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                />
              </div>

              {/* Espaçamento Vertical */}
              <div className="p-3 bg-white/60 border border-[#BFAE9C]/40 rounded-xs flex items-center justify-between">
                <span className="text-xs text-[#5C4D41] font-medium">Espaçamento Vertical (Altura da Seção)</span>
                <select
                  value={paddingY}
                  onChange={(e) => setPaddingY(e.target.value as any)}
                  className="text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-1.5 text-[#3D3229]"
                >
                  <option value="compact">Compacto</option>
                  <option value="normal">Equilibrado (Padrão)</option>
                  <option value="spacious">Espaçoso & Monumental</option>
                </select>
              </div>

            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#BFAE9C]/30 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xs text-xs font-medium text-[#7A5B43] hover:bg-[#EDE6DC] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
