import React, { useState, useEffect, useRef } from 'react';
import { StoreCustomizationSettings, Product, CartItem } from '../../types';
import { safeStorage } from '../../utils/safeStorage';
import { 
  LayoutDashboard, 
  Home, 
  Package, 
  ShoppingBag, 
  Settings, 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Check, 
  Sparkles, 
  Menu,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  X,
  Database,
  Store,
  Phone,
  ArrowRight,
  ChevronRight,
  Gift
} from 'lucide-react';

/* Core Home Components for Full Cloned Experience */
import { Header } from '../Header';
import { HeroSection } from '../HeroSection';
import { FounderSection } from '../FounderSection';
import { MeetTheTeamSection } from '../MeetTheTeamSection';
import { HorizontalProductsShowcase } from '../HorizontalProductsShowcase';
import { DeliveryExperienceSection } from '../DeliveryExperienceSection';
import { BrandQuoteSection } from '../BrandQuoteSection';
import { Footer } from '../Footer';

/* Overlays & Modals for Shopping Experience */
import { CartDrawer } from '../CartDrawer';
import { SearchModal } from '../SearchModal';
import { ProductModal } from '../ProductModal';
import { AccountModal } from '../AccountModal';
import { ContactModal } from '../ContactModal';

/* Inline Expandable Editors & Admin Pages */
import { AnnouncementBarEditor } from './AnnouncementBarEditor';
import { HeaderEditor } from './HeaderEditor';
import { DatabaseManager } from './DatabaseManager';
import { StoreIdentityPage } from './StoreIdentityPage';
import { ContactWhatsAppPage } from './ContactWhatsAppPage';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductManager } from './AdminProductManager';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminGeneralSettings } from './AdminGeneralSettings';
import { AdminGiftPresentation } from './AdminGiftPresentation';
import { GiftPresentationModal } from '../GiftPresentationModal';

/* Utilities */
import { getStoreName, getStoreWhatsapp, cascadeStoreIdentityUpdate } from '../../utils/storeIdentity';
import { saveStoreSettingsToSupabase } from '../../lib/supabase';

interface InternalSystemProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreCustomizationSettings;
  onUpdateSettings: (newSettings: StoreCustomizationSettings) => void;
  onResetDefaults: () => void;
  previewMode: 'desktop' | 'mobile';
  onChangePreviewMode: (mode: 'desktop' | 'mobile') => void;
  products?: Product[];
  onUpdateProducts?: (products: Product[]) => void;
}

type ManagementPage = 'dashboard' | 'home_editor' | 'gift_presentation' | 'identity' | 'contact_whatsapp' | 'products' | 'orders' | 'database' | 'settings';

