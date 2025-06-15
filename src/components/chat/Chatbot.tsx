
import React from "react";
import { Bot } from "lucide-react";

/**
 * Floating Chatbot Button - on click, redirects to Zapier app.
 */
export default function Chatbot() {
  function handleOpen() {
    window.open("https://quickfit.zapier.app", "_blank", "noopener,noreferrer");
  }

  return (
    <button
      className="fixed z-50 bottom-5 right-5 bg-fitness-primary text-white rounded-full p-4 shadow-lg flex items-center justify-center hover:bg-fitness-primary/90 transition-all"
      aria-label="Go to QuickFit Chatbot"
      onClick={handleOpen}
    >
      <Bot className="w-6 h-6" />
    </button>
  );
}
