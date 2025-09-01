import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pin, Trash2 } from "lucide-react";
import type { Conversation } from "@shared/schema";

interface ConversationActionsMenuProps {
  conversation: Conversation;
  onPin: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ConversationActionsMenu({
  conversation,
  onPin,
  onDelete,
}: ConversationActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onPin(conversation.id)}>
          <Pin className="mr-2 h-4 w-4" />
          {conversation.isPinned ? "Unpin" : "Pin"} conversation
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(conversation.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}