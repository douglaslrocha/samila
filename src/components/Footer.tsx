import React, { useState, useRef } from 'react';
import {
  FooterSettings,
  FooterColumn,
  FooterLinkItem,
  FooterSocialItem,
  FooterArtistSignature,
  StoreCustomizationSettings
} from '../types';
import { getStoreName, getStoreWhatsapp } from '../utils/storeIdentity';
import { uploadImageToSupabase } from '../lib/supabase';
import {
  BRAND_QUOTE_SEAL_GALLERY,
  SealGalleryItem
} from '../data/brandQuoteGallery';
import {
  Compass,
  Heart,
  Instagram,
  MessageCircle,
  Music,
  Share2,
  Facebook,
  Youtube,
  Mail,
  Edit3,
  Plus,
  Trash2,
  Upload,
  X,
  Check,
  CheckCircle2,
  Sparkles,
  Sliders,
  Type,
  Image as ImageIcon,
  Film,
  RefreshCw,
  EyeOff,
  Layers,
  AtSign,
  ChevronDown,
  ChevronUp,
  PenTool,
  ExternalLink,
  Globe,
  Award
} from 'lucide-react';

export interface FooterProps {
  settings?: FooterSettings;
  storeSettings?: StoreCustomizationSettings;
  isEditorMode?: boolean;
  onUpdateSettings?: (newSettings: FooterSettings) => void;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

type FooterModalTab = 'brand' | 'columns' | 'socials' | 'bottom' | 'background';

export const Footer: React.FC<FooterProps> = ({
  settings,
  storeSettings,
  isEditorMode = false,
  onUpdateSettings,
  onNavigate,
  onOpenContact
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FooterModalTab>('columns');

  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Defaults fallback matching the original design & screenshot
  const isEnabled = settings?.enabled !== false;

  const brand = settings?.brand || {
    displayType: 'name' as const,
    nameText: 'MAISON ENTRELAÇO',
    logoUrl: '',
    logoHeight: 32,
    tagline: {
      enabled: true,
      text: '“Uma casa feita de histórias. Objetos para perfumar, cuidar e vestir a vida de beleza.”'
    },
    origins: {
      enabled: true,
      text: 'FRANÇA • ITÁLIA • BRASIL'
    }
  };

  const columns: FooterColumn[] = settings?.columns || [
    {
      id: 'col-maison',
      title: 'A MAISON',
      items: [
        { id: 'item-1', label: 'A Fundadora', actionType: 'scroll', target: 'a-maison' },
        { id: 'item-2', label: 'Boutique Online', actionType: 'scroll', target: 'secao-carrinho-casa' },
        { id: 'item-3', label: 'As Três Casas', actionType: 'scroll', target: 'tres-casas' }
      ]
    },
    {
      id: 'col-colecoes',
      title: 'COLEÇÕES',
      items: [
        { id: 'item-4', label: 'Velas Aromáticas', actionType: 'scroll', target: 'velas' },
        { id: 'item-5', label: 'Sabonetes Botânicos', actionType: 'scroll', target: 'sabonetes' },
        { id: 'item-6', label: 'Crochê Feito à Mão', actionType: 'scroll', target: 'croche' },
        { id: 'item-7', label: 'Edições Limitadas', actionType: 'scroll', target: 'produtos' }
      ]
    },
    {
      id: 'col-atendimento',
      title: 'ATENDIMENTO',
      items: [
        { id: 'item-8', label: 'Personalizado', actionType: 'contact' },
        { id: 'item-9', label: 'Encomendas', actionType: 'contact' },
        { id: 'item-10', label: 'Entregas & Prazos', actionType: 'contact' }
      ]
    },
    {
      id: 'col-conecte',
      title: 'CONECTE-SE',
      items: [
        { id: 'item-11', label: 'Fale Conosco', actionType: 'contact' }
      ]
    }
  ];

  const socials: FooterSocialItem[] = settings?.socials || [
    {
      id: 'soc-instagram',
      network: 'instagram',
      handle: '@maisonentrelaço'
    }
  ];

  const bottom = settings?.bottom || {
    copyright: '© Maison Entrelaço • Todos os direitos reservados.',
    loveMessage: 'Feito lentamente com ♥ para inspirar o viver.',
    artistSignature: {
      enabled: true,
      prefix: 'Planejado pelo artista',
      artistName: 'Douglas L. Rocha',
      websiteUrl: 'https://douglaslrocha.com',
      websiteLabel: 'douglaslrocha.com',
      signatureUrl: 'https://chatgpt.com/s/m_6aa57170bf548191bad414e48113190e',
      style: 'handwritten'
    }
  };

  const artistSignature: FooterArtistSignature = bottom.artistSignature || {
    enabled: true,
    prefix: 'Planejado pelo artista',
    artistName: 'Douglas L. Rocha',
    websiteUrl: 'https://douglaslrocha.com',
    websiteLabel: 'douglaslrocha.com',
    signatureUrl: 'https://chatgpt.com/s/m_6aa57170bf548191bad414e48113190e',
    style: 'handwritten'
  };

  const background = settings?.background || {
    type: 'video' as const,
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-night-sky-full-of-stars-41582-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=90',
    overlayColor: '#1C1714',
    overlayOpacity: 90
  };

  const getCurrentSettings = (): FooterSettings => ({
    enabled: isEnabled,
    brand: { ...brand },
    columns: [...columns],
    socials: [...socials],
    bottom: { ...bottom },
    background: { ...background }
  });

  const updateField = (partial: Partial<FooterSettings>) => {
    if (!onUpdateSettings) return;
    onUpdateSettings({
      ...getCurrentSettings(),
      ...partial
    });
  };

  const openTab = (tab: FooterModalTab) => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  // Direct file uploads from device via Supabase Storage
  const handleBgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      try {
        const result = await uploadImageToSupabase(file, 'footer-backgrounds');
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
        console.warn('Erro no upload de fundo do rodapé:', err);
      }
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadImageToSupabase(file, 'footer-logos');
        if (result) {
          updateField({
            brand: {
              ...brand,
              displayType: 'logo',
              logoUrl: result
            }
          });
        }
      } catch (err) {
        console.warn('Erro no upload de logo do rodapé:', err);
      }
    }
  };

  // Action Click Handler for Column Links
  const handleItemClick = (item: FooterLinkItem) => {
    if (isEditorMode) {
      openTab('columns');
      return;
    }

    if (item.actionType === 'contact') {
      onOpenContact();
      return;
    }

    if (item.actionType === 'whatsapp') {
      const currentStoreName = getStoreName(storeSettings);
      const cleanPhone = (getStoreWhatsapp(storeSettings) || '5511987654321').replace(/\D/g, '');
      const msg = encodeURIComponent(`Olá ${currentStoreName}! Gostaria de falar com o Concierge.`);
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
      return;
    }

    if (item.actionType === 'scroll' && item.target) {
      onNavigate(item.target);
      return;
    }

    if (item.target) {
      onNavigate(item.target);
    }
  };

  // Social Click Handler
  const handleSocialClick = (soc: FooterSocialItem) => {
    if (isEditorMode) {
      openTab('socials');
      return;
    }

    const cleanHandle = soc.handle.replace('@', '').trim();
    switch (soc.network) {
      case 'instagram':
        window.open(`https://instagram.com/${cleanHandle}`, '_blank');
        break;
      case 'whatsapp': {
        const fallbackNum = (getStoreWhatsapp(storeSettings) || '5511987654321').replace(/\D/g, '');
        const num = cleanHandle.replace(/\D/g, '') || fallbackNum;
        window.open(`https://wa.me/${num}`, '_blank');
        break;
      }
      case 'tiktok':
        window.open(`https://tiktok.com/@${cleanHandle}`, '_blank');
        break;
      case 'pinterest':
        window.open(`https://pinterest.com/${cleanHandle}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://facebook.com/${cleanHandle}`, '_blank');
        break;
      case 'youtube':
        window.open(`https://youtube.com/@${cleanHandle}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${cleanHandle}`, '_blank');
        break;
    }
  };

  const renderSocialIcon = (network: string) => {
    switch (network) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-[#E8E0D4]" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-[#E8E0D4]" />;
      case 'tiktok':
        return <Music className="w-3.5 h-3.5 text-[#E8E0D4]" />;
      case 'pinterest':
        return <Share2 className="w-3.5 h-3.5 text-[#E8E0D4]" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5 text-[#E8E0D4]" />;
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5 text-[#E8E0D4]" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-[#E8E0D4]" />;
      default:
        return <Instagram className="w-3.5 h-3.5 text-[#E8E0D4]" />;
    }
  };

  if (!isEnabled) {
    if (isEditorMode) {
      return (
        <div className="w-full bg-[#1C1714] border-t border-dashed border-[#7A5B43]/70 py-4 px-6 text-center animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-[#BFAE9C]" />
            <span className="text-xs text-[#BFAE9C] font-serif italic">
              O Rodapé da loja está oculto temporariamente.
            </span>
            <button
              onClick={() => updateField({ enabled: true })}
              className="px-3 py-1 bg-[#7A5B43] text-white text-[10.5px] uppercase tracking-wider rounded-xs hover:bg-[#6F775C] transition-colors cursor-pointer shadow-xs"
            >
              Reativar Rodapé
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <footer
      id="secao-rodape"
      className="relative w-full border-none outline-none overflow-hidden m-0 p-0 left-0 right-0 bg-[#241E1A] text-[#E8E0D4] transition-colors duration-300"
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
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-[#2C231C]/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#7A5B43]/60 shadow-lg">
          <button
            type="button"
            onClick={() => openTab('columns')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#E8E0D4] hover:text-white cursor-pointer transition-colors"
            title="Editar, Criar e Apagar Colunas e Links"
          >
            <Layers className="w-3.5 h-3.5 text-[#B89D78]" />
            <span>Colunas & Links</span>
          </button>
          <div className="w-px h-3.5 bg-white/20 mx-0.5" />
          <button
            type="button"
            onClick={() => openTab('brand')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#E8E0D4] hover:text-white cursor-pointer transition-colors"
            title="Editar Marca, Nome ou Logo"
          >
            <Type className="w-3.5 h-3.5 text-[#B89D78]" />
            <span>Marca & Logo</span>
          </button>
          <div className="w-px h-3.5 bg-white/20 mx-0.5" />
          <button
            type="button"
            onClick={() => openTab('socials')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#E8E0D4] hover:text-white cursor-pointer transition-colors"
            title="Editar Redes Sociais"
          >
            <AtSign className="w-3.5 h-3.5 text-[#B89D78]" />
            <span>Redes</span>
          </button>
          <div className="w-px h-3.5 bg-white/20 mx-0.5" />
          <button
            type="button"
            onClick={() => openTab('background')}
            className="p-1 text-[#E8E0D4] hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Mudar Fundo do Rodapé"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-white/20 mx-0.5" />
          <button
            type="button"
            onClick={() => updateField({ enabled: false })}
            className="p-1 text-[#BFAE9C] hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Ocultar rodapé"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 01. FULL-BLEED BACKGROUND (VÍDEO, IMAGEM OU COR LUXUOSA)                  */}
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
            className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.1]"
          />
        )}

        {background.type === 'image' && background.mediaUrl && (
          <img
            src={background.mediaUrl}
            alt="Fundo do Rodapé"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.1]"
          />
        )}

        {/* Dark Luxury Chiaroscuro Overlay */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            backgroundColor: background.overlayColor || '#1C1714',
            opacity: (background.overlayOpacity ?? 90) / 100,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          }}
        />

        {/* Quick Edit Background button when hovering in Editor Mode */}
        {isEditorMode && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/30 pointer-events-auto flex items-end justify-center pb-6">
            <button
              type="button"
              onClick={() => openTab('background')}
              className="px-4 py-2 bg-[#2C231C]/90 text-[#F7F4EF] text-xs font-semibold rounded-full border border-[#7A5B43]/60 shadow-md hover:bg-[#2C231C] flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#B89D78]" />
              <span>Editar Fundo do Rodapé</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 02. ESTRUTURA PRINCIPAL DO RODAPÉ (COLUNAS & MARCA)                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 pt-20 pb-12 max-w-7xl mx-auto px-6 sm:px-8 border-t border-[#7A5B43]/30">
        
        {/* Main Columns: Grid inteligente e responsivo (2 colunas no mobile, lado a lado) */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 pb-12 sm:pb-16 border-b border-white/10">
          
          {/* ===================================================================== */}
          {/* COLUNA DA MARCA (Ocupa 2 colunas no mobile e 2 no desktop)             */}
          {/* ===================================================================== */}
          <div 
            onClick={() => isEditorMode && openTab('brand')}
            className={`col-span-2 lg:col-span-2 space-y-4 sm:space-y-6 relative group/brand ${
              isEditorMode ? 'cursor-pointer hover:bg-white/5 p-3 rounded-xs -m-3 transition-all ring-1 ring-transparent hover:ring-[#B89D78]/40' : ''
            }`}
          >
            {/* Logo ou Nome */}
            {brand.displayType === 'logo' && brand.logoUrl ? (
              <div className="inline-block">
                <img
                  src={brand.logoUrl}
                  alt={brand.nameText || getStoreName(storeSettings)}
                  referrerPolicy="no-referrer"
                  style={{ maxHeight: `${brand.logoHeight || 36}px` }}
                  className="w-auto object-contain brightness-110"
                />
              </div>
            ) : (
              <span className="font-cinzel text-xl sm:text-2xl tracking-[0.25em] font-semibold uppercase text-[#F7F4EF] block">
                {brand.nameText || getStoreName(storeSettings).toUpperCase()}
              </span>
            )}

            {/* Frase / Tagline */}
            {brand.tagline?.enabled !== false && (
              <p className="font-serif text-sm sm:text-base italic text-[#BFAE9C] max-w-sm font-light leading-relaxed">
                {brand.tagline?.text || '“Uma casa feita de histórias. Objetos para perfumar, cuidar e vestir a vida de beleza.”'}
              </p>
            )}

            {/* Origens com Bússola */}
            {brand.origins?.enabled !== false && (
              <div className="pt-1 flex items-center gap-2.5 text-[11px] sm:text-xs font-sans tracking-widest uppercase text-[#BFAE9C]/80">
                <Compass className="w-3.5 h-3.5 text-[#B89D78]" strokeWidth={1.4} />
                <span>{brand.origins?.text || 'FRANÇA • ITÁLIA • BRASIL'}</span>
              </div>
            )}

            {isEditorMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openTab('brand');
                }}
                className="opacity-0 group-hover/brand:opacity-100 absolute top-2 right-2 px-2 py-1 bg-[#3D3229] text-[#E8E0D4] text-[10px] font-semibold uppercase tracking-wider rounded-xs border border-[#7A5B43] shadow-xs flex items-center gap-1 cursor-pointer transition-opacity"
              >
                <Edit3 className="w-2.5 h-2.5 text-[#B89D78]" />
                <span>Editar Marca</span>
              </button>
            )}
          </div>

          {/* ===================================================================== */}
          {/* COLUNAS DINÂMICAS DE LINKS & NAVEGAÇÃO                                */}
          {/* ===================================================================== */}
          {columns.map((col, index) => {
            // Se for a última coluna e houver redes sociais, renderiza links + redes sociais
            const isLastColumn = index === columns.length - 1;

            return (
              <div 
                key={col.id || index}
                className="col-span-1 space-y-3.5 sm:space-y-4 relative group/col"
              >
                <div className="flex items-center justify-between">
                  <h4 
                    onClick={() => isEditorMode && openTab('columns')}
                    className={`font-cinzel text-xs tracking-[0.25em] text-[#F7F4EF] uppercase font-semibold transition-colors ${
                      isEditorMode ? 'cursor-pointer hover:text-[#B89D78]' : ''
                    }`}
                  >
                    {col.title}
                  </h4>

                  {isEditorMode && (
                    <button
                      type="button"
                      onClick={() => openTab('columns')}
                      className="opacity-0 group-hover/col:opacity-100 p-1 bg-white/10 hover:bg-white/20 text-[#B89D78] rounded-full transition-opacity cursor-pointer"
                      title="Editar esta coluna e links"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                <ul className="space-y-2 sm:space-y-2.5 font-sans text-xs text-[#BFAE9C] font-light">
                  {col.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}

                  {/* Redes sociais anexadas na coluna Conecte-se ou na última coluna */}
                  {(col.title.toLowerCase().includes('conect') || isLastColumn) && socials.length > 0 && (
                    <div className="pt-2 space-y-2">
                      {socials.map((soc) => (
                        <li key={soc.id} className="pt-0.5 flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleSocialClick(soc)}
                            aria-label={`Rede social ${soc.network}`}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all inline-flex items-center justify-center border border-white/10 hover:border-[#B89D78]/60 cursor-pointer group/soc"
                          >
                            {renderSocialIcon(soc.network)}
                          </button>
                          <span
                            onClick={() => handleSocialClick(soc)}
                            className="text-[11px] text-[#BFAE9C]/80 font-light hover:text-white transition-colors cursor-pointer"
                          >
                            {soc.handle}
                          </span>
                        </li>
                      ))}
                    </div>
                  )}
                </ul>
              </div>
            );
          })}

        </div>

        {/* ========================================================================= */}
        {/* 03. CHANCELA DO ARTISTA / ASSINATURA DA OBRA (ESTILO PININFARINA)         */}
        {/* ========================================================================= */}
        {artistSignature?.enabled !== false && (
          <div 
            onClick={() => isEditorMode && openTab('bottom')}
            className={`pt-8 pb-4 flex flex-col items-center justify-center text-center relative group/artist ${
              isEditorMode ? 'cursor-pointer hover:bg-white/5 p-2 rounded-xs transition-all ring-1 ring-transparent hover:ring-[#B89D78]/30' : ''
            }`}
          >
            {/* Fine architectural hairline with central hallmark */}
            <div className="w-full flex items-center justify-center gap-3 mb-3.5 opacity-40">
              <div className="h-px bg-gradient-to-r from-transparent via-[#B89D78] to-transparent flex-1 max-w-xs" />
              <span className="text-[#B89D78] text-[9px] tracking-widest font-serif">◈</span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#B89D78] to-transparent flex-1 max-w-xs" />
            </div>

            {/* Architectural Signature Plaque (Pininfarina Concept) */}
            <div className="inline-flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-2xs hover:border-[#B89D78]/60 transition-all">
              {/* Prefix */}
              <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.22em] font-sans text-[#BFAE9C]/70 font-light">
                {artistSignature?.prefix || 'Planejado pelo artista'}
              </span>

              {/* Signature */}
              <div className="flex items-center gap-1.5">
                <PenTool className="w-3 h-3 text-[#B89D78]" />
                <span className={`text-[#F7F4EF] font-medium tracking-wide drop-shadow-xs ${
                  artistSignature?.style === 'classic' 
                    ? 'font-cinzel text-xs uppercase tracking-widest text-[#E8E0D4]' 
                    : artistSignature?.style === 'minimal'
                    ? 'font-sans text-xs tracking-wider text-[#E8E0D4]'
                    : 'font-[\'Caveat\',cursive] text-lg sm:text-xl -rotate-1 text-[#F7F4EF]'
                }`}>
                  {artistSignature?.artistName || 'Douglas L. Rocha'}
                </span>
              </div>

              <span className="text-[#B89D78]/40 hidden sm:inline">•</span>

              {/* Website */}
              <div className="flex items-center gap-1">
                <span className="text-[10.5px] text-[#BFAE9C]/60 font-sans">acesse</span>
                <a
                  href={
                    artistSignature?.websiteUrl?.startsWith('http') 
                      ? artistSignature.websiteUrl 
                      : `https://${artistSignature?.websiteUrl || 'douglaslrocha.com'}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-medium font-sans text-[#B89D78] hover:text-[#E8E0D4] underline underline-offset-3 decoration-[#B89D78]/40 hover:decoration-[#E8E0D4] transition-colors"
                >
                  {artistSignature?.websiteLabel || 'douglaslrocha.com'}
                </a>
              </div>

              {/* Botão Ver Assinatura (redireciona para o site do artista) */}
              <span className="text-[#B89D78]/40 hidden sm:inline">•</span>
              <a
                href={
                  artistSignature?.websiteUrl?.startsWith('http') 
                    ? artistSignature.websiteUrl 
                    : `https://${artistSignature?.websiteUrl || 'douglaslrocha.com'}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Acessar douglaslrocha.com"
                className="inline-flex items-center gap-1 text-[10px] text-[#BFAE9C]/90 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 hover:border-[#B89D78]/40 transition-colors cursor-pointer"
              >
                <span>Ver Assinatura</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#B89D78]" />
              </a>
            </div>

            {isEditorMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openTab('bottom');
                }}
                className="opacity-0 group-hover/artist:opacity-100 mt-2 px-2 py-0.5 bg-[#3D3229] text-[#E8E0D4] text-[9.5px] font-semibold uppercase tracking-wider rounded-xs border border-[#7A5B43] shadow-xs flex items-center gap-1 cursor-pointer transition-opacity"
              >
                <Edit3 className="w-2.5 h-2.5 text-[#B89D78]" />
                <span>Editar Chancela do Artista</span>
              </button>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 04. CRÉDITOS DO RODAPÉ (COPYRIGHT & MENSAGEM AFETIVA)                     */}
        {/* ========================================================================= */}
        <div 
          onClick={() => isEditorMode && openTab('bottom')}
          className={`pt-4 pb-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans text-[#BFAE9C]/60 text-center sm:text-left relative group/bottom ${
            isEditorMode ? 'cursor-pointer hover:bg-white/5 p-2 rounded-xs transition-all ring-1 ring-transparent hover:ring-[#B89D78]/30' : ''
          }`}
        >
          <p>{bottom.copyright || `© ${getStoreName(storeSettings)} • Todos os direitos reservados.`}</p>
          <div className="sm:text-right flex items-center justify-center sm:justify-end gap-1 flex-wrap">
            {bottom.loveMessage?.includes('♥') ? (
              <>
                <span>{bottom.loveMessage.split('♥')[0].trim()}</span>
                <Heart className="w-3 h-3 text-[#B89D78] inline fill-current shrink-0 mx-0.5" />
                <span>{bottom.loveMessage.split('♥').slice(1).join('♥').trim()}</span>
              </>
            ) : (
              <span>{bottom.loveMessage || 'Feito lentamente para inspirar o viver.'}</span>
            )}
          </div>

          {isEditorMode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openTab('bottom');
              }}
              className="opacity-0 group-hover/bottom:opacity-100 absolute top-1 right-1 px-2 py-0.5 bg-[#3D3229] text-[#E8E0D4] text-[9.5px] font-semibold uppercase tracking-wider rounded-xs border border-[#7A5B43] shadow-xs flex items-center gap-1 cursor-pointer transition-opacity"
            >
              <Edit3 className="w-2.5 h-2.5 text-[#B89D78]" />
              <span>Editar Textos</span>
            </button>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL EDITOR DO RODAPÉ (INTUITIVO, SEM LINKS COMPLEXOS, 100% VISUAL)       */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <FooterEditorModal
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
    </footer>
  );
};

// ============================================================================
// MODAL EDITOR COMPLETO DO RODAPÉ (COLUNAS, MARCA, REDES, TEXTOS, FUNDO)
// ============================================================================
interface FooterEditorModalProps {
  initialTab?: FooterModalTab;
  settings: FooterSettings;
  onClose: () => void;
  onSave: (settings: FooterSettings) => void;
  onOpenBgUpload: () => void;
  onOpenLogoUpload: () => void;
}

const FooterEditorModal: React.FC<FooterEditorModalProps> = ({
  initialTab = 'columns',
  settings,
  onClose,
  onSave
}) => {
  const [currentTab, setCurrentTab] = useState<FooterModalTab>(initialTab);

  // States
  const [isSectionEnabled, setIsSectionEnabled] = useState(settings.enabled);

  // Brand state
  const [brandDisplayType, setBrandDisplayType] = useState<'name' | 'logo'>(settings.brand?.displayType || 'name');
  const [brandNameText, setBrandNameText] = useState(settings.brand?.nameText || 'MAISON ENTRELAÇO');
  const [brandLogoUrl, setBrandLogoUrl] = useState(settings.brand?.logoUrl || '');
  const [brandLogoHeight, setBrandLogoHeight] = useState(settings.brand?.logoHeight || 32);
  const [taglineEnabled, setTaglineEnabled] = useState(settings.brand?.tagline?.enabled !== false);
  const [taglineText, setTaglineText] = useState(settings.brand?.tagline?.text || '“Uma casa feita de histórias. Objetos para perfumar, cuidar e vestir a vida de beleza.”');
  const [originsEnabled, setOriginsEnabled] = useState(settings.brand?.origins?.enabled !== false);
  const [originsText, setOriginsText] = useState(settings.brand?.origins?.text || 'FRANÇA • ITÁLIA • BRASIL');

  // Columns state
  const [columns, setColumns] = useState<FooterColumn[]>(() => 
    JSON.parse(JSON.stringify(settings.columns || []))
  );

  // Expanded column in accordion
  const [expandedColIndex, setExpandedColIndex] = useState<number | null>(0);

  // Socials state
  const [socials, setSocials] = useState<FooterSocialItem[]>(() => 
    JSON.parse(JSON.stringify(settings.socials || []))
  );

  // Bottom state
  const [copyrightText, setCopyrightText] = useState(settings.bottom?.copyright || '© Maison Entrelaço • Todos os direitos reservados.');
  const [loveMessageText, setLoveMessageText] = useState(settings.bottom?.loveMessage || 'Feito lentamente com ♥ para inspirar o viver.');

  // Artist signature state (Pininfarina / Architectural concept)
  const initialArtistSig = settings.bottom?.artistSignature || {
    enabled: true,
    prefix: 'Planejado pelo artista',
    artistName: 'Douglas L. Rocha',
    websiteUrl: 'https://douglaslrocha.com',
    websiteLabel: 'douglaslrocha.com',
    signatureUrl: 'https://chatgpt.com/s/m_6aa57170bf548191bad414e48113190e',
    style: 'handwritten' as const
  };
  const [artistSigEnabled, setArtistSigEnabled] = useState(initialArtistSig.enabled !== false);
  const [artistPrefix, setArtistPrefix] = useState(initialArtistSig.prefix || 'Planejado pelo artista');
  const [artistName, setArtistName] = useState(initialArtistSig.artistName || 'Douglas L. Rocha');
  const [artistWebsiteUrl, setArtistWebsiteUrl] = useState(initialArtistSig.websiteUrl || 'https://douglaslrocha.com');
  const [artistWebsiteLabel, setArtistWebsiteLabel] = useState(initialArtistSig.websiteLabel || 'douglaslrocha.com');
  const [artistSignatureUrl, setArtistSignatureUrl] = useState(initialArtistSig.signatureUrl || 'https://chatgpt.com/s/m_6aa57170bf548191bad414e48113190e');
  const [artistStyle, setArtistStyle] = useState<'handwritten' | 'classic' | 'minimal'>(initialArtistSig.style || 'handwritten');

  // Background state
  const [bgType, setBgType] = useState<'video' | 'image' | 'color'>(settings.background?.type || 'video');
  const [bgMediaUrl, setBgMediaUrl] = useState(settings.background?.mediaUrl || '');
  const [bgPosterUrl, setBgPosterUrl] = useState(settings.background?.posterUrl || '');
  const [bgOverlayColor, setBgOverlayColor] = useState(settings.background?.overlayColor || '#1C1714');
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(settings.background?.overlayOpacity ?? 90);
  const [isDragOver, setIsDragOver] = useState(false);

  // File input refs for in-modal uploads
  const modalMediaInputRef = useRef<HTMLInputElement>(null);
  const modalLogoInputRef = useRef<HTMLInputElement>(null);

  // Helper actions for columns
  const handleAddColumn = () => {
    const newCol: FooterColumn = {
      id: `col-${Date.now()}`,
      title: 'NOVA COLUNA',
      items: [
        {
          id: `item-${Date.now()}`,
          label: 'Novo Link',
          actionType: 'scroll',
          target: 'produtos'
        }
      ]
    };
    setColumns([...columns, newCol]);
    setExpandedColIndex(columns.length);
  };

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleUpdateColumnTitle = (index: number, newTitle: string) => {
    const updated = [...columns];
    updated[index].title = newTitle;
    setColumns(updated);
  };

  const handleAddItemToColumn = (colIndex: number) => {
    const updated = [...columns];
    updated[colIndex].items.push({
      id: `item-${Date.now()}`,
      label: 'Novo Link',
      actionType: 'scroll',
      target: 'produtos'
    });
    setColumns(updated);
  };

  const handleRemoveItemFromColumn = (colIndex: number, itemIndex: number) => {
    const updated = [...columns];
    updated[colIndex].items = updated[colIndex].items.filter((_, i) => i !== itemIndex);
    setColumns(updated);
  };

  const handleUpdateItemLabel = (colIndex: number, itemIndex: number, newLabel: string) => {
    const updated = [...columns];
    updated[colIndex].items[itemIndex].label = newLabel;
    setColumns(updated);
  };

  const handleUpdateItemDestination = (colIndex: number, itemIndex: number, dest: string) => {
    const updated = [...columns];
    const item = updated[colIndex].items[itemIndex];
    if (dest === 'contact') {
      item.actionType = 'contact';
      item.target = undefined;
    } else if (dest === 'whatsapp') {
      item.actionType = 'whatsapp';
      item.target = undefined;
    } else {
      item.actionType = 'scroll';
      item.target = dest;
    }
    setColumns(updated);
  };

  // Helper actions for socials
  const handleAddSocial = () => {
    const newSoc: FooterSocialItem = {
      id: `soc-${Date.now()}`,
      network: 'instagram',
      handle: '@minhamarca'
    };
    setSocials([...socials, newSoc]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleUpdateSocialNetwork = (index: number, net: FooterSocialItem['network']) => {
    const updated = [...socials];
    updated[index].network = net;
    setSocials(updated);
  };

  const handleUpdateSocialHandle = (index: number, val: string) => {
    const updated = [...socials];
    updated[index].handle = val;
    setSocials(updated);
  };

  // Upload helpers via Supabase Storage
  const handleModalMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      try {
        const result = await uploadImageToSupabase(file, 'footer-media');
        if (result) {
          setBgType(isVid ? 'video' : 'image');
          setBgMediaUrl(result);
        }
      } catch (err) {
        console.warn('Erro no upload de mídia no modal:', err);
      }
    }
  };

  const handleModalLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadImageToSupabase(file, 'footer-logos');
        if (result) {
          setBrandDisplayType('logo');
          setBrandLogoUrl(result);
        }
      } catch (err) {
        console.warn('Erro no upload de logo no modal:', err);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      try {
        const result = await uploadImageToSupabase(file, 'footer-media');
        if (result) {
          setBgType(isVid ? 'video' : 'image');
          setBgMediaUrl(result);
        }
      } catch (err) {
        console.warn('Erro no drop de arquivo:', err);
      }
    }
  };

  const handleSelectSealAsLogo = (seal: SealGalleryItem) => {
    setBrandDisplayType('logo');
    setBrandLogoUrl(seal.imageUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      enabled: isSectionEnabled,
      brand: {
        displayType: brandDisplayType,
        nameText: brandNameText.trim(),
        logoUrl: brandLogoUrl,
        logoHeight: Number(brandLogoHeight),
        tagline: {
          enabled: taglineEnabled,
          text: taglineText.trim()
        },
        origins: {
          enabled: originsEnabled,
          text: originsText.trim()
        }
      },
      columns,
      socials,
      bottom: {
        copyright: copyrightText.trim(),
        loveMessage: loveMessageText.trim(),
        artistSignature: {
          enabled: artistSigEnabled,
          prefix: artistPrefix.trim(),
          artistName: artistName.trim(),
          websiteUrl: artistWebsiteUrl.trim(),
          websiteLabel: artistWebsiteLabel.trim(),
          signatureUrl: artistSignatureUrl.trim(),
          style: artistStyle
        }
      },
      background: {
        type: bgType,
        mediaUrl: bgMediaUrl,
        posterUrl: bgPosterUrl,
        overlayColor: bgOverlayColor,
        overlayOpacity: Number(bgOverlayOpacity)
      }
    });
  };

  // Preset destination choices
  const DESTINATION_OPTIONS = [
    { value: 'a-maison', label: '✦ A Fundadora (História da Maison)' },
    { value: 'secao-carrinho-casa', label: '✦ Boutique Online (Experiência de Entrega)' },
    { value: 'tres-casas', label: '✦ As Três Casas (Vitrine Completa)' },
    { value: 'velas', label: '✦ Velas Aromáticas' },
    { value: 'sabonetes', label: '✦ Sabonetes Botânicos' },
    { value: 'croche', label: '✦ Crochê Feito à Mão' },
    { value: 'produtos', label: '✦ Edições Limitadas / Todos os Produtos' },
    { value: 'contact', label: '✦ Fale Conosco / Contato & Encomendas' },
    { value: 'whatsapp', label: '✦ WhatsApp do Concierge' },
    { value: 'hero', label: '✦ Topo da Página (Início)' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Hidden File Inputs inside Modal */}
      <input
        ref={modalMediaInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleModalMediaUpload}
        className="hidden"
      />
      <input
        ref={modalLogoInputRef}
        type="file"
        accept="image/*"
        onChange={handleModalLogoUpload}
        className="hidden"
      />

      <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#BFAE9C] rounded-xs shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto text-left">
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
            <Sparkles className="w-4 h-4 text-[#B89D78]" />
            <span className="text-[10.5px] uppercase tracking-widest font-semibold">
              Edição Completa & Intuitiva
            </span>
          </div>
          <h4 className="font-serif text-xl text-[#2C231C] font-semibold mt-0.5">
            Personalização do Rodapé
          </h4>
          <p className="text-xs text-[#7A5B43]">
            Edite, apague e adicione novas colunas, links, redes sociais, logotipo e textos sem precisar de links complexos.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#BFAE9C]/30 mb-5 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setCurrentTab('columns')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'columns'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/80 shadow-2xs'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Colunas & Links ({columns.length})</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('brand')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'brand'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/80 shadow-2xs'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Marca & Logo</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('socials')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'socials'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/80 shadow-2xs'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5" />
              <span>Redes Sociais ({socials.length})</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('bottom')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'bottom'
                ? 'border-[#7A5B43] text-[#7A5B43] bg-white/80 shadow-2xs'
                : 'border-transparent text-[#8C7561] hover:text-[#3D3229]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              <span>Textos & Créditos</span>
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ================================================================= */}
          {/* TAB 1: COLUNAS & LINKS (EDITAR, APAGAR, ADICIONAR MAIS)           */}
          {/* ================================================================= */}
          {currentTab === 'columns' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#BFAE9C]/30 pb-2.5">
                <div>
                  <h5 className="text-xs font-serif font-semibold text-[#2C231C]">
                    Estrutura de Colunas e Links
                  </h5>
                  <p className="text-[11px] text-[#8C7561]">
                    Crie novas colunas, altere títulos, adicione ou remova itens facilmente.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="px-3 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Coluna</span>
                </button>
              </div>

              {/* Lista de Colunas */}
              <div className="space-y-3">
                {columns.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-[#BFAE9C]/50 rounded-xs">
                    <p className="text-xs text-[#8C7561] mb-3 font-serif italic">
                      Nenhuma coluna cadastrada no rodapé.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="px-4 py-2 bg-[#7A5B43] text-white text-xs uppercase tracking-wider rounded-xs"
                    >
                      + Criar Primeira Coluna
                    </button>
                  </div>
                ) : (
                  columns.map((col, colIndex) => {
                    const isExpanded = expandedColIndex === colIndex;

                    return (
                      <div
                        key={col.id || colIndex}
                        className="bg-white border border-[#BFAE9C]/60 rounded-xs overflow-hidden shadow-2xs"
                      >
                        {/* Header do Card da Coluna */}
                        <div className="p-3 bg-[#FAF8F5] border-b border-[#BFAE9C]/40 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-[#EFE7DC] text-[#7A5B43] text-[10.5px] font-mono font-semibold flex items-center justify-center shrink-0">
                              {colIndex + 1}
                            </span>
                            <input
                              type="text"
                              value={col.title}
                              onChange={(e) => handleUpdateColumnTitle(colIndex, e.target.value)}
                              placeholder="Título da Coluna (ex: A MAISON)"
                              className="font-cinzel text-xs font-semibold text-[#2C231C] uppercase tracking-wider bg-transparent border-b border-transparent hover:border-[#7A5B43] focus:border-[#7A5B43] focus:bg-white px-1.5 py-0.5 outline-none transition-all flex-1 min-w-0"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-[#8C7561] font-mono bg-[#EFE7DC] px-2 py-0.5 rounded-xs">
                              {col.items.length} {col.items.length === 1 ? 'link' : 'links'}
                            </span>

                            <button
                              type="button"
                              onClick={() => setExpandedColIndex(isExpanded ? null : colIndex)}
                              className="p-1 text-[#7A5B43] hover:text-[#2C231C] rounded cursor-pointer"
                              title={isExpanded ? 'Recolher itens' : 'Expandir itens'}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveColumn(colIndex)}
                              className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="Excluir esta coluna inteira"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Corpo com os Itens da Coluna (quando expandido) */}
                        {isExpanded && (
                          <div className="p-3.5 space-y-3">
                            <div className="space-y-2">
                              {col.items.map((item, itemIndex) => {
                                const currentDest = item.actionType === 'contact' 
                                  ? 'contact' 
                                  : item.actionType === 'whatsapp' 
                                  ? 'whatsapp' 
                                  : item.target || 'produtos';

                                return (
                                  <div
                                    key={item.id || itemIndex}
                                    className="p-2 bg-[#FAF8F5] border border-[#BFAE9C]/40 rounded-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2 group/item hover:border-[#7A5B43]/50 transition-all"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <label className="text-[9px] uppercase tracking-wider text-[#8C7561] block mb-0.5">
                                        Nome do Item / Link:
                                      </label>
                                      <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => handleUpdateItemLabel(colIndex, itemIndex, e.target.value)}
                                        placeholder="Nome do Link (ex: Velas Aromáticas)"
                                        className="w-full text-xs font-serif text-[#2C231C] bg-white border border-[#BFAE9C]/50 rounded-xs px-2 py-1 outline-none focus:border-[#7A5B43]"
                                      />
                                    </div>

                                    <div className="sm:w-64 shrink-0">
                                      <label className="text-[9px] uppercase tracking-wider text-[#8C7561] block mb-0.5">
                                        Destino ao Clicar (Sem precisar de link):
                                      </label>
                                      <select
                                        value={currentDest}
                                        onChange={(e) => handleUpdateItemDestination(colIndex, itemIndex, e.target.value)}
                                        className="w-full text-[11px] text-[#3D3229] bg-white border border-[#BFAE9C]/50 rounded-xs px-2 py-1 outline-none focus:border-[#7A5B43] cursor-pointer"
                                      >
                                        {DESTINATION_OPTIONS.map((opt) => (
                                          <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="sm:self-end pt-1 sm:pt-0">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveItemFromColumn(colIndex, itemIndex)}
                                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                                        title="Remover este item"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddItemToColumn(colIndex)}
                              className="w-full py-2 bg-[#FAF8F5] hover:bg-[#EFE7DC] text-[#7A5B43] border border-dashed border-[#BFAE9C]/80 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Adicionar Item nesta Coluna</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: MARCA & IDENTIDADE (NOME OU UPLOAD DE LOGO PRÓPRIA)         */}
          {/* ================================================================= */}
          {currentTab === 'brand' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 bg-white border border-[#BFAE9C]/60 rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Identidade da Marca no Rodapé:
                  </label>
                  <span className="text-[10px] text-[#8C7561]">
                    Escolha entre Tipografia ou Imagem de Logo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBrandDisplayType('name')}
                    className={`p-2.5 rounded-xs border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      brandDisplayType === 'name'
                        ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                        : 'bg-white text-[#5C4D41] border-[#BFAE9C]/50 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Nome em Texto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrandDisplayType('logo')}
                    className={`p-2.5 rounded-xs border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      brandDisplayType === 'logo'
                        ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                        : 'bg-white text-[#5C4D41] border-[#BFAE9C]/50 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Logotipo (Upload / Selo)</span>
                  </button>
                </div>

                {/* Seção de Nome em Texto */}
                {brandDisplayType === 'name' ? (
                  <div className="space-y-2 p-3 bg-[#FAF8F5] border border-[#BFAE9C]/40 rounded-xs">
                    <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold block">
                      Texto do Nome da Marca
                    </label>
                    <input
                      type="text"
                      value={brandNameText}
                      onChange={(e) => setBrandNameText(e.target.value)}
                      placeholder="MAISON ENTRELAÇO"
                      className="w-full px-3 py-2 bg-white border border-[#BFAE9C]/60 rounded-xs text-sm font-cinzel tracking-widest text-[#2C231C] outline-none focus:border-[#7A5B43]"
                    />
                    <p className="text-[10px] text-[#8C7561]">
                      Exibido em caixa alta com a tipografia nobre Cinzel e espaçamento luxuoso.
                    </p>
                  </div>
                ) : (
                  /* Seção de Upload de Logotipo */
                  <div className="space-y-3 p-3 bg-[#FAF8F5] border border-[#BFAE9C]/40 rounded-xs">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold block">
                        Imagem do Logotipo (Direto do seu aparelho)
                      </label>
                      {brandLogoUrl && (
                        <button
                          type="button"
                          onClick={() => setBrandLogoUrl('')}
                          className="text-[10px] text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Remover</span>
                        </button>
                      )}
                    </div>

                    {/* Prévia da Logo */}
                    {brandLogoUrl ? (
                      <div className="p-3 bg-[#241E1A] rounded-xs border border-[#7A5B43]/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={brandLogoUrl}
                            alt="Prévia da Logo"
                            style={{ height: `${brandLogoHeight}px` }}
                            className="w-auto object-contain brightness-110"
                          />
                          <span className="text-xs text-[#E8E0D4] font-serif">
                            Logotipo Ativo no Rodapé
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => modalLogoInputRef.current?.click()}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[#E8E0D4] text-[10.5px] rounded-xs flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Substituir</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => modalLogoInputRef.current?.click()}
                        className="p-5 border-2 border-dashed border-[#BFAE9C]/70 hover:border-[#7A5B43] bg-white rounded-xs text-center cursor-pointer group transition-all"
                      >
                        <Upload className="w-6 h-6 mx-auto text-[#7A5B43] mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-serif font-semibold text-[#2C231C] block">
                          Clique para fazer upload da sua Logo
                        </span>
                        <span className="text-[10px] text-[#8C7561] block">
                          PNG com fundo transparente, JPG ou WebP
                        </span>
                      </div>
                    )}

                    {/* Galeria de Selos da Maison como alternativa */}
                    <div className="space-y-1.5 pt-2 border-t border-[#BFAE9C]/30">
                      <span className="text-[10px] uppercase tracking-wider text-[#7A5B43] font-semibold block">
                        Ou escolha um dos Selos de Luxo da Maison:
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {BRAND_QUOTE_SEAL_GALLERY.slice(0, 6).map((seal) => (
                          <button
                            key={seal.id}
                            type="button"
                            onClick={() => handleSelectSealAsLogo(seal)}
                            className={`p-1.5 bg-[#241E1A] rounded-xs border transition-all cursor-pointer group flex flex-col items-center justify-center ${
                              brandLogoUrl === seal.imageUrl
                                ? 'border-[#B89D78] ring-1 ring-[#B89D78]'
                                : 'border-white/10 hover:border-[#B89D78]/50'
                            }`}
                          >
                            <img
                              src={seal.imageUrl}
                              alt={seal.name}
                              className="w-7 h-7 object-contain group-hover:scale-110 transition-transform"
                            />
                            <span className="text-[8.5px] text-[#BFAE9C] truncate w-full text-center mt-1">
                              {seal.name.split('•')[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Frase / Tagline da Marca */}
              <div className="p-3.5 bg-white border border-[#BFAE9C]/60 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Frase Poética / Tagline
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taglineEnabled}
                      onChange={(e) => setTaglineEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir Frase</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={taglineText}
                  onChange={(e) => setTaglineText(e.target.value)}
                  disabled={!taglineEnabled}
                  placeholder="“Uma casa feita de histórias. Objetos para perfumar, cuidar e vestir a vida de beleza.”"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-xs font-serif italic text-[#2C231C] outline-none focus:border-[#7A5B43] disabled:opacity-50"
                />
              </div>

              {/* Presença / Origens com Bússola */}
              <div className="p-3.5 bg-white border border-[#BFAE9C]/60 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Selo de Presença Geográfica (com Bússola)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C4D41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={originsEnabled}
                      onChange={(e) => setOriginsEnabled(e.target.checked)}
                      className="accent-[#7A5B43] rounded"
                    />
                    <span>Exibir Presença</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#7A5B43] shrink-0" />
                  <input
                    type="text"
                    value={originsText}
                    onChange={(e) => setOriginsText(e.target.value)}
                    disabled={!originsEnabled}
                    placeholder="FRANÇA • ITÁLIA • BRASIL"
                    className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-xs uppercase tracking-widest text-[#2C231C] outline-none focus:border-[#7A5B43] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: REDES SOCIAIS & CONECTE-SE                                 */}
          {/* ================================================================= */}
          {currentTab === 'socials' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#BFAE9C]/30 pb-2.5">
                <div>
                  <h5 className="text-xs font-serif font-semibold text-[#2C231C]">
                    Redes Sociais & Contatos Oficiais
                  </h5>
                  <p className="text-[11px] text-[#8C7561]">
                    Adicione seus canais (Instagram, WhatsApp, TikTok, Pinterest, etc.).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSocial}
                  className="px-3 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Rede</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {socials.map((soc, socIndex) => (
                  <div
                    key={soc.id || socIndex}
                    className="p-3 bg-white border border-[#BFAE9C]/60 rounded-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shadow-2xs"
                  >
                    <div className="sm:w-44 shrink-0">
                      <label className="text-[9px] uppercase tracking-wider text-[#8C7561] block mb-0.5">
                        Canal:
                      </label>
                      <select
                        value={soc.network}
                        onChange={(e) => handleUpdateSocialNetwork(socIndex, e.target.value as any)}
                        className="w-full text-xs text-[#3D3229] bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs px-2.5 py-1.5 outline-none focus:border-[#7A5B43] cursor-pointer"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="tiktok">TikTok</option>
                        <option value="pinterest">Pinterest</option>
                        <option value="facebook">Facebook</option>
                        <option value="youtube">YouTube</option>
                        <option value="email">E-mail</option>
                      </select>
                    </div>

                    <div className="flex-1 min-w-0">
                      <label className="text-[9px] uppercase tracking-wider text-[#8C7561] block mb-0.5">
                        @Nome de Usuário ou Contato:
                      </label>
                      <input
                        type="text"
                        value={soc.handle}
                        onChange={(e) => handleUpdateSocialHandle(socIndex, e.target.value)}
                        placeholder={soc.network === 'whatsapp' ? '(11) 99999-9999' : '@maisonentrelaço'}
                        className="w-full text-xs text-[#2C231C] bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs px-2.5 py-1.5 outline-none focus:border-[#7A5B43]"
                      />
                    </div>

                    <div className="sm:self-end pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(socIndex)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                        title="Remover este canal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {socials.length === 0 && (
                  <div className="p-6 text-center bg-white border border-[#BFAE9C]/50 rounded-xs">
                    <p className="text-xs text-[#8C7561] mb-2 font-serif italic">
                      Nenhuma rede social configurada.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="px-3.5 py-1.5 bg-[#7A5B43] text-white text-[11px] uppercase tracking-wider rounded-xs"
                    >
                      + Adicionar Instagram ou WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: TEXTOS, CRÉDITOS & CHANCELA DO ARTISTA                     */}
          {/* ================================================================= */}
          {currentTab === 'bottom' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* ------------------------------------------------------------- */}
              {/* CHANCELA DO ARTISTA / CONCEITO PININFARINA                     */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 bg-gradient-to-br from-[#FAF8F5] to-white border border-[#B89D78]/40 rounded-xs shadow-xs space-y-3.5">
                <div className="flex items-start justify-between gap-3 border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#3D3229] text-[#E8E0D4] flex items-center justify-center shrink-0 shadow-2xs border border-[#B89D78]/50">
                      <PenTool className="w-4 h-4 text-[#B89D78]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-serif font-semibold text-[#2C231C] flex items-center gap-1.5">
                        <span>Chancela de Obra de Arte & Design</span>
                        <span className="text-[9px] uppercase tracking-wider font-sans bg-[#EFE7DC] text-[#7A5B43] px-1.5 py-0.5 rounded-2xs font-bold">
                          Estilo Pininfarina
                        </span>
                      </h5>
                      <p className="text-[10.5px] text-[#8C7561] font-sans">
                        Assine a criação da loja como os grandes edifícios e ícones mundiais assinados por mestres designers.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer shrink-0 mt-0.5">
                    <span className="text-[10.5px] font-sans text-[#7A5B43] font-medium hidden sm:inline">
                      {artistSigEnabled ? 'Ativo' : 'Oculto'}
                    </span>
                    <input
                      type="checkbox"
                      checked={artistSigEnabled}
                      onChange={(e) => setArtistSigEnabled(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors relative ${artistSigEnabled ? 'bg-[#7A5B43]' : 'bg-[#D1C7BD]'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${artistSigEnabled ? 'left-4.5' : 'left-0.75'}`} />
                    </div>
                  </label>
                </div>

                {artistSigEnabled && (
                  <div className="space-y-3.5 pt-1">
                    {/* PRÉVIA EM TEMPO REAL (DARK LUXURY PLAQUE) */}
                    <div className="p-3 bg-[#1C1714] border border-[#7A5B43]/50 rounded-xs shadow-inner text-center">
                      <div className="text-[8.5px] uppercase tracking-widest text-[#B89D78] font-mono mb-2 opacity-80">
                        ✦ Visualização Real da Placa no Rodapé:
                      </div>

                      <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
                        <span className="text-[9.5px] uppercase tracking-[0.2em] font-sans text-[#BFAE9C]/70 font-light">
                          {artistPrefix || 'Planejado pelo artista'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <PenTool className="w-2.5 h-2.5 text-[#B89D78]" />
                          <span className={`text-[#F7F4EF] font-medium tracking-wide ${
                            artistStyle === 'classic' 
                              ? 'font-cinzel text-[11px] uppercase tracking-widest text-[#E8E0D4]' 
                              : artistStyle === 'minimal'
                              ? 'font-sans text-[11px] tracking-wider text-[#E8E0D4]'
                              : 'font-[\'Caveat\',cursive] text-base -rotate-1 text-[#F7F4EF]'
                          }`}>
                            {artistName || 'Douglas L. Rocha'}
                          </span>
                        </div>

                        <span className="text-[#B89D78]/40 hidden sm:inline">•</span>

                        <div className="flex items-center gap-1">
                          <span className="text-[9.5px] text-[#BFAE9C]/60 font-sans">acesse</span>
                          <span className="text-[10px] font-medium font-sans text-[#B89D78] underline underline-offset-2 decoration-[#B89D78]/50">
                            {artistWebsiteLabel || 'douglaslrocha.com'}
                          </span>
                        </div>

                        <span className="text-[#B89D78]/40 hidden sm:inline">•</span>
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#BFAE9C]/80 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                          <span>Ver Assinatura</span>
                          <ExternalLink className="w-2 h-2 text-[#B89D78]" />
                        </span>
                      </div>
                    </div>

                    {/* CAMPO 1: PREFIXO / CONCEITO */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                        Rótulo de Abertura / Conceito:
                      </label>
                      <input
                        type="text"
                        value={artistPrefix}
                        onChange={(e) => setArtistPrefix(e.target.value)}
                        placeholder="Planejado pelo artista"
                        className="w-full px-3 py-1.5 bg-white border border-[#BFAE9C]/60 rounded-xs text-xs text-[#2C231C] outline-none focus:border-[#7A5B43]"
                      />

                      {/* Sugestões Rápidas */}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <span className="text-[9.5px] text-[#8C7561] self-center mr-1">Sugestões:</span>
                        {[
                          'Planejado pelo artista',
                          'Obra concebida & assinada por',
                          'Design & Arquitetura por',
                          'Projeto de arte assinado por'
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setArtistPrefix(preset)}
                            className={`text-[9.5px] px-2 py-0.5 rounded-2xs border transition-colors cursor-pointer ${
                              artistPrefix === preset
                                ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                                : 'bg-white text-[#7A5B43] border-[#BFAE9C]/50 hover:bg-[#FAF8F5]'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CAMPO 2: NOME DO ARTISTA */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                        Nome ou Assinatura do Artista / Designer:
                      </label>
                      <input
                        type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        placeholder="Douglas L. Rocha"
                        className="w-full px-3 py-1.5 bg-white border border-[#BFAE9C]/60 rounded-xs text-xs font-medium text-[#2C231C] outline-none focus:border-[#7A5B43]"
                      />
                    </div>

                    {/* CAMPO 3: ESTILO VISUAL DA ASSINATURA */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1.5">
                        Estilo Tipográfico da Assinatura:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setArtistStyle('handwritten')}
                          className={`p-2.5 rounded-xs border text-left cursor-pointer transition-all ${
                            artistStyle === 'handwritten'
                              ? 'bg-[#EFE7DC] border-[#7A5B43] text-[#2C231C] shadow-2xs'
                              : 'bg-white border-[#BFAE9C]/50 hover:border-[#7A5B43] text-[#554537]'
                          }`}
                        >
                          <div className="text-[10px] font-semibold uppercase tracking-wider">Caligrafia de Autor</div>
                          <div className="font-['Caveat',cursive] text-base text-[#7A5B43] mt-0.5">
                            {artistName || 'Douglas L. Rocha'}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setArtistStyle('classic')}
                          className={`p-2.5 rounded-xs border text-left cursor-pointer transition-all ${
                            artistStyle === 'classic'
                              ? 'bg-[#EFE7DC] border-[#7A5B43] text-[#2C231C] shadow-2xs'
                              : 'bg-white border-[#BFAE9C]/50 hover:border-[#7A5B43] text-[#554537]'
                          }`}
                        >
                          <div className="text-[10px] font-semibold uppercase tracking-wider">Monograma Nobre</div>
                          <div className="font-cinzel text-[11px] font-semibold text-[#7A5B43] uppercase tracking-wider mt-1">
                            {artistName || 'Douglas L. Rocha'}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setArtistStyle('minimal')}
                          className={`p-2.5 rounded-xs border text-left cursor-pointer transition-all ${
                            artistStyle === 'minimal'
                              ? 'bg-[#EFE7DC] border-[#7A5B43] text-[#2C231C] shadow-2xs'
                              : 'bg-white border-[#BFAE9C]/50 hover:border-[#7A5B43] text-[#554537]'
                          }`}
                        >
                          <div className="text-[10px] font-semibold uppercase tracking-wider">Moderno Minimal</div>
                          <div className="font-sans text-[11px] font-medium text-[#7A5B43] tracking-wider mt-1">
                            {artistName || 'Douglas L. Rocha'}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* CAMPOS 4: SITE OFICIAL DO ARTISTA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43] block">
                            Link do Site do Artista / Botão (URL):
                          </label>
                          {artistWebsiteUrl && (
                            <a
                              href={artistWebsiteUrl.startsWith('http') ? artistWebsiteUrl : `https://${artistWebsiteUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#7A5B43] hover:text-[#2C231C] underline flex items-center gap-1 font-sans"
                            >
                              <span>Testar Site</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <input
                          type="text"
                          value={artistWebsiteUrl}
                          onChange={(e) => setArtistWebsiteUrl(e.target.value)}
                          placeholder="https://douglaslrocha.com"
                          className="w-full px-3 py-1.5 bg-white border border-[#BFAE9C]/60 rounded-xs text-xs text-[#2C231C] outline-none focus:border-[#7A5B43]"
                        />
                        <p className="text-[9.5px] text-[#8C7561] mt-1">
                          Tanto o texto "acesse douglaslrocha.com" quanto o botão "Ver Assinatura" redirecionam para este endereço oficial.
                        </p>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                          Texto do Domínio (Exibição):
                        </label>
                        <input
                          type="text"
                          value={artistWebsiteLabel}
                          onChange={(e) => setArtistWebsiteLabel(e.target.value)}
                          placeholder="douglaslrocha.com"
                          className="w-full px-3 py-1.5 bg-white border border-[#BFAE9C]/60 rounded-xs text-xs text-[#2C231C] outline-none focus:border-[#7A5B43]"
                        />
                      </div>
                    </div>

                    {/* CAMPO 5: LINK DA ASSINATURA / MANIFESTO */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43] block">
                          Link da Assinatura / Autenticação da Obra (Opcional):
                        </label>
                        {artistSignatureUrl && (
                          <a
                            href={artistSignatureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#7A5B43] hover:text-[#2C231C] underline flex items-center gap-1 font-sans"
                          >
                            <span>Testar Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <input
                        type="text"
                        value={artistSignatureUrl}
                        onChange={(e) => setArtistSignatureUrl(e.target.value)}
                        placeholder="https://chatgpt.com/s/m_6aa57170bf548191bad414e48113190e"
                        className="w-full px-3 py-1.5 bg-white border border-[#BFAE9C]/60 rounded-xs text-xs text-[#2C231C] outline-none focus:border-[#7A5B43]"
                      />
                      <p className="text-[9.5px] text-[#8C7561] mt-1">
                        Insira o link onde está registrada a concepção, assinatura digital ou manifesto do artista.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* LINHA DE DIREITOS AUTORAIS (COPYRIGHT)                        */}
              {/* ------------------------------------------------------------- */}
              <div className="p-3.5 bg-white border border-[#BFAE9C]/60 rounded-xs space-y-2">
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block">
                  Linha de Direitos Autorais (Copyright):
                </label>
                <input
                  type="text"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  placeholder="© Maison Entrelaço • Todos os direitos reservados."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-xs text-[#2C231C] outline-none focus:border-[#7A5B43]"
                />
              </div>

              {/* ------------------------------------------------------------- */}
              {/* MENSAGEM AFETIVA DE ENCERRAMENTO                              */}
              {/* ------------------------------------------------------------- */}
              <div className="p-3.5 bg-white border border-[#BFAE9C]/60 rounded-xs space-y-2">
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#B89D78] fill-current" />
                  <span>Mensagem Afetiva de Encerramento:</span>
                </label>
                <input
                  type="text"
                  value={loveMessageText}
                  onChange={(e) => setLoveMessageText(e.target.value)}
                  placeholder="Feito lentamente com ♥ para inspirar o viver."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-xs text-[#2C231C] outline-none focus:border-[#7A5B43]"
                />
                <p className="text-[10px] text-[#8C7561]">
                  O símbolo de coração é renderizado com elegância na cor dourada da Maison.
                </p>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: FUNDO (VÍDEO / FOTO / COR LUXUOSA)                          */}
          {/* ================================================================= */}
          {currentTab === 'background' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Status Atual */}
              <div className="flex items-center justify-between border-b border-[#BFAE9C]/30 pb-2">
                <div>
                  <h5 className="text-xs font-serif font-semibold text-[#2C231C]">
                    Mídia de Fundo do Rodapé
                  </h5>
                  <p className="text-[11px] text-[#8C7561]">
                    Carregue seu próprio vídeo em loop suave ou imagem fotográfica.
                  </p>
                </div>

                {bgType !== 'color' && bgMediaUrl ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {bgType === 'video' ? 'Vídeo Ativo' : 'Foto Ativa'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE9DF] text-[#7A5B43] border border-[#BFAE9C]/50">
                    Cor Escura de Luxo
                  </span>
                )}
              </div>

              {/* Mídia Ativa */}
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
                    <div className="w-28 h-18 sm:w-36 sm:h-20 rounded-xs overflow-hidden bg-black/10 shrink-0 relative border border-[#BFAE9C]/40">
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
                        {bgType === 'video' ? 'Vídeo em Movimento do Rodapé' : 'Imagem Fotográfica do Rodapé'}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => modalMediaInputRef.current?.click()}
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

              {/* Área de Upload Elegante */}
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
                onClick={() => modalMediaInputRef.current?.click()}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#BFAE9C]/60 flex items-center justify-center text-[#7A5B43] group-hover:scale-110 transition-all shadow-2xs mb-2.5">
                  <Upload className="w-5 h-5 text-[#7A5B43]" />
                </div>

                <h6 className="font-serif text-sm font-semibold text-[#2C231C] mb-1">
                  Carregar vídeo ou foto direto do seu dispositivo
                </h6>
                <p className="text-[11px] text-[#8C7561] max-w-sm mx-auto mb-2">
                  Suporta vídeos (MP4, MOV, WebM) ou imagens (JPG, PNG, WebP).
                </p>
              </div>

              {/* Cor Escura de Luxo */}
              <div className={`p-3 rounded-xs border transition-all flex items-center justify-between ${
                bgType === 'color' || !bgMediaUrl
                  ? 'bg-white border-[#7A5B43] ring-1 ring-[#7A5B43]'
                  : 'bg-white/70 border-[#BFAE9C]/40'
              }`}>
                <div>
                  <span className="text-xs font-serif font-semibold text-[#2C231C] block">
                    Usar apenas Cor Escura Chiaroscuro
                  </span>
                  <span className="text-[10.5px] text-[#8C7561]">
                    Fundo sóbrio de luxo atemporal
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
                  {bgType === 'color' || !bgMediaUrl ? '✓ Cor Ativa' : 'Aplicar Cor Pura'}
                </button>
              </div>

              {/* Opacidade da Camada */}
              <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/50 rounded-xs space-y-2">
                <div className="flex justify-between text-[10.5px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                  <span>Opacidade do Filtro Escuro</span>
                  <span>{bgOverlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={bgOverlayOpacity}
                  onChange={(e) => setBgOverlayOpacity(Number(e.target.value))}
                  className="w-full accent-[#7A5B43] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#8C7561]">
                  <span>50% (mais translúcido)</span>
                  <span>100% (escuro total)</span>
                </div>
              </div>

            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#BFAE9C]/30 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#7A5B43] hover:text-[#2C231C] cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs font-semibold uppercase tracking-widest rounded-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações do Rodapé</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
