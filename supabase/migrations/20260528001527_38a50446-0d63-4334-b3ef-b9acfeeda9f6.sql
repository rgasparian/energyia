
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS link_ebook text DEFAULT 'https://pay.kiwify.com.br/metodo-energyia',
  ADD COLUMN IF NOT EXISTS link_cliente text DEFAULT 'https://energyia.club/cliente',
  ADD COLUMN IF NOT EXISTS link_guia text DEFAULT 'https://drive.google.com/file/d/1nY0fsDej0AeKmdz-RxjgnAIX35KgZZiO/view?usp=sharing',
  ADD COLUMN IF NOT EXISTS link_patrocinador text DEFAULT 'https://matrixenergia.com.br/cadastro',
  ADD COLUMN IF NOT EXISTS facebook text,
  ADD COLUMN IF NOT EXISTS youtube text;
