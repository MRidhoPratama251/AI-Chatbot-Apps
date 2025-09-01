import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";
import { FilePicker } from "../Common/FilePicker";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string, files?: File[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export function PromptInput({
  value,
  onChange,
  onSend,
  disabled = false,
  isLoading = false,
  placeholder = "Drop Your Question",
}: PromptInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 📤 USER INPUT HANDLER: Triggers message sending to backend
  // This calls the onSend prop which connects to Desktop.handleSendMessage
  const handleSend = () => {
    if (!value.trim() || disabled || isLoading) return;
    onSend(value); // 🔗 Connects to Desktop component's API communication
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-[#eaeaea] dark:bg-gray-800 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-300 dark:border-gray-600 shadow-sm">
          <div className="flex items-end p-4 space-x-3">
            <FilePicker
              accept={["image/*", ".pdf", ".doc", ".docx", ".txt"]}
              maxSizeMB={10}
              onFiles={(files) => console.log("Files selected:", files)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={disabled || isLoading}
              >
                <Paperclip className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </FilePicker>
            
            <div className="flex-1 relative">
              <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled || isLoading}
                className="border-0 bg-transparent text-base px-0 py-2 focus-visible:ring-0 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!value.trim() || disabled || isLoading}
              className="flex-shrink-0 h-8 w-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}