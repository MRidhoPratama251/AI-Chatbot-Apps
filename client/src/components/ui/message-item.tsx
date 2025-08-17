import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Edit, Download, RotateCcw, User, Bot } from "lucide-react";
import { type Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MessageItemProps {
  message: Message;
  onEdit?: (id: number) => void;
  onCopy?: (content: string) => void;
  onDownload?: (content: string) => void;
  onRepeat?: (id: number) => void;
}

export function MessageItem({
  message,
  onEdit,
  onCopy,
  onDownload,
  onRepeat,
}: MessageItemProps) {
  const { toast } = useToast();
  const isUser = message.role === "user";

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
    const file = new Blob([message.content], { type: "application/msword" });
    element.href = URL.createObjectURL(file);
    element.download = `message-${message.id}.docx`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onDownload?.(message.content);
  };

  return (
    <div className={cn("flex items-start space-x-3 mb-6", isUser && "flex-row-reverse space-x-reverse")}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={isUser ? undefined : "/bot-avatar.png"} />
        <AvatarFallback>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex-1 max-w-[80%]", isUser && "flex justify-end")}>
        <Card 
          className={cn(
            "group transition-all hover:shadow-md",
            isUser 
              ? "bg-muted/50 dark:bg-muted/30" 
              : "bg-background border-border"
          )}
        >
          <CardContent className="p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
            
            <div className={cn(
              "flex items-center space-x-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity",
              isUser ? "justify-start" : "justify-start"
            )}>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              
              {isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => onEdit?.(message.id)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
              
              {!isUser && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={handleDownload}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onRepeat?.(message.id)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}