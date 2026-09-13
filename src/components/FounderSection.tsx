import React, { useState, useRef } from 'react';
import { FounderSettings } from '../types';
import { uploadImageToSupabase } from '../lib/supabase';
import {
  ArrowRight,
  Sparkles,
  Camera,
  Type,
  Quote,
  List,
  Sliders,
  X,
  Upload,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon
} from 'lucide-react';

export interface FounderSectionProps {
  settings?: FounderSettings;
  onOpenFounderModal?: () => void;
  isEditorMode?: boolean;
  onUpdateSettings?: (newSettings: FounderSettings) => void;
}

type FounderPopoverType = 'photo' | 'badge' | 'identity' | 'items' | 'quote' | 'button' | 'section' | null;

export const FounderSection: React.FC<FounderSectionProps> = ({
  settings,
  onOpenFounderModal,
  isEditorMode = false,
  onUpdateSettings
}) => {
  const [activePopover, setActivePopover] = useState<FounderPopoverType>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number>(0);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If disabled in settings, do not render unless in editor mode (where we show an un-hide banner)
  if (settings && !settings.enabled) {
    if (isEditorMode) {
      return (
        <div className="w-full bg-[#EFE9DF] border-y border-dashed border-[#BFAE9C]/70 py-4 px-6 text-center animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-[#7A5B43]" />
            <span className="text-xs text-[#7A5B43] font-serif italic">
              Seção "A Fundadora / A Criadora" está atualmente oculta na loja.
            </span>
            <button
              onClick={() => onUpdateSettings?.({ ...settings, enabled: true })}
              className="px-3 py-1 bg-[#7A5B43] text-white text-[10.5px] uppercase tracking-wider rounded-xs hover:bg-[#6F775C] transition-colors cursor-pointer shadow-xs"
            >
              Reativar Seção
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  const founderName = settings?.name || "Aline de La Tour";
  const founderRole = settings?.role || "Fundadora & Diretora Criativa";
  const founderTagline = settings?.tagline || "A Alma da Maison";
  const founderBadge = settings?.badgeText !== undefined ? settings.badgeText : "Autoria";
  const itemsTitle = settings?.itemsTitle !== undefined ? settings.itemsTitle : "Pilares da Criação";
  const founderImage =
    settings?.imageUrl ||
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85";
  const founderQuote =
    settings?.quote || "O luxo autêntico é o afeto e o tempo lapidados à mão.";
  const buttonText = settings?.buttonText || "Conheça a história";

  const defaultItems = [
    {
      id: "1",
      title: "Curadoria Autoral",
      description: "Nascida de estadias na Europa e memórias do interior bucólico."
    },
    {
      id: "2",
      title: "Saber-Fazer Nobre",
      description: "Alquimia botânica pura, óleos raros e fios entrelaçados sem pressa."
    },
    {
      id: "3",
      title: "Tiragens Raras",
      description: "Peças numeradas para transformar a rotina em rituais poéticos."
    }
  ];

  const items = settings?.items && settings.items.length > 0 ? settings.items : defaultItems;

  const getFullSettings = (): FounderSettings => ({
    enabled: settings?.enabled !== false,
    tagline: founderTagline,
    name: founderName,
    role: founderRole,
    badgeText: founderBadge,
    itemsTitle: itemsTitle,
    imageUrl: founderImage,
    imageAlt: settings?.imageAlt || founderName,
    items: items,
    quote: founderQuote,
    buttonText: buttonText
  });

  const updateField = <K extends keyof FounderSettings>(field: K, value: FounderSettings[K]) => {
    if (!onUpdateSettings) return;
    onUpdateSettings({
      ...getFullSettings(),
      [field]: value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateSettings) return;

    try {
      const url = await uploadImageToSupabase(file, 'founder');
      if (url) {
        updateField('imageUrl', url);
      }
    } catch (err) {
      console.warn('Erro ao enviar imagem da fundadora:', err);
    }
  };

  const handleUpdateItem = (index: number, field: 'title' | 'description', value: string) => {
    if (!onUpdateSettings) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    updateField('items', updated);
  };

  const handleRemoveItem = (index: number) => {
    if (!onUpdateSettings || items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    updateField('items', updated);
    setEditingItemIndex(Math.max(0, index - 1));
  };

  const handleAddItem = () => {
    if (!onUpdateSettings || !newItemTitle.trim()) return;
    const newItem = {
      id: String(Date.now()),
      title: newItemTitle.trim(),
      description: newItemDesc.trim() || 'Descrição poética do pilar.'
    };
    const updated = [...items, newItem];
    updateField('items', updated);
    setNewItemTitle('');
    setNewItemDesc('');
    setIsAddingItem(false);
    setEditingItemIndex(updated.length - 1);
  };

  return (
    <section
      id="a-fundadora"
      aria-label="A Fundadora da Maison"
      className="relative w-full bg-[#FAF8F5] text-[#3D3229] overflow-hidden"
    >
      {/* Beacon Geral de Ajustes da Seção no Topo Direito */}
      {isEditorMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-4 z-20">
          <button
            onClick={() => setActivePopover(activePopover === 'section' ? null : 'section')}
            className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#BFAE9C]/70 text-[#3D3229] hover:bg-white text-[9.5px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group"
            title="Ajustes gerais da seção A Criadora"
          >
            <Sliders className="w-3 h-3 text-[#7A5B43] transition-transform group-hover:rotate-45" />
            <span className="hidden sm:inline">A Criadora • Ajustes</span>
          </button>
        </div>
      )}

      {/* Container Principal: compacto e macro no mobile, amplo no desktop */}
      <div className="max-w-6xl mx-auto px-3.5 py-4 sm:px-6 sm:py-8 md:py-10">
        
        {/* Layout Lado a Lado no Mobile & Desktop (Visão Macro sem Scroll no Mobile) */}
        <div className="flex flex-row items-stretch gap-2.5 sm:gap-6 md:gap-8 min-h-[290px] sm:min-h-[380px] md:min-h-[420px]">
          
          {/* ========================================================================= */}
          {/* COLUNA ESQUERDA: FOTO DA DONA OLHANDO PARA O LADO DIREITO */}
          {/* ========================================================================= */}
          <div className="w-[41%] sm:w-[38%] md:w-[36%] shrink-0 flex flex-col">
            <div className="relative w-full h-full min-h-[280px] sm:min-h-[360px] rounded-xs overflow-hidden shadow-md bg-[#EDE6DC] group">
              <img
                src={founderImage}
                alt={settings?.imageAlt || founderName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_top] filter contrast-[1.03] brightness-[0.98] transition-transform duration-700 group-hover:scale-105"
              />

              {/* Degradê Sutil na Base com Assinatura */}
              <div className="absolute inset-x-0 bottom-0 pt-6 pb-2 px-2 sm:px-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                <span className="font-cinzel text-[7.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#E8E0D4] block leading-tight">
                  {founderName}
                </span>
                <span className="font-serif text-[7px] sm:text-[9px] italic text-white/80 block leading-tight mt-0.5 truncate">
                  {founderRole}
                </span>
              </div>

              {/* Selo / Badge Superior (Totalmente Editável, ex: Autoria) */}
              {(founderBadge || isEditorMode) && (
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
                  {founderBadge ? (
                    <button
                      type="button"
                      onClick={() => isEditorMode && setActivePopover(activePopover === 'badge' ? null : 'badge')}
                      className={`px-2 py-0.5 rounded-xs bg-black/60 backdrop-blur-xs text-white font-cinzel text-[7px] sm:text-[8px] tracking-widest uppercase transition-all ${
                        isEditorMode ? 'hover:bg-black cursor-pointer ring-1 ring-white/30' : ''
                      }`}
                      title={isEditorMode ? "Toque para editar o texto do selo (Autoria)" : undefined}
                    >
                      {founderBadge}
                    </button>
                  ) : null}

                  {isEditorMode && (
                    <button
                      onClick={() => setActivePopover(activePopover === 'badge' ? null : 'badge')}
                      className="lottie-beacon-dot cursor-pointer"
                      title="Editar Selo da Foto (Autoria)"
                    >
                      <span className="lottie-beacon-wave" />
                      <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                    </button>
                  )}
                </div>
              )}

              {/* Beacon de Toque na Foto da Fundadora */}
              {isEditorMode && (
                <button
                  onClick={() => setActivePopover(activePopover === 'photo' ? null : 'photo')}
                  className="absolute top-2 right-2 z-20 px-2 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#C5A059]/80 text-white hover:bg-black text-[9px] sm:text-[10px] font-medium tracking-wide flex items-center gap-1.5 shadow-2xl transition-all cursor-pointer group"
                  title="Toque para trocar foto, carregar arquivo ou escolher retrato"
                >
                  <span className="lottie-beacon-dot">
                    <span className="lottie-beacon-wave" />
                    <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                  </span>
                  <Camera className="w-3 h-3 text-[#E8E0D4] transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Trocar Foto</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA DIREITA: ITENS DE TEXTO CLÁSSICOS & VENDA DA IMAGEM DELA */}
          {/* ========================================================================= */}
          <div className="w-[59%] sm:w-[62%] md:w-[64%] flex flex-col justify-between py-0.5 sm:py-1">
            
            {/* Topo: Tagline + Nome + Cargo */}
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 text-[8px] sm:text-[9.5px] uppercase tracking-[0.22em] text-[#7A5B43] font-medium mb-1">
                <Sparkles className="w-2.5 h-2.5 text-[#7A5B43] shrink-0" />
                <span>{founderTagline}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <h2 className="font-serif text-base sm:text-2xl md:text-3xl text-[#3D3229] font-normal leading-[1.15] tracking-tight">
                  {founderName}
                </h2>

                {/* Beacon de Identidade (Nome, Cargo, Tagline) */}
                {isEditorMode && (
                  <button
                    onClick={() => setActivePopover(activePopover === 'identity' ? null : 'identity')}
                    className="lottie-beacon-dot cursor-pointer"
                    title="Editar Nome, Cargo e Tagline da Fundadora"
                  >
                    <span className="lottie-beacon-wave" />
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                  </button>
                )}
              </div>

              <p className="text-[9px] sm:text-xs text-[#8C7A6B] italic font-serif mt-0.5 sm:mt-1">
                {founderRole}
              </p>
            </div>

            {/* Itens de Texto Clássicos sobre Ela e sua Criação */}
            <div className="my-1.5 sm:my-2.5 relative">
              {/* Título do Bloco / Pilares com Beacon de Edição */}
              <div className="flex items-center justify-between gap-2 mb-1 sm:mb-1.5">
                <div className="flex items-center gap-1.5">
                  {itemsTitle ? (
                    <span className="text-[8px] sm:text-[9.5px] uppercase tracking-wider text-[#7A5B43] font-medium font-cinzel">
                      {itemsTitle}
                    </span>
                  ) : isEditorMode ? (
                    <span className="text-[8px] sm:text-[9.5px] uppercase tracking-wider text-[#7A5B43]/60 italic font-cinzel">
                      (Sem título de cabeçalho)
                    </span>
                  ) : null}

                  {isEditorMode && (
                    <button
                      onClick={() => setActivePopover(activePopover === 'items' ? null : 'items')}
                      className="lottie-beacon-dot cursor-pointer"
                      title="Editar Título do Bloco e Pilares"
                    >
                      <span className="lottie-beacon-wave" />
                      <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core" />
                    </button>
                  )}
                </div>

                {isEditorMode && (
                  <button
                    onClick={() => setActivePopover(activePopover === 'items' ? null : 'items')}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EDE6DC] hover:bg-[#E2D8CC] text-[#3D3229] text-[8.5px] sm:text-[9.5px] font-medium tracking-wide transition-colors cursor-pointer border border-[#BFAE9C]/40"
                    title="Editar, adicionar ou remover pilares"
                  >
                    <List className="w-2.5 h-2.5 text-[#7A5B43]" />
                    <span>Gerenciar Pilares ({items.length})</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border-l-2 border-[#BFAE9C]/50 pl-2 sm:pl-3 transition-colors hover:border-[#7A5B43] relative group/item"
                  >
                    <h3 className="font-serif text-[10px] sm:text-xs md:text-sm font-medium text-[#3D3229] leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[8.5px] sm:text-[11px] md:text-xs text-[#5C4D41] leading-tight sm:leading-relaxed font-light mt-0.5 line-clamp-2 sm:line-clamp-none">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Base: Citação Sutil + Botão de Ação */}
            <div className="pt-1.5 sm:pt-2 border-t border-[#BFAE9C]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 relative">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="font-serif text-[8.5px] sm:text-xs italic text-[#7A5B43] leading-tight line-clamp-1 sm:line-clamp-none">
                  “{founderQuote}”
                </p>

                {/* Beacon de Citação */}
                {isEditorMode && (
                  <button
                    onClick={() => setActivePopover(activePopover === 'quote' ? null : 'quote')}
                    className="lottie-beacon-dot shrink-0 cursor-pointer"
                    title="Editar Citação da Criadora"
                  >
                    <span className="lottie-beacon-wave" />
                    <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_6px_rgba(212,175,55,0.95)]" />
                  </button>
                )}
              </div>

              {onOpenFounderModal && (
                <div className="inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={onOpenFounderModal}
                    className="group inline-flex items-center gap-1 text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] text-[#3D3229] hover:text-[#7A5B43] font-medium transition-colors cursor-pointer"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>

                  {/* Beacon de Botão */}
                  {isEditorMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePopover(activePopover === 'button' ? null : 'button');
                      }}
                      className="lottie-beacon-dot cursor-pointer"
                      title="Editar Texto do Botão da História"
                    >
                      <span className="lottie-beacon-wave" />
                      <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_6px_rgba(212,175,55,0.95)]" />
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL / POPOVER FLUTUANTE DE EDIÇÃO DIRETA                                */}
      {/* ========================================================================= */}
      {isEditorMode && activePopover && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePopover(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF8F5] text-[#3D3229] rounded-xs border border-[#BFAE9C]/50 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setActivePopover(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#7A5B43] hover:bg-[#EAE4D9] transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER 1: FOTO DE RETRATO DA FUNDADORA                           */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'photo' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Camera className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      A Criadora • Foto de Retrato
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Retrato da Criadora / Dona da Maison
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Carregue uma foto direto do seu aparelho ou utilize uma URL de alta resolução.
                  </p>
                </div>

                {/* Prévia Atual da Foto */}
                <div className="flex items-center gap-4 p-3 bg-white rounded-xs border border-[#BFAE9C]/40">
                  <div className="w-16 h-20 rounded-xs overflow-hidden shrink-0 bg-[#EDE6DC] shadow-xs">
                    <img
                      src={founderImage}
                      alt={founderName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-xs font-semibold text-[#3D3229] truncate">{founderName}</p>
                    <p className="text-[11px] text-[#7A5B43] italic">{founderRole}</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-[10.5px] uppercase tracking-wider rounded-xs font-medium transition-colors cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Carregar Foto do Aparelho</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Campo de URL da Imagem */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Ou cole o link da imagem (URL)
                  </label>
                  <input
                    type="url"
                    value={founderImage}
                    onChange={(e) => updateField('imageUrl', e.target.value)}
                    placeholder="https://exemplo.com/foto-fundadora.jpg"
                    className="w-full text-xs font-mono bg-white border border-[#BFAE9C]/60 rounded-xs p-2.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Texto Alternativo (Acessibilidade) */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Descrição da Imagem (Acessibilidade / Alt)
                  </label>
                  <input
                    type="text"
                    value={settings?.imageAlt || ''}
                    onChange={(e) => updateField('imageAlt', e.target.value)}
                    placeholder={`Retrato de ${founderName}, ${founderRole}`}
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Atalho para editar o Selo de Autoria */}
                <div className="pt-2 border-t border-[#BFAE9C]/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#3D3229]">
                    <Sparkles className="w-3.5 h-3.5 text-[#7A5B43]" />
                    <span>Selo na foto:</span>
                    <strong className="font-cinzel text-[#7A5B43]">{founderBadge || '(Oculto)'}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePopover('badge')}
                    className="text-xs text-[#7A5B43] hover:text-[#3D3229] font-medium underline underline-offset-2 cursor-pointer"
                  >
                    Editar Selo (Autoria) →
                  </button>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER: SELO DA FOTO / AUTORIA                                  */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'badge' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      Foto • Selo de Autoria
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Selo Flutuante da Imagem
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Personalize o texto que aparece sobre a foto da fundadora (ex: Autoria, Criadora, etc.) ou oculte se preferir.
                  </p>
                </div>

                {/* Campo de Texto do Selo */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Texto do Selo
                  </label>
                  <input
                    type="text"
                    value={founderBadge}
                    onChange={(e) => updateField('badgeText', e.target.value)}
                    placeholder="Ex: Autoria, Criadora, Atelier, Maison..."
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Sugestões de Selo */}
                <div className="space-y-2 pt-2 border-t border-[#BFAE9C]/30">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Sugestões Rápidas de Selo
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Autoria', 'A Criadora', 'Maison', 'Atelier', 'Fundadora', 'Design Autoral', 'Tiragem Rara'].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => updateField('badgeText', sug)}
                        className={`px-2.5 py-1 text-xs rounded-xs border transition-colors cursor-pointer ${
                          founderBadge === sug
                            ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                            : 'bg-white text-[#3D3229] border-[#BFAE9C]/50 hover:bg-[#EDE6DC]'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateField('badgeText', '')}
                      className="px-2.5 py-1 text-xs rounded-xs border border-dashed border-red-300 text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Ocultar Selo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER 2: IDENTIDADE (NOME, CARGO, TAGLINE)                      */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'identity' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Type className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      A Criadora • Identidade & Títulos
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Nome e Papel na Maison
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Configure a apresentação nobre da criadora da marca.
                  </p>
                </div>

                {/* Tagline do Topo */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Tagline / Insígnia Poética
                  </label>
                  <input
                    type="text"
                    value={founderTagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    placeholder="A Alma da Maison"
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Nome da Fundadora */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Nome da Fundadora / Diretora
                  </label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Aline de La Tour"
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Cargo / Título Nobre */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Cargo / Título Nobre
                  </label>
                  <input
                    type="text"
                    value={founderRole}
                    onChange={(e) => updateField('role', e.target.value)}
                    placeholder="Fundadora & Diretora Criativa"
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER 3: PILARES DO SABER-FAZER                                 */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'items' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#7A5B43]">
                      <List className="w-4 h-4" />
                      <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                        A Criadora • Pilares & Conteúdo
                      </span>
                    </div>
                    <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                      Pilares & Tópicos Autoriais
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsAddingItem(!isAddingItem)}
                    className="inline-flex items-center gap-1 text-xs text-[#7A5B43] hover:text-[#2C231C] font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Pilar</span>
                  </button>
                </div>

                {/* Título Geral do Bloco de Pilares */}
                <div className="p-3 bg-white rounded-xs border border-[#BFAE9C]/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Título do Bloco / Seção
                    </label>
                    <span className="text-[10px] text-[#8C7A6B] italic font-serif">
                      Totalmente personalizável
                    </span>
                  </div>
                  <input
                    type="text"
                    value={itemsTitle}
                    onChange={(e) => updateField('itemsTitle', e.target.value)}
                    placeholder="Ex: Pilares da Criação, Manifesto Autoral, O Saber-Fazer..."
                    className="w-full text-xs bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Pilares da Criação', 'Manifesto Autoral', 'Saber-Fazer Nobre', 'Rituais da Maison', 'Essência da Marca'].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => updateField('itemsTitle', sug)}
                        className={`text-[9.5px] px-2 py-0.5 rounded-xs border transition-colors cursor-pointer ${
                          itemsTitle === sug
                            ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                            : 'bg-white text-[#5C4D41] border-[#BFAE9C]/40 hover:bg-[#EDE6DC]'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateField('itemsTitle', '')}
                      className="text-[9.5px] px-2 py-0.5 rounded-xs border border-dashed border-red-300 text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Sem título
                    </button>
                  </div>
                </div>

                {/* Formulário para Adicionar Novo Pilar */}
                {isAddingItem && (
                  <div className="p-3 bg-white rounded-xs border border-[#7A5B43] space-y-2 animate-in fade-in duration-200">
                    <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block">
                      Adicionar Novo Pilar
                    </span>
                    <input
                      type="text"
                      placeholder="Título (ex: Essências Naturais)"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      className="w-full text-xs bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none"
                    />
                    <textarea
                      placeholder="Descrição do pilar..."
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      rows={2}
                      className="w-full text-xs bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none resize-none"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setIsAddingItem(false)}
                        className="px-2.5 py-1 text-xs text-[#7A5B43] hover:text-[#3D3229]"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddItem}
                        disabled={!newItemTitle.trim()}
                        className="px-3 py-1 bg-[#7A5B43] hover:bg-[#6F775C] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-medium rounded-xs transition-colors"
                      >
                        Salvar Pilar
                      </button>
                    </div>
                  </div>
                )}

                {/* Seletor de Pilar para Edição */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {items.map((it, idx) => (
                    <button
                      key={it.id || idx}
                      onClick={() => setEditingItemIndex(idx)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 cursor-pointer ${
                        editingItemIndex === idx
                          ? 'bg-[#7A5B43] text-white shadow-xs'
                          : 'bg-white border border-[#BFAE9C]/40 text-[#3D3229] hover:bg-[#EDE6DC]'
                      }`}
                    >
                      Pilar 0{idx + 1}
                    </button>
                  ))}
                </div>

                {/* Editor do Pilar Selecionado */}
                {items[editingItemIndex] && (
                  <div className="space-y-3 p-3 bg-white rounded-xs border border-[#BFAE9C]/40">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                        Título do Pilar 0{editingItemIndex + 1}
                      </label>
                      <input
                        type="text"
                        value={items[editingItemIndex].title}
                        onChange={(e) => handleUpdateItem(editingItemIndex, 'title', e.target.value)}
                        placeholder="Ex: Curadoria Autoral"
                        className="w-full text-xs bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                        Descrição do Pilar
                      </label>
                      <textarea
                        value={items[editingItemIndex].description}
                        onChange={(e) => handleUpdateItem(editingItemIndex, 'description', e.target.value)}
                        rows={3}
                        placeholder="Escreva a essência deste pilar..."
                        className="w-full text-xs bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] resize-none"
                      />
                    </div>

                    {items.length > 1 && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => handleRemoveItem(editingItemIndex)}
                          className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir este pilar</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER 4: CITAÇÃO POÉTICA (QUOTE)                                */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'quote' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Quote className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      A Criadora • Frase de Assinatura
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Citação Poética da Criadora
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Frase de assinatura destacada entre aspas na base da seção.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Texto da Citação
                  </label>
                  <textarea
                    rows={3}
                    value={founderQuote}
                    onChange={(e) => updateField('quote', e.target.value)}
                    placeholder="O luxo autêntico é o afeto e o tempo lapidados à mão."
                    className="w-full text-xs font-serif italic bg-white border border-[#BFAE9C]/60 rounded-xs p-3 text-[#3D3229] focus:outline-none focus:border-[#7A5B43] resize-none"
                  />
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER 5: BOTÃO DE HISTÓRIA / AÇÃO                               */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'button' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      A Criadora • Botão de Ação
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Botão de Convite / História
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Texto do link que convida o visitante a aprofundar no manifesto da marca.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Rótulo do Botão
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => updateField('buttonText', e.target.value)}
                    placeholder="Conheça a história"
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER 6: AJUSTES GERAIS DA SEÇÃO                                */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'section' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Sliders className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      A Criadora • Configurações da Seção
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Visibilidade da Seção
                  </h4>
                </div>

                {/* Ativar/Desativar Seção Inteira */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-[#3D3229] block">
                      Exibir Seção na Página Inicial
                    </span>
                    <span className="text-[11px] text-[#7A5B43]">
                      Quando desmarcado, a seção fica invisível para os clientes.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings?.enabled !== false}
                    onChange={(e) => updateField('enabled', e.target.checked)}
                    className="w-4 h-4 accent-[#7A5B43] rounded"
                  />
                </label>
              </div>
            )}

            {/* Botão de Concluir Edição do Popover */}
            <div className="pt-3 border-t border-[#BFAE9C]/30 flex justify-end">
              <button
                onClick={() => setActivePopover(null)}
                className="px-4 py-2 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Pronto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

