-- Create site_content table for dynamic homepage sections
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    title TEXT,
    content JSONB,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access to site content
CREATE POLICY "Allow public read-only access" ON public.site_content
    FOR SELECT USING (true);

-- Allow authenticated users with admin role/email to manage site content
-- Replace with actual admin email or role check as needed
CREATE POLICY "Allow admin to manage site content" ON public.site_content
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'jordan.tsai@gmail.com' -- Example admin email based on previous context if available, otherwise adjust
        OR EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            -- Add more complex role checks here if needed
        )
    );

-- Add some initial seed data comments
-- INSERT INTO public.site_content (section_key, title, content) 
-- VALUES ('about', '關於築安心', '{"hero": {"titlePrefix": "關於", "titleHighlight": "築安心"}}'::jsonb);
