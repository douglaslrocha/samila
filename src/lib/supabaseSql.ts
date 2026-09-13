// =========================================================================
// MAISON ENTRELAÇO - ESQUEMA DO BANCO DE DADOS SUPABASE (POSTGRESQL)
// =========================================================================

export const SUPABASE_SCHEMA_SQL = `
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
-- 8. Carga inicial de dados autorais (Seeds)
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

/* 3. ESTRUTURAÇÃO DAS TABELAS */

-- TABELA 1: store_customization (Personalização Geral da Home, Marca, Fundadora e Apresentação)
CREATE TABLE IF NOT EXISTS public.store_customization (
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

-- Migrações graduais de colunas caso a tabela já exista
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS general JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS header JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS hero JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS founder JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS dashboard_founder JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS team JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS product_lines JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS delivery_experience JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS brand_quote JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS footer JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS gift_presentation JSONB NOT NULL DEFAULT '{}'::jsonb;

DROP TRIGGER IF EXISTS trigger_store_customization_updated_at ON public.store_customization;
CREATE TRIGGER trigger_store_customization_updated_at
  BEFORE UPDATE ON public.store_customization
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- TABELA 2: products (Catálogo de Produtos Artesanais de Luxo)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  short_story TEXT,
  full_story TEXT,
  primary_image TEXT NOT NULL DEFAULT '',
  secondary_image TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,
  details TEXT[] DEFAULT ARRAY[]::TEXT[],
  fragrance_notes JSONB DEFAULT '{}'::jsonb,
  materials TEXT[] DEFAULT ARRAY[]::TEXT[],
  dimensions TEXT,
  care_instructions TEXT,
  recently_sold_out BOOLEAN NOT NULL DEFAULT FALSE,
  stock_quantity INTEGER NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migrações graduais para tabela products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_label TEXT NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_story TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS full_story TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS details TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fragrance_notes JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS materials TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dimensions TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS care_instructions TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS recently_sold_out BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 50;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- TABELA 3: hero_slides (Slides Multimídia em Alta Resolução da Hero Section)
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('video', 'image')),
  title TEXT,
  desktop_url TEXT NOT NULL,
  mobile_url TEXT,
  poster_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER trigger_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON public.hero_slides(order_index ASC);

-- TABELA 4: product_lines (As Três Casas & Coleções Especiais)
CREATE TABLE IF NOT EXISTS public.product_lines (
  id TEXT PRIMARY KEY,
  roman TEXT NOT NULL,
  house_prefix TEXT DEFAULT 'CASA',
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
`;
