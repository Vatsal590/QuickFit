import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";

export default function WeeklyInsightCard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [insight, setInsight] = useState<{ summary: string; week_start: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("weekly_insights" as any).select("summary, week_start").eq("user_id", user.id)
      .order("week_start", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => setInsight((data as any) ?? null));
  }, [user]);

  if (!insight) return null;
  return (
    <div className="glass-card p-6 mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-fitness-primary" />
        {t("Your weekly progress insight")}
      </h2>
      <p className="text-sm text-foreground whitespace-pre-wrap">{insight.summary}</p>
      <Link to="/memory-settings" className="mt-3 inline-block text-xs text-muted-foreground underline">{t("Get this by email")}</Link>
    </div>
  );
}
