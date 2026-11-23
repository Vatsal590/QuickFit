import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTranslation } from "@/contexts/TranslationContext";
import { memoryCall, memoryStatus, resetMemoryCache } from "@/lib/memory";
import { toast } from "sonner";

export default function MemorySettings() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<{ consented: boolean; consent_at: string | null; email_opt_in: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => { setLoading(true); setStatus(await memoryStatus()); setLoading(false); };
  useEffect(() => { load(); }, []);

  async function turnOn() {
    setBusy(true);
    const r = await memoryCall({ action: "consent" });
    setBusy(false);
    if (!r) return toast.error(t("Memory is unavailable right now. Please try again later."));
    resetMemoryCache(); toast.success(t("Memory turned on")); load();
  }
  async function setEmail(v: boolean) {
    setStatus((s) => (s ? { ...s, email_opt_in: v } : s));
    await memoryCall({ action: "set_email_opt_in", value: v });
  }
  async function deleteAll() {
    setBusy(true);
    const r = await memoryCall<{ deleted: boolean }>({ action: "delete" });
    setBusy(false);
    if (!r?.deleted) return toast.error(t("Could not delete your memory right now. Please try again later."));
    resetMemoryCache(); setAgree(false); toast.success(t("Your memory has been deleted")); load();
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">{t("Memory settings")}</h1>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t("Training memory")}</CardTitle>
            <CardDescription>{t("Coach Q can remember your equipment, goals, plans, logged meals and training feedback to give advice that fits you. Memory is optional and you can delete it at any time.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? <p className="text-sm text-muted-foreground">{t("Loading...")}</p> : status?.consented ? (
              <>
                <p className="text-sm">{t("Memory is on since")} {status.consent_at ? new Date(status.consent_at).toLocaleDateString() : ''}.</p>
                <label className="flex items-center justify-between gap-4 text-sm">
                  <span>{t("Email me my weekly progress insight")}</span>
                  <Switch checked={status.email_opt_in} onCheckedChange={setEmail} />
                </label>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive" disabled={busy}>{t("Delete my memory")}</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("Delete my memory")}</AlertDialogTitle>
                      <AlertDialogDescription>{t("This permanently deletes everything QuickFit remembers about your training, and your weekly insights. Your account and workouts stay.")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("Delete")}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <label className="flex items-start gap-3 text-sm">
                  <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
                  <span>{t("I agree that QuickFit remembers my equipment, goals, workout and diet plans, logged meals, weight and reported pain to personalise my coach. I can delete this memory at any time.")}</span>
                </label>
                <Button onClick={turnOn} disabled={!agree || busy} className="active:scale-95">{t("Turn on memory")}</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
