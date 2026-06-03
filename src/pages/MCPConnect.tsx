import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bot,
  Copy,
  Check,
  Plug,
  ShieldCheck,
  Sparkles,
  Trash2,
  AlertTriangle,
  KeyRound,
} from "lucide-react";

const MCP_URL =
  "https://tlliijookodviezygwqk.supabase.co/functions/v1/mcp";

type TokenRow = {
  id: string;
  name: string | null;
  created_at: string;
  last_used_at: string | null;
};

// Browser-safe random token (32 bytes, base64url)
function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const MCPConnect = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadTokens = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("mcp_tokens")
      .select("id, name, created_at, last_used_at")
      .is("revoked_at", null)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Failed to load tokens", description: error.message, variant: "destructive" });
      return;
    }
    setTokens(data || []);
  };

  useEffect(() => {
    loadTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const token = generateToken();
      const token_hash = await sha256Hex(token);
      const { error } = await supabase.from("mcp_tokens").insert({
        user_id: user.id,
        token_hash,
        name: `Token ${new Date().toLocaleDateString()}`,
      });
      if (error) throw error;
      setNewToken(token);
      await loadTokens();
      toast({
        title: "Token generated",
        description: "Copy it now — you won't be able to see it again.",
      });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    const { error } = await supabase
      .from("mcp_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Token revoked" });
    loadTokens();
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const claudeJson = newToken
    ? JSON.stringify(
        {
          mcpServers: {
            quickfit: {
              url: MCP_URL,
              headers: { Authorization: `Bearer ${newToken}` },
            },
          },
        },
        null,
        2,
      )
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <Sparkles className="h-3 w-3" /> New
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Connect QuickFit to Claude
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Use the Model Context Protocol to let Claude (or any MCP-compatible AI
            assistant) securely read your QuickFit data and log workouts, food and
            weight on your behalf.
          </p>
        </div>

        <Card className="rounded-3xl border-border/60 backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5 text-primary" /> Server details
            </CardTitle>
            <CardDescription>
              Paste these into Claude's "Add custom MCP server / connector" dialog.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                MCP Server URL
              </label>
              <div className="flex gap-2 mt-1">
                <Input readOnly value={MCP_URL} className="font-mono text-xs" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copy("url", MCP_URL)}
                  aria-label="Copy URL"
                >
                  {copied === "url" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              Authentication uses a bearer token you generate below. Keep it private —
              anyone with the token can read and modify your QuickFit data.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" /> Your connection tokens
            </CardTitle>
            <CardDescription>
              Generate a token, paste it into Claude, and you're connected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGenerate}
              disabled={generating}
              variant="gradient"
              className="w-full sm:w-auto"
            >
              {generating ? "Generating…" : "Generate new connection token"}
            </Button>

            {newToken && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4" />
                  Save this now — it won't be shown again.
                </div>
                <div className="flex gap-2">
                  <Input readOnly value={newToken} className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copy("token", newToken)}
                  >
                    {copied === "token" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Claude Desktop config (mcpServers)
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => copy("json", claudeJson)}>
                      {copied === "json" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                      Copy JSON
                    </Button>
                  </div>
                  <pre className="text-[11px] bg-background/60 border border-border/60 rounded-lg p-3 overflow-x-auto">
{claudeJson}
                  </pre>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : tokens.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active tokens yet.</p>
              ) : (
                tokens.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{t.name || "Token"}</div>
                      <div className="text-xs text-muted-foreground">
                        Created {new Date(t.created_at).toLocaleDateString()}
                        {t.last_used_at
                          ? ` · Last used ${new Date(t.last_used_at).toLocaleString()}`
                          : " · Never used"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevoke(t.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Revoke
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" /> How to add it in Claude
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                In Claude Desktop, open <strong>Settings → Developer → MCP Servers</strong>,
                or in Claude.ai click <strong>Add custom connector</strong>.
              </li>
              <li>Paste the MCP Server URL above.</li>
              <li>
                Add a header: <code className="px-1 py-0.5 bg-muted rounded">Authorization</code> ={" "}
                <code className="px-1 py-0.5 bg-muted rounded">Bearer &lt;your token&gt;</code>.
              </li>
              <li>Save. Claude will list the QuickFit tools and start using them on request.</li>
            </ol>
            <div className="pt-2">
              <Badge variant="secondary">Tools exposed</Badge>
              <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                get_profile · get_active_workout_plan · get_recent_workouts ·
                get_active_diet_plan · get_food_logs · get_nutrition_goals ·
                get_weight_history · get_points · log_food · log_weight ·
                update_nutrition_goals
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MCPConnect;
