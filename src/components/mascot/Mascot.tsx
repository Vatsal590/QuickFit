import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { MASCOT } from "@/config/mascot";
import { memoryStatus } from "@/lib/memory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MascotAvatar from "./MascotAvatar";

type Msg = { role: "user" | "bot"; text: string; question?: string; voted?: 1 | -1; voteable?: boolean; human?: boolean };
type Tab = "help" | "coach";
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
  const lastSend = useRef(0);
  const greeted = useRef<string | null>(null);
  const session = useRef(rid());
  const endRef = useRef<HTMLDivElement>(null);

  const msgs = tab === "help" ? help : coach;
  const setMsgs = tab === "help" ? setHelp : setCoach;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length, busy]);
  useEffect(() => { if (!user) { setTab("help"); setCoach([]); setConsented(null); greeted.current = null; } }, [user]);

  useEffect(() => {
    if (!open) return;
    if (help.length === 0) setHelp([{ role: "bot", text: t("Hi! I'm {name}. Ask me anything about QuickFit.").replace("{name}", MASCOT.name) }]);
    if (user && greeted.current !== user.id) {
      greeted.current = user.id;
      supabase.functions.invoke("mascot", { body: { action: "greet", language } }).then(({ data }) => {
        if (data?.greeting) setHelp((m) => [...m, { role: "bot", text: data.greeting }]);
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
    const add = (m: Msg) => (tab === "help" ? setHelp : setCoach)((prev) => [...prev, m]);
    add({ role: "user", text: q });
    setBusy(true);
    try {
      if (tab === "help") {
        const { data } = await supabase.functions.invoke("mascot", { body: { action: "ask", message: q, language } });
        if (data?.status === "ok" && data.answer) add({ role: "bot", text: data.answer, question: q, voteable: true });
        else if (data?.status === "unknown") add({ role: "bot", text: t("I don't know that one yet. Would you like to ask a human?"), question: q, voteable: true, human: true });
        else add({ role: "bot", text: t("Sorry, I can't remember right now. Please try again in a moment."), human: true });
      } else {
        const { data, error } = await supabase.functions.invoke("coach", { body: { message: q, sessionId: session.current, turnId: rid(), language } });
        if (error || !data?.reply) add({ role: "bot", text: t("The coach is unavailable right now. Please try again in a moment.") });
        else add({ role: "bot", text: data.reply + (data.memory === "unavailable" ? `\n\n(${t("I can't remember your history right now, so this is general advice.")})` : "") });
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
              {(["help", "coach"] as Tab[]).map((k) => (
                <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-xl py-1.5 text-sm font-medium active:scale-95 ${tab === k ? "bg-fitness-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  {k === "help" ? t("Ask {name}").replace("{name}", MASCOT.name) : t("AI Coach")}
                </button>
              ))}
            </div>
          )}
          {tab === "coach" && (
            <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/50">
              {t("Advice is general fitness guidance, not medical advice. For pain or health conditions, please see a professional.")}
              {consented === false && (<> {" "}<Link to="/memory-settings" className="underline" onClick={() => setOpen(false)}>{t("Turn on memory so the coach remembers you.")}</Link></>)}
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
      <button onClick={() => setOpen((o) => !o)} aria-label={t("Open {name}").replace("{name}", MASCOT.name)}
        className="fixed z-50 bottom-5 right-5 rounded-full bg-background/80 backdrop-blur-xl border border-border shadow-lg p-1.5 transition-all hover:scale-110 active:scale-95">
        <MascotAvatar size={48} />
      </button>
    </>
  );
}
