import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Product, ProductLine } from '../types';
import { FEATURED_PRODUCTS } from '../data/mockData';
import { triggerFlyHeartToCart } from './FlyingHeartCartAnimation';
import { IntelligentProductPills } from './IntelligentProductPills';
import { RecentlySoldOutBadge } from './RecentlySoldOutBadge';
import { deleteProductFromSupabase, uploadImageToSupabase } from '../lib/supabase';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Eye,
  Check,
  Sparkles,
  Plus,
  Play,
  X,
  ChevronUp,
  Gift,
  ShieldCheck,
  Flame,
  Droplets,
  Scissors,
  Trash2,
  Upload,
  Sliders,
  Edit3,
  ArrowUp,
  ArrowDown,
  Layers,
  Image as ImageIcon,
  FileText,
  Tag,
  ListPlus,
  Film,
  Info
} from 'lucide-react';

interface HorizontalProductsShowcaseProps {
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  totalCartCount?: number;
  onOpenCart?: () => void;
  productLines?: ProductLine[];
  onUpdateProductLines?: (lines: ProductLine[]) => void;
  products?: Product[];
  onUpdateProducts?: (products: Product[]) => void;
  isEditorMode?: boolean;
}

// ============================================================================
// AUXILIARES DE MÍDIA UNIFICADA (FOTOS E VÍDEOS JUNTOS)
// ============================================================================
export const isVideoUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase().trim();
  return (
    lower.startsWith('data:video/') ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.includes('youtube.com') ||
    lower.includes('vimeo.com') ||
    lower.includes('/video/')
  );
};

// ============================================================================
// COMPONENTE DE ILHÓS METÁLICO ARTESANAL (RIVET / EYELET DE ALTA COSTURA)
// ============================================================================
const MetallicEyelet: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <div className={`relative ${className} rounded-full flex items-center justify-center shrink-0`}>
    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#E2DDD5] via-[#B8ADA0] to-[#8E8274] p-[1.5px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1.5px_3px_rgba(0,0,0,0.18)]">
      <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#D6CDC2] to-[#F7F5F0] flex items-center justify-center p-[2px]">
        <div className="w-full h-full rounded-full bg-[#2A241F] shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.7)]" />
      </div>
    </div>
  </div>
);

// Definição das Categorias / Casas
export interface CategoryConfig {
  id: string;
  roman: string;
  housePrefix?: string; // ex: 'CASA', 'LINHA', 'COLEÇÃO'
  maisonTitle?: string; // ex: 'MAISON ENTRELAÇO', 'ATELIER BOTÂNICO'
  mainTitle: string;
  subTitle: string;
  watermarkWords: [string, string];
  defaultBadge1: string;
  defaultBadge2: string;
  bgColor: string;
  fadeColor: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'velas',
    roman: 'I',
    housePrefix: 'CASA',
    maisonTitle: 'MAISON ENTRELAÇO',
    mainTitle: 'O aroma rico',
    subTitle: 'Velas aromáticas',
    watermarkWords: ['O AROMA', 'VERSAILLES'],
    defaultBadge1: 'Cera 100% Vegetal',
    defaultBadge2: 'Pavio duplo nobre',
    bgColor: 'from-[#FAF8F5] via-[#FAF6F0] to-[#F5EFE6]',
    fadeColor: '#FAF8F5'
  },
  {
    id: 'sabonetes',
    roman: 'II',
    housePrefix: 'CASA',
    maisonTitle: 'MAISON ENTRELAÇO',
    mainTitle: 'O cuidado',
    subTitle: 'Sabonetes botânicos',
    watermarkWords: ['O CUIDADO', 'DA PELE'],
    defaultBadge1: 'Cold Process',
    defaultBadge2: 'Óleos Puros',
    bgColor: 'from-[#F5EFE6] via-[#F4EFE6] to-[#EFE7DC]',
    fadeColor: '#F5EFE6'
  },
  {
    id: 'croche',
    roman: 'III',
    housePrefix: 'CASA',
    maisonTitle: 'MAISON ENTRELAÇO',
    mainTitle: 'A trama',
    subTitle: 'Peças em crochê',
    watermarkWords: ['A TRAMA', 'HERANÇA'],
    defaultBadge1: 'Algodão Nobre',
    defaultBadge2: 'Ponto Manual',
    bgColor: 'from-[#EFE7DC] via-[#F6F1EA] to-[#FAF8F5]',
    fadeColor: '#EFE7DC'
  }
];

const LUXURY_PALETTES = [
  {
    id: 'areia',
    name: 'Areia & Pérola (Clássica)',
    bgColor: 'from-[#FAF8F5] via-[#FAF6F0] to-[#F5EFE6]',
    fadeColor: '#FAF8F5',
    preview: 'bg-gradient-to-r from-[#FAF8F5] to-[#F5EFE6]'
  },
  {
    id: 'linho',
    name: 'Linho Suave Nobre',
    bgColor: 'from-[#F5EFE6] via-[#F4EFE6] to-[#EFE7DC]',
    fadeColor: '#F5EFE6',
    preview: 'bg-gradient-to-r from-[#F5EFE6] to-[#EFE7DC]'
  },
  {
    id: 'trama',
    name: 'Trama Artesanal Quente',
    bgColor: 'from-[#EFE7DC] via-[#F6F1EA] to-[#FAF8F5]',
    fadeColor: '#EFE7DC',
    preview: 'bg-gradient-to-r from-[#EFE7DC] to-[#FAF8F5]'
  },
  {
    id: 'dourado',
    name: 'Linho Dourado & Mel',
    bgColor: 'from-[#FAF6F0] via-[#F3EADF] to-[#ECE1D3]',
    fadeColor: '#FAF6F0',
    preview: 'bg-gradient-to-r from-[#FAF6F0] to-[#ECE1D3]'
  },
  {
    id: 'botanica',
    name: 'Verde Botânico Suave',
    bgColor: 'from-[#F4F6F2] via-[#EBF0E6] to-[#E2EAD9]',
    fadeColor: '#F4F6F2',
    preview: 'bg-gradient-to-r from-[#F4F6F2] to-[#E2EAD9]'
  }
];

// ============================================================================
// BOTÃO INTELIGENTE DE PROMOÇÃO: LEVE 3 GANHE 14% OFF
// ============================================================================
interface PromoActionButtonProps {
  product: Product;
  totalCartCount: number;
  onAddToCart: (product: Product) => void;
  onOpenCart?: () => void;
}

