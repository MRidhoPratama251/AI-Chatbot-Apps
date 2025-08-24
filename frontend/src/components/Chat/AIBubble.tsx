import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface AIBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
  onDownloadDocx?: (messageId: number) => void;
}

export function AIBubble({ 
  message, 
  onCopy, 
  onRegenerate,
  onDownloadDocx 
}: AIBubbleProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
    onCopy?.(message.content);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([message.content], { 
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    });
    element.href = URL.createObjectURL(file);
    element.download = `message-${message.id}.docx`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onDownloadDocx?.(message.id);
  };

  return (
    <div className="flex items-start mb-6">
      <div className="flex-1 max-w-[80%]">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-md px-4 py-3 group shadow-sm">
          <div className="text-sm leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">
            {message.content}
          </div>
          
          <div className="flex items-center space-x-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={onRegenerate}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}