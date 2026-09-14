import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem, StoreCustomizationSettings } from './types';
import { FEATURED_PRODUCTS } from './data/mockData';
import { DEFAULT_STORE_SETTINGS } from './data/defaultSettings';

/* Core Components */
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FounderSection } from './components/FounderSection';
import { MeetTheTeamSection } from './components/MeetTheTeamSection';
import { HorizontalProductsShowcase } from './components/HorizontalProductsShowcase';
import { DeliveryExperienceSection } from './components/DeliveryExperienceSection';
import { BrandQuoteSection } from './components/BrandQuoteSection';
import { Footer } from './components/Footer';

/* Admin Internal Studio Component */
import { AdminCustomizer } from './components/admin/AdminCustomizer';
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';

/* Overlays & Modals for Shopping Experience */
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { ProductModal } from './components/ProductModal';
import { AccountModal } from './components/AccountModal';
import { ContactModal } from './components/ContactModal';
import { FlyingHeartCartAnimation } from './components/FlyingHeartCartAnimation';
import { GiftPresentationModal } from './components/GiftPresentationModal';
import { GiftFloatingTag } from './components/GiftFloatingTag';
import { 
  fetchStoreSettingsFromSupabase, 
  saveStoreSettingsToSupabase,
  fetchProductsFromSupabase,
  saveProductToSupabase,
  saveAllProductsToSupabase,
  subscribeToStoreSettingsRealtime,
  subscribeToProductsRealtime,
  deepMergeStoreSettings
} from './lib/supabase';
import { safeStorage } from './utils/safeStorage';

