import React, { useState, useRef } from 'react';
import { HeaderSettings } from '../../types';
import { uploadImageToSupabase } from '../../lib/supabase';
import { 
  X, 
  Sparkles, 
  Check, 
  UploadCloud, 
  Image as ImageIcon, 
  Type, 
  Sliders, 
  RotateCcw, 
  Trash2, 
  Search, 
  User, 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Layers,
  Plus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface HeaderEditorProps {
  settings: HeaderSettings;
  onUpdate: (newSettings: HeaderSettings) => void;
  onClose: () => void;
}

export const HeaderEditor: React.FC<HeaderEditorProps> = ({
  settings,
  onUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'nav' | 'actions' | 'style'>('logo');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manipuladores de upload de arquivo (do dispositivo)
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG, WebP).');
      return;
    }

    try {
      const dataUrl = await uploadImageToSupabase(file, 'header-logos');
      if (dataUrl) {
        onUpdate({
          ...settings,
          logo: {
            ...settings.logo,
            type: 'image',
            imageUrl: dataUrl
          }
        });
        setUploadSuccessMessage(`Logo "${file.name}" salva com sucesso no Supabase!`);
        setTimeout(() => setUploadSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.warn('Erro ao carregar imagem para o Supabase:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Logos de exemplo do Atelier para teste rápido
  const PRESET_LOGOS = [
    {
      name: 'Monograma Minimalista Ouro',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Emblema Botânico Linho',
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y-2 border-[#7A5B43] shadow-md animate-in slide-in-from-top-3 duration-300">
      {/* Barra de Topo do Editor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 border-b border-[#BFAE9C]/40 flex flex-wrap items-center justify-between gap-3 bg-white/75 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#7A5B43] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-serif text-xs sm:text-sm text-[#2C231C] font-semibold tracking-wide flex items-center gap-2">
              Personalização do Cabeçalho & Logo
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-sans font-medium">
                Ao Vivo
              </span>
            </h4>
            <p className="text-[9.5px] sm:text-[10px] text-[#7A5B43] tracking-wider uppercase">
              Upload de logo do dispositivo • Navegação • Ações • Estilos
            </p>
          </div>
        </div>

        {/* Abas de Navegação Interna */}
        <div className="flex items-center gap-1 bg-[#F2EDE4] p-1 rounded-xs border border-[#BFAE9C]/40 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-3 py-1 text-[10.5px] sm:text-[11px] uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'logo'
                ? 'bg-[#3D3229] text-white font-medium shadow-xs'
                : 'text-[#3D3229]/80 hover:text-[#3D3229] hover:bg-[#E8E0D4]'
            }`}
          >
            <ImageIcon className="w-3 h-3 text-amber-400" />
            <span>Logo & Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('nav')}
            className={`px-3 py-1 text-[10.5px] sm:text-[11px] uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'nav'
                ? 'bg-[#3D3229] text-white font-medium shadow-xs'
                : 'text-[#3D3229]/80 hover:text-[#3D3229] hover:bg-[#E8E0D4]'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Menu & Links</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1 text-[10.5px] sm:text-[11px] uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'actions'
                ? 'bg-[#3D3229] text-white font-medium shadow-xs'
                : 'text-[#3D3229]/80 hover:text-[#3D3229] hover:bg-[#E8E0D4]'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Ícones de Ação</span>
          </button>

          <button
            onClick={() => setActiveTab('style')}
            className={`px-3 py-1 text-[10.5px] sm:text-[11px] uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'style'
                ? 'bg-[#3D3229] text-white font-medium shadow-xs'
                : 'text-[#3D3229]/80 hover:text-[#3D3229] hover:bg-[#E8E0D4]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Estilo & Tema</span>
          </button>
        </div>

        {/* Botão Fechar Painel */}
        <button
          onClick={onClose}
          className="p-1.5 text-[#7A5B43] hover:text-[#3D3229] hover:bg-[#E8E0D4] rounded-full transition-colors"
          title="Fechar painel de edição do cabeçalho"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Conteúdo da Aba */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* =================================================================== */}
        {/* ABA: LOGO & IDENTIDADE (COM UPLOAD DO DISPOSITIVO)                   */}
        {/* =================================================================== */}
        {activeTab === 'logo' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Modo de Exibição da Logo */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-widest text-[#7A5B43] font-semibold mb-2.5">
                1. Formato da Identidade Visual
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => onUpdate({
                    ...settings,
                    logo: { ...settings.logo, type: 'image' }
                  })}
                  className={`p-3 rounded-xs border text-left transition-all relative ${
                    settings.logo.type === 'image'
                      ? 'border-[#7A5B43] bg-white ring-2 ring-[#7A5B43]/30 shadow-xs'
                      : 'border-[#BFAE9C]/50 bg-[#F2EDE4]/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-serif font-medium text-[#2C231C] flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-[#7A5B43]" />
                      Upload de Imagem
                    </span>
                    {settings.logo.type === 'image' && <Check className="w-3.5 h-3.5 text-[#7A5B43]" />}
                  </div>
                  <p className="text-[10px] text-[#7A5B43] leading-relaxed">
                    Envie a logo da sua marca salva no seu celular ou computador (PNG transparente, SVG ou JPG).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdate({
                    ...settings,
                    logo: { ...settings.logo, type: 'circular_monogram' }
                  })}
                  className={`p-3 rounded-xs border text-left transition-all relative ${
                    settings.logo.type === 'circular_monogram'
                      ? 'border-[#7A5B43] bg-white ring-2 ring-[#7A5B43]/30 shadow-xs'
                      : 'border-[#BFAE9C]/50 bg-[#F2EDE4]/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-serif font-medium text-[#2C231C] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Selo Monograma Circular
                    </span>
                    {settings.logo.type === 'circular_monogram' && <Check className="w-3.5 h-3.5 text-[#7A5B43]" />}
                  </div>
                  <p className="text-[10px] text-[#7A5B43] leading-relaxed">
                    Selo clássico da Maison com anéis decorativos concêntricos e letras do atelier gravadas.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdate({
                    ...settings,
                    logo: { ...settings.logo, type: 'text' }
                  })}
                  className={`p-3 rounded-xs border text-left transition-all relative ${
                    settings.logo.type === 'text'
                      ? 'border-[#7A5B43] bg-white ring-2 ring-[#7A5B43]/30 shadow-xs'
                      : 'border-[#BFAE9C]/50 bg-[#F2EDE4]/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-serif font-medium text-[#2C231C] flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-[#7A5B43]" />
                      Tipografia Nobre
                    </span>
                    {settings.logo.type === 'text' && <Check className="w-3.5 h-3.5 text-[#7A5B43]" />}
                  </div>
                  <p className="text-[10px] text-[#7A5B43] leading-relaxed">
                    Exibe o nome em tipografia de alta costura com espaçamento estendido.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Upload de Arquivo do Dispositivo (Destaque Principal) */}
            {settings.logo.type === 'image' && (
              <div className="bg-white p-4 sm:p-5 rounded-xs border border-[#BFAE9C]/45 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-xs sm:text-sm text-[#2C231C] font-semibold">
                      Arquivo de Imagem da Logo
                    </h5>
                    <p className="text-[10px] text-[#7A5B43]">
                      Faça o upload diretamente da sua galeria, fotos ou arquivos
                    </p>
                  </div>

                  {settings.logo.imageUrl && (
                    <button
                      onClick={() => onUpdate({
                        ...settings,
                        logo: { ...settings.logo, imageUrl: '', type: 'circular_monogram' }
                      })}
                      className="text-[10.5px] text-rose-800 hover:text-rose-950 flex items-center gap-1 uppercase tracking-wider"
                      title="Remover imagem e voltar ao selo padrão"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remover</span>
                    </button>
                  )}
                </div>

                {uploadSuccessMessage && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xs text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uploadSuccessMessage}</span>
                  </div>
                )}

                {/* Zona de Drop & Seleção Manual */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xs p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? 'border-[#7A5B43] bg-amber-50/80 scale-[1.01]'
                      : 'border-[#BFAE9C]/70 hover:border-[#7A5B43] bg-[#FAF8F5] hover:bg-white'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="w-12 h-12 rounded-full bg-[#E8E0D4] text-[#7A5B43] flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[#2C231C]">
                      Toque aqui para escolher uma foto ou arraste o arquivo
                    </p>
                    <p className="text-[10px] text-[#7A5B43] mt-1">
                      Suporta PNG (com fundo transparente), SVG, JPG ou WebP
                    </p>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-[10.5px] uppercase tracking-widest rounded-xs shadow-xs pointer-events-none"
                  >
                    Procurar no Dispositivo
                  </button>
                </div>

                {/* Prévia da Imagem Atual Carregada */}
                {settings.logo.imageUrl && (
                  <div className="pt-2 border-t border-[#BFAE9C]/25 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F7F4EF] border border-[#BFAE9C]/40 rounded-xs flex items-center justify-center min-w-[70px] min-h-[50px]">
                        <img
                          src={settings.logo.imageUrl}
                          alt="Prévia da Logo"
                          referrerPolicy="no-referrer"
                          className="max-h-10 max-w-[120px] object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-medium text-[#2C231C] block">
                          Logo Ativa no Cabeçalho
                        </span>
                        <span className="text-[9.5px] text-emerald-700 font-medium">
                          ✓ Exibindo no topo do site em tempo real
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#E8E0D4] text-[#3D3229] border border-[#BFAE9C] text-[10.5px] uppercase tracking-wider rounded-xs transition-colors"
                    >
                      Trocar por Outra Imagem
                    </button>
                  </div>
                )}

                {/* Campo Alternativo para Link / URL Externa da Imagem */}
                <div className="pt-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#7A5B43] mb-1">
                    Ou digite uma URL direta da imagem (opcional):
                  </label>
                  <input
                    type="text"
                    value={settings.logo.imageUrl || ''}
                    onChange={(e) => onUpdate({
                      ...settings,
                      logo: { ...settings.logo, imageUrl: e.target.value }
                    })}
                    placeholder="https://exemplo.com/minha-logo.png"
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs px-3 py-1.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>
              </div>
            )}

            {/* 3. Se for Monograma Circular: Personalizar Letras e Textos */}
            {settings.logo.type === 'circular_monogram' && (
              <div className="bg-white p-4 sm:p-5 rounded-xs border border-[#BFAE9C]/45 shadow-xs space-y-4">
                <div>
                  <h5 className="font-serif text-xs sm:text-sm text-[#2C231C] font-semibold">
                    Gravação no Selo Monograma Circular
                  </h5>
                  <p className="text-[11px] text-[#7A5B43] mt-0.5">
                    Personalize as 3 partes gravadas no selo circular: texto superior, iniciais/nome no meio e texto inferior.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Palavra em cima */}
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[#7A5B43]">
                      Em cima (Arco superior)
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={settings.logo.sealTopText ?? 'MAISON'}
                      onChange={(e) => onUpdate({
                        ...settings,
                        logo: { ...settings.logo, sealTopText: e.target.value.toUpperCase() }
                      })}
                      placeholder="MAISON"
                      className="w-full font-serif text-xs tracking-wider uppercase bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>

                  {/* Nome no meio */}
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[#7A5B43]">
                      No meio (Iniciais / Nome)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={settings.logo.monogram || 'ME'}
                      onChange={(e) => onUpdate({
                        ...settings,
                        logo: { ...settings.logo, monogram: e.target.value.toUpperCase() }
                      })}
                      placeholder="ME"
                      className="w-full text-center font-serif text-base tracking-widest font-bold uppercase bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>

                  {/* Palavra em baixo */}
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[#7A5B43]">
                      Em baixo (Arco inferior)
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={settings.logo.sealBottomText ?? 'ENTRELAÇO'}
                      onChange={(e) => onUpdate({
                        ...settings,
                        logo: { ...settings.logo, sealBottomText: e.target.value.toUpperCase() }
                      })}
                      placeholder="ENTRELAÇO"
                      className="w-full font-serif text-xs tracking-wider uppercase bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Se for Tipografia Textual: Personalizar Nome da Marca */}
            {settings.logo.type === 'text' && (
              <div className="bg-white p-4 sm:p-5 rounded-xs border border-[#BFAE9C]/45 shadow-xs space-y-3">
                <h5 className="font-serif text-xs sm:text-sm text-[#2C231C] font-semibold">
                  Nome da Marca no Cabeçalho
                </h5>
                <input
                  type="text"
                  value={settings.logo.text || 'MAISON ENTRELAÇO'}
                  onChange={(e) => onUpdate({
                    ...settings,
                    logo: { ...settings.logo, text: e.target.value }
                  })}
                  placeholder="MAISON ENTRELAÇO"
                  className="w-full font-serif text-sm tracking-[0.2em] uppercase bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>
            )}

            {/* 5. Dimensões / Tamanho da Logo */}
            <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/45 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-serif font-medium text-[#2C231C] block">
                  Tamanho da Logo no Cabeçalho
                </span>
                <span className="text-[10px] text-[#7A5B43]">
                  Ajuste a escala para equilibrar a composição com o menu
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onUpdate({
                      ...settings,
                      logo: { ...settings.logo, size }
                    })}
                    className={`px-3 py-1 text-[11px] uppercase tracking-wider rounded-xs border transition-all ${
                      settings.logo.size === size
                        ? 'bg-[#7A5B43] text-white border-[#7A5B43] font-medium shadow-xs'
                        : 'bg-[#FAF8F5] text-[#3D3229] border-[#BFAE9C]/60 hover:bg-[#E8E0D4]'
                    }`}
                  >
                    {size === 'sm' && 'Pequeno'}
                    {size === 'md' && 'Médio'}
                    {size === 'lg' && 'Grande'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ABA: MENU & LINKS DE NAVEGAÇÃO                                      */}
        {/* =================================================================== */}
        {activeTab === 'nav' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-[#7A5B43] font-semibold mb-0.5">
                  Links de Navegação do Menu Principal
                </label>
                <p className="text-[10px] text-[#7A5B43]">
                  Personalize títulos, destinos (âncoras de seção), ordene ou adicione novos itens.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `secao-custom-${Date.now().toString().slice(-4)}`;
                  const newLink = {
                    id: newId,
                    label: 'Novo Link',
                    enabled: true,
                    targetId: newId,
                    targetType: 'section' as const
                  };
                  onUpdate({
                    ...settings,
                    navLinks: [...settings.navLinks, newLink]
                  });
                }}
                className="px-3 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-[10.5px] uppercase tracking-wider font-semibold rounded-xs shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Item ao Menu</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {settings.navLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="bg-white p-3 rounded-xs border border-[#BFAE9C]/45 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9.5px] text-[#7A5B43] uppercase tracking-wider block mb-0.5 font-semibold">
                        Texto do Botão
                      </span>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...settings.navLinks];
                          updated[index] = { ...link, label: e.target.value };
                          onUpdate({ ...settings, navLinks: updated });
                        }}
                        className="w-full text-xs font-sans uppercase tracking-wider font-medium text-[#2C231C] bg-[#FAF8F5] border border-[#BFAE9C]/40 rounded-xs p-1.5 focus:border-[#7A5B43] focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="text-[9.5px] text-[#7A5B43] uppercase tracking-wider block mb-0.5 font-semibold">
                        Destino / Âncora
                      </span>
                      <input
                        type="text"
                        value={link.targetId || link.id}
                        onChange={(e) => {
                          const updated = [...settings.navLinks];
                          updated[index] = { ...link, targetId: e.target.value };
                          onUpdate({ ...settings, navLinks: updated });
                        }}
                        placeholder="ex: secao-frase-marca"
                        className="w-full text-xs font-mono text-[#2C231C] bg-[#FAF8F5] border border-[#BFAE9C]/40 rounded-xs p-1.5 focus:border-[#7A5B43] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {/* Mover para cima */}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...settings.navLinks];
                          const temp = updated[index];
                          updated[index] = updated[index - 1];
                          updated[index - 1] = temp;
                          onUpdate({ ...settings, navLinks: updated });
                        }}
                        className="p-1.5 bg-[#FAF8F5] hover:bg-[#E8E0D4] text-[#3D3229] rounded-xs border border-[#BFAE9C]/40 transition-colors"
                        title="Mover para cima"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Mover para baixo */}
                    {index < settings.navLinks.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...settings.navLinks];
                          const temp = updated[index];
                          updated[index] = updated[index + 1];
                          updated[index + 1] = temp;
                          onUpdate({ ...settings, navLinks: updated });
                        }}
                        className="p-1.5 bg-[#FAF8F5] hover:bg-[#E8E0D4] text-[#3D3229] rounded-xs border border-[#BFAE9C]/40 transition-colors"
                        title="Mover para baixo"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Ativar/Desativar */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...settings.navLinks];
                        updated[index] = { ...link, enabled: !link.enabled };
                        onUpdate({ ...settings, navLinks: updated });
                      }}
                      className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1 text-[10px] uppercase tracking-wider transition-colors font-medium ${
                        link.enabled
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-300'
                      }`}
                      title={link.enabled ? 'Item ativo' : 'Item oculto'}
                    >
                      {link.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{link.enabled ? 'Ativo' : 'Oculto'}</span>
                    </button>

                    {/* Excluir link customizado */}
                    {settings.navLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = settings.navLinks.filter((_, i) => i !== index);
                          onUpdate({ ...settings, navLinks: updated });
                        }}
                        className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-xs transition-colors"
                        title="Excluir link do menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ABA: ÍCONES DE AÇÃO                                                */}
        {/* =================================================================== */}
        {activeTab === 'actions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-widest text-[#7A5B43] font-semibold mb-1">
                Ações & Botões Rápidos à Direita
              </label>
              <p className="text-[10px] text-[#7A5B43] mb-3">
                Escolha quais atalhos essenciais ficam visíveis para os clientes no topo da página.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Busca */}
              <div className="bg-white p-3.5 rounded-xs border border-[#BFAE9C]/45 shadow-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#F2EDE4] text-[#3D3229] flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-serif font-medium text-[#2C231C] block">
                      Busca Rápida
                    </span>
                    <span className="text-[9.5px] text-[#7A5B43]">Lupa de pesquisa</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUpdate({
                    ...settings,
                    actions: { ...settings.actions, showSearch: !settings.actions.showSearch }
                  })}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-xs transition-colors ${
                    settings.actions.showSearch
                      ? 'bg-emerald-700 text-white font-medium'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {settings.actions.showSearch ? 'Ativo' : 'Oculto'}
                </button>
              </div>

              {/* Conta */}
              <div className="bg-white p-3.5 rounded-xs border border-[#BFAE9C]/45 shadow-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#F2EDE4] text-[#3D3229] flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-serif font-medium text-[#2C231C] block">
                      Minha Conta
                    </span>
                    <span className="text-[9.5px] text-[#7A5B43]">Perfil & Pedidos</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUpdate({
                    ...settings,
                    actions: { ...settings.actions, showAccount: !settings.actions.showAccount }
                  })}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-xs transition-colors ${
                    settings.actions.showAccount
                      ? 'bg-emerald-700 text-white font-medium'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {settings.actions.showAccount ? 'Ativo' : 'Oculto'}
                </button>
              </div>

              {/* Sacola / Carrinho */}
              <div className="bg-white p-3.5 rounded-xs border border-[#BFAE9C]/45 shadow-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#F2EDE4] text-[#3D3229] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-serif font-medium text-[#2C231C] block">
                      Sacola de Compras
                    </span>
                    <span className="text-[9.5px] text-[#7A5B43]">Gaveta com badge</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUpdate({
                    ...settings,
                    actions: { ...settings.actions, showCart: !settings.actions.showCart }
                  })}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-xs transition-colors ${
                    settings.actions.showCart
                      ? 'bg-emerald-700 text-white font-medium'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {settings.actions.showCart ? 'Ativo' : 'Oculto'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ABA: ESTILO & TEMA                                                 */}
        {/* =================================================================== */}
        {activeTab === 'style' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-widest text-[#7A5B43] font-semibold mb-1">
                Atmosfera & Acabamento do Cabeçalho
              </label>
              <p className="text-[10px] text-[#7A5B43] mb-3">
                Selecione o esquema de cores e comportamento ao rolar a página.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onUpdate({
                  ...settings,
                  style: { ...settings.style, theme: 'classic_cream' }
                })}
                className={`p-3 rounded-xs border text-left transition-all ${
                  settings.style.theme === 'classic_cream'
                    ? 'border-[#7A5B43] bg-white ring-2 ring-[#7A5B43]/30 shadow-xs'
                    : 'border-[#BFAE9C]/50 bg-[#F2EDE4]/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-medium text-[#2C231C]">
                    Clássico Creme Atelier
                  </span>
                  {settings.style.theme === 'classic_cream' && <Check className="w-3.5 h-3.5 text-[#7A5B43]" />}
                </div>
                <p className="text-[10px] text-[#7A5B43]">
                  Tom artesanal rústico claro (#F7F4EF) em perfeita harmonia com os tecidos e aromas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({
                  ...settings,
                  style: { ...settings.style, theme: 'translucent_glass' }
                })}
                className={`p-3 rounded-xs border text-left transition-all ${
                  settings.style.theme === 'translucent_glass'
                    ? 'border-[#7A5B43] bg-white ring-2 ring-[#7A5B43]/30 shadow-xs'
                    : 'border-[#BFAE9C]/50 bg-[#F2EDE4]/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-medium text-[#2C231C]">
                    Vidro Translúcido
                  </span>
                  {settings.style.theme === 'translucent_glass' && <Check className="w-3.5 h-3.5 text-[#7A5B43]" />}
                </div>
                <p className="text-[10px] text-[#7A5B43]">
                  Efeito refinado frosted glass com desfoque de fundo (backdrop blur).
                </p>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({
                  ...settings,
                  style: { ...settings.style, theme: 'monochrome_dark' }
                })}
                className={`p-3 rounded-xs border text-left transition-all ${
                  settings.style.theme === 'monochrome_dark'
                    ? 'border-[#7A5B43] bg-[#241E1A] text-white ring-2 ring-amber-400 shadow-xs'
                    : 'border-[#BFAE9C]/50 bg-[#241E1A]/80 text-[#E8E0D4] hover:bg-[#241E1A]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-medium">
                    Preto Ébano & Ouro
                  </span>
                  {settings.style.theme === 'monochrome_dark' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[10px] opacity-80">
                  Estética noturna de alta joalheria e perfumaria exclusiva.
                </p>
              </button>
            </div>

            <div className="bg-white p-3.5 rounded-xs border border-[#BFAE9C]/45 shadow-xs flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-serif font-medium text-[#2C231C] block">
                  Fixar Cabeçalho no Topo (Sticky)
                </span>
                <span className="text-[10px] text-[#7A5B43]">
                  Mantém a barra de navegação visível enquanto o cliente rola a página
                </span>
              </div>

              <button
                type="button"
                onClick={() => onUpdate({
                  ...settings,
                  style: { ...settings.style, sticky: !settings.style.sticky }
                })}
                className={`px-3 py-1 text-[10.5px] uppercase tracking-wider rounded-xs transition-colors ${
                  settings.style.sticky
                    ? 'bg-[#7A5B43] text-white font-medium'
                    : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {settings.style.sticky ? 'Fixado' : 'Estático'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
