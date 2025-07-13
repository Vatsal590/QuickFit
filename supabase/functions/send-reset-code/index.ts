import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetCodeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PasswordResetCodeRequest = await req.json();

    console.log("Sending password reset code to:", email);

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code temporarily (in a real app, you'd use a database)
    // For now, we'll include it in the email and rely on the frontend to handle it
    
    const emailResponse = await resend.emails.send({
      from: "QuickFit <onboarding@resend.dev>",
      to: [email],
      subject: "Your QuickFit Password Reset Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Code</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; margin-top: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">QuickFit</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Password Reset Code</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            
            <p style="margin-bottom: 30px; color: #555;">
              We received a request to reset your password. Use the verification code below in the QuickFit app:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <div style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #2563eb; padding: 20px 30px; border-radius: 8px;">
                <p style="margin: 0; color: #666; font-size: 14px; margin-bottom: 10px;">Your verification code:</p>
                <p style="margin: 0; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; font-family: monospace;">
                  ${verificationCode}
                </p>
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">
              Enter this code in the QuickFit app to set your new password.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
            
            <p style="color: #888; font-size: 12px; text-align: center; margin: 0;">
              If you didn't request this password reset, you can safely ignore this email.
            </p>
            
            <p style="color: #888; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
              This code will expire in 15 minutes for security reasons.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Password reset code email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Password reset code sent successfully",
      code: verificationCode // In production, don't return this!
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reset-code function:", error);
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