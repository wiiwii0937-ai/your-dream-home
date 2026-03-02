-- Add unique constraint on section_key for upsert support
ALTER TABLE public.site_sections ADD CONSTRAINT site_sections_section_key_unique UNIQUE (section_key);