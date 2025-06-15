
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// Message type
type Message = { from: "user" | "bot"; text: string };

const CHATBOT_STORAGE_KEY = "quickfit_chatbot_history";
const PPLX_API_KEY_KEY = "perplexity_api_key";

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

// Demo canned replies (remains, for fallback)
const DEMO_REPLIES = [
  "Great question! Right now, I'm in demo mode – but you can ask me anything about QuickFit or fitness.",
  "This is a simulated bot response. The real AI will be back soon!",
  "Thanks for reaching out. Your question was: ",
  "QuickFit bot is on demo – your message was received.",
  "I'm just a demo chatbot right now, but I'm happy to chat!"
];

// Ask user for their Perplexity API key if absent
function getLocalPPLXKey(): string | null {
  return localStorage.getItem(PPLX_API_KEY_KEY);
}
function setLocalPPLXKey(key: string) {
  localStorage.setItem(PPLX_API_KEY_KEY, key);
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadFromLocal());
  const listRef = useRef<HTMLDivElement | null>(null);

  // Key management for Perplexity
  const [apiKey, setApiKey] = useState<string | null>(getLocalPPLXKey());
  const [showKeyPrompt, setShowKeyPrompt] = useState<boolean>(false);
  const [enteredKey, setEnteredKey] = useState("");

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

  // Handle setting the Perplexity API key
  function handleSaveKey(e: React.FormEvent) {
    e.preventDefault();
    if (enteredKey.trim()) {
      setApiKey(enteredKey.trim());
      setLocalPPLXKey(enteredKey.trim());
      setShowKeyPrompt(false);
      setEnteredKey("");
    }
  }

  // Main send routine with Perplexity API
  async function sendMessage() {
    if (!input.trim()) return;
    const prompt = input.trim();
    const userMsg: Message = { from: "user", text: prompt };
    const newMessages: Message[] = [...messages, userMsg];
    setMessages(newMessages);
    saveToLocal(newMessages);
    setInput("");
    setLoading(true);

    // If no API key, ask user to enter it
    if (!apiKey) {
      setShowKeyPrompt(true);
      setLoading(false);
      return;
    }

    try {
      // Perplexity AI API
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            { role: "system", content: "You are a concise, motivational, and helpful fitness coach and workout assistant. Respond in an actionable and friendly tone." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 280,
        }),
      });
      if (!response.ok) {
        throw new Error("API error");
      }
      const data = await response.json();
      const answer =
        data?.choices?.[0]?.message?.content ??
        "Sorry, I couldn't process that at the moment. Try rephrasing?";
      const botMsg: Message = { from: "bot", text: answer };
      const nextMsgs: Message[] = [...newMessages, botMsg];
      setMessages(nextMsgs);
      saveToLocal(nextMsgs);
    } catch (e) {
      // Show friendly error, fallback to demo mode
      const fallback =
        DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
      const botMsg: Message = {
        from: "bot",
        text:
          "Oops! My live AI brain is having trouble reaching Perplexity. Here's a quick response while I reconnect:\n\n" +
          fallback,
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

  // Clear API key for troubleshooting
  function handleClearKey() {
    setApiKey(null);
    setLocalPPLXKey("");
    setShowKeyPrompt(true);
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
          {/* Perplexity API Key Modal */}
          {showKeyPrompt && (
            <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
              <form className="bg-white p-5 rounded-lg shadow-xl max-w-xs w-full" onSubmit={handleSaveKey}>
                <div className="mb-2 font-semibold text-lg text-center">Enter Your Perplexity API Key</div>
                <div className="mb-2 text-xs text-gray-600">
                  To enable real AI responses, please provide your <a href="https://platform.perplexity.ai/api-keys" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">Perplexity API key</a>.
                  <br />
                  <span className="font-semibold">Your key is only stored locally in your browser.</span>
                </div>
                <input
                  className="border rounded px-2 py-1 w-full text-sm mb-2"
                  type="text"
                  value={enteredKey}
                  onChange={e => setEnteredKey(e.target.value)}
                  required
                  placeholder="pk-..."
                />
                <Button type="submit" className="w-full mb-1 bg-fitness-primary">Save API Key</Button>
                <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => setShowKeyPrompt(false)}>Cancel</Button>
              </form>
            </div>
          )}
          {/* Optionally: Show API key manage button */}
          {apiKey && (
            <button
              onClick={handleClearKey}
              className="absolute top-2 right-2 text-xs text-blue-100 hover:text-white bg-fitness-primary/40 rounded px-2 py-1"
              style={{ fontSize: 11 }}
              title="Reset API key"
            >
              Reset API Key
            </button>
          )}
        </div>
      )}
    </>
  );
}

// NOTE: This file is now >200 lines. Please consider splitting into smaller files after you're satisfied with its functionality.

