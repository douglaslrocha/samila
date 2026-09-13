import React from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { GiftPresentationSettings } from '../types';

interface GiftFloatingTagProps {
  onOpen: () => void;
  settings?: GiftPresentationSettings;
}

export const GiftFloatingTag: React.FC<GiftFloatingTagProps> = ({
  onOpen,
  settings
}) => {
  // If explicitly disabled in settings, don't render
  if (settings && settings.floatingButtonEnabled === false) {
    return null;
  }

  const label = settings?.floatingButtonLabel || 'Apresentação';
  const position = settings?.floatingButtonPosition || 'bottom-left';

  const positionClasses = position === 'bottom-right'
    ? 'bottom-4 right-4 sm:bottom-6 sm:right-6'
    : 'bottom-4 left-3 sm:bottom-6 sm:left-6';

  return (
    <div className={`fixed ${positionClasses} z-40 select-none group`}>
      <button
        onClick={onOpen}
        className="relative flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#2B1A1B]/95 via-[#3E2123]/95 to-[#241314]/95 text-[#FAF5EE] border border-[#E5BBA5]/50 shadow-[0_4px_14px_rgba(43,26,27,0.35)] hover:shadow-[0_6px_18px_rgba(229,187,165,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-xs"
        title="Assistir à apresentação"
        aria-label={label}
      >
        {/* Tiny Gift Icon with subtle pulse */}
        <div className="relative w-4 h-4 rounded-full bg-gradient-to-tr from-[#E5BBA5] via-[#D4AF37] to-[#FFF2E0] flex items-center justify-center text-[#2B1A1B] shrink-0 shadow-xs">
          <Gift className="w-2.5 h-2.5" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </div>

        {/* Tiny Label */}
        <span className="font-serif text-[10.5px] sm:text-[11px] font-medium tracking-wider text-[#FAF6F2] leading-none flex items-center gap-1">
          <span>{label}</span>
          <Sparkles className="w-2.5 h-2.5 text-[#D4AF37] opacity-80" />
        </span>
      </button>
    </div>
  );
};
