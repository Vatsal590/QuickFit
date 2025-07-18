import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl }: PasswordResetRequest = await req.json();

    console.log("Sending password reset email to:", email);

    const emailResponse = await resend.emails.send({
      from: "QuickFit <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your QuickFit Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your QuickFit Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 50px; border-radius: 12px; margin-top: 50px; margin-bottom: 50px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 50px;">
              <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 32px; font-weight: bold;">QF</span>
              </div>
              <h1 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: 700;">QuickFit</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Transform Your Fitness Journey</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #333; margin: 0; font-size: 24px; font-weight: 600;">Secure Password Reset</h2>
            </div>
            
            <p style="margin-bottom: 25px; color: #555; font-size: 16px; text-align: center;">
              Hello there, fitness enthusiast! 👋
            </p>
            
            <p style="margin-bottom: 30px; color: #555; font-size: 16px; line-height: 1.7;">
              We received a request to reset your password for your QuickFit account. No worries – it happens to the best of us! 
              We're here to help you get back to crushing your fitness goals in no time.
            </p>
            
            <p style="margin-bottom: 35px; color: #555; font-size: 16px; line-height: 1.7;">
              Simply click the secure button below to create a new password and continue your amazing fitness journey with QuickFit:
            </p>
            
            <div style="text-align: center; margin: 45px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); transition: all 0.3s ease;">
                🔐 Reset My Password
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 40px 0; border-left: 4px solid #2563eb;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                Alternative Access Method:
              </p>
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
                If the button doesn't work, copy and paste this secure link into your browser:
              </p>
              <p style="color: #2563eb; word-break: break-all; font-size: 13px; margin: 0; background: white; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${resetUrl}
              </p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 35px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
                <strong>🛡️ Security Notice:</strong> This password reset link is valid for 24 hours and can only be used once for your protection.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
            
            <div style="text-align: center; padding: 20px 0;">
              <p style="color: #888; font-size: 13px; margin: 0 0 15px 0;">
                <strong>Didn't request this password reset?</strong><br>
                No problem! You can safely ignore this email and your password will remain unchanged. 
                Your account security is our top priority.
              </p>
              
              <p style="color: #888; font-size: 12px; margin: 0;">
                Stay strong, stay fit! 💪<br>
                The QuickFit Team
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p style="margin: 0;">
              © 2024 QuickFit • Powering Your Fitness Journey
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Password reset email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);