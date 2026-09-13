import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  UploadCloud, 
  Image as ImageIcon, 
  Type, 
  Check,
  RotateCcw,
  CheckCircle2,
  CornerDownRight,
  Layers
} from 'lucide-react';
import { HeaderSettings, ProductLine, NavLinkItem } from '../types';
import { uploadImageToSupabase } from '../lib/supabase';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onNavigate: (sectionId: string) => void;
  cartCount: number;
  settings: HeaderSettings;
  productLines?: ProductLine[];
  onCreateProductLine?: (newLine: ProductLine) => void;
  onToggleAdmin: () => void;
  isAdminOpen: boolean;
  isEmbedded?: boolean;
  isEditorMode?: boolean;
  onUpdateSettings?: (newSettings: HeaderSettings) => void;
  onAnnouncementClick?: () => void;
  isAnnouncementEditing?: boolean;
  announcementEditorSlot?: React.ReactNode;
  onHeaderClick?: () => void;
  isHeaderEditing?: boolean;
  headerEditorSlot?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onNavigate,
  cartCount,
  settings,
  productLines = [],
  onCreateProductLine,
  onToggleAdmin,
  isAdminOpen,
  isEmbedded = false,
  isEditorMode = false,
  onUpdateSettings,
  onAnnouncementClick,
  isAnnouncementEditing = false,
  announcementEditorSlot,
  onHeaderClick,
  isHeaderEditing = false,
  headerEditorSlot
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);

  // Estados de edição direta e limpa no item
  const [isEditingAnnouncementInline, setIsEditingAnnouncementInline] = useState(false);
  const [isEditingLogoPopover, setIsEditingLogoPopover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escuta a chegada do coração voador no carrinho para disparar animação de celebração
  useEffect(() => {
    const handleCartArrival = () => {
      setIsCartBouncing(true);
      const timer = setTimeout(() => {
        setIsCartBouncing(false);
      }, 850);
      return () => clearTimeout(timer);
    };

    window.addEventListener('cart-item-arrived', handleCartArrival);
    return () => window.removeEventListener('cart-item-arrived', handleCartArrival);
  }, []);

  // Upload direto do dispositivo para a logo usando Supabase Storage
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Selecione uma imagem válida (PNG, JPG, SVG ou WebP).');
      return;
    }
    try {
      const imageUrl = await uploadImageToSupabase(file, 'logos');
      if (imageUrl && onUpdateSettings) {
        onUpdateSettings({
          ...settings,
          logo: {
            ...settings.logo,
            type: 'image',
            imageUrl
          }
        });
      }
    } catch (err) {
      console.warn('Erro ao enviar imagem da logo:', err);
    }
  };

  // As 3 Casas Reais e Conectadas que existem na Home
  const THREE_REAL_HOUSES_NAV: NavLinkItem[] = [
    { id: 'velas', label: 'Velas Aromáticas', enabled: true, targetId: 'velas', targetType: 'line' },
    { id: 'sabonetes', label: 'Sabonetes Botânicos', enabled: true, targetId: 'sabonetes', targetType: 'line' },
    { id: 'croche', label: 'Peças em Crochê', enabled: true, targetId: 'croche', targetType: 'line' }
  ];

  const handleSyncThreeRealHouses = () => {
    if (!onUpdateSettings) return;
    onUpdateSettings({
      ...settings,
      navLinks: THREE_REAL_HOUSES_NAV
    });
  };

  // Funções de manipulação direta de itens de navegação (Menu) e Linhas de Produtos
  const handleAddNavItem = () => {
    if (!onUpdateSettings) return;
    const newId = 'secao-link-' + Date.now().toString().slice(-4);
    const updatedLinks: NavLinkItem[] = [
      ...settings.navLinks,
      { id: newId, label: 'Novo Item', enabled: true, targetId: 'tres-casas', targetType: 'section' }
    ];
    onUpdateSettings({
      ...settings,
      navLinks: updatedLinks
    });
  };

  // Cria uma nova linha de produtos na vitrine de cards horizontais da Home e gera o link no menu
  const handleAddNewProductLine = () => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const currentCount = productLines?.length || 3;
    const roman = romanNumerals[currentCount] || `${currentCount + 1}`;
    const newId = `linha-${Date.now().toString().slice(-4)}`;
    const lineMain = `A Coleção`;
    const lineSub = `Linha Especial ${roman}`;

    const newLine: ProductLine = {
      id: newId,
      roman,
      mainTitle: lineMain,
      subTitle: lineSub,
      watermarkWords: [lineMain.toUpperCase(), 'ATELIER'],
      defaultBadge1: 'Edição Exclusiva',
      defaultBadge2: 'Feito à Mão',
      bgColor: 'from-[#FAF8F5] via-[#F4ECE1] to-[#EBE2D5]',
      fadeColor: '#FAF8F5'
    };

    if (onCreateProductLine) {
      onCreateProductLine(newLine);
    }

    if (onUpdateSettings) {
      const newNavItem: NavLinkItem = {
        id: newId,
        label: lineSub,
        enabled: true,
        targetId: newId,
        targetType: 'line'
      };
      onUpdateSettings({
        ...settings,
        navLinks: [...settings.navLinks, newNavItem]
      });
    }

    // Navega suavemente para a nova seção para o usuário já ver os cards criados
    setTimeout(() => {
      onNavigate(newId);
    }, 150);
  };

  const handleUpdateNavItem = (id: string, label: string) => {
    if (!onUpdateSettings) return;
    const updatedLinks = settings.navLinks.map((item) =>
      item.id === id ? { ...item, label } : item
    );
    onUpdateSettings({
      ...settings,
      navLinks: updatedLinks
    });
  };

  const handleUpdateNavTarget = (id: string, targetId: string) => {
    if (!onUpdateSettings) return;
    const updatedLinks = settings.navLinks.map((item) =>
      item.id === id ? { ...item, targetId } : item
    );
    onUpdateSettings({
      ...settings,
      navLinks: updatedLinks
    });
  };

  const handleToggleNavItem = (id: string) => {
    if (!onUpdateSettings) return;
    const updatedLinks = settings.navLinks.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    onUpdateSettings({
      ...settings,
      navLinks: updatedLinks
    });
  };

  const handleDeleteNavItem = (id: string) => {
    if (!onUpdateSettings) return;
    const updatedLinks = settings.navLinks.filter((item) => item.id !== id);
    onUpdateSettings({
      ...settings,
      navLinks: updatedLinks
    });
  };

  const ANNOUNCEMENT_COLORS = [
    '#2C231C', // Café
    '#4A1E24', // Bordô
    '#4E563E', // Oliva
    '#8A6445', // Caramelo
    '#D4AF37'  // Ouro
  ];

  const navItems = settings.navLinks.filter((item) => item.enabled);

  const getLogoDimensions = () => {
    switch (settings.logo.size) {
      case 'sm':
        return 'w-9 h-9 sm:w-9 sm:h-9';
      case 'lg':
        return 'w-12 h-12 sm:w-13 sm:h-13';
      case 'md':
      default:
        return 'w-10 h-10 sm:w-11 sm:h-11';
    }
  };

  const getThemeClasses = () => {
    switch (settings.style?.theme) {
      case 'translucent_glass':
        return 'bg-white/85 backdrop-blur-md border-b border-[#BFAE9C]/30 text-[#3D3229]';
      case 'monochrome_dark':
        return 'bg-[#1C1714]/95 backdrop-blur-md border-b border-[#7A5B43]/40 text-[#F7F4EF]';
      case 'classic_cream':
      default:
        return 'bg-[#F7F4EF]/95 backdrop-blur-md border-b border-[#BFAE9C]/20 text-[#3D3229]';
    }
  };

  // Parâmetros do Selo Monograma Circular do Atelier
  const sealTop = settings.logo.sealTopText ?? 'MAISON';
  const sealBottom = settings.logo.sealBottomText ?? 'ENTRELAÇO';
  const sealCenter = settings.logo.monogram || 'ME';

  const topFontSize = sealTop.length > 11 ? '5.2' : sealTop.length > 8 ? '6.2' : '7.5';
  const topLetterSpacing = sealTop.length > 9 ? '1.0' : '1.8';

  const bottomFontSize = sealBottom.length > 12 ? '4.8' : sealBottom.length > 9 ? '5.5' : '6.5';
  const bottomLetterSpacing = sealBottom.length > 10 ? '1.2' : '2.2';

  const centerFontSize = sealCenter.length <= 2 ? '18' : sealCenter.length <= 4 ? '14' : '10.5';
  const centerY = sealCenter.length > 4 ? '53.5' : '55';

  const renderLogo = () => {
    // 1. Logo em Imagem (Upload do Dispositivo ou URL Externa)
    if (settings.logo.type === 'image' && settings.logo.imageUrl) {
      const imgHeightClass =
        settings.logo.size === 'sm'
          ? 'max-h-8 sm:max-h-9 max-w-[130px]'
          : settings.logo.size === 'lg'
          ? 'max-h-13 sm:max-h-14 max-w-[210px]'
          : 'max-h-10 sm:max-h-11 max-w-[170px]';

      return (
        <div className="flex items-center justify-center py-1">
          <img
            src={settings.logo.imageUrl}
            alt={settings.logo.text || 'Maison Entrelaço'}
            referrerPolicy="no-referrer"
            className={`${imgHeightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs`}
          />
        </div>
      );
    }

    // 2. Tipografia Nobre Textual
    if (settings.logo.type === 'text') {
      const textClass =
        settings.logo.size === 'sm'
          ? 'text-xs sm:text-sm tracking-[0.2em]'
          : settings.logo.size === 'lg'
          ? 'text-base sm:text-lg tracking-[0.26em]'
          : 'text-sm sm:text-base tracking-[0.22em]';

      return (
        <div className="flex flex-col items-center justify-center py-1 text-center">
          <span className={`font-serif uppercase font-semibold transition-colors duration-300 group-hover:text-[#7A5B43] ${textClass}`}>
            {settings.logo.text || 'MAISON ENTRELAÇO'}
          </span>
          <span className="text-[7.5px] sm:text-[8px] tracking-[0.32em] uppercase text-[#7A5B43] font-sans font-medium">
            ATELIER & BOUTIQUE
          </span>
        </div>
      );
    }

    // 3. Selo Monograma Circular do Atelier (Padrão)
    return (
      <div className={`relative ${getLogoDimensions()} rounded-full border border-[#7A5B43]/45 bg-[#FDFBF7] flex items-center justify-center shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-[#7A5B43] overflow-hidden p-0.5`}>
        <svg viewBox="0 0 100 100" className="w-full h-full select-none">
          {/* Concentric Decorative Rings */}
          <circle cx="50" cy="50" r="47" stroke="#7A5B43" strokeWidth="1.2" fill="none" />
          <circle cx="50" cy="50" r="43" stroke="#BFAE9C" strokeWidth="0.8" strokeDasharray="2,2" fill="none" />
          
          {/* Curved Text Path Top */}
          <path id="circleTop" d="M 20,50 A 30,30 0 0,1 80,50" fill="none" />
          <text fontSize={topFontSize} letterSpacing={topLetterSpacing} fill="#7A5B43" fontWeight="600" fontFamily="Montserrat, sans-serif">
            <textPath href="#circleTop" startOffset="50%" textAnchor="middle">
              {sealTop}
            </textPath>
          </text>

          {/* Center Monogram */}
          <text
            x="50"
            y={centerY}
            textAnchor="middle"
            fontFamily="Cinzel, serif"
            fontSize={centerFontSize}
            fontWeight="600"
            fill="#3D3229"
            letterSpacing="0.5"
          >
            {sealCenter}
          </text>
          
          {/* Tiny Atelier Dot */}
          <circle cx="50" cy="62" r="1.5" fill="#7A5B43" />

          {/* Curved Text Path Bottom */}
          <path id="circleBottom" d="M 80,52 A 30,30 0 0,1 20,52" fill="none" />
          <text fontSize={bottomFontSize} letterSpacing={bottomLetterSpacing} fill="#7A5B43" fontWeight="500" fontFamily="Montserrat, sans-serif">
            <textPath href="#circleBottom" startOffset="50%" textAnchor="middle">
              {sealBottom}
            </textPath>
          </text>
        </svg>
      </div>
    );
  };

  const isSticky = !isEmbedded && settings.style?.sticky !== false;

  return (
    <header
      className={`${isSticky ? 'fixed top-0 left-0' : 'relative'} w-full z-40 transition-all duration-300 ${getThemeClasses()}`}
    >
      {/* 1. Faixa Superior de Informações (Announcement Bar) */}
      {(settings.announcementBar.enabled || isEditorMode) && (!isAnnouncementDismissed || isEditorMode) && (
        <div
          style={{
            backgroundColor: settings.announcementBar.enabled
              ? (settings.announcementBar.bgColor || '#3D3229')
              : '#2C231C',
            color: settings.announcementBar.textColor || '#F7F4EF'
          }}
          className={`relative w-full text-[10px] sm:text-[11px] font-sans font-light tracking-widest uppercase flex items-center justify-center border-b border-[#7A5B43]/30 transition-all overflow-hidden ${
            isEditorMode && !isEditingAnnouncementInline
              ? 'cursor-pointer hover:brightness-110 select-none py-2 sm:py-2.5 px-6 sm:px-8'
              : 'py-2 sm:py-2.5 px-6 sm:px-8'
          }`}
          onClick={() => {
            if (isEditorMode && !isEditingAnnouncementInline) {
              setIsEditingAnnouncementInline(true);
              onAnnouncementClick?.();
            }
          }}
          title={isEditorMode && !isEditingAnnouncementInline ? "Toque para editar a faixa diretamente" : undefined}
        >
          {/* MODO EDIÇÃO DIRETA NA FAIXA (Zero textos compridos, ultra intuitivo) */}
          {isEditorMode && isEditingAnnouncementInline ? (
            <div 
              className="w-full flex flex-wrap items-center justify-center gap-2 py-0.5 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={settings.announcementBar.text}
                onChange={(e) => onUpdateSettings?.({
                  ...settings,
                  announcementBar: { ...settings.announcementBar, text: e.target.value }
                })}
                placeholder="Texto do aviso..."
                className="bg-black/40 text-white border border-white/30 rounded px-2.5 py-1 text-xs outline-none focus:border-amber-400 max-w-sm flex-1 min-w-0 text-center font-medium"
              />

              <input
                type="text"
                value={settings.announcementBar.linkText || ''}
                onChange={(e) => onUpdateSettings?.({
                  ...settings,
                  announcementBar: { ...settings.announcementBar, linkText: e.target.value }
                })}
                placeholder="Texto do Link"
                className="bg-black/40 text-white border border-white/30 rounded px-2 py-1 text-[11px] outline-none focus:border-amber-400 w-28 text-center"
              />

              {/* Seletor Rápido de Cores (Bolinhas de Cor) */}
              <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-black/30 rounded-full">
                {ANNOUNCEMENT_COLORS.map((col) => (
                  <button
                    key={col}
                    onClick={() => onUpdateSettings?.({
                      ...settings,
                      announcementBar: { ...settings.announcementBar, bgColor: col }
                    })}
                    style={{ backgroundColor: col }}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      settings.announcementBar.bgColor === col
                        ? 'border-white ring-2 ring-amber-400 scale-125'
                        : 'border-white/30 hover:scale-110'
                    }`}
                  />
                ))}
              </div>

              {/* Botão de Visibilidade */}
              <button
                onClick={() => onUpdateSettings?.({
                  ...settings,
                  announcementBar: { ...settings.announcementBar, enabled: !settings.announcementBar.enabled }
                })}
                className="p-1 rounded bg-black/30 hover:bg-black/50 text-white transition-colors"
                title={settings.announcementBar.enabled ? "Ocultar faixa" : "Ativar faixa"}
              >
                {settings.announcementBar.enabled ? (
                  <Eye className="w-4 h-4 text-amber-300" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Botão Concluir Edição */}
              <button
                onClick={() => setIsEditingAnnouncementInline(false)}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[10px] uppercase tracking-wider transition-all shadow-xs flex items-center gap-1"
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Pronto</span>
              </button>
            </div>
          ) : (
            /* Visualização Limpa */
            <>
              {settings.announcementBar.enabled ? (
                <div className={`flex items-center justify-center gap-1.5 ${settings.announcementBar.isMarquee ? 'animate-pulse' : ''}`}>
                  <span>{settings.announcementBar.text}</span>
                  {settings.announcementBar.linkText && (
                    <button
                      onClick={(e) => {
                        if (isEditorMode) {
                          e.stopPropagation();
                          setIsEditingAnnouncementInline(true);
                        } else {
                          onNavigate(settings.announcementBar.linkUrl?.replace('#', '') || 'tres-casas');
                        }
                      }}
                      className="underline hover:opacity-80 font-medium ml-1 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{settings.announcementBar.linkText}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ) : (
                <span className="opacity-75 italic text-amber-200">
                  [Faixa de Avisos Oculta • Toque para ativar]
                </span>
              )}

              {/* Botão de Fechar Faixa (Dismissible) */}
              {settings.announcementBar.dismissible && !isEditorMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAnnouncementDismissed(true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:opacity-75 transition-opacity"
                  title="Fechar comunicado"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Ponto sutil Lottie Beacon apenas para sinalizar que é clicável */}
              {isEditorMode && (
                <span
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 lottie-beacon-dot pointer-events-none"
                  title="Faixa Editável"
                >
                  <span className="lottie-beacon-wave" />
                  <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF3D1] lottie-beacon-core shadow-[0_0_8px_rgba(255,215,0,0.95)]" />
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Slot expansível legado (apenas se fornecido) */}
      {announcementEditorSlot}

      {/* 2. Barra Principal do Cabeçalho */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-8 h-13 sm:h-15 flex items-center justify-between transition-all"
      >
        
        {/* Left Section: Nav Links (Desktop) / Mobile Menu (Mobile) */}
        <div className="flex items-center gap-3 sm:gap-6 flex-1 justify-start">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 -ml-1 text-[#3D3229] hover:text-[#7A5B43] focus:outline-none transition-colors relative"
            aria-label="Menu"
            title={isEditorMode ? "Toque para abrir o menu e gerenciar linhas & redirecionamento" : "Menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.75]" /> : <Menu className="w-5 h-5 stroke-[1.75]" />}
            {isEditorMode && !mobileMenuOpen && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          {/* Desktop Navigation com Edição Direta no Item e Botão de Adicionar (+) */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {isEditorMode ? (
              <>
                {settings.navLinks.map((item) => (
                  <div key={item.id} className="relative group/nav flex items-center">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateNavItem(item.id, e.target.value)}
                      className={`text-[11px] lg:text-xs uppercase tracking-[0.18em] font-medium bg-transparent border-b transition-all px-1 py-0.5 outline-none ${
                        item.enabled
                          ? 'text-[#3D3229] border-transparent hover:border-[#7A5B43]/50 focus:border-[#7A5B43] focus:bg-white/60 rounded-xs'
                          : 'text-gray-400 line-through border-transparent'
                      }`}
                      style={{ width: `${Math.max(item.label.length * 8.5, 65)}px` }}
                      title="Clique para editar o nome do item"
                    />

                    {/* Ações rápidas no hover do item: ocultar ou excluir */}
                    <div className="opacity-0 group-hover/nav:opacity-100 flex items-center gap-0.5 transition-opacity ml-0.5">
                      <button
                        onClick={() => handleToggleNavItem(item.id)}
                        className="p-0.5 text-[#7A5B43] hover:text-black rounded"
                        title={item.enabled ? "Ocultar da navegação" : "Mostrar na navegação"}
                      >
                        {item.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                      </button>
                      {settings.navLinks.length > 3 && (
                        <button
                          onClick={() => handleDeleteNavItem(item.id)}
                          className="p-0.5 text-red-500 hover:text-red-700 rounded"
                          title="Excluir Item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Sincronizar com as 3 Casas Reais da Home se houver alteração */}
                {settings.navLinks.length !== 3 && (
                  <div className="flex items-center ml-1 shrink-0">
                    <button
                      onClick={handleSyncThreeRealHouses}
                      className="p-1 px-2 rounded-full border border-[#7A5B43]/40 text-[#7A5B43] hover:bg-[#7A5B43]/10 transition-all flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase"
                      title="Sincronizar estritamente com as 3 Casas da Home (Velas, Sabonetes, Crochê)"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>3 Casas Reais</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.targetId || item.id)}
                  className="text-[11px] lg:text-xs uppercase tracking-[0.2em] font-medium text-[#3D3229]/80 hover:text-[#7A5B43] transition-colors"
                >
                  {item.label}
                </button>
              ))
            )}
          </nav>
        </div>

        {/* Center: Logo Dinâmica (Upload do Dispositivo, Tipografia Nobre ou Selo Monograma) */}
        <div className="flex items-center justify-center shrink-0 px-2 relative">
          <button
            onClick={() => {
              if (isEditorMode) {
                setIsEditingLogoPopover(!isEditingLogoPopover);
                onHeaderClick?.();
              } else {
                onNavigate('hero');
              }
            }}
            className="group relative flex items-center justify-center focus:outline-none"
            aria-label="Maison Entrelaço - Início"
            title={isEditorMode ? "Toque para alterar a logo da marca" : undefined}
          >
            {renderLogo()}

            {/* Ponto Lottie Beacon Brilhando Suavemente (sem piscar brusco, sem poluição) */}
            {isEditorMode && (
              <span
                className="absolute -top-1 -right-1.5 lottie-beacon-dot z-20 pointer-events-none"
                title="Editar Logo"
              >
                <span className="lottie-beacon-wave" />
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_10px_rgba(212,175,55,0.95)]" />
              </span>
            )}
          </button>

          {/* POPOVER COMPACTO DIRETO NA LOGO (Sem textos compridos, 100% intuitivo) */}
          {isEditorMode && isEditingLogoPopover && (
            <>
              {/* Backdrop para fechar ao tocar fora */}
              <div 
                className="fixed inset-0 z-40 bg-black/10"
                onClick={() => setIsEditingLogoPopover(false)}
              />

              <div 
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-[88vw] max-w-xs sm:max-w-sm bg-[#FAF8F5] text-[#2C231C] border border-[#7A5B43]/30 rounded-lg shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#7A5B43]/15">
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-[#7A5B43]">
                    Identidade da Logo
                  </span>
                  <button 
                    onClick={() => setIsEditingLogoPopover(false)} 
                    className="p-1 hover:bg-black/5 rounded text-[#7A5B43]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 3 Modos Diretos em Botões com Ícone */}
                <div className="grid grid-cols-3 gap-1.5 mb-3 bg-[#EDE6DC] p-1 rounded-md text-[11px] font-medium">
                  <button
                    onClick={() => onUpdateSettings?.({ ...settings, logo: { ...settings.logo, type: 'image' } })}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 transition-all ${
                      settings.logo.type === 'image' ? 'bg-[#7A5B43] text-white shadow-xs font-semibold' : 'text-[#3D3229]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Foto</span>
                  </button>

                  <button
                    onClick={() => onUpdateSettings?.({ ...settings, logo: { ...settings.logo, type: 'circular_monogram' } })}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 transition-all ${
                      settings.logo.type === 'circular_monogram' ? 'bg-[#7A5B43] text-white shadow-xs font-semibold' : 'text-[#3D3229]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Selo</span>
                  </button>

                  <button
                    onClick={() => onUpdateSettings?.({ ...settings, logo: { ...settings.logo, type: 'text' } })}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 transition-all ${
                      settings.logo.type === 'text' ? 'bg-[#7A5B43] text-white shadow-xs font-semibold' : 'text-[#3D3229]'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Texto</span>
                  </button>
                </div>

                {/* Conteúdo do Modo Foto (Upload do Celular ou PC) */}
                {settings.logo.type === 'image' && (
                  <div className="space-y-2.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 bg-[#E8DFD3] hover:bg-[#DED2C3] active:scale-98 border border-dashed border-[#7A5B43] rounded flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#7A5B43] transition-all shadow-xs"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Carregar do Dispositivo</span>
                    </button>

                    {settings.logo.imageUrl && (
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-[#BFAE9C]/30">
                        <img src={settings.logo.imageUrl} alt="Logo" className="h-7 max-w-[120px] object-contain" />
                        <button
                          onClick={() => onUpdateSettings?.({ ...settings, logo: { ...settings.logo, imageUrl: '' } })}
                          className="text-[11px] text-red-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remover</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Conteúdo do Modo Selo (Em cima, No meio, Em baixo) */}
                {settings.logo.type === 'circular_monogram' && (
                  <div className="space-y-2.5 py-1">
                    {/* Mini Preview do Selo em Tempo Real */}
                    <div className="flex items-center justify-center p-2 bg-[#F3ECE4] rounded-md border border-[#7A5B43]/20 mb-1">
                      <div className="w-13 h-13 rounded-full border border-[#7A5B43]/50 bg-[#FDFBF7] flex items-center justify-center shadow-xs overflow-hidden p-0.5">
                        <svg viewBox="0 0 100 100" className="w-full h-full select-none">
                          <circle cx="50" cy="50" r="47" stroke="#7A5B43" strokeWidth="1.2" fill="none" />
                          <circle cx="50" cy="50" r="43" stroke="#BFAE9C" strokeWidth="0.8" strokeDasharray="2,2" fill="none" />
                          <path id="popoverCircleTop" d="M 20,50 A 30,30 0 0,1 80,50" fill="none" />
                          <text fontSize={topFontSize} letterSpacing={topLetterSpacing} fill="#7A5B43" fontWeight="600" fontFamily="Montserrat, sans-serif">
                            <textPath href="#popoverCircleTop" startOffset="50%" textAnchor="middle">
                              {sealTop}
                            </textPath>
                          </text>
                          <text
                            x="50"
                            y={centerY}
                            textAnchor="middle"
                            fontFamily="Cinzel, serif"
                            fontSize={centerFontSize}
                            fontWeight="600"
                            fill="#3D3229"
                            letterSpacing="0.5"
                          >
                            {sealCenter}
                          </text>
                          <circle cx="50" cy="62" r="1.5" fill="#7A5B43" />
                          <path id="popoverCircleBottom" d="M 80,52 A 30,30 0 0,1 20,52" fill="none" />
                          <text fontSize={bottomFontSize} letterSpacing={bottomLetterSpacing} fill="#7A5B43" fontWeight="500" fontFamily="Montserrat, sans-serif">
                            <textPath href="#popoverCircleBottom" startOffset="50%" textAnchor="middle">
                              {sealBottom}
                            </textPath>
                          </text>
                        </svg>
                      </div>
                    </div>

                    {/* 1. Palavra em Cima */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                          Em cima:
                        </span>
                        <span className="text-[9px] text-gray-500">Palavra superior</span>
                      </div>
                      <input
                        type="text"
                        maxLength={18}
                        value={settings.logo.sealTopText ?? 'MAISON'}
                        onChange={(e) => onUpdateSettings?.({
                          ...settings,
                          logo: { ...settings.logo, sealTopText: e.target.value.toUpperCase() }
                        })}
                        placeholder="MAISON"
                        className="w-32 text-center font-serif text-xs uppercase bg-white border border-[#7A5B43]/30 rounded px-2 py-1 font-semibold outline-none focus:ring-1 focus:ring-[#7A5B43]"
                      />
                    </div>

                    {/* 2. Iniciais / Nome no Meio */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                          No meio:
                        </span>
                        <span className="text-[9px] text-gray-500">Iniciais / Nome central</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={settings.logo.monogram || 'ME'}
                        onChange={(e) => onUpdateSettings?.({
                          ...settings,
                          logo: { ...settings.logo, monogram: e.target.value.toUpperCase() }
                        })}
                        placeholder="ME"
                        className="w-32 text-center font-serif text-sm uppercase bg-white border border-[#7A5B43]/30 rounded px-2 py-1 font-bold outline-none focus:ring-1 focus:ring-[#7A5B43]"
                      />
                    </div>

                    {/* 3. Palavra em Baixo */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                          Em baixo:
                        </span>
                        <span className="text-[9px] text-gray-500">Palavra inferior</span>
                      </div>
                      <input
                        type="text"
                        maxLength={18}
                        value={settings.logo.sealBottomText ?? 'ENTRELAÇO'}
                        onChange={(e) => onUpdateSettings?.({
                          ...settings,
                          logo: { ...settings.logo, sealBottomText: e.target.value.toUpperCase() }
                        })}
                        placeholder="ENTRELAÇO"
                        className="w-32 text-center font-serif text-xs uppercase bg-white border border-[#7A5B43]/30 rounded px-2 py-1 font-semibold outline-none focus:ring-1 focus:ring-[#7A5B43]"
                      />
                    </div>
                  </div>
                )}

                {/* Conteúdo do Modo Texto */}
                {settings.logo.type === 'text' && (
                  <div className="py-1">
                    <input
                      type="text"
                      value={settings.logo.text || 'MAISON ENTRELAÇO'}
                      onChange={(e) => onUpdateSettings?.({
                        ...settings,
                        logo: { ...settings.logo, text: e.target.value }
                      })}
                      placeholder="Nome da Marca"
                      className="w-full bg-white border border-[#7A5B43]/30 rounded px-2.5 py-1.5 text-xs font-serif tracking-widest text-[#2C231C] outline-none focus:ring-1 focus:ring-[#7A5B43]"
                    />
                  </div>
                )}

                {/* Escala / Tamanho (P / M / G) */}
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#7A5B43]/15">
                  <span className="text-[10.5px] uppercase tracking-wider font-medium text-[#7A5B43]">Tamanho:</span>
                  <div className="flex items-center gap-1 bg-[#EDE6DC] p-0.5 rounded">
                    {(['sm', 'md', 'lg'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => onUpdateSettings?.({ ...settings, logo: { ...settings.logo, size: sz } })}
                        className={`w-7 h-6 text-[10px] font-bold rounded uppercase transition-all ${
                          settings.logo.size === sz ? 'bg-[#7A5B43] text-white shadow-xs' : 'text-[#3D3229]'
                        }`}
                      >
                        {sz === 'sm' ? 'P' : sz === 'md' ? 'M' : 'G'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botão Concluir */}
                <button
                  onClick={() => setIsEditingLogoPopover(false)}
                  className="w-full mt-3 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-widest font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Pronto</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Section: Actions & Admin Access Icon */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
          
          {/* 1. Search Action */}
          <button
            onClick={() => {
              if (isEditorMode && onUpdateSettings) {
                onUpdateSettings({
                  ...settings,
                  actions: { ...settings.actions, showSearch: !settings.actions.showSearch }
                });
              } else {
                onOpenSearch();
              }
            }}
            className={`p-1 flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
              settings.actions.showSearch
                ? 'text-[#3D3229] hover:text-[#7A5B43]'
                : isEditorMode
                ? 'opacity-30 line-through text-gray-400'
                : 'hidden'
            }`}
            title={isEditorMode ? (settings.actions.showSearch ? "Toque para ocultar busca" : "Toque para ativar busca") : "Buscar"}
          >
            <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[1.75]" />
            <span className="hidden lg:inline text-[11px]">Buscar</span>
          </button>

          {/* 2. Account Action */}
          <button
            onClick={() => {
              if (isEditorMode && onUpdateSettings) {
                onUpdateSettings({
                  ...settings,
                  actions: { ...settings.actions, showAccount: !settings.actions.showAccount }
                });
              } else {
                onOpenAccount();
              }
            }}
            className={`p-1 flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
              settings.actions.showAccount
                ? 'text-[#3D3229] hover:text-[#7A5B43]'
                : isEditorMode
                ? 'opacity-30 line-through text-gray-400'
                : 'hidden'
            }`}
            title={isEditorMode ? (settings.actions.showAccount ? "Toque para ocultar conta" : "Toque para ativar conta") : "Conta"}
          >
            <User className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[1.75]" />
            <span className="hidden lg:inline text-[11px]">Conta</span>
          </button>

          {/* Ponto discreto entre os itens para acesso ao painel interno */}
          <button
            onClick={onToggleAdmin}
            className="p-2 -mx-1 flex items-center justify-center cursor-pointer focus:outline-none group touch-manipulation"
            title="Acesso interno"
            aria-label="Acesso interno"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black group-hover:scale-150 transition-transform block" />
          </button>

          {/* 3. Shopping Bag Action com Animação de Recepção do Coração Voador */}
          <button
            id="header-cart-button"
            onClick={() => {
              if (isEditorMode && onUpdateSettings) {
                onUpdateSettings({
                  ...settings,
                  actions: { ...settings.actions, showCart: !settings.actions.showCart }
                });
              } else {
                onOpenCart();
              }
            }}
            className={`relative flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-medium transition-all p-1.5 rounded-full ${
              settings.actions.showCart
                ? 'text-[#3D3229] hover:text-[#7A5B43]'
                : isEditorMode
                ? 'opacity-30 line-through text-gray-400'
                : 'hidden'
            } ${isCartBouncing ? 'scale-115 text-[#B85728]' : ''}`}
            title={isEditorMode ? (settings.actions.showCart ? "Toque para ocultar sacola" : "Toque para ativar sacola") : "Sacola"}
            aria-label={`Sacola com ${cartCount} itens`}
          >
            {/* Onda expansiva (ripple) quando o coração chega à sacola */}
            {isCartBouncing && (
              <span className="absolute -inset-1.5 rounded-full bg-[#B85728]/35 animate-ping pointer-events-none" />
            )}
            {isCartBouncing && (
              <span className="absolute -inset-2.5 rounded-full border border-[#FFD29D] opacity-75 animate-pulse pointer-events-none" />
            )}

            {/* Ícone da Sacola com gingado e pulso ao receber o item */}
            <div
              className={`relative transition-transform duration-300 ${
                isCartBouncing ? 'scale-125 -rotate-12 text-[#B85728]' : ''
              }`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[1.75]" />
            </div>

            <span className="hidden lg:inline text-[11px]">Sacola</span>

            {/* Badge com contagem e destaque expansivo na chegada */}
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1.5 min-w-[17px] h-4 px-1 rounded-full flex items-center justify-center font-sans font-bold leading-none transition-all duration-300 ${
                  isCartBouncing
                    ? 'scale-135 bg-[#B85728] text-white ring-2 ring-[#FFD29D] shadow-[0_0_12px_#FFA500]'
                    : 'bg-[#7A5B43] text-white text-[9px] shadow-xs'
                }`}
              >
                {cartCount}
              </span>
            )}

            {/* Notificação sutil flutuante "+1 ❤️" no momento exato da chegada */}
            {isCartBouncing && (
              <span className="absolute -top-6 -right-1 text-[11px] font-bold text-[#B85728] animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none flex items-center gap-0.5 select-none drop-shadow-xs whitespace-nowrap">
                +1 ❤️
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Slot Expansível legado (se fornecido) */}
      {headerEditorSlot}

      {/* Mobile Drawer Navigation com EDIÇÃO DIRETA e Redirecionamento para Linhas de Produtos */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F7F4EF] text-[#3D3229] border-b border-[#BFAE9C]/30 px-3 sm:px-4 py-4 sm:py-5 space-y-3 animate-in slide-in-from-top duration-200 shadow-md w-full max-w-full overflow-x-hidden">
          {isEditorMode ? (
            <div className="space-y-3 w-full max-w-full min-w-0">
              <div className="flex items-center justify-between pb-1 border-b border-[#BFAE9C]/20 text-[10px] uppercase tracking-widest text-[#7A5B43] font-semibold min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <Layers className="w-3.5 h-3.5 text-[#B85728] shrink-0" />
                  <span className="truncate">Menu & Linhas de Produtos</span>
                </span>
                <span className="shrink-0 text-[9.5px]">Toque para editar</span>
              </div>

              {/* Lista dos Itens do Menu editáveis diretamente */}
              <div className="space-y-2.5 max-h-[55vh] overflow-y-auto overflow-x-hidden pr-0.5 w-full max-w-full">
                {settings.navLinks.map((item, idx) => {
                  const tid = item.targetId || item.id;
                  const houseBadge = 
                    tid === 'velas' || tid === 'secao-velas'
                      ? { label: 'Casa I • Velas', badge: 'CASA I', bg: 'bg-amber-50 text-amber-900 border-amber-200' }
                      : tid === 'sabonetes' || tid === 'secao-sabonetes'
                      ? { label: 'Casa II • Sabonetes', badge: 'CASA II', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' }
                      : tid === 'croche' || tid === 'secao-croche'
                      ? { label: 'Casa III • Crochê', badge: 'CASA III', bg: 'bg-orange-50 text-orange-900 border-orange-200' }
                      : { label: `Item ${idx + 1}`, badge: 'SEÇÃO', bg: 'bg-stone-50 text-stone-800 border-stone-200' };

                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border transition-all space-y-2 w-full max-w-full min-w-0 overflow-hidden box-border ${
                        item.enabled ? 'bg-white border-[#BFAE9C]/40 shadow-xs' : 'bg-black/5 border-dashed border-gray-300 opacity-60'
                      }`}
                    >
                      {/* Linha 1: Tag da Casa Real + Input do Nome + Olho + Lixeira (se > 3) */}
                      <div className="flex items-center gap-1.5 w-full min-w-0">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded border shrink-0 ${houseBadge.bg}`}>
                          {houseBadge.badge}
                        </span>

                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleUpdateNavItem(item.id, e.target.value)}
                          className="min-w-0 flex-1 font-serif text-sm sm:text-base text-[#3D3229] bg-transparent outline-none px-1 py-0.5 border-b border-transparent focus:border-[#7A5B43] truncate font-medium"
                          placeholder="Nome do Item no Menu"
                        />

                        {/* Alternar visibilidade no site */}
                        <button
                          onClick={() => handleToggleNavItem(item.id)}
                          className={`p-1.5 rounded hover:bg-black/5 shrink-0 transition-colors ${item.enabled ? 'text-[#7A5B43]' : 'text-gray-400'}`}
                          title={item.enabled ? "Ocultar da navegação pública" : "Mostrar na navegação pública"}
                        >
                          {item.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Excluir item (apenas se houver itens excedentes para limpeza) */}
                        {settings.navLinks.length > 3 && (
                          <button
                            onClick={() => handleDeleteNavItem(item.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 shrink-0 transition-colors"
                            title="Remover item excedente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Linha 2: Conexão Real com a Home (Redirecionamento) */}
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-1.5 pt-1.5 border-t border-[#F2ECE3] text-[11px] w-full min-w-0">
                        <span className="text-[#8C7561] font-medium shrink-0 flex items-center gap-1 text-[10px] sm:text-[10.5px]">
                          <CornerDownRight className="w-3 h-3 text-[#B85728]" />
                          <span>Conectado a:</span>
                        </span>
                        <select
                          value={item.targetId || item.id}
                          onChange={(e) => handleUpdateNavTarget(item.id, e.target.value)}
                          className="min-w-0 flex-1 w-full bg-[#FAF8F5] border border-[#D8CDBC] rounded px-2 py-1 text-[11px] text-[#3D3229] font-medium outline-none focus:border-[#7A5B43] truncate max-w-full"
                        >
                          <optgroup label="3 Casas Reais da Home">
                            <option value="velas">Casa I: Velas Aromáticas (#secao-velas)</option>
                            <option value="sabonetes">Casa II: Sabonetes Botânicos (#secao-sabonetes)</option>
                            <option value="croche">Casa III: Peças em Crochê (#secao-croche)</option>
                          </optgroup>
                          <optgroup label="Outras Seções da Home">
                            <option value="tres-casas">Todas as Casas (Vitrine Completa)</option>
                            <option value="secao-criadora">A Criadora (Dona da Maison)</option>
                            <option value="secao-carrinho-casa">Boutique & Entrega</option>
                            <option value="hero">Topo da Página (Início)</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botão Principal: Sincronizar com as 3 Casas Reais da Home */}
              <div className="pt-1 w-full min-w-0">
                <button
                  onClick={handleSyncThreeRealHouses}
                  className="py-2.5 px-3 border border-[#7A5B43] bg-[#7A5B43] hover:bg-[#654832] active:bg-[#563C28] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all shadow-xs w-full"
                  title="Restaura os 3 itens originais conectados às Casas reais (Velas, Sabonetes e Crochê)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sincronizar com as 3 Casas Reais da Home</span>
                </button>
              </div>
            </div>
          ) : (
            navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.targetId || item.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left font-serif text-lg py-2.5 border-b border-[#BFAE9C]/15 text-[#3D3229] hover:text-[#6F775C] transition-colors"
              >
                {item.label}
              </button>
            ))
          )}
          
          <div className="pt-2 flex items-center justify-between border-t border-[#BFAE9C]/20 text-xs uppercase tracking-widest text-[#7A5B43]">
            {settings.actions.showSearch && (
              <button onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}>Buscar</button>
            )}
            {settings.actions.showAccount && (
              <button onClick={() => { onOpenAccount(); setMobileMenuOpen(false); }}>Conta</button>
            )}
            {settings.actions.showCart && (
              <button onClick={() => { onOpenCart(); setMobileMenuOpen(false); }}>Sacola ({cartCount})</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
