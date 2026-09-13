-- ==============================================================================
-- MAISON ENTRELAÇO • SCHEMA DO BANCO DE DADOS SUPABASE (POSTGRESQL)
-- ==============================================================================
-- Este arquivo contém o esquema SQL completo com tabelas, índices, triggers,
-- políticas de Row Level Security (RLS), ativação de Realtime WebSockets e 
-- carga inicial de dados (seeds) para a boutique de luxo Maison Entrelaço.
--
-- Como executar no Supabase:
-- 1. Acesse o painel do seu projeto no Supabase (https://supabase.com).
-- 2. No menu lateral esquerdo, clique em "SQL Editor".
-- 3. Clique em "New query", cole todo o conteúdo deste arquivo e clique em "Run".
-- 4. Pronto! O banco de dados estará 100% criado, com dados iniciais e Realtime ativo.
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. FUNÇÃO AUXILIAR PARA ATUALIZAÇÃO AUTOMÁTICA DE updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABELA 1: store_customization (Configurações Gerais da Home e Identidade)
-- ==============================================================================
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migrações não-destrutivas caso a tabela já exista
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS general JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.store_customization ADD COLUMN IF NOT EXISTS dashboard_founder JSONB NOT NULL DEFAULT '{}'::jsonb;

DROP TRIGGER IF EXISTS trigger_store_customization_updated_at ON public.store_customization;
CREATE TRIGGER trigger_store_customization_updated_at
  BEFORE UPDATE ON public.store_customization
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- TABELA 2: products (Catálogo de Produtos de Luxo)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('velas', 'sabonetes', 'croche', 'edicoes_especiais', 'outro')),
  category_label TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  short_story TEXT,
  full_story TEXT,
  primary_image TEXT NOT NULL,
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

-- Garantir coluna caso a tabela já exista
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS recently_sold_out BOOLEAN NOT NULL DEFAULT FALSE;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- ==============================================================================
-- TABELA 3: hero_slides (Slides Dinâmicos de Vídeo e Foto da Seção Principal)
-- ==============================================================================
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

-- ==============================================================================
-- TABELA 4: product_lines (As Três Casas & Linhas de Produtos Dinâmicas)
-- ==============================================================================
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

-- ==============================================================================
-- TABELA 5: orders (Pedidos & Transações da Boutique)
-- ==============================================================================
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

-- ==============================================================================
-- TABELA 6: contact_messages (Mensagens do Fale Conosco & Encomendas de Luxo)
-- ==============================================================================
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

-- ==============================================================================
-- 3. POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.store_customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de personalização" ON public.store_customization FOR SELECT USING (true);
CREATE POLICY "Leitura pública de produtos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Leitura pública de slides da hero" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Leitura pública de linhas de produtos" ON public.product_lines FOR SELECT USING (true);

CREATE POLICY "Escrita de personalização pela aplicação" ON public.store_customization FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gerenciamento de produtos pela aplicação" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gerenciamento de hero slides pela aplicação" ON public.hero_slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gerenciamento de linhas de produtos pela aplicação" ON public.product_lines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Criação de novos pedidos" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Leitura de pedidos" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Atualização de pedidos" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Envio de mensagens de contato" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Leitura de mensagens de contato" ON public.contact_messages FOR SELECT USING (true);

-- ==============================================================================
-- 4. ATIVAÇÃO DE REALTIME WEBSOCKETS NO SUPABASE
-- ==============================================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE public.store_customization;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_slides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_lines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;

