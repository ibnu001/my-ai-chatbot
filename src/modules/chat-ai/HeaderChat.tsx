"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IoMdMore } from "react-icons/io";

export default function HeaderChat() {
  return (
    <header className="fixed w-full min-h-[61px] max-h-[61px] top-0 flex items-center justify-between whitespace-nowrap border-b border-solid border-dark-ct/20 px-6 py-3 bg-background-dark-ct/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-4 text-primary-ct-dark">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-primary-ct/10 p-2">
            <span className="material-symbols-outlined text-primary text-xl">
              <img src="/artificial-intelligence.png" alt="AI Icon" className="h-5 w-5" />
            </span>
          </div>
          <h1 className="text-base font-semibold leading-normal text-primary-ct-dark">
            AI Assistant
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 w-9  text-secondary-dark-ct ">
              <span className="material-symbols-outlined text-xl">
                <IoMdMore />
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-48 border-dark-ct/20">
            <DropdownMenuItem
              className="cursor-pointer"
              variant="destructive"
              onClick={() => {
                localStorage.removeItem("chat-messages");
                location.reload();
              }}
            >
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
