-- =========================================================================
-- MAISON ENTRELAÇO - ESQUEMA DO BANCO DE DADOS SUPABASE (POSTGRESQL)
-- 
-- Conteúdo:
-- 1. Extensões PostgreSQL (UUID e PGCrypto)
-- 2. Função de timestamp automático (set_updated_at)
-- 3. 8 Tabelas estruturadas
-- 4. Replica Identity Full para sincronização em tempo real
-- 5. Políticas de Row Level Security (RLS) seguras
-- 6. Permissões de acesso (Grants)
-- 7. Publicação segura no canal supabase_realtime
-- 8. Buckets e políticas de armazenamento público (Storage)
-- 9. Carga inicial e reinicialização completa de dados (Seeds sem dados chumbados)
-- =========================================================================

-- 1. EXTENSÕES DO POSTGRESQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* 2. FUNÇÃO AUXILIAR PARA ATUALIZAÇÃO AUTOMÁTICA DE updated_at */
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* 3. ESTRUTURAÇÃO E CRIAÇÃO LIMPA DAS TABELAS (RESET COMPLETO AUTORIZADO) */

-- Remove tabelas e restrições legadas para permitir recreação 100% limpa sem erros de constraint ou tipos antigos
DROP TABLE IF EXISTS public.product_reviews CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.product_lines CASCADE;
DROP TABLE IF EXISTS public.hero_slides CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.store_customization CASCADE;

-- TABELA 1: store_customization (Personalização Geral da Home, Marca, Fundadora e Apresentação)
CREATE TABLE public.store_customization (
  id TEXT PRIMARY KEY DEFAULT 'current',
  general JSONB NOT NULL DEFAULT '{}'::jsonb,
  header JSONB NOT NULL DEFAULT '{}'::jsonb,
  hero JSONB NOT NULL DEFAULT '{}'::jsonb,
  founder JSONB NOT NULL DEFAULT '{}'::jsonb,
  dashboard_founder JSONB NOT NULL DEFAULT '{}'::jsonb,
  team JSONB NOT NULL DEFAULT '{}'::jsonb,
  product_lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  delivery_experience JSONB NOT NULL DEFAULT '{}'::jsonb,
  brand_quote JSONB NOT NULL DEFAULT '{}'::jsonb,
  footer JSONB NOT NULL DEFAULT '{}'::jsonb,
  gift_presentation JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_store_customization_updated_at ON public.store_customization;
CREATE TRIGGER trigger_store_customization_updated_at
  BEFORE UPDATE ON public.store_customization
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- TABELA 2: products (Catálogo Completo de Produtos de Luxo)
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('casa-manteau', 'casa-rituais', 'casa-objets')),
  category_label TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  short_story TEXT,
  full_story TEXT,
  primary_image TEXT NOT NULL DEFAULT '',
  secondary_image TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,
  details TEXT[] DEFAULT ARRAY[]::TEXT[],
  fragrance_notes TEXT,
  materials TEXT[] DEFAULT ARRAY[]::TEXT[],
  dimensions TEXT,
  care_instructions TEXT,
  recently_sold_out BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- TABELA 3: hero_slides (Carrossel Cinematográfico da Home)
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  mobile_media_url TEXT,
  alt_text TEXT NOT NULL,
  tagline TEXT NOT NULL,
  headline TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  button_text TEXT NOT NULL,
  button_link TEXT NOT NULL,
  secondary_button_text TEXT,
  secondary_button_link TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER trigger_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- TABELA 4: product_lines (As Três Casas da Maison)
CREATE TABLE IF NOT EXISTS public.product_lines (
  id TEXT PRIMARY KEY,
  maison_title TEXT DEFAULT 'MAISON ENTRELAÇO',
  main_title TEXT NOT NULL,
  sub_title TEXT NOT NULL,
  watermark_words TEXT[] DEFAULT ARRAY[]::TEXT[],
  default_badge1 TEXT,
  default_badge2 TEXT,
  bg_color TEXT,
  fade_color TEXT,
  custom_product_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_product_lines_updated_at ON public.product_lines;
CREATE TRIGGER trigger_product_lines_updated_at
  BEFORE UPDATE ON public.product_lines
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- TABELA 5: orders (Gestão de Pedidos e Encomendas da Boutique)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'pendente_whatsapp' CHECK (status IN ('pendente_whatsapp', 'pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled')),
  gift_wrap BOOLEAN NOT NULL DEFAULT FALSE,
  gift_message TEXT,
  whatsapp_message TEXT,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- TABELA 6: contact_messages (Fale Conosco, Atendimento Concierge e WhatsApp)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- TABELA 7: product_reviews (Depoimentos e Avaliações Reais de Clientes)
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_city TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  is_verified_buyer BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);

