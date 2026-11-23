CREATE TABLE public.training_memory_notes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, fact_key text NOT NULL, kind text NOT NULL CHECK (kind IN ('workout','meal','weight','pain','difficulty','goal','preference','plan')), text text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 1200), occurred_at timestamptz NOT NULL, synced_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,fact_key));
GRANT SELECT ON public.training_memory_notes TO authenticated;
GRANT ALL ON public.training_memory_notes TO service_role;
ALTER TABLE public.training_memory_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own training notes" ON public.training_memory_notes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX training_memory_notes_user_time ON public.training_memory_notes(user_id, occurred_at DESC);
CREATE TRIGGER training_memory_notes_timestamp BEFORE UPDATE ON public.training_memory_notes FOR EACH ROW EXECUTE FUNCTION public.coach_context_updated_at();