CREATE TABLE public.coach_context (user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, scope text NOT NULL CHECK (scope IN ('instant','plan','food','diet')), snapshot jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (octet_length(snapshot::text) <= 65536), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id, scope));
GRANT SELECT ON public.coach_context TO authenticated;
GRANT ALL ON public.coach_context TO service_role;
ALTER TABLE public.coach_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own coach context" ON public.coach_context FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE FUNCTION public.coach_context_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER coach_context_timestamp BEFORE UPDATE ON public.coach_context FOR EACH ROW EXECUTE FUNCTION public.coach_context_updated_at();