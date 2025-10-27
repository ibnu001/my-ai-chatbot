"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IoMdMore } from "react-icons/io";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineSmartToy } from "react-icons/md";

export default function HeaderChat() {
  return (
    <header className="sticky top-0 flex items-center justify-between whitespace-nowrap border-b border-solid border-dark-ct/20 px-6 py-3 bg-background-dark-ct/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-4 text-primary-ct-dark">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-primary-ct/20 p-2">
            <span className="material-symbols-outlined text-primary text-xl">
              <MdOutlineSmartToy />
            </span>
          </div>
          <h1 className="text-base font-semibold leading-normal text-primary-ct-dark">
            AI Assistant
          </h1>
        </div>
        <h2 className="hidden text-lg font-bold leading-tight sm:block">
          AI Model v4.0
        </h2>
      </div>
      <div className="flex items-center gap-2">
        {/* <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 w-9  text-secondary-dark-ct ">
          <span className="material-symbols-outlined text-xl">
            <IoShareSocialOutline />
          </span>
        </button> */}
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
