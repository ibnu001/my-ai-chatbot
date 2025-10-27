"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { IoIosMore } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { MdContentCopy, MdOutlineSmartToy, MdOutlineThumbDownOffAlt, MdOutlineThumbUpOffAlt } from "react-icons/md";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(() => {
    // Ambil dari localStorage saat pertama render
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat-messages");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
                ? marked.parse(assistantMsg.content).toString()
                : assistantMsg.content,
          },
        ];
      });
      // Slow down streaming for smoother effect
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    setLoading(false);
  };
   
  // Simpan ke localStorage setiap kali messages berubah
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to bottom smoothly
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      textareaRef.current?.focus();
    }
  }, [loading]);

  return (
    <div className="bg-background-dark-ct font-display text-primary-ct-dark">
      <div className="flex min-h-screen w-full">
        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-6">
              <ScrollArea className="flex flex-col gap-6" ref={scrollRef}>
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm mt-20">
                    Mulai percakapan dengan AI…
                  </div>
                )}
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <div className="flex items-end justify-end gap-3" key={i}>
                      <div className="flex flex-1 flex-col items-end gap-1">
                        <p className="text-[13px] font-medium leading-normal text-secondary-dark-ct">
                          You
                        </p>
                        <p className="max-w-xl text-base font-normal leading-relaxed rounded-lg rounded-br-none bg-primary-ct px-4 py-3 text-white">
                          {m.content}
                        </p>
                      </div>
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0"
                        data-alt="User avatar with abstract gradient"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgeEXkEzepGpeiIWCPA3QQXd4aGszbAADJWwNddOyrfNA4czr3buMbUzitVHNJhk0uerUPxxTp7MpvNW8ktHxWogskfp39C7tT4Cm8qvPXu65L1KwFN7klBeJsJ3hOyiQ3KHPTWyNuJi8S17SykLTut-jHM7zjLOav0kWPBxINnyP79VAvOHc4fx775dKJzrCSZv6YzDFDjfTgSm1Ho_-MzUYOiazbdX2MJKelZor-BMSYc4v5Dchk4q0vlznStO18Ban2czbmXew")',
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div className="flex items-end gap-3" key={i}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-ct/20 shrink-0">
                        <span className="material-symbols-outlined text-primary-ct text-lg">
                          <MdOutlineSmartToy />
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col items-start gap-2">
                        <p className="text-[13px] font-medium leading-normal text-secondary-dark-ct">
                          AI Assistant
                        </p>
                        <div className="group relative bg-primary-ct/10 rounded-lg rounded-bl-none px-4 py-3">
                          <div
                            className="text-base font-normal leading-relaxed rounded-lg rounded-bl-none  px-4 py-3 text-primary-ct-dark space-y-4"
                            dangerouslySetInnerHTML={{ __html: m.content }}
                          />
                          <div className="absolute -right-2 top-full mt-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button className="cursor-pointer flex items-center justify-center rounded-md p-1.5 text-secondary-dark-ct  hover:text-primary-ct-dark">
                              <span className="material-symbols-outlined text-base">
                                <MdContentCopy />
                              </span>
                            </button>
                            <button className="cursor-pointer flex items-center justify-center rounded-md p-1.5 text-secondary-dark-ct  hover:text-primary-ct-dark">
                              <span className="material-symbols-outlined text-base">
                                <MdOutlineThumbUpOffAlt />
                              </span>
                            </button>
                            <button className="cursor-pointer flex items-center justify-center rounded-md p-1.5 text-secondary-dark-ct  hover:text-primary-ct-dark">
                              <span className="material-symbols-outlined text-base">
                                <MdOutlineThumbDownOffAlt />
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </ScrollArea>
            </div>
          </div>
          <div className="sticky bottom-0 border-t border-t-dark-ct/20 bg-background-dark-ct/80 pb-4 pt-3 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
              <form
                className="relative flex items-center rounded-lg border border-border-dark-ct  pr-2 focus-within:border-primary-ct"
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <textarea
                  className="min-h-11 flex-1 resize-none self-end border-none bg-transparent p-3 text-primary-ct-dark placeholder-text-secondary-dark-ct focus:ring-0 focus-visible:outline-0"
                  placeholder={loading ? "AI is typing..." : "Ask me anything..."}
                  rows={1}
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="ml-2 flex h-10 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary-ct text-white hover:bg-primary-ct/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-xl">
                    {loading ? <IoIosMore /> : <IoSend />}
                  </span>
                </button>
              </form>
              <p className="mt-2 text-center text-xs text-secondary-dark-ct">
                AI can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}