const PromoActionButton: React.FC<PromoActionButtonProps> = ({
  product,
  totalCartCount,
  onAddToCart,
  onOpenCart
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const [plusAdded, setPlusAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const comboCount = totalCartCount % 3;
  const hasPromo = totalCartCount >= 3;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (hasPromo && onOpenCart) {
      onOpenCart();
      return;
    }

    if (buttonRef.current) {
      triggerFlyHeartToCart(buttonRef.current);
    }

    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  const handleQuickAddMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (buttonRef.current) {
      triggerFlyHeartToCart(buttonRef.current);
    }
    onAddToCart(product);
    setPlusAdded(true);
    setTimeout(() => setPlusAdded(false), 600);
  };

  return (
    <div className="flex items-center justify-center gap-2 w-full max-w-[340px] mx-auto">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`group relative flex-1 flex items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${
          hasPromo
            ? 'bg-gradient-to-r from-[#211E1B] via-[#352F2A] to-[#211E1B] text-white border border-[#FFE29A]/40'
            : 'bg-[#211E1B] hover:bg-[#352F2A] text-white border border-[#423932]'
        }`}
      >
        <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
          {comboCount === 2 ? (
            <div className="flex items-center gap-0.5 animate-pulse">
              <Plus className="w-3.5 h-3.5 text-[#FFDE9E] animate-bounce" />
              <ShoppingBag className="w-3.5 h-3.5 text-[#E0D5C7]" />
            </div>
          ) : (
            <ShoppingBag className="w-4 h-4 text-[#E0D5C7] group-hover:scale-105 transition-transform" />
          )}
        </div>

        <div className="flex items-center justify-center flex-1 text-center whitespace-nowrap px-1">
          {justAdded ? (
            <span className="font-semibold text-white">Item Adicionado!</span>
          ) : hasPromo ? (
            <span className="font-bold tracking-tight text-[11.5px] sm:text-[12.5px] text-[#FFF9F4]">
              14% OFF ATIVADO!
            </span>
          ) : comboCount === 2 ? (
            <div className="flex items-center gap-1 text-[11.5px]">
              <span>Soma +1!</span>
              <span className="font-semibold text-[#FFE29A]">(2/3)</span>
            </div>
          ) : comboCount === 1 ? (
            <div className="flex items-center gap-1 text-[11.5px]">
              <span>Combo (1/3)</span>
              <span className="text-white/75 text-[10.5px]">• +2 p/ 14%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11.5px]">
              <span>Adicionar</span>
              <span className="text-white/70">• R$ {product.price}</span>
            </div>
          )}
        </div>

        <div className="flex items-center shrink-0">
          {hasPromo ? (
            <span className="px-2 sm:px-2.5 py-1 rounded-full bg-white/20 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs text-white">
              Fechar Compra →
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-tight ${
              comboCount > 0 ? 'bg-[#E5A855]/30 text-[#FFE29A]' : 'bg-white/10 text-white/80'
            }`}>
              {comboCount === 0 ? 'Leve 3 c/ 14%' : `${comboCount}/3 itens`}
            </span>
          )}
        </div>
      </button>

      {hasPromo && (
        <button
          onClick={handleQuickAddMore}
          aria-label="Adicionar mais uma unidade desta criação à sacola"
          title="Adicionar mais 1 unidade (+1)"
          className="relative w-[46px] h-[46px] sm:w-[48px] sm:h-[48px] rounded-full shrink-0 flex items-center justify-center bg-[#2A231C] hover:bg-[#382E25] active:bg-[#1A1612] text-[#FFD29D] border border-[#FFD29D]/40 shadow-md transition-all duration-200 active:scale-90 animate-in zoom-in-75 overflow-hidden cursor-pointer"
        >
          {plusAdded && (
            <span className="absolute inset-0 bg-[#FFD29D]/40 animate-ping rounded-full pointer-events-none" />
          )}
          {plusAdded ? (
            <span className="text-xs font-bold text-[#A8FF9E] animate-in zoom-in-50">
              +1
            </span>
          ) : (
            <Plus className="w-5 h-5 text-[#FFD29D] transition-transform hover:scale-110" />
          )}
          <span className="sr-only">Adicionar mais uma</span>
        </button>
      )}
    </div>
  );
};

// ============================================================================
// CARD INDIVIDUAL HORIZONTAL COM EXPANSÃO DIRETA NO PRÓPRIO CARD & EDIÇÃO
// ============================================================================
interface ProductCardShowcaseProps {
  product: Product;
  config: CategoryConfig;
  onAddToCart: (product: Product) => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
  totalCartCount?: number;
  onOpenCart?: () => void;
  isEditorMode?: boolean;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

const SingleProductShowcase: React.FC<ProductCardShowcaseProps> = ({
  product,
  config,
  onAddToCart,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
  totalCartCount = 0,
  onOpenCart,
  isEditorMode = false,
  onEditProduct,
  onDeleteProduct
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsExpanded(false);
    setActiveMediaIndex(0);
  }, [product.id]);

  const mediaItems: { type: 'image' | 'video'; url: string; label: string }[] = useMemo(() => {
    const list: { type: 'image' | 'video'; url: string; label: string }[] = [];
    if (product.galleryImages && product.galleryImages.length > 0) {
      product.galleryImages.forEach((img, idx) => {
        if (!img || !img.trim()) return;
        const isVid = isVideoUrl(img) || (product.videoUrl && product.videoUrl === img);
        list.push({
          type: isVid ? 'video' : 'image',
          url: img.trim(),
          label: isVid ? `Vídeo ${idx + 1}` : `Foto ${idx + 1}`
        });
      });
    } else {
      if (product.primaryImage) {
        const isVid = isVideoUrl(product.primaryImage);
        list.push({
          type: isVid ? 'video' : 'image',
          url: product.primaryImage.trim(),
          label: isVid ? 'Vídeo Principal' : 'Foto Principal'
        });
      }
      if (product.secondaryImage && product.secondaryImage !== product.primaryImage) {
        const isVid = isVideoUrl(product.secondaryImage);
        list.push({
          type: isVid ? 'video' : 'image',
          url: product.secondaryImage.trim(),
          label: isVid ? 'Vídeo Detalhe' : 'Foto Detalhe'
        });
      }
    }

    if (product.videoUrl && !list.some((m) => m.url === product.videoUrl)) {
      list.push({
        type: 'video',
        url: product.videoUrl.trim(),
        label: 'Vídeo do Atelier'
      });
    }

    if (list.length === 0) {
      list.push({
        type: 'image',
        url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
        label: 'Foto Principal'
      });
    }

    return list;
  }, [product.galleryImages, product.primaryImage, product.secondaryImage, product.videoUrl]);

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];
  const firstMedia = mediaItems[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      if (isExpanded) {
        setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
      } else {
        onNext();
      }
    } else if (diff < -45) {
      if (isExpanded) {
        setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
      } else {
        onPrev();
      }
    }
    touchStartX.current = null;
  };

  const watermarkWordTop = config.watermarkWords?.[0] || config.mainTitle?.toUpperCase() || 'O AROMA';
  const watermarkWordBottom = config.watermarkWords?.[1] || config.subTitle?.toUpperCase() || 'VERSAILLES';

  const badgeTopLeft = product.details?.[0] || config.defaultBadge1;
  const badgeRight = product.details?.[1] || config.defaultBadge2;

  return (
    <div
      className="relative w-full max-w-3xl mx-auto px-1 sm:px-4 transition-all duration-500"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative bg-white/80 backdrop-blur-md rounded-[22px] sm:rounded-[40px] px-2.5 sm:px-8 md:px-10 py-6 sm:py-9 md:py-11 border border-[#E7DFD4] shadow-[0_20px_50px_rgba(40,32,24,0.07)] overflow-hidden w-full transition-all duration-500">
        
        {/* Linha pontilhada horizontal superior com ilhós metálicos */}
        <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between pointer-events-none z-20">
          <MetallicEyelet className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <div className="flex-1 mx-3 border-t border-dashed border-[#C7B7A3]/70" />
          <MetallicEyelet className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
        </div>

        {/* Linhas pontilhadas verticais decorativas laterais */}
        <div className="absolute top-8 sm:top-12 bottom-8 sm:bottom-12 left-4 sm:left-8 border-l border-dashed border-[#C7B7A3]/50 pointer-events-none" />
        <div className="absolute top-8 sm:top-12 bottom-8 sm:bottom-12 right-4 sm:right-8 border-r border-dashed border-[#C7B7A3]/50 pointer-events-none" />

        {/* Linha pontilhada horizontal inferior com ilhós metálicos */}
        <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 flex items-center justify-between pointer-events-none z-20">
          <MetallicEyelet className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <div className="flex-1 mx-3 border-t border-dashed border-[#C7B7A3]/70" />
          <MetallicEyelet className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
        </div>

        {/* Modo Editor: Barra Superior com Alternador dos Dois Modos e Botões de Ação */}
        {isEditorMode && (
          <div className="relative z-30 mb-4 pb-3 border-b border-[#E3DBD0]/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-full border border-[#D8CDBC] shadow-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7561] px-2">
                Modo:
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isExpanded
                    ? 'bg-[#2C231C] text-white shadow-xs'
                    : 'text-[#6B5C4E] hover:text-[#211E1B] hover:bg-[#EDE6DC]'
                }`}
                title="Visualizar no Modo 1: Card Poético / Prancha"
              >
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Modo 1 • Card Poético</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isExpanded
                    ? 'bg-[#2C231C] text-white shadow-xs'
                    : 'text-[#6B5C4E] hover:text-[#211E1B] hover:bg-[#EDE6DC]'
                }`}
                title="Visualizar no Modo 2: Ficha Técnica e Saber-Fazer"
              >
                <FileText className="w-3 h-3 text-[#C5A059]" />
                <span>Modo 2 • Ficha Técnica</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct?.(product);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#2C231C] text-[11px] font-semibold tracking-wide border border-[#C7B7A3] shadow-md transition-all cursor-pointer hover:border-[#7A5B43]"
                title={`Editar este produto (${isExpanded ? 'Modo 2: Ficha Técnica' : 'Modo 1: Card Poético'})`}
              >
                <span className="lottie-beacon-dot">
                  <span className="lottie-beacon-wave" />
                  <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core" />
                </span>
                <Edit3 className="w-3.5 h-3.5 text-[#7A5B43]" />
                <span>Editar Produto</span>
              </button>

              {totalCount > 1 && onDeleteProduct && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProduct(product.id);
                  }}
                  className="p-1.5 rounded-full bg-white/95 hover:bg-red-50 text-red-500 hover:text-red-700 border border-red-200 shadow-sm transition-colors cursor-pointer"
                  title="Excluir este produto desta seção"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* CASO EXPANDIDO: DETALHES INLINE NO PRÓPRIO CARD */}
        {isExpanded ? (
          <div className="relative z-10 w-full animate-in fade-in zoom-in-95 duration-400 pt-3 sm:pt-4 pb-5 sm:pb-6">
            
            {/* Barra de Topo do Card Expandido com Botão de Recolher */}
            <div className="flex items-center justify-between gap-3 border-b border-[#E3DBD0] pb-3 sm:pb-4 mb-4 sm:mb-6">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#8C7561] block">
                  {product.categoryLabel || config.subTitle}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#211E1B] font-medium leading-tight">
                  {product.name}
                </h3>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium text-[#6B5C4E] hover:text-[#211E1B] bg-[#F2EDE4] hover:bg-[#E8E0D4] border border-[#D8CDBC] transition-all shadow-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Voltar ao Card</span>
              </button>
            </div>

            {/* Imagem / Vídeo em destaque */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[360px] sm:max-h-[420px] rounded-[18px] sm:rounded-[26px] overflow-hidden bg-[#ECE5DB] shadow-md border border-[#E3DBD0]">
              {currentMedia.type === 'video' ? (
                <video
                  src={currentMedia.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentMedia.url}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-500"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide flex items-center gap-1.5">
                {currentMedia.type === 'video' ? (
                  <>
                    <Play className="w-3 h-3 fill-white text-white" />
                    <span>Vídeo Atelier</span>
                  </>
                ) : (
                  <span>
                    {activeMediaIndex + 1} de {mediaItems.length}
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-white/95 text-[#211E1B] text-xs font-semibold shadow-md border border-[#E3DBD0]">
                R$ {product.price}
              </div>

              {product.recentlySoldOut && (
                <div className="absolute bottom-3 left-3 z-20">
                  <RecentlySoldOutBadge size="sm" />
                </div>
              )}

              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-white/80 hover:bg-white text-[#211E1B] flex items-center justify-center shadow-md backdrop-blur-sm transition-transform active:scale-90 cursor-pointer"
                    aria-label="Mídia anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-white/80 hover:bg-white text-[#211E1B] flex items-center justify-center shadow-md backdrop-blur-sm transition-transform active:scale-90 cursor-pointer"
                    aria-label="Próxima mídia"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Mídias em Miniatura */}
            {mediaItems.length > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3.5 sm:mt-4 overflow-x-auto py-1">
                {mediaItems.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeMediaIndex === idx
                        ? 'border-[#211E1B] ring-2 ring-[#211E1B]/20 scale-105 shadow-sm'
                        : 'border-[#E3DBD0] opacity-70 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-black relative flex items-center justify-center">
                        <video
                          src={media.url}
                          muted
                          playsInline
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={media.url}
                        alt=""
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
                        }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* História e Detalhes do Produto */}
            <div className="mt-5 sm:mt-6 bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E7DFD4]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C7561] mb-2">
                Autoria & Saber-Fazer
              </h4>
              <p className="text-xs sm:text-sm text-[#4A3E34] leading-relaxed">
                {product.fullStory || product.shortStory}
              </p>

              {product.details && product.details.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.details.map((detail, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-white text-[10.5px] sm:text-xs text-[#594B3F] font-medium border border-[#E3DBD0] shadow-2xs"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Botão de Compra no Card Expandido */}
            <div className="mt-5 flex justify-center">
              <PromoActionButton
                product={product}
                totalCartCount={totalCartCount}
                onAddToCart={onAddToCart}
                onOpenCart={onOpenCart}
              />
            </div>

          </div>
        ) : (
          /* CASO PADRÃO FECHADO: VISUAL ESCULTURAL DE LUXO */
          <>
            <div className="relative flex items-center justify-center pt-6 sm:pt-9 pb-3 sm:pb-5 my-2 sm:my-3">
              
              {/* Marca d'água monumental de fundo ("Frases atrás") */}
              <div className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none select-none overflow-hidden z-0 -top-1 sm:-top-2">
                <span className="font-sans text-[44px] xs:text-[58px] sm:text-[84px] md:text-[104px] font-black tracking-tight text-[#BFAFA0]/70 sm:text-[#BFAFA0]/65 uppercase leading-[0.9] whitespace-nowrap">
                  {watermarkWordTop}
                </span>
                <span className="font-sans text-[44px] xs:text-[58px] sm:text-[84px] md:text-[104px] font-black tracking-tight text-[#BFAFA0]/40 sm:text-[#BFAFA0]/35 uppercase leading-[0.9] whitespace-nowrap mt-3 sm:mt-6">
                  {watermarkWordBottom}
                </span>
              </div>

              {/* Quadro Central do Produto */}
              <div className="relative z-10 w-full max-w-[270px] sm:max-w-[340px] md:max-w-[390px] aspect-square rounded-[22px] sm:rounded-[36px] overflow-visible flex items-center justify-center mt-2 sm:mt-4">
                
                {/* 1. BADGE FLUTUANTE SUPERIOR ESQUERDO (Dark Charcoal Pill) */}
                {badgeTopLeft && (
                  <div className="absolute -top-3 sm:-top-3.5 left-2 sm:left-3 z-30 bg-[#352E28] text-[#F9F6F0] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11.5px] font-medium tracking-tight shadow-[0_4px_14px_rgba(40,32,24,0.18)] border border-[#4A4038] flex items-center gap-1.5 max-w-[190px] sm:max-w-[230px]">
                    <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
                    <span className="truncate">{badgeTopLeft}</span>
                  </div>
                )}

                {/* Fotografia / Mídia Principal com moldura nobre */}
                <div 
                  className="relative w-full h-full rounded-[22px] sm:rounded-[36px] overflow-hidden bg-[#ECE5DB] shadow-[0_16px_36px_rgba(40,32,24,0.14)] border-2 sm:border-4 border-white cursor-pointer group"
                  onClick={() => setIsExpanded(true)}
                >
                  {firstMedia.type === 'video' ? (
                    <video
                      src={firstMedia.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={firstMedia.url}
                      alt={product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
                      }}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* 2. BADGE FLUTUANTE INSIDE PHOTO ON THE RIGHT SIDE (Frosted Charcoal Pill) */}
                  {badgeRight && (
                    <div className="absolute top-7 sm:top-10 right-2.5 sm:right-4 z-20 bg-[#352E28]/85 backdrop-blur-xs text-[#F9F6F0] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-tight shadow-md border border-white/20 flex items-center gap-1.5 max-w-[180px] sm:max-w-[220px]">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{badgeRight}</span>
                    </div>
                  )}

                  {/* Mídia Count Pill */}
                  {mediaItems.length > 1 && (
                    <div className="absolute bottom-3 right-3 z-20 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-xs font-medium flex items-center gap-1">
                      <span>+{mediaItems.length} mídias</span>
                    </div>
                  )}
                </div>

                {/* 3. BADGE FLUTUANTE INFERIOR CENTRAL (White Pill with Product Name) */}
                <div className="absolute -bottom-3 sm:-bottom-3.5 left-1/2 -translate-x-1/2 z-30 bg-white/98 text-[#2A241F] px-4 sm:px-6 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-tight shadow-[0_6px_18px_rgba(40,32,24,0.14)] border border-[#E3DBD0] whitespace-nowrap max-w-[90%] truncate">
                  {product.name}
                </div>

                {/* 4. SELO GIRATÓRIO NOBRE: UNIDADES ESGOTADAS HÁ POUCO TEMPO */}
                {product.recentlySoldOut && (
                  <div className="absolute -top-3 sm:-top-5 -right-3 sm:-right-5 z-40 animate-in zoom-in-75 duration-300">
                    <RecentlySoldOutBadge size="md" />
                  </div>
                )}
              </div>

              {/* Botões de navegação lateral (Setas) */}
              {totalCount > 1 && (
                <>
                  <button
                    onClick={onPrev}
                    aria-label="Produto anterior"
                    className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#211E1B] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-[#E3DBD0] transition-transform active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                  <button
                    onClick={onNext}
                    aria-label="Próximo produto"
                    className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#211E1B] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-[#E3DBD0] transition-transform active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                </>
              )}

            </div>

            {/* Frase Poética em Caligrafia e Grupo de Ações */}
            <div className="relative z-10 text-center mt-9 sm:mt-11 max-w-xl mx-auto">
              
              <p className="font-['Caveat'] text-lg sm:text-2xl md:text-[25px] text-[#3A2F25] leading-snug px-2 italic font-normal tracking-wide">
                "{product.shortStory || (product.fullStory ? product.fullStory.slice(0, 160) + '...' : 'Criação nobre concebida com maestria e tempo.')}"
              </p>

              <div className="mt-5 sm:mt-6 flex flex-col items-center justify-center gap-2.5 sm:gap-3">
                <PromoActionButton
                  product={product}
                  totalCartCount={totalCartCount}
                  onAddToCart={onAddToCart}
                  onOpenCart={onOpenCart}
                />

                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-full text-xs font-medium text-[#6B5C4E] hover:text-[#211E1B] hover:bg-white/80 transition-colors border border-[#E3DBD0]/80 shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8C7561]" />
                  <span>Ver Ficha Técnica Completa & Autoria</span>
                </button>
              </div>

              {totalCount > 1 && (
                <div className="flex items-center justify-center gap-2 mt-5">
                  {Array.from({ length: totalCount }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-6 bg-[#211E1B]'
                          : 'w-1.5 bg-[#B8ABA0]/40'
                      }`}
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: SEÇÕES HORIZONTAIS DINÂMICAS + GESTÃO DE PRODUTOS
// ============================================================================
export const HorizontalProductsShowcase: React.FC<HorizontalProductsShowcaseProps> = ({
  onAddToCart,
  totalCartCount = 0,
  onOpenCart,
  productLines,
  onUpdateProductLines,
  products = FEATURED_PRODUCTS,
  onUpdateProducts,
  isEditorMode = false
}) => {
  const linesToRender: CategoryConfig[] = (productLines && productLines.length > 0)
    ? productLines.map(l => ({
        id: l.id,
        roman: l.roman || 'IV',
        housePrefix: l.housePrefix || 'CASA',
        maisonTitle: l.maisonTitle || 'MAISON ENTRELAÇO',
        mainTitle: l.mainTitle,
        subTitle: l.subTitle,
        watermarkWords: l.watermarkWords || ['ATELIER', 'NOBRE'],
        defaultBadge1: l.defaultBadge1 || 'Feito à Mão',
        defaultBadge2: l.defaultBadge2 || 'Edição Rara',
        bgColor: l.bgColor || 'from-[#FAF8F5] via-[#F4ECE1] to-[#EBE2D5]',
        fadeColor: l.fadeColor || '#FAF8F5'
      }))
    : CATEGORIES;

  // Estado do índice ativo para cada categoria/linha
  const [activeIndices, setActiveIndices] = useState<Record<string, number>>({});

  // Modais de Criação & Edição
  const [editingSection, setEditingSection] = useState<CategoryConfig | null>(null);
  const [isNewSectionModalOpen, setIsNewSectionModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{ product: Product | null; categoryId: string; categoryTitle: string } | null>(null);

  // Refs para upload de imagens
  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  const handlePrev = (categoryId: string, total: number) => {
    setActiveIndices(prev => ({
      ...prev,
      [categoryId]: ((prev[categoryId] || 0) - 1 + total) % total
    }));
  };

  const handleNext = (categoryId: string, total: number) => {
    setActiveIndices(prev => ({
      ...prev,
      [categoryId]: ((prev[categoryId] || 0) + 1) % total
    }));
  };

  const handleSelectProduct = (categoryId: string, index: number) => {
    setActiveIndices(prev => ({
      ...prev,
      [categoryId]: index
    }));
  };

  // Reordenar Seção
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!onUpdateProductLines || !productLines) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= productLines.length) return;
    const updated = [...productLines];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onUpdateProductLines(updated);
  };

  // Excluir Seção
  const handleDeleteLine = (lineId: string) => {
    if (!onUpdateProductLines) return;
    const currentLines = productLines && productLines.length > 0 ? productLines : CATEGORIES;
    const updated = currentLines.filter(l => l.id !== lineId);
    onUpdateProductLines(updated);
    if (editingSection?.id === lineId) setEditingSection(null);
  };

  // Salvar Seção Editada
  const handleSaveSection = (updatedConfig: CategoryConfig) => {
    if (!onUpdateProductLines) return;
    const currentLines = (productLines && productLines.length > 0) ? productLines : CATEGORIES;
    const updated = currentLines.map(l => l.id === updatedConfig.id ? {
      ...l,
      roman: updatedConfig.roman,
      housePrefix: updatedConfig.housePrefix,
      maisonTitle: updatedConfig.maisonTitle,
      mainTitle: updatedConfig.mainTitle,
      subTitle: updatedConfig.subTitle,
      watermarkWords: updatedConfig.watermarkWords,
      defaultBadge1: updatedConfig.defaultBadge1,
      defaultBadge2: updatedConfig.defaultBadge2,
      bgColor: updatedConfig.bgColor,
      fadeColor: updatedConfig.fadeColor
    } : l);
    onUpdateProductLines(updated);
    setEditingSection(null);
  };

  // Criar Nova Seção Horizontal
  const handleCreateNewSection = (newConfig: Omit<CategoryConfig, 'fadeColor'> & { fadeColor?: string }) => {
    if (!onUpdateProductLines) return;
    const currentLines = (productLines && productLines.length > 0) ? productLines : CATEGORIES;
    const newLine: ProductLine = {
      id: newConfig.id,
      roman: newConfig.roman,
      housePrefix: newConfig.housePrefix || 'CASA',
      maisonTitle: newConfig.maisonTitle || 'MAISON ENTRELAÇO',
      mainTitle: newConfig.mainTitle,
      subTitle: newConfig.subTitle,
      watermarkWords: newConfig.watermarkWords,
      defaultBadge1: newConfig.defaultBadge1 || 'Tiragem Rara',
      defaultBadge2: newConfig.defaultBadge2 || 'Edição Autoral',
      bgColor: newConfig.bgColor,
      fadeColor: newConfig.fadeColor || '#FAF8F5'
    };
    onUpdateProductLines([...currentLines, newLine]);

    // Cria também um primeiro produto inicial elegante para a seção recém-nascida
    if (onUpdateProducts) {
      const initialNewProduct: Product = {
        id: `${newConfig.id}-item-1`,
        name: `${newConfig.subTitle} Signature`,
        category: newConfig.id,
        categoryLabel: newConfig.subTitle,
        price: 195,
        shortStory: `Criação autoral inaugurando a nova coleção ${newConfig.subTitle}.`,
        fullStory: `Peça concebida com nobreza de materiais e formulação manual exclusiva da Maison. Desenvolvida para elevar a atmosfera do seu lar.`,
        primaryImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
        secondaryImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85',
        details: [newConfig.defaultBadge1 || 'Feito à Mão', newConfig.defaultBadge2 || 'Tiragem Única']
      };
      onUpdateProducts([...products, initialNewProduct]);
    }

    setIsNewSectionModalOpen(false);
  };

  // Salvar Produto (Novo ou Editado)
  const handleSaveProduct = (prodData: Product) => {
    if (!onUpdateProducts) return;
    const exists = products.some(p => p.id === prodData.id);
    let updatedList: Product[];
    if (exists) {
      updatedList = products.map(p => p.id === prodData.id ? prodData : p);
    } else {
      updatedList = [...products, prodData];
    }
    onUpdateProducts(updatedList);

    // Ajusta o índice ativo da categoria para focar no produto criado ou alterado
    const categoryProds = updatedList.filter(p => p.category === prodData.category);
    const targetIdx = categoryProds.findIndex(p => p.id === prodData.id);
    if (targetIdx !== -1) {
      setActiveIndices(prev => ({
        ...prev,
        [prodData.category]: targetIdx
      }));
    }

    setEditingProduct(null);
  };

  // Excluir Produto
  const handleDeleteProduct = (productId: string) => {
    if (!onUpdateProducts) return;
    const updated = products.filter(p => p.id !== productId);
    onUpdateProducts(updated);
    deleteProductFromSupabase(productId).catch(console.warn);
    setEditingProduct(null);
  };

  return (
    <div id="secoes-produtos" className="w-full">
      {linesToRender.map((category, sectionIndex) => {
        // Filtra os produtos da categoria
        const categoryProducts = products.filter(p => p.category === category.id);
        
        // Se não houver produtos e não estiver no modo editor, oculta a seção vazia
        if (categoryProducts.length === 0 && !isEditorMode) {
          return null;
        }

        const currentIndex = activeIndices[category.id] || 0;
        const safeCurrentIndex = currentIndex < categoryProducts.length ? currentIndex : 0;
        const currentProduct = categoryProducts[safeCurrentIndex] || null;

        return (
          <section
            key={category.id}
            id={`secao-${category.id}`}
            className={`relative w-full bg-gradient-to-b ${category.bgColor} text-[#211E1B] py-10 sm:py-16 md:py-20 px-1.5 sm:px-4 md:px-8 overflow-hidden select-none border-none`}
          >
            {/* Header da Seção */}
            <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-10 px-2">
              
              {/* Tag Superior com Prefixo, Número e Nome da Maison (Editável) */}
              <div className="inline-flex items-center flex-wrap justify-center gap-2 text-[10.5px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#8C7561] mb-2.5">
                <button
                  type="button"
                  onClick={() => isEditorMode && setEditingSection(category)}
                  className={`inline-flex items-center gap-1.5 transition-all ${
                    isEditorMode
                      ? 'cursor-pointer hover:text-[#211E1B] hover:bg-white/90 px-2.5 py-1 rounded-full border border-[#BFAE9C]/40 bg-white/40 shadow-2xs hover:shadow-xs active:scale-95'
                      : 'cursor-default'
                  }`}
                  title={isEditorMode ? "Clique para editar Casa, Número e Nome da Maison" : undefined}
                >
                  <span>{category.housePrefix || 'CASA'} {category.roman}</span>
                  <span>•</span>
                  <span>{category.maisonTitle || 'MAISON ENTRELAÇO'}</span>
                  {isEditorMode && (
                    <Edit3 className="w-3 h-3 text-[#7A5B43] opacity-70 ml-0.5" />
                  )}
                </button>
                
                {isEditorMode && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-[#7A5B43]/15 text-[#7A5B43] text-[9.5px] font-mono tracking-normal" title="ID de âncora">
                    #secao-{category.id}
                  </span>
                )}

                {isEditorMode && (
                  <div className="inline-flex items-center gap-1 ml-2">
                    <button
                      onClick={() => setEditingSection(category)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-[#7A5B43] text-[9.5px] font-semibold border border-[#BFAE9C]/50 shadow-xs cursor-pointer transition-colors hover:scale-105 active:scale-95"
                      title="Configurar Seção (Casa, Maison, Títulos, Cores, Palavras de Fundo)"
                    >
                      <Sliders className="w-3 h-3 text-[#7A5B43]" />
                      <span>Configurar</span>
                    </button>

                    {linesToRender.length > 1 && (
                      <>
                        <button
                          onClick={() => handleMoveSection(sectionIndex, 'up')}
                          disabled={sectionIndex === 0}
                          className="p-1 rounded-full bg-white/80 hover:bg-white text-[#7A5B43] disabled:opacity-30 cursor-pointer"
                          title="Mover seção para cima"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(sectionIndex, 'down')}
                          disabled={sectionIndex === linesToRender.length - 1}
                          className="p-1 rounded-full bg-white/80 hover:bg-white text-[#7A5B43] disabled:opacity-30 cursor-pointer"
                          title="Mover seção para baixo"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </>
                    )}

                    {linesToRender.length > 1 && (
                      <button
                        onClick={() => handleDeleteLine(category.id)}
                        className="p-1 rounded-full bg-white/80 hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remover esta seção"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Título Principal e Subtítulo */}
              <h2 className="font-serif text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-semibold sm:font-bold text-[#1F1914] tracking-tight leading-none">
                {category.mainTitle}
              </h2>
              <p className="font-sans text-base xs:text-lg sm:text-xl md:text-2xl text-[#5E4C3C] font-extrabold tracking-[0.22em] uppercase mt-2.5 sm:mt-3.5">
                {category.subTitle}
              </p>

              {/* Seletor Inteligente em Linha Única */}
              <div className="mt-4 sm:mt-5">
                <IntelligentProductPills
                  products={categoryProducts}
                  currentIndex={safeCurrentIndex}
                  onSelect={(idx) => handleSelectProduct(category.id, idx)}
                  fadeColor={category.fadeColor}
                  categoryTitle={category.subTitle}
                />
              </div>

              {/* Botão para Adicionar Novo Produto nesta Seção (Modo Editor) */}
              {isEditorMode && (
                <div className="mt-3.5 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setEditingProduct({
                      product: null,
                      categoryId: category.id,
                      categoryTitle: category.subTitle || category.mainTitle
                    })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#2C231C] text-[10.5px] sm:text-[11.5px] font-semibold tracking-wide border border-[#C7B7A3] shadow-xs transition-all cursor-pointer hover:border-[#7A5B43]"
                  >
                    <span className="lottie-beacon-dot">
                      <span className="lottie-beacon-wave" />
                      <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core" />
                    </span>
                    <Plus className="w-3.5 h-3.5 text-[#7A5B43]" />
                    <span>Adicionar Produto em {category.subTitle}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Apresentação Horizontal do Produto ou Estado Vazio */}
            {currentProduct ? (
              <SingleProductShowcase
                product={currentProduct}
                config={category}
                onAddToCart={onAddToCart}
                onPrev={() => handlePrev(category.id, categoryProducts.length)}
                onNext={() => handleNext(category.id, categoryProducts.length)}
                currentIndex={safeCurrentIndex}
                totalCount={categoryProducts.length}
                totalCartCount={totalCartCount}
                onOpenCart={onOpenCart}
                isEditorMode={isEditorMode}
                onEditProduct={(p) => setEditingProduct({
                  product: p,
                  categoryId: category.id,
                  categoryTitle: category.subTitle || category.mainTitle
                })}
                onDeleteProduct={handleDeleteProduct}
              />
            ) : isEditorMode ? (
              <div className="max-w-xl mx-auto my-6 p-8 rounded-2xl bg-white/80 border border-dashed border-[#BFAE9C]/70 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                <p className="text-xs sm:text-sm text-[#7A695B] font-medium">
                  Nenhum produto cadastrado nesta coleção ({category.subTitle || category.mainTitle}).
                </p>
                <button
                  type="button"
                  onClick={() => setEditingProduct({
                    product: {
                      id: `prod-${Date.now()}`,
                      name: `Nova Peça ${category.subTitle || ''}`.trim(),
                      category: category.id,
                      categoryLabel: category.subTitle || 'Artesanal',
                      price: 180,
                      shortStory: 'Descrição breve da peça.',
                      fullStory: 'História autoral completa da peça.',
                      primaryImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
                      secondaryImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85',
                      details: [category.defaultBadge1 || 'Feito à Mão', category.defaultBadge2 || 'Edição Limitada']
                    },
                    categoryId: category.id,
                    categoryTitle: category.subTitle || category.mainTitle,
                    isNew: true
                  })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs font-semibold shadow-sm cursor-pointer transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4 text-[#FFE29A]" />
                  <span>+ Adicionar Primeiro Produto</span>
                </button>
              </div>
            ) : null}

          </section>
        );
      })}

      {/* ===================================================================== */}
      {/* BOTÃO PRINCIPAL DE ADICIONAR NOVA SEÇÃO HORIZONTAL (MODO EDITOR)       */}
      {/* ===================================================================== */}
      {isEditorMode && (
        <div className="w-full py-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-[#FAF8F5]/80 border-t border-dashed border-[#BFAE9C]/50">
          <button
            type="button"
            onClick={() => setIsNewSectionModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2C241E] hover:bg-[#3D3229] active:bg-[#1A1612] text-[#FFF9F4] text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-xl border border-[#FFE29A]/40 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span className="lottie-beacon-dot">
              <span className="lottie-beacon-wave" />
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core" />
            </span>
            <Plus className="w-4 h-4 text-[#FFE29A]" />
            <span>+ Adicionar Nova Seção Horizontal (Categoria / Novidades)</span>
          </button>
          <p className="text-[11px] text-[#7A695B] mt-2.5 tracking-wide font-medium text-center">
            Crie novas categorias horizontais completas com prancha de alfaiataria, ilhós e carrossel de produtos
          </p>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CRIAR OU EDITAR PRODUTO NA SEÇÃO                                */}
      {/* ===================================================================== */}
      {editingProduct && (
        <ProductEditorModal
          editing={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL: CONFIGURAR SEÇÃO EXISTENTE                                     */}
      {/* ===================================================================== */}
      {editingSection && (
        <SectionEditorModal
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSection}
          onDelete={() => handleDeleteLine(editingSection.id)}
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL: CRIAR NOVA SEÇÃO HORIZONTAL                                    */}
      {/* ===================================================================== */}
      {isNewSectionModalOpen && (
        <NewSectionModal
          existingCount={linesToRender.length}
          onClose={() => setIsNewSectionModalOpen(false)}
          onCreate={handleCreateNewSection}
        />
      )}

    </div>
  );
};

// ============================================================================
// SUB-MODAL: EDITOR DE PRODUTOS COMPLETO (EDITA OS DOIS MODOS DE EXIBIÇÃO)
// ============================================================================
interface ProductEditorModalProps {
  editing: { product: Product | null; categoryId: string; categoryTitle: string };
  onClose: () => void;
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  editing,
  onClose,
  onSave,
  onDelete
}) => {
  const isEditingExisting = Boolean(editing.product);
  const prod = editing.product;

  // Controle de Visualização no Mobile (Formulário vs Prévia)
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  // Controle do Modo de Prévia (Modo 1 Card Poético vs Modo 2 Ficha Técnica)
  const [previewMode, setPreviewMode] = useState<'mode1' | 'mode2'>('mode1');
  const [previewActiveMediaIdx, setPreviewActiveMediaIdx] = useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Sanitizador de imagens com fallback robusto
  const sanitizeImageUrl = (url?: string): string => {
    if (!url || typeof url !== 'string' || !url.trim()) {
      return 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
    }
    const trimmed = url.trim();
    if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
    return 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
  };

  // --- 1. IDENTIFICAÇÃO & RÓTULO SUPERIOR ---
  const [categoryLabel, setCategoryLabel] = useState(
    prod?.categoryLabel || editing.categoryTitle || 'Vela Aromática em Porcelana'
  );
  const [name, setName] = useState(prod?.name || '');
  const [price, setPrice] = useState<number>(prod?.price || 180);
  const [recentlySoldOut, setRecentlySoldOut] = useState<boolean>(Boolean(prod?.recentlySoldOut));

  // --- 2. CENTRAL DE MÍDIAS UNIFICADA (FOTOS E VÍDEOS JUNTOS - 100% UPLOAD DO APARELHO) ---
  interface EditorMediaItem {
    id: string;
    type: 'image' | 'video';
    url: string;
  }

  const initialMediaList = (): EditorMediaItem[] => {
    const list: EditorMediaItem[] = [];
    if (prod?.galleryImages && prod.galleryImages.length > 0) {
      prod.galleryImages.forEach((url, i) => {
        if (!url || !url.trim()) return;
        const isVid = isVideoUrl(url) || (prod.videoUrl && prod.videoUrl === url);
        list.push({
          id: `media-${i}-${Date.now()}`,
          type: isVid ? 'video' : 'image',
          url: url.trim()
        });
      });
    } else {
      if (prod?.primaryImage) {
        const isVid = isVideoUrl(prod.primaryImage);
        list.push({
          id: `media-p-${Date.now()}`,
          type: isVid ? 'video' : 'image',
          url: prod.primaryImage.trim()
        });
      }
      if (prod?.secondaryImage && prod.secondaryImage !== prod.primaryImage) {
        const isVid = isVideoUrl(prod.secondaryImage);
        list.push({
          id: `media-s-${Date.now()}`,
          type: isVid ? 'video' : 'image',
          url: prod.secondaryImage.trim()
        });
      }
    }

    if (prod?.videoUrl && !list.some((m) => m.url === prod.videoUrl)) {
      list.push({
        id: `media-v-${Date.now()}`,
        type: 'video',
        url: prod.videoUrl.trim()
      });
    }

    if (list.length === 0) {
      list.push({
        id: `media-default-${Date.now()}`,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85'
      });
    }
    return list;
  };

  const [mediaList, setMediaList] = useState<EditorMediaItem[]>(initialMediaList);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // --- 3. FRASES & TEXTOS DOS 2 MODOS ---
  const [shortStory, setShortStory] = useState(
    prod?.shortStory ||
      'Notas amadeiradas de cedro ancestral, âmbar quente e encadernações de couro, com pavio crepitante de madeira nobre.'
  );
  const [fullStory, setFullStory] = useState(
    prod?.fullStory ||
      prod?.shortStory ||
      'Esta criação evoca o ritmo calmo das artes tradicionais, esculpida com matérias-primas puras e tempo dedicado no atelier.'
  );

  // --- 4. DISTINTIVOS & ESPECIFICAÇÕES DOS 2 MODOS ---
  const [badge1, setBadge1] = useState(
    prod?.details?.[0] || 'Pavio duplo em lâmina de madeira'
  );
  const [badge2, setBadge2] = useState(prod?.details?.[1] || '50h Queima');
  const [detailsList, setDetailsList] = useState<string[]>(
    prod?.details && prod.details.length > 2
      ? prod.details.slice(2)
      : [
          'Matéria-prima nobre e sustentável',
          'Acompanha certificado e estojo de linho'
        ]
  );
  const [newDetailText, setNewDetailText] = useState('');
  const [materialsText, setMaterialsText] = useState(
    Array.isArray(prod?.materials) ? prod.materials.join(', ') : prod?.materials || ''
  );
  const [dimensions, setDimensions] = useState(prod?.dimensions || '');

  // Mídias da Prévia
  const previewMediaItems = mediaList;
  const activePreviewMedia = previewMediaItems[Math.min(previewActiveMediaIdx, Math.max(0, previewMediaItems.length - 1))] || previewMediaItems[0];
  const primaryMedia = previewMediaItems[0] || {
    id: 'fallback',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85'
  };

  // Upload Unificado de Mídias (Fotos e Vídeos juntos do Aparelho)
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files) as File[]) {
      const isVideo = file.type.startsWith('video/') || isVideoUrl(file.name);
      try {
        const url = await uploadImageToSupabase(file, 'product-gallery');
        setMediaList((prev) => [
          ...prev,
          {
            id: `media-up-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: isVideo ? 'video' : 'image',
            url
          }
        ]);
      } catch (err) {
        console.warn('Erro ao enviar mídia para Supabase:', err);
      }
    }
    e.target.value = '';
  };

  // Remover Mídia (Foto ou Vídeo)
  const handleRemoveMedia = (index: number) => {
    if (mediaList.length <= 1) {
      alert('O produto precisa ter pelo menos 1 mídia (foto ou vídeo).');
      return;
    }
    setMediaList((prev) => prev.filter((_, i) => i !== index));
    if (previewActiveMediaIdx >= mediaList.length - 1) {
      setPreviewActiveMediaIdx(Math.max(0, mediaList.length - 2));
    }
  };

  // Tornar Mídia como Capa / Principal (Move para a 1ª posição - Modo 1)
  const handleSetAsPrimary = (index: number) => {
    setMediaList((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
    setPreviewActiveMediaIdx(0);
  };

  // Mover Posição da Mídia no Carrossel
  const handleMoveMedia = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= mediaList.length) return;
    setMediaList((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
  };

  // Adicionar e Remover Tags de Detalhes
  const handleAddDetail = () => {
    if (!newDetailText.trim()) return;
    setDetailsList((prev) => [...prev, newDetailText.trim()]);
    setNewDetailText('');
  };

  const handleRemoveDetail = (index: number) => {
    setDetailsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Salvar Produto Completo
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanDetails: string[] = [];
    if (badge1.trim()) cleanDetails.push(badge1.trim());
    if (badge2.trim()) cleanDetails.push(badge2.trim());
    detailsList.forEach((item) => {
      const t = item.trim();
      if (t && !cleanDetails.includes(t)) {
        cleanDetails.push(t);
      }
    });

    const cleanMedia = mediaList.filter((m) => Boolean(m.url && m.url.trim()));
    const finalGallery = cleanMedia.map((m) => m.url);
    const firstVideo = cleanMedia.find((m) => m.type === 'video')?.url;
    const finalPrimary = cleanMedia[0]?.url || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
    const finalSecondary = cleanMedia.length > 1 ? cleanMedia[1].url : undefined;

    const finalMaterials = materialsText.trim()
      ? materialsText.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    const finalProduct: Product = {
      id: prod?.id || `${editing.categoryId}-item-${Date.now()}`,
      name: name.trim() || 'Nova Criação Autoral',
      category: editing.categoryId,
      categoryLabel: categoryLabel.trim() || editing.categoryTitle,
      price: Number(price) || 180,
      shortStory: shortStory.trim() || 'Criação formulada e produzida com afeto no atelier.',
      fullStory:
        fullStory.trim() ||
        shortStory.trim() ||
        'Objeto de afeto esculpido com calma e tempo para a sua casa.',
      primaryImage: finalPrimary,
      secondaryImage: finalSecondary,
      galleryImages: finalGallery.length > 0 ? finalGallery : [finalPrimary],
      videoUrl: firstVideo || undefined,
      details: cleanDetails.length > 0 ? cleanDetails : ['Feito à Mão', 'Tiragem Rara'],
      materials: finalMaterials,
      dimensions: dimensions.trim() || undefined,
      recentlySoldOut: Boolean(recentlySoldOut)
    };

    onSave(finalProduct);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Input Oculto de Upload Unificado (Fotos e Vídeos do Aparelho) */}
      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*,video/*,video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={handleMediaUpload}
      />

      <div className="relative w-full max-w-5xl bg-[#FAF8F5] border border-[#BFAE9C] rounded-xs shadow-2xl max-h-[95vh] flex flex-col text-left overflow-hidden">
        
        {/* Topo do Modal com Identificação Limpa & Sem Deformações */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#FAF6F0] border-b border-[#E3DBD0]">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[#7A5B43]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="text-[10px] uppercase tracking-widest font-semibold truncate">
                {editing.categoryTitle} • {isEditingExisting ? 'Editar Peça' : 'Novo Produto'}
              </span>
            </div>
            <h3 className="font-serif text-base sm:text-xl text-[#211E1B] font-semibold truncate">
              {isEditingExisting ? prod?.name : 'Nova Criação do Atelier'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xs text-[#7A5B43] hover:text-[#211E1B] hover:bg-[#EDE6DC] transition-colors cursor-pointer shrink-0 ml-3"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alternador Mobile (Formulário vs Prévia Ao Vivo) */}
        <div className="lg:hidden flex items-center justify-center p-1.5 bg-[#ECE5DB] border-b border-[#D8CDBC]">
          <div className="grid grid-cols-2 gap-1 w-full max-w-sm">
            <button
              type="button"
              onClick={() => setMobileView('form')}
              className={`py-1.5 px-3 text-center rounded-xs text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mobileView === 'form'
                  ? 'bg-white text-[#211E1B] shadow-2xs'
                  : 'text-[#6B5C4E]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>1. Editar Dados</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`py-1.5 px-3 text-center rounded-xs text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mobileView === 'preview'
                  ? 'bg-[#211E1B] text-white shadow-2xs'
                  : 'text-[#6B5C4E]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2. Prévia Ao Vivo</span>
            </button>
          </div>
        </div>

        {/* Corpo Principal: Lado a Lado no Desktop (Formulário à Esquerda + Prévia à Direita) */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* ================================================================= */}
          {/* COLUNA ESQUERDA: FORMULÁRIO COMPLETO, LEVE E INTUITIVO            */}
          {/* ================================================================= */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <form id="product-editor-form" onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* ------------------------------------------------------------- */}
              {/* 1. IDENTIFICAÇÃO & RÓTULO DA PEÇA                            */}
              {/* ------------------------------------------------------------- */}
              <div className="p-3.5 sm:p-4 bg-white rounded-xs border border-[#E3DBD0] space-y-3">
                <div className="flex items-center gap-2 text-[#7A5B43] border-b border-[#F0EBE1] pb-2">
                  <Tag className="w-4 h-4 text-[#C5A059]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#211E1B]">
                    1. Identificação da Peça
                  </h4>
                </div>

                {/* Rótulo Superior (ex: Vela aromática em porcelana) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Rótulo / Linha (Topo do Card e da Ficha)
                    </label>
                    <span className="text-[9.5px] font-medium text-[#7A5B43] bg-[#FAF6F0] px-2 py-0.5 rounded-xs border border-[#E3DBD0] whitespace-nowrap">
                      Ambos os Modos
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={categoryLabel}
                    onChange={(e) => setCategoryLabel(e.target.value)}
                    placeholder="Ex: Vela Aromática em Porcelana, Sabonete Botânico Mineral..."
                    className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#BFAE9C]/70 rounded-xs p-2 text-[#211E1B] focus:bg-white focus:outline-none focus:border-[#7A5B43]"
                  />
                  <p className="text-[10px] text-[#8C7561]">
                    Aparece no topo do Card Poético (Modo 1) e no cabeçalho da Ficha Técnica (Modo 2).
                  </p>
                </div>

                {/* Nome e Preço */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Nome da Criação
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Vela — Jardim de Versailles"
                      className="w-full text-xs bg-[#FAF8F5] border border-[#BFAE9C]/70 rounded-xs p-2 text-[#211E1B] focus:bg-white focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="189"
                      className="w-full text-xs font-semibold bg-[#FAF8F5] border border-[#BFAE9C]/70 rounded-xs p-2 text-[#211E1B] focus:bg-white focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                </div>
              </div>

              {/* SELO NOBRE: UNIDADES ESGOTADAS HÁ POUCO TEMPO */}
              <div className="p-3.5 sm:p-4 bg-[#FAF5F0] rounded-xs border border-[#C5A059]/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0">
                    <RecentlySoldOutBadge size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-serif font-bold text-[#2C1D15]">
                        Selo Giratório: Unidades Esgotadas Há Pouco Tempo
                      </h4>
                      {recentlySoldOut ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#3D281E] text-[#F3ECE4] text-[9px] font-sans font-bold uppercase tracking-wider border border-[#C5A059]/40">
                          Ativo no Card
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#E8DFD5] text-[#7A6B5D] text-[9px] font-sans uppercase tracking-wider">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-[#7A5B43] mt-0.5 max-w-md leading-relaxed">
                      Ao ativar, exibe no card do produto na Home o selo marrom redondo giratório indicando que as unidades foram esgotadas recentemente.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRecentlySoldOut(!recentlySoldOut)}
                  className={`px-4 py-2.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                    recentlySoldOut
                      ? 'bg-[#3D281E] hover:bg-[#2B1B13] text-[#FAF5EE] shadow-sm border border-[#C5A059]/60'
                      : 'bg-white hover:bg-[#F2EAE1] text-[#5C4535] border border-[#BFAE9C]/70'
                  }`}
                >
                  {recentlySoldOut ? (
                    <>
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>Desmarcar Esgotado</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>Marcar como Esgotado</span>
                    </>
                  )}
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 2. MÍDIAS DO PRODUTO: FOTOS & VÍDEOS UNIFICADOS (DO APARELHO) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-3.5 sm:p-4 bg-white rounded-xs border border-[#E3DBD0] space-y-3">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#211E1B]">
                      2. Mídias da Obra (Fotos & Vídeos do Aparelho)
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-[#7A5B43] bg-[#FAF6F0] px-2 py-0.5 rounded-xs border border-[#E3DBD0]">
                    {mediaList.length} {mediaList.length === 1 ? 'mídia' : 'mídias'}
                  </span>
                </div>

                <p className="text-[10.5px] text-[#6B5C4E]">
                  Faça upload de fotos e vídeos direto do celular ou computador. Todos são tratados no mesmo fluxo: a <strong>1ª mídia</strong> é a capa principal (Modo 1) e as demais integram a galeria (Modo 2).
                </p>

                {/* Grade Visual das Mídias (Fotos e Vídeos juntos) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-0.5">
                  {mediaList.map((media, idx) => (
                    <div
                      key={media.id || idx}
                      className={`relative group rounded-xs overflow-hidden border bg-[#ECE5DB] transition-all ${
                        idx === 0
                          ? 'border-[#C5A059] ring-1 ring-[#C5A059]'
                          : 'border-[#E3DBD0] hover:border-[#7A5B43]'
                      }`}
                    >
                      <div className="aspect-square w-full relative">
                        {media.type === 'video' ? (
                          <div className="w-full h-full bg-black relative flex items-center justify-center">
                            <video
                              src={media.url}
                              className="w-full h-full object-cover opacity-85"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={media.url}
                            alt={`Mídia ${idx + 1}`}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
                            }}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Selo Indicativo Elegante */}
                      <div className="absolute top-1 left-1 z-10 flex items-center gap-1">
                        {idx === 0 ? (
                          <span className="px-1.5 py-0.5 rounded-xs bg-[#211E1B] text-[#FFE29A] text-[9px] font-bold tracking-tight shadow-xs flex items-center gap-0.5">
                            ⭐ Capa (Modo 1)
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-xs bg-black/70 text-white text-[9px] font-medium shadow-xs">
                            {media.type === 'video' ? 'Vídeo' : 'Foto'} #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Ações (Definir como Capa / Mover / Excluir) */}
                      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity p-1.5">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetAsPrimary(idx)}
                            className="w-full py-1 px-1.5 rounded-xs bg-[#FAF8F5] hover:bg-white text-[#211E1B] text-[9.5px] font-bold shadow-xs transition-all cursor-pointer text-center"
                          >
                            ⭐ Definir Capa
                          </button>
                        )}
                        <div className="flex w-full gap-1">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveMedia(idx, idx - 1)}
                              className="flex-1 py-1 px-1 rounded-xs bg-white/90 hover:bg-white text-[#211E1B] text-[9px] font-semibold transition-all cursor-pointer text-center"
                              title="Mover para a esquerda"
                            >
                              ◀
                            </button>
                          )}
                          {idx < mediaList.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveMedia(idx, idx + 1)}
                              className="flex-1 py-1 px-1 rounded-xs bg-white/90 hover:bg-white text-[#211E1B] text-[9px] font-semibold transition-all cursor-pointer text-center"
                              title="Mover para a direita"
                            >
                              ▶
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="w-full py-1 px-1.5 rounded-xs bg-red-600 hover:bg-red-700 text-white text-[9.5px] font-medium shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remover</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botões de Ação de Upload Unificado */}
                <div className="pt-2 border-t border-[#F0EBE1] flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7A5B43] hover:bg-[#634834] text-white text-xs font-semibold rounded-xs transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    <Upload className="w-4 h-4" />
                    <span>+ Carregar Fotos ou Vídeos do Aparelho (Celular / PC)</span>
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 3. FRASES & TEXTOS DOS DOIS MODOS                            */}
              {/* ------------------------------------------------------------- */}
              <div className="p-3.5 sm:p-4 bg-white rounded-xs border border-[#E3DBD0] space-y-3.5">
                <div className="flex items-center gap-2 text-[#7A5B43] border-b border-[#F0EBE1] pb-2">
                  <FileText className="w-4 h-4 text-[#C5A059]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#211E1B]">
                    3. Frases & Textos das Criações
                  </h4>
                </div>

                {/* Frase Poética em Caligrafia Cursiva (Modo 1) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Modo 1 • Frase Poética (Caligrafia Cursiva)
                    </label>
                    <span className="text-[9.5px] text-[#7A5B43] bg-amber-50/80 px-2 py-0.5 rounded-xs border border-amber-200 whitespace-nowrap">
                      Fonte Manuscrita
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={shortStory}
                    onChange={(e) => setShortStory(e.target.value)}
                    placeholder="Ex: Notas amadeiradas de cedro ancestral, âmbar quente e encadernações de couro..."
                    className="w-full text-base font-['Caveat'] italic bg-[#FAF8F5] border border-[#BFAE9C]/70 rounded-xs p-2.5 text-[#211E1B] focus:bg-white focus:outline-none focus:border-[#7A5B43]"
                  />
                  <p className="text-[10px] text-[#8C7561]">
                    Renderizada com caligrafia clássica logo abaixo da foto principal no Card Poético.
                  </p>
                </div>

                {/* Texto Autoria & Saber-Fazer (Modo 2) */}
                <div className="space-y-1 pt-2 border-t border-[#F0EBE1]">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Modo 2 • Narrativa "Autoria & Saber-Fazer" (Ficha Técnica)
                  </label>
                  <textarea
                    rows={3}
                    value={fullStory}
                    onChange={(e) => setFullStory(e.target.value)}
                    placeholder="Descreva as matérias-primas nobres, o tempo de cura e o processo manual..."
                    className="w-full text-xs leading-relaxed bg-[#FAF8F5] border border-[#BFAE9C]/70 rounded-xs p-2.5 text-[#211E1B] focus:bg-white focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 4. DISTINTIVOS & ESPECIFICAÇÕES DOS 2 MODOS                  */}
              {/* ------------------------------------------------------------- */}
              <div className="p-3.5 sm:p-4 bg-white rounded-xs border border-[#E3DBD0] space-y-3">
                <div className="flex items-center gap-2 text-[#7A5B43] border-b border-[#F0EBE1] pb-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#211E1B]">
                    4. Distintivos & Tags de Saber-Fazer
                  </h4>
                </div>

                {/* Distintivos da Prancha (Modo 1) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Distintivo 1 (Superior Esquerdo)
                    </label>
                    <input
                      type="text"
                      value={badge1}
                      onChange={(e) => setBadge1(e.target.value)}
                      placeholder="Ex: Pavio duplo de madeira"
                      className="w-full text-xs bg-[#FAF8F5] border border-[#BFAE9C]/70 rounded-xs p-2 text-[#211E1B] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Distintivo 2 (Superior Direito)
                    </label>
                    <input
                      type="text"
                      value={badge2}
                      onChange={(e) => setBadge2(e.target.value)}
                      placeholder="Ex: 50h Queima"
                      className="w-full text-xs bg-[#FAF8F5] border border-[#BFAE9C]/70 rounded-xs p-2 text-[#211E1B] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tags da Ficha Técnica (Modo 2) */}
                <div className="space-y-2 pt-2 border-t border-[#F0EBE1]">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Tags Adicionais da Ficha Técnica
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {detailsList.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#FAF6F0] text-[11px] font-medium text-[#594B3F] border border-[#E3DBD0]"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDetail(idx)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="text"
                      value={newDetailText}
                      onChange={(e) => setNewDetailText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDetail();
                        }
                      }}
                      placeholder="Adicionar nova tag (ex: Algodão egípcio, Porcelana biscuit...)"
                      className="flex-1 text-xs bg-[#FAF8F5] border border-[#BFAE9C]/70 rounded-xs p-2 text-[#211E1B] focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddDetail}
                      className="px-3 py-2 bg-[#7A5B43] hover:bg-[#634834] text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer shrink-0"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* ================================================================= */}
          {/* COLUNA DIREITA: PRÉVIA AO VIVO EM TEMPO REAL                       */}
          {/* ================================================================= */}
          <div className={`w-full lg:w-[440px] bg-[#F2EDE4] border-t lg:border-t-0 lg:border-l border-[#D8CDBC] p-4 sm:p-5 flex flex-col ${mobileView === 'form' ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* Cabeçalho da Prévia */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CDBC]">
              <div className="flex items-center gap-1.5 text-[#7A5B43]">
                <Eye className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#211E1B]">
                  Prévia Ao Vivo
                </span>
              </div>

              {/* Alternador de Modo da Prévia */}
              <div className="flex items-center gap-1 bg-[#E2DACD] p-0.5 rounded-xs">
                <button
                  type="button"
                  onClick={() => setPreviewMode('mode1')}
                  className={`px-3 py-1 rounded-xs text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewMode === 'mode1'
                      ? 'bg-[#211E1B] text-[#FFE29A] shadow-xs'
                      : 'text-[#594B3F] hover:text-[#211E1B]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>Modo 1: Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mode2')}
                  className={`px-3 py-1 rounded-xs text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewMode === 'mode2'
                      ? 'bg-[#211E1B] text-[#FFE29A] shadow-xs'
                      : 'text-[#594B3F] hover:text-[#211E1B]'
                  }`}
                >
                  <FileText className="w-3 h-3 text-[#C5A059]" />
                  <span>Modo 2: Ficha</span>
                </button>
              </div>
            </div>

            {/* Container da Prévia em Tempo Real */}
            <div className="flex-1 overflow-y-auto py-3">
              
              {/* --- PRÉVIA MODO 1: CARD POÉTICO --- */}
              {previewMode === 'mode1' && (
                <div className="bg-[#FAF8F5] rounded-xs border border-[#E3DBD0] p-4 sm:p-5 shadow-sm relative text-center w-full max-w-[380px] mx-auto animate-in fade-in duration-300">
                  {/* Linha de Ilhós e Prancha */}
                  <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#C7B7A3]/70 mb-3">
                    <MetallicEyelet className="w-2.5 h-2.5" />
                    <span className="text-[9.5px] uppercase font-mono tracking-widest text-[#8C7561] font-semibold">
                      PRANCHA ESCULTURAL
                    </span>
                    <MetallicEyelet className="w-2.5 h-2.5" />
                  </div>

                  {/* Rótulo Superior */}
                  <div className="text-center mb-3">
                    <span className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8C7561] bg-white/90 px-3.5 py-1 rounded-xs border border-[#E3DBD0] inline-block shadow-2xs">
                      {categoryLabel || 'RÓTULO DA PEÇA'}
                    </span>
                  </div>

                  {/* Foto Central e Badges Flutuantes com Marca D'Água */}
                  <div className="relative my-4 flex items-center justify-center pt-5 pb-2">
                    
                    {/* Marca d'água monumental de fundo na prévia */}
                    <div className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none select-none overflow-hidden z-0 -top-1">
                      <span className="font-sans text-[34px] sm:text-[42px] font-black tracking-tight text-[#BFAFA0]/65 uppercase leading-[0.9] whitespace-nowrap">
                        {categoryLabel || 'O AROMA'}
                      </span>
                      <span className="font-sans text-[34px] sm:text-[42px] font-black tracking-tight text-[#BFAFA0]/35 uppercase leading-[0.9] whitespace-nowrap mt-2">
                        VERSAILLES
                      </span>
                    </div>

                    <div className="relative z-10 w-full max-w-[240px] aspect-square rounded-xs overflow-visible flex items-center justify-center mt-2">
                      
                      {/* Badge 1 Esquerdo (Dark Charcoal Pill) */}
                      {badge1 && (
                        <div className="absolute -top-2.5 left-0 z-20 bg-[#352E28] text-[#F9F6F0] px-2.5 py-0.5 rounded-full text-[9px] font-medium border border-[#4A4038] shadow-sm flex items-center gap-1 max-w-[130px]">
                          <Sparkles className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
                          <span className="truncate">{badge1}</span>
                        </div>
                      )}

                      {/* Mídia Principal (Foto ou Vídeo) */}
                      <div
                        onClick={() => setPreviewMode('mode2')}
                        className="w-full h-full rounded-xs overflow-hidden bg-[#ECE5DB] border-2 border-white shadow-md cursor-pointer group relative"
                        title="Clique para inspecionar no Modo 2"
                      >
                        {primaryMedia.type === 'video' ? (
                          <video
                            src={primaryMedia.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <img
                            src={primaryMedia.url}
                            alt="Prévia"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                        
                        {/* Badge 2 Inside Photo Right (Frosted Charcoal Pill) */}
                        {badge2 && (
                          <div className="absolute top-5 right-1.5 z-20 bg-[#352E28]/85 backdrop-blur-xs text-[#F9F6F0] px-2.5 py-0.5 rounded-full text-[8.5px] font-medium border border-white/20 shadow-xs flex items-center gap-1 max-w-[125px]">
                            <ShieldCheck className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
                            <span className="truncate">{badge2}</span>
                          </div>
                        )}

                        {previewMediaItems.length > 1 && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-xs bg-black/60 text-white text-[8.5px] font-medium backdrop-blur-xs flex items-center gap-1">
                            <span>+{previewMediaItems.length} mídias</span>
                          </div>
                        )}
                      </div>

                      {/* Badge do Nome Inferior (White Pill) */}
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 bg-white text-[#211E1B] px-3 py-0.5 rounded-full text-[10px] font-semibold border border-[#E3DBD0] shadow-xs whitespace-nowrap max-w-[92%] truncate">
                        {name || 'Nome da Criação'}
                      </div>

                      {/* Selo Giratório na Prévia */}
                      {recentlySoldOut && (
                        <div className="absolute -top-3 -right-3 z-30">
                          <RecentlySoldOutBadge size="sm" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Frase Poética em Caligrafia Cursiva */}
                  <p className="font-['Caveat'] text-base sm:text-lg text-[#3A2F25] italic leading-snug pt-3 px-2">
                    "{shortStory || 'Notas amadeiradas de cedro ancestral e formulação manual no atelier.'}"
                  </p>

                  <div className="mt-3.5">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('mode2')}
                      className="inline-block px-4 py-1.5 rounded-xs bg-[#211E1B] text-[#FFE29A] text-[11px] font-bold shadow-xs hover:bg-[#352F2A] transition-colors cursor-pointer"
                    >
                      Adicionar • R$ {price}
                    </button>
                  </div>
                </div>
              )}

              {/* --- PRÉVIA MODO 2: FICHA TÉCNICA INTERATIVA --- */}
              {previewMode === 'mode2' && (
                <div className="bg-white rounded-xs border border-[#E3DBD0] p-4 shadow-sm space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#E3DBD0] pb-2">
                    <div className="min-w-0">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#8C7561] block truncate">
                        {categoryLabel || 'RÓTULO DA PEÇA'}
                      </span>
                      <h4 className="font-serif text-base text-[#211E1B] font-semibold truncate">
                        {name || 'Nome da Criação'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('mode1')}
                      className="px-2 py-1 rounded-xs bg-[#FAF6F0] hover:bg-[#EDE6DC] text-[#7A5B43] text-[10px] font-semibold border border-[#E3DBD0] shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#C5A059]" />
                      <span>Modo 1</span>
                    </button>
                  </div>

                  {/* Foto / Vídeo Ativo com Controles Interativos */}
                  <div className="relative aspect-[16/10] rounded-xs overflow-hidden bg-[#ECE5DB] border border-[#E3DBD0]">
                    {activePreviewMedia.type === 'video' ? (
                      <video
                        src={activePreviewMedia.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={activePreviewMedia.url}
                        alt={name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
                        }}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                    )}

                    {/* Selo Contador */}
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-xs bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-medium flex items-center gap-1">
                      {activePreviewMedia.type === 'video' ? (
                        <>
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>Vídeo Atelier</span>
                        </>
                      ) : (
                        <span>{previewActiveMediaIdx + 1} de {previewMediaItems.length}</span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-xs bg-white text-[#211E1B] text-[10.5px] font-bold shadow-xs border border-[#E3DBD0]">
                      R$ {price}
                    </div>

                    {/* Setas de Navegação */}
                    {previewMediaItems.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPreviewActiveMediaIdx((prev) => (prev - 1 + previewMediaItems.length) % previewMediaItems.length)}
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#211E1B] flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-90"
                          aria-label="Mídia anterior"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewActiveMediaIdx((prev) => (prev + 1) % previewMediaItems.length)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#211E1B] flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-90"
                          aria-label="Próxima mídia"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Miniaturas da Galeria Clicáveis para Teste Interativo */}
                  {previewMediaItems.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto py-1">
                      {previewMediaItems.map((media, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPreviewActiveMediaIdx(i)}
                          className={`relative w-10 h-10 rounded-xs overflow-hidden border shrink-0 transition-all cursor-pointer ${
                            previewActiveMediaIdx === i
                              ? 'border-[#211E1B] ring-1 ring-[#211E1B] scale-105'
                              : 'border-[#E3DBD0] opacity-70 hover:opacity-100'
                          }`}
                        >
                          {media.type === 'video' ? (
                            <div className="w-full h-full bg-black flex items-center justify-center text-white">
                              <Play className="w-3 h-3 fill-white" />
                            </div>
                          ) : (
                            <img
                              src={media.url}
                              alt=""
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
                              }}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Autoria & Saber-Fazer */}
                  <div className="bg-[#FAF7F2] p-3 rounded-xs border border-[#E7DFD4] space-y-2">
                    <h5 className="text-[9.5px] font-bold uppercase tracking-wider text-[#8C7561]">
                      Autoria & Saber-Fazer
                    </h5>
                    <p className="text-[11px] text-[#4A3E34] leading-relaxed">
                      {fullStory || shortStory}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {badge1 && (
                        <span className="px-2 py-0.5 rounded-xs bg-white text-[9.5px] text-[#594B3F] font-semibold border border-[#E3DBD0]">
                          {badge1}
                        </span>
                      )}
                      {badge2 && (
                        <span className="px-2 py-0.5 rounded-xs bg-white text-[9.5px] text-[#594B3F] font-semibold border border-[#E3DBD0]">
                          {badge2}
                        </span>
                      )}
                      {detailsList.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-xs bg-white text-[9.5px] text-[#594B3F] font-medium border border-[#E3DBD0]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Barra Inferior com Ações Leves, Espaçadas e Confirmação Segura */}
        <div className="px-4 sm:px-6 py-3 bg-[#FAF6F0] border-t border-[#E3DBD0] flex items-center justify-between flex-wrap gap-2">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xs animate-in fade-in">
              <span className="text-[11px] font-bold text-red-800">Confirmar exclusão deste produto?</span>
              <button
                type="button"
                onClick={() => {
                  if (prod?.id) {
                    onDelete(prod.id);
                  }
                }}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-xs cursor-pointer shadow-xs transition-colors"
              >
                Sim, Excluir
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 text-[11px] font-medium rounded-xs border border-gray-300 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : isEditingExisting ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer py-1.5 px-2.5 hover:bg-red-50 rounded-xs transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir Produto</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xs text-xs font-medium text-[#7A5B43] hover:bg-[#EDE6DC] transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="product-editor-form"
              className="px-5 py-2 bg-[#211E1B] hover:bg-[#352F2A] text-[#FFE29A] text-xs uppercase tracking-wider font-bold rounded-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-[0.99]"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Produto</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// SUB-MODAL: CONFIGURAR SEÇÃO HORIZONTAL EXISTENTE
// ============================================================================
interface SectionEditorModalProps {
  section: CategoryConfig;
  onClose: () => void;
  onSave: (config: CategoryConfig) => void;
  onDelete: () => void;
}

const SectionEditorModal: React.FC<SectionEditorModalProps> = ({
  section,
  onClose,
  onSave,
  onDelete
}) => {
  const [housePrefix, setHousePrefix] = useState(section.housePrefix || 'CASA');
  const [roman, setRoman] = useState(section.roman || 'I');
  const [maisonTitle, setMaisonTitle] = useState(section.maisonTitle || 'MAISON ENTRELAÇO');
  const [mainTitle, setMainTitle] = useState(section.mainTitle);
  const [subTitle, setSubTitle] = useState(section.subTitle);
  const [watermark1, setWatermark1] = useState(section.watermarkWords[0] || 'ATELIER');
  const [watermark2, setWatermark2] = useState(section.watermarkWords[1] || 'NOBRE');
  const [badge1, setBadge1] = useState(section.defaultBadge1);
  const [badge2, setBadge2] = useState(section.defaultBadge2);
  const [selectedBg, setSelectedBg] = useState(section.bgColor);
  const [selectedFade, setSelectedFade] = useState(section.fadeColor);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSelectPalette = (pal: typeof LUXURY_PALETTES[0]) => {
    setSelectedBg(pal.bgColor);
    setSelectedFade(pal.fadeColor);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...section,
      housePrefix: housePrefix.trim() || 'CASA',
      roman: roman.trim() || 'I',
      maisonTitle: maisonTitle.trim() || 'MAISON ENTRELAÇO',
      mainTitle: mainTitle.trim() || 'A criação',
      subTitle: subTitle.trim() || 'Nova Linha',
      watermarkWords: [watermark1.trim().toUpperCase(), watermark2.trim().toUpperCase()],
      defaultBadge1: badge1.trim() || 'Autoral',
      defaultBadge2: badge2.trim() || 'Feito à Mão',
      bgColor: selectedBg,
      fadeColor: selectedFade
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#BFAE9C] rounded-xs shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#7A5B43] hover:text-[#2C231C] hover:bg-[#EDE6DC] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="border-b border-[#BFAE9C]/30 pb-3 mb-4">
          <div className="flex items-center gap-2 text-[#7A5B43]">
            <Sliders className="w-4 h-4" />
            <span className="text-[10.5px] uppercase tracking-widest font-semibold">
              Configurações da Seção Horizontal
            </span>
          </div>
          <h4 className="font-serif text-xl text-[#2C231C] font-semibold mt-0.5">
            {housePrefix} {roman} • {subTitle || section.subTitle}
          </h4>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7A5B43]/10 text-[#7A5B43] text-[10px] uppercase tracking-wider font-semibold">
            <span>Prévia do Topo:</span>
            <span className="font-bold text-[#2C231C]">{housePrefix || 'CASA'} {roman || 'I'} • {maisonTitle || 'MAISON ENTRELAÇO'}</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Identificação Superior da Seção (CASA / LINHA + NÚMERO + MAISON) */}
          <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/60 rounded-xs space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#7A5B43]">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-[10.5px] uppercase tracking-wider font-bold">
                  Identificação do Topo (Editável)
                </span>
              </div>
              <span className="text-[9.5px] text-[#8C7561] font-mono">
                Tag Superior
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                  Prefixo (Ex: CASA)
                </label>
                <input
                  type="text"
                  required
                  value={housePrefix}
                  onChange={(e) => setHousePrefix(e.target.value.toUpperCase())}
                  placeholder="CASA"
                  className="w-full text-xs font-semibold uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                  Número / Código
                </label>
                <input
                  type="text"
                  required
                  value={roman}
                  onChange={(e) => setRoman(e.target.value)}
                  placeholder="I, II, III..."
                  className="w-full text-xs font-serif uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                  Nome da Marca / Maison
                </label>
                <input
                  type="text"
                  required
                  value={maisonTitle}
                  onChange={(e) => setMaisonTitle(e.target.value.toUpperCase())}
                  placeholder="MAISON ENTRELAÇO"
                  className="w-full text-xs font-semibold uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
              Subtítulo (Nome da Categoria / Linha)
            </label>
            <input
              type="text"
              required
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Ex: Velas Aromáticas, Edições de Inverno..."
              className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
              Título Principal Monumental (Serifado Grande)
            </label>
            <input
              type="text"
              required
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              placeholder="Ex: O aroma rico, O cuidado, A trama..."
              className="w-full text-sm font-serif bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
            />
          </div>

          {/* Palavras da Marca d'Água */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                Marca d'Água 1 (Superior)
              </label>
              <input
                type="text"
                value={watermark1}
                onChange={(e) => setWatermark1(e.target.value.toUpperCase())}
                placeholder="EX: NOVIDADES"
                className="w-full text-xs font-mono uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                Marca d'Água 2 (Inferior)
              </label>
              <input
                type="text"
                value={watermark2}
                onChange={(e) => setWatermark2(e.target.value.toUpperCase())}
                placeholder="EX: ATELIER"
                className="w-full text-xs font-mono uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
              />
            </div>
          </div>

          {/* Paleta de Cores da Seção */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
              Paleta e Gradiente de Fundo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LUXURY_PALETTES.map((pal) => (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => handleSelectPalette(pal)}
                  className={`flex items-center gap-2 p-2 rounded-xs border text-left cursor-pointer transition-all ${
                    selectedBg === pal.bgColor
                      ? 'border-[#7A5B43] bg-white ring-1 ring-[#7A5B43]'
                      : 'border-[#BFAE9C]/40 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border border-black/10 shrink-0 ${pal.preview}`} />
                  <span className="text-[11px] text-[#3D3229] font-medium leading-tight truncate">
                    {pal.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#BFAE9C]/30 flex items-center justify-between flex-wrap gap-2">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xs animate-in fade-in">
                <span className="text-[11px] font-bold text-red-800">Confirmar exclusão da seção?</span>
                <button
                  type="button"
                  onClick={() => onDelete()}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-xs cursor-pointer shadow-xs transition-colors"
                >
                  Sim, Excluir
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 text-[11px] font-medium rounded-xs border border-gray-300 cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 cursor-pointer py-1 px-2 rounded-xs hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Seção</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
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
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-MODAL: CRIAR NOVA SEÇÃO HORIZONTAL
// ============================================================================
interface NewSectionModalProps {
  existingCount: number;
  onClose: () => void;
  onCreate: (config: Omit<CategoryConfig, 'fadeColor'> & { fadeColor?: string }) => void;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const NewSectionModal: React.FC<NewSectionModalProps> = ({
  existingCount,
  onClose,
  onCreate
}) => {
  const suggestedRoman = ROMAN_NUMERALS[existingCount] || 'IV';

  const [housePrefix, setHousePrefix] = useState('CASA');
  const [roman, setRoman] = useState(suggestedRoman);
  const [maisonTitle, setMaisonTitle] = useState('MAISON ENTRELAÇO');
  const [mainTitle, setMainTitle] = useState('As novidades');
  const [subTitle, setSubTitle] = useState('Lançamentos Especiais');
  const [watermark1, setWatermark1] = useState('NOVIDADES');
  const [watermark2, setWatermark2] = useState('ATELIER');
  const [selectedPalette, setSelectedPalette] = useState(LUXURY_PALETTES[0]);

  // Gera slug seguro para âncoras
  const slug = subTitle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `linha-${Date.now()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: slug,
      housePrefix: housePrefix.trim() || 'CASA',
      roman: roman.trim() || 'IV',
      maisonTitle: maisonTitle.trim() || 'MAISON ENTRELAÇO',
      mainTitle: mainTitle.trim() || 'A novidade',
      subTitle: subTitle.trim() || 'Coleção Exclusiva',
      watermarkWords: [watermark1.trim().toUpperCase() || 'NOVIDADES', watermark2.trim().toUpperCase() || 'MAISON'],
      defaultBadge1: 'Edição Limitada',
      defaultBadge2: 'Tiragem Rara',
      bgColor: selectedPalette.bgColor,
      fadeColor: selectedPalette.fadeColor
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#BFAE9C] rounded-xs shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#7A5B43] hover:text-[#2C231C] hover:bg-[#EDE6DC] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="border-b border-[#BFAE9C]/30 pb-3 mb-4">
          <div className="flex items-center gap-2 text-[#7A5B43]">
            <Layers className="w-4 h-4" />
            <span className="text-[10.5px] uppercase tracking-widest font-semibold">
              Criar Nova Seção Horizontal
            </span>
          </div>
          <h4 className="font-serif text-xl text-[#2C231C] font-semibold mt-0.5">
            Nova Linha de Produtos / Categoria
          </h4>
          <p className="text-xs text-[#7A5B43]">
            A seção será adicionada imediatamente na página com prancha de alfaiataria e carrossel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Identificação Superior da Seção (CASA / LINHA + NÚMERO + MAISON) */}
          <div className="p-3.5 bg-white/80 border border-[#BFAE9C]/60 rounded-xs space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#7A5B43]">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-[10.5px] uppercase tracking-wider font-bold">
                  Identificação do Topo
                </span>
              </div>
              <span className="text-[9.5px] text-[#8C7561] font-mono">
                {housePrefix} {roman} • {maisonTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                  Prefixo (Ex: CASA)
                </label>
                <input
                  type="text"
                  required
                  value={housePrefix}
                  onChange={(e) => setHousePrefix(e.target.value.toUpperCase())}
                  placeholder="CASA"
                  className="w-full text-xs font-semibold uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                  Número Romano
                </label>
                <input
                  type="text"
                  required
                  value={roman}
                  onChange={(e) => setRoman(e.target.value)}
                  placeholder="IV"
                  className="w-full text-xs font-serif uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                  Nome da Maison / Marca
                </label>
                <input
                  type="text"
                  required
                  value={maisonTitle}
                  onChange={(e) => setMaisonTitle(e.target.value.toUpperCase())}
                  placeholder="MAISON ENTRELAÇO"
                  className="w-full text-xs font-semibold uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
              Subtítulo (Nome da Linha)
            </label>
            <input
              type="text"
              required
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Ex: Lançamentos Especiais"
              className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
              Título Principal (Serifado Grande)
            </label>
            <input
              type="text"
              required
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              placeholder="Ex: As novidades"
              className="w-full text-sm font-serif bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
            />
          </div>

          {/* Sugestões Rápidas de Linhas */}
          <div className="space-y-1">
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
              Inspirações Prontas da Maison
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { main: 'As novidades', sub: 'Lançamentos Especiais' },
                { main: 'A colheita', sub: 'Fragrâncias de Temporada' },
                { main: 'A noite', sub: 'Edições Noturnas & Veludo' },
                { main: 'O encontro', sub: 'Mesa Posta & Recepção' },
                { main: 'O aconchego', sub: 'Linho & Caxemira' }
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMainTitle(sug.main);
                    setSubTitle(sug.sub);
                  }}
                  className="text-[10px] px-2 py-1 bg-white hover:bg-[#EDE6DC] border border-[#BFAE9C]/40 rounded-xs text-[#5C4D41] transition-colors cursor-pointer"
                >
                  {sug.main} • {sug.sub}
                </button>
              ))}
            </div>
          </div>

          {/* Palavras da Marca d'Água */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                Palavra Superior (Fundo)
              </label>
              <input
                type="text"
                value={watermark1}
                onChange={(e) => setWatermark1(e.target.value.toUpperCase())}
                placeholder="EX: NOVIDADES"
                className="w-full text-xs font-mono uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                Palavra Inferior (Fundo)
              </label>
              <input
                type="text"
                value={watermark2}
                onChange={(e) => setWatermark2(e.target.value.toUpperCase())}
                placeholder="EX: ATELIER"
                className="w-full text-xs font-mono uppercase bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
              />
            </div>
          </div>

          {/* Seletor de Paleta */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
              Paleta e Gradiente da Seção
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LUXURY_PALETTES.map((pal) => (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => setSelectedPalette(pal)}
                  className={`flex items-center gap-2 p-2 rounded-xs border text-left cursor-pointer transition-all ${
                    selectedPalette.id === pal.id
                      ? 'border-[#7A5B43] bg-white ring-1 ring-[#7A5B43]'
                      : 'border-[#BFAE9C]/40 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border border-black/10 shrink-0 ${pal.preview}`} />
                  <span className="text-[11px] text-[#3D3229] font-medium leading-tight truncate">
                    {pal.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

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
              <span>Criar Seção</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
