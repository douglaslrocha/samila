import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StoreCustomizationSettings, Product } from '../types';
import { DEFAULT_STORE_SETTINGS } from '../data/defaultSettings';
import { safeStorage } from '../utils/safeStorage';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  source: 'env' | 'custom' | 'default' | 'none';
  lastSyncedAt?: string;
}

const STORAGE_CONFIG_KEY = 'maison_supabase_config';

export const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://ruhsyvipnjwvcveljasi.supabase.co',
  anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  secretKey: (import.meta as any).env?.VITE_SUPABASE_SECRET_KEY || '',
  jwksUrl: 'https://ruhsyvipnjwvcveljasi.supabase.co/auth/v1/.well-known/jwks.json'
};

/**
 * Obtém as credenciais atuais do Supabase (prioriza env vars, storage do usuário ou credenciais padrão da Maison)
 */
export function getStoredSupabaseConfig(): { url: string; anonKey: string; source: 'env' | 'custom' | 'default' | 'none' } {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = (metaEnv.VITE_SUPABASE_URL as string) || '';
  const envKey = (metaEnv.VITE_SUPABASE_ANON_KEY as string) || (metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY as string) || '';

  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim(), source: 'env' };
  }

  try {
    const saved = safeStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim(), source: 'custom' };
      }
    }
  } catch (e) {
    // Ignore parse errors
  }

  // Fallback para credenciais oficiais fornecidas
  if (DEFAULT_SUPABASE_CONFIG.url && DEFAULT_SUPABASE_CONFIG.anonKey) {
    return { 
      url: DEFAULT_SUPABASE_CONFIG.url, 
      anonKey: DEFAULT_SUPABASE_CONFIG.anonKey, 
      source: 'default' 
    };
  }

  return { url: '', anonKey: '', source: 'none' };
}

let activeClient: SupabaseClient | null = null;
let currentClientUrl = '';
let currentClientKey = '';

/**
 * Obtém ou instancia o cliente Supabase
 */
export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (!url || !anonKey) {
    activeClient = null;
    return null;
  }

  if (activeClient && currentClientUrl === url && currentClientKey === anonKey) {
    return activeClient;
  }

  try {
    activeClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    currentClientUrl = url;
    currentClientKey = anonKey;
    return activeClient;
  } catch (e) {
    console.error('Erro ao inicializar cliente Supabase:', e);
    return null;
  }
}

/**
 * Salva as credenciais do Supabase no storage local
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  try {
    safeStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() }));
    activeClient = null; // Força recriação
    getSupabase();
  } catch (e) {
    // Ignore storage write errors
  }
}

/**
 * Limpa as credenciais do Supabase
 */
export function clearSupabaseConfig(): void {
  try {
    safeStorage.removeItem(STORAGE_CONFIG_KEY);
    activeClient = null;
    currentClientUrl = '';
    currentClientKey = '';
  } catch (e) {
    // Ignore storage clear errors
  }
}

/**
 * Testa a conexão com o Supabase e verifica se as tabelas existem
 */
