
ALTER TABLE public.images_management
  ADD COLUMN IF NOT EXISTS usage_key text,
  ADD COLUMN IF NOT EXISTS url text,
  ADD COLUMN IF NOT EXISTS label text,
  ADD COLUMN IF NOT EXISTS storage_path text;

CREATE INDEX IF NOT EXISTS idx_images_management_usage_key ON public.images_management(usage_key);
