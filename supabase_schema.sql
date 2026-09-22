-- ==============================================================================
-- ATLAS CULTURAL - SUPABASE DATABASE SCHEMA
-- Execute este script no SQL Editor do seu painel Supabase (https://supabase.com)
-- ==============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuário (vinculada ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  bio TEXT DEFAULT 'Apaixonado por música ao vivo, cinema autoral e boas leituras.',
  favorite_categories TEXT[] DEFAULT ARRAY['show', 'museu', 'livro', 'filme'],
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Experiências Culturais e Desejos (Passaporte Cultural)
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  creator_or_artist TEXT,
  category TEXT NOT NULL CHECK (category IN ('show', 'festival', 'filme', 'série', 'livro', 'quadrinho', 'museu', 'galeria', 'peça', 'musical', 'viagem', 'gastronomia')),
  date DATE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER DEFAULT 0,
  venue TEXT,
  city TEXT,
  companions TEXT[] DEFAULT ARRAY['Sozinho(a)'],
  rating INTEGER DEFAULT 5 CHECK (rating >= 0 AND rating <= 5),
  vibe_tag TEXT,
  notes TEXT,
  image_url TEXT,
  image_aspect_ratio TEXT DEFAULT '16:9',
  image_fit TEXT DEFAULT 'cover',
  image_frame_style TEXT DEFAULT 'clean',
  image_zoom NUMERIC DEFAULT 1.0,
  ticket_or_cost TEXT DEFAULT '$$',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'wishlist')),
  favorite BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Índices para consultas ultra-rápidas
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_year ON public.experiences(year);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON public.experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences(status);

-- 5. Habilitar Segurança por Linha (Row Level Security - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Segurança para `profiles`
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil e perfis públicos" ON public.profiles;
CREATE POLICY "Usuários podem ver seu próprio perfil e perfis públicos"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 7. Políticas de Segurança para `experiences`
DROP POLICY IF EXISTS "Usuários podem ver apenas suas próprias experiências" ON public.experiences;
CREATE POLICY "Usuários podem ver apenas suas próprias experiências"
  ON public.experiences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar suas próprias experiências" ON public.experiences;
CREATE POLICY "Usuários podem criar suas próprias experiências"
  ON public.experiences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem editar suas próprias experiências" ON public.experiences;
CREATE POLICY "Usuários podem editar suas próprias experiências"
  ON public.experiences FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias experiências" ON public.experiences;
CREATE POLICY "Usuários podem deletar suas próprias experiências"
  ON public.experiences FOR DELETE
  USING (auth.uid() = user_id);

-- 8. Trigger automático para criar o registro em `profiles` após o cadastro no `auth.users`
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar, bio, favorite_categories, is_premium)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'bio', 'Apaixonado por música ao vivo, cinema autoral e boas leituras.'),
    ARRAY['show', 'museu', 'livro', 'filme'],
    COALESCE((NEW.raw_user_meta_data->>'is_premium')::boolean, FALSE)
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo caso exista e recriar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
