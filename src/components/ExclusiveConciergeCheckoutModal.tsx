import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface ExclusiveConciergeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  discountAmount: number;
  shipping: number;
  isGiftWrap: boolean;
  giftNote: string;
  total: number;
  whatsappNumber?: string;
  storeName?: string;
  onCompletedOrder?: () => void;
}

export const ExclusiveConciergeCheckoutModal: React.FC<ExclusiveConciergeCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discountAmount,
  shipping,
  isGiftWrap,
  giftNote,
  total,
  whatsappNumber,
  storeName = 'Maison Entrelaço',
  onCompletedOrder
}) => {
  const [progressPercent, setProgressPercent] = useState(0);
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  // Quantidade total de itens
  const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);
  const brandTitle = storeName.toUpperCase();

  // Mensagem sofisticada formatada para o WhatsApp com todos os itens da sacola
  const buildWhatsAppMessage = () => {
    const itemsList = cart
      .map((item, index) => {
        const unitPrice = item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const itemTotal = (item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const category = item.product.categoryLabel ? ` (${item.product.categoryLabel})` : '';
        return `${index + 1}. *${item.quantity}x ${item.product.name}*${category}\n   R$ ${itemTotal} (R$ ${unitPrice} un)`;
      })
      .join('\n\n');

    let extraDetails = '';
    if (discountAmount > 0) {
      extraDetails += `\n🏷️ *Desconto Especial (14% OFF):* - R$ ${discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    if (isGiftWrap) {
      extraDetails += `\n🎁 *Embalagem de Presente com Lacre (+ R$ 15,00)*`;
      if (giftNote.trim()) {
        extraDetails += `\n   _Dedicatória:_ "${giftNote.trim()}"`;
      }
    }
    extraDetails += `\n🚚 *Envio:* ${shipping === 0 ? 'Cortesia da Loja' : `R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}`;
    extraDetails += `\n\n✨ *VALOR TOTAL: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*`;

    return `Olá! Gostaria de iniciar meu pedido na *${brandTitle}* com os itens que separei na sacola:\n\n🛍️ *ITENS DO PEDIDO (${totalPieces} ${
      totalPieces === 1 ? 'item' : 'itens'
    }):*\n\n${itemsList}\n\n----------------------------${extraDetails}\n----------------------------\n\nPoderia me informar as opções de entrega e dados para pagamento? Muito obrigado(a)!`;
  };

  const cleanPhone = (whatsappNumber || '5511987654321').replace(/\D/g, '');
  const message = buildWhatsAppMessage();
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

  // Tempo ideal para ler e entender com naturalidade (~3.6 segundos), sem cronômetro visível
  useEffect(() => {
    if (!isOpen) {
      setProgressPercent(0);
      return;
    }

    setProgressPercent(0);
    const startTime = Date.now();
    const durationMs = 3600; // 3.6 segundos: tempo equilibrado para leitura e assimilação

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / durationMs) * 100);
      setProgressPercent(progress);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        try {
          if (anchorRef.current) {
            anchorRef.current.click();
          }
        } catch {
          // Fallback silencioso
        }
      }
    }, 40);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-hidden flex items-center justify-center p-4 select-none">
      {/* Link invisível seguro com target="_blank" para o WhatsApp */}
      <a
        ref={anchorRef}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden"
        aria-hidden="true"
        onClick={() => {
          if (onCompletedOrder) onCompletedOrder();
        }}
      >
        WhatsApp
      </a>

      {/* Backdrop com Vidro Escuro e Atmosfera Intimista */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0F0D0B]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      {/* Cartão de Aviso Reluzente: Compacto, Sublime & Sem Contagens Regressivas */}
      <div className="relative w-full max-w-[330px] sm:max-w-[350px] bg-gradient-to-b from-[#1E1915] via-[#26201B] to-[#1A1512] rounded-2xl p-7 text-center border border-[#D4AF37] luxury-glow-card animate-in zoom-in-95 duration-300 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Luzes de Fundo Reluzentes em Ouro Nobre */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#FFDF80]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Botão Fechar Minimalista */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full border border-[#D4AF37]/40 bg-[#16120F]/80 hover:bg-[#16120F] text-[#D4AF37] hover:text-[#FFF3D1] shadow-xs flex items-center justify-center transition-transform active:scale-90 cursor-pointer focus:outline-none z-20"
          aria-label="Fechar"
        >
          <X className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>

        {/* Emblema Circular da Maison com Halo Dourado Pulsante */}
        <div className="relative mx-auto mb-5 w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/40 via-[#FFDF80]/60 to-[#D4AF37]/40 animate-ping opacity-35 pointer-events-none" />
          
          <div className="relative w-15 h-15 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#FAF6F0] to-[#EFE7DC] p-1 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center">
            <img
              src="/images/maison-logo.svg"
              alt="Maison Entrelaço"
              className="w-full h-full object-contain filter contrast-110"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== `${window.location.origin}/images/maison-logo.svg`) {
                  target.src = '/images/maison-logo.svg';
                }
              }}
            />

            {/* Micro Selo Dourado Reluzente */}
            <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-[#D4AF37] text-[#1E1915] border border-[#FFF3D1] shadow-[0_0_8px_rgba(255,223,128,0.8)] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-[#1E1915] fill-[#1E1915]" />
            </div>
          </div>
        </div>

        {/* Micro Tag Nobre */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[9px] font-sans uppercase tracking-[0.24em] font-medium text-[#FFDF80] mb-3 shadow-[0_0_12px_rgba(212,175,55,0.2)]">
          <Sparkles className="w-2.5 h-2.5 text-[#FFDF80]" />
          <span>Maison Privilège</span>
        </div>

        {/* Frase Principal com Efeito Reluzente (Shimmer Dourado) */}
        <h3 className="font-serif text-xl sm:text-[22px] leading-snug font-normal mb-2.5 px-1 luxury-text-shimmer">
          Agora você será redirecionado para a consultoria e atendimento premium.
        </h3>

        {/* Linha de Luz Reluzente com Transição Delicada */}
        <div className="w-28 h-[1.5px] mx-auto bg-[#D4AF37]/20 rounded-full overflow-hidden my-3.5 relative">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3D1] to-[#D4AF37] rounded-full transition-all duration-75 shadow-[0_0_10px_#FFDF80]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Mensagem Complementar Suave */}
        <p className="font-serif text-[12px] text-[#D8C6B2] italic leading-relaxed mb-5">
          Conectando seu pedido diretamente ao nosso concierge exclusivo no WhatsApp...
        </p>

        {/* Botão Reluzente Limpo (Sem contagem de segundos) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (onCompletedOrder) onCompletedOrder();
          }}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] via-[#F3E2A9] to-[#D4AF37] hover:from-[#E5C158] hover:to-[#E5C158] active:scale-98 text-[#1A140E] text-[11px] uppercase tracking-[0.22em] font-semibold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.45)] hover:shadow-[0_0_30px_rgba(255,223,128,0.7)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-[#FFFDF8] group"
        >
          <MessageCircle className="w-4 h-4 text-[#1A140E] fill-[#1A140E]" />
          <span>Acessar Consultoria Agora</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#1A140E] group-hover:translate-x-1 transition-transform" />
        </a>

      </div>
    </div>
  );
};
