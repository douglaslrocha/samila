import React, { useState } from 'react';
import { Layers, Play } from 'lucide-react';
import { Product } from '../types';

interface StackedProductMediaProps {
  product: Product;
  className?: string;
}

export const StackedProductMedia: React.FC<StackedProductMediaProps> = ({
  product,
  className = ''
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Extrair até 5 mídias reais do produto (imagens e vídeo)
  const mediaList: { url: string; isVideo?: boolean }[] = [];

  if (product.primaryImage) {
    mediaList.push({ url: product.primaryImage });
  }
  if (product.secondaryImage && !mediaList.some((m) => m.url === product.secondaryImage)) {
    mediaList.push({ url: product.secondaryImage });
  }
  if (product.galleryImages && Array.isArray(product.galleryImages)) {
    product.galleryImages.forEach((img) => {
      if (img && !mediaList.some((m) => m.url === img)) {
        mediaList.push({ url: img });
      }
    });
  }

  // Limitar a no máximo 5 itens conforme solicitado
  const stackItems = mediaList.slice(0, 5);
  const totalCount = stackItems.length;
  const hasVideo = Boolean(product.videoUrl);

  // Fallback seguro de imagem caso alguma falhe
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) => {
    const target = e.currentTarget;
    if (fallbackUrl && target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    } else {
      target.src = 'https://images.unsplash.com/photo-1608248597359-05d5351a9a83?auto=format&fit=crop&w=600&q=80';
    }
  };

  // Se tiver menos de 2 imagens, exibe uma única
  if (totalCount <= 1) {
    return (
      <div className={`relative w-20 h-20 shrink-0 select-none ${className}`}>
        <img
          src={product.primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[6px] border border-[#DFD6C9] bg-[#E8E0D4] shadow-[0_2px_8px_rgba(40,30,20,0.12)]"
          onError={(e) => handleImageError(e, product.secondaryImage)}
        />
      </div>
    );
  }

  // Parâmetros de offset e sombras táteis para profundidade real de camadas
  // Cada camada fica escalonada com sombra própria projetada sobre a camada de baixo
  const offsets = [
    {
      top: 0,
      left: 0,
      z: 10,
      shadow: 'shadow-[0_6px_16px_rgba(35,24,15,0.22),0_1px_4px_rgba(0,0,0,0.12)]',
      border: 'border-[#D9CFC1]'
    },
    {
      top: 5,
      left: 5,
      z: 8,
      shadow: 'shadow-[0_4px_10px_rgba(35,24,15,0.18),0_1px_3px_rgba(0,0,0,0.08)]',
      border: 'border-[#D2C5B4]'
    },
    {
      top: 9,
      left: 9,
      z: 6,
      shadow: 'shadow-[0_3px_8px_rgba(35,24,15,0.14)]',
      border: 'border-[#C8BBA9]'
    },
    {
      top: 13,
      left: 13,
      z: 4,
      shadow: 'shadow-[0_2px_6px_rgba(35,24,15,0.12)]',
      border: 'border-[#BEB09C]'
    },
    {
      top: 16,
      left: 16,
      z: 2,
      shadow: 'shadow-[0_2px_5px_rgba(35,24,15,0.10)]',
      border: 'border-[#B4A590]'
    }
  ];

  // Alternar a foto do topo ao clicar na pilha
  const handleNextPhoto = () => {
    setActiveImageIndex((prev) => (prev + 1) % totalCount);
  };

  // Imagens reordenadas para colocar a ativa no topo e as outras em cascata logo atrás
  const orderedItems: { url: string; originalIndex: number }[] = [];
  for (let i = 0; i < totalCount; i++) {
    const idx = (activeImageIndex + i) % totalCount;
    orderedItems.push({ url: stackItems[idx].url, originalIndex: idx });
  }

  return (
    <div
      onClick={handleNextPhoto}
      title="Clique para folhear as fotos do produto"
      className={`relative w-[90px] h-[90px] shrink-0 select-none cursor-pointer group p-1 ${className}`}
    >
      {/* Camadas inferiores (renderizadas de trás para a frente) com sombras de profundidade marcantes */}
      {orderedItems
        .slice(1)
        .reverse()
        .map((item, reverseIdx) => {
          // Índice real na pilha de baixo (1 a totalCount - 1)
          const layerIdx = totalCount - 1 - reverseIdx;
          const conf = offsets[layerIdx] || offsets[offsets.length - 1];

          return (
            <div
              key={`layer-${item.originalIndex}-${layerIdx}`}
              style={{
                top: `${conf.top}px`,
                left: `${conf.left}px`,
                zIndex: conf.z
              }}
              className={`absolute w-[68px] h-[68px] rounded-[6px] overflow-hidden border ${conf.border} bg-[#EBE4D8] ${conf.shadow} transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:translate-y-1`}
            >
              <img
                src={item.url}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-92 filter contrast-95"
                onError={(e) => handleImageError(e)}
              />
              {/* Sombra de oclusão e contato físico projetada pela foto superior */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-black/10 to-transparent pointer-events-none" />
            </div>
          );
        })}

      {/* Camada do Topo (Imagem Principal Ativa com sombra profunda descolando do fundo) */}
      <div
        style={{
          top: `${offsets[0].top}px`,
          left: `${offsets[0].left}px`,
          zIndex: offsets[0].z
        }}
        className={`absolute w-[68px] h-[68px] rounded-[6px] overflow-hidden border ${offsets[0].border} bg-[#E8E0D4] ${offsets[0].shadow} transition-transform duration-200 group-hover:scale-[1.03]`}
      >
        <img
          src={orderedItems[0].url}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, product.secondaryImage)}
        />

        {/* Micro-Selo de Volume de Mídias (Ex: 4 mídias / Vídeo) */}
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-[#1C1815]/90 backdrop-blur-xs text-[#FAF6F0] text-[8.5px] font-sans font-medium flex items-center gap-1 shadow-md border border-white/20 pointer-events-none">
          {hasVideo ? (
            <Play className="w-2 h-2 text-[#D4AF37] fill-[#D4AF37]" />
          ) : (
            <Layers className="w-2 h-2 text-[#D4AF37]" />
          )}
          <span>{totalCount}</span>
        </div>
      </div>
    </div>
  );
};
