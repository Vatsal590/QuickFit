
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// Define the valid message type for stronger type safety
type Message = { from: "user" | "bot"; text: string };

const CHATBOT_STORAGE_KEY = "quickfit_chatbot_history";

function saveToLocal(messages: Message[]) {
  localStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(messages));
}

function isMessage(obj: any): obj is Message {
  return (
    obj &&
    (obj.from === "user" || obj.from === "bot") &&
    typeof obj.text === "string"
  );
}

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
      const resp = await fetch("/functions/v1/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await resp.json();
      if (data?.answer) {
        const botMsg: Message = { from: "bot", text: data.answer };
        const nextMsgs: Message[] = [...newMessages, botMsg];
        setMessages(nextMsgs);
        saveToLocal(nextMsgs);
      } else {
        const errMsg = data?.error || "No answer returned";
        const botMsg: Message = { from: "bot", text: errMsg };
        const errMsgs: Message[] = [...newMessages, botMsg];
        setMessages(errMsgs);
        saveToLocal(errMsgs);
      }
    } catch (e) {
      const botMsg: Message = {
        from: "bot",
        text: "There was an error reaching the server.",
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

  // Enter key submits, but Shift+Enter adds new line
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
