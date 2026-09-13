import React from 'react';
import { StoreCustomizationSettings, Product } from '../../types';
import { getStoreName } from '../../utils/storeIdentity';
import {
  Package,
  Home,
  Database,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  Eye,
  Store,
  Quote,
  Flame,
  Droplets,
  Scissors,
  Settings as SettingsIcon,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  settings: StoreCustomizationSettings;
  products: Product[];
  onNavigatePage: (page: 'home_editor' | 'identity' | 'contact_whatsapp' | 'products' | 'orders' | 'database' | 'settings') => void;
  onOpenStore: () => void;
  onUpdateSettings?: (newSettings: StoreCustomizationSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  products,
  onNavigatePage,
  onOpenStore
}) => {
  const storeName = getStoreName(settings);
  const totalProducts = products.length;
  const velasCount = products.filter(p => p.category === 'velas').length;
  const sabonetesCount = products.filter(p => p.category === 'sabonetes').length;
  const crocheCount = products.filter(p => p.category === 'croche').length;

  // Dados da Fundadora configurados
  const founderData = settings.dashboardFounder || {
    enabled: true,
    ownerName: settings.founder?.name || 'Aline de La Tour',
    ownerRole: settings.founder?.role || 'Fundadora & Diretora Criativa',
    welcomeMessage: 'Mesa de Criação da Fundadora',
    quote: settings.founder?.quote || 'O luxo autêntico é o afeto e o tempo lapidados à mão.',
    heroBgImage: settings.founder?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=85',
    sidebarAvatarImage: settings.founder?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=85',
    gallery: [
      {
        id: 'df-1',
        url: settings.founder?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85',
        title: 'Retrato Autoral da Criadora',
        caption: 'Fotografia de luz natural no atelier de criação botânica',
        createdAt: '2025-01-10'
      },
      {
        id: 'df-2',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
        title: 'Alquimia & Infusões Botânicas',
        caption: 'Seleção de essências puras, óleos nobres e ceras vegetais',
        createdAt: '2025-02-14'
      },
      {
        id: 'df-3',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
        title: 'Curadoria de Fios Nobres',
        caption: 'Estudo do entrelaçado manual de crochê e embalagens em linho',
        createdAt: '2025-03-01'
      }
    ]
  };

  const currentHeroImage = founderData.heroBgImage || settings.founder?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=85';

  const activeSectionsCount = [
    settings.header.announcementBar.enabled,
    true, // hero
    settings.founder.enabled,
    settings.team?.enabled ?? true,
    settings.deliveryExperience?.enabled ?? true,
    settings.brandQuote?.enabled ?? true,
    settings.footer?.enabled ?? true
  ].filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto space-y-9 animate-in fade-in duration-300 pb-12">
      
      {/* ========================================================================= */}
      {/* 1. HERO ELEGANTE DO DASHBOARD • RETRATO AUTORAL DA DONA EM FOCO TOTAL     */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E5CBB8]/60 shadow-[0_16px_45px_rgba(43,26,27,0.18)] min-h-[460px] sm:min-h-[520px] flex items-center">
        
        {/* Imagem de Fundo da Dona (Foco total, nítida, iluminada e radiante) */}
        <img
          src={currentHeroImage}
          alt={founderData.ownerName}
          className="absolute inset-0 w-full h-full object-cover object-[78%_20%] sm:object-[72%_25%] transition-all duration-700 select-none scale-100"
          referrerPolicy="no-referrer"
        />

        {/* Gradiente Lateral de Iluminação & Leitura (Mantém a dona limpa e radiante à direita) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#211213]/95 via-[#2A1718]/70 sm:via-[#2A1718]/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#180E0F]/85 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges Elegantes */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1F1112]/70 backdrop-blur-md text-[#FAF6F2] text-[10.5px] uppercase tracking-widest font-light border border-[#E5BBA5]/35 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-200 shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            <span>Presença Autoral Ativa</span>
          </span>
        </div>

        {/* Cartão Editorial Frontal de Luxo (Posicionado à esquerda sem atrapalhar a dona) */}
        <div className="relative z-10 p-6 sm:p-12 max-w-xl text-[#FAF5EE] space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3D2022]/75 backdrop-blur-md text-[#FFD8C7] text-[10.5px] uppercase tracking-[0.22em] font-medium border border-[#E5BBA5]/35 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E5BBA5]" />
            <span>{founderData.welcomeMessage || 'Mesa de Criação da Fundadora'}</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal tracking-wide drop-shadow-md leading-tight">
              {founderData.ownerName}
            </h1>
            <p className="text-xs sm:text-sm text-[#E8D1C5] font-light tracking-widest uppercase">
              {founderData.ownerRole}
            </p>
          </div>

          {/* Citação Inspiradora */}
          <div className="p-4 rounded-2xl bg-black/35 backdrop-blur-md border border-[#E5BBA5]/25 text-xs sm:text-[13.5px] text-[#FAF0E6] italic font-serif leading-relaxed shadow-inner max-w-lg">
            <div className="flex items-start gap-2.5">
              <Quote className="w-4 h-4 text-[#E5BBA5] shrink-0 mt-0.5 opacity-90" />
              <span>{founderData.quote}</span>
            </div>
          </div>

          {/* Botões de Acesso Rápido em Pílulas Nobres */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigatePage('home_editor')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FAF5EE] to-[#F5ECE4] hover:from-white hover:to-[#FAF5EE] text-[#2B1718] text-xs uppercase tracking-wider font-semibold rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-95 border border-[#E5BBA5]/40"
            >
              <Home className="w-3.5 h-3.5 text-[#8C4A4D]" />
              <span>Explorar Vitrine Home</span>
            </button>

            <button
              onClick={() => onNavigatePage('products')}
              className="px-4 py-2.5 bg-[#4D282B]/80 hover:bg-[#5E3236] text-[#FAF5EE] border border-[#E5BBA5]/40 text-xs uppercase tracking-wider font-medium rounded-full backdrop-blur-md shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Package className="w-3.5 h-3.5 text-[#E5BBA5]" />
              <span>As Três Casas</span>
            </button>

            <button
              onClick={onOpenStore}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#FAF5EE] text-xs uppercase tracking-wider font-medium rounded-full border border-white/25 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Loja ao Vivo</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MOSAICO EDITORIAL DE MOMENTOS DA FUNDADORA NO ATELIER                  */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5CBB8]/40 pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#8C4A4D] mb-0.5">
              <span className="font-serif text-sm">✦</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold">
                Acervo & Momentos da Criadora
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#2B1718] font-normal">
              A Presença da Fundadora no Atelier
            </h2>
          </div>
          <span className="text-xs text-[#7A5B43] font-light">
            Tradição, sensibilidade botânica e alquimia manual
          </span>
        </div>

        {/* Galeria em Estilo Editorial de Alta Costura */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(founderData.gallery || []).slice(0, 3).map((item, idx) => (
            <div
              key={item.id || idx}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E5CBB8]/70 shadow-[0_4px_20px_rgba(61,50,41,0.06)] hover:shadow-xl hover:border-[#8C4A4D]/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Foto com Efeito Passepartout */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F2]">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Badge de Edição */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[#FAF5EE] text-[9.5px] uppercase tracking-widest font-medium border border-white/20 shadow-xs">
                    Edição Autoral 0{idx + 1}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-base font-medium text-white drop-shadow-sm leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Descrição Poética */}
              <div className="p-5 space-y-3 bg-white flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#7A5B43] leading-relaxed line-clamp-2">
                  {item.caption || 'Criação autoral e processos botânicos no atelier.'}
                </p>

                <div className="pt-3 border-t border-[#E5CBB8]/40 flex items-center justify-between text-[10.5px] text-[#8C4A4D] font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#8C4A4D]" />
                    <span>Maison Entrelaço</span>
                  </span>
                  <span className="text-[#7A5B43]">{item.createdAt || 'Coleção 2025'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OS TRÊS PILARES DA CRIAÇÃO AUTORAL                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-white to-[#FAF6F2] p-6 rounded-3xl border border-[#E5CBB8]/70 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF0E6] text-[#8C4A4D] border border-[#E5CBB8] flex items-center justify-center shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-[#2B1718]">
              Casa I • Velas Aromáticas
            </h3>
            <p className="text-xs text-[#7A5B43] mt-1 leading-relaxed">
              Ceras 100% vegetais e infusões de óleos aromáticos destilados para transformar o ar e o tempo.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-[#FAF6F2] p-6 rounded-3xl border border-[#E5CBB8]/70 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF0E6] text-[#8C4A4D] border border-[#E5CBB8] flex items-center justify-center shadow-xs">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-[#2B1718]">
              Casa II • Sabonetes Botânicos
            </h3>
            <p className="text-xs text-[#7A5B43] mt-1 leading-relaxed">
              Saponificação a frio, manteigas nobres e ervas selecionadas que cuidam da pele com carinho mineral.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-[#FAF6F2] p-6 rounded-3xl border border-[#E5CBB8]/70 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF0E6] text-[#8C4A4D] border border-[#E5CBB8] flex items-center justify-center shadow-xs">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-[#2B1718]">
              Casa III • Peças em Crochê
            </h3>
            <p className="text-xs text-[#7A5B43] mt-1 leading-relaxed">
              Fios de algodão e linho nobre entrelaçados ponto a ponto em peças táteis para vestir o ambiente.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CARDS DE MÉTRICAS & STATUS DO ATELIER                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Produtos */}
        <div 
          onClick={() => onNavigatePage('products')}
          className="bg-white p-5 rounded-3xl border border-[#E5CBB8]/70 shadow-xs hover:border-[#8C4A4D] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A5B43]">
              Catálogo de Obras
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FAF6F2] group-hover:bg-[#8C4A4D] text-[#8C4A4D] group-hover:text-white flex items-center justify-center transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-semibold text-[#2B1718]">
              {totalProducts}
            </span>
            <span className="text-xs text-[#7A5B43]">obras cadastradas</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E5CBB8]/40 flex items-center justify-between text-[10px] text-[#7A5B43]">
            <span>{velasCount} Velas • {sabonetesCount} Sabonetes • {crocheCount} Crochê</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#8C4A4D]" />
          </div>
        </div>

        {/* Seções Ativas da Home */}
        <div 
          onClick={() => onNavigatePage('home_editor')}
          className="bg-white p-5 rounded-3xl border border-[#E5CBB8]/70 shadow-xs hover:border-[#8C4A4D] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A5B43]">
              Vitrine & Home
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FAF6F2] group-hover:bg-[#8C4A4D] text-[#8C4A4D] group-hover:text-white flex items-center justify-center transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-semibold text-[#2B1718]">
              {activeSectionsCount}
            </span>
            <span className="text-xs text-emerald-700 font-medium">de 7 seções ativas</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E5CBB8]/40 flex items-center justify-between text-[10px] text-[#7A5B43]">
            <span>Edição visual em tempo real</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#8C4A4D]" />
          </div>
        </div>

        {/* Banco Supabase Realtime */}
        <div 
          onClick={() => onNavigatePage('database')}
          className="bg-white p-5 rounded-3xl border border-[#E5CBB8]/70 shadow-xs hover:border-[#8C4A4D] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A5B43]">
              Supabase Realtime
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Conectado
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E5CBB8]/40 flex items-center justify-between text-[10px] text-[#7A5B43]">
            <span>Tabelas & Schema SQL prontos</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#8C4A4D]" />
          </div>
        </div>

        {/* Pedidos & Atendimento */}
        <div 
          onClick={() => onNavigatePage('orders')}
          className="bg-white p-5 rounded-3xl border border-[#E5CBB8]/70 shadow-xs hover:border-[#8C4A4D] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A5B43]">
              Pedidos & Encomendas
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FAF6F2] group-hover:bg-[#8C4A4D] text-[#8C4A4D] group-hover:text-white flex items-center justify-center transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-semibold text-[#2B1718]">
              Boutique
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E5CBB8]/40 flex items-center justify-between text-[10px] text-[#7A5B43]">
            <span>Gerenciar encomendas</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#8C4A4D]" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. RODAPÉ INFORMATIVO COM ACESSO DISCRETO A CONFIGURAÇÕES                 */}
      {/* ========================================================================= */}
      <div className="p-5 bg-[#FAF6F2] rounded-3xl border border-[#E5CBB8]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A5B43]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8C4A4D]" />
          <span>Para atualizar os retratos, fotos e biografia da fundadora, utilize as <strong>Configurações do Atelier</strong>.</span>
        </div>
        <button
          onClick={() => onNavigatePage('settings')}
          className="px-4 py-1.5 bg-white hover:bg-[#8C4A4D] hover:text-white text-[#8C4A4D] text-[11px] uppercase tracking-wider font-semibold rounded-full border border-[#E5CBB8] shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Configurações do Atelier</span>
        </button>
      </div>

    </div>
  );
};
