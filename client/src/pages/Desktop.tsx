import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Menu,
  Search,
  Plus,
  Settings,
  Send,
  Paperclip,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConversationItem } from "@/components/ui/conversation-item";
import { MessageItem } from "@/components/ui/message-item";
import {
  AIConfigDialog,
  ThemeDialog,
  TokenUsageDialog,
  ProfileDialog,
} from "@/components/ui/settings-dialogs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User, Conversation, Message } from "@shared/schema";

export const Desktop = (): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  
  // Dialog states
  const [aiConfigOpen, setAiConfigOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [tokenUsageOpen, setTokenUsageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Fetch conversations
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  // Fetch messages for active conversation
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/conversations", activeConversationId, "messages"],
    enabled: !!activeConversationId,
  });

  // Fetch token usage data
  const { data: tokenData = [] } = useQuery({
    queryKey: ["/api/token-usage"],
    select: (data: any[]) =>
      data.map((item) => ({
        date: new Date(item.date).toLocaleDateString(),
        tokens: item.tokensUsed,
      })),
  });

  // Set active conversation to first one if none selected
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Mutations
  const createConversationMutation = useMutation({
    mutationFn: async (data: { title: string }) => {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (newConversation: Conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setActiveConversationId(newConversation.id);
      toast({ title: "New conversation created" });
    },
  });

  const updateConversationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Conversation> }) => {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setActiveConversationId(null);
      toast({ title: "Conversation deleted" });
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, role: "user", attachments: null }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", activeConversationId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentInput("");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Settings updated successfully" });
    },
  });

  // Event handlers
  const handleNewConversation = () => {
    createConversationMutation.mutate({
      title: "New Conversation",
    });
  };

  const handlePinConversation = (id: number) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      updateConversationMutation.mutate({
        id,
        updates: { isPinned: !conversation.isPinned },
      });
    }
  };

  const handleDeleteConversation = (id: number) => {
    deleteConversationMutation.mutate(id);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim() || !activeConversationId) return;
    
    createMessageMutation.mutate({
      conversationId: activeConversationId,
      content: currentInput,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r bg-muted/30 transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-80"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {!sidebarCollapsed && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewConversation}
                disabled={createConversationMutation.isPending}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Search */}
        {!sidebarCollapsed && showSearch && (
          <div className="p-4 border-b">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Conversations */}
        {!sidebarCollapsed && (
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === activeConversationId}
                  onClick={() => setActiveConversationId(conversation.id)}
                  onPin={handlePinConversation}
                  onDelete={handleDeleteConversation}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Settings */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={sidebarCollapsed ? "icon" : "default"} className="w-full justify-start">
                <Settings className="h-5 w-5" />
                {!sidebarCollapsed && <span className="ml-2">Settings</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setAiConfigOpen(true)}>
                <Bot className="mr-2 h-4 w-4" />
                AI Configuration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setThemeOpen(true)}>
                <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
                Theme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTokenUsageOpen(true)}>
                <div className="mr-2 h-4 w-4 bg-green-500 rounded" />
                Token Usage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                <div className="mr-2 h-4 w-4 bg-yellow-500 rounded-full" />
                Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-lg font-semibold">AI Chatbot</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profilePhoto || undefined} />
              <AvatarFallback>
                {user?.username?.slice(0, 2).toUpperCase() || "AI"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{user?.username || "Demo User"}</p>
              <p className="text-muted-foreground">{user?.role || "User"}</p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          {activeConversationId ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Welcome to AI Chatbot</h3>
                <p className="text-muted-foreground mb-4">
                  Select a conversation or create a new one to get started
                </p>
                <Button onClick={handleNewConversation}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        {activeConversationId && (
          <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-3">
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Drop Your Question"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12 min-h-[44px] resize-none"
                  />
                  <Button
                    size="icon"
                    className="absolute right-1 top-1 bottom-1 w-10 h-auto"
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || createMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AIConfigDialog
        open={aiConfigOpen}
        onOpenChange={setAiConfigOpen}
        user={user || null}
        onSave={(config) => updateUserMutation.mutate({ aiPreferences: config })}
      />
      
      <ThemeDialog open={themeOpen} onOpenChange={setThemeOpen} />
      
      <TokenUsageDialog
        open={tokenUsageOpen}
        onOpenChange={setTokenUsageOpen}
        tokenData={tokenData}
      />
      
      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={user || null}
        onSave={(profile) => updateUserMutation.mutate(profile)}
      />
    </div>
  );
};
