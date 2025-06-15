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

// Replace the fixed response engine with a more dynamic response generator
function customFitnessResponse(prompt: string): string {
  const text = prompt.trim().toLowerCase();

  // 1. Detect request for workout or routine (with or without duration)
  if (
    /(routine|plan|workout)( for | to | with |$)/.test(text) ||
    /(give|create|suggest|make|recommend).*(routine|plan|workout)/.test(text)
  ) {
    // Extract workout details or time if present
    let duration = "";
    const timeMatch = text.match(/(\d+)\s*(minute|min|hour|hr)/);
    if (timeMatch) {
      duration = `${timeMatch[1]}-minute `;
    }

    // Detect calisthenics, strength, or general
    const isCalisthenics = text.includes("calisthenic");
    const isStrength = text.includes("strength");
    const isCardio = text.includes("cardio");
    // Adjust for level
    let level = "all levels";
    if (text.includes("beginner")) level = "beginner";
    else if (text.includes("intermediate")) level = "intermediate";
    else if (text.includes("advanced")) level = "advanced";

    // Make the routine
    let mainRoutine = "";
    if (isCalisthenics) {
      mainRoutine = `
1. Warm-up (5 minutes): Light cardio (jumping jacks, brisk walking)
2. Main Circuit (${duration || "20-minute"}):
   - Push-ups: 3 sets of 10–15 reps
   - Bodyweight squats: 3 sets of 15 reps
   - Plank: 3 sets of 30–45 sec
   - Mountain climbers: 3 x 30 sec
   - Rest 45-60 sec between movements
3. Cool Down (5 minutes): Stretching major muscle groups.
Tips: Focus on form and control. If new, reduce reps; if more advanced, add a round or vary tempo for extra challenge.`;
    } else if (isStrength) {
      mainRoutine = `
1. Warm-up (5 minutes): Arm circles, hip rotations, air squats
2. Strength Block:
   - Squats: 4 x 8–12 reps
   - Push-ups: 4 x 8–12 reps
   - Lunges: 3 x 10 per leg
   - Glute bridges: 3 x 15 reps
   - Rest 1–2 mins between sets
3. Cool Down: Full body stretching
Tips: Add resistance (weights, backpack) as strength improves. Always keep good form.`;
    } else if (isCardio) {
      mainRoutine = `
1. Warm-up (3 minutes): March/jog in place
2. Cardio Circuit (${duration || "15-minute"}):
   - High knees: 30 sec
   - Jumping jacks: 40 sec
   - Air squats: 30 sec
   - Rest: 30 sec
   - Repeat 4–6 rounds
3. Cool Down: Gentle stretching
Tips: Pace yourself and stay hydrated.`;
    } else {
      // General full-body routine
      mainRoutine = `
1. Warm-up (5 minutes): Dynamic stretches, brisk walk
2. Main Set:
   - Bodyweight squats: 3 x 12 reps
   - Push-ups (on knees if needed): 3 x 10 reps
   - Reverse lunges: 3 x 12 reps per leg
   - Plank: 3 x 30 sec
   - Rest 60 sec between sets
3. Cool Down: Gentle stretching, 3–5 minutes
Tips: Adjust reps for your ability. Track progress weekly to stay motivated!
      `;
    }

    // Compose final message with motivation
    return (
      `Here's a ${duration}${isCalisthenics ? "calisthenics" : isStrength ? "strength" : isCardio ? "cardio" : ""} workout routine tailored for ${level}:\n` +
      mainRoutine +
      "\nRemember to listen to your body and take breaks as needed. Consistency matters most—your progress is unique, and every session moves you forward. Stay strong and have fun!"
    );
  }

  // 2. Beginner: user unsure or wants to start
  if (
    /(how to start|beginner|never exercised|first timer|getting started|new to (fitness|working out)|not sure where|need a start)/.test(
      text
    )
  ) {
    return (
      "Starting your fitness journey is a fantastic step! As a beginner, try 3 sessions per week focusing on basic bodyweight exercises—like squats, knee push-ups, and gentle planks. Do 2 to 3 sets of 8–12 reps for each, pausing to rest as needed. Always warm up first (march in place, circle arms) and end with gentle stretching. Progress gradually, celebrate every milestone, and remember: self-care and patience lead to long-term results! You've got this!"
    );
  }

  // 3. Weight loss/fat loss
  if (
    /(weight loss|lose weight|burn fat|fat loss|shed fat)/.test(text)
  ) {
    return (
      "To achieve healthy weight loss, aim for a balanced approach: combine regular exercise (cardio + strength) with nourishing whole foods and steady hydration. Target 150–180 minutes of activity per week—such as brisk walks, cycling, or home circuits. Remember, sustainable progress comes from consistency, not harsh restriction. Celebrate every step! Give your body time to adapt and focus on building a positive, healthy routine."
    );
  }

  // 4. Muscle gain/building
  if (
    /(muscle gain|build muscle|get stronger|gain muscle|tone up|hypertrophy)/.test(
      text
    )
  ) {
    return (
      "To build muscle, pair regular resistance workouts with enough protein and rest. Focus on compound exercises—squats, lunges, push-ups, rows—2–4 sets of 8–12 reps per move, 3–4 times a week. Challenge yourself but never sacrifice form! Sleep and recovery are essential for muscle growth. Track your progress, stay consistent, and believe in your ability to grow stronger with each effort!"
    );
  }

  // 5. Injury, pain, or recovery
  if (
    /(injur|hurt|pain|sore|recover|recovery|rest|rehab|strain|sprain|shoulder pain|back pain|knee pain)/.test(
      text
    )
  ) {
    return (
      "I'm sorry to hear you're experiencing discomfort. Your well-being comes first—pause intense exercise, use ice or gentle movement as needed, and consult a healthcare professional for ongoing pain. Focus on recovery, quality sleep, hydration, and gentle stretching if appropriate. Remember, honoring your body's needs now will set the stage for stronger gains in the future. Wishing you a speedy recovery!"
    );
  }

  // 6. Motivation, feeling stuck, or need encouragement
  if (
    /(motivat|struggle|get started|can't do|lost|give up|discouraged|stuck|plateau|why bother|keep going|feel lazy|no progress|not improving)/.test(
      text
    )
  ) {
    return (
      "It's completely normal to have ups and downs in your fitness journey. Focus on small, achievable goals and celebrate every victory—no matter how minor it feels! Progress is built over time. Remember, each day you show up, you're moving closer to your goals. Stay patient, practice self-kindness, and reach out for support whenever you need it. You're strong, and you're not alone!"
    );
  }

  // 7. Nutrition, diet, or healthy eating
  if (
    /(nutrition|diet|healthy eating|meal plan|eat better|what to eat|food advice)/.test(
      text
    )
  ) {
    return (
      "For best fitness results, fill your meals with a variety of whole foods: plenty of vegetables, some fruit, lean proteins (chicken, fish, tofu, beans), healthy fats (nuts, olive oil), and complex carbs (brown rice, oats, sweet potato). Stay hydrated and eat mindfully. Remember, no single food makes or breaks your progress—balanced, consistent choices work best for long-term health!"
    );
  }

  // 8. General fallback/support
  return (
    "Great question! For any fitness goal, start by defining what you want to achieve—whether it's getting stronger, feeling healthier, or finding more energy. Focus on a blend of regular movement, balanced nutrition, and good sleep. Listen to your body, and adjust your routine as you progress. If you want a workout plan or specific advice for your situation, let me know your level and goals—I'm here to help you succeed!"
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
      // Generate local response using improved fitness response logic
      const answer = customFitnessResponse(prompt);
      const botMsg: Message = { from: "bot", text: answer };
      const nextMsgs: Message[] = [...newMessages, botMsg];
      setMessages(nextMsgs);
      saveToLocal(nextMsgs);
    } catch {
      // Fallback for unexpected error
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
