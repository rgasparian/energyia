CREATE OR REPLACE VIEW public.usuarios_public AS
SELECT id, nome, slug, cidade, foto_url, video_url, whatsapp, instagram, pix,
       link_cta, link_externo_1, link_externo_2, texto_cta, headline, subheadline, ativo
FROM public.usuarios
WHERE ativo = true;

ALTER VIEW public.usuarios_public SET (security_invoker = true);
GRANT SELECT ON public.usuarios_public TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view active profiles" ON public.usuarios;

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins select roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

CREATE POLICY "Public can submit leads to active profiles" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    usuario_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.usuarios u WHERE u.id = leads.usuario_id AND u.ativo = true)
    AND char_length(nome) BETWEEN 1 AND 200
    AND char_length(telefone) BETWEEN 3 AND 50
    AND (email IS NULL OR char_length(email) <= 255)
  );

DROP POLICY IF EXISTS "Public read fotos-perfil" ON storage.objects;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;