-- ==============================================================================
-- 5. CARGA INICIAL DE DADOS (SEEDS AUTORAIS DA MAISON ENTRELAÇO)
-- ==============================================================================
INSERT INTO public.store_customization (
  id, general, header, hero, founder, dashboard_founder, team, product_lines, delivery_experience, brand_quote, footer
) VALUES (
  'current',
  '{
    "storeName": "Maison Entrelaço",
    "monogram": "ME",
    "tagline": "Atelier de Criação Autoral • Velas, Sabonetes & Arte Botânica",
    "whatsappNumber": "5511987654321",
    "whatsappDefaultMessage": "Olá! Vim pelo site da {storeName} e gostaria de informações sobre os produtos e encomendas.",
    "supportEmail": "atendimento@maisonentrelaco.com.br",
    "instagramHandle": "@maisonentrelaço",
    "cnpjOrDocument": "00.000.000/0001-00",
    "addressCity": "São Paulo - SP"
  }'::jsonb,
  '{
    "announcementBar": {
      "enabled": true,
      "text": "Edição de Outono do Atelier • Embalagem para presente em papel vegetal e lacre em cera inclusa",
      "linkText": "Descobrir",
      "linkUrl": "#tres-casas",
      "bgColor": "#3D3229",
      "textColor": "#F7F4EF"
    },
    "logo": {
      "type": "image",
      "text": "MAISON ENTRELAÇO",
      "monogram": "ME",
      "sealTopText": "MAISON",
      "sealBottomText": "ENTRELAÇO",
      "imageUrl": "/images/maison-logo.svg",
      "size": "md"
    },
    "actions": { "showSearch": true, "showAccount": true, "showCart": true },
    "style": { "sticky": true, "backdropBlur": true, "theme": "classic_cream" },
    "navLinks": [
      { "id": "velas", "label": "Velas Aromáticas", "enabled": true, "targetId": "velas", "targetType": "line" },
      { "id": "sabonetes", "label": "Sabonetes Botânicos", "enabled": true, "targetId": "sabonetes", "targetType": "line" },
      { "id": "croche", "label": "Peças em Crochê", "enabled": true, "targetId": "croche", "targetType": "line" }
    ]
  }'::jsonb,
  '{
    "mediaMode": "both",
    "height": "full",
    "overlay": { "enabled": true, "intensity": "subtle", "vignette": true },
    "alignment": "center",
    "carouselAutoplay": true,
    "carouselInterval": 6,
    "slides": [
      {
        "id": "slide-1",
        "type": "video",
        "title": "Cortinas ao Sol & Arquitetura do Atelier",
        "desktopUrl": "https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4",
        "mobileUrl": "https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4",
        "posterUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90"
      },
      {
        "id": "slide-2",
        "type": "image",
        "title": "Casa I • Velas Aromáticas & Cera Vegetal",
        "desktopUrl": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=2000&q=90",
        "mobileUrl": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1080&q=90",
        "posterUrl": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=2000&q=90"
      },
      {
        "id": "slide-3",
        "type": "video",
        "title": "Chama Viva & Fusão das Ceras",
        "desktopUrl": "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-candle-flame-41580-large.mp4",
        "mobileUrl": "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-candle-flame-41580-large.mp4",
        "posterUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=90"
      },
      {
        "id": "slide-4",
        "type": "image",
        "title": "Casa II • Sabonetes Botânicos de Oliva & Camomila",
        "desktopUrl": "https://images.unsplash.com/photo-1607006310458-0059b0d2d31e?auto=format&fit=crop&w=2000&q=90",
        "mobileUrl": "https://images.unsplash.com/photo-1607006310458-0059b0d2d31e?auto=format&fit=crop&w=1080&q=90",
        "posterUrl": "https://images.unsplash.com/photo-1607006310458-0059b0d2d31e?auto=format&fit=crop&w=2000&q=90"
      },
      {
        "id": "slide-5",
        "type": "image",
        "title": "Casa III • Crochê Artesanal em Fio Nobre de Algodão",
        "desktopUrl": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=2000&q=90",
        "mobileUrl": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1080&q=90",
        "posterUrl": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=2000&q=90"
      }
    ],
    "desktopMedia": {
      "type": "video",
      "url": "https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4",
      "posterUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90"
    },
    "mobileMedia": {
      "useSeparateMedia": true,
      "type": "video",
      "url": "https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4",
      "posterUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=90"
    },
    "elements": {
      "tagline": { "enabled": false, "text": "Uma casa feita de histórias.", "icon": true },
      "headline": { "enabled": false, "text": "Objetos para perfumar, cuidar e vestir a vida de beleza.", "size": "large" },
      "subtitle": { "enabled": false, "text": "Europa monárquica · Botânica nobre · Feito à mão" },
      "primaryButton": { "enabled": false, "text": "Descobrir as Três Casas", "action": "tres-casas" },
      "secondaryButton": { "enabled": false, "text": "O Saber-Fazer Artesanal", "action": "atelier" },
      "ambientAudio": { "enabled": false, "label": "Som da Maison" },
      "scrollIndicator": { "enabled": false, "label": "Role" }
    }
  }'::jsonb,
  '{
    "enabled": true,
    "tagline": "A Alma da Maison",
    "name": "Aline de La Tour",
    "role": "Fundadora & Diretora Criativa",
    "badgeText": "Autoria",
    "itemsTitle": "Pilares da Criação",
    "imageUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85",
    "imageAlt": "Aline de La Tour, fundadora da Maison",
    "items": [
      { "id": "1", "title": "Curadoria Autoral", "description": "Cada fragrância e objeto nasce de memórias de estadias na Europa e casarões coloniais." },
      { "id": "2", "title": "Saber-Fazer Nobre", "description": "Alquimia botânica pura, óleos nobres e entrelaçado manual feito com tempo e calma." },
      { "id": "3", "title": "Tiragens Raras", "description": "Objetos de afeto intencionalmente esculpidos para guardar a beleza dos dias." }
    ],
    "quote": "O luxo autêntico é o afeto e o tempo lapidados à mão.",
    "buttonText": "Conheça a história"
  }'::jsonb,
  '{
    "enabled": true,
    "ownerName": "Aline de La Tour",
    "ownerRole": "Fundadora & Diretora Criativa",
    "welcomeMessage": "Mesa de Criação & Atelier da Fundadora",
    "quote": "O luxo autêntico é o afeto e o tempo lapidados à mão.",
    "heroBgImage": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=85",
    "sidebarAvatarImage": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=85",
    "gallery": [
      {
        "id": "df-1",
        "url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85",
        "title": "Retrato Principal da Criadora",
        "caption": "Fotografia autoral de luz natural da fundadora",
        "createdAt": "2025-01-10"
      },
      {
        "id": "df-2",
        "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
        "title": "No Atelier em Dia de Alquimia",
        "caption": "Seleção botânica e infusões aromáticas artesanais",
        "createdAt": "2025-02-14"
      },
      {
        "id": "df-3",
        "url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
        "title": "Curadoria de Fios Nobres",
        "caption": "Estudo do entrelaçado manual e embalagens em linho",
        "createdAt": "2025-03-01"
      }
    ]
  }'::jsonb,
  '{
    "enabled": true,
    "headline": "EVOLUA A SUA CASA",
    "subtitle": "ARTE BOTÂNICA, VELAS PURAS & CRIAÇÕES MANUAIS",
    "showCraftIcons": true,
    "members": [
      {
        "id": "member-1",
        "name": "Yusuf O.",
        "role": "Head Of Engineering",
        "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=85",
        "imageAlt": "Yusuf O. - Head Of Engineering",
        "isGrayscale": false
      },
      {
        "id": "member-2",
        "name": "Kemal O.",
        "role": "Founder & CEO",
        "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85",
        "imageAlt": "Kemal O. - Founder & CEO",
        "isGrayscale": false
      },
      {
        "id": "member-3",
        "name": "Berkay K.",
        "role": "Developer",
        "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85",
        "imageAlt": "Berkay K. - Developer",
        "isGrayscale": true
      }
    ],
    "panorama": {
      "enabled": true,
      "imageUrl": "/images/mansoes-luxo-panoramica.png",
      "alt": "Panorama de Mansões Modernas de Luxo"
    }
  }'::jsonb,
  '[
    {
      "id": "velas",
      "roman": "I",
      "housePrefix": "CASA",
      "maisonTitle": "MAISON ENTRELAÇO",
      "mainTitle": "O aroma rico",
      "subTitle": "Velas aromáticas",
      "watermarkWords": ["AROMA RICO", "VERSAILLES"],
      "defaultBadge1": "Cera 100% Vegetal",
      "defaultBadge2": "50h Queima",
      "bgColor": "from-[#FAF8F5] via-[#FAF6F0] to-[#F5EFE6]",
      "fadeColor": "#FAF8F5"
    },
    {
      "id": "sabonetes",
      "roman": "II",
      "housePrefix": "CASA",
      "maisonTitle": "MAISON ENTRELAÇO",
      "mainTitle": "O cuidado",
      "subTitle": "Sabonetes botânicos",
      "watermarkWords": ["O CUIDADO", "BOTÂNICA"],
      "defaultBadge1": "Cold Process",
      "defaultBadge2": "Óleos Puros",
      "bgColor": "from-[#F5EFE6] via-[#F4EFE6] to-[#EFE7DC]",
      "fadeColor": "#F5EFE6"
    },
    {
      "id": "croche",
      "roman": "III",
      "housePrefix": "CASA",
      "maisonTitle": "MAISON ENTRELAÇO",
      "mainTitle": "A trama",
      "subTitle": "Peças em crochê",
      "watermarkWords": ["A TRAMA", "HERANÇA"],
      "defaultBadge1": "Algodão Nobre",
      "defaultBadge2": "Ponto Manual",
      "bgColor": "from-[#EFE7DC] via-[#F6F1EA] to-[#FAF8F5]",
      "fadeColor": "#EFE7DC"
    }
  ]'::jsonb,
  '{
    "enabled": true,
    "image": {
      "enabled": true,
      "url": "/images/atelier-decoracao-panoramica.png",
      "alt": "Arte Panorâmica da Maison",
      "maxHeight": "full",
      "blendMode": "multiply"
    },
    "tagline": { "enabled": true, "text": "Boutique Online" },
    "headline": { "enabled": true, "text": "“Coloque no seu carrinho e receba na sua casa.”" },
    "description": { "enabled": true, "text": "Preparamos cada encomenda como quem envia uma carta de afeto — com perfume autoral, toque humano e entrega sem pressa." },
    "primaryButton": { "enabled": true, "text": "Escolher Meus Produtos", "action": "explore_products" },
    "secondaryButton": { "enabled": true, "text": "Ver Meu Carrinho", "action": "open_cart" },
    "style": { "bgColor": "#FAF7F2" }
  }'::jsonb,
  '{
    "enabled": true,
    "logo": {
      "enabled": true,
      "type": "monogram",
      "monogramText": "M",
      "imageUrl": "",
      "size": "md"
    },
    "quote": {
      "enabled": true,
      "text": "“Há coisas que não precisam ser explicadas. Basta senti-las.”",
      "textColor": "#3D3229",
      "fontSize": "lg"
    },
    "authorTagline": {
      "enabled": true,
      "text": "MAISON ENTRELAÇO — ATEMPORALIDADE & SENTIDO",
      "textColor": "#7A5B43"
    },
    "background": {
      "type": "video",
      "mediaUrl": "https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4",
      "posterUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=90",
      "overlayColor": "#E8E0D4",
      "overlayOpacity": 88,
      "blur": 2
    },
    "paddingY": "normal"
  }'::jsonb,
  '{
    "enabled": true,
    "brand": {
      "displayType": "name",
      "nameText": "MAISON ENTRELAÇO",
      "logoUrl": "",
      "logoHeight": 32,
      "tagline": {
        "enabled": true,
        "text": "“Uma casa feita de histórias. Objetos para perfumar, cuidar e vestir a vida de beleza.”"
      },
      "origins": {
        "enabled": true,
        "text": "FRANÇA • ITÁLIA • BRASIL"
      }
    },
    "columns": [
      {
        "id": "col-maison",
        "title": "A MAISON",
        "items": [
          { "id": "item-1", "label": "A Fundadora", "actionType": "scroll", "target": "a-maison" },
          { "id": "item-2", "label": "Boutique Online", "actionType": "scroll", "target": "secao-carrinho-casa" },
          { "id": "item-3", "label": "As Três Casas", "actionType": "scroll", "target": "tres-casas" }
        ]
      },
      {
        "id": "col-colecoes",
        "title": "COLEÇÕES",
        "items": [
          { "id": "item-4", "label": "Velas Aromáticas", "actionType": "scroll", "target": "velas" },
          { "id": "item-5", "label": "Sabonetes Botânicos", "actionType": "scroll", "target": "sabonetes" },
          { "id": "item-6", "label": "Crochê Feito à Mão", "actionType": "scroll", "target": "croche" },
          { "id": "item-7", "label": "Edições Limitadas", "actionType": "scroll", "target": "produtos" }
        ]
      },
      {
        "id": "col-atendimento",
        "title": "ATENDIMENTO",
        "items": [
          { "id": "item-8", "label": "Personalizado", "actionType": "contact" },
          { "id": "item-9", "label": "Encomendas", "actionType": "contact" },
          { "id": "item-10", "label": "Entregas & Prazos", "actionType": "contact" }
        ]
      },
      {
        "id": "col-conecte",
        "title": "CONECTE-SE",
        "items": [
          { "id": "item-11", "label": "Fale Conosco", "actionType": "contact" }
        ]
      }
    ],
    "socials": [
      {
        "id": "soc-instagram",
        "network": "instagram",
        "handle": "@maisonentrelaço"
      }
    ],
    "bottom": {
      "copyright": "© Maison Entrelaço • Todos os direitos reservados.",
      "loveMessage": "Feito lentamente com ♥ para inspirar o viver.",
      "artistSignature": {
        "enabled": true,
        "prefix": "Planejado pelo artista",
        "artistName": "Douglas L. Rocha",
        "websiteUrl": "https://douglaslrocha.com",
        "websiteLabel": "douglaslrocha.com",
        "signatureUrl": "https://chatgpt.com/s/m_6aa57170bf548191bad414e48113190e",
        "style": "handwritten"
      }
    },
    "background": {
      "type": "video",
      "mediaUrl": "https://assets.mixkit.co/videos/preview/mixkit-night-sky-full-of-stars-41582-large.mp4",
      "posterUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=90",
      "overlayColor": "#1C1714",
      "overlayOpacity": 90
    }
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  header = EXCLUDED.header,
  hero = EXCLUDED.hero,
  founder = EXCLUDED.founder,
  team = EXCLUDED.team,
  product_lines = EXCLUDED.product_lines,
  delivery_experience = EXCLUDED.delivery_experience,
  brand_quote = EXCLUDED.brand_quote,
  footer = EXCLUDED.footer,
  updated_at = NOW();

-- Inserção dos produtos padrão
INSERT INTO public.products (
  id, name, category, category_label, price, short_story, full_story,
  primary_image, secondary_image, gallery_images, video_url, details,
  fragrance_notes, materials, dimensions, care_instructions, stock_quantity, is_active
) VALUES
(
  'vela-jardim-versailles',
  'Vela — Jardim de Versailles',
  'velas',
  'Vela Aromática em Porcelana',
  189.00,
  'Uma fragrância inspirada nas manhãs primaveris dos jardins franceses, com notas de flor de laranjeira, musgo sagrado e bergamota real.',
  'Esta vela evoca a caminhada solitária pelos alamedas de Versailles logo ao alvorecer, quando o orvalho ainda repousa sobre as pétalas e a brisa traz o aroma límpido da terra úmida entrelaçada às flores nobres.',
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1572726729986-7a1362e0c1f5?auto=format&fit=crop&w=1000&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1572726729986-7a1362e0c1f5?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85'
  ],
  'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-candle-in-a-dark-room-42880-large.mp4',
  ARRAY[
    'Cera vegetal de coco, arroz e palma',
    'Pavio duplo de algodão e madeira nobre',
    'Pote de cerâmica artesanal reutilizável',
    'Tempo de queima estimado: 50 horas'
  ],
  '{"top": "Bergamota Real & Néroli de Grasse", "heart": "Flor de Laranjeira & Rosa Damascena", "base": "Musgo de Carvalho & Âmbar Dourado"}'::jsonb,
  ARRAY['Porcelana biscuit', 'Cera vegetal pura', 'Óleos essenciais franceses'],
  '9cm x 8cm • 220g',
  'Apare o pavio a 5mm antes de reacender. Deixe a cera derreter até a borda na primeira queima.',
  45,
  true
),
(
  'sabonete-pedras-loire',
  'Sabonete — Pedras do Loire',
  'sabonetes',
  'Sabonete Botânico Mineral',
  94.00,
  'Infusionado com argila branca purificante, manteiga de karité e infusão de camomila romana para uma espuma aveludada.',
  'Formulado artesanalmente pelo método de saponificação a frio (cold process), este sabonete descansa por 6 semanas no atelier para alcançar a densidade perfeita e preservar as propriedades calmantes das botânicas europeias.',
  'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1000&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1000&q=85'
  ],
  NULL,
  ARRAY[
    'Método artesanal Cold Process (6 semanas de cura)',
    '100% livre de sulfatos e derivados de petróleo',
    'Aroma natural obtido exclusivamente de óleos essenciais'
  ],
  '{"top": "Lavanda Fina & Menta Suave", "heart": "Camomila Romana & Gerânio", "base": "Cedro Branco & Baunilha Botânica"}'::jsonb,
  ARRAY['Azeite de oliva extravirgem', 'Manteiga de karité pura', 'Argila branca mineral'],
  '8cm x 5cm x 3cm • 140g',
  'Manter em saboneteira drenada para maior durabilidade.',
  60,
  true
),
(
  'sousplat-heranca-florenca',
  'Sousplat — Herança de Florença',
  'croche',
  'Peça em Crochê Nobre',
  148.00,
  'Entrelaçado à mão em fio nobre de algodão cru com padrão filigrana inspirado nos tetos renascentistas toscanos.',
  'Cada sousplat demanda 7 horas de dedicação exclusiva de nossas artesãs. Uma peça concebida para atravessar gerações, transformando qualquer refeição em celebração de presença.',
  'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=85'
  ],
  NULL,
  ARRAY[
    'Fio nobre 100% algodão brasileiro penteado',
    'Ponto filigrana exclusivo desenvolvido no atelier',
    'Engomado suave com amido de milho natural'
  ],
  NULL,
  ARRAY['Algodão egípcio penteado', 'Amido vegetal natural'],
  '38cm de diâmetro',
  'Lavar à mão com sabão neutro. Secar na horizontal sobre uma toalha plana.',
  30,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  updated_at = NOW();
