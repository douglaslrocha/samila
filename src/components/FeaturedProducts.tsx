import React, { useState } from 'react';
import { FEATURED_PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { RecentlySoldOutBadge } from './RecentlySoldOutBadge';
import { ShoppingBag, Eye, Check } from 'lucide-react';

interface FeaturedProductsProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  activeFilter?: 'all' | 'velas' | 'sabonetes' | 'croche';
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onAddToCart,
  onQuickView,
  activeFilter = 'all'
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = activeFilter === 'all'
    ? FEATURED_PRODUCTS
    : FEATURED_PRODUCTS.filter(p => p.category === activeFilter);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section id="produtos" className="relative w-full border-none outline-none overflow-hidden m-0 p-0 left-0 right-0">
      {/* Full-Bleed Edge-to-Edge Parent Background Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=2000&q=90"
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-candle-in-a-dark-room-42880-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft Luxury Overlay for Readability */}
        <div className="absolute inset-0 bg-[#F7F4EF]/93 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#BFAE9C]/30 gap-6">
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#7A5B43] font-medium block mb-2">
              Edições Limitadas do Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#3D3229]">
              Produtos de Destaque
            </h2>
          </div>
          <p className="font-sans text-xs text-[#3D3229]/70 max-w-sm font-light leading-relaxed">
            Pequenos lotes confeccionados com rigor artesanal, matérias-primas nobres e tempo intencional.
          </p>
        </div>

        {/* Products Layout: Horizontal scroll with horizontal card orientation on mobile, grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:overflow-visible scrollbar-thin scrollbar-thumb-[#7A5B43]/40">
          {filteredProducts.map((product: Product) => {
            const isHovered = hoveredId === product.id;
            const isJustAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="snap-start shrink-0 w-[88vw] max-w-[360px] sm:w-auto sm:shrink flex flex-row sm:flex-col justify-between bg-white/80 backdrop-blur-md border border-[#BFAE9C]/30 hover:border-[#7A5B43]/50 transition-all duration-300 p-3 sm:p-4 rounded-xs shadow-xs hover:shadow-lg"
              >
                {/* Product Image Frame: Left side on mobile, Top on desktop */}
                <div
                  onClick={() => onQuickView(product)}
                  className="relative w-28 sm:w-full aspect-square shrink-0 overflow-hidden bg-[#E8E0D4]/30 cursor-pointer sm:mb-6 group/img rounded-xs"
                >
                  <img
                    src={isHovered ? product.secondaryImage : product.primaryImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-700 group-hover/img:scale-105"
                  />
                  
                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] uppercase tracking-widest bg-[#F7F4EF]/90 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 text-[#7A5B43] font-medium border border-[#BFAE9C]/20">
                    {product.categoryLabel}
                  </span>

                  {/* Quick View Hover Button (Desktop) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView(product);
                    }}
                    className="absolute inset-x-4 bottom-4 py-2.5 bg-[#3D3229]/90 text-[#F7F4EF] text-[11px] uppercase tracking-widest backdrop-blur-md hidden sm:flex items-center justify-center gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Conhecer Objeto</span>
                  </button>

                  {/* Selo Giratório Nobre: Unidades Esgotadas Há Pouco Tempo */}
                  {product.recentlySoldOut && (
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 z-20">
                      <RecentlySoldOutBadge size="sm" />
                    </div>
                  )}
                </div>

                {/* Info Block: Right side on mobile, Bottom on desktop */}
                <div className="flex-1 min-w-0 pl-3 sm:pl-0 space-y-2 sm:space-y-3 flex flex-col justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        onClick={() => onQuickView(product)}
                        className="font-serif text-base sm:text-xl text-[#3D3229] font-normal cursor-pointer hover:text-[#7A5B43] transition-colors truncate sm:whitespace-normal"
                      >
                        {product.name}
                      </h3>
                    </div>

                    <p className="font-sans text-[11px] sm:text-xs text-[#3D3229]/75 font-light line-clamp-2 leading-relaxed">
                      {product.shortStory}
                    </p>
                  </div>

                  {/* Price and Add Button */}
                  <div className="pt-2 sm:pt-4 border-t border-[#BFAE9C]/20 flex items-center justify-between gap-2">
                    <span className="font-serif text-base sm:text-xl text-[#7A5B43] font-medium whitespace-nowrap">
                      R$ {product.price.toLocaleString('pt-BR')}
                    </span>

                    <button
                      onClick={(e) => handleAdd(product, e)}
                      disabled={isJustAdded}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 flex items-center gap-1.5 shadow-xs ${
                        isJustAdded
                          ? 'bg-[#6F775C] text-white'
                          : 'bg-[#7A5B43] hover:bg-[#3D3229] text-[#F7F4EF]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Adicionado</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Adicionar</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
