
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// Message type
type Message = { from: "user" | "bot"; text: string };

const CHATBOT_STORAGE_KEY = "quickfit_chatbot_history";

// Save messages to localStorage
function saveToLocal(messages: Message[]) {
  localStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(messages));
}

// Type guard
function isMessage(obj: any): obj is Message {
  return (
    obj &&
    (obj.from === "user" || obj.from === "bot") &&
    typeof obj.text === "string"
  );
}

// Load messages from localStorage
function loadFromLocal(): Message[] {
  const stored = localStorage.getItem(CHATBOT_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.filter(isMessage);
    }
    return [];
  } catch {
    return [];
  }
}

// === FITNESS BOT LOCAL RESPONSE ENGINE ===
function generateFitnessResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  // For beginners
  if (
    /beginner|just start|how to start|new to fitness|first time/.test(lowerPrompt)
  ) {
    return (
      "As a beginner, it's essential to ease into fitness gradually to build a strong foundation. " +
      "Start with 3 sessions per week, focusing on bodyweight exercises like squats, push-ups, and planks. " +
      "Aim for 10-15 repetitions per set, resting between sets. Always warm up before and cool down after each session. " +
      "Stay consistent, listen to your body, and celebrate your progress—you've got this!"
    );
  }

  // 30 minute calisthenics
  if (
    /30.?minute.*calisthenic/.test(lowerPrompt) ||
    (/workout/.test(lowerPrompt) && /calisthenic/.test(lowerPrompt))
  ) {
    return (
      "Here's a 30-minute calisthenics workout to get you moving:\n" +
      "1. Warm-up: 5 minutes jogging in place or jumping jacks.\n" +
      "2. Circuit 1 (10 mins):\n" +
      "   • Push-ups: 3 sets of 10 reps\n" +
      "   • Squats: 3 sets of 15 reps\n" +
      "   • Plank: 3 sets of 30 seconds\n" +
      "3. Circuit 2 (10 mins):\n" +
      "   • Lunges: 3 sets of 12 reps per leg\n" +
      "   • Burpees: 3 sets of 8 reps\n" +
      "   • Mountain Climbers: 3 sets of 30 seconds\n" +
      "4. Cool down: 5 minutes stretching major muscle groups.\n" +
      "Focus on good form, take short breaks, and enjoy your workout!"
    );
  }

  // Ask for plan/routine
  if (
    /workout plan|routine|can you make.*workout|suggest.*plan|program/.test(lowerPrompt)
  ) {
    return (
      "Absolutely! Here's a supportive, well-rounded routine:\n" +
      "1. Warm-up: 5 minutes brisk walking or dynamic stretching.\n" +
      "2. Main set:\n" +
      "   - Bodyweight squats: 3 sets of 12 reps\n" +
      "   - Push-ups (on knees if needed): 3 sets of 10 reps\n" +
      "   - Glute bridges: 3 sets of 15 reps\n" +
      "   - Plank: 3 sets of 20-30 seconds\n" +
      "   - Rest 60 seconds between sets.\n" +
      "3. Cool down: Gentle stretching, 5 minutes.\n" +
      "Adjust exercises for your level—if you find it too easy or hard, increase/decrease reps, or rest a bit more. " +
      "Stay positive and make steady progress!"
    );
  }

  // Weight loss advice
  if (/lose weight|fat loss|burn fat/.test(lowerPrompt) || /weight loss/.test(lowerPrompt)) {
    return (
      "To lose weight safely, combine regular exercise with balanced nutrition. " +
      "Aim for at least 150 minutes of moderate activity per week (like brisk walking or cycling)." +
      "\n• Pair cardio with resistance training (bodyweight, bands, or weights) to maintain muscle." +
      "\n• Prioritize whole foods (lots of veggies, lean proteins) and stay hydrated." +
      "\n• Progress may be gradual—patience and consistency are key. Celebrate every step and take rest as needed!"
    );
  }

  // Muscle gain advice
  if (/build muscle|gain muscle|get stronger|increase muscle/.test(lowerPrompt)) {
    return (
      "Building muscle takes time, consistent effort, and proper nutrition." +
      "\n• Focus on compound exercises like squats, push-ups, lunges, and rows." +
      "\n• Aim for 3-4 sessions per week, 8-12 reps per set, with enough resistance to feel challenged." +
      "\n• Ensure adequate protein intake, sleep, and progressive overload (increasing weights/reps gradually)." +
      "\nStay motivated—you'll see results as you stick with your program!"
    );
  }

  // Injury/soreness/recovery
  if (/injur|hurt|pain|sore|recovery|rest/.test(lowerPrompt)) {
    return (
      "Proper rest and recovery are vital for progress and preventing injuries." +
      "\n• Listen to your body's signals; if you're in pain, pause your workout and rest the affected area." +
      "\n• Prioritize sleep, hydration, and gentle stretching. Consider low-intensity movement like walking or yoga for active recovery." +
      "\n• Consult a healthcare professional for persistent pain or injury." +
      "\nTake care—progress is built on a strong, healthy foundation!"
    );
  }

  // Motivation/support
  if (/motivat|struggle|can't do|get started|give up|discouraged/.test(lowerPrompt)) {
    return (
      "Remember, every step you take toward your fitness goal is progress. It's normal to have ups and downs—what matters is consistency and self-compassion." +
      "\n• Celebrate small wins and focus on what you CAN do today." +
      "\n• Set realistic, achievable goals and track your journey over time." +
      "\nYou're stronger than you think—keep going, and be proud of your effort!"
    );
  }

  // Custom fallback for other questions
  return (
    "Great question! Here's some general fitness guidance:\n" +
    "• Focus on balanced routines combining strength, cardio, flexibility, and rest.\n" +
    "• Consistency is key. Even small steps matter—celebrate your achievements!\n" +
    "• Remember to warm up, cool down, and listen to your body.\n" +
    "If you have a specific goal or want workout ideas, let me know! I'm here to help you succeed."
  );
}

