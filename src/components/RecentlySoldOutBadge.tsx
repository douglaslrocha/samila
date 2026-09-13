import React from 'react';

interface RecentlySoldOutBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

/**
 * Selo circular giratório de alta costura em tom marrom nobre e feminino:
 * "Unidades esgotadas há pouco tempo"
 */
export const RecentlySoldOutBadge: React.FC<RecentlySoldOutBadgeProps> = ({
  className = '',
  size = 'md',
  label = 'UNIDADES ESGOTADAS HÁ POUCO TEMPO • EDIÇÃO LIMITADA •'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-[8px]',
    md: 'w-20 h-20 sm:w-24 sm:h-24 text-[9px] sm:text-[10px]',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 text-[10px] sm:text-[11px]'
  }[size];

  const centerSizes = {
    sm: 'w-9 h-9 text-[8px]',
    md: 'w-12 h-12 sm:w-14 sm:h-14 text-[9px] sm:text-[10px]',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 text-[10px] sm:text-[11px]'
  }[size];

  return (
    <div
      className={`relative select-none pointer-events-none ${sizeClasses} rounded-full flex items-center justify-center ${className}`}
      title="Unidades esgotadas há pouco tempo"
    >
      {/* Sombra de profundidade e brilho feminino de veludo marrom */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2C1D15] via-[#433026] to-[#5C4334] p-[2px] shadow-[0_10px_25px_rgba(44,29,21,0.45),inset_0_1px_2px_rgba(255,255,255,0.25)] border border-[#C5A059]/40">
        <div className="w-full h-full rounded-full bg-[#35251C] relative overflow-hidden flex items-center justify-center">
          
          {/* Textura sutil de luz */}
          <div className="absolute inset-0 bg-radial from-[#C5A059]/15 via-transparent to-black/30 pointer-events-none" />

          {/* Anel giratório com o texto circular "UNIDADES ESGOTADAS HÁ POUCO TEMPO" */}
          <div className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite]">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <path
                  id="soldOutCirclePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
              </defs>
              <text
                fill="#E8DFD3"
                className="font-sans font-bold tracking-[0.16em] uppercase"
                style={{ fontSize: '7.8px' }}
              >
                <textPath
                  href="#soldOutCirclePath"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {label}
                </textPath>
              </text>
            </svg>
          </div>

          {/* Núcleo Central Nobre (Fixo com Monograma e Status) */}
          <div
            className={`relative z-10 ${centerSizes} rounded-full bg-gradient-to-br from-[#4A362B] via-[#2F1F17] to-[#1F140E] border border-[#D4AF37]/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center p-1 text-center`}
          >
            {/* Ícone de brilho dourado */}
            <span className="text-[#E5C158] text-[9px] leading-none mb-0.5">✦</span>
            
            {/* Texto central elegante */}
            <span className="font-serif text-[#FAF5EE] uppercase font-bold tracking-wider text-[8px] sm:text-[9px] leading-tight">
              Esgotado
            </span>
            <span className="font-sans text-[6px] sm:text-[6.5px] uppercase tracking-widest text-[#D4AF37] font-semibold leading-none mt-0.5">
              Há Pouco
            </span>
          </div>

        </div>
      </div>

      {/* Pequeno detalhe brilhante externo de joalheria */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF0B8] shadow-[0_0_8px_rgba(212,175,55,0.8)] border border-white/60 pointer-events-none" />
    </div>
  );
};
