
-- site_sections: stores each page section's content as JSONB
CREATE TABLE public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view sections" ON public.site_sections FOR SELECT USING (true);
CREATE POLICY "Admins can insert sections" ON public.site_sections FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sections" ON public.site_sections FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sections" ON public.site_sections FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- project_items: individual project entries
CREATE TABLE public.project_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  description text,
  location text,
  area text,
  main_image_url text,
  fb_link text,
  project_date text,
  link text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view projects" ON public.project_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.project_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- project_images: multi-image per project
CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.project_items(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  caption text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view project images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage project images" ON public.project_images FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- progress_items: project progress tracking
CREATE TABLE public.progress_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  start_date text,
  estimated_completion text,
  progress int DEFAULT 0,
  current_phase text,
  updates jsonb DEFAULT '[]',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.progress_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view progress" ON public.progress_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage progress" ON public.progress_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Validation trigger for progress (0-100)
CREATE OR REPLACE FUNCTION public.validate_progress_value()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.progress < 0 OR NEW.progress > 100 THEN
    RAISE EXCEPTION 'Progress must be between 0 and 100';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_progress_before_insert_update
  BEFORE INSERT OR UPDATE ON public.progress_items
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_progress_value();

-- Updated_at triggers
CREATE TRIGGER update_site_sections_updated_at
  BEFORE UPDATE ON public.site_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_items_updated_at
  BEFORE UPDATE ON public.project_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_items_updated_at
  BEFORE UPDATE ON public.progress_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
