import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserBubble } from "./UserBubble";
import { AIBubble } from "./AIBubble";
import { EmptyState } from "../Common/EmptyState";
import type { Message } from "../../shared/schema";

interface ChatAreaProps {
  messages: Message[];
  activeConversationId: number | null;
  onRegenerate: (messageId: number) => void;
}

export function ChatArea({
  messages,
  activeConversationId,
  onRegenerate,
}: ChatAreaProps) {
  if (!activeConversationId) {
    return <EmptyState />;
  }

  // Filter out empty or invalid messages
  const validMessages = messages.filter(message => 
    message && message.content && message.content.trim().length > 0
  );

  // Show empty state if no valid messages in the conversation
  if (validMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Start a conversation by typing a message below</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-6">
          {validMessages.map((message) => (
            message.role === "user" ? (
              <UserBubble key={message.id} message={message} />
            ) : (
              <AIBubble 
                key={message.id} 
                message={message}
                onRegenerate={() => onRegenerate(message.id)}
              />
            )
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}