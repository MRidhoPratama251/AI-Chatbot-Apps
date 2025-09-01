import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface FilePickerProps {
  children: React.ReactNode;
  accept: string[];
  maxSizeMB: number;
  onFiles: (files: File[]) => void;
  multiple?: boolean;
}

export function FilePicker({ 
  children, 
  accept, 
  maxSizeMB, 
  onFiles, 
  multiple = false 
}: FilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file sizes
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than ${maxSizeMB}MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFiles(validFiles);
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept.join(",")}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}