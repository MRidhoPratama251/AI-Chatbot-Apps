import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy, Edit, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface UserBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onEdit?: (messageId: number, text: string) => void;
}

export function UserBubble({ message, onCopy, onEdit }: UserBubbleProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
    onCopy?.(message.content);
  };

  return (
    <div className="flex items-start justify-end space-x-3 mb-6">
      <div className="flex flex-col items-end max-w-[80%]">
        <div className="bg-[#d9d9d9] dark:bg-gray-700 rounded-2xl rounded-tr-md px-4 py-3 group">
          <div className="text-sm leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">
            {message.content}
          </div>
          
          <div className="flex items-center justify-end space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => onEdit?.(message.id, message.content)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
          <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}