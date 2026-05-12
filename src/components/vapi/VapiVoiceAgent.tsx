import { useEffect } from "react";

// Vapi AI Voice Agent integration
// Loads the Vapi SDK dynamically and initializes the voice assistant
export default function VapiVoiceAgent() {
  useEffect(() => {
    console.log("[VapiVoiceAgent] useEffect running");
    
    // Prevent double-loading in React StrictMode
    if (document.querySelector('script[data-vapi-sdk]')) {
      console.log("[VapiVoiceAgent] Script already exists, skipping");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.defer = true;
    script.setAttribute("data-vapi-sdk", "true");

    script.onload = () => {
      console.log("[VapiVoiceAgent] Script loaded, vapiSDK:", (window as any).vapiSDK);
      if ((window as any).vapiSDK) {
        (window as any).vapiSDK.run({
          apiKey: "afc42536-70b8-41e4-9184-81a13027799c",
          assistant: "803fe4de-9c1f-4444-b3ac-feeac51e7bd4",
          config: { position: "bottom-right" }
        });
      }
    };

    script.onerror = () => {
      console.error("[VapiVoiceAgent] Failed to load Vapi script");
    };

    document.body.appendChild(script);
    console.log("[VapiVoiceAgent] Script appended to body");

    return () => {
      // Cleanup: remove the script on unmount
      const existingScript = document.querySelector('script[data-vapi-sdk]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // This component renders nothing — Vapi creates its own floating button
  return null;
}
