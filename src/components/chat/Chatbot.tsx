import React, { useState, useEffect } from "react";
import { Bot, X } from "lucide-react";

// Minimal Chatbot floating button that just redirects to your Zapier app
export default function Chatbot() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if user has previously closed the popup
    const popupClosed = localStorage.getItem('chatbot-popup-closed');
    if (!popupClosed) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleRedirect() {
    window.open("https://quickfit.zapier.app", "_blank", "noopener noreferrer");
  }

  function handleClosePopup() {
    setShowPopup(false);
    localStorage.setItem('chatbot-popup-closed', 'true');
  }

  return (
    <>
      {/* Popup Banner */}
      {showPopup && (
        <div className="fixed z-50 bottom-24 right-5 bg-white border-2 border-fitness-primary rounded-lg shadow-2xl p-4 max-w-xs animate-in slide-in-from-bottom-5 duration-300">
          <button
            onClick={handleClosePopup}
            className="absolute -top-2 -right-2 bg-fitness-primary text-white rounded-full p-1.5 hover:bg-fitness-primary/90 transition-all shadow-md"
            aria-label="Close popup"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="bg-fitness-primary/10 rounded-full p-2 flex-shrink-0">
              <Bot className="w-5 h-5 text-fitness-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Confused?
              </p>
              <p className="text-sm text-gray-600">
                Ask questions to our QuickFit chatbot!
              </p>
              <button
                onClick={handleRedirect}
                className="mt-3 text-xs font-medium text-fitness-primary hover:text-fitness-primary/80 underline"
              >
                Open Chatbot →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Button */}
      <button
        className="fixed z-50 bottom-5 right-5 bg-fitness-primary text-white rounded-full p-4 shadow-lg flex items-center justify-center hover:bg-fitness-primary/90 transition-all hover:scale-110"
        aria-label="Open Chatbot"
        onClick={handleRedirect}
      >
        <Bot className="w-6 h-6" />
      </button>
    </>
  );
}
