import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, Plus } from "lucide-react";

interface EmptyStateProps {
  onNewConversation?: () => void;
}

export function EmptyState({ onNewConversation }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-6">
          <Bot className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome to AI Chatbot
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          Select a conversation from the sidebar or create a new one to start 
          chatting with AI. Ask questions, get insights, and explore possibilities.
        </p>
        
        {onNewConversation && (
          <Button onClick={onNewConversation} className="inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        )}
      </div>
    </div>
  );
}