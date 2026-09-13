import React, { useState } from 'react';
import { THREE_WORLDS, FEATURED_PRODUCTS } from '../data/mockData';
import { WorldItem, Product } from '../types';
import { Compass, ArrowRight, ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';

interface ThreeWorldsSectionProps {
  activeFilter: 'all' | 'velas' | 'sabonetes' | 'croche';
  onSelectFilter: (filter: 'all' | 'velas' | 'sabonetes' | 'croche') => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ThreeWorldsSection: React.FC<ThreeWorldsSectionProps> = ({
  activeFilter,
  onSelectFilter,
  onAddToCart,
  onQuickView
}) => {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleAddProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const filteredWorlds = activeFilter === 'all'
    ? THREE_WORLDS
    : THREE_WORLDS.filter(w => w.category === activeFilter);

  return (
    <section id="tres-casas" className="relative w-full border-none outline-none overflow-hidden m-0 p-0 left-0 right-0">
      {/* Full-Bleed Edge-to-Edge Parent Background Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=2000&q=90"
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-candle-flame-41580-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Ecrú / Sand Overlay */}
        <div className="absolute inset-0 bg-[#E8E0D4]/92 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-8 text-[#3D3229]">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#7A5B43] font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>Domínios da Maison</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#3D3229]">
            As Três Casas
          </h2>
          <p className="font-sans text-xs sm:text-sm font-light text-[#3D3229]/70 tracking-widest uppercase">
            Cada casa abriga sua poesia, seu saber-fazer e seus objetos exclusivos
          </p>
        </div>

        {/* Category / House Filter Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-16 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => onSelectFilter('all')}
            className={`px-4 sm:px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 rounded-xs border whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#3D3229] text-[#F7F4EF] border-[#3D3229] shadow-md'
                : 'bg-white/60 text-[#3D3229]/80 border-[#BFAE9C]/30 hover:border-[#7A5B43]'
            }`}
          >
            Todas as Casas
          </button>
          
          {THREE_WORLDS.map((world) => {
            const isActive = activeFilter === world.category;
            return (
              <button
                key={world.id}
                onClick={() => onSelectFilter(world.category)}
                className={`px-4 sm:px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 rounded-xs border flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#7A5B43] text-[#F7F4EF] border-[#7A5B43] shadow-md'
                    : 'bg-white/60 text-[#3D3229]/80 border-[#BFAE9C]/30 hover:border-[#7A5B43]'
                }`}
              >
                <span className="font-cinzel text-xs font-semibold">{world.romanNumber}</span>
                <span>• {world.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* Houses & Integrated Products Display */}
        <div className="space-y-24">
          {filteredWorlds.map((world: WorldItem) => {
            const houseProducts = FEATURED_PRODUCTS.filter(
              (p) => p.category === world.category
            );

            return (
              <div
                key={world.id}
                className="bg-white/70 backdrop-blur-md border border-[#BFAE9C]/30 rounded-xs p-6 sm:p-10 shadow-sm hover:shadow-md transition-all duration-500 space-y-10"
              >
                {/* 1. HOUSE PRESENTATION HEADER CARD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-8 border-b border-[#BFAE9C]/25">
                  
                  {/* Left: House Image */}
                  <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden bg-[#241E1A] rounded-xs group">
                    <img
                      src={world.image}
                      alt={world.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.92]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    {/* Roman Numeral */}
                    <span className="absolute top-4 left-4 font-cinzel text-xl font-light text-[#F7F4EF] tracking-widest px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20">
                      Casa {world.romanNumber}
                    </span>

                    <span className="absolute bottom-4 left-4 text-[11px] font-sans uppercase tracking-[0.2em] text-[#E8E0D4] font-medium">
                      {world.subtitle}
                    </span>
                  </div>

                  {/* Right: House Narrative */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#7A5B43] font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Domínio {world.romanNumber}</span>
                      </div>
                      <h3 className="font-serif text-3xl sm:text-4xl text-[#3D3229] font-normal">
                        {world.title}
                      </h3>
                      <p className="font-serif italic text-sm text-[#7A5B43] font-light">
                        "{world.quote}"
                      </p>
                    </div>

                    <p className="font-sans text-xs sm:text-sm font-light text-[#3D3229]/85 leading-relaxed">
                      {world.description}
                    </p>

                    {/* Key Attributes */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {world.details.map((detail, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] sm:text-[11px] font-sans uppercase tracking-wider text-[#7A5B43] bg-[#E8E0D4]/60 px-3 py-1 rounded-xs border border-[#BFAE9C]/30"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. HOUSE PRODUCTS DIRECTLY UNDERNEATH */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-xl sm:text-2xl text-[#3D3229] font-normal flex items-center gap-2">
                      <span>Objetos da Casa {world.romanNumber}</span>
                      <span className="text-xs font-sans text-[#7A5B43] tracking-widest uppercase font-light">
                        ({houseProducts.length} {houseProducts.length === 1 ? 'objeto' : 'objetos'})
                      </span>
                    </h4>
                  </div>

                  {/* Products Grid / Mobile Horizontal Scroll */}
                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible scrollbar-thin scrollbar-thumb-[#7A5B43]/40">
                    {houseProducts.map((product) => {
                      const isHovered = hoveredProductId === product.id;
                      const isJustAdded = addedProductId === product.id;

                      return (
                        <div
                          key={product.id}
                          onMouseEnter={() => setHoveredProductId(product.id)}
                          onMouseLeave={() => setHoveredProductId(null)}
                          className="snap-start shrink-0 w-[85vw] max-w-[340px] sm:w-auto sm:shrink flex flex-row sm:flex-col justify-between bg-white/90 border border-[#BFAE9C]/30 hover:border-[#7A5B43]/50 transition-all duration-300 p-3 sm:p-4 rounded-xs shadow-xs hover:shadow-md"
                        >
                          {/* Image Frame: Left on mobile, Top on desktop */}
                          <div
                            onClick={() => onQuickView(product)}
                            className="relative w-28 sm:w-full aspect-square shrink-0 overflow-hidden bg-[#E8E0D4]/40 cursor-pointer sm:mb-4 group/img rounded-xs"
                          >
                            <img
                              src={isHovered ? product.secondaryImage : product.primaryImage}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-all duration-700 group-hover/img:scale-105"
                            />
                            
                            <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest bg-[#F7F4EF]/90 backdrop-blur-md px-2 py-0.5 text-[#7A5B43] font-medium border border-[#BFAE9C]/20">
                              {product.categoryLabel}
                            </span>

                            {/* Desktop Quick View Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuickView(product);
                              }}
                              className="absolute inset-x-3 bottom-3 py-2 bg-[#3D3229]/90 text-[#F7F4EF] text-[10px] uppercase tracking-widest backdrop-blur-md hidden sm:flex items-center justify-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Ver Detalhes</span>
                            </button>
                          </div>

                          {/* Info Block */}
                          <div className="flex-1 min-w-0 pl-3 sm:pl-0 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <h5
                                onClick={() => onQuickView(product)}
                                className="font-serif text-base sm:text-lg text-[#3D3229] font-normal cursor-pointer hover:text-[#7A5B43] transition-colors truncate sm:whitespace-normal"
                              >
                                {product.name}
                              </h5>
                              <p className="font-sans text-[11px] text-[#3D3229]/75 font-light line-clamp-2 leading-relaxed">
                                {product.shortStory}
                              </p>
                            </div>

                            {/* Price and Add Button */}
                            <div className="pt-2 border-t border-[#BFAE9C]/20 flex items-center justify-between gap-2">
                              <span className="font-serif text-base sm:text-lg text-[#7A5B43] font-medium whitespace-nowrap">
                                R$ {product.price.toLocaleString('pt-BR')}
                              </span>

                              <button
                                onClick={(e) => handleAddProduct(product, e)}
                                disabled={isJustAdded}
                                className={`px-3 py-2 text-[10px] uppercase tracking-[0.15em] font-medium transition-all duration-300 flex items-center gap-1.5 shadow-xs ${
                                  isJustAdded
                                    ? 'bg-[#6F775C] text-white'
                                    : 'bg-[#7A5B43] hover:bg-[#3D3229] text-[#F7F4EF]'
                                }`}
                              >
                                {isJustAdded ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Adicionado</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-3 h-3" />
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

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

