ALTER TABLE public.user_activity_logs
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT;

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_region ON public.user_activity_logs(region);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_city ON public.user_activity_logs(city);