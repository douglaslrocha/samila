import React, { useState, useEffect, useRef } from 'react';
import { CartItem, StoreCustomizationSettings } from '../types';
import { getStoreName, getStoreWhatsapp } from '../utils/storeIdentity';
import { X, Trash2, Plus, Minus, Gift, ArrowRight, Check, Sparkles } from 'lucide-react';
import { ExclusiveConciergeCheckoutModal } from './ExclusiveConciergeCheckoutModal';
import { StackedProductMedia } from './StackedProductMedia';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  storeSettings?: StoreCustomizationSettings;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  storeSettings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [giftNote, setGiftNote] = useState('');
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isExclusiveModalOpen, setIsExclusiveModalOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fechar sacola ao pressionar a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isExclusiveModalOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExclusiveModalOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasPromoDiscount = totalItemCount >= 3;
  const discountAmount = hasPromoDiscount ? Math.round(subtotal * 0.14) : 0;
  const shipping = (subtotal - discountAmount) > 300 ? 0 : 25;
  const total = subtotal - discountAmount + (isGiftWrap ? 15 : 0) + (subtotal > 0 ? shipping : 0);

  const handleCheckout = () => {
    setIsCheckedOut(true);
    setTimeout(() => {
      onClearCart();
      setIsCheckedOut(false);
      onClose();
    }, 2800);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={(e) => {
        // Se clicar em qualquer área fora do drawer, fecha
        if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      {/* Backdrop com cursor pointer */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300 cursor-pointer"
        aria-label="Fechar sacola ao clicar fora"
      />

      {/* Drawer Wrapper */}
      <div
        onClick={(e) => {
          if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
            onClose();
          }
        }}
        className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10"
      >
        <div
          ref={drawerRef}
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-[#F7F4EF] text-[#3D3229] shadow-2xl flex flex-col justify-between border-l border-[#BFAE9C]/30 animate-in slide-in-from-right duration-300 cursor-default"
        >
          
          {/* Drawer Header (Compacto, Nobre & com Imagem da Logo da Maison) */}
          <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-[#FAF7F2] border-b border-[#3D3229]/10 flex items-center justify-between relative shadow-[0_1px_6px_rgba(33,30,27,0.03)] shrink-0">
            {/* Lado Esquerdo: Imagem da Logo Oficial + Identidade Editorial */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Selo Circular da Maison com anel dourado sutil */}
              <div className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full border border-[#876742]/40 bg-[#FDFBF8] p-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0">
                <img
                  src="/images/maison-logo.svg"
                  alt="Maison Entrelaço"
                  className="w-full h-full object-contain select-none filter contrast-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== `${window.location.origin}/images/maison-logo.svg`) {
                      target.src = '/images/maison-logo.svg';
                    }
                  }}
                />
              </div>

              {/* Textos Editoriais com Proporção Compacta & Elegante */}
              <div className="flex flex-col justify-center">
                <span className="font-sans text-[8.5px] sm:text-[9px] tracking-[0.24em] text-[#876742] uppercase font-medium leading-none">
                  Atelier · Seleção
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <h3 className="font-serif text-base sm:text-lg text-[#211E1B] font-normal leading-tight tracking-wide">
                    Sacola da Maison
                  </h3>
                  {totalItemCount > 0 && (
                    <span className="text-[10px] sm:text-[10.5px] text-[#7A5B43]/80 font-sans font-light">
                      ({totalItemCount} {totalItemCount === 1 ? 'peça' : 'peças'})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Lado Direito: Botão Fechar de Alta Joalheria */}
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-[#DFD6C9] bg-white/80 hover:bg-white text-[#3D3229] hover:text-[#211E1B] hover:border-[#876742] shadow-2xs hover:shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label="Fechar sacola"
              title="Fechar sacola"
            >
              <X className="w-4 h-4 stroke-[1.4]" />
            </button>

            {/* Linha de acabamento dourada/bronze ultra-sutil na base */}
            <div className="absolute bottom-0 left-4 right-4 h-[0.5px] bg-gradient-to-r from-transparent via-[#876742]/25 to-transparent pointer-events-none" />
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 sm:space-y-6">
            {isCheckedOut ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#6F775C]/20 border border-[#6F775C] text-[#6F775C] flex items-center justify-center mb-2">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl text-[#3D3229]">Pedido Confirmado</h4>
                <p className="font-sans text-xs text-[#3D3229]/80 max-w-xs font-light leading-relaxed">
                  Agradecemos a sua preferência. Nosso atelier está preparando seu pacote com selo de cera e fragrância exclusiva.
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16 text-[#3D3229]/60">
                <p className="font-serif text-xl italic text-[#7A5B43]">Sua sacola está vazia.</p>
                <p className="font-sans text-xs max-w-xs font-light">
                  Explore nossas coleções de velas aromáticas, sabonetes botânicos e crochês artesanais para preencher o seu espaço.
                </p>
              </div>
            ) : (
              <>
                {/* 14% OFF Combo Promotion Banner */}
                <div className={`p-4 sm:p-3.5 rounded-xl border shadow-[0_2px_8px_rgba(61,50,41,0.04)] transition-all duration-300 ${
                  hasPromoDiscount
                    ? 'bg-gradient-to-r from-[#9E4624]/15 via-[#B85728]/15 to-[#8C3B1C]/15 border-[#B85728]/40 text-[#542B16]'
                    : 'bg-[#ECE5DB]/70 border-[#D8CDBC] text-[#4A3E33]'
                }`}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B85728]" />
                      {hasPromoDiscount
                        ? 'Desconto Especial Ativado: 14% OFF!'
                        : `Leve 3 e ganhe 14% OFF (${totalItemCount}/3 adicionados)`}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/70">
                      {Math.min(totalItemCount, 3)}/3
                    </span>
                  </div>

                  {/* 3-Step Mini Progress Track: 3 tons sólidos quentes e escuros radiando força */}
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {[1, 2, 3].map((step) => {
                      const isReached = totalItemCount >= step;
                      // 3 tons sólidos invertidos: começa no tom mais escuro e profundo e transita em direção ao terracota
                      const solidWarmTones = [
                        'bg-[#64140A]', // Tom 1: o tom mais quente escuro, profundo e com máxima força
                        'bg-[#8C2E13]', // Tom 2: quente intermediário, denso e encorpado
                        'bg-[#B85728]'  // Tom 3: cor terracota da Maison
                      ];

                      return (
                        <div
                          key={step}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isReached
                              ? solidWarmTones[step - 1]
                              : 'bg-black/10'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {!hasPromoDiscount && (
                    <p className="text-[10px] text-[#786656] mt-1.5 font-light">
                      Falta apenas {3 - totalItemCount} item{3 - totalItemCount > 1 ? 's' : ''} na sacola para liberar 14% de desconto automático!
                    </p>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-4.5 sm:p-4 bg-white/80 border border-[#BFAE9C]/30 rounded-[6px] shadow-[0_4px_16px_rgba(61,50,41,0.06),0_1px_3px_rgba(61,50,41,0.04)]"
                    >
                      {/* Pilha de Imagens com Volume Real e Beiradas Sobrepostas (até 5 mídias) */}
                      <StackedProductMedia product={item.product} />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-base text-[#3D3229] font-normal leading-snug">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-[#3D3229]/40 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] font-sans text-[#7A5B43] uppercase tracking-wider mt-0.5">
                            {item.product.categoryLabel}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#BFAE9C]/35 rounded-[6px] bg-[#F7F4EF] shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="p-1 text-[#3D3229]/70 hover:text-[#3D3229]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-sans font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="p-1 text-[#3D3229]/70 hover:text-[#3D3229]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-serif text-base text-[#7A5B43] font-medium">
                            R$ {(item.product.price * item.quantity).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gift Option Section */}
                <div className="p-4 bg-[#E8E0D4]/40 border border-[#BFAE9C]/30 space-y-3 rounded-xs">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGiftWrap}
                      onChange={(e) => setIsGiftWrap(e.target.checked)}
                      className="rounded border-[#BFAE9C] text-[#7A5B43] focus:ring-0"
                    />
                    <div className="flex items-center gap-2 text-xs font-sans text-[#3D3229] font-medium">
                      <Gift className="w-4 h-4 text-[#7A5B43]" />
                      <span>Embalagem Especial de Presente com Lacre (+R$ 15)</span>
                    </div>
                  </label>

                  {isGiftWrap && (
                    <textarea
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Escreva uma mensagem personalizada para o cartão de caligrafia..."
                      className="w-full p-3 bg-[#F7F4EF] border border-[#BFAE9C]/40 text-xs font-sans text-[#3D3229] focus:outline-none focus:border-[#7A5B43] h-20 resize-none"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Summary Sofisticado e Compacto */}
          {cart.length > 0 && !isCheckedOut && (
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-[#DFD6C9] bg-[#FAF7F2]/95 backdrop-blur-md shadow-[0_-6px_20px_rgba(40,30,20,0.05)] space-y-2.5">
              {/* Micro-Linhas de Resumo Elegantes e Enxutas */}
              <div className="space-y-1 text-[11px] font-sans text-[#6E5D4F]">
                <div className="flex justify-between items-center">
                  <span className="font-light">Subtotal</span>
                  <span className="font-normal text-[#3D3229]">R$ {subtotal.toLocaleString('pt-BR')}</span>
                </div>

                {hasPromoDiscount && (
                  <div className="flex justify-between items-center text-[#8C2E13] font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Desconto Especial (14% OFF)
                    </span>
                    <span>- R$ {discountAmount.toLocaleString('pt-BR')}</span>
                  </div>
                )}

                {isGiftWrap && (
                  <div className="flex justify-between items-center">
                    <span className="font-light">Embalagem de Presente</span>
                    <span className="font-normal text-[#3D3229]">R$ 15,00</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="font-light">Envio Especial</span>
                  <span className="text-[10px] text-[#545E42] bg-[#6F775C]/12 px-1.5 py-0.5 rounded-full font-medium">
                    {shipping === 0 ? 'Cortesia da Maison' : `R$ ${shipping},00`}
                  </span>
                </div>
              </div>

              {/* Barra Integrada de Fechamento: Total em Evidência + Botão de Ação Ergonômico */}
              <div className="pt-2 border-t border-[#DFD6C9]/80 flex items-center justify-between gap-3">
                <div className="shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] uppercase tracking-[0.16em] text-[#8C7A6B] font-medium">
                      Total
                    </span>
                    {hasPromoDiscount && (
                      <span className="text-[8.5px] px-1 py-0.2 rounded-xs bg-[#8C2E13]/10 text-[#8C2E13] font-medium">
                        14% OFF
                      </span>
                    )}
                  </div>
                  <div className="text-lg sm:text-xl font-serif font-semibold text-[#211E1B] leading-tight">
                    R$ {total.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[9px] text-[#8C7A6B] font-light block -mt-0.5">
                    3x de R$ {Math.round(total / 3).toLocaleString('pt-BR')} s/ juros
                  </span>
                </div>

                <button
                  onClick={() => setIsExclusiveModalOpen(true)}
                  className="flex-1 max-w-[210px] sm:max-w-[230px] h-10.5 sm:h-11 bg-[#211E1B] hover:bg-[#382E26] active:scale-[0.98] text-[#F7F4EF] text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer rounded-[6px] group"
                >
                  <span>Iniciar Pedido</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5C384] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal Central de Atendimento Pessoal & Exclusivo no WhatsApp */}
      <ExclusiveConciergeCheckoutModal
        isOpen={isExclusiveModalOpen}
        onClose={() => setIsExclusiveModalOpen(false)}
        cart={cart}
        subtotal={subtotal}
        discountAmount={discountAmount}
        shipping={shipping}
        isGiftWrap={isGiftWrap}
        giftNote={giftNote}
        total={total}
        storeName={getStoreName(storeSettings)}
        whatsappNumber={getStoreWhatsapp(storeSettings)}
        onCompletedOrder={() => {
          setIsExclusiveModalOpen(false);
        }}
      />
    </div>
  );
};
