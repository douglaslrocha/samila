import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface IntelligentProductPillsProps {
  products: Product[];
  currentIndex: number;
  onSelect: (index: number) => void;
  fadeColor?: string;
  categoryTitle?: string;
}

export const IntelligentProductPills: React.FC<IntelligentProductPillsProps> = ({
  products,
  currentIndex,
  onSelect,
  fadeColor = '#F5EFE6',
  categoryTitle
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Estados para suporte a clique e arraste com o mouse (drag to scroll)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Verifica o estado de overflow e se há conteúdo para a esquerda ou para a frente
  const checkScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const overflowing = scrollWidth > clientWidth + 4;
    setIsOverflowing(overflowing);

    if (overflowing) {
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []);

  // Monitora redimensionamento e atualizações de produtos
  useEffect(() => {
    checkScrollState();

    const handleResize = () => {
      checkScrollState();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScrollState, products]);

  // Inteligência de Rolagem Automática: Centraliza o item selecionado de maneira fluida e suave
  useEffect(() => {
    const container = scrollContainerRef.current;
    const targetPill = pillRefs.current[currentIndex];

    if (!container || !targetPill) return;

    // Se for o primeiro produto, rola suavemente para o início
    if (currentIndex === 0) {
      container.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    } 
    // Se for o último produto, rola até o fim
    else if (currentIndex === products.length - 1) {
      container.scrollTo({
        left: container.scrollWidth - container.clientWidth,
        behavior: 'smooth'
      });
    } 
    // Caso contrário, centraliza o item selecionado no container
    else {
      const pillLeft = targetPill.offsetLeft;
      const pillWidth = targetPill.offsetWidth;
      const containerWidth = container.clientWidth;
      const targetScrollLeft = pillLeft - (containerWidth / 2) + (pillWidth / 2);

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }

    const timer = setTimeout(checkScrollState, 350);
    return () => clearTimeout(timer);
  }, [currentIndex, checkScrollState, products.length]);

  // Rola suavemente para a esquerda ou para a direita via micro-controles
  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = Math.max(130, container.clientWidth * 0.45);
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });

    setTimeout(checkScrollState, 320);
  };

  // Suporte a Mouse Drag (arrastar com o cursor para rolar como no celular)
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftStartRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    container.scrollLeft = scrollLeftStartRef.current - walk;
    checkScrollState();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  if (products.length <= 1) return null;

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-4 sm:mt-5 px-1 sm:px-2 select-none group/pills">
      
      {/* 1. Desvanecimento elegante à esquerda quando há itens antes */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-14 z-10 transition-opacity duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `linear-gradient(to right, ${fadeColor} 25%, transparent 100%)`
        }}
      />

      {/* Micro-seta sutil e discreta à esquerda (apenas se houver itens antes) */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          aria-label="Rolar para opções anteriores"
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-[#7A5B43] hover:text-[#211E1B] flex items-center justify-center shadow-xs border border-[#DFD6C9]/80 backdrop-blur-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      )}

      {/* 2. Trilho de Pílulas Inteligente em Linha Única com Rolagem Suave */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollState}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 px-4 sm:px-6 no-scrollbar scroll-smooth whitespace-nowrap cursor-grab active:cursor-grabbing ${
          isOverflowing ? 'justify-start' : 'justify-center'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        role="tablist"
        aria-label={categoryTitle ? `Criações de ${categoryTitle}` : 'Criações do Atelier'}
      >
        {products.map((prod, idx) => {
          const isSelected = idx === currentIndex;
          const cleanName = prod.name.replace(/^[^—]+—\s*/, '');

          return (
            <button
              key={prod.id}
              ref={(el) => {
                pillRefs.current[idx] = el;
              }}
              role="tab"
              aria-selected={isSelected}
              onClick={(e) => {
                // Previne clique acidental se estava apenas arrastando
                if (hasMovedRef.current) {
                  e.preventDefault();
                  return;
                }
                onSelect(idx);
              }}
              className={`group/pill relative flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.97] ${
                isSelected
                  ? 'bg-[#211E1B] text-white shadow-[0_2px_8px_rgba(33,30,27,0.18)] font-semibold ring-1 ring-[#FFD29D]/30'
                  : 'bg-white/80 hover:bg-white text-[#5E5245] hover:text-[#211E1B] border border-[#DFD6C9] shadow-2xs hover:border-[#C4B6A6]'
              }`}
            >
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD29D] shrink-0" />
              )}
              <span>{cleanName}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Desvanecimento elegante à direita mostrando naturalmente que a linha continua */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-16 z-10 transition-opacity duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `linear-gradient(to left, ${fadeColor} 30%, transparent 100%)`
        }}
      />

      {/* 4. Micro-seta sutil e discreta à direita (sem botões pretos ou pesados) */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          aria-label="Rolar para as próximas criações"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-[#7A5B43] hover:text-[#211E1B] flex items-center justify-center shadow-xs border border-[#DFD6C9]/80 backdrop-blur-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      )}

    </div>
  );
};
