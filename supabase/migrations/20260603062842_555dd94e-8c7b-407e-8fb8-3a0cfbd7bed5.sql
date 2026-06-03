
CREATE TABLE public.mcp_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_mcp_tokens_user_id ON public.mcp_tokens(user_id);
CREATE INDEX idx_mcp_tokens_hash ON public.mcp_tokens(token_hash) WHERE revoked_at IS NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mcp_tokens TO authenticated;
GRANT ALL ON public.mcp_tokens TO service_role;

ALTER TABLE public.mcp_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own MCP tokens"
ON public.mcp_tokens FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own MCP tokens"
ON public.mcp_tokens FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MCP tokens"
ON public.mcp_tokens FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MCP tokens"
ON public.mcp_tokens FOR DELETE
USING (auth.uid() = user_id);
