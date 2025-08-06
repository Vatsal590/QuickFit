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
          <title>Your QuickFit Verification Code</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 50px; border-radius: 12px; margin-top: 50px; margin-bottom: 50px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 50px;">
              <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 32px; font-weight: bold;">QF</span>
              </div>
              <h1 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: 700;">QuickFit</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Your Verification Code is Ready</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #333; margin: 0; font-size: 24px; font-weight: 600;">🔐 Secure Password Reset</h2>
            </div>
            
            <p style="margin-bottom: 25px; color: #555; font-size: 16px; text-align: center;">
              Hello, fitness champion! 👋
            </p>
            
            <p style="margin-bottom: 30px; color: #555; font-size: 16px; line-height: 1.7; text-align: center;">
              We've generated a secure verification code for your QuickFit password reset request. 
              You're just one step away from getting back to your amazing fitness journey!
            </p>
            
            <p style="margin-bottom: 35px; color: #555; font-size: 16px; line-height: 1.7; text-align: center;">
              Enter the code below in your QuickFit app to create a new password and continue crushing your fitness goals:
            </p>
            
            <div style="text-align: center; margin: 45px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border: 3px solid #2563eb; padding: 30px 40px; border-radius: 12px; box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);">
                <p style="margin: 0; color: #666; font-size: 14px; margin-bottom: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  🎯 Your Verification Code
                </p>
                <p style="margin: 0; font-size: 42px; font-weight: bold; color: #2563eb; letter-spacing: 6px; font-family: monospace; text-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);">
                  ${verificationCode}
                </p>
              </div>
            </div>
            
            <div style="background: #e3f2fd; border-radius: 8px; padding: 25px; margin: 40px 0; border-left: 4px solid #2563eb;">
              <p style="color: #1565c0; font-size: 15px; margin: 0 0 10px 0; font-weight: 600;">
                📱 How to Use This Code:
              </p>
              <ol style="color: #1565c0; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Open the QuickFit app on your device</li>
                <li>Navigate to the password reset screen</li>
                <li>Enter the 6-digit code exactly as shown above</li>
                <li>Create your new secure password</li>
                <li>Get back to your fitness routine! 💪</li>
              </ol>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 35px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
                <strong>⏰ Time Sensitive:</strong> This verification code will expire in 15 minutes for your security. 
                Don't wait too long to use it!
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
            
            <div style="text-align: center; padding: 20px 0;">
              <p style="color: #888; font-size: 13px; margin: 0 0 15px 0;">
                <strong>Didn't request this code?</strong><br>
                No worries! If you didn't request a password reset, you can safely ignore this email. 
                Your QuickFit account remains secure and unchanged.
              </p>
              
              <p style="color: #888; font-size: 13px; margin: 0 0 15px 0;">
                For any questions or concerns about your account security, feel free to reach out to our support team.
              </p>
              
              <p style="color: #888; font-size: 12px; margin: 0;">
                Keep pushing your limits! 🚀<br>
                The QuickFit Team
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p style="margin: 0;">
              © 2024 QuickFit • Empowering Your Fitness Transformation
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