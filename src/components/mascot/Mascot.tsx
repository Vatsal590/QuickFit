import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getLiveWorkout, subscribeLiveWorkout, type LiveWorkout } from "@/lib/workoutContext";
import { X, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { MASCOT } from "@/config/mascot";
import { memoryStatus } from "@/lib/memory";
import { getCoachContext, clearCoachContext } from '@/lib/coachContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MascotAvatar from "./MascotAvatar";

type Msg = { role: "user" | "bot"; text: string; question?: string; voted?: 1 | -1; voteable?: boolean; human?: boolean };
type Tab = "help" | "coach" | "workout";
const MIN_INTERVAL_MS = 1500; // debounce: never fire calls in quick succession

const rid = () => crypto.randomUUID().replace(/-/g, "");

export default function Mascot() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("help");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [help, setHelp] = useState<Msg[]>([]);
  const [coach, setCoach] = useState<Msg[]>([]);
  const [consented, setConsented] = useState<boolean | null>(null);
  const [live, setLive] = useState<LiveWorkout>(getLiveWorkout());
  const [workoutMsgs, setWorkoutMsgs] = useState<Msg[]>([]);
  const [bubble, setBubble] = useState<string | null>(null);
  const lastTipFor = useRef<string | null>(null);
  const { pathname } = useLocation();
  const lastSend = useRef(0);
  const greeted = useRef<string | null>(null);
  const session = useRef(rid());
  const account = useRef(user?.id);
  const previousAccount = useRef(user?.id);
  account.current = user?.id;
  const endRef = useRef<HTMLDivElement>(null);

  const msgs = tab === "help" ? help : tab === "coach" ? coach : workoutMsgs;
  const setterFor = (k: Tab) => (k === "help" ? setHelp : k === "coach" ? setCoach : setWorkoutMsgs);

  useEffect(() => subscribeLiveWorkout(setLive), []);
  useEffect(() => { if (!live && tab === "workout") setTab(user ? 'coach' : 'help'); }, [live, tab, user]);
  useEffect(() => { if (live && user) setTab('workout'); }, [live?.title, user?.id]);
  useEffect(() => { if (user && (pathname.includes('food') || pathname.includes('diet'))) setTab('coach'); }, [pathname, user?.id]);

  // Live coaching: one tip each time the user opens a new exercise of their generated workout.
  useEffect(() => {
    if (previousAccount.current === user?.id) return;
    previousAccount.current = user?.id;
    const ex = live?.exercise;
    if (!user || !live || !ex || lastTipFor.current === ex.name) return;
    lastTipFor.current = ex.name;
    const id = setTimeout(async () => {
      const uid = user.id;
      const { data } = await supabase.functions.invoke("mascot", { body: { action: "workout_tip", workout: live.title, exercise: ex.name, detail: ex.detail, context: getCoachContext(), sessionId: session.current, turnId: rid(), language } });
      if (!data?.tip || account.current !== uid) return;
      setWorkoutMsgs((m) => [...m, { role: "bot", text: `${ex.name}: ${data.tip}` }]);
      setBubble(data.tip);
    }, 800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, user]);

  // Landing page: gently invite visitors to ask a question (once per visit).
  useEffect(() => {
    if (pathname !== "/" || user || open || sessionStorage.getItem("mascot-invited")) return;
    const id = setTimeout(() => { setBubble(t("Hi! Got a question about QuickFit? Ask me!")); sessionStorage.setItem("mascot-invited", "1"); }, 3000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user, open]);
  useEffect(() => { if (open) setBubble(null); }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length, busy]);
  useEffect(() => {
    setHelp([]); setCoach([]); setWorkoutMsgs([]); setBubble(null); setConsented(null);
    greeted.current = null; lastTipFor.current = null; session.current = rid();
    clearCoachContext(); setLive(null); setTab(user ? 'coach' : 'help');
  }, [user?.id]);

  useEffect(() => {
    if (!open) return;
    if (help.length === 0) setHelp([{ role: "bot", text: t("Hi! I'm {name}. Ask me anything about QuickFit.").replace("{name}", MASCOT.name) }]);
    if (user && greeted.current !== user.id) {
      greeted.current = user.id;
      supabase.functions.invoke("mascot", { body: { action: "greet", language } }).then(({ data }) => {
        if (data?.greeting && account.current === user.id) setHelp((m) => [...m, { role: "bot", text: data.greeting }]);
      });
      memoryStatus().then((s) => setConsented(!!s?.consented));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  async function send() {
    const q = input.trim();
    if (!q || busy || Date.now() - lastSend.current < MIN_INTERVAL_MS) return;
    lastSend.current = Date.now();
    setInput("");
    const uid = user?.id;
    const context = getCoachContext();
    const history = msgs.slice(-12).map(({ role, text }) => ({ role, text: text.slice(0, 6000) }));
    const add = (m: Msg) => { if (account.current === uid) setterFor(tab)((prev) => [...prev, m]); };
    add({ role: "user", text: q });
    setBusy(true);
    try {
      if (tab === "help") {
        const { data } = await supabase.functions.invoke("mascot", { body: { action: "ask", message: q, language } });
        if (data?.status === "ok" && data.answer) add({ role: "bot", text: data.answer, question: q, voteable: true });
        else if (data?.status === "unknown") add({ role: "bot", text: t("I don't know that one yet. Would you like to ask a human?"), question: q, voteable: true, human: true });
        else add({ role: "bot", text: t("Sorry, I can't remember right now. Please try again in a moment."), human: true });
      } else if (tab === "workout") {
        const ex = live?.exercise;
        const { data } = await supabase.functions.invoke("mascot", { body: { action: "workout_tip", workout: live?.title ?? "", exercise: ex?.name ?? "", detail: ex?.detail ?? "", question: q, context, history, sessionId: session.current, turnId: rid(), language } });
        add({ role: "bot", text: data?.tip ?? t("The coach is unavailable right now. Please try again in a moment.") });
      } else {
        const { data, error } = await supabase.functions.invoke("coach", { body: { message: q, sessionId: session.current, turnId: rid(), context, history, language } });
        if (error || !data?.reply) add({ role: "bot", text: t("The coach is unavailable right now. Please try again in a moment.") });
        else add({ role: "bot", text: data.reply + (data.memory === "unavailable" ? `\n\n(${t("I'm using your current context and saved records; long-term recall is unavailable right now.")})` : "") });
      }
    } catch {
      add({ role: "bot", text: t("Sorry, I can't remember right now. Please try again in a moment."), human: true });
    } finally {
      setBusy(false);
    }
  }

  function vote(i: number, v: 1 | -1) {
    const m = help[i];
    if (!m?.voteable || m.voted) return;
    setHelp((prev) => prev.map((x, j) => (j === i ? { ...x, voted: v } : x)));
    supabase.functions.invoke("mascot", { body: { action: "vote", question: m.question ?? "", answer: m.text, vote: v } });
  }

  const mail = `mailto:${MASCOT.supportEmail}`;

  return (
    <>
      {open && (
        <div className="fixed z-50 bottom-24 right-4 w-[calc(100vw-2rem)] max-w-sm h-[min(32rem,70vh)] flex flex-col rounded-3xl border border-border bg-background/90 backdrop-blur-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <MascotAvatar size={32} />
            <div className="flex-1 font-semibold">{MASCOT.name}</div>
            <button onClick={() => setOpen(false)} aria-label={t("Close")} className="rounded-full p-1.5 hover:bg-muted active:scale-95"><X className="h-4 w-4" /></button>
          </div>
          {user && (
            <div className="flex gap-1 p-2 border-b border-border">
              {((live ? ["help", "workout", "coach"] : ["help", "coach"]) as Tab[]).map((k) => (
                <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-xl py-1.5 text-sm font-medium active:scale-95 ${tab === k ? "bg-fitness-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  {k === "help" ? t("Ask {name}").replace("{name}", MASCOT.name) : k === "workout" ? t("Live workout") : t("AI Coach")}
                </button>
              ))}
            </div>
          )}
          {tab === "workout" && msgs.length === 0 && (
            <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/50">{t("Open an exercise and I'll give you tips as you go. Ask me anything about this workout.")}</div>
          )}
          {tab !== "help" && (
            <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/50">
              {t("Advice is general fitness guidance, not medical advice. For pain or health conditions, please see a professional.")}
              {consented === false && (<> {" "}<Link to="/memory-settings" className="underline" onClick={() => setOpen(false)}>{t("Turn on memory so the coach remembers you.")}</Link></>)}
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {user && tab !== 'help' && !busy && (
              <div className="flex flex-wrap gap-1">
                <Button size="sm" variant="outline" onClick={() => { setTab('coach'); setInput(t(live ? 'Suggest an alternative with my equipment' : pathname.includes('food') || pathname.includes('diet') ? 'Suggest a meal that fits my goals' : 'Help me plan my next week')); }} className="whitespace-normal h-auto py-2 text-xs">
                  {t(live ? 'Suggest an alternative with my equipment' : pathname.includes('food') || pathname.includes('diet') ? 'Suggest a meal that fits my goals' : 'Help me plan my next week')}
                </Button>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-fitness-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {m.text}
                  {m.human && <div className="mt-1"><a href={mail} className="underline font-medium">{t("Ask a human")}</a></div>}
                  {tab === "help" && m.voteable && (
                    <div className="mt-1 flex gap-2 text-muted-foreground">
                      <button aria-label={t("Helpful")} disabled={!!m.voted} onClick={() => vote(i, 1)} className={m.voted === 1 ? "text-fitness-secondary" : "hover:text-foreground"}><ThumbsUp className="h-3.5 w-3.5" /></button>
                      <button aria-label={t("Not helpful")} disabled={!!m.voted} onClick={() => vote(i, -1)} className={m.voted === -1 ? "text-destructive" : "hover:text-foreground"}><ThumbsDown className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && <div className="text-sm text-muted-foreground px-2">{t("Thinking...")}</div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 p-3 border-t border-border">
            <Input value={input} onChange={(e) => setInput(e.target.value)} maxLength={tab === "help" ? 500 : 2000} placeholder={t("Type your question...")} disabled={busy} />
            <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label={t("Send")} className="active:scale-95"><Send className="h-4 w-4" /></Button>
          </form>
          <div className="px-4 pb-2 text-center text-xs"><a href={mail} className="text-muted-foreground underline">{t("Ask a human")}</a></div>
        </div>
      )}
      {bubble && !open && (
        <div className="fixed z-50 bottom-24 right-5 max-w-[16rem] rounded-2xl rounded-br-sm border border-border bg-background/90 backdrop-blur-xl shadow-xl px-3 py-2 text-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button onClick={() => { setOpen(true); if (live && user) setTab("workout"); }} className="text-left">{bubble}</button>
          <button onClick={() => setBubble(null)} aria-label={t("Close")} className="absolute -top-2 -left-2 rounded-full bg-muted p-0.5"><X className="h-3 w-3" /></button>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-label={t("Open {name}").replace("{name}", MASCOT.name)}
        className={`fixed z-50 bottom-5 right-5 rounded-full bg-background/80 backdrop-blur-xl border border-border shadow-lg p-1.5 transition-all hover:scale-110 active:scale-95 ${bubble && !open ? "animate-bounce" : ""}`}>
        <MascotAvatar size={48} />
      </button>
    </>
  );
}
