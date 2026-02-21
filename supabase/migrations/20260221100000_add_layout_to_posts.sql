-- Add layout column for post display style (frontend 排版)
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS layout TEXT DEFAULT 'default';

COMMENT ON COLUMN public.posts.layout IS 'Display layout: default, hero, sidebar, fullwidth';
