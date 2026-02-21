-- Add usage_key column to images_management for site image slot mapping
ALTER TABLE public.images_management 
ADD COLUMN IF NOT EXISTS usage_key TEXT;

-- Unique constraint: one image per usage_key
CREATE UNIQUE INDEX IF NOT EXISTS idx_images_management_usage_key 
ON public.images_management (usage_key) 
WHERE usage_key IS NOT NULL;
