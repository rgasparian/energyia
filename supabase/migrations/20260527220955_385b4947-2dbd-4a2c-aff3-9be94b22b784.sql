-- Storage RLS policies for fotos-perfil bucket
CREATE POLICY "Authenticated users can select own objects"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can insert own objects"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can update own objects"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can delete own objects"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);