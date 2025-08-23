import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Search,
  Plus,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeConversationId: number | null;
  searchQuery: string;
  showSearch: boolean;
  onSearchChange: (query: string) => void;
  onSearchToggle: () => void;
  onNewConversation: () => void;
  onSelectConversation: (id: number) => void;
  onPinConversation: (id: number) => void;
  onDeleteConversation: (id: number) => void;
  onSettingsOpen: (setting: 'ai' | 'theme' | 'tokens' | 'profile') => void;
  isCreatingConversation: boolean;
}

export function Sidebar({
  isCollapsed,
  onToggle,
  conversations,
  activeConversationId,
  searchQuery,
  showSearch,
  onSearchChange,
  onSearchToggle,
  onNewConversation,
  onSelectConversation,
  onPinConversation,
  onDeleteConversation,
  onSettingsOpen,
  isCreatingConversation,
}: SidebarProps) {
  const pinnedConversations = conversations.filter((c) => c.isPinned);
  const recentConversations = conversations.filter((c) => !c.isPinned);

  const filteredPinned = pinnedConversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRecent = recentConversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#e6e6e6] dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 transition-all duration-300",
        isCollapsed ? "w-16" : "w-80"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>
        
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchToggle}
              className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewConversation}
              disabled={isCreatingConversation}
              className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <Plus className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      {!isCollapsed && showSearch && (
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm"
          />
        </div>
      )}

      {/* New Conversation Button */}
      {!isCollapsed && !showSearch && (
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={onNewConversation}
            disabled={isCreatingConversation}
            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Plus className="h-6 w-6 mr-3 text-gray-700 dark:text-gray-300" />
            <span className="text-lg font-normal text-gray-700 dark:text-gray-300">
              New Conversation
            </span>
          </Button>
        </div>
      )}

      {/* Conversations */}
      {!isCollapsed && (
        <div className="flex-1 px-4">
          <h2 className="text-base font-medium text-gray-600 dark:text-gray-400 mb-3">
            Conversations
          </h2>
          
          <ScrollArea className="flex-1 -mx-1">
            <div className="space-y-3">
              {/* Pinned Section */}
              {filteredPinned.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pinned
                    </span>
                  </div>
                  <ConversationList
                    conversations={filteredPinned}
                    activeConversationId={activeConversationId}
                    onSelect={onSelectConversation}
                    onPin={onPinConversation}
                    onDelete={onDeleteConversation}
                  />
                </div>
              )}

              {/* Recent Section */}
              {filteredRecent.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Recent
                    </span>
                  </div>
                  <ConversationList
                    conversations={filteredRecent}
                    activeConversationId={activeConversationId}
                    onSelect={onSelectConversation}
                    onPin={onPinConversation}
                    onDelete={onDeleteConversation}
                  />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Settings */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size={isCollapsed ? "icon" : "default"} 
              className={cn(
                "hover:bg-gray-200 dark:hover:bg-gray-800",
                isCollapsed ? "h-8 w-8 p-0" : "w-full justify-start"
              )}
            >
              <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {!isCollapsed && <span className="ml-2 text-lg font-normal">Settings</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onSettingsOpen('ai')}>
              AI Configuration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSettingsOpen('theme')}>
              Theme
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSettingsOpen('tokens')}>
              Token Usage
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSettingsOpen('profile')}>
              Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}