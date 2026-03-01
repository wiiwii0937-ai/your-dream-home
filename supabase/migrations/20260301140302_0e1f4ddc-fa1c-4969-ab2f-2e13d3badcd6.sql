
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read site-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-images');

-- Admin upload
CREATE POLICY "Admin upload site-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'site-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Admin update
CREATE POLICY "Admin update site-images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'site-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Admin delete
CREATE POLICY "Admin delete site-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'site-images'
    AND public.has_role(auth.uid(), 'admin')
  );
