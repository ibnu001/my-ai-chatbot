"use client";

import { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const reader = res.body?.getReader();
    if (!reader) {
      setLoading(false);
      return;
    }

    const decoder = new TextDecoder();
    let assistantMsg = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      assistantMsg.content += chunk;
      setMessages((prev) => {
        const last = prev.slice(0, -1);
        return [
          ...last,
          {
            ...assistantMsg,
            content:
              assistantMsg.role === "assistant"
                ? marked.parse(assistantMsg.content).toString() // pastikan string
                : assistantMsg.content,
          },
        ];
      });
    }
    setLoading(false);
  };

  return (
    <Card className="w-full shadow-xl border-0 py-0 h-svh gap-0">
      <CardHeader className="bg-linear-to-r min-h-[100px] max-h-[100px] from-red-600 to-red-400 text-white pt-10">
        <CardTitle className="text-2xl font-bold tracking-tight">
          AI Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent className="grid h-full grid-rows-[1fr_80px] p-0">
        <ScrollArea className="h-full max-h-[calc(100svh-180px)] px-6 py-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-20">
                Mulai percakapan dengan AI…
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%] text-base whitespace-pre-line",
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-md"
                      : "bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-bl-none border shadow-sm"
                  )}
                  {...(m.role === "assistant"
                    ? { dangerouslySetInnerHTML: { __html: m.content } }
                    : {})}
                >
                  {m.role === "user" ? m.content : null}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 max-w-[80%] border shadow-sm animate-pulse">
                  AI sedang mengetik…
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form
          className="flex h-full gap-2 border-t px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-b-xl"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan…"
            disabled={loading}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? "Mengirim…" : "Kirim"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
