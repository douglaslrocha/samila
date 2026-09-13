import React, { useState } from 'react';
import { FEATURED_PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const productList = products && products.length > 0 ? products : FEATURED_PRODUCTS;

  const matchedProducts = query.trim() === ''
    ? []
    : productList.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.shortStory.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
        p.details.some(d => d.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-start justify-center pt-20 px-4 pb-12">
        <div className="relative w-full max-w-2xl bg-[#F7F4EF] text-[#3D3229] rounded-xs shadow-2xl border border-[#BFAE9C]/30 overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header Input */}
          <div className="p-5 sm:p-6 border-b border-[#BFAE9C]/30 flex items-center gap-4 bg-white/80">
            <Search className="w-5 h-5 text-[#7A5B43]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por velas, sabonetes, crochês ou aromas..."
              className="w-full bg-transparent font-serif text-lg sm:text-xl text-[#3D3229] placeholder-[#3D3229]/40 focus:outline-none"
            />
            <button onClick={onClose} className="p-2 text-[#3D3229]/60 hover:text-[#3D3229]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Results */}
          <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
            {query.trim() === '' ? (
              <div className="space-y-4">
                <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5B43] font-medium block">
                  Criações da Maison
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Jardim de Versailles', 'Sabonete de Camomila', 'Crochê Oliva', 'Velas Aromáticas', 'Cera de Coco', 'Lavanda Real'].map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 bg-[#E8E0D4]/50 hover:bg-[#7A5B43] hover:text-[#F7F4EF] text-xs font-sans text-[#3D3229] transition-colors border border-[#BFAE9C]/30 rounded-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : matchedProducts.length === 0 ? (
              <div className="py-10 text-center text-[#3D3229]/60 space-y-2">
                <p className="font-serif text-lg">Nenhuma criação encontrada para “{query}”.</p>
                <p className="font-sans text-xs font-light">Tente buscar por vela, sabonete, linho, crochê ou lavanda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5B43] font-medium block">
                  Objetos Encontrados ({matchedProducts.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchedProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 bg-white/70 hover:bg-white border border-[#BFAE9C]/30 cursor-pointer transition-all rounded-xs group"
                    >
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover bg-[#E8E0D4] rounded-xs"
                      />
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#7A5B43] font-medium block">
                          {product.categoryLabel}
                        </span>
                        <h4 className="font-serif text-sm text-[#3D3229] group-hover:text-[#7A5B43] font-medium">
                          {product.name}
                        </h4>
                        <p className="font-sans text-xs text-[#3D3229]/80 font-medium mt-0.5">
                          R$ {product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

