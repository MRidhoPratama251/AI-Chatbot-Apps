import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import type { User } from "@shared/schema";

interface ChatTopBarProps {
  user: User | null;
}

export function ChatTopBar({ user }: ChatTopBarProps) {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Chatbot
        </h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profilePhoto || undefined} />
          <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {user?.username?.slice(0, 2).toUpperCase() || "AI"}
          </AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.username || "Demo User"}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.role || "User"}
          </p>
        </div>
      </div>
    </header>
  );
}