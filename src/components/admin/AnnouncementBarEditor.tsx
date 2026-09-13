import React from 'react';
import { HeaderSettings } from '../../types';
import { 
  X, 
  Sparkles, 
  Check, 
  Palette, 
  Type, 
  Link as LinkIcon, 
  Eye, 
  EyeOff, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface AnnouncementBarEditorProps {
  settings: HeaderSettings['announcementBar'];
  onUpdate: (newSettings: HeaderSettings['announcementBar']) => void;
  onClose: () => void;
}

const BG_COLOR_PRESETS = [
  { name: 'Café Espresso', color: '#3D3229' },
  { name: 'Madeira Nobre', color: '#241E1A' },
  { name: 'Argila Atelier', color: '#7A5B43' },
  { name: 'Oliva Botânico', color: '#6F775C' },
  { name: 'Creme Rústico', color: '#E8E0D4' },
  { name: 'Caramelo Âmbar', color: '#9C7A5B' },
  { name: 'Vinho Bordô', color: '#4A1E24' },
  { name: 'Azul Meia-Noite', color: '#1B2A38' }
];

const TEXT_COLOR_PRESETS = [
  { name: 'Creme Suave', color: '#F7F4EF' },
  { name: 'Branco Puro', color: '#FFFFFF' },
  { name: 'Dourado Quente', color: '#D4AF37' },
  { name: 'Café Escuro', color: '#3D3229' },
  { name: 'Preto Atelier', color: '#1A1512' }
];

const QUICK_SECTION_LINKS = [
  { label: 'As Três Casas', value: '#tres-casas' },
  { label: 'Casa I • Velas', value: '#velas' },
  { label: 'Casa II • Sabonetes', value: '#sabonetes' },
  { label: 'Casa III • Crochê', value: '#croche' },
  { label: 'Boutique & Carrinho', value: '#secao-carrinho-casa' }
];

export const AnnouncementBarEditor: React.FC<AnnouncementBarEditorProps> = ({
  settings,
  onUpdate,
  onClose
}) => {
  const currentBg = settings.bgColor || '#3D3229';
  const currentText = settings.textColor || '#F7F4EF';

  const handleChange = <K extends keyof HeaderSettings['announcementBar']>(
    field: K,
    value: HeaderSettings['announcementBar'][K]
  ) => {
    onUpdate({
      ...settings,
      [field]: value
    });
  };

  const handleResetDefaults = () => {
    onUpdate({
      enabled: true,
      text: 'Edição de Outono do Atelier • Embalagem para presente em papel vegetal e lacre em cera inclusa',
      linkText: 'Descobrir',
      linkUrl: '#tres-casas',
      bgColor: '#3D3229',
      textColor: '#F7F4EF'
    });
  };

  return (
    <div className="w-full bg-[#FAF8F5] border-y-2 border-[#7A5B43] shadow-xl p-4 sm:p-6 text-[#3D3229] transition-all animate-in slide-in-from-top-4 duration-300">
      
      {/* Header do Contêiner de Edição */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#BFAE9C]/35">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#7A5B43] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-sm sm:text-base font-medium text-[#3D3229] tracking-wide">
                Edição da Faixa de Informações (Announcement Bar)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                Ao Vivo
              </span>
            </div>
            <p className="text-[11px] text-[#7A5B43] font-light">
              Altere textos, links e cores no formulário abaixo e veja a faixa mudar instantaneamente acima.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            type="button"
            className="px-2.5 py-1.5 text-[10.5px] uppercase tracking-wider text-[#7A5B43] hover:text-[#3D3229] hover:bg-[#E8E0D4]/60 rounded-xs flex items-center gap-1.5 transition-colors"
            title="Restaurar valores padrão da Maison"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restaurar Padrão</span>
          </button>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-[#7A5B43] hover:text-[#3D3229] hover:bg-[#E8E0D4] rounded-full transition-colors"
            title="Fechar editor da faixa"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grade de Configurações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
        
        {/* Coluna 1: Visibilidade & Texto Principal */}
        <div className="space-y-4 bg-white p-4 rounded-xs border border-[#BFAE9C]/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-serif font-medium text-[#3D3229] uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#7A5B43]" />
              Status da Faixa
            </label>
            <button
              onClick={() => handleChange('enabled', !settings.enabled)}
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                settings.enabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {settings.enabled ? (
                <>
                  <Eye className="w-3 h-3" />
                  <span>Ativa</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>Oculta</span>
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#7A5B43] uppercase tracking-wider mb-1.5">
              Texto da Mensagem
            </label>
            <textarea
              rows={3}
              value={settings.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Digite o comunicado oficial do Atelier..."
              className="w-full text-xs p-2.5 rounded-xs bg-[#FAF8F5] border border-[#BFAE9C]/50 focus:border-[#7A5B43] focus:ring-1 focus:ring-[#7A5B43] text-[#3D3229] outline-none transition-all resize-none"
            />
            <p className="text-[10px] text-[#7A5B43]/80 mt-1">
              Dica: mantenha frases curtas para excelente legibilidade no mobile.
            </p>
          </div>

          {/* Animação Letreiro Rolante (Marquee) */}
          <div className="pt-2 border-t border-[#BFAE9C]/30 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#3D3229] block">
                  Letreiro Rolante (Marquee)
                </span>
                <span className="text-[9.5px] text-[#7A5B43]">
                  Texto desliza continuamente
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.isMarquee ?? false}
                onChange={(e) => handleChange('isMarquee', e.target.checked)}
                className="w-4 h-4 accent-[#7A5B43] cursor-pointer"
              />
            </div>

            {settings.isMarquee && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] uppercase tracking-wider text-[#7A5B43]">
                  Velocidade:
                </span>
                <div className="flex items-center gap-1">
                  {(['slow', 'normal', 'fast'] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => handleChange('marqueeSpeed', spd)}
                      className={`px-2 py-0.5 text-[9.5px] uppercase tracking-wider rounded-xs border ${
                        (settings.marqueeSpeed || 'normal') === spd
                          ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                          : 'bg-[#FAF8F5] text-[#3D3229] border-[#BFAE9C]/40'
                      }`}
                    >
                      {spd === 'slow' ? 'Lenta' : spd === 'normal' ? 'Normal' : 'Rápida'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botão Fechar (Dismissible) */}
          <div className="flex items-center justify-between pt-2 border-t border-[#BFAE9C]/30">
            <div>
              <span className="text-[11px] font-medium text-[#3D3229] block">
                Botão de Fechar no Topo
              </span>
              <span className="text-[9.5px] text-[#7A5B43]">
                Permite ao cliente dispensar a barra
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.dismissible ?? false}
              onChange={(e) => handleChange('dismissible', e.target.checked)}
              className="w-4 h-4 accent-[#7A5B43] cursor-pointer"
            />
          </div>
        </div>

        {/* Coluna 2: Botão / Link de Destino */}
        <div className="space-y-4 bg-white p-4 rounded-xs border border-[#BFAE9C]/30 shadow-2xs">
          <div>
            <label className="text-xs font-serif font-medium text-[#3D3229] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <LinkIcon className="w-3.5 h-3.5 text-[#7A5B43]" />
              Link ou Botão de Ação
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#7A5B43] uppercase tracking-wider mb-1">
                  Texto do Link (Opcional)
                </label>
                <input
                  type="text"
                  value={settings.linkText || ''}
                  onChange={(e) => handleChange('linkText', e.target.value)}
                  placeholder="Ex: Descobrir, Conhecer, Ver..."
                  className="w-full text-xs px-2.5 py-1.5 rounded-xs bg-[#FAF8F5] border border-[#BFAE9C]/50 focus:border-[#7A5B43] focus:ring-1 focus:ring-[#7A5B43] text-[#3D3229] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#7A5B43] uppercase tracking-wider mb-1">
                  Destino do Link
                </label>
                <input
                  type="text"
                  value={settings.linkUrl || ''}
                  onChange={(e) => handleChange('linkUrl', e.target.value)}
                  placeholder="Ex: #tres-casas ou https://..."
                  className="w-full text-xs px-2.5 py-1.5 rounded-xs bg-[#FAF8F5] border border-[#BFAE9C]/50 focus:border-[#7A5B43] focus:ring-1 focus:ring-[#7A5B43] text-[#3D3229] outline-none transition-all font-mono"
                />
              </div>

              <div>
                <span className="block text-[10px] text-[#7A5B43] uppercase tracking-wider mb-1.5">
                  Atalhos de Seções:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SECTION_LINKS.map((link) => (
                    <button
                      key={link.value}
                      type="button"
                      onClick={() => handleChange('linkUrl', link.value)}
                      className={`px-2 py-0.5 text-[10px] rounded-xs border transition-all ${
                        settings.linkUrl === link.value
                          ? 'bg-[#3D3229] text-white border-[#3D3229]'
                          : 'bg-[#F2EDE4]/70 text-[#3D3229] border-[#BFAE9C]/30 hover:bg-[#E8E0D4]'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 3: Cores de Fundo e Texto */}
        <div className="space-y-4 bg-white p-4 rounded-xs border border-[#BFAE9C]/30 shadow-2xs">
          <div>
            <label className="text-xs font-serif font-medium text-[#3D3229] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-[#7A5B43]" />
              Cores Personalizadas
            </label>

            {/* Cor de Fundo */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#7A5B43] uppercase tracking-wider">
                <span>Cor de Fundo</span>
                <span className="font-mono text-[10px] text-[#3D3229] bg-[#F2EDE4] px-1.5 py-0.5 rounded-xs">
                  {currentBg}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentBg}
                  onChange={(e) => handleChange('bgColor', e.target.value)}
                  className="w-8 h-8 rounded-xs cursor-pointer border border-[#BFAE9C]/60 p-0.5 bg-white"
                  title="Seletor de cor personalizada"
                />
                <div className="flex flex-wrap gap-1 flex-1">
                  {BG_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => handleChange('bgColor', preset.color)}
                      style={{ backgroundColor: preset.color }}
                      className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${
                        currentBg.toLowerCase() === preset.color.toLowerCase()
                          ? 'scale-110 ring-2 ring-[#7A5B43] ring-offset-1'
                          : 'hover:scale-105'
                      }`}
                      title={`${preset.name} (${preset.color})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Cor do Texto */}
            <div className="space-y-2 pt-2 border-t border-[#BFAE9C]/20">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#7A5B43] uppercase tracking-wider">
                <span>Cor do Texto & Link</span>
                <span className="font-mono text-[10px] text-[#3D3229] bg-[#F2EDE4] px-1.5 py-0.5 rounded-xs">
                  {currentText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentText}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-8 h-8 rounded-xs cursor-pointer border border-[#BFAE9C]/60 p-0.5 bg-white"
                  title="Seletor de cor de texto"
                />
                <div className="flex flex-wrap gap-1 flex-1">
                  {TEXT_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => handleChange('textColor', preset.color)}
                      style={{ backgroundColor: preset.color }}
                      className={`w-6 h-6 rounded-full border border-black/20 transition-transform ${
                        currentText.toLowerCase() === preset.color.toLowerCase()
                          ? 'scale-110 ring-2 ring-[#7A5B43] ring-offset-1'
                          : 'hover:scale-105'
                      }`}
                      title={`${preset.name} (${preset.color})`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Barra de Conclusão */}
      <div className="mt-5 pt-3 border-t border-[#BFAE9C]/30 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-[#7A5B43] flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Suas alterações são salvas automaticamente e sincronizadas em toda a loja.</span>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="px-4 py-2 bg-[#3D3229] hover:bg-[#241E1A] text-white text-xs uppercase tracking-wider rounded-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
        >
          <span>Concluir Edição da Faixa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
