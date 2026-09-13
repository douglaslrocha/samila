import React, { useState } from 'react';
import { X, Send, Check, MessageSquare, PhoneCall, MessageCircle } from 'lucide-react';
import { StoreCustomizationSettings } from '../types';
import { getStoreName, getStoreWhatsapp } from '../utils/storeIdentity';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeSettings?: StoreCustomizationSettings;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, storeSettings }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const storeName = getStoreName(storeSettings);
  const whatsappNumber = getStoreWhatsapp(storeSettings);
  const cleanPhone = whatsappNumber.replace(/\D/g, '') || '5511987654321';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2500);
  };

  const handleOpenWhatsappDirect = () => {
    const defaultText = encodeURIComponent(`Olá equipe do Atelier ${storeName}! Gostaria de tirar uma dúvida sobre os produtos artesanais.`);
    window.open(`https://wa.me/${cleanPhone}?text=${defaultText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#F7F4EF] text-[#3D3229] rounded-xs shadow-2xl border border-[#BFAE9C]/30 overflow-hidden animate-in zoom-in-95 duration-300 p-8 space-y-6">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#3D3229]/60 hover:text-[#3D3229] bg-white/80 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A5B43] font-semibold block">
              Concierge do Atelier
            </span>
            <h3 className="font-serif text-3xl text-[#3D3229]">Atendimento Personalizado</h3>
            <p className="font-sans text-xs text-[#3D3229]/70 font-light max-w-xs mx-auto">
              Sua dúvida, encomenda personalizada ou convite especial será respondida diretamente pela equipe de curadoria do atelier {storeName}.
            </p>
          </div>

          {/* Botão de Acesso Imediato ao WhatsApp Oficial */}
          <div className="bg-[#241E1A] p-4 rounded-xs border border-[#7A5B43]/40 text-center space-y-2">
            <p className="text-[11px] text-[#E8E0D4] font-light">
              Prefere atendimento instantâneo pelo WhatsApp?
            </p>
            <button
              onClick={handleOpenWhatsappDirect}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white text-xs uppercase tracking-wider font-medium rounded-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar no WhatsApp ({whatsappNumber})</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#BFAE9C]/30 w-full" />
            <span className="bg-[#F7F4EF] px-3 text-[10px] uppercase tracking-widest text-[#7A5B43] shrink-0 font-medium">
              Ou envie uma mensagem
            </span>
            <div className="border-t border-[#BFAE9C]/30 w-full" />
          </div>

          {sent ? (
            <div className="py-12 text-center space-y-3 bg-[#6F775C]/10 border border-[#6F775C]/30 p-6 text-[#6F775C]">
              <Check className="w-8 h-8 mx-auto" />
              <h4 className="font-serif text-xl">Mensagem Enviada com Sucesso</h4>
              <p className="font-sans text-xs text-[#3D3229]/80">Retornaremos em até 24 horas úteis.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-sans tracking-widest text-[#7A5B43] block">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 bg-white border border-[#BFAE9C]/40 text-xs font-sans text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-sans tracking-widest text-[#7A5B43] block">Mensagem ou Pedido</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Como podemos auxiliá-la hoje?"
                  className="w-full px-4 py-3 bg-white border border-[#BFAE9C]/40 text-xs font-sans text-[#3D3229] focus:outline-none focus:border-[#7A5B43] h-24 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#7A5B43] hover:bg-[#3D3229] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar para o Concierge</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
