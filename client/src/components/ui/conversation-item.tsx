import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pin, Edit, Trash2 } from "lucide-react";
import { type Conversation } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick?: () => void;
  onPin?: (id: number) => void;
  onRename?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onPin,
  onRename,
  onDelete,
}: ConversationItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center space-x-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer transition-colors",
        isActive && "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="truncate text-foreground">{conversation.title}</p>
          {conversation.isPinned && (
            <Badge variant="secondary" className="h-4 px-1">
              <Pin className="h-3 w-3" />
            </Badge>
          )}
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onPin?.(conversation.id)}>
            <Pin className="mr-2 h-4 w-4" />
            {conversation.isPinned ? "Unpin" : "Pin"} conversation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRename?.(conversation.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete?.(conversation.id)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}