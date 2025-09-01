import React from "react";
import { ConversationActionsMenu } from "./ConversationActionsMenu";
import { cn } from "@/lib/utils";
import type { Conversation } from "@shared/schema";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelect: (id: number) => void;
  onPin: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  onPin,
  onDelete,
}: ConversationListProps) {
  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            "group relative flex items-center rounded-lg px-3 py-2 cursor-pointer transition-colors",
            conversation.id === activeConversationId
              ? "bg-[#b4b4b4] dark:bg-gray-700"
              : "bg-[#b4b4b48c] dark:bg-gray-800/50 hover:bg-[#b4b4b4] dark:hover:bg-gray-700"
          )}
          onClick={() => onSelect(conversation.id)}
        >
          <div className="flex-1 min-w-0 mr-8">
            <p 
              className={cn(
                "truncate text-base font-normal",
                conversation.id === activeConversationId
                  ? "text-black dark:text-white"
                  : "text-[#0000008c] dark:text-gray-300"
              )}
              title={conversation.title}
            >
              {conversation.title.length > 25 ? `${conversation.title.substring(0, 25)}...` : conversation.title}
            </p>
          </div>
          
          <div className="absolute right-3 flex-shrink-0">
            <ConversationActionsMenu
              conversation={conversation}
              onPin={onPin}
              onDelete={onDelete}
            />
          </div>
        </div>
      ))}
    </div>
  );
}