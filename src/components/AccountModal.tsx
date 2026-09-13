import React, { useState } from 'react';
import { X, User, ShoppingBag, Heart, Lock, KeyRound } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#F7F4EF] text-[#3D3229] rounded-xs shadow-2xl border border-[#BFAE9C]/30 overflow-hidden animate-in zoom-in-95 duration-300 p-8 space-y-6">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#3D3229]/60 hover:text-[#3D3229] bg-white/80 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isLoggedIn ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#7A5B43] text-white flex items-center justify-center mx-auto text-xl font-serif">
                  {email[0]?.toUpperCase() || 'M'}
                </div>
                <h3 className="font-serif text-2xl text-[#3D3229]">Minha Conta Maison</h3>
                <p className="font-sans text-xs text-[#7A5B43] font-light">{email}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#BFAE9C]/25 text-xs font-sans">
                <div className="p-4 bg-white/80 border border-[#BFAE9C]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#7A5B43]" />
                    <span>Meus Pedidos & Rastreio</span>
                  </div>
                  <span className="text-[10px] uppercase bg-[#E8E0D4] px-2 py-0.5 font-medium">1 Ativo</span>
                </div>

                <div className="p-4 bg-white/80 border border-[#BFAE9C]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-[#7A5B43]" />
                    <span>Lista de Desejos</span>
                  </div>
                  <span className="text-[10px] uppercase bg-[#E8E0D4] px-2 py-0.5 font-medium">3 Itens</span>
                </div>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full py-3 bg-[#E8E0D4] hover:bg-[#BFAE9C] text-[#3D3229] text-xs uppercase tracking-widest font-medium transition-colors"
              >
                Sair da Conta
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A5B43] font-semibold block">
                  Acesso Restrito
                </span>
                <h3 className="font-serif text-2xl text-[#3D3229]">Minha Conta</h3>
                <p className="font-sans text-xs text-[#3D3229]/70 font-light">
                  Acesse suas correspondências, pedidos anteriores e itens salvos.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-[#7A5B43] block">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full px-4 py-3 bg-white border border-[#BFAE9C]/40 text-xs font-sans text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-[#7A5B43] block">Senha</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white border border-[#BFAE9C]/40 text-xs font-sans text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#7A5B43] hover:bg-[#3D3229] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-md"
                >
                  Entrar na Minha Conta
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
