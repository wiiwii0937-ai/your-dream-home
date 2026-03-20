
CREATE TABLE public.user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  action_type text NOT NULL DEFAULT 'click',
  page_path text NOT NULL,
  duration_seconds integer,
  click_target text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous tracking)
CREATE POLICY "Anyone can insert activity logs"
ON public.user_activity_logs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view activity logs"
ON public.user_activity_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete activity logs"
ON public.user_activity_logs FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
