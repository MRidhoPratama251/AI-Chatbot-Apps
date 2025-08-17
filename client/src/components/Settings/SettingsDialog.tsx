import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIConfiguration } from "./AIConfiguration";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { TokenUsageChart } from "./TokenUsageChart";
import { ProfileForm } from "./ProfileForm";
import type { User } from "@shared/schema";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUserUpdate: (updates: Partial<User>) => void;
  tokenData: Array<{ date: string; tokens: number }>;
}

export function SettingsDialog({
  open,
  onOpenChange,
  user,
  onUserUpdate,
  tokenData,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("ai-config");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-2 border-b">
            <button
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "ai-config"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("ai-config")}
            >
              AI Config
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "theme"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("theme")}
            >
              Theme
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "token-usage"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("token-usage")}
            >
              Token Usage
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "profile"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </div>
          
          <div className="mt-6">
            {activeTab === "ai-config" && (
              <AIConfiguration 
                user={user}
                onSave={(config) => onUserUpdate({ aiPreferences: config })}
              />
            )}
            
            {activeTab === "theme" && <ThemeSwitcher />}
            
            {activeTab === "token-usage" && <TokenUsageChart data={tokenData} />}
            
            {activeTab === "profile" && (
              <ProfileForm 
                user={user}
                onSave={(profile) => onUserUpdate(profile)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}