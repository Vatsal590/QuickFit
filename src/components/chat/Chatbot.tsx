import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Minimal Chatbot floating button that just redirects to your Zapier app
export default function Chatbot() {
  const [showPopup, setShowPopup] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('chatbot-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage
    if (messages.length > 0) {
      localStorage.setItem('chatbot-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleOpenChat() {
    setIsDialogOpen(true);
    setShowPopup(false);
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const CHAT_URL = `https://tlliijookodviezygwqk.supabase.co/functions/v1/chatbot`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbGlpam9va29kdmllenlnd3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDE5MDcsImV4cCI6MjA2NDYxNzkwN30.GAZGOACK4mTZDa1htm08DuzMqGPDyrsHFC6PyhDtFiw'}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';
      let streamDone = false;

      // Add empty assistant message that we'll update
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "",
        timestamp: new Date()
      }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                  timestamp: new Date()
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (!assistantContent) {
        throw new Error('No content received from AI');
      }

    } catch (error) {
      console.error('Error calling chatbot:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from chatbot. Please try again.",
        variant: "destructive"
      });
      
      // Remove the empty assistant message if there was an error
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1 || prev[prev.length - 1].content !== ""));
    } finally {
      setIsLoading(false);
    }
  };

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
                onClick={handleOpenChat}
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
        onClick={handleOpenChat}
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chatbot Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b bg-gradient-to-r from-fitness-primary/10 to-fitness-accent/10">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-fitness-primary" />
              QuickFit Assistant
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="w-12 h-12 mb-4 text-fitness-primary" />
                <p className="text-lg font-medium">Hi! I'm your QuickFit Assistant</p>
                <p className="text-sm mt-2">Ask me anything about fitness, workouts, or nutrition!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.role === "user"
                          ? "bg-fitness-primary text-white"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-fitness-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-fitness-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-fitness-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
