-- 1. 補齊所有缺失的欄位
ALTER TABLE images_management ADD COLUMN IF NOT EXISTS usage_key TEXT;
ALTER TABLE images_management ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE images_management ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE images_management ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- 2. 強制重新整理 Supabase 的 API 快取 (非常重要！)
NOTIFY pgrst, 'reload schema';

-- 開啟 RLS
ALTER TABLE images_management ENABLE ROW LEVEL SECURITY;

-- 允許任何人讀取圖片資訊
CREATE POLICY "Allow public read" 
ON images_management FOR SELECT 
USING (true);

-- 允許已登入用戶進行所有操作 (更換、刪除、匯入)
CREATE POLICY "Allow auth all" 
ON images_management FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
