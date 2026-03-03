-- Add slug field for portfolio detail routing
ALTER TABLE public.project_items
ADD COLUMN IF NOT EXISTS slug text;

-- Ensure slug uniqueness when provided
CREATE UNIQUE INDEX IF NOT EXISTS project_items_slug_unique_idx
ON public.project_items (slug)
WHERE slug IS NOT NULL;

-- Helpful lookup index for detail page queries
CREATE INDEX IF NOT EXISTS project_items_display_order_idx
ON public.project_items (display_order);