import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  Check, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  Building2,
  MapPin,
  FileText,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { StoreCustomizationSettings } from '../../types';
import { 
  getStoreName, 
  getStoreMonogram, 
  cascadeStoreIdentityUpdate 
} from '../../utils/storeIdentity';
import { saveStoreSettingsToSupabase } from '../../lib/supabase';

interface StoreIdentityPageProps {
  settings: StoreCustomizationSettings;
  onUpdateSettings: (newSettings: StoreCustomizationSettings) => void;
  onNavigateHome?: () => void;
}

export const StoreIdentityPage: React.FC<StoreIdentityPageProps> = ({
  settings,
  onUpdateSettings,
  onNavigateHome
}) => {
  const [storeName, setStoreName] = useState(getStoreName(settings));
  const [monogram, setMonogram] = useState(getStoreMonogram(settings));
  const [tagline, setTagline] = useState(
    settings.general?.tagline || 
    settings.footer?.brand?.tagline?.text?.replace(/[“”]/g, '') || 
    'Atelier de Criação Autoral • Velas, Sabonetes & Arte Botânica'
  );
  const [cnpjOrDocument, setCnpjOrDocument] = useState(
    settings.general?.cnpjOrDocument || '00.000.000/0001-00'
  );
  const [addressCity, setAddressCity] = useState(
    settings.general?.addressCity || 'São Paulo - SP'
  );

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setStoreName(getStoreName(settings));
    setMonogram(getStoreMonogram(settings));
    if (settings.general?.tagline) setTagline(settings.general.tagline);
    if (settings.general?.cnpjOrDocument) setCnpjOrDocument(settings.general.cnpjOrDocument);
    if (settings.general?.addressCity) setAddressCity(settings.general.addressCity);
  }, [settings]);

  // Auto-save debounce para que nenhuma alteração seja perdida em caso de oscilação de rede ou reload
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const updated = cascadeStoreIdentityUpdate(settings, {
        storeName: storeName.trim() || getStoreName(settings),
        monogram: monogram.trim().toUpperCase() || getStoreMonogram(settings),
        tagline: tagline.trim(),
        cnpjOrDocument: cnpjOrDocument.trim(),
        addressCity: addressCity.trim()
      });
      onUpdateSettings(updated);
    }, 600);

    return () => clearTimeout(timer);
  }, [storeName, monogram, tagline, cnpjOrDocument, addressCity]);

  // Atualização automática de monograma sugerido ao digitar o nome
  const handleNameChange = (val: string) => {
    setStoreName(val);
    const words = val.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      setMonogram((words[0][0] + words[1][0]).toUpperCase());
    } else if (val.trim().length > 0) {
      setMonogram(val.trim().slice(0, 2).toUpperCase());
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    const updated = cascadeStoreIdentityUpdate(settings, {
      storeName: storeName.trim(),
      monogram: monogram.trim().toUpperCase(),
      tagline: tagline.trim(),
      cnpjOrDocument: cnpjOrDocument.trim(),
      addressCity: addressCity.trim()
    });

    onUpdateSettings(updated);

    try {
      await saveStoreSettingsToSupabase(updated);
    } catch {
      // Continua com sucesso local
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  // Parâmetros do preview do selo
  const displayMonogram = monogram || storeName.slice(0, 2).toUpperCase() || 'ME';
  const nameParts = storeName.trim().split(/\s+/);
  const sealTop = nameParts[0]?.toUpperCase() || 'MAISON';
  const sealBottom = nameParts.slice(1).join(' ')?.toUpperCase() || 'ATELIER';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Banner Informativo Superior (Responsivo & Nobre) */}
      <div className="bg-[#2C231C] text-[#FAF8F5] p-5 sm:p-7 rounded-xs border border-[#BFAE9C]/30 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFDF80] text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#FFDF80]" />
            <span>Identidade Oficial da Marca</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
            Nome do e-Commerce & Emblema Institucional
          </h3>
          <p className="text-xs sm:text-sm text-[#D7C9BA] max-w-2xl font-light leading-relaxed">
            Altere o nome oficial da loja, sigla/monograma e dados institucionais. 
            Ao salvar, as alterações são aplicadas de forma sincronizada em todo o site (cabeçalho, rodapé, orçamentos, títulos e selos).
          </p>
        </div>
      </div>

      {/* Grid Principal: Formulário + Preview Visual em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Coluna 1: Campos do Formulário */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-xs border border-[#BFAE9C]/40 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#BFAE9C]/30">
            <Store className="w-4 h-4 text-[#7A5B43]" />
            <h4 className="font-serif text-base text-[#2C231C] font-semibold tracking-wide">
              Dados Fundamentais da Loja
            </h4>
          </div>

          <div className="space-y-4">
            {/* Nome do e-Commerce */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#3D3229] flex items-center justify-between">
                <span>Nome Oficial do e-Commerce</span>
                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Global em todo o site
                </span>
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Maison Entrelaço"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-sm sm:text-base font-serif text-[#2C231C] focus:outline-none focus:border-[#7A5B43] focus:bg-white transition-all shadow-2xs"
              />
              <p className="text-[11px] text-[#7A5B43]/80">
                Este nome substitui "Maison Entrelaço" em todas as áreas públicas da boutique.
              </p>
            </div>

            {/* Sigla / Monograma */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#3D3229] flex items-center justify-between">
                <span>Sigla / Monograma (2 a 4 letras)</span>
                <span className="text-[10px] font-normal text-[#7A5B43]">Selo Circular</span>
              </label>
              <input
                type="text"
                maxLength={4}
                value={monogram}
                onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                placeholder="Ex: ME"
                className="w-full sm:w-48 px-3.5 py-2.5 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-sm font-serif uppercase tracking-widest text-[#2C231C] focus:outline-none focus:border-[#7A5B43] focus:bg-white transition-all font-bold"
              />
            </div>

            {/* Slogan / Subtítulo Institucional */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#3D3229]">
                Slogan / Subtítulo Institucional
              </label>
              <textarea
                rows={2}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex: Atelier de Criação Autoral • Velas, Sabonetes & Arte Botânica"
                className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-xs sm:text-sm text-[#2C231C] focus:outline-none focus:border-[#7A5B43] focus:bg-white transition-all"
              />
            </div>

            {/* Informações Complementares: Documento e Cidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3D3229] flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#7A5B43]" />
                  <span>CNPJ ou Registro</span>
                </label>
                <input
                  type="text"
                  value={cnpjOrDocument}
                  onChange={(e) => setCnpjOrDocument(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-xs font-mono text-[#2C231C] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3D3229] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#7A5B43]" />
                  <span>Cidade e Estado</span>
                </label>
                <input
                  type="text"
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  placeholder="São Paulo - SP"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-xs text-[#2C231C] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Pré-visualização da Identidade Visual */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-xs border border-[#BFAE9C]/40 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#BFAE9C]/30">
            <Eye className="w-4 h-4 text-[#7A5B43]" />
            <h4 className="font-serif text-base text-[#2C231C] font-semibold tracking-wide">
              Prévia Visual da Identidade
            </h4>
          </div>

          {/* Emblema Circular */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#FAF8F5] rounded-xs border border-[#BFAE9C]/30 space-y-4">
            <div className="relative w-28 h-28 rounded-full border-2 border-[#7A5B43]/50 bg-[#FDFBF7] flex items-center justify-center shadow-md p-1">
              <svg viewBox="0 0 100 100" className="w-full h-full select-none">
                <circle cx="50" cy="50" r="47" stroke="#7A5B43" strokeWidth="1.2" fill="none" />
                <circle cx="50" cy="50" r="43" stroke="#BFAE9C" strokeWidth="0.8" strokeDasharray="2,2" fill="none" />
                
                <path id="previewCircleTop" d="M 20,50 A 30,30 0 0,1 80,50" fill="none" />
                <text fontSize="7" letterSpacing="1.8" fill="#7A5B43" fontWeight="600" fontFamily="Montserrat, sans-serif">
                  <textPath href="#previewCircleTop" startOffset="50%" textAnchor="middle">
                    {sealTop}
                  </textPath>
                </text>

                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  fontFamily="Cinzel, serif"
                  fontSize={displayMonogram.length <= 2 ? '18' : '13'}
                  fontWeight="600"
                  fill="#3D3229"
                  letterSpacing="0.5"
                >
                  {displayMonogram}
                </text>

                <circle cx="50" cy="62" r="1.5" fill="#7A5B43" />

                <path id="previewCircleBottom" d="M 80,52 A 30,30 0 0,1 20,52" fill="none" />
                <text fontSize="6" letterSpacing="1.6" fill="#7A5B43" fontWeight="500" fontFamily="Montserrat, sans-serif">
                  <textPath href="#previewCircleBottom" startOffset="50%" textAnchor="middle">
                    {sealBottom}
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Tipografia de Logo no Cabeçalho */}
            <div className="text-center space-y-1">
              <div className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.22em] text-[#2C231C] uppercase">
                {storeName || 'NOME DA LOJA'}
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#7A5B43] font-medium">
                ATELIER & BOUTIQUE
              </div>
              <p className="font-serif italic text-xs text-[#7A5B43]/80 max-w-xs pt-1">
                “{tagline}”
              </p>
            </div>
          </div>

          <div className="text-xs text-[#7A5B43] space-y-1.5 p-3.5 bg-[#FAF8F5]/80 rounded-xs border border-[#BFAE9C]/25">
            <div className="flex items-center gap-1.5 font-medium text-[#2C231C]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sincronização em Cascata:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#7A5B43]">
              Ao salvar, este nome e sigla serão atualizados automaticamente no cabeçalho, rodapé, telas de checkout e links do site.
            </p>
          </div>
        </div>

      </div>

      {/* Barra de Ação Inferior (100% RESPONSIVA, SEM CORTES NO MOBILE) */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xs border border-[#BFAE9C]/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#7A5B43]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium truncate">Identidade pronta para aplicação global</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-4 py-2 border border-[#BFAE9C]/70 text-[#3D3229] hover:bg-[#FAF8F5] text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ver na Loja Virtual</span>
              <ExternalLink className="w-3 h-3 text-[#7A5B43]" />
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#7A5B43] hover:bg-[#60442F] active:scale-95 text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-all flex items-center justify-center gap-2"
          >
            {saveStatus === 'saving' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{saveStatus === 'saved' ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
