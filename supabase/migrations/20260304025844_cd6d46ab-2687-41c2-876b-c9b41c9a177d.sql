
CREATE TABLE public.consultation_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name text NOT NULL,
    phone text NOT NULL,
    line_id text,
    location text,
    estimated_pings text,
    budget_range text,
    estimated_construction_time text,
    special_requirements text,
    status text DEFAULT 'pending' NOT NULL
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert consultation requests"
ON public.consultation_requests
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view consultation requests"
ON public.consultation_requests
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update consultation requests"
ON public.consultation_requests
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete consultation requests"
ON public.consultation_requests
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
