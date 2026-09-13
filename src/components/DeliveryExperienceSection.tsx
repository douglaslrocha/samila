import React, { useState, useRef } from 'react';
import { DeliveryExperienceSettings } from '../types';
import { uploadImageToSupabase } from '../lib/supabase';
import {
  ShoppingBag,
  ArrowUpRight,
  Sliders,
  X,
  Check,
  Upload,
  Camera,
  Type,
  Eye,
  EyeOff,
  Link,
  MessageCircle,
  Sparkles,
  Edit3,
  Layers,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';

export interface DeliveryExperienceSectionProps {
  settings?: DeliveryExperienceSettings;
  onOpenCart?: () => void;
  onExploreProducts?: () => void;
  onOpenContact?: () => void;
  isEditorMode?: boolean;
  onUpdateSettings?: (newSettings: DeliveryExperienceSettings) => void;
}

type DeliveryPopoverType = 'all' | 'image' | 'tagline' | 'headline' | 'description' | 'buttons' | null;

export const DeliveryExperienceSection: React.FC<DeliveryExperienceSectionProps> = ({
  settings,
  onOpenCart,
  onExploreProducts,
  onOpenContact,
  isEditorMode = false,
  onUpdateSettings,
}) => {
  const [activePopover, setActivePopover] = useState<DeliveryPopoverType>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Defaults fallback
  const isSectionEnabled = settings?.enabled !== false;
  const imageSettings = settings?.image || {
    enabled: true,
    url: '/images/atelier-decoracao-panoramica.png',
    alt: 'Arte Panorâmica da Maison',
    maxHeight: 'full' as const,
    blendMode: 'multiply' as const
  };

  const taglineSettings = settings?.tagline || {
    enabled: true,
    text: 'Boutique Online'
  };

  const headlineSettings = settings?.headline || {
    enabled: true,
    text: '“Coloque no seu carrinho e receba na sua casa.”'
  };

  const descriptionSettings = settings?.description || {
    enabled: true,
    text: 'Preparamos cada encomenda como quem envia uma carta de afeto — com perfume autoral, toque humano e entrega sem pressa.'
  };

  const primaryBtnSettings = settings?.primaryButton || {
    enabled: true,
    text: 'Escolher Meus Produtos',
    action: 'explore_products' as const
  };

  const secondaryBtnSettings = settings?.secondaryButton || {
    enabled: true,
    text: 'Ver Meu Carrinho',
    action: 'open_cart' as const
  };

  const bgColor = settings?.style?.bgColor || '#FAF7F2';

  // Helper to get full current settings state
  const getCurrentSettings = (): DeliveryExperienceSettings => ({
    enabled: isSectionEnabled,
    image: { ...imageSettings },
    tagline: { ...taglineSettings },
    headline: { ...headlineSettings },
    description: { ...descriptionSettings },
    primaryButton: { ...primaryBtnSettings },
    secondaryButton: { ...secondaryBtnSettings },
    style: { bgColor }
  });

  const updateField = (partial: Partial<DeliveryExperienceSettings>) => {
    if (!onUpdateSettings) return;
    onUpdateSettings({
      ...getCurrentSettings(),
      ...partial
    });
  };

  // Button Action Handler
  const handleActionClick = (action: string, customUrl?: string) => {
    switch (action) {
      case 'explore_products':
        if (onExploreProducts) onExploreProducts();
        else {
          const el = document.getElementById('secoes-produtos') || document.getElementById('produtos');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'open_cart':
        onOpenCart?.();
        break;
      case 'open_contact':
        onOpenContact?.();
        break;
      case 'custom_url':
        if (customUrl) {
          if (customUrl.startsWith('#')) {
            const id = customUrl.replace('#', '');
            const target = document.getElementById(id);
            target?.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.open(customUrl, '_blank', 'noopener,noreferrer');
          }
        }
        break;
      default:
        onExploreProducts?.();
    }
  };

  // Image Upload Handler via Supabase Storage
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImageToSupabase(file, 'delivery-experience');
        if (url) {
          updateField({
            image: {
              ...imageSettings,
              url
            }
          });
        }
      } catch (err) {
        console.warn('Erro ao enviar imagem de entrega:', err);
      }
    }
  };

  // Image Height classes
  const getImageHeightClass = (h?: string) => {
    switch (h) {
      case 'sm':
        return 'max-h-[140px] sm:max-h-[190px] md:max-h-[230px]';
      case 'lg':
        return 'max-h-[260px] sm:max-h-[360px] md:max-h-[460px]';
      case 'full':
        return 'max-h-none';
      case 'md':
      default:
        return 'max-h-[190px] sm:max-h-[260px] md:max-h-[320px]';
    }
  };

  // If section is disabled
  if (!isSectionEnabled) {
    if (isEditorMode) {
      return (
        <div className="w-full bg-[#EFE9DF] border-y border-dashed border-[#BFAE9C]/70 py-4 px-6 text-center animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-[#7A5B43]" />
            <span className="text-xs text-[#7A5B43] font-serif italic">
              Seção "Boutique Online / Entrega em Casa" está atualmente oculta na loja.
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
      id="secao-carrinho-casa" 
      style={{ backgroundColor: bgColor }}
      className="relative w-full border-t border-b border-[#EDE4D8]/80 overflow-hidden m-0 p-0 transition-colors duration-300"
    >
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />

      {/* Editor Floating Controls */}
      {isEditorMode && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#BFAE9C]/60 shadow-md">
          <button
            type="button"
            onClick={() => setActivePopover('all')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7A5B43] hover:text-[#211E1B] cursor-pointer transition-colors"
            title="Configurar Seção Completa (Textos, Imagem, Botões)"
          >
            <Sliders className="w-3.5 h-3.5 text-[#7A5B43]" />
            <span>Configurar Seção</span>
          </button>
          <div className="w-px h-3.5 bg-[#BFAE9C]/50 mx-0.5" />
          <button
            type="button"
            onClick={() => updateField({ enabled: false })}
            className="p-1 text-[#8C7561] hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
            title="Ocultar esta seção da loja"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 01. Imagem Panorâmica no Topo da Seção */}
      {imageSettings.enabled && imageSettings.url && (
        <div className="relative group/image w-full overflow-hidden leading-none select-none">
          <img
            src={imageSettings.url}
            alt={imageSettings.alt || "Arte Panorâmica da Maison"}
            referrerPolicy="no-referrer"
            className={`w-full h-auto ${getImageHeightClass(imageSettings.maxHeight)} object-cover object-center ${
              imageSettings.blendMode === 'multiply' ? 'mix-blend-multiply opacity-90' : 'opacity-100'
            } pointer-events-none select-none block transition-all duration-300`}
          />

          {/* Quick Edit Overlay for Image */}
          {isEditorMode && (
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-white text-[#2C231C] text-xs font-semibold rounded-xs shadow-md hover:bg-[#FAF8F5] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#7A5B43]" />
                <span>Subir Imagem</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePopover('image')}
                className="px-3.5 py-2 bg-[#7A5B43] text-white text-xs font-semibold rounded-xs shadow-md hover:bg-[#6F775C] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configurar Imagem</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Linha Divisória Fina */}
      <div className="w-full max-w-3xl mx-auto px-6 pt-4 sm:pt-6">
        <div className="w-full h-px bg-[#EADBCC]/70" />
      </div>

      {/* 02. Bloco Central com Tagline, Frase Monumental, Descrição e Botões */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-8 pb-16 sm:pt-12 sm:pb-20 text-center">
        
        {/* Traço Superior — BOUTIQUE ONLINE — */}
        {taglineSettings.enabled && (
          <div className="relative group/tagline inline-flex items-center justify-center gap-4 text-[#A89887] mb-6 sm:mb-8">
            <span className="w-10 sm:w-16 h-px bg-[#D5C6B5]" />
            <span 
              onClick={() => isEditorMode && setActivePopover('tagline')}
              className={`text-[11px] sm:text-xs uppercase tracking-[0.28em] font-medium text-[#7A5B43] transition-all ${
                isEditorMode ? 'cursor-pointer hover:bg-white/80 hover:px-2 hover:py-0.5 rounded-xs ring-1 ring-transparent hover:ring-[#7A5B43]/30' : ''
              }`}
              title={isEditorMode ? "Clique para editar o texto" : undefined}
            >
              {taglineSettings.text}
            </span>
            <span className="w-10 sm:w-16 h-px bg-[#D5C6B5]" />

            {isEditorMode && (
              <button
                type="button"
                onClick={() => setActivePopover('tagline')}
                className="opacity-0 group-hover/tagline:opacity-100 p-1 text-[#7A5B43] bg-white rounded-full border border-[#BFAE9C]/50 shadow-2xs transition-opacity cursor-pointer ml-1"
                title="Editar Tagline"
              >
                <Edit3 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        )}

        {/* Frase com Tipografia Nobre Itálica Monumental */}
        {headlineSettings.enabled && (
          <div className="relative group/headline max-w-2xl mx-auto mb-6 sm:mb-7">
            <h3 
              onClick={() => isEditorMode && setActivePopover('headline')}
              className={`font-serif text-3xl sm:text-4xl md:text-5xl font-light italic text-[#3D3229] leading-[1.25] tracking-tight transition-all ${
                isEditorMode ? 'cursor-pointer hover:bg-white/70 hover:p-2 rounded-xs ring-1 ring-transparent hover:ring-[#7A5B43]/30' : ''
              }`}
              title={isEditorMode ? "Clique para editar a frase" : undefined}
            >
              {headlineSettings.text}
            </h3>

            {isEditorMode && (
              <button
                type="button"
                onClick={() => setActivePopover('headline')}
                className="absolute top-0 right-0 opacity-0 group-hover/headline:opacity-100 px-2 py-1 bg-white text-[#7A5B43] text-[10px] font-semibold uppercase tracking-wider rounded-xs border border-[#BFAE9C]/60 shadow-xs transition-opacity flex items-center gap-1 cursor-pointer"
                title="Editar Frase Principal"
              >
                <Edit3 className="w-3 h-3" />
                <span>Editar</span>
              </button>
            )}
          </div>
        )}

        {/* Parágrafo Descritivo */}
        {descriptionSettings.enabled && (
          <div className="relative group/desc max-w-xl mx-auto mb-9 sm:mb-11">
            <p 
              onClick={() => isEditorMode && setActivePopover('description')}
              className={`font-sans text-sm sm:text-base text-[#6E6359] font-light leading-relaxed transition-all ${
                isEditorMode ? 'cursor-pointer hover:bg-white/70 hover:p-2 rounded-xs ring-1 ring-transparent hover:ring-[#7A5B43]/30' : ''
              }`}
              title={isEditorMode ? "Clique para editar a descrição" : undefined}
            >
              {descriptionSettings.text}
            </p>

            {isEditorMode && (
              <button
                type="button"
                onClick={() => setActivePopover('description')}
                className="absolute top-0 right-0 opacity-0 group-hover/desc:opacity-100 px-2 py-1 bg-white text-[#7A5B43] text-[10px] font-semibold uppercase tracking-wider rounded-xs border border-[#BFAE9C]/60 shadow-xs transition-opacity flex items-center gap-1 cursor-pointer"
                title="Editar Descrição"
              >
                <Edit3 className="w-3 h-3" />
                <span>Editar</span>
              </button>
            )}
          </div>
        )}

        {/* Botões Centrais e Empilhados com Design Boutique */}
        <div className="relative group/buttons flex flex-col items-center justify-center gap-3.5 sm:gap-4 max-w-sm mx-auto">
          
          {/* Botão Escuro: Escolher Meus Produtos */}
          {primaryBtnSettings.enabled && (
            <button
              type="button"
              id="btn-escolher-produtos"
              onClick={() => {
                if (isEditorMode) {
                  setActivePopover('buttons');
                } else {
                  handleActionClick(primaryBtnSettings.action, primaryBtnSettings.customUrl);
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-[#2E251E] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#45382E] active:scale-[0.99] transition-all duration-200 shadow-sm cursor-pointer"
            >
              <span>{primaryBtnSettings.text}</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.4} />
            </button>
          )}

          {/* Botão Contornado: Ver Meu Carrinho */}
          {secondaryBtnSettings.enabled && (
            <button
              type="button"
              id="btn-ver-carrinho"
              onClick={() => {
                if (isEditorMode) {
                  setActivePopover('buttons');
                } else {
                  handleActionClick(secondaryBtnSettings.action, secondaryBtnSettings.customUrl);
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-transparent border border-[#CBBCAE] text-[#3D3229] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F2ECE4] hover:border-[#7A5B43] active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#7A5B43]" strokeWidth={1.3} />
              <span>{secondaryBtnSettings.text}</span>
            </button>
          )}

          {isEditorMode && (
            <button
              type="button"
              onClick={() => setActivePopover('buttons')}
              className="opacity-0 group-hover/buttons:opacity-100 mt-1 px-3 py-1 bg-white text-[#7A5B43] text-[10.5px] font-semibold uppercase tracking-wider rounded-full border border-[#BFAE9C]/60 shadow-xs transition-opacity flex items-center gap-1.5 cursor-pointer"
              title="Configurar Botões e Ações"
            >
              <Sliders className="w-3 h-3" />
              <span>Configurar Botões</span>
            </button>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL GERAL / POPOVER DE CONFIGURAÇÃO DA SEÇÃO */}
      {/* ========================================================================= */}
      {activePopover && (
        <DeliverySectionEditorModal
          initialTab={activePopover === 'all' ? 'texts' : activePopover}
          settings={getCurrentSettings()}
          onClose={() => setActivePopover(null)}
          onSave={(newSettings) => {
            onUpdateSettings?.(newSettings);
            setActivePopover(null);
          }}
          onOpenFileUpload={() => fileInputRef.current?.click()}
        />
      )}
    </section>
  );
};

// ============================================================================
// MODAL EDITOR DEDICADO PARA A SEÇÃO BOUTIQUE / ENTREGA
// ============================================================================
interface DeliverySectionEditorModalProps {
  initialTab?: string;
  settings: DeliveryExperienceSettings;
  onClose: () => void;
  onSave: (settings: DeliveryExperienceSettings) => void;
  onOpenFileUpload: () => void;
}

const DeliverySectionEditorModal: React.FC<DeliverySectionEditorModalProps> = ({
  initialTab = 'texts',
  settings,
  onClose,
  onSave,
  onOpenFileUpload
}) => {
  const [currentTab, setCurrentTab] = useState<'texts' | 'image' | 'buttons' | 'style'>(
    initialTab === 'image' ? 'image' : initialTab === 'buttons' ? 'buttons' : 'texts'
  );

  // Form states
  const [isSectionEnabled, setIsSectionEnabled] = useState(settings.enabled);
  
  // Image
  const [imageEnabled, setImageEnabled] = useState(settings.image?.enabled !== false);
  const [imageUrl, setImageUrl] = useState(settings.image?.url || '');
  const [imageAlt, setImageAlt] = useState(settings.image?.alt || '');
  const [imageMaxHeight, setImageMaxHeight] = useState<'sm' | 'md' | 'lg' | 'full'>(settings.image?.maxHeight || 'full');
  const [imageBlendMode, setImageBlendMode] = useState<'multiply' | 'normal'>(settings.image?.blendMode || 'multiply');

  // Tagline
  const [taglineEnabled, setTaglineEnabled] = useState(settings.tagline?.enabled !== false);
  const [taglineText, setTaglineText] = useState(settings.tagline?.text || 'Boutique Online');

  // Headline
  const [headlineEnabled, setHeadlineEnabled] = useState(settings.headline?.enabled !== false);
  const [headlineText, setHeadlineText] = useState(settings.headline?.text || '“Coloque no seu carrinho e receba na sua casa.”');

  // Description
  const [descriptionEnabled, setDescriptionEnabled] = useState(settings.description?.enabled !== false);
  const [descriptionText, setDescriptionText] = useState(
    settings.description?.text || 'Preparamos cada encomenda como quem envia uma carta de afeto — com perfume autoral, toque humano e entrega sem pressa.'
  );

  // Primary Button
  const [primaryBtnEnabled, setPrimaryBtnEnabled] = useState(settings.primaryButton?.enabled !== false);
  const [primaryBtnText, setPrimaryBtnText] = useState(settings.primaryButton?.text || 'Escolher Meus Produtos');
  const [primaryBtnAction, setPrimaryBtnAction] = useState(settings.primaryButton?.action || 'explore_products');
  const [primaryBtnCustomUrl, setPrimaryBtnCustomUrl] = useState(settings.primaryButton?.customUrl || '');

  // Secondary Button
  const [secondaryBtnEnabled, setSecondaryBtnEnabled] = useState(settings.secondaryButton?.enabled !== false);
  const [secondaryBtnText, setSecondaryBtnText] = useState(settings.secondaryButton?.text || 'Ver Meu Carrinho');
  const [secondaryBtnAction, setSecondaryBtnAction] = useState(settings.secondaryButton?.action || 'open_cart');
  const [secondaryBtnCustomUrl, setSecondaryBtnCustomUrl] = useState(settings.secondaryButton?.customUrl || '');

  // Background color
  const [bgColor, setBgColor] = useState(settings.style?.bgColor || '#FAF7F2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      enabled: isSectionEnabled,
      image: {
        enabled: imageEnabled,
        url: imageUrl.trim(),
        alt: imageAlt.trim(),
        maxHeight: imageMaxHeight,
        blendMode: imageBlendMode
      },
      tagline: {
        enabled: taglineEnabled,
        text: taglineText.trim()
      },
      headline: {
        enabled: headlineEnabled,
        text: headlineText.trim()
      },
      description: {
        enabled: descriptionEnabled,
        text: descriptionText.trim()
      },
      primaryButton: {
        enabled: primaryBtnEnabled,
        text: primaryBtnText.trim(),
        action: primaryBtnAction,
        customUrl: primaryBtnCustomUrl.trim()
      },
      secondaryButton: {
        enabled: secondaryBtnEnabled,
        text: secondaryBtnText.trim(),
        action: secondaryBtnAction,
        customUrl: secondaryBtnCustomUrl.trim()
      },
      style: {
        bgColor
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#BFAE9C] rounded-xs shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto text-left">
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
            <Sliders className="w-4 h-4" />
            <span className="text-[10.5px] uppercase tracking-widest font-semibold">
              Personalização da Seção
            </span>
          </div>
          <h4 className="font-serif text-xl text-[#2C231C] font-semibold mt-0.5">
            Boutique Online & Entrega em Casa
          </h4>
          <p className="text-xs text-[#7A5B43]">
            Edite a arte panorâmica superior, a frase poética em destaque e os botões de ação.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#BFAE9C]/30 mb-5 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setCurrentTab('texts')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'texts'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/70'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Frases & Textos</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('image')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'image'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/70'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Imagem Panorâmica</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('buttons')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'buttons'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/70'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Botões & Links</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('style')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'style'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/70'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Aparência</span>
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* TAB 1: TEXTOS & FRASES */}
          {currentTab === 'texts' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Tagline */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Tagline Superior (Ex: Boutique Online)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taglineEnabled}
                      onChange={(e) => setTaglineEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={taglineText}
                  onChange={(e) => setTaglineText(e.target.value)}
                  placeholder="Boutique Online"
                  disabled={!taglineEnabled}
                  className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                />
              </div>

              {/* Headline */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Frase Principal Monumental (Itálica Serifada)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={headlineEnabled}
                      onChange={(e) => setHeadlineEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={headlineText}
                  onChange={(e) => setHeadlineText(e.target.value)}
                  placeholder="“Coloque no seu carrinho e receba na sua casa.”"
                  disabled={!headlineEnabled}
                  className="w-full text-sm font-serif italic bg-white border border-[#BFAE9C]/60 rounded-xs p-2.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                />
              </div>

              {/* Description */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Parágrafo de Afeto & Detalhes
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={descriptionEnabled}
                      onChange={(e) => setDescriptionEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir</span>
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  placeholder="Preparamos cada encomenda como quem envia uma carta de afeto..."
                  disabled={!descriptionEnabled}
                  className="w-full text-xs leading-relaxed bg-white border border-[#BFAE9C]/60 rounded-xs p-2.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                />
              </div>

            </div>
          )}

          {/* TAB 2: IMAGEM PANORÂMICA */}
          {currentTab === 'image' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Arte Panorâmica Superior
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={imageEnabled}
                      onChange={(e) => setImageEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir Imagem</span>
                  </label>
                </div>

                {/* Prévia da Imagem Atual */}
                {imageUrl && (
                  <div className="relative w-full h-28 rounded-xs overflow-hidden border border-[#BFAE9C]/40 bg-[#FAF7F2]">
                    <img
                      src={imageUrl}
                      alt={imageAlt || "Prévia"}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${imageBlendMode === 'multiply' ? 'mix-blend-multiply' : ''}`}
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-xs">
                      Prévia
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenFileUpload}
                    className="px-3 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload do Computador</span>
                  </button>
                  <span className="text-[11px] text-[#8C7561]">ou cole a URL abaixo</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                    URL da Imagem
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/minha-imagem.jpg"
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Opções de Ajuste */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                      Altura / Proporção
                    </label>
                    <select
                      value={imageMaxHeight}
                      onChange={(e) => setImageMaxHeight(e.target.value as any)}
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    >
                      <option value="full">Normal Original (Colada nas Laterais)</option>
                      <option value="md">Compacta / Reduzida</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                      Mesclagem de Cor
                    </label>
                    <select
                      value={imageBlendMode}
                      onChange={(e) => setImageBlendMode(e.target.value as any)}
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    >
                      <option value="multiply">Multiply (Funde com Fundo Creme)</option>
                      <option value="normal">Normal (Cores Originais)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: BOTÕES & AÇÕES */}
          {currentTab === 'buttons' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Botão Primário */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#7A5B43]">
                    <span className="w-2 h-2 rounded-full bg-[#2E251E]" />
                    <span className="text-[10.5px] uppercase tracking-wider font-bold">
                      Botão Primário (Escuro)
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={primaryBtnEnabled}
                      onChange={(e) => setPrimaryBtnEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Ativo</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43]">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={primaryBtnText}
                      onChange={(e) => setPrimaryBtnText(e.target.value)}
                      placeholder="Escolher Meus Produtos"
                      disabled={!primaryBtnEnabled}
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43]">
                      Ação ao Clicar
                    </label>
                    <select
                      value={primaryBtnAction}
                      onChange={(e) => setPrimaryBtnAction(e.target.value as any)}
                      disabled={!primaryBtnEnabled}
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                    >
                      <option value="explore_products">Ir para Produtos / Vitrine</option>
                      <option value="open_cart">Abrir Gaveta do Carrinho</option>
                      <option value="open_contact">Abrir Contato / Concierge</option>
                      <option value="custom_url">Link ou Âncora Personalizada</option>
                    </select>
                  </div>
                </div>

                {primaryBtnAction === 'custom_url' && (
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43]">
                      Link ou Âncora de Destino (Ex: #secao-produtos ou https://...)
                    </label>
                    <input
                      type="text"
                      value={primaryBtnCustomUrl}
                      onChange={(e) => setPrimaryBtnCustomUrl(e.target.value)}
                      placeholder="#secao-carrinho-casa"
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                )}
              </div>

              {/* Botão Secundário */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#7A5B43]">
                    <span className="w-2 h-2 rounded-full border border-[#7A5B43]" />
                    <span className="text-[10.5px] uppercase tracking-wider font-bold">
                      Botão Secundário (Contornado)
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={secondaryBtnEnabled}
                      onChange={(e) => setSecondaryBtnEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Ativo</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43]">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={secondaryBtnText}
                      onChange={(e) => setSecondaryBtnText(e.target.value)}
                      placeholder="Ver Meu Carrinho"
                      disabled={!secondaryBtnEnabled}
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43]">
                      Ação ao Clicar
                    </label>
                    <select
                      value={secondaryBtnAction}
                      onChange={(e) => setSecondaryBtnAction(e.target.value as any)}
                      disabled={!secondaryBtnEnabled}
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] disabled:opacity-50"
                    >
                      <option value="open_cart">Abrir Gaveta do Carrinho</option>
                      <option value="explore_products">Ir para Produtos / Vitrine</option>
                      <option value="open_contact">Abrir Contato / Concierge</option>
                      <option value="custom_url">Link ou Âncora Personalizada</option>
                    </select>
                  </div>
                </div>

                {secondaryBtnAction === 'custom_url' && (
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43]">
                      Link ou Âncora de Destino
                    </label>
                    <input
                      type="text"
                      value={secondaryBtnCustomUrl}
                      onChange={(e) => setSecondaryBtnCustomUrl(e.target.value)}
                      placeholder="#secao-produtos"
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: APARÊNCIA & STATUS */}
          {currentTab === 'style' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Status Geral da Seção
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSectionEnabled}
                      onChange={(e) => setIsSectionEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Seção Ativa na Loja</span>
                  </label>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#BFAE9C]/30">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Cor de Fundo da Seção
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-xs cursor-pointer border border-[#BFAE9C]"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-32 text-xs font-mono bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229]"
                    />
                    <div className="flex gap-1">
                      {['#FAF7F2', '#F7F4EF', '#FFFFFF', '#EDE6DC', '#211E1B'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBgColor(c)}
                          style={{ backgroundColor: c }}
                          className="w-6 h-6 rounded-xs border border-black/20 cursor-pointer hover:scale-110 transition-transform"
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
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
