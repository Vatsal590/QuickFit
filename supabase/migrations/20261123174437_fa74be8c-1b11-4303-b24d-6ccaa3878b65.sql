CREATE TABLE public.user_memory (
  user_id uuid PRIMARY KEY,
  entity_id text,
  consent_at timestamptz,
  email_insights_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_memory TO authenticated;
GRANT ALL ON public.user_memory TO service_role;
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own memory link" ON public.user_memory FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_user_memory_updated_at BEFORE UPDATE ON public.user_memory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.mascot_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  question text NOT NULL,
  answer text NOT NULL,
  vote smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.mascot_votes TO service_role;
ALTER TABLE public.mascot_votes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.weekly_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);
GRANT SELECT ON public.weekly_insights TO authenticated;
GRANT ALL ON public.weekly_insights TO service_role;
ALTER TABLE public.weekly_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own weekly insights" ON public.weekly_insights FOR SELECT TO authenticated USING (auth.uid() = user_id);