export async function testSupabaseConnection(testUrl?: string, testKey?: string): Promise<{
  success: boolean;
  message: string;
  tablesFound?: string[];
}> {
  const url = testUrl || getStoredSupabaseConfig().url;
  const anonKey = testKey || getStoredSupabaseConfig().anonKey;

  if (!url || !anonKey) {
    return { success: false, message: 'URL ou Chave Anon do Supabase não configuradas.' };
  }

  try {
    const client = createClient(url, anonKey);
    
    // Tenta consultar a tabela store_customization
    const { data: storeData, error: storeError } = await client
      .from('store_customization')
      .select('id')
      .limit(1);

    // Tenta consultar a tabela products
    const { data: prodData, error: prodError } = await client
      .from('products')
      .select('id')
      .limit(1);

    const tablesFound: string[] = [];
    if (!storeError) tablesFound.push('store_customization');
    if (!prodError) tablesFound.push('products');

    if (storeError && prodError) {
      // Se deu erro de permissão ou tabela não encontrada
      if (storeError.message.includes('relation "public.store_customization" does not exist')) {
        return {
          success: false,
          message: 'Conectado ao projeto, mas as tabelas ainda não foram criadas. Execute o script SQL no SQL Editor do Supabase!',
          tablesFound
        };
      }
      return {
        success: false,
        message: `Erro na consulta: ${storeError.message || prodError?.message}`,
        tablesFound
      };
    }

    return {
      success: true,
      message: `Conexão bem-sucedida! Tabelas ativas: ${tablesFound.join(', ')}`,
      tablesFound
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falha ao conectar ao Supabase: ${err?.message || 'Erro de rede ou URL inválida'}`
    };
  }
}

/**
 * Busca a personalização da loja do Supabase (tabela store_customization)
 */
export async function fetchStoreSettingsFromSupabase(): Promise<StoreCustomizationSettings | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('store_customization')
      .select('*')
      .eq('id', 'current')
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Erro ao buscar personalização da loja:', error.message);
      return null;
    }

    if (!data) return null;

    // Normaliza os campos que vêm em snake_case, camelCase ou armazenados no general
    const generalData = data.general || DEFAULT_STORE_SETTINGS.general;
    const fetched: StoreCustomizationSettings = {
      general: generalData,
      header: data.header || DEFAULT_STORE_SETTINGS.header,
      hero: data.hero || DEFAULT_STORE_SETTINGS.hero,
      founder: data.founder || DEFAULT_STORE_SETTINGS.founder,
      dashboardFounder: data.dashboard_founder || data.dashboardFounder || generalData?.dashboardFounder || DEFAULT_STORE_SETTINGS.dashboardFounder,
      team: data.team || DEFAULT_STORE_SETTINGS.team,
      productLines: data.product_lines || data.productLines || DEFAULT_STORE_SETTINGS.productLines,
      deliveryExperience: data.delivery_experience || data.deliveryExperience || DEFAULT_STORE_SETTINGS.deliveryExperience,
      brandQuote: data.brand_quote || data.brandQuote || DEFAULT_STORE_SETTINGS.brandQuote,
      footer: data.footer || DEFAULT_STORE_SETTINGS.footer,
      giftPresentation: data.gift_presentation || data.giftPresentation || generalData?.giftPresentation || DEFAULT_STORE_SETTINGS.giftPresentation
    };

    return fetched;
  } catch (err) {
    console.error('[Supabase] Exceção ao carregar store_customization:', err);
    return null;
  }
}

/**
 * Salva a personalização da loja no Supabase (tabela store_customization)
 */
export async function saveStoreSettingsToSupabase(settings: StoreCustomizationSettings): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: 'Cliente Supabase não configurado' };
  }

  try {
    const generalWithExtras = {
      ...(settings.general || {}),
      giftPresentation: settings.giftPresentation || undefined,
      dashboardFounder: settings.dashboardFounder || undefined
    };

    let payload: Record<string, any> = {
      id: 'current',
      general: generalWithExtras,
      header: settings.header,
      hero: settings.hero,
      founder: settings.founder,
      dashboard_founder: settings.dashboardFounder || null,
      team: settings.team || null,
      product_lines: settings.productLines || [],
      delivery_experience: settings.deliveryExperience || null,
      brand_quote: settings.brandQuote || null,
      footer: settings.footer || null,
      gift_presentation: settings.giftPresentation || null,
      updated_at: new Date().toISOString()
    };

    // Tenta salvar de forma adaptativa; se a tabela no Supabase não tiver uma coluna (ex: gift_presentation),
    // remove a coluna do payload e tenta novamente automaticamente para nunca falhar
    let maxRetries = 5;
    let saveSuccess = false;
    let lastErrorMessage = '';

    while (maxRetries > 0 && !saveSuccess) {
      const { error } = await supabase
        .from('store_customization')
        .upsert(payload, { onConflict: 'id' });

      if (!error) {
        saveSuccess = true;
        break;
      }

      lastErrorMessage = error.message || '';

      // Identifica se é erro de coluna inexistente no cache de esquema do Supabase
      const match = lastErrorMessage.match(/Could not find the '([^']+)' column/) ||
                    lastErrorMessage.match(/column "([^"]+)" of relation "store_customization" does not exist/) ||
                    lastErrorMessage.match(/column '([^']+)' does not exist/i);

      if (match && match[1]) {
        const missingCol = match[1];
        console.warn(`[Supabase Schema Adaptive] Coluna '${missingCol}' ausente no schema remoto. Adaptando payload e salvando...`);
        delete payload[missingCol];
        maxRetries--;
      } else {
        console.warn(`[Supabase] Erro ao salvar store_customization:`, lastErrorMessage);
        break;
      }
    }

    if (!saveSuccess) {
      return { success: false, error: lastErrorMessage };
    }

    // Sincronização espelhada para a tabela individual 'hero_slides' caso existam slides configurados
    if (settings.hero?.slides && settings.hero.slides.length > 0) {
      try {
        const heroSlidesPayload = settings.hero.slides.map((s, idx) => ({
          id: s.id || `slide-${idx + 1}`,
          type: s.type || 'video',
          title: s.title || `Slide ${idx + 1}`,
          desktop_url: s.desktopUrl || '',
          mobile_url: s.mobileUrl || null,
          poster_url: s.posterUrl || '',
          order_index: idx,
          is_active: true,
          updated_at: new Date().toISOString()
        }));

        await supabase.from('hero_slides').upsert(heroSlidesPayload, { onConflict: 'id' });
      } catch (e) {
        console.warn('[Supabase] Aviso ao espelhar hero_slides:', e);
      }
    }

    // Sincronização espelhada para a tabela individual 'product_lines' caso existam coleções
    if (settings.productLines && settings.productLines.length > 0) {
      try {
        const productLinesPayload = settings.productLines.map((line, idx) => ({
          id: line.id,
          roman: line.roman || '',
          house_prefix: line.housePrefix || 'CASA',
          maison_title: line.maisonTitle || 'MAISON ENTRELAÇO',
          main_title: line.mainTitle || '',
          sub_title: line.subTitle || '',
          watermark_words: line.watermarkWords || [],
          default_badge1: line.defaultBadge1 || null,
          default_badge2: line.defaultBadge2 || null,
          bg_color: line.bgColor || null,
          fade_color: line.fadeColor || null,
          custom_product_ids: line.customProductIds || [],
          order_index: idx,
          updated_at: new Date().toISOString()
        }));

        await supabase.from('product_lines').upsert(productLinesPayload, { onConflict: 'id' });
      } catch (e) {
        console.warn('[Supabase] Aviso ao espelhar product_lines:', e);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase] Exceção ao salvar store_customization:', err);
    return { success: false, error: err?.message || 'Erro de conexão' };
  }
}

/**
 * Busca catálogo de produtos do Supabase
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[Supabase] Erro ao buscar produtos:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      categoryLabel: item.category_label || item.categoryLabel || '',
      price: Number(item.price),
      shortStory: item.short_story || item.shortStory || '',
      fullStory: item.full_story || item.fullStory || '',
      primaryImage: item.primary_image || item.primaryImage || '',
      secondaryImage: item.secondary_image || item.secondaryImage || '',
      galleryImages: item.gallery_images || item.galleryImages || [],
      videoUrl: item.video_url || item.videoUrl || undefined,
      details: item.details || [],
      fragranceNotes: item.fragrance_notes || item.fragranceNotes || undefined,
      materials: item.materials || undefined,
      dimensions: item.dimensions || undefined,
      careInstructions: item.care_instructions || item.careInstructions || undefined,
      recentlySoldOut: Boolean(item.recently_sold_out || item.recentlySoldOut)
    }));
  } catch (err) {
    console.error('[Supabase] Exceção ao carregar produtos:', err);
    return null;
  }
}

/**
 * Exclui um produto permanentemente do Supabase
 */
export async function deleteProductFromSupabase(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase não conectado' };

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.warn('[Supabase] Erro ao excluir produto do banco:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] Exceção ao excluir produto:', err);
    return { success: false, error: err?.message || 'Erro ao excluir' };
  }
}

/**
 * Salva produto no Supabase
 */
export async function saveProductToSupabase(product: Product): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase não conectado' };

  try {
    let payload: Record<string, any> = {
      id: product.id,
      name: product.name,
      category: product.category,
      category_label: product.categoryLabel,
      price: product.price,
      short_story: product.shortStory,
      full_story: product.fullStory,
      primary_image: product.primaryImage,
      secondary_image: product.secondaryImage,
      gallery_images: product.galleryImages || [],
      video_url: product.videoUrl || null,
      details: product.details || [],
      fragrance_notes: product.fragranceNotes || null,
      materials: product.materials || [],
      dimensions: product.dimensions || null,
      care_instructions: product.careInstructions || null,
      recently_sold_out: Boolean(product.recentlySoldOut),
      is_active: true,
      updated_at: new Date().toISOString()
    };

    let maxRetries = 5;
    let saveSuccess = false;
    let lastErrorMessage = '';

    while (maxRetries > 0 && !saveSuccess) {
      const { error } = await supabase
        .from('products')
        .upsert(payload, { onConflict: 'id' });

      if (!error) {
        saveSuccess = true;
        break;
      }

      lastErrorMessage = error.message || '';
      const match = lastErrorMessage.match(/Could not find the '([^']+)' column/) ||
                    lastErrorMessage.match(/column "([^"]+)" of relation "products" does not exist/) ||
                    lastErrorMessage.match(/column '([^']+)' does not exist/i);

      if (match && match[1]) {
        const missingCol = match[1];
        console.warn(`[Supabase Schema Adaptive] Coluna '${missingCol}' ausente em products. Adaptando payload e salvando...`);
        delete payload[missingCol];
        maxRetries--;
      } else {
        console.warn('[Supabase] Erro ao salvar produto:', lastErrorMessage);
        break;
      }
    }

    if (!saveSuccess) {
      return { success: false, error: lastErrorMessage };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro desconhecido' };
  }
}

/**
 * Salva lista inteira de produtos no Supabase e remove itens excluídos
 */
export async function saveAllProductsToSupabase(products: Product[]): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase não conectado' };

  try {
    // Se a lista estiver vazia, apaga todos os registros do banco
    if (products.length === 0) {
      await supabase.from('products').delete().neq('id', '___non_existent___');
      return { success: true };
    }

    // 1. Sincroniza exclusões: localiza no Supabase produtos que não estão mais na lista local e os remove
    const currentIds = products.map((p) => p.id);
    try {
      const { data: remoteExisting } = await supabase.from('products').select('id');
      if (remoteExisting && remoteExisting.length > 0) {
        const idsToDelete = remoteExisting
          .map((r: any) => r.id)
          .filter((remoteId: string) => !currentIds.includes(remoteId));
        if (idsToDelete.length > 0) {
          await supabase.from('products').delete().in('id', idsToDelete);
        }
      }
    } catch (e) {
      console.warn('[Supabase] Aviso ao sincronizar exclusões de produtos:', e);
    }

    // 2. Prepara o payload dos produtos remanescentes
    let payloads: Record<string, any>[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      category_label: p.categoryLabel,
      price: p.price,
      short_story: p.shortStory,
      full_story: p.fullStory,
      primary_image: p.primaryImage,
      secondary_image: p.secondaryImage,
      gallery_images: p.galleryImages || [],
      video_url: p.videoUrl || null,
      details: p.details || [],
      fragrance_notes: p.fragranceNotes || null,
      materials: p.materials || [],
      dimensions: p.dimensions || null,
      care_instructions: p.careInstructions || null,
      recently_sold_out: Boolean(p.recentlySoldOut),
      is_active: true,
      updated_at: new Date().toISOString()
    }));

    let maxRetries = 5;
    let saveSuccess = false;
    let lastErrorMessage = '';

    while (maxRetries > 0 && !saveSuccess) {
      const { error } = await supabase
        .from('products')
        .upsert(payloads, { onConflict: 'id' });

      if (!error) {
        saveSuccess = true;
        break;
      }

      lastErrorMessage = error.message || '';
      const match = lastErrorMessage.match(/Could not find the '([^']+)' column/) ||
                    lastErrorMessage.match(/column "([^"]+)" of relation "products" does not exist/) ||
                    lastErrorMessage.match(/column '([^']+)' does not exist/i);

      if (match && match[1]) {
        const missingCol = match[1];
        console.warn(`[Supabase Schema Adaptive] Removendo coluna '${missingCol}' de todos os produtos para sincronizar...`);
        payloads = payloads.map((p) => {
          const clone = { ...p };
          delete clone[missingCol];
          return clone;
        });
        maxRetries--;
      } else {
        break;
      }
    }

    if (!saveSuccess) {
      return { success: false, error: lastErrorMessage };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Inscreve um ouvinte Realtime para a personalização da loja.
 * Sempre que qualquer usuário em qualquer dispositivo alterar uma linha
 * na tabela store_customization, este callback será disparado com os novos dados.
 */
export function subscribeToStoreSettingsRealtime(
  callback: (newSettings: StoreCustomizationSettings) => void
): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channelName = `realtime-store-customization-${Date.now()}`;
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'store_customization'
      },
      (payload) => {
        if (payload.new && typeof payload.new === 'object') {
          const raw: any = payload.new;
          if (raw.id === 'current' || !raw.id) {
            const updated: StoreCustomizationSettings = {
              general: raw.general || DEFAULT_STORE_SETTINGS.general,
              header: raw.header || DEFAULT_STORE_SETTINGS.header,
              hero: raw.hero || DEFAULT_STORE_SETTINGS.hero,
              founder: raw.founder || DEFAULT_STORE_SETTINGS.founder,
              dashboardFounder: raw.dashboard_founder || raw.dashboardFounder || DEFAULT_STORE_SETTINGS.dashboardFounder,
              team: raw.team || DEFAULT_STORE_SETTINGS.team,
              productLines: raw.product_lines || raw.productLines || DEFAULT_STORE_SETTINGS.productLines,
              deliveryExperience: raw.delivery_experience || raw.deliveryExperience || DEFAULT_STORE_SETTINGS.deliveryExperience,
              brandQuote: raw.brand_quote || raw.brandQuote || DEFAULT_STORE_SETTINGS.brandQuote,
              footer: raw.footer || DEFAULT_STORE_SETTINGS.footer,
              giftPresentation: raw.gift_presentation || raw.giftPresentation || DEFAULT_STORE_SETTINGS.giftPresentation
            };
            callback(updated);
          }
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Inscreve um ouvinte Realtime para a tabela de produtos.
 */
export function subscribeToProductsRealtime(
  callback: (updatedProduct: Product, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channelName = `realtime-products-${Date.now()}`;
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products'
      },
      (payload) => {
        const raw: any = payload.new || payload.old;
        if (!raw) return;

        const prod: Product = {
          id: raw.id,
          name: raw.name || '',
          category: raw.category || 'velas',
          categoryLabel: raw.category_label || '',
          price: Number(raw.price || 0),
          shortStory: raw.short_story || '',
          fullStory: raw.full_story || '',
          primaryImage: raw.primary_image || '',
          secondaryImage: raw.secondary_image || '',
          galleryImages: raw.gallery_images || [],
          videoUrl: raw.video_url || undefined,
          details: raw.details || [],
          fragranceNotes: raw.fragrance_notes || undefined,
          materials: raw.materials || undefined,
          dimensions: raw.dimensions || undefined,
          careInstructions: raw.care_instructions || undefined,
          recentlySoldOut: Boolean(raw.recently_sold_out || raw.recentlySoldOut)
        };

        callback(prod, payload.eventType as any);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Envia um arquivo de imagem diretamente para o Supabase Storage e retorna a URL pública HTTP.
 * Se o bucket padrão não existir, tenta os buckets alternativos ou faz fallback seguro.
 */
export async function uploadImageToSupabase(file: File, folder: string = 'assets'): Promise<string> {
  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop() || 'png';
  const sanitizeName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${folder}/${Date.now()}_${sanitizeName}.${fileExt}`;

  if (supabase) {
    const bucketsToTry = ['maison-assets', 'public', 'images', 'uploads'];

    // Tenta criar o bucket principal caso ainda não exista no projeto
    try {
      await supabase.storage.createBucket('maison-assets', { public: true });
    } catch (e) {
      // Bucket já existe ou não tem permissão de criação direta, prossegue para upload
    }

    for (const bucket of bucketsToTry) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
          if (publicUrlData && publicUrlData.publicUrl) {
            console.log(`[Supabase Storage] Imagem enviada com sucesso para bucket '${bucket}':`, publicUrlData.publicUrl);
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn(`[Supabase Storage] Tentativa no bucket '${bucket}' falhou:`, err);
      }
    }
  }

  // Fallback seguro se não houver Supabase Storage configurado no projeto
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
