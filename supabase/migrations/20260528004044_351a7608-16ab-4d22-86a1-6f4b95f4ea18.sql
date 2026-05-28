DROP VIEW IF EXISTS public.usuarios_public;

CREATE VIEW public.usuarios_public
WITH (security_invoker = true)
AS
SELECT
  id,
  nome,
  slug,
  cidade,
  foto_url,
  video_url,
  whatsapp,
  instagram,
  pix,
  link_cta,
  link_externo_1,
  link_externo_2,
  texto_cta,
  headline,
  subheadline,
  ativo,
  link_ebook,
  link_cliente,
  link_guia,
  link_patrocinador,
  facebook,
  youtube,
  telefone,
  email
FROM public.usuarios
WHERE ativo = true
  AND slug IS NOT NULL;

GRANT SELECT ON public.usuarios_public TO anon, authenticated;
GRANT ALL ON public.usuarios_public TO service_role;

GRANT SELECT (
  id,
  nome,
  slug,
  cidade,
  foto_url,
  video_url,
  whatsapp,
  instagram,
  pix,
  link_cta,
  link_externo_1,
  link_externo_2,
  texto_cta,
  headline,
  subheadline,
  ativo,
  link_ebook,
  link_cliente,
  link_guia,
  link_patrocinador,
  facebook,
  youtube,
  telefone,
  email
) ON public.usuarios TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view active consultant landing profiles" ON public.usuarios;
CREATE POLICY "Public can view active consultant landing profiles"
ON public.usuarios
FOR SELECT
TO anon, authenticated
USING (ativo = true AND slug IS NOT NULL);