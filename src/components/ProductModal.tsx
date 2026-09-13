import React, { useState } from 'react';
import { Product } from '../types';
import { RecentlySoldOutBadge } from './RecentlySoldOutBadge';
import { X, ShoppingBag, Check, Sparkles, ShieldCheck, Heart, Play } from 'lucide-react';
import { triggerFlyHeartToCart } from './FlyingHeartCartAnimation';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const isVideoUrl = (url?: string | null): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  return lower.startsWith('data:video/') || 
         lower.endsWith('.mp4') || 
         lower.endsWith('.webm') || 
         lower.endsWith('.mov') || 
         lower.includes('youtube.com') || 
         lower.includes('vimeo.com') ||
         lower.includes('/video/');
};

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // Build unified media items
  const mediaList: { type: 'image' | 'video'; url: string }[] = [];
  if (product.galleryImages && product.galleryImages.length > 0) {
    product.galleryImages.forEach((u) => {
      if (u && u.trim()) {
        const isVid = isVideoUrl(u) || (product.videoUrl && product.videoUrl === u);
        mediaList.push({ type: isVid ? 'video' : 'image', url: u.trim() });
      }
    });
  } else {
    if (product.primaryImage) {
      mediaList.push({
        type: isVideoUrl(product.primaryImage) ? 'video' : 'image',
        url: product.primaryImage
      });
    }
    if (product.secondaryImage && product.secondaryImage !== product.primaryImage) {
      mediaList.push({
        type: isVideoUrl(product.secondaryImage) ? 'video' : 'image',
        url: product.secondaryImage
      });
    }
  }

  if (product.videoUrl && !mediaList.some((m) => m.url === product.videoUrl)) {
    mediaList.push({ type: 'video', url: product.videoUrl });
  }

  if (mediaList.length === 0) {
    mediaList.push({
      type: 'image',
      url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85'
    });
  }

  const currentMedia = mediaList[Math.min(selectedIdx, mediaList.length - 1)] || mediaList[0];

  const handleAdd = (e: React.MouseEvent) => {
    triggerFlyHeartToCart(e);
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-[#F7F4EF] text-[#3D3229] rounded-xs shadow-2xl border border-[#BFAE9C]/30 overflow-hidden my-8 animate-in zoom-in-95 duration-300">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-[#3D3229]/60 hover:text-[#3D3229] bg-white/80 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
            
            {/* Gallery Left */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-square bg-[#E8E0D4] overflow-hidden border border-[#BFAE9C]/30 shadow-inner rounded-xs relative">
                {currentMedia.type === 'video' ? (
                  <video
                    src={currentMedia.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={currentMedia.url}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85';
                    }}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Selo Giratório Nobre: Unidades Esgotadas Há Pouco Tempo */}
                {product.recentlySoldOut && (
                  <div className="absolute top-3 right-3 z-20">
                    <RecentlySoldOutBadge size="sm" />
                  </div>
                )}
              </div>

              {mediaList.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto py-1">
                  {mediaList.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIdx(idx)}
                      className={`w-16 h-16 shrink-0 aspect-square overflow-hidden border rounded-xs transition-all cursor-pointer relative ${
                        selectedIdx === idx
                          ? 'border-[#7A5B43] ring-2 ring-[#7A5B43]/30 scale-105'
                          : 'border-[#BFAE9C]/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {m.type === 'video' ? (
                        <div className="w-full h-full bg-black relative flex items-center justify-center">
                          <video src={m.url} muted className="w-full h-full object-cover opacity-75" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-3 h-3 text-white fill-white" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={m.url}
                          alt="Thumb"
                          referrerPolicy="no-referrer"
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
            </div>

            {/* Info Right */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A5B43] font-semibold block">
                  {product.categoryLabel}
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl text-[#3D3229] font-normal leading-tight">
                  {product.name}
                </h2>

                <p className="font-serif text-2xl text-[#7A5B43] font-medium">
                  R$ {product.price.toLocaleString('pt-BR')}
                </p>

                <p className="font-sans text-xs sm:text-sm text-[#3D3229]/80 font-light leading-relaxed pt-2 border-t border-[#BFAE9C]/20">
                  {product.fullStory}
                </p>

                {/* Fragrance Pyramid if candle */}
                {product.fragranceNotes && (
                  <div className="p-4 bg-[#E8E0D4]/50 border border-[#BFAE9C]/30 space-y-2 rounded-xs">
                    <span className="text-[10px] font-cinzel tracking-widest text-[#7A5B43] uppercase font-bold block">
                      Pirâmide Olfativa
                    </span>
                    <div className="text-xs font-sans text-[#3D3229]/80 space-y-1">
                      <p><strong>Topo:</strong> {product.fragranceNotes.top}</p>
                      <p><strong>Coração:</strong> {product.fragranceNotes.heart}</p>
                      <p><strong>Fundo:</strong> {product.fragranceNotes.base}</p>
                    </div>
                  </div>
                )}

                {/* Specifications */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#7A5B43] font-semibold block">
                    Especificações & Detalhes
                  </span>
                  <ul className="space-y-1 text-xs font-sans text-[#3D3229]/75 font-light">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#7A5B43]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Add Button */}
              <div className="pt-6 border-t border-[#BFAE9C]/20 flex items-center gap-4">
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`flex-1 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-3 shadow-md ${
                    added
                      ? 'bg-[#6F775C] text-white'
                      : 'bg-[#7A5B43] hover:bg-[#3D3229] text-[#F7F4EF]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado à Sacola</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Adicionar Objeto</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
