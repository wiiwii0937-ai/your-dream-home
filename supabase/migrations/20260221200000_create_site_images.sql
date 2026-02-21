-- 網站圖片管理表：以 label 對應圖片用途（如：首頁大圖1）
CREATE TABLE public.site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- 所有人可讀（前台顯示圖片）
CREATE POLICY "Anyone can view site images"
  ON public.site_images FOR SELECT
  USING (true);

-- 僅管理員可新增、更新、刪除
CREATE POLICY "Admins can insert site images"
  ON public.site_images FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site images"
  ON public.site_images FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site images"
  ON public.site_images FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 更新時自動更新 updated_at
CREATE TRIGGER update_site_images_updated_at
  BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.site_images IS '網站各區塊圖片網址，以 label 標示用途（如：首頁大圖1）';