export const InternalSystem: React.FC<InternalSystemProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDefaults,
  previewMode,
  onChangePreviewMode,
  products,
  onUpdateProducts
}) => {
  const [currentPage, setCurrentPage] = useState<ManagementPage>(() => {
    try {
      const savedPage = safeStorage.getItem('maison_admin_page') as ManagementPage;
      if (savedPage && ['dashboard', 'home_editor', 'gift_presentation', 'identity', 'contact_whatsapp', 'products', 'orders', 'database', 'settings'].includes(savedPage)) {
        return savedPage;
      }
      return 'home_editor';
    } catch {
      return 'home_editor';
    }
  });

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [isTestGiftModalOpen, setIsTestGiftModalOpen] = useState(false);

  // Persiste a aba atual para que em caso de recarregamento reabra no mesmo lugar
  useEffect(() => {
    try {
      safeStorage.setItem('maison_admin_page', currentPage);
    } catch (e) {}
  }, [currentPage]);

  // Auto-salva silenciosamente no cache local e no Supabase a cada alteração
  const isInitialSettingsMount = useRef(true);
  useEffect(() => {
    if (isInitialSettingsMount.current) {
      isInitialSettingsMount.current = false;
      return;
    }

    try {
      safeStorage.setItem('maison_store_settings', JSON.stringify(settings));
    } catch (e) {}

    const timer = setTimeout(() => {
      saveStoreSettingsToSupabase(settings).catch((err) => {
        console.warn('[Supabase AutoSave] Gravação silenciosa em segundo plano:', err);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [settings]);

  /* Cart & Modal States for the Cloned Home Experience */
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = safeStorage.getItem('maison_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /* Inline Expandable Item Editor (e.g. 'announcement') */
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Trava a rolagem do corpo da página quando o sistema de gestão estiver ativo
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  /* Cart Operations */
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToSection = (sectionId: string) => {
    if (!sectionId) return;
    if (sectionId === 'hero') {
      const container = document.querySelector('.viewport-frame-container') || window;
      container.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    let el = document.getElementById(sectionId);
    if (!el) {
      el = document.getElementById(`secao-${sectionId}`);
    }
    if (!el && sectionId.startsWith('secao-')) {
      el = document.getElementById(sectionId.replace('secao-', ''));
    }
    if (!el && (sectionId === 'tres-casas' || sectionId === 'produtos')) {
      el = document.getElementById('secoes-produtos');
    }
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('transition-all', 'duration-500', 'ring-4', 'ring-amber-500/50');
      setTimeout(() => el?.classList.remove('ring-4', 'ring-amber-500/50'), 1500);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  const handleSave = async () => {
    onUpdateSettings(settings);
    safeStorage.setItem('maison_store_settings', JSON.stringify(settings));
    const res = await saveStoreSettingsToSupabase(settings);
    if (res.success) {
      console.log('[Supabase] Configurações e Hero sincronizados com sucesso na tabela store_customization!');
    } else {
      console.warn('[Supabase] Aviso de gravação:', res.error);
    }
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2400);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-[#F2EDE4] text-[#3D3229] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* 1. MENU LATERAL DO SISTEMA INTERNO (SIDEBAR FEMININA & NOBRE DE ALTA COSTURA) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-[95] w-[295px] sm:w-[320px] max-w-[86vw] bg-gradient-to-b from-[#2B1A1B] via-[#231516] to-[#180E0F] text-[#FAF5EE] flex flex-col justify-between border-r border-[#4E3133]/60 transition-all duration-300 overscroll-contain select-none ${
          isSidebarOpenMobile
            ? 'translate-x-0 shadow-[16px_0_40px_rgba(0,0,0,0.7)] pointer-events-auto'
            : '-translate-x-full shadow-none pointer-events-none md:pointer-events-auto md:translate-x-0 md:shadow-none'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header do Menu com Retrato da Dona / Fundadora */}
          <div className="p-4 sm:p-5 border-b border-[#4E3133]/60 flex items-center justify-between pt-[max(env(safe-area-inset-top,0px),16px)] bg-[#221314]/70">
            <div 
              onClick={() => {
                setCurrentPage('settings');
                setIsSidebarOpenMobile(false);
              }}
              className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
              title="Clique para editar dados da fundadora nas Configurações"
            >
              <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#E5BBA5] via-[#D4AF37] to-[#F7EDE8] shadow-[0_2px_10px_rgba(229,187,165,0.3)] shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={
                    settings.dashboardFounder?.sidebarAvatarImage ||
                    settings.founder?.imageUrl ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=85'
                  }
                  alt={settings.dashboardFounder?.ownerName || settings.founder?.name || 'Aline de La Tour'}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
                {/* Pontinho Prata Nobre de Conexão */}
                <span 
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-tr from-slate-400 via-slate-100 to-white border-2 border-[#231516] shadow-[0_0_6px_rgba(241,245,249,0.9)] ring-1 ring-slate-300/70" 
                  title="Atelier Conectado • Prata" 
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-serif text-[14px] sm:text-[15px] tracking-wide text-[#FAF6F2] font-medium leading-tight truncate group-hover:text-[#FFD8C7] transition-colors">
                    {settings.dashboardFounder?.ownerName || settings.founder?.name || 'Aline de La Tour'}
                  </h1>
                  <span className="text-[10px] text-[#E5BBA5]">✦</span>
                </div>
                <p className="text-[9.5px] uppercase tracking-[0.16em] text-[#D8BDB0] font-light truncate mt-0.5">
                  {settings.dashboardFounder?.ownerRole || settings.founder?.role || 'Fundadora & Diretora Criativa'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isSidebarOpenMobile) {
                  setIsSidebarOpenMobile(false);
                } else {
                  onClose();
                }
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#D8BDB0] hover:text-[#FAF6F2] hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer border border-[#E5BBA5]/20 shrink-0 ml-2"
              title={isSidebarOpenMobile ? "Fechar Menu" : "Voltar para a Loja"}
              aria-label={isSidebarOpenMobile ? "Fechar Menu" : "Voltar para a Loja"}
            >
              {isSidebarOpenMobile ? <X className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navegação Principal Suave e Feminina */}
          <nav className="p-3 sm:p-3.5 space-y-1.5">
            <div className="px-3 pb-1.5 pt-2 flex items-center justify-between">
              <span className="text-[9.5px] uppercase tracking-[0.24em] text-[#C9AFA1] font-semibold flex items-center gap-1.5">
                <span>✦</span>
                <span>Páginas do Atelier</span>
              </span>
              <span className="w-10 h-px bg-gradient-to-r from-[#5B383A] to-transparent" />
            </div>

            {[
              { id: 'dashboard', label: 'Dashboard da Criadora', icon: LayoutDashboard },
              { id: 'home_editor', label: 'Edição da Vitrine Home', icon: Home },
              { id: 'gift_presentation', label: 'Apresentação de Presente', icon: Gift, badge: 'Onboarding' },
              { id: 'identity', label: 'Identidade & Marca', icon: Store },
              { id: 'contact_whatsapp', label: 'Concierge & WhatsApp', icon: Phone },
              { id: 'products', label: 'As Três Casas & Obras', icon: Package },
              { id: 'orders', label: 'Pedidos & Encomendas', icon: ShoppingBag },
              { id: 'database', label: 'Banco de Dados', icon: Database, badge: 'Realtime' },
              { id: 'settings', label: 'Configurações', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as any);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl text-xs tracking-wider transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4E2B2D] via-[#3E2123] to-[#2B1718] text-[#FAF6F2] font-medium border border-[#E5BBA5]/50 shadow-[0_4px_16px_rgba(78,43,45,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]'
                      : 'text-[#D8C7BD] hover:text-[#FAF6F2] hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#6B3A3C] text-[#FFD8C7] shadow-xs'
                          : 'bg-white/5 text-[#C9AFA1] group-hover:text-[#FAF6F2] group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate whitespace-nowrap text-left text-xs sm:text-[12.5px] font-normal">
                      {item.label}
                    </span>
                  </div>

                  {item.badge ? (
                    <span className="shrink-0 text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{item.badge}</span>
                    </span>
                  ) : isActive ? (
                    <span className="text-[#E5BBA5] text-xs shrink-0 font-serif">✦</span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé do Menu com Toque de Boutique Feminina */}
        <div className="p-4 border-t border-[#4E3133]/60 space-y-3 bg-[#1D1011]/80">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/20 border border-[#E5BBA5]/15 text-[11px] text-[#C9AFA1]">
            <span className="tracking-wide flex items-center gap-1.5">
              <span className="text-[#E5BBA5]">✦</span>
              <span>Atelier Conectado</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#E8EDF2] font-medium text-[10.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-200 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              Harmonia
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-[#3D2224] via-[#331C1D] to-[#281516] hover:from-[#4D2B2E] hover:to-[#381B1D] text-[#FAF6F2] rounded-full text-xs uppercase tracking-[0.14em] font-medium flex items-center justify-center gap-2.5 transition-all border border-[#E5BBA5]/35 hover:border-[#E5BBA5]/70 shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E5BBA5] group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para a Loja</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpenMobile && (
        <div
          onClick={() => setIsSidebarOpenMobile(false)}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL (COM AS TELAS DE GESTÃO) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full md:h-screen overflow-hidden relative z-10">
        
        {/* Top Header Bar of Content Area (Otimizado para Mobile com Safe Area e Altura Flexível) */}
        <header className="bg-white/95 backdrop-blur-md border-b border-[#BFAE9C]/30 px-3.5 sm:px-8 flex items-center justify-between shrink-0 pt-[max(env(safe-area-inset-top,0px),10px)] pb-2.5 sm:py-0 sm:h-16 min-h-[60px] shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="md:hidden p-2 text-[#3D3229] hover:bg-[#E8E0D4] active:bg-[#DED3C4] rounded-xs shrink-0 transition-colors"
              aria-label="Abrir Menu Lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-sm sm:text-base md:text-lg font-normal text-[#3D3229] leading-tight truncate">
                {currentPage === 'dashboard' && 'Dashboard • Estatísticas da Boutique'}
                {currentPage === 'home_editor' && (
                  <>
                    <span className="sm:hidden">Edição da Home</span>
                    <span className="hidden sm:inline">Edição da Página Inicial (Home)</span>
                  </>
                )}
                {currentPage === 'gift_presentation' && 'Apresentação de Presente & Onboarding'}
                {currentPage === 'identity' && 'Identidade Oficial da Marca'}
                {currentPage === 'contact_whatsapp' && 'Contato & WhatsApp Concierge'}
                {currentPage === 'products' && 'Produtos & As Três Casas'}
                {currentPage === 'orders' && 'Pedidos da Boutique'}
                {currentPage === 'database' && 'Banco de Dados & SQL'}
                {currentPage === 'settings' && 'Configurações Gerais do Atelier'}
              </h2>
              <p className="text-[9px] sm:text-[10px] text-[#7A5B43] uppercase tracking-wider truncate mt-0.5">
                {currentPage === 'home_editor' && 'Edição visual em tempo real da vitrine'}
                {currentPage === 'gift_presentation' && 'Configuração dos slides mobile, imagens e corte do laço com confetes'}
                {currentPage === 'identity' && 'Nome oficial da loja, monograma e emblema institucional'}
                {currentPage === 'contact_whatsapp' && 'Atendimento premium e lista de pedidos via WhatsApp'}
                {currentPage === 'dashboard' && 'Visão analítica e métricas principais'}
                {currentPage === 'products' && 'Catálogo artesanal e gestão das Três Casas'}
                {currentPage === 'orders' && 'Histórico e acompanhamento de encomendas'}
                {currentPage === 'database' && 'Sincronização na nuvem, Supabase e scripts VPS'}
                {currentPage === 'settings' && 'Parâmetros institucionais e backups'}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Device Switcher for Home Editor */}
            {currentPage === 'home_editor' && (
              <div className="hidden sm:flex items-center bg-[#E8E0D4]/70 p-1 rounded-xs border border-[#BFAE9C]/40">
                <button
                  onClick={() => onChangePreviewMode('desktop')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-xs transition-all ${
                    previewMode === 'desktop'
                      ? 'bg-[#3D3229] text-white font-medium shadow-xs'
                      : 'text-[#3D3229]/70 hover:text-[#3D3229]'
                  }`}
                  title="Pré-visualizar como Computador Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => onChangePreviewMode('mobile')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-xs transition-all ${
                    previewMode === 'mobile'
                      ? 'bg-[#3D3229] text-white font-medium shadow-xs'
                      : 'text-[#3D3229]/70 hover:text-[#3D3229]'
                  }`}
                  title="Pré-visualizar como Smartphone Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            )}

            {/* Reset Defaults */}
            {currentPage === 'home_editor' && (
              <button
                onClick={onResetDefaults}
                className="hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs text-[#7A5B43] hover:text-[#3D3229] uppercase tracking-wider transition-colors"
                title="Restaurar configurações de fábrica"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </button>
            )}

            {/* Save Button (Compacto e Elegante no Mobile) */}
            <button
              onClick={handleSave}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#7A5B43] hover:bg-[#6F775C] active:scale-95 text-white text-[10.5px] sm:text-xs uppercase tracking-wider font-medium rounded-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Salvar</span>
              <span className="hidden sm:inline">Alterações</span>
            </button>
          </div>
        </header>

        {/* Save Notification Toast */}
        {saveSuccessToast && (
          <div className="absolute top-20 right-8 z-50 bg-[#3D3229] text-[#F7F4EF] px-5 py-3 rounded-xs shadow-xl border border-[#7A5B43] flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase tracking-wider">
              Alterações salvas com sucesso!
            </span>
          </div>
        )}

        {/* Scrollable Main Body */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden w-full ${currentPage === 'home_editor' ? 'p-2 sm:p-4 md:p-6' : 'p-3 sm:p-6 md:p-8'} pb-24 bg-[#F2EDE4]`}>
          
          {/* =================================================================== */}
          {/* PÁGINA: DASHBOARD                                                   */}
          {/* =================================================================== */}
          {currentPage === 'dashboard' && (
            <AdminDashboard
              settings={settings}
              products={products || []}
              onNavigatePage={(page) => setCurrentPage(page as ManagementPage)}
              onOpenStore={onClose}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {/* =================================================================== */}
          {/* PÁGINA: EDIÇÃO DA HOME (CÓPIA COMPLETA DA HOME)                     */}
          {/* =================================================================== */}
          {currentPage === 'home_editor' && (
            <div className="w-full max-w-full pb-16 animate-in fade-in duration-300 space-y-3 sm:space-y-4">
              {/* Barra Informativa & Ações da Cópia da Home (Responsiva, sem quebras indesejadas) */}
              <div className="bg-white/95 backdrop-blur-xs border border-[#BFAE9C]/35 p-3 sm:px-5 sm:py-3.5 rounded-xs shadow-xs space-y-2.5 max-w-full overflow-hidden">
                {/* Linha 1: Título do Atelier e Botão do Carrinho */}
                <div className="flex items-center justify-between gap-2 border-b border-[#BFAE9C]/20 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-serif text-xs sm:text-sm text-[#3D3229] font-medium tracking-wide truncate">
                        Cópia Completa da Home • Modo Edição
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-[#7A5B43] uppercase tracking-wider truncate">
                        Clique em qualquer elemento para editar
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="px-2.5 sm:px-3.5 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] active:scale-95 text-white text-[10px] sm:text-[11px] uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 whitespace-nowrap"
                    title="Abrir Gaveta do Carrinho"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Carrinho ({totalCartCount})</span>
                  </button>
                </div>

                {/* Linha 2: Status Limpo e Alternância de Visualização */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F2EDE4] border border-[#BFAE9C]/40 text-[#7A5B43] text-[11px] font-medium tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Edição Direta: Toque em qualquer item (Logo, Menu, Faixa) para editar
                    </span>
                  </div>

                  <div className="flex items-center bg-[#F2EDE4] p-0.5 rounded-xs border border-[#BFAE9C]/40 shrink-0">
                    <button
                      onClick={() => onChangePreviewMode('desktop')}
                      className={`px-2.5 py-1 text-[10.5px] uppercase tracking-wider flex items-center gap-1.5 rounded-xs transition-all whitespace-nowrap ${
                        previewMode === 'desktop'
                          ? 'bg-[#3D3229] text-white font-medium shadow-xs'
                          : 'text-[#3D3229]/70 hover:text-[#3D3229]'
                      }`}
                      title="Visualizar em modo Desktop"
                    >
                      <Monitor className="w-3 h-3" />
                      <span>Desktop</span>
                    </button>

                    <button
                      onClick={() => onChangePreviewMode('mobile')}
                      className={`px-2.5 py-1 text-[10.5px] uppercase tracking-wider flex items-center gap-1.5 rounded-xs transition-all whitespace-nowrap ${
                        previewMode === 'mobile'
                          ? 'bg-[#3D3229] text-white font-medium shadow-xs'
                          : 'text-[#3D3229]/70 hover:text-[#3D3229]'
                      }`}
                      title="Visualizar em moldura Mobile"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewport Frame da Home (Alterna entre Desktop largo e Moldura Mobile) */}
              <div
                className={`mx-auto transition-all duration-300 w-full max-w-full overflow-x-hidden ${
                  previewMode === 'mobile'
                    ? 'max-w-[430px] rounded-[24px] sm:rounded-[32px] border-[4px] sm:border-[8px] border-[#2A2420] shadow-2xl overflow-hidden bg-[#F7F4EF]'
                    : 'w-full rounded-xs border border-[#BFAE9C]/35 shadow-sm bg-[#F7F4EF] overflow-hidden'
                }`}
              >
                {/* 01 — CABEÇALHO COM EDIÇÃO DIRETA NO ITEM */}
                <Header
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onOpenAccount={() => setIsAccountOpen(true)}
                  onNavigate={scrollToSection}
                  cartCount={totalCartCount}
                  settings={settings.header}
                  productLines={settings.productLines}
                  onCreateProductLine={(newLine) => {
                    const current = settings.productLines || [];
                    onUpdateSettings({
                      ...settings,
                      productLines: [...current, newLine]
                    });
                  }}
                  onToggleAdmin={onClose}
                  isAdminOpen={true}
                  isEmbedded={true}
                  isEditorMode={true}
                  onUpdateSettings={(newHeader) => {
                    onUpdateSettings({
                      ...settings,
                      header: newHeader
                    });
                  }}
                />

                {/* CONTEÚDO PRINCIPAL COMPLETO DA HOME */}
                <main>
                  {/* 02 — HERO CINEMATOGRÁFICO */}
                  <HeroSection
                    settings={settings.hero}
                    onDiscover={() => scrollToSection('tres-casas')}
                    onExploreStories={() => scrollToSection('secao-carrinho-casa')}
                    isEditorMode={true}
                    onUpdateSettings={(newHero) => {
                      onUpdateSettings({
                        ...settings,
                        hero: newHero
                      });
                    }}
                  />

                  {/* 03 — A CRIADORA / DONA DA MAISON */}
                  <FounderSection
                    settings={settings.founder}
                    onOpenFounderModal={() => scrollToSection('secao-carrinho-casa')}
                    isEditorMode={true}
                    onUpdateSettings={(newFounder) => {
                      onUpdateSettings({
                        ...settings,
                        founder: newFounder
                      });
                    }}
                  />

                  {/* 04 — MEET THE TEAM (EQUIPE DO ATELIER) */}
                  <MeetTheTeamSection
                    settings={settings.team}
                    isEditorMode={true}
                    onUpdateSettings={(newTeam) => {
                      onUpdateSettings({
                        ...settings,
                        team: newTeam
                      });
                    }}
                  />

                  {/* 05 — VITRINE DOS CARDS HORIZONTAIS DA HOME (LINHAS DE PRODUTOS) */}
                  <HorizontalProductsShowcase
                    onAddToCart={handleAddToCart}
                    totalCartCount={totalCartCount}
                    onOpenCart={() => setIsCartOpen(true)}
                    productLines={settings.productLines}
                    onUpdateProductLines={(newLines) => {
                      onUpdateSettings({
                        ...settings,
                        productLines: newLines
                      });
                    }}
                    products={products}
                    onUpdateProducts={onUpdateProducts}
                    isEditorMode={true}
                  />

                  {/* 06 — EXPERIÊNCIA DE ENTREGA E EMBALAGEM DE LUXO (EDITÁVEL) */}
                  <DeliveryExperienceSection
                    settings={settings.deliveryExperience}
                    onOpenCart={() => setIsCartOpen(true)}
                    onExploreProducts={() => scrollToSection('produtos')}
                    onOpenContact={() => setIsContactOpen(true)}
                    isEditorMode={true}
                    onUpdateSettings={(newDelivery) => {
                      onUpdateSettings({
                        ...settings,
                        deliveryExperience: newDelivery
                      });
                    }}
                  />

                  {/* 07 — FRASE POÉTICA DA MAISON (EDITÁVEL) */}
                  <BrandQuoteSection
                    settings={settings.brandQuote}
                    isEditorMode={true}
                    onUpdateSettings={(newBrandQuote) => {
                      onUpdateSettings({
                        ...settings,
                        brandQuote: newBrandQuote
                      });
                    }}
                  />
                </main>

                {/* 08 — RODAPÉ COMPLETO (FOOTER) */}
                <Footer
                  settings={settings.footer}
                  isEditorMode={true}
                  onUpdateSettings={(newFooter) => {
                    onUpdateSettings({
                      ...settings,
                      footer: newFooter
                    });
                  }}
                  onNavigate={scrollToSection}
                  onOpenContact={() => setIsContactOpen(true)}
                />
              </div>

              {/* Modais & Carrinho Integrados para a Cópia da Home */}
              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
              />

              <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
              />

              <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
              />

              <AccountModal
                isOpen={isAccountOpen}
                onClose={() => setIsAccountOpen(false)}
              />

              <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
              />
            </div>
          )}

          {/* =================================================================== */}
          {/* PÁGINA: APRESENTAÇÃO DE PRESENTE & ONBOARDING                       */}
          {/* =================================================================== */}
          {currentPage === 'gift_presentation' && (
            <AdminGiftPresentation
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onTestPresentation={() => setIsTestGiftModalOpen(true)}
            />
          )}

          {/* =================================================================== */}
          {/* PÁGINA: BANCO DE DADOS & SUPABASE REALTIME                          */}
          {/* =================================================================== */}
          {currentPage === 'database' && (
            <DatabaseManager
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              products={products}
              onUpdateProducts={onUpdateProducts}
            />
          )}

          {/* =================================================================== */}
          {/* PÁGINA: IDENTIDADE DA MARCA (NOME, SIGLA, SLOGAN & SELOS)           */}
          {/* =================================================================== */}
          {currentPage === 'identity' && (
            <StoreIdentityPage
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onNavigateHome={onClose}
            />
          )}

          {/* =================================================================== */}
          {/* PÁGINA: CONTATO & WHATSAPP (ATENDIMENTO PREMIUM & PEDIDOS)          */}
          {/* =================================================================== */}
          {currentPage === 'contact_whatsapp' && (
            <ContactWhatsAppPage
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onNavigateHome={onClose}
            />
          )}

          {/* =================================================================== */}
          {/* PÁGINA: PRODUTOS & AS TRÊS CASAS                                    */}
          {/* =================================================================== */}
          {currentPage === 'products' && (
            <AdminProductManager
              products={products || []}
              onUpdateProducts={onUpdateProducts}
            />
          )}

          {/* =================================================================== */}
          {/* PÁGINA: PEDIDOS & ENCOMENDAS DA BOUTIQUE                           */}
          {/* =================================================================== */}
          {currentPage === 'orders' && (
            <AdminOrdersManager
              storeSettings={settings}
            />
          )}

          {/* =================================================================== */}
          {/* PÁGINA: CONFIGURAÇÕES GERAIS DO ATELIER                            */}
          {/* =================================================================== */}
          {currentPage === 'settings' && (
            <AdminGeneralSettings
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              products={products || []}
            />
          )}

        </div>

        {/* Modal de Teste da Apresentação de Presente */}
        <GiftPresentationModal
          isOpen={isTestGiftModalOpen}
          onClose={() => setIsTestGiftModalOpen(false)}
          settings={settings.giftPresentation}
          storeName={getStoreName(settings)}
          monogram={settings.general?.monogram || 'ME'}
        />

      </div>

    </div>
  );
};
