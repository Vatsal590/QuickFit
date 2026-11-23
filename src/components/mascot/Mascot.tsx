import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getLiveWorkout, subscribeLiveWorkout, type LiveWorkout } from "@/lib/workoutContext";
import { X, ThumbsUp, ThumbsDown, Brain, ArrowUp, ShieldCheck, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { MASCOT } from "@/config/mascot";
import { memoryStatus } from "@/lib/memory";
import { getCoachContext, clearCoachContext } from '@/lib/coachContext';
import { Button } from "@/components/ui/button";
import MascotAvatar from "./MascotAvatar";
import CoachCompanion from "./CoachCompanion";
import { memoryPresentation } from "@/lib/coachPresentation";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse, MessageActions } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { routeCoachQuestion, type CoachRoute } from "@/lib/coachRouting";

type Msg = { role: "user" | "bot"; text: string; question?: string; voted?: 1 | -1; voteable?: boolean; human?: boolean };
const MIN_INTERVAL_MS = 1500; // debounce: never fire calls in quick succession

const rid = () => crypto.randomUUID().replace(/-/g, "");

export default function Mascot() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const previousRoute = useRef<CoachRoute>();
  const sending = useRef(false);
  const [consented, setConsented] = useState<boolean | null>(null);
  const [live, setLive] = useState<LiveWorkout>(getLiveWorkout());
  const [bubble, setBubble] = useState<string | null>(null);
  const lastTipFor = useRef<string | null>(null);
  const { pathname } = useLocation();
  const lastSend = useRef(0);
  const [recallUnavailable, setRecallUnavailable] = useState(false);
  const session = useRef(rid());
  const account = useRef(user?.id);
  const previousAccount = useRef(user?.id);
  account.current = user?.id;

  useEffect(() => subscribeLiveWorkout(setLive), []);

  // Live coaching: one tip each time the user opens a new exercise of their generated workout.
  useEffect(() => {
    const ex = live?.exercise;
    if (!user || !live || !ex || lastTipFor.current === ex.name) return;
    const id = setTimeout(async () => {
      if (sending.current) return;
      lastTipFor.current = ex.name;
      const uid = user.id;
      const { data } = await supabase.functions.invoke("mascot", { body: { action: "workout_tip", workout: live.title, exercise: ex.name, detail: ex.detail, context: getCoachContext(), sessionId: session.current, turnId: rid(), language } });
      if (!data?.tip || account.current !== uid) return;
      setMsgs((m) => [...m, { role: "bot", text: `${ex.name}: ${data.tip}` }]);
      setBubble(data.tip);
    }, 800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, user]);

  // Landing page: gently invite visitors to ask a question (once per visit).
  useEffect(() => {
    if (pathname !== "/" || user || open || sessionStorage.getItem("mascot-invited")) return;
    const id = setTimeout(() => { setBubble(t("Your next workout, your next meal, your next move. Meet Coach Q.")); sessionStorage.setItem("mascot-invited", "1"); }, 3000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user, open]);
  useEffect(() => { if (open) setBubble(null); }, [open]);

  useEffect(() => {
    if (open && !busy) document.querySelector<HTMLTextAreaElement>(".coach-q-panel textarea")?.focus({ preventScroll: true });
  }, [open, busy]);
  useEffect(() => {
    if (previousAccount.current === user?.id) return;
    previousAccount.current = user?.id;
    setMsgs([]); setBubble(null); setConsented(null); setBusy(false); sending.current = false;
    previousRoute.current = undefined;
    setRecallUnavailable(false); lastTipFor.current = null; session.current = rid();
    clearCoachContext(); setLive(null);
  }, [user?.id]);

  useEffect(() => {
    if (!open || !user) return;
    const uid = user.id;
    memoryStatus().then((s) => {
      if (account.current === uid) setConsented(s ? s.consented : null);
    }).catch(() => {});
  }, [open, user]);

  async function send(question = input) {
    const q = question.trim();
    if (!q || sending.current || busy || Date.now() - lastSend.current < MIN_INTERVAL_MS) return;
    lastSend.current = Date.now();
    setInput("");
    const uid = user?.id;
    const context = getCoachContext();
    const route = routeCoachQuestion(q, { signedIn: !!user, liveWorkout: !!live, previous: previousRoute.current });
    previousRoute.current = route;
    const requestSession = session.current;
    const history = msgs.slice(-12).map(({ role, text }) => ({ role, text: text.slice(0, 6000) }));
    const add = (m: Msg) => { if (account.current === uid && session.current === requestSession) setMsgs((prev) => [...prev, m]); };
    add({ role: "user", text: q });
    sending.current = true;
    setBusy(true);
    try {
      if (route === "help") {
        const { data } = await supabase.functions.invoke("mascot", { body: { action: "ask", message: q.slice(0, 500), language } });
        if (data?.status === "ok" && data.answer) add({ role: "bot", text: data.answer, question: q, voteable: true });
        else if (data?.status === "unknown") add({ role: "bot", text: t("I don't know that one yet. Would you like to ask a human?"), question: q, voteable: true, human: true });
        else add({ role: "bot", text: t("Sorry, I can't remember right now. Please try again in a moment."), human: true });
      } else if (route === "workout") {
        const ex = live?.exercise;
        const { data } = await supabase.functions.invoke("mascot", { body: { action: "workout_tip", workout: live?.title ?? "", exercise: ex?.name ?? "", detail: ex?.detail ?? "", question: q, context, history, sessionId: session.current, turnId: rid(), language } });
        if (account.current === uid && session.current === requestSession && data?.memory) setRecallUnavailable(data.memory === "unavailable");
        add({ role: "bot", text: data?.tip ?? t("The coach is unavailable right now. Please try again in a moment.") });
      } else {
        const { data, error } = await supabase.functions.invoke("coach", { body: { message: q, sessionId: session.current, turnId: rid(), context, history, language } });
        if (account.current === uid && session.current === requestSession && data?.memory) setRecallUnavailable(data.memory === "unavailable");
        if (error || !data?.reply) add({ role: "bot", text: t("The coach is unavailable right now. Please try again in a moment.") });
        else add({ role: "bot", text: data.reply + (data.memory === "unavailable" ? `\n\n(${t("I'm using your current context and saved records; long-term recall is unavailable right now.")})` : "") });
      }
    } catch {
      add({ role: "bot", text: t("Sorry, I can't remember right now. Please try again in a moment."), human: true });
    } finally {
      if (session.current === requestSession) { sending.current = false; setBusy(false); }
    }
  }

  function vote(i: number, v: 1 | -1) {
    const m = msgs[i];
    if (!m?.voteable || m.voted) return;
    setMsgs((prev) => prev.map((x, j) => (j === i ? { ...x, voted: v } : x)));
    supabase.functions.invoke("mascot", { body: { action: "vote", question: (m.question ?? "").slice(0, 500), answer: m.text.slice(0, 2000), vote: v } });
  }

  const mail = `mailto:${MASCOT.supportEmail}`;
  const memoryState = memoryPresentation(consented, recallUnavailable);
  const context = getCoachContext();
  const hasConversation = msgs.length > 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const memoryLabel = !user ? "Optional memory" : memoryState === "enabled" ? "Memory on" : memoryState === "off" ? "Memory off" : memoryState === "unavailable" ? "Recall unavailable" : "Memory status unknown";

  return (
    <>
      {open && (
        <div role="dialog" aria-label={t("Ask {name}").replace("{name}", MASCOT.name)} className="coach-q-panel fixed z-50 bottom-24 right-4 w-[calc(100vw-2rem)] max-w-[26rem] h-[min(40rem,calc(100dvh-7rem))] flex flex-col rounded-3xl border border-border bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden motion-safe:animate-in motion-safe:slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 px-5 py-4 shrink-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent"><MascotAvatar size={40} /></div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base break-words">{t("Ask {name}").replace("{name}", MASCOT.name)}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t("Your AI training companion")}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label={t("Close")} className="h-8 w-8 rounded-full shrink-0"><X className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-center justify-between gap-2 px-5 py-2.5 bg-muted/50 border-y border-border text-xs shrink-0">
            <Link to={user ? "/memory-settings" : "/auth"} onClick={() => setOpen(false)} className="flex items-center gap-1.5 hover:text-primary min-w-0" title={t("Memory settings")}>
              <Brain className={`h-3.5 w-3.5 shrink-0 ${memoryState === "enabled" ? "text-fitness-secondary" : "text-muted-foreground"}`} />
              <span className="break-words">{t(memoryLabel)}</span><ChevronDown className="h-3 w-3 shrink-0" />
            </Link>
            <span className="flex items-center gap-1.5 text-muted-foreground shrink-0"><ShieldCheck className="h-3.5 w-3.5" />{t("You're in control")}</span>
          </div>
          <Conversation className="min-h-0 flex-1" initial={hasConversation ? reducedMotion ? "instant" : "smooth" : false} resize={reducedMotion ? "instant" : "smooth"}>
            <ConversationContent className="px-5 py-4 gap-5">
              {!hasConversation && <CoachCompanion signedIn={!!user} live={live} context={context} hasConversation={false} busy={busy} onAsk={(q) => { void send(q); }} onClose={() => setOpen(false)} />}
              {hasConversation && user && live && <div className="flex items-center gap-2 text-xs text-fitness-secondary"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fitness-secondary" /><span className="break-words">{t("With you now")}: {live.exercise?.name ?? live.title}</span></div>}
              {msgs.map((m, i) => (
                <Message key={i} from={m.role === "user" ? "user" : "assistant"} className={m.role === "bot" ? "max-w-full" : "max-w-[90%]"}>
                  {m.role === "bot" && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MascotAvatar size={20} /><span>{MASCOT.name}</span></div>}
                  <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:rounded-2xl break-words leading-relaxed">
                    {m.role === "bot" ? <MessageResponse controls={false}>{m.text}</MessageResponse> : <p className="whitespace-pre-wrap">{m.text}</p>}
                    {m.human && <a href={mail} className="underline text-sm">{t("Ask a human")}</a>}
                  </MessageContent>
                  {m.voteable && <MessageActions>
                    <Button variant="ghost" size="icon-sm" aria-label={t("Helpful")} title={t("Helpful")} disabled={!!m.voted} onClick={() => vote(i, 1)} className={m.voted === 1 ? "text-fitness-secondary" : "text-muted-foreground"}><ThumbsUp className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label={t("Not helpful")} title={t("Not helpful")} disabled={!!m.voted} onClick={() => vote(i, -1)} className={m.voted === -1 ? "text-destructive" : "text-muted-foreground"}><ThumbsDown className="h-3.5 w-3.5" /></Button>
                  </MessageActions>}
                </Message>
              ))}
              {busy && <div role="status" className="flex items-center gap-2 text-sm"><MascotAvatar size={24} /><Shimmer>{t(previousRoute.current === "workout" ? "Considering your workout..." : "Thinking...")}</Shimmer></div>}
              {hasConversation && !busy && user && <CoachCompanion signedIn live={live} context={context} hasConversation busy={false} onAsk={(q) => { void send(q); }} onClose={() => setOpen(false)} />}
            </ConversationContent>
            {hasConversation && <ConversationScrollButton aria-label={t("Latest message")} />}
          </Conversation>
          <div className="px-4 pt-3 pb-2 shrink-0 border-t border-border bg-background/70">
            <PromptInput onSubmit={({ text }) => send(text)} maxFiles={0} className="[&>[data-slot=input-group]]:rounded-2xl [&>[data-slot=input-group]]:bg-muted/50">
              <PromptInputTextarea autoFocus value={input} onChange={(e) => setInput(e.target.value)} maxLength={user ? 2000 : 500} placeholder={t(user ? live ? "Ask about this exercise..." : "What's your next move?" : "Ask about QuickFit...")} aria-label={t("Type your question...")} disabled={busy} className="min-h-12 max-h-24 px-3 py-3" />
              <PromptInputFooter className="px-3 pb-2 pt-0 justify-between">
                <span className="text-xs text-muted-foreground">{t(user && live ? "Current workout attached" : "Ask Coach Q")}</span>
                <PromptInputSubmit status={busy ? "submitted" : "ready"} disabled={busy || !input.trim()} aria-label={t("Send")} className="h-8 w-8 rounded-full" children={busy ? undefined : <ArrowUp className="h-4 w-4" />} />
              </PromptInputFooter>
            </PromptInput>
            <div className="flex items-start justify-between gap-3 px-1 pt-2 text-xs text-muted-foreground">
              {user ? <details className="min-w-0"><summary className="cursor-pointer">{t("Fitness guidance, not medical advice")}</summary><p className="pt-2 pb-1">{t("Advice is general fitness guidance, not medical advice. For pain or health conditions, please see a professional.")}</p></details> : <span>{t("Memory is your choice")}</span>}
              <a href={mail} className="underline shrink-0">{t("Ask a human")}</a>
            </div>
          </div>
        </div>
      )}
      {bubble && !open && (
        <div className="fixed z-50 bottom-24 right-5 max-w-[16rem] rounded-2xl rounded-br-sm border border-border bg-background/95 backdrop-blur-xl shadow-xl px-4 py-3 text-sm motion-safe:animate-in motion-safe:fade-in duration-300">
          <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-primary"><Brain className="h-3.5 w-3.5" />{MASCOT.name}</div>
          <Button variant="ghost" onClick={() => setOpen(true)} className="text-left whitespace-normal h-auto p-0 justify-start font-normal">{bubble}</Button>
          <Button variant="secondary" size="icon" onClick={() => setBubble(null)} aria-label={t("Close")} className="absolute -top-2 -left-2 h-6 w-6 rounded-full"><X className="h-3 w-3" /></Button>
        </div>
      )}
      <Button variant="ghost" onClick={() => setOpen((o) => !o)} aria-label={t("Ask {name}").replace("{name}", MASCOT.name)}
        className="fixed z-50 bottom-5 right-5 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg h-16 w-16 p-1.5 [&>svg]:!size-12 transition-transform hover:scale-105 active:scale-95">
        <MascotAvatar size={48} />
        <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center"><Brain className="h-3 w-3" /></span>
      </Button>
    </>
  );
}
