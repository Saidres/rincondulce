-- ==============================================================================
-- RINCÓN DULCE (@rincondulcepasto) - ESQUEMA SUPABASE & DATOS SEMILLA
-- ==============================================================================
-- Este script configura las tablas, índices, políticas de seguridad (RLS),
-- almacenamiento de imágenes (Storage) y datos iniciales para el menú.

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: CATEGORÍAS (categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT '🧇',
    order_num INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: PRODUCTOS (products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    badge_text TEXT, -- e.g. "PRECIO $13.000", "CON HELADO $18.000", "TOP VENTAS"
    is_available BOOLEAN NOT NULL DEFAULT true, -- Permite marcar "Agotado"
    is_hidden BOOLEAN NOT NULL DEFAULT false, -- Ocultar temporalmente
    options JSONB DEFAULT '[]'::jsonb, -- Para variantes (ej. Vaso/Cono, Sabores)
    order_num INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: TOPPINGS (toppings)
CREATE TABLE IF NOT EXISTS public.toppings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
    is_available BOOLEAN NOT NULL DEFAULT true,
    order_num INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA: CONFIGURACIÓN GENERAL (business_settings)
CREATE TABLE IF NOT EXISTS public.business_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    business_name TEXT NOT NULL DEFAULT 'Rincón Dulce',
    tagline TEXT NOT NULL DEFAULT 'Donde cada antojo sabe mejor',
    hero_title TEXT NOT NULL DEFAULT 'Waffles, Bowls & Helados que Enamoran',
    hero_subtitle TEXT NOT NULL DEFAULT 'Postres artesanales y helado soft en Pasto, Nariño. Pide tu domicilio favorito por WhatsApp.',
    whatsapp_number TEXT NOT NULL DEFAULT '573180000000', -- Código país + número (ej: 57318...)
    whatsapp_message_prefix TEXT NOT NULL DEFAULT '¡Hola Rincón Dulce! Quiero hacer el siguiente pedido:',
    instagram_handle TEXT NOT NULL DEFAULT 'rincondulcepasto',
    schedule_text TEXT NOT NULL DEFAULT 'Martes a Domingo: 2:00 PM - 9:00 PM',
    delivery_zones TEXT NOT NULL DEFAULT 'Cobertura en toda la zona urbana de Pasto: Centro, Maridiaz, Pandiaco, Morasurco, Tamasagra, Palermo y alrededores.',
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 4000.00,
    address_text TEXT DEFAULT 'Pasto, Nariño, Colombia',
    is_open_now BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. POLÍTICAS DE SEGURIDAD A NIVEL DE FILA (Row Level Security - RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Lectura PÚBLICA (Cualquier visitante en la web puede ver el menú y ajustes)
CREATE POLICY "Lectura pública de categorías" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Lectura pública de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Lectura pública de toppings" ON public.toppings FOR SELECT USING (true);
CREATE POLICY "Lectura pública de configuración" ON public.business_settings FOR SELECT USING (true);

-- Escritura PROTEGIDA (Solo usuarios autenticados con Supabase Auth pueden editar)
CREATE POLICY "Modificación de categorías para usuarios autenticados" ON public.categories 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Modificación de productos para usuarios autenticados" ON public.products 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Modificación de toppings para usuarios autenticados" ON public.toppings 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Modificación de configuración para usuarios autenticados" ON public.business_settings 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. STORAGE BUCKET PARA FOTOS DE PRODUCTOS
-- Crear bucket 'product-images' si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Imágenes de productos accesibles públicamente" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Solo usuarios autenticados pueden subir o borrar imágenes" ON storage.objects
    FOR ALL TO authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');


-- ==============================================================================
-- 8. DATOS SEMILLA (Seed Data inicial extraído de las historias de Instagram)
-- ==============================================================================

-- Categorías
INSERT INTO public.categories (id, name, slug, description, icon, order_num) VALUES
('c1000000-0000-0000-0000-000000000001', 'Waffles', 'waffles', 'Waffles dorados, crujientes por fuera y esponjosos por dentro.', '🧇', 1),
('c1000000-0000-0000-0000-000000000002', 'Bowls de Fresas', 'bowls-de-fresas', 'Fresas frescas de temporada acompañadas de helado cremoso o crema batida.', '🍓', 2),
('c1000000-0000-0000-0000-000000000003', 'Fresas con Crema', 'fresas-con-crema', 'El clásico irresistible en dos tamaños con abundante crema chantilly.', '🥛', 3),
('c1000000-0000-0000-0000-000000000004', 'Helado Soft', 'helado-soft', 'Helado suave artesanal servido en cono crujiente o vaso.', '🍦', 4),
('c1000000-0000-0000-0000-000000000005', 'Heladísimo', 'heladisimo', 'Vasos gigantes con capas de helado, galleta, salsa y toppings.', '🍨', 5)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Toppings ($2.000 c/u)
INSERT INTO public.toppings (name, price, order_num) VALUES
('Crema Chantilly', 2000.00, 1),
('Oreo Triturada', 2000.00, 2),
('Trocitos de Brownie', 2000.00, 3),
('Mermelada Artesanal de Mora', 2000.00, 4),
('Maní Crocante', 2000.00, 5),
('Sirope de Chocolate', 2000.00, 6)
ON CONFLICT DO NOTHING;

-- Configuración Inicial
INSERT INTO public.business_settings (
    id, business_name, tagline, hero_title, hero_subtitle,
    whatsapp_number, instagram_handle, schedule_text, delivery_zones, delivery_fee, is_open_now
) VALUES (
    'main',
    'Rincón Dulce',
    'Donde cada antojo sabe mejor',
    'Waffles, Bowls & Helados que Enamoran',
    'Postres artesanales y helados preparados al instante en Pasto, Nariño. Domicilios rápidos directo a tu puerta.',
    '573180000000',
    'rincondulcepasto',
    'Martes a Domingo: 2:00 PM - 9:00 PM',
    'Zona urbana de Pasto: Centro, Maridiaz, Pandiaco, Morasurco, Tamasagra, Chapal y alrededores.',
    4000.00,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    business_name = EXCLUDED.business_name,
    tagline = EXCLUDED.tagline;

-- Productos
INSERT INTO public.products (category_id, name, description, price, badge_text, options, order_num) VALUES
-- Waffles
('c1000000-0000-0000-0000-000000000001', 'Waffle Affogato', 'Waffle caliente con bola de helado, toque de café y salsa especial.', 13000.00, 'PRECIO $13.000', '[]'::jsonb, 1),
('c1000000-0000-0000-0000-000000000001', 'Waffle Doble Antojo', 'Waffle crujiente con rodajas de banano, fresas frescas y salsa de chocolate.', 13000.00, 'PRECIO $13.000', '[]'::jsonb, 2),
('c1000000-0000-0000-0000-000000000001', 'Waffle Chocoberry', 'Combinación estelar de chocolate artesanal, crema y fresas seleccionadas.', 13000.00, 'PRECIO $13.000', '[]'::jsonb, 3),

-- Bowls de Fresas
('c1000000-0000-0000-0000-000000000002', 'Bowl de Fresas con Helado', 'Tazón generoso de fresas frescas cubiertas con helado cremoso y sirope.', 18000.00, 'CON HELADO $18.000', '[]'::jsonb, 1),
('c1000000-0000-0000-0000-000000000002', 'Bowl de Fresas con Crema', 'Tazón de fresas frescas con abundante crema chantilly casera y chispas.', 18000.00, 'CON CREMA $18.000', '[]'::jsonb, 2),

-- Fresas con Crema
('c1000000-0000-0000-0000-000000000003', 'Fresas con Crema (Pequeño)', 'Vaso personal de fresas dulces y crema chantilly.', 10000.00, 'PEQUEÑO $10.000', '[]'::jsonb, 1),
('c1000000-0000-0000-0000-000000000003', 'Fresas con Crema (Grande)', 'Vaso grande para los más antojados con capas extras de crema y fresa.', 15000.00, 'GRANDE $15.000', '[]'::jsonb, 2),

-- Helado Soft
('c1000000-0000-0000-0000-000000000004', 'Helado Soft Vainilla', 'Clásico helado suave de vainilla cremosa. Elige en cono crujiente o vaso.', 5000.00, '$5.000', '[{"name": "Presentación", "choices": ["Cono ($5.000)", "Vaso ($5.000)"]}]'::jsonb, 1),
('c1000000-0000-0000-0000-000000000004', 'Helado Soft Capuchino', 'Sabor aromático a café capuchino. Cono ($5.000) o Vaso ($6.000).', 5000.00, 'DESDE $5.000', '[{"name": "Presentación", "choices": ["Cono ($5.000)", "Vaso ($6.000)"]}]'::jsonb, 2),
('c1000000-0000-0000-0000-000000000004', 'Helado Soft con Cobertura Chocolate', 'Helado suave sumergido en capa crocante de chocolate que se endurece al instante.', 6500.00, '$6.500', '[]'::jsonb, 3),
('c1000000-0000-0000-0000-000000000004', 'Helado Soft con Cobertura y Maní', 'Helado suave con cobertura crocante de chocolate y trocitos de maní tostado.', 7000.00, '$7.000', '[]'::jsonb, 4),

-- Heladísimo
('c1000000-0000-0000-0000-000000000005', 'Heladísimo Brownie', 'Copa gigante con trozos de brownie húmedo, helado suave y fudge de chocolate.', 14000.00, 'HELADÍSIMO', '[]'::jsonb, 1),
('c1000000-0000-0000-0000-000000000005', 'Heladísimo Oreo', 'Capas intercaladas de galleta Oreo triturada, helado suave y crema.', 14000.00, 'HELADÍSIMO', '[]'::jsonb, 2),
('c1000000-0000-0000-0000-000000000005', 'Heladísimo Mora', 'Helado suave contrastado con mermelada artesanal de mora silvestre.', 14000.00, 'HELADÍSIMO', '[]'::jsonb, 3)
ON CONFLICT DO NOTHING;