export default function App() {
  /* Store Customization Settings State */
  const [storeSettings, setStoreSettings] = useState<StoreCustomizationSettings>(() => {
    try {
      const saved = safeStorage.getItem('maison_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return deepMergeStoreSettings(parsed);
      }
      return DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  /* Products State (Persisted in safeStorage with luxury catalog fallback) */
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = safeStorage.getItem('maison_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return FEATURED_PRODUCTS;
    } catch {
      return FEATURED_PRODUCTS;
    }
  });

  /* Admin Studio State (Persisted across reloads so editing is never lost) */
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    try {
      return safeStorage.getItem('maison_admin_open') === 'true';
    } catch {
      return false;
    }
  });
  const [adminPreviewMode, setAdminPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const isAdminOpenRef = useRef(isAdminOpen);

  // Status de carregamento inicial desativador de bloqueio (agora o carregamento é 100% silencioso em segundo plano para inicialização instantânea em 0ms)
  const [isInitialSyncing, setIsInitialSyncing] = useState(false);

  useEffect(() => {
    isAdminOpenRef.current = isAdminOpen;
    try {
      safeStorage.setItem('maison_admin_open', isAdminOpen ? 'true' : 'false');
    } catch (e) {}
  }, [isAdminOpen]);

  // Blindagem global contra falhas transitórias de conexão / WebSockets
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Previne que erros de rede ou timeout de WebSockets causem quebra ou recarregamento
      console.warn('[Maison Resilience] Promessa rejeitada capturada com segurança:', event.reason);
      event.preventDefault();
    };

    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('WebSocket') || event.message?.includes('network') || event.message?.includes('fetch')) {
        console.warn('[Maison Resilience] Erro de rede/websocket interceptado sem reload:', event.message);
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    safeStorage.setItem('maison_products', JSON.stringify(newProducts));
    saveAllProductsToSupabase(newProducts).catch((err) => {
      console.warn('[Supabase] Falha ao persistir produtos em tempo real (fallback local ativo)', err);
    });
  };

  /* Supabase Realtime Synchronization Effect */
  useEffect(() => {
    // 1. Carregamento inicial do banco de dados remoto se configurado
    let isMounted = true;
    async function loadInitialRemoteData() {
      // Garantia absoluta de segurança (2.5 segundos): se a rede do VPS/Coolify falhar,
      // ou se o Supabase travar por DNS/CORS, libera a tela imediatamente para uso offline/local.
      const safetyTimeout = setTimeout(() => {
        if (isMounted) {
          console.warn('[Maison Guard] Destravando tela via timer de segurança (Supabase demorou mais que 2.5s)');
          setIsInitialSyncing(false);
        }
      }, 2500);

      try {
        const [remoteSettings, remoteProducts] = await Promise.all([
          fetchStoreSettingsFromSupabase(),
          fetchProductsFromSupabase()
        ]);

        if (isMounted) {
          if (remoteSettings) {
            setStoreSettings(remoteSettings);
            safeStorage.setItem('maison_store_settings', JSON.stringify(remoteSettings));
          }

          if (Array.isArray(remoteProducts)) {
            setProducts(remoteProducts);
            safeStorage.setItem('maison_products', JSON.stringify(remoteProducts));
          }
        }
      } catch (err) {
        console.warn('[Supabase] Inicializando com dados locais (fallback)', err);
      } finally {
        clearTimeout(safetyTimeout);
        if (isMounted) {
          setIsInitialSyncing(false);
        }
      }
    }

    loadInitialRemoteData();

    // 2. Inscrição Realtime WebSockets: Sincroniza todos os computadores, tablets e celulares
    const unsubscribeSettings = subscribeToStoreSettingsRealtime((newSettings) => {
      if (!isMounted) return;
      // Previne sobrescrever a tela enquanto o administrador está no meio de uma edição
      if (isAdminOpenRef.current) {
        console.log('[Supabase Realtime] Atualização remota recebida mas ignorada para não atrapalhar edição em andamento');
        return;
      }
      setStoreSettings(newSettings);
      safeStorage.setItem('maison_store_settings', JSON.stringify(newSettings));
    });

    const unsubscribeProducts = subscribeToProductsRealtime((product, eventType) => {
      if (!isMounted) return;
      if (isAdminOpenRef.current) {
        return;
      }
      setProducts((prev) => {
        if (eventType === 'DELETE') {
          return prev.filter(p => p.id !== product.id);
        }
        const index = prev.findIndex(p => p.id === product.id);
        if (index >= 0) {
          const copy = [...prev];
          copy[index] = product;
          return copy;
        } else {
          return [...prev, product];
        }
      });
    });

    return () => {
      isMounted = false;
      unsubscribeSettings();
      unsubscribeProducts();
    };
  }, []);

  const handleUpdateSettings = (newSettings: StoreCustomizationSettings) => {
    setStoreSettings(newSettings);
    safeStorage.setItem('maison_store_settings', JSON.stringify(newSettings));
    // Gravação direta no Supabase (em tempo real)
    saveStoreSettingsToSupabase(newSettings).catch((err) => {
      console.warn('[Supabase] Falha ao persistir em tempo real (fallback local ativo)', err);
    });
  };

  const handleResetSettings = () => {
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    safeStorage.removeItem('maison_store_settings');
    saveStoreSettingsToSupabase(DEFAULT_STORE_SETTINGS).catch((err) => {
      console.warn('[Supabase] Falha ao resetar no Supabase', err);
    });
  };

  /* Cart State */
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = safeStorage.getItem('maison_cart');
      return saved ? JSON.parse(saved) : [
        { product: FEATURED_PRODUCTS[0], quantity: 1 }
      ];
    } catch {
      return [{ product: FEATURED_PRODUCTS[0], quantity: 1 }];
    }
  });

  useEffect(() => {
    safeStorage.setItem('maison_cart', JSON.stringify(cart));
  }, [cart]);

  /* Filter state for products */
  const [activeFilter, setActiveFilter] = useState<'all' | 'velas' | 'sabonetes' | 'croche'>('all');

  /* Modals & Drawers States */
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  // Auto-abre no mobile na primeira visita (apresentação de presente)
  useEffect(() => {
    try {
      const isMobile = window.innerWidth < 768;
      const seen = safeStorage.getItem('maison_gift_seen');
      const autoOpen = storeSettings.giftPresentation?.autoOpenOnMobileFirstVisit !== false;
      const enabled = storeSettings.giftPresentation?.enabled !== false;
      
      if (isMobile && !seen && autoOpen && enabled) {
        setIsGiftModalOpen(true);
      }
    } catch (e) {}
  }, [storeSettings.giftPresentation]);

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
    // O carrinho NÃO abre automaticamente (experiência fluida com o coração animado voando até a sacola)
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

  /* Smooth Navigation Handler with Dynamic Redirection */
  const scrollToSection = (sectionId: string) => {
    if (!sectionId) return;

    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'all' || sectionId === 'tres-casas' || sectionId === 'produtos') {
      setActiveFilter('all');
      const element = document.getElementById('secoes-produtos');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // 1. Verifica elemento direto por ID
    let element = document.getElementById(sectionId);

    // 2. Se não encontrou, busca com prefixo `secao-`
    if (!element) {
      element = document.getElementById(`secao-${sectionId}`);
    }

    // 3. Se veio com `secao-`, tenta sem o prefixo
    if (!element && sectionId.startsWith('secao-')) {
      element = document.getElementById(sectionId.replace('secao-', ''));
    }

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Efeito sutil e elegante de destaque no destino
      element.classList.add('transition-all', 'duration-500', 'ring-2', 'ring-amber-600/30');
      setTimeout(() => {
        element?.classList.remove('ring-2', 'ring-amber-600/30');
      }, 1500);
      return;
    }

    // Fallback gracioso para a vitrine
    const fallback = document.getElementById('secoes-produtos');
    if (fallback) {
      fallback.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tela de apresentação da Maison desativada para garantir carregamento instantâneo em 0ms sem risco de travamentos
  // Anteriormente, se a sincronização inicial ficasse pendente, exibia a tela de carregamento.
  // Agora o app renderiza os dados locais/padrão imediatamente de forma resiliente.

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#3D3229] font-sans selection:bg-[#6F775C] selection:text-[#F7F4EF]">
      
      {/* Main Store Wrapper */}
      <div className="w-full">
        
        {/* 01 — HEADER */}
        <Header
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onNavigate={scrollToSection}
          cartCount={totalCartCount}
          settings={storeSettings.header}
          productLines={storeSettings.productLines}
          onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
          isAdminOpen={isAdminOpen}
        />

        {/* Curated Main Flow */}
        <main>
          {/* 02 — HERO CINEMATOGRÁFICO */}
          <HeroSection
            settings={storeSettings.hero}
            onDiscover={() => scrollToSection('tres-casas')}
            onExploreStories={() => scrollToSection('secao-carrinho-casa')}
            isEditorMode={isAdminOpen}
            onUpdateSettings={(newHero) => {
              handleUpdateSettings({
                ...storeSettings,
                hero: newHero
              });
            }}
          />

          {/* 02.1 — A CRIADORA / DONA DA MAISON (LADO A LADO, MACRO NO MOBILE) */}
          <FounderSection
            settings={storeSettings.founder}
            onOpenFounderModal={() => {
              const element = document.getElementById('secao-carrinho-casa');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            isEditorMode={isAdminOpen}
            onUpdateSettings={(newFounder) => {
              handleUpdateSettings({
                ...storeSettings,
                founder: newFounder
              });
            }}
          />

          {/* 02.2 — MEET THE TEAM (TASKED / THREAD BY PROTON) */}
          <MeetTheTeamSection
            settings={storeSettings.team}
            isEditorMode={isAdminOpen}
            onUpdateSettings={(newTeam) => {
              handleUpdateSettings({
                ...storeSettings,
                team: newTeam
              });
            }}
          />

          {/* 03 — CARDS HORIZONTAIS DA HOME (LINHAS DE PRODUTOS DINÂMICAS) */}
          <HorizontalProductsShowcase
            onAddToCart={handleAddToCart}
            totalCartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            productLines={storeSettings.productLines}
            onUpdateProductLines={(newLines) => {
              handleUpdateSettings({
                ...storeSettings,
                productLines: newLines
              });
            }}
            products={products}
            onUpdateProducts={handleUpdateProducts}
            isEditorMode={isAdminOpen}
          />

          {/* 04 — NOVA SESSÃO: IMAGEM + COLOQUE NO SEU CARRINHO E RECEBA NA SUA CASA (EDITÁVEL) */}
          <DeliveryExperienceSection
            settings={storeSettings.deliveryExperience}
            onOpenCart={() => setIsCartOpen(true)}
            onExploreProducts={() => scrollToSection('produtos')}
            onOpenContact={() => setIsContactOpen(true)}
            isEditorMode={isAdminOpen}
            onUpdateSettings={(newDelivery) => {
              handleUpdateSettings({
                ...storeSettings,
                deliveryExperience: newDelivery
              });
            }}
          />

          {/* 05 — FRASE POÉTICA DA MAISON (EDITÁVEL) */}
          <BrandQuoteSection
            settings={storeSettings.brandQuote}
            isEditorMode={isAdminOpen}
            onUpdateSettings={(newBrandQuote) => {
              handleUpdateSettings({
                ...storeSettings,
                brandQuote: newBrandQuote
              });
            }}
          />
        </main>

        {/* 08 — FOOTER DA BOUTIQUE */}
        <Footer
          settings={storeSettings.footer}
          storeSettings={storeSettings}
          isEditorMode={isAdminOpen}
          onUpdateSettings={(newFooter) => {
            handleUpdateSettings({
              ...storeSettings,
              footer: newFooter
            });
          }}
          onNavigate={scrollToSection}
          onOpenContact={() => setIsContactOpen(true)}
        />
      </div>

      {/* Internal Studio Drawer Panel */}
      <AdminCustomizer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={storeSettings}
        onUpdateSettings={handleUpdateSettings}
        onResetDefaults={handleResetSettings}
        previewMode={adminPreviewMode}
        onChangePreviewMode={(mode) => setAdminPreviewMode(mode)}
        products={products}
        onUpdateProducts={handleUpdateProducts}
      />

      {/* Overlays & Interactive Modals for Pure Luxury Shopping Experience */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        storeSettings={storeSettings}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        products={products}
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
        storeSettings={storeSettings}
      />

      {/* Etiqueta Flutuante de Luxo "Assistir apresentação" */}
      {!isAdminOpen && (
        <GiftFloatingTag
          onOpen={() => setIsGiftModalOpen(true)}
          settings={storeSettings.giftPresentation}
        />
      )}

      {/* Modal / Experiência Imersiva de Presente & Onboarding Mobile */}
      <GiftPresentationModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        settings={storeSettings.giftPresentation}
        storeName={storeSettings.general?.storeName || 'MAISON ENTRELAÇO'}
        monogram={storeSettings.general?.monogram || 'ME'}
      />

      {/* Animação do Coração Voador em direção à sacola no cabeçalho */}
      <FlyingHeartCartAnimation />

    </div>
  );
}
