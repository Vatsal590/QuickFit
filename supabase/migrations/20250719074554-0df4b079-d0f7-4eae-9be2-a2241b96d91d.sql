-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to send daily notifications at 9 AM UTC every day
SELECT cron.schedule(
  'daily-push-notifications',
  '0 9 * * *', -- Every day at 9 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://tlliijookodviezygwqk.supabase.co/functions/v1/send-daily-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbGlpam9va29kdmllenlnd3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDE5MDcsImV4cCI6MjA2NDYxNzkwN30.GAZGOACK4mTZDa1htm08DuzMqGPDyrsHFC6PyhDtFiw"}'::jsonb,
        body:='{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);