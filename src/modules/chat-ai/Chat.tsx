"use client";

import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { IoIosMore } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner";

const MAX_DAILY_SEND = 10;

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    () => {
      // Ambil dari localStorage saat pertama render
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("chat-messages");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    }
  );
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [sendCount, setSendCount] = useState(0);
  const [lastSendDate, setLastSendDate] = useState<string>("");

  const [inputHeight, setInputHeight] = useState(40);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "40px"; // reset height
    el.style.height = Math.min(el.scrollHeight, 470) + "px"; // auto grow, max 470px
    setInput(el.value);
    setInputHeight(el.offsetHeight);
  };

  const handleSend = async () => {
    if (sendCount >= MAX_DAILY_SEND) {
      toast.error("Limit harian tercapai. Silakan coba lagi besok.");
      return;
    }

    if (!input.trim()) return;
    setSendCount((prev) => prev + 1);

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

  const handleCopy = (content: string) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = content;

    const text = tempElement.innerText;
    navigator.clipboard.writeText(text);

    toast.info("Copied!", {
      position: "bottom-center",
      richColors: true,
      duration: 1000
    });
  };

  // Cek dan reset counter jika hari sudah ganti
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const storedDate = localStorage.getItem("clsd") || ""; // clsd: chat-last-send-date
    const storedCount = parseInt(localStorage.getItem("csc") || "0", 10); // csc: chat-send-count

    if (storedDate !== today) {
      localStorage.setItem("clsd", today);
      localStorage.setItem("csc", "0");
      setSendCount(0);
      setLastSendDate(today);
    } else {
      setSendCount(storedCount);
      setLastSendDate(storedDate);
    }
  }, []);

  // Update localStorage setiap kali sendCount berubah
  useEffect(() => {
    if (lastSendDate) {
      localStorage.setItem("csc", sendCount.toString());
    }
  }, [sendCount, lastSendDate]);

  // Simpan ke localStorage setiap kali messages berubah
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      textareaRef.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
  }, []);

  return (
    <div className="relative flex flex-col pt-[61px] bg-background-dark-ct font-display text-primary-ct-dark">
      <div
        className="flex flex-col mx-auto w-full max-w-4xl px-4 py-8 md:px-6 gap-8"
        style={{ paddingBottom: inputHeight + 150 }}
      >
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
                <p className="max-w-3xl text-base font-normal leading-relaxed rounded-lg rounded-br-none bg-primary-ct px-4 py-3 text-white">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-ct/10 shrink-0">
                <span className="material-symbols-outlined text-primary-ct text-lg">
                  <img
                    src="/artificial-intelligence.png"
                    alt="AI Icon"
                    className="h-5 w-5"
                  />
                </span>
              </div>
              <div className="flex flex-1 flex-col items-start gap-2">
                <p className="text-[13px] font-medium leading-normal text-secondary-dark-ct">
                  AI Assistant
                </p>
                <div className="group relative bg-primary-ct/10 rounded-lg rounded-bl-none px-4 py-3 max-w-3xl">
                  <div
                    className="text-base font-normal leading-relaxed rounded-lg rounded-bl-none  px-4 py-3 text-primary-ct-dark space-y-4 overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: m.content }}
                  />
                  <div className="absolute left-1 top-full mt-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      className="cursor-pointer flex items-center justify-center rounded-md p-1.5 text-secondary-dark-ct  hover:text-primary-ct-dark"
                      onClick={() => handleCopy(m.content)}
                    >
                      <span className="material-symbols-outlined text-base">
                        <MdContentCopy />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="fixed w-full max-h-screen bottom-0 border-t border-t-dark-ct/20 bg-background-dark-ct/80 pb-4 pt-3 backdrop-blur-lg">
        <div className="flex flex-col mx-auto w-full max-w-4xl px-4 md:px-6">
          <form
            className="relative grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-border-dark-ct p-3 focus-within:border-primary-ct"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <textarea
              name="user-input"
              className="h-10 overflow-auto flex-1 resize-none self-end border-none bg-transparent text-primary-ct-dark placeholder-text-secondary-dark-ct focus:ring-0 focus-visible:outline-0 rounded-sm"
              placeholder={loading ? "AI is typing..." : "Ask me anything..."}
              ref={textareaRef}
              value={input}
              onInput={handleInput}
              onChange={handleInput}
              disabled={loading || sendCount >= MAX_DAILY_SEND}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="submit"
              className="self-end flex h-10 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary-ct text-white hover:bg-primary-ct/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading || sendCount >= MAX_DAILY_SEND}
            >
              <span className="material-symbols-outlined text-xl">
                {loading ? <IoIosMore /> : <IoSend />}
              </span>
            </button>
          </form>
          {sendCount >= MAX_DAILY_SEND && (
            <p className="mt-2 w-full text-center text-xs text-red-500">
              Kamu sudah mencapai limit {MAX_DAILY_SEND} pesan hari ini. Silakan
              coba lagi besok.
            </p>
          )}
          <p className="mt-2 w-full text-center! text-xs text-secondary-dark-ct">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}