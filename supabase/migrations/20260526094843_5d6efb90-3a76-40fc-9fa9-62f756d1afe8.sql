
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'membro');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'membro',
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Usuarios (profile)
CREATE TABLE public.usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  nome text NOT NULL DEFAULT '',
  telefone text,
  instagram text,
  cidade text,
  foto_url text,
  video_url text,
  whatsapp text,
  pix text,
  slug text UNIQUE,
  link_cta text,
  link_externo_1 text,
  link_externo_2 text,
  texto_cta text DEFAULT 'Quero saber mais',
  headline text DEFAULT 'Economize na sua conta de luz com energia compartilhada',
  subheadline text DEFAULT 'Sem obras, sem instalação. Apenas economia garantida todo mês.',
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Public can read active profiles by slug
CREATE POLICY "Public can view active profiles"
  ON public.usuarios FOR SELECT
  USING (ativo = true);

CREATE POLICY "Admins can view all profiles"
  ON public.usuarios FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.usuarios FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.usuarios FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert profiles"
  ON public.usuarios FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR auth.uid() = id);

-- Leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  email text,
  usuario_id uuid REFERENCES public.usuarios(id) ON DELETE SET NULL,
  slug_origem text,
  origem text DEFAULT 'pagina_publica',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Members view their own leads"
  ON public.leads FOR SELECT TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Admins view all leads"
  ON public.leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- user_roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nome, telefone, slug)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'telefone',
    COALESCE(NEW.raw_user_meta_data->>'slug', split_part(NEW.email, '@', 1) || '-' || substr(NEW.id::text, 1, 6))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'membro'))
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('fotos-perfil', 'fotos-perfil', true);

CREATE POLICY "Public read fotos-perfil"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'fotos-perfil');

CREATE POLICY "Auth users upload own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Auth users update own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Auth users delete own"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);
