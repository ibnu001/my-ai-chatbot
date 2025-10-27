"use client";

import Chat from "@/modules/chat-ai/Chat";
import { useEffect, useState } from "react";

export default function Home() {
  // This is the solution to remove hydration error
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div suppressHydrationWarning>
      <Chat />
    </div>
  )
}
