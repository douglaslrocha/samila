import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { RecentlySoldOutBadge } from '../RecentlySoldOutBadge';
import { deleteProductFromSupabase, uploadImageToSupabase } from '../../lib/supabase';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Upload,
  Check,
  X,
  Sparkles,
  DollarSign,
  Image as ImageIcon,
  Flame,
  Droplets,
  Scissors,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Tag
} from 'lucide-react';

interface AdminProductManagerProps {
  products: Product[];
  onUpdateProducts?: (products: Product[]) => void;
  onSelectProductPreview?: (product: Product) => void;
}

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  products,
  onUpdateProducts,
  onSelectProductPreview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'velas' | 'sabonetes' | 'croche'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortStory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Save Product (create or update)
  const handleSaveProduct = (productData: Product) => {
    if (!onUpdateProducts) return;
    
    const exists = products.some(p => p.id === productData.id);
    let updatedList: Product[];
    
    if (exists) {
      updatedList = products.map(p => p.id === productData.id ? productData : p);
    } else {
      updatedList = [productData, ...products];
    }

    onUpdateProducts(updatedList);
    setEditingProduct(null);
    setIsNewProductModalOpen(false);
  };

  // Handle Delete Product
  const handleDeleteProduct = (id: string) => {
    if (!onUpdateProducts) return;
    const updatedList = products.filter(p => p.id !== id);
    onUpdateProducts(updatedList);
    deleteProductFromSupabase(id).catch(console.warn);
    setDeleteConfirmId(null);
  };

  // Quick price updater
  const handleQuickPriceChange = (id: string, newPrice: number) => {
    if (!onUpdateProducts || isNaN(newPrice)) return;
    const updatedList = products.map(p => p.id === id ? { ...p, price: newPrice } : p);
    onUpdateProducts(updatedList);
  };

  // Alternar selo de unidades esgotadas há pouco tempo diretamente na tabela
  const handleToggleRecentlySoldOut = (id: string, currentStatus?: boolean) => {
    if (!onUpdateProducts) return;
    const updatedList = products.map(p => p.id === id ? { ...p, recentlySoldOut: !currentStatus } : p);
    onUpdateProducts(updatedList);
  };

  // Handle image upload inside edit modal
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'primaryImage' | 'secondaryImage') => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    try {
      const url = await uploadImageToSupabase(file, 'products');
      setEditingProduct(prev => prev ? {
        ...prev,
        [targetField]: url
      } : null);
    } catch (err) {
      console.warn('Erro ao enviar imagem do produto:', err);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'velas':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
            <Flame className="w-3 h-3 text-amber-600" />
            <span>Casa I • Velas</span>
          </span>
        );
      case 'sabonetes':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
            <Droplets className="w-3 h-3 text-emerald-600" />
            <span>Casa II • Sabonetes</span>
          </span>
        );
      case 'croche':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-900 border border-stone-300">
            <Scissors className="w-3 h-3 text-stone-600" />
            <span>Casa III • Crochê</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-800">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xs border border-[#BFAE9C]/35 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#7A5B43] mb-1">
            <Package className="w-4 h-4" />
            <span className="text-[10.5px] uppercase tracking-widest font-semibold">
              Gestão do Catálogo Artesanal
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#2C231C] font-normal">
            Produtos & As Três Casas
          </h3>
          <p className="text-xs text-[#7A5B43] mt-0.5">
            Total de {products.length} obras cadastradas com fotos, preços e narrativas poéticas sincronizadas em tempo real.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct({
              id: `prod-${Date.now()}`,
              name: '',
              category: 'velas',
              categoryLabel: 'Casa I • Velas Aromáticas',
              price: 180,
              shortStory: '',
              fullStory: '',
              primaryImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85',
              secondaryImage: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=800&q=85',
              details: ['Cera 100% Vegetal', 'Pavio de Algodão Puro', 'Feito à Mão no Atelier'],
              fragranceNotes: {
                top: 'Figo da Sicília',
                heart: 'Âmbar Dourado',
                base: 'Madeiras Nobres'
              }
            });
            setIsNewProductModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/35 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Input de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A5B43] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome da obra, notas olfativas ou história..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A5B43] hover:text-[#2C231C]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botões de Categoria */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-xs border transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#3D3229] text-white border-[#3D3229] font-medium shadow-xs'
                : 'bg-[#FAF8F5] text-[#3D3229] border-[#BFAE9C]/50 hover:bg-[#E8E0D4]'
            }`}
          >
            Todas ({products.length})
          </button>
          <button
            onClick={() => setSelectedCategory('velas')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-xs border transition-all ${
              selectedCategory === 'velas'
                ? 'bg-amber-800 text-white border-amber-800 font-medium shadow-xs'
                : 'bg-[#FAF8F5] text-[#3D3229] border-[#BFAE9C]/50 hover:bg-[#E8E0D4]'
            }`}
          >
            Casa I • Velas
          </button>
          <button
            onClick={() => setSelectedCategory('sabonetes')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-xs border transition-all ${
              selectedCategory === 'sabonetes'
                ? 'bg-emerald-800 text-white border-emerald-800 font-medium shadow-xs'
                : 'bg-[#FAF8F5] text-[#3D3229] border-[#BFAE9C]/50 hover:bg-[#E8E0D4]'
            }`}
          >
            Casa II • Sabonetes
          </button>
          <button
            onClick={() => setSelectedCategory('croche')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-xs border transition-all ${
              selectedCategory === 'croche'
                ? 'bg-[#5C4D41] text-white border-[#5C4D41] font-medium shadow-xs'
                : 'bg-[#FAF8F5] text-[#3D3229] border-[#BFAE9C]/50 hover:bg-[#E8E0D4]'
            }`}
          >
            Casa III • Crochê
          </button>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-xs border border-[#BFAE9C]/35 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 mx-auto text-[#BFAE9C]" />
            <h4 className="font-serif text-base text-[#3D3229]">Nenhum produto encontrado</h4>
            <p className="text-xs text-[#7A5B43]">
              Tente redefinir o termo de busca ou adicionar um novo item ao catálogo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#BFAE9C]/30 text-[10.5px] uppercase tracking-wider text-[#7A5B43] font-semibold">
                  <th className="p-3.5 pl-5">Obra / Foto</th>
                  <th className="p-3.5">Casa & Categoria</th>
                  <th className="p-3.5">Preço (R$)</th>
                  <th className="p-3.5">Status / Selo</th>
                  <th className="p-3.5">História Curta</th>
                  <th className="p-3.5 text-right pr-5">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BFAE9C]/20 text-xs text-[#3D3229]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Imagem + Nome */}
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-xs overflow-hidden bg-[#E8E0D4] border border-[#BFAE9C]/40 shrink-0 shadow-2xs">
                          <img
                            src={product.primaryImage}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-serif text-sm font-medium text-[#2C231C] block truncate">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-[#7A5B43] font-mono block">
                            ID: {product.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getCategoryBadge(product.category)}
                    </td>

                    {/* Preço com edição rápida inline */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-serif font-semibold text-[#2C231C] text-sm">
                        <span>R$</span>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handleQuickPriceChange(product.id, parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 text-xs font-semibold bg-[#FAF8F5] border border-[#BFAE9C]/40 rounded-xs focus:border-[#7A5B43] focus:outline-none"
                          title="Clique para editar o preço diretamente"
                        />
                      </div>
                    </td>

                    {/* Selo: Unidades Esgotadas Há Pouco Tempo (Toggle Direto) */}
                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleRecentlySoldOut(product.id, product.recentlySoldOut)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                          product.recentlySoldOut
                            ? 'bg-[#38261C] text-[#F9F4EE] border border-[#C5A059]/50 shadow-xs hover:bg-[#2A1C14]'
                            : 'bg-[#FAF8F5] text-[#8C7665] border border-[#D5C9BC] hover:bg-[#EDE5DA] hover:text-[#433226]'
                        }`}
                        title="Clique para marcar/desmarcar: 'Unidades esgotadas há pouco tempo'"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.recentlySoldOut ? 'bg-[#E5C158] animate-pulse' : 'bg-[#B0A193]'}`} />
                        <span>{product.recentlySoldOut ? 'Esgotado Há Pouco' : 'Disponível'}</span>
                      </button>
                    </td>

                    {/* História / Sinopse */}
                    <td className="p-3.5 max-w-xs">
                      <p className="text-[11px] text-[#7A5B43] line-clamp-2 leading-relaxed italic font-serif">
                        “{product.shortStory || product.fullStory || 'Sem narrativa cadastrada.'}”
                      </p>
                    </td>

                    {/* Ações */}
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProduct({ ...product });
                            setIsNewProductModalOpen(false);
                          }}
                          className="p-1.5 bg-[#FAF8F5] hover:bg-[#E8E0D4] text-[#3D3229] rounded-xs border border-[#BFAE9C]/50 transition-colors"
                          title="Editar todos os dados do produto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xs border border-rose-200 transition-colors"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL DE EDIÇÃO OU CRIAÇÃO DE PRODUTO COM TODOS OS CAMPOS             */}
      {/* ===================================================================== */}
      {editingProduct && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEditingProduct(null)}
        >
          <div 
            className="bg-[#FAF8F5] text-[#3D3229] w-full max-w-2xl rounded-xs border border-[#BFAE9C]/50 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b border-[#BFAE9C]/30 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#7A5B43]">
                  {isNewProductModalOpen ? 'Adicionar Nova Obra' : 'Editar Produto'}
                </span>
                <h4 className="font-serif text-lg text-[#2C231C] font-semibold">
                  {editingProduct.name || 'Nova Obra da Maison'}
                </h4>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-full text-[#7A5B43] hover:bg-[#E8E0D4] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulário com todos os campos */}
            <div className="space-y-4 text-xs">
              
              {/* Linha 1: Nome e Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Nome da Obra / Produto
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ex: Vela Versailles Imperiale"
                    className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs font-serif text-sm focus:border-[#7A5B43] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Casa / Categoria
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const label = cat === 'velas' ? 'Casa I • Velas Aromáticas' : cat === 'sabonetes' ? 'Casa II • Sabonetes Botânicos' : 'Casa III • Crochê Aristocrático';
                      setEditingProduct({ ...editingProduct, category: cat, categoryLabel: label });
                    }}
                    className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs text-xs focus:border-[#7A5B43] focus:outline-none"
                  >
                    <option value="velas">Casa I • Velas Aromáticas & Cera Vegetal</option>
                    <option value="sabonetes">Casa II • Sabonetes Botânicos & Óleos Nobres</option>
                    <option value="croche">Casa III • Crochê Aristocrático & Fios Puros</option>
                  </select>
                </div>
              </div>

              {/* Linha 2: Preço e Rótulo da Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Preço de Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs font-semibold text-sm focus:border-[#7A5B43] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Selo / Subtítulo da Categoria
                  </label>
                  <input
                    type="text"
                    value={editingProduct.categoryLabel}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryLabel: e.target.value })}
                    placeholder="Ex: Casa I • Velas Aromáticas"
                    className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs text-xs focus:border-[#7A5B43] focus:outline-none"
                  />
                </div>
              </div>

              {/* Selo Feminino Nobre: Unidades Esgotadas Há Pouco Tempo */}
              <div className="bg-[#FAF5F0] p-4 rounded-xs border border-[#C5A059]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0">
                    <RecentlySoldOutBadge size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-xs font-bold text-[#2C1D15]">
                        Selo Giratório: Unidades esgotadas há pouco tempo
                      </span>
                      {editingProduct.recentlySoldOut ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#3D281E] text-[#F3ECE4] text-[9px] font-sans font-bold uppercase tracking-wider border border-[#C5A059]/40">
                          Ativo no Card
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#E8DFD5] text-[#7A6B5D] text-[9px] font-sans uppercase tracking-wider">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A5B43] mt-0.5 max-w-lg leading-relaxed">
                      Ao ativar, exibe no card do produto na Home o selo marrom redondo que gira suavemente perto da imagem, avisando as clientes que o lote esgotou recentemente.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProduct({ ...editingProduct, recentlySoldOut: !editingProduct.recentlySoldOut })}
                  className={`px-4 py-2.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                    editingProduct.recentlySoldOut
                      ? 'bg-[#3D281E] hover:bg-[#2B1B13] text-[#FAF5EE] shadow-sm border border-[#C5A059]/60'
                      : 'bg-white hover:bg-[#F2EAE1] text-[#5C4535] border border-[#BFAE9C]/70'
                  }`}
                >
                  {editingProduct.recentlySoldOut ? (
                    <>
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>Desmarcar Esgotado</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>Marcar como Esgotado</span>
                    </>
                  )}
                </button>
              </div>

              {/* Linha 3: Foto Principal com Upload e URL */}
              <div className="space-y-2 bg-white p-3.5 rounded-xs border border-[#BFAE9C]/40">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#7A5B43]" />
                    <span>Foto Principal da Obra</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E8E0D4] text-[#3D3229] text-[10.5px] uppercase tracking-wider rounded-xs border border-[#BFAE9C]/60 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload do Aparelho</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'primaryImage')}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {editingProduct.primaryImage && (
                    <div className="w-12 h-14 rounded-xs overflow-hidden bg-[#EDE6DC] shrink-0 border border-[#BFAE9C]/50">
                      <img
                        src={editingProduct.primaryImage}
                        alt="Prévia"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={editingProduct.primaryImage}
                    onChange={(e) => setEditingProduct({ ...editingProduct, primaryImage: e.target.value })}
                    placeholder="Cole a URL direta da imagem (ex: https://...)"
                    className="w-full p-2 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs font-mono text-[11px] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>
              </div>

              {/* Linha 4: Narrativa Curta e Completa */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    História Curta (Exibida no Card)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.shortStory}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortStory: e.target.value })}
                    placeholder="Breve frase poética sobre os aromas e texturas..."
                    className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs font-serif text-xs focus:border-[#7A5B43] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    História Completa (Exibida no Modal de Detalhes)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.fullStory}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fullStory: e.target.value })}
                    placeholder="Aprofundamento da memória afetiva e ritual desta peça..."
                    className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs font-serif text-xs focus:border-[#7A5B43] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Linha 5: Notas Olfativas / Detalhes de Matéria-Prima */}
              <div className="bg-white p-3.5 rounded-xs border border-[#BFAE9C]/40 space-y-2">
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block">
                  Pirâmide Olfativa ou Notas Botânicas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-[#7A5B43] block mb-0.5">Nota de Saída</span>
                    <input
                      type="text"
                      value={editingProduct.fragranceNotes?.top || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        fragranceNotes: {
                          top: e.target.value,
                          heart: editingProduct.fragranceNotes?.heart || '',
                          base: editingProduct.fragranceNotes?.base || ''
                        }
                      })}
                      placeholder="Ex: Bergamota, Figo"
                      className="w-full p-1.5 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-[11px]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#7A5B43] block mb-0.5">Nota de Corpo</span>
                    <input
                      type="text"
                      value={editingProduct.fragranceNotes?.heart || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        fragranceNotes: {
                          top: editingProduct.fragranceNotes?.top || '',
                          heart: e.target.value,
                          base: editingProduct.fragranceNotes?.base || ''
                        }
                      })}
                      placeholder="Ex: Lavanda, Jasmim"
                      className="w-full p-1.5 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-[11px]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#7A5B43] block mb-0.5">Nota de Fundo</span>
                    <input
                      type="text"
                      value={editingProduct.fragranceNotes?.base || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        fragranceNotes: {
                          top: editingProduct.fragranceNotes?.top || '',
                          heart: editingProduct.fragranceNotes?.heart || '',
                          base: e.target.value
                        }
                      })}
                      placeholder="Ex: Âmbar, Cedro"
                      className="w-full p-1.5 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-[11px]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Rodapé do Modal com Botões */}
            <div className="pt-3 border-t border-[#BFAE9C]/30 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-transparent text-[#7A5B43] hover:text-[#2C231C] text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveProduct(editingProduct)}
                className="px-5 py-2.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Obra no Banco</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmação de Exclusão */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xs max-w-sm w-full space-y-4 border border-rose-300 shadow-2xl">
            <h4 className="font-serif text-lg text-rose-900 font-semibold">
              Excluir Produto?
            </h4>
            <p className="text-xs text-[#7A5B43]">
              Esta ação removerá a obra do catálogo e de todas as telas sincronizadas em tempo real.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-[#7A5B43] hover:text-[#2C231C] uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