// === END FITNESS BOT LOGIC ===

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadFromLocal());
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => {
      listRef.current?.scrollTo(0, listRef.current.scrollHeight);
    }, 50);
  }

  async function sendMessage() {
    if (!input.trim()) return;
    const prompt = input.trim();
    const userMsg: Message = { from: "user", text: prompt };
    const newMessages: Message[] = [...messages, userMsg];
    setMessages(newMessages);
    saveToLocal(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Generate local response using fitness logic
      const answer = generateFitnessResponse(prompt);
      const botMsg: Message = { from: "bot", text: answer };
      const nextMsgs: Message[] = [...newMessages, botMsg];
      setMessages(nextMsgs);
      saveToLocal(nextMsgs);
    } catch {
      // In case of logic error, show friendly fallback message
      const botMsg: Message = {
        from: "bot",
        text: "Sorry for the inconvenience but I am facing a tech hiccup."
      };
      const errMsgs: Message[] = [...newMessages, botMsg];
      setMessages(errMsgs);
      saveToLocal(errMsgs);
    } finally {
      setLoading(false);
      setTimeout(() => {
        listRef.current?.scrollTo(0, listRef.current.scrollHeight);
      }, 50);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClear() {
    setMessages([]);
    saveToLocal([]);
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="fixed z-50 bottom-5 right-5 bg-fitness-primary text-white rounded-full p-4 shadow-lg flex items-center justify-center hover:bg-fitness-primary/90 transition-all"
          aria-label="Open Chatbot"
          onClick={handleOpen}
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
      {/* Chat Modal */}
      {open && (
        <div className="fixed z-50 bottom-4 right-4 sm:right-8 w-[90vw] max-w-xs sm:max-w-sm flex flex-col shadow-xl border bg-white rounded-lg overflow-hidden animate-in fade-in duration-300">
          {/* Header */}
          <div className="bg-fitness-primary/90 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Bot className="w-5 h-5" /> QuickFit Chatbot
            </div>
            <button className="opacity-70 hover:opacity-100" onClick={handleClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Messages List */}
          <div
            className="flex-1 overflow-y-auto px-3 py-2 bg-white"
            style={{ maxHeight: "45vh", minHeight: 120 }}
            ref={listRef}
          >
            {messages.length === 0 ? (
              <div className="text-gray-500 text-sm py-8 text-center">
                Ask me anything — fitness advice, how to use QuickFit, or anything else!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      "flex " +
                      (msg.from === "user" ? "justify-end" : "justify-start")
                    }
                  >
                    <div
                      className={
                        (msg.from === "user"
                          ? "bg-gradient-to-r from-fitness-primary to-blue-400 text-white"
                          : "bg-gray-100 border") +
                        " px-3 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap text-sm shadow"
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Input Box */}
          <div className="p-2 border-t bg-white flex items-end gap-1">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="text-sm resize-none border rounded px-2 py-1 flex-1 bg-gray-50"
              rows={1}
              disabled={loading}
              autoFocus
              spellCheck
            />
            <Button
              type="button"
              onClick={sendMessage}
              className="ml-1 px-2 py-2 rounded"
              disabled={loading || !input.trim()}
              variant="default"
              size="icon"
              aria-label="Send"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full block"></span>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-1 px-2 py-2 rounded"
              onClick={handleClear}
              disabled={messages.length === 0}
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// NOTE: This file is now >200 lines. Please consider splitting into smaller files after you're satisfied with its functionality.
