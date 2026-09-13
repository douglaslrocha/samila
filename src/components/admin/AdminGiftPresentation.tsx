import React, { useState } from 'react';
import { StoreCustomizationSettings, GiftPresentationSettings, GiftSlide } from '../../types';
import { 
  Gift, 
  Sparkles, 
  Plus, 
  Trash2, 
  Play, 
  Image as ImageIcon, 
  ArrowUp, 
  ArrowDown,
  Smartphone,
  Tag,
  Sliders,
  Scissors,
  Music
} from 'lucide-react';

interface AdminGiftPresentationProps {
  settings: StoreCustomizationSettings;
  onUpdateSettings: (newSettings: StoreCustomizationSettings) => void;
  onTestPresentation: () => void;
}

export const AdminGiftPresentation: React.FC<AdminGiftPresentationProps> = ({
  settings,
  onUpdateSettings,
  onTestPresentation
}) => {
  const currentGift = settings.giftPresentation || {
    enabled: true,
    autoOpenOnMobileFirstVisit: true,
    floatingButtonEnabled: true,
    floatingButtonLabel: 'Apresentação',
    floatingButtonPosition: 'bottom-left',
    slides: [
      {
        id: 'slide-1',
        title: 'Imagem 1',
        message: '',
        imageUrl: '/presentation/slide-1.png'
      },
      {
        id: 'slide-2',
        title: 'Imagem 2',
        message: '',
        imageUrl: '/presentation/slide-2.png'
      },
      {
        id: 'slide-3',
        title: 'Imagem 3',
        message: '',
        imageUrl: '/presentation/slide-3.png'
      },
      {
        id: 'slide-4',
        title: 'Imagem 4',
        message: '',
        imageUrl: '/presentation/slide-4.png'
      },
      {
        id: 'slide-5',
        title: 'Imagem 5',
        message: '',
        imageUrl: '/presentation/slide-5.png'
      },
      {
        id: 'slide-6',
        title: 'Imagem 6',
        message: '',
        imageUrl: '/presentation/slide-6.png'
      },
      {
        id: 'slide-7',
        title: 'Imagem 7',
        message: '',
        imageUrl: '/presentation/slide-7.png'
      }
    ]
  };

  const [activeTab, setActiveTab] = useState<'slides' | 'settings'>('slides');

  const updateGiftSettings = (partial: Partial<GiftPresentationSettings>) => {
    const updated: GiftPresentationSettings = {
      ...currentGift,
      ...partial
    };
    onUpdateSettings({
      ...settings,
      giftPresentation: updated
    });
  };

  const handleUpdateSlide = (slideId: string, partial: Partial<GiftSlide>) => {
    const newSlides = currentGift.slides.map(slide => 
      slide.id === slideId ? { ...slide, ...partial } : slide
    );
    updateGiftSettings({ slides: newSlides });
  };

  const handleAddSlide = () => {
    const newIndex = currentGift.slides.length + 1;
    const newSlide: GiftSlide = {
      id: `slide-${Date.now()}`,
      title: `Imagem ${newIndex}`,
      message: '',
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85'
    };
    updateGiftSettings({ slides: [...currentGift.slides, newSlide] });
  };

  const handleDeleteSlide = (slideId: string) => {
    if (currentGift.slides.length <= 1) {
      alert('A apresentação precisa ter pelo menos 1 imagem.');
      return;
    }
    const newSlides = currentGift.slides.filter(s => s.id !== slideId);
    updateGiftSettings({ slides: newSlides });
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentGift.slides.length) return;

    const copy = [...currentGift.slides];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    updateGiftSettings({ slides: copy });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header com Banner Exclusivo e Botão de Teste */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2B1A1B] via-[#3E2123] to-[#241314] text-[#FAF5EE] border border-[#E5BBA5]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5BBA5]/20 border border-[#E5BBA5]/40 text-[#E5BBA5] text-[10px] uppercase tracking-widest font-semibold">
            <Gift className="w-3 h-3 text-[#D4AF37]" />
            <span>Apresentação & Corte de Fita</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#FAF6F2] font-normal leading-tight">
            Série de Imagens, Som de Harpa & Corte do Laço
          </h2>
          <p className="text-xs sm:text-sm text-[#D8C7BD] font-light leading-relaxed">
            O visitante assiste à sequência de imagens puras com acordes sonoros suaves. Ao final da 4ª imagem, a fachada da loja surge com a cerimônia do corte da fita, som de tesoura, fanfarra triunfal e chuva de confetes!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onTestPresentation}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#E5BBA5] via-[#D4AF37] to-[#F7EDE8] text-[#241314] font-serif text-xs uppercase tracking-wider font-bold shadow-[0_4px_16px_rgba(229,187,165,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-amber-200"
            title="Abrir a apresentação para testar o fluxo com som e corte do laço"
          >
            <Play className="w-4 h-4 fill-current text-[#8C1D2A]" />
            <span>▶️ Testar Apresentação com Som</span>
          </button>
        </div>
      </div>

      {/* Destaque das Etapas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-[#BFAE9C]/30 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E8E0D4] flex items-center justify-center text-[#7A5B43] shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-xs text-[#3D3229] font-bold">1. Imagens 1 a 4</h4>
            <p className="text-[11px] text-[#7A5B43]">Puras imagens sem botão de fechar</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#BFAE9C]/30 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-xs text-[#3D3229] font-bold">2. Corte do Laço</h4>
            <p className="text-[11px] text-[#7A5B43]">Fita de cetim na fachada da loja</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#BFAE9C]/30 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800 shrink-0">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-xs text-[#3D3229] font-bold">3. Som & Confetes</h4>
            <p className="text-[11px] text-[#7A5B43]">Fanfarra dourada de harpa e sinos</p>
          </div>
        </div>
      </div>

      {/* Tabs de Configuração */}
      <div className="flex items-center gap-2 border-b border-[#BFAE9C]/30 pb-2 overflow-x-auto">
        {[
          { id: 'slides', label: '1. Série de Imagens (1 a 4)', icon: ImageIcon, count: currentGift.slides.length },
          { id: 'settings', label: '2. Parâmetros & Etiqueta Flutuante', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#3D3229] text-white shadow-sm'
                  : 'text-[#7A5B43] hover:text-[#3D3229] hover:bg-white/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-[#E5BBA5] text-[#2B1A1B]' : 'bg-[#E8E0D4] text-[#7A5B43]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SLIDES DE IMAGENS */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base text-[#3D3229] font-medium">
                Série de Imagens da Apresentação
              </h3>
              <p className="text-xs text-[#7A5B43]">
                Cole o link de cada foto (1ª, 2ª, 3ª e 4ª). Ao terminar a 4ª imagem, a inauguração com o corte do laço é exibida em frente à loja.
              </p>
            </div>

            <button
              onClick={handleAddSlide}
              className="px-3.5 py-2 rounded-lg bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Imagem</span>
            </button>
          </div>

          <div className="space-y-4">
            {currentGift.slides.map((slide, index) => {
              const isLast = index === currentGift.slides.length - 1;
              return (
                <div 
                  key={slide.id}
                  className={`bg-white/95 rounded-2xl border p-5 shadow-xs space-y-4 ${
                    isLast ? 'border-amber-400/60 ring-1 ring-amber-300/40 bg-gradient-to-r from-white via-[#FFFDF9] to-[#FFF9F3]' : 'border-[#BFAE9C]/35'
                  }`}
                >
                  {/* Cabeçalho do Card */}
                  <div className="flex items-center justify-between border-b border-[#BFAE9C]/20 pb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full text-xs font-serif font-bold flex items-center justify-center ${
                        isLast ? 'bg-amber-500 text-white shadow-xs' : 'bg-[#E8E0D4] text-[#7A5B43]'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm text-[#3D3229] font-semibold">
                          Imagem {index + 1}
                        </span>
                        {isLast && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-medium uppercase tracking-wider">
                            <Scissors className="w-3 h-3 text-amber-600" />
                            <span>Última Imagem ➔ Abre Corte do Laço</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveSlide(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-[#7A5B43] hover:text-[#3D3229] disabled:opacity-30 rounded hover:bg-[#E8E0D4]"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(index, 'down')}
                        disabled={index === currentGift.slides.length - 1}
                        className="p-1.5 text-[#7A5B43] hover:text-[#3D3229] disabled:opacity-30 rounded hover:bg-[#E8E0D4]"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 ml-1"
                        title="Excluir esta imagem"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Grid de Configuração da Imagem */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Prévia */}
                    <div className="md:col-span-4">
                      <div className="w-full h-44 rounded-xl overflow-hidden bg-black border border-[#BFAE9C]/30 relative shadow-inner group">
                        <img
                          src={slide.imageUrl}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85';
                          }}
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[10px] text-white font-medium border border-white/20">
                          {index + 1} de {currentGift.slides.length}
                        </div>
                      </div>
                    </div>

                    {/* Campo de Link */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#7A5B43] font-semibold mb-1">
                          Link da Imagem {index + 1} (URL)
                        </label>
                        <input
                          type="text"
                          value={slide.imageUrl || ''}
                          onChange={(e) => handleUpdateSlide(slide.id, { imageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#BFAE9C]/50 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7A5B43] font-mono text-[#3D3229]"
                        />
                        <p className="text-[11px] text-[#7A5B43] mt-1">
                          Cole aqui o link direto da imagem ({index + 1}ª da sequência).
                        </p>
                      </div>

                      {isLast && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            Após esta imagem, o visitante entrará na inauguração com o laço em frente à loja, som triunfal e chuva de confetes!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PARÂMETROS & ETIQUETA FLUTUANTE */}
      {activeTab === 'settings' && (
        <div className="bg-white/95 rounded-2xl border border-[#BFAE9C]/35 p-6 shadow-xs space-y-6">
          <div className="border-b border-[#BFAE9C]/20 pb-4">
            <h3 className="font-serif text-base text-[#3D3229] font-medium flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#7A5B43]" />
              <span>Etiqueta Flutuante Minimalista & Comportamento</span>
            </h3>
            <p className="text-xs text-[#7A5B43]">
              Ajuste as opções de abertura e a etiqueta discreta na tela inicial.
            </p>
          </div>

          <div className="space-y-4">
            {/* Opção 1: Ativar apresentação */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#BFAE9C]/25">
              <div>
                <h4 className="text-xs font-semibold text-[#3D3229] uppercase tracking-wide">
                  Ativar Apresentação com Corte de Fita
                </h4>
                <p className="text-xs text-[#7A5B43]">
                  Habilita toda a sequência de fotos e a cerimônia de inauguração com áudio e confetes.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentGift.enabled !== false}
                onChange={(e) => updateGiftSettings({ enabled: e.target.checked })}
                className="w-5 h-5 accent-[#7A5B43] cursor-pointer"
              />
            </div>

            {/* Opção 2: Abrir automaticamente no mobile */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#BFAE9C]/25">
              <div>
                <h4 className="text-xs font-semibold text-[#3D3229] uppercase tracking-wide flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#7A5B43]" />
                  <span>Abrir Automaticamente no Mobile (1ª visita)</span>
                </h4>
                <p className="text-xs text-[#7A5B43]">
                  Ao abrir o site no celular pela primeira vez, a apresentação surge automaticamente antes da loja.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentGift.autoOpenOnMobileFirstVisit !== false}
                onChange={(e) => updateGiftSettings({ autoOpenOnMobileFirstVisit: e.target.checked })}
                className="w-5 h-5 accent-[#7A5B43] cursor-pointer"
              />
            </div>

            {/* Opção 3: Exibir etiqueta flutuante */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#BFAE9C]/25">
              <div>
                <h4 className="text-xs font-semibold text-[#3D3229] uppercase tracking-wide flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#7A5B43]" />
                  <span>Exibir Etiqueta Flutuante Compacta na Home</span>
                </h4>
                <p className="text-xs text-[#7A5B43]">
                  Exibe a mini pílula discreta para rever a apresentação a qualquer momento.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentGift.floatingButtonEnabled !== false}
                onChange={(e) => updateGiftSettings({ floatingButtonEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#7A5B43] cursor-pointer"
              />
            </div>

            {/* Configuração da Etiqueta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A5B43] font-medium mb-1">
                  Texto da Etiqueta
                </label>
                <input
                  type="text"
                  value={currentGift.floatingButtonLabel || 'Apresentação'}
                  onChange={(e) => updateGiftSettings({ floatingButtonLabel: e.target.value })}
                  placeholder="Apresentação"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#BFAE9C]/40 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A5B43] font-medium mb-1">
                  Posição da Etiqueta na Tela
                </label>
                <select
                  value={currentGift.floatingButtonPosition || 'bottom-left'}
                  onChange={(e) => updateGiftSettings({ floatingButtonPosition: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#BFAE9C]/40 bg-white"
                >
                  <option value="bottom-left">Canto Inferior Esquerdo (Recomendado)</option>
                  <option value="bottom-right">Canto Inferior Direito</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
