-- 允許任何人讀取圖片
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

-- 允許已登入的使用者上傳圖片
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- 允許已登入的使用者修改與刪除圖片
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');
