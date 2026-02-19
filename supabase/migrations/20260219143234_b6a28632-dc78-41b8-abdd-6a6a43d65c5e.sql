
-- Create images_management table
CREATE TABLE public.images_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.images_management ENABLE ROW LEVEL SECURITY;

-- Only admins can manage images
CREATE POLICY "Admins can view all images"
ON public.images_management FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert images"
ON public.images_management FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update images"
ON public.images_management FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete images"
ON public.images_management FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public read for displaying on website
CREATE POLICY "Anyone can view images"
ON public.images_management FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_images_management_updated_at
BEFORE UPDATE ON public.images_management
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create website_images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('website-images', 'website-images', true);

-- Storage policies
CREATE POLICY "Anyone can view website images"
ON storage.objects FOR SELECT
USING (bucket_id = 'website-images');

CREATE POLICY "Admins can upload website images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'website-images');

CREATE POLICY "Admins can update website images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'website-images');

CREATE POLICY "Admins can delete website images"
ON storage.objects FOR DELETE
USING (bucket_id = 'website-images');