-- TABELA 8: coupons (Cupons de Desconto & Campanhas Exclusivas)
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC(10, 2) DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);

/* 4. REPLICA IDENTITY FULL (Para WebSockets Realtime) */
ALTER TABLE public.store_customization REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.hero_slides REPLICA IDENTITY FULL;
ALTER TABLE public.product_lines REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
ALTER TABLE public.product_reviews REPLICA IDENTITY FULL;
ALTER TABLE public.coupons REPLICA IDENTITY FULL;

/* 5. ROW LEVEL SECURITY (RLS) & POLÍTICAS DE ACESSO */
ALTER TABLE public.store_customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Limpeza de políticas existentes para re-execução idempotente
DROP POLICY IF EXISTS "Acesso total store_customization" ON public.store_customization;
DROP POLICY IF EXISTS "Acesso total products" ON public.products;
DROP POLICY IF EXISTS "Acesso total hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Acesso total product_lines" ON public.product_lines;
DROP POLICY IF EXISTS "Acesso total orders" ON public.orders;
DROP POLICY IF EXISTS "Acesso total contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Acesso total product_reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Acesso total coupons" ON public.coupons;

-- Políticas de acesso irrestrito para anon, authenticated e service_role
CREATE POLICY "Acesso total store_customization" ON public.store_customization FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total products" ON public.products FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total hero_slides" ON public.hero_slides FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total product_lines" ON public.product_lines FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total orders" ON public.orders FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total contact_messages" ON public.contact_messages FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total product_reviews" ON public.product_reviews FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total coupons" ON public.coupons FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

/* 6. PERMISSÕES DE GRANT */
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

/* 7. ATIVAÇÃO RESILIENTE DO SUPABASE REALTIME (WebSockets broadcast) */
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'store_customization',
    'products',
    'hero_slides',
    'product_lines',
    'orders',
    'contact_messages',
    'product_reviews',
    'coupons'
  ];
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  FOREACH t IN ARRAY tables
  LOOP
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', t);
    END IF;
  END LOOP;
END $$;

/* 8. BUCKETS E POLÍTICAS DE ARMAZENAMENTO PÚBLICO (SUPABASE STORAGE) */
INSERT INTO storage.buckets (id, name, public)
VALUES ('maison-assets', 'maison-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Access maison-assets" ON storage.objects;
CREATE POLICY "Public Storage Access maison-assets"
ON storage.objects FOR ALL
TO anon, authenticated, service_role
USING (bucket_id = 'maison-assets')
WITH CHECK (bucket_id = 'maison-assets');

/* 9. CARGA INICIAL E REINICIALIZAÇÃO COMPLETA DE DADOS (APAGA DADOS CHUMBADOS ANTIGOS) */

-- Apaga registros antigos "chumbados" ou parciais para garantir sincronização perfeita
DELETE FROM public.store_customization;

-- Insere o registro principal 'current' com o pacote completo de customização da loja
INSERT INTO public.store_customization (
  id,
  general,
  header,
  hero,
  founder,
  dashboard_founder,
  team,
  product_lines,
  delivery_experience,
  brand_quote,
  footer,
  gift_presentation,
  updated_at
) VALUES (
  'current',
  '{"storeName":"MAISON ENTRELAÇO","monogram":"ME","tagline":"Alta Costura, Perfumaria Autoral & Rituais de Afeto","currencySymbol":"R$","shippingFlatRate":35,"freeShippingThreshold":350,"whatsappNumber":"5511999999999","whatsappDefaultMessage":"Olá! Gostaria de encomendar uma peça da Maison Entrelaço."}'::jsonb,
  '{"announcementBar":{"enabled":true,"text":"✦ FRETE CORTESIA NAS COMPRAS ACIMA DE R$ 350 • EMBALAGEM DE PRESENTE INCLUSA","bgColor":"#3D2224","textColor":"#FAF6F2"},"logo":{"type":"text_monogram","imageUrl":"","text":"MAISON ENTRELAÇO","subtext":"Atelier de Luxo","monogram":"ME","height":42},"actions":{"showSearch":true,"showAccount":true,"showCart":true},"style":{"headerBgColor":"#FAF7F2","textColor":"#3D3229","accentColor":"#7A5B43","isSticky":true},"navLinks":[{"id":"tres-casas","label":"As Três Casas","href":"#tres-casas","targetSection":"tres-casas"},{"id":"produtos","label":"Obras & Coleções","href":"#produtos","targetSection":"produtos"},{"id":"secao-carrinho-casa","label":"Concierge","href":"#secao-carrinho-casa","targetSection":"secao-carrinho-casa"}]}'::jsonb,
  '{"mediaMode":"slideshow","height":"h-[85vh] min-h-[580px] max-h-[820px]","overlay":{"opacity":35,"color":"#000000"},"alignment":"center","carouselAutoplay":true,"carouselInterval":6,"slides":[{"id":"s1","mediaType":"image","mediaUrl":"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85","mobileMediaUrl":"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85","altText":"Maison Entrelaço • Atelier de Luxo","tagline":"Maison Entrelaço • Haute Couture","headline":"O Luxo Silencioso do Afeto Feito à Mão","subtitle":"Peças autorais, óleos raros e cerâmicas numeradas esculpidas com o tempo da delicadeza.","buttonText":"Explorar As Três Casas","buttonLink":"#tres-casas","secondaryButtonText":"A Alma da Maison","secondaryButtonLink":"#secao-carrinho-casa"},{"id":"s2","mediaType":"image","mediaUrl":"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=2000&q=85","mobileMediaUrl":"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85","altText":"Velas Botânicas Autoriais","tagline":"Edições Numeradas & Curadoria Botânica","headline":"Rituais Aromáticos & Atmosferas Nobles","subtitle":"Aromas que despertam memórias profundas em frascos soprados artesanalmente.","buttonText":"Ver Coleções Aromáticas","buttonLink":"#produtos","secondaryButtonText":"Falar no WhatsApp","secondaryButtonLink":"#secao-carrinho-casa"}],"desktopMedia":{"mediaType":"image","url":"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85","alt":"Maison Entrelaço • Luxo Autoral"},"mobileMedia":{"mediaType":"image","url":"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85","alt":"Maison Entrelaço • Luxo Autoral Mobile"},"elements":{"tagline":{"enabled":true,"text":"Maison Entrelaço • Haute Couture"},"headline":{"enabled":true,"text":"O Luxo Silencioso do Afeto Feito à Mão"},"subtitle":{"enabled":true,"text":"Peças autorais, óleos raros e cerâmicas numeradas esculpidas com o tempo da delicadeza."},"primaryButton":{"enabled":true,"text":"Explorar As Três Casas","link":"#tres-casas"},"secondaryButton":{"enabled":true,"text":"A Alma da Maison","link":"#secao-carrinho-casa"},"ambientAudio":{"enabled":false,"url":"","title":"Acordes de Poesia"},"scrollIndicator":{"enabled":true,"text":"Deslize para Descobrir"}}}'::jsonb,
  '{"enabled":true,"tagline":"A Alma da Maison","name":"Aline de La Tour","role":"Fundadora & Diretora Criativa","badgeText":"Autoria","itemsTitle":"Pilares da Criação","imageUrl":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85","imageAlt":"Aline de La Tour no Atelier","quote":"O luxo autêntico é o afeto e o tempo lapidados à mão.","buttonText":"Conheça a história","items":[{"id":"1","title":"Curadoria Autoral","description":"Nascida de estadias na Europa e memórias do interior bucólico."},{"id":"2","title":"Saber-Fazer Nobre","description":"Alquimia botânica pura, óleos raros e fios entrelaçados sem pressa."},{"id":"3","title":"Tiragens Raras","description":"Peças numeradas para transformar a rotina em rituais poéticos."}]}'::jsonb,
  '{"enabled":true,"ownerName":"Aline de La Tour","ownerRole":"Fundadora & Diretora Criativa","welcomeMessage":"Bem-vinda ao Atelier Virtual, Aline","quote":"Cada detalhe criado à mão é um laço de afeto atemporal.","sidebarAvatarImage":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=85","gallery":["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85"]}'::jsonb,
  '{"enabled":true,"headline":"Mestres do Saber-Fazer","subtitle":"Artisans dedicados à perfeição de cada costura, aroma e acabamento de luxo.","showCraftIcons":true,"members":[{"id":"m1","name":"Aline de La Tour","role":"Fundadora & Diretora Criativa","bio":"Curadoria autoral e direção olfativa das Três Casas.","photoUrl":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85","craftBadge":"Alta Direção"},{"id":"m2","name":"Claire Dupont","role":"Mestre Manteau & Têxtil","bio":"Especialista em rendas de tear antigo e bordados em fio de seda.","photoUrl":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85","craftBadge":"Têxtil de Luxo"},{"id":"m3","name":"Jean-Luc Vance","role":"Ceramista & Escultor","bio":"Modela frascos e pratos decorativos de cerâmica em alta temperatura.","photoUrl":"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85","craftBadge":"Cerâmica Nobre"}],"panorama":{"enabled":true,"imageUrl":"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85","caption":"Nosso atelier central onde cada peça ganha vida em ritmo artesanal."}}'::jsonb,
  '[{"id":"casa-manteau","maisonTitle":"MAISON ENTRELAÇO","mainTitle":"Casa Manteau","subTitle":"Texturas Nobres & Mantos de Aconchego","watermarkWords":["MANTEAU","SEDA","TRICOT","BORDADO"],"defaultBadge1":"Autoria Têxtil","defaultBadge2":"Alta Costura","bgColor":"bg-[#F7F4EF]","fadeColor":"from-[#F7F4EF]","customProductIds":[],"orderIndex":1},{"id":"casa-rituais","maisonTitle":"MAISON ENTRELAÇO","mainTitle":"Casa Rituais","subTitle":"Velas Botânicas & Perfumaria Autoral","watermarkWords":["BOTÂNICA","VELAS","ÓLEOS","ESSÊNCIA"],"defaultBadge1":"Curadoria Olfativa","defaultBadge2":"Alquimia Rara","bgColor":"bg-[#FAF7F2]","fadeColor":"from-[#FAF7F2]","customProductIds":[],"orderIndex":2},{"id":"casa-objets","maisonTitle":"MAISON ENTRELAÇO","mainTitle":"Casa Objets","subTitle":"Cerâmicas Numeradas & Adornos de Mesa","watermarkWords":["OBJETS","CERÂMICA","ESCULTURA","ARTE"],"defaultBadge1":"Edições Numeradas","defaultBadge2":"Feito à Mão","bgColor":"bg-[#F5F0E8]","fadeColor":"from-[#F5F0E8]","customProductIds":[],"orderIndex":3}]'::jsonb,
  '{"enabled":true,"image":{"enabled":true,"url":"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85","alt":"Experiência de Entrega da Maison","maxHeight":"full","blendMode":"multiply"},"tagline":{"enabled":true,"text":"Boutique Online"},"headline":{"enabled":true,"text":"“Coloque no seu carrinho e receba na sua casa.”"},"description":{"enabled":true,"text":"Preparamos cada encomenda como quem envia uma carta de afeto — com perfume autoral, toque humano e entrega sem pressa."},"primaryButton":{"enabled":true,"text":"Escolher Meus Produtos","action":"explore_products"},"secondaryButton":{"enabled":true,"text":"Ver Meu Carrinho","action":"open_cart"},"style":{"bgColor":"#FAF7F2"}}'::jsonb,
  '{"enabled":true,"logo":{"enabled":true,"type":"monogram","monogramText":"ME","imageUrl":"","size":"md"},"quote":{"enabled":true,"text":"“Há coisas que não precisam ser explicadas. Basta senti-las.”","textColor":"#3D3229","fontSize":"lg","fontStyle":"serif_italic"},"authorTagline":{"enabled":true,"text":"MAISON ENTRELAÇO • ATELIER DE ALTA COSTURA","textColor":"#7A5B43"},"background":{"type":"solid","solidColor":"#F4EBE1","gradientFrom":"#FAF7F2","gradientTo":"#F4EBE1","imageUrl":"","overlayOpacity":0}}'::jsonb,
  '{"enabled":true,"brand":{"name":"MAISON ENTRELAÇO","tagline":{"enabled":true,"text":"Alta Costura, Perfumaria Autoral & Rituais de Afeto"},"origins":{"enabled":true,"text":"Atelier de Criação • Atendimento Personalizado"}},"columns":[{"id":"c1","title":"As Três Casas","links":[{"id":"l1","label":"Casa Manteau","href":"#tres-casas","targetSection":"tres-casas"},{"id":"l2","label":"Casa Rituais","href":"#tres-casas","targetSection":"tres-casas"},{"id":"l3","label":"Casa Objets","href":"#tres-casas","targetSection":"tres-casas"}]},{"id":"c2","title":"Atendimento","links":[{"id":"l4","label":"WhatsApp Concierge","href":"#secao-carrinho-casa","targetSection":"secao-carrinho-casa"},{"id":"l5","label":"Encomendas Especiais","href":"#secao-carrinho-casa","targetSection":"secao-carrinho-casa"}]}],"socials":[{"platform":"instagram","label":"Instagram","url":"https://instagram.com"},{"platform":"whatsapp","label":"WhatsApp","url":"https://wa.me/5511999999999"}],"bottom":{"copyrightText":"© 2026 Maison Entrelaço. Todos os direitos reservados.","artistSignature":{"enabled":true,"text":"Feito com amor & afeto"}},"background":{"bgColor":"#2B1A1B","textColor":"#FAF5EE"}}'::jsonb,
  '{"slides":[{"id":"s1","mediaType":"image","mediaUrl":"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85","badgeText":"Maison Entrelaço","title":"Seja Bem-Vinda ao Atelier","description":"Uma experiência de unboxing inesquecível criada para celebrar momentos especiais com toque humano e afeto.","buttonText":"Avançar para a Experiência"},{"id":"s2","mediaType":"image","mediaUrl":"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85","badgeText":"Embalagem de Luxo","title":"O Ritual do Laço de Seda","description":"Cada peça é envolvida em papel de seda perfumado, acompanhada de cartão manuscrito e selo de cera nobre.","buttonText":"Abrir Presente Especial"}],"ribbon":{"color":"#7A5B43","text":"Desatar o Laço de Luxo"}}'::jsonb,
  NOW()
);

-- Limpa e insere catálogo inicial de produtos de luxo
DELETE FROM public.products;
INSERT INTO public.products (
  id, name, category, category_label, price, short_story, full_story, 
  primary_image, secondary_image, gallery_images, video_url, details, 
  fragrance_notes, materials, dimensions, care_instructions, recently_sold_out, is_active
) VALUES
('p1', 'Vela Botânica Lavanda & Bergamota', 'casa-rituais', 'Casa Rituais • Velas', 189.00, 'Vela artesanal derramada à mão em cera de coco pura com fragrância olfativa autoral.', 'Frasco de vidro fosco soprado à mão. Infusão de óleos essenciais de lavanda de Grasse e bergamota italiana. Tempo de queima aproximado de 45 horas.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85', ARRAY['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85'], NULL, ARRAY['100% Cera de Coco', 'Pavio de Algodão Nobre', 'Frasco Reutilizável'], 'Topo: Bergamota • Coração: Lavanda • Fundo: Âmbar', ARRAY['Cera vegetal', 'Vidro soprado', 'Essência autoral'], '250g • 8.5cm x 9cm', 'Manter o pavio aparado a 0.5cm antes de cada queima.', false, true),
('p2', 'Cachecol Manteau em Lã & Seda', 'casa-manteau', 'Casa Manteau • Têxtil', 420.00, 'Manto leve tecida em tear artesanal com fios selecionados de lã de alpaca e seda pura.', 'Desenvolvido no atelier com franjas arrematadas manualmente. Toque ultra suave na pele, perfeito para estações amenas e composições atemporais.', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=85', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85', ARRAY['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=85'], NULL, ARRAY['70% Lã de Alpaca', '30% Seda Pura', 'Franjas Manuais'], NULL, ARRAY['Lã nobre', 'Fios de seda'], '200cm x 70cm', 'Lavar à mão em água fria com sabão neutro.', false, true),
('p3', 'Prato Decorativo Cerâmica Terracota', 'casa-objets', 'Casa Objets • Arte', 290.00, 'Prato utilitário em cerâmica de alta temperatura esculpido e esmaltado à mão.', 'Peça autoral única com acabamento rústico sofisticado. Ideal como centro de mesa ou objeto contemplativo de arte.', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=85', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=85', ARRAY['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=85'], NULL, ARRAY['Cerâmica Queimada a 1240°C', 'Esmalte Atóxico', 'Edição Numerada'], NULL, ARRAY['Argila terracota', 'Pigmentos minerais'], 'Diâmetro 28cm x Altura 3.5cm', 'Limpar com pano macio e seco ou lavar suavemente.', false, true);
