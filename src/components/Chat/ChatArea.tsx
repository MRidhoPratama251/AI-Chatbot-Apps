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

  return (
    <ScrollArea className="flex-1 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-6">
          {messages.map((message) => (
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