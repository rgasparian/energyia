
DROP VIEW IF EXISTS public.usuarios_public;

CREATE VIEW public.usuarios_public
WITH (security_invoker = true)
AS
SELECT
  id, nome, slug, cidade, foto_url, video_url,
  whatsapp, instagram, pix,
  link_cta, link_externo_1, link_externo_2,
  texto_cta, headline, subheadline, ativo,
  link_ebook, link_cliente, link_guia, link_patrocinador,
  facebook, youtube, telefone, email
FROM public.usuarios
WHERE ativo = true;

GRANT SELECT ON public.usuarios_public TO anon, authenticated;
