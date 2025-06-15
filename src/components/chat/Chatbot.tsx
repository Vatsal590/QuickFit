
import React, { useState } from "react";
import { Bot } from "lucide-react";

// Minimal Chatbot floating button that just redirects to your Zapier app
export default function Chatbot() {
  const [open, setOpen] = useState(false);

  function handleRedirect() {
    window.open("https://quickfit.zapier.app", "_blank", "noopener noreferrer");
  }

  return (
    <button
      className="fixed z-50 bottom-5 right-5 bg-fitness-primary text-white rounded-full p-4 shadow-lg flex items-center justify-center hover:bg-fitness-primary/90 transition-all"
      aria-label="Open Chatbot"
      onClick={handleRedirect}
    >
      <Bot className="w-6 h-6" />
    </button>
  );
}
