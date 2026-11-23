CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No client access to app settings" ON public.app_settings FOR SELECT TO authenticated USING (false);
CREATE POLICY "No client access to mascot votes" ON public.mascot_votes FOR SELECT TO authenticated USING (false);