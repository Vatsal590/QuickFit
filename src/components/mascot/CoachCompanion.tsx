import { ArrowUpRight, Brain, CalendarDays, Dumbbell, Footprints, ShieldCheck, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationContext";
import { MASCOT } from "@/config/mascot";
import type { LiveWorkout } from "@/lib/workoutContext";
import { presentationEquipment } from "@/lib/coachPresentation";
import MascotAvatar from "./MascotAvatar";

type Props = {
  signedIn: boolean;
  live: LiveWorkout;
  context: Record<string, Record<string, unknown>>;
  hasConversation: boolean;
  busy: boolean;
  onAsk: (question: string) => void;
  onClose: () => void;
};

export default function CoachCompanion({ signedIn, live, context, hasConversation, busy, onAsk, onClose }: Props) {
  const { t } = useTranslation();
  const equipment = presentationEquipment(live?.context);
  const activeFood = context.food;
  const activeDiet = context.diet;
  const actions = signedIn ? [
    { icon: Dumbbell, title: live ? "Adapt this exercise" : "Find my next workout", question: live ? "Suggest an alternative with my equipment" : "What workout fits my equipment and goals today?" },
    { icon: Utensils, title: "Find my next meal", question: "Suggest a meal that fits my goals" },
    { icon: CalendarDays, title: "Plan my next week", question: "Help me plan my next week" },
  ] : [
    { icon: Brain, title: "How does training memory work?", question: "How does Coach Q remember me?" },
    { icon: Dumbbell, title: "Find my next workout", question: "How do I use Instant Workout?" },
    { icon: Footprints, title: "Where should I start?", question: "What can I do with QuickFit?" },
  ];

  return (
    <>
      {!hasConversation && signedIn && (live || activeFood || activeDiet) && (
        <section className="border-l-2 border-fitness-secondary bg-fitness-secondary/5 px-4 py-3 space-y-1" aria-label={t("Current context")}>
          <div className="flex items-center gap-2 text-xs font-medium text-fitness-secondary"><span className="h-1.5 w-1.5 rounded-full bg-fitness-secondary motion-safe:animate-pulse" />{t(live ? "With you now" : "In focus")}</div>
          <p className="font-semibold text-sm break-words">{live?.exercise?.name ?? live?.title ?? t(activeFood ? "AI Food Tracker" : "Diet Plan")}</p>
          {live?.exercise?.detail && <p className="text-xs text-muted-foreground break-words">{live.exercise.detail}</p>}
          {equipment && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Dumbbell className="h-3.5 w-3.5 shrink-0" />{equipment.length ? equipment.map((e) => t(e.charAt(0).toUpperCase() + e.slice(1))).join(" · ") : t("No equipment")}</p>}
          {!live && <p className="text-xs text-muted-foreground">{t(activeFood ? "Nutrition estimates" : "Planned, not eaten")}</p>}
        </section>
      )}
      {!hasConversation && (
        <section className="pt-1 pb-1 text-center">
          <div className="relative mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-3xl bg-accent">
            <MascotAvatar size={56} />
            <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-fitness-secondary text-primary-foreground"><Brain className="h-3.5 w-3.5" /></span>
          </div>
          <p className="text-xs font-medium text-muted-foreground mb-1">{MASCOT.name}</p>
          <h3 className="text-xl font-semibold">{t(live ? "One rep at a time. I've got you." : "Let's make today count.")}</h3>
          {!signedIn && <Button variant="link" size="sm" asChild className="mt-1 text-sm"><Link to="/auth" onClick={onClose}>{t("Personalise my coach")}<ArrowUpRight className="h-3.5 w-3.5" /></Link></Button>}
        </section>
      )}
      {!busy && (
        <section className={hasConversation ? "pt-2" : "pt-1"} aria-label={t("Suggested next steps")}>
          {!hasConversation && <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><ShieldCheck className="h-3.5 w-3.5" />{t(signedIn ? "Your next move" : "Start here")}</div>}
          <div className={hasConversation ? "flex flex-wrap gap-1.5" : "divide-y divide-border"}>
            {actions.map(({ icon: Icon, title, question }) => (
              <Button key={title} variant={hasConversation ? "outline" : "ghost"} disabled={busy} onClick={() => onAsk(t(question))} className={hasConversation ? "h-auto py-2 px-2.5 text-xs whitespace-normal" : "w-full justify-start text-left px-2 h-auto min-h-12 py-3 rounded-lg whitespace-normal"}>
                <Icon className="h-4 w-4 text-fitness-primary shrink-0" />
                <span className="flex-1">{t(title)}</span>
                {!hasConversation && <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
              </Button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}