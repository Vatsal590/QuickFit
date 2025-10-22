-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to send daily notifications at 6am CET (5am UTC)
-- This will run every day at 5am UTC (6am CET in winter, 7am CEST in summer)
SELECT cron.schedule(
  'send-daily-workout-notifications',
  '0 5 * * *', -- Run at 5am UTC daily
  $$
  SELECT
    net.http_post(
        url:='https://tlliijookodviezygwqk.supabase.co/functions/v1/send-daily-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbGlpam9va29kdmllenlnd3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDE5MDcsImV4cCI6MjA2NDYxNzkwN30.GAZGOACK4mTZDa1htm08DuzMqGPDyrsHFC6PyhDtFiw"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);