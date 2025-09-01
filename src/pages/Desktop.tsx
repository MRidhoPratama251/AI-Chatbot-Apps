import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { ChatTopBar } from "@/components/Chat/ChatTopBar";
import { ChatArea } from "@/components/Chat/ChatArea";
import { PromptInput } from "@/components/Chat/PromptInput";
import { SettingsDialog } from "@/components/Settings/SettingsDialog";
import type { User, Conversation, Message } from "@shared/schema";

export const Desktop = (): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

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
    queryKey: [`/api/conversations/${activeConversationId}/messages`],
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
      
      // Send pending message if there is one
      if (pendingMessage) {
        createMessageMutation.mutate({
          conversationId: newConversation.id,
          content: pendingMessage,
          role: "user"
        });
        setPendingMessage(null);
      }
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

  // 🔌 API COMMUNICATION: Main mutation for sending messages to backend
  // This sends user messages to /api/conversations/:id/messages endpoint
  // The backend processes the message and generates AI responses using OpenRouter API
  // const createMessageMutation = useMutation({
  //   mutationFn: async ({ conversationId, content, role = "user" }: { conversationId: number; content: string; role?: string }) => {
  //     // 📡 BACKEND API CALL: POST request to create new message
  //     // Currently uses Node.js/Express backend (server/routes.ts)
  //     // TODO: Switch to Python FastAPI backend (backend/app/api/routes_chat.py)
  //     const response = await fetch(`/api/conversations/${conversationId}/messages`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ content, role, attachments: null }),
  //     });
  //     return response.json();
  //   },
  //   onSuccess: (_, variables) => {
  //     // Clear input immediately
  //     setCurrentInput("");
      
  //     // Refetch messages to show the new message
  //     queryClient.invalidateQueries({ queryKey: [`/api/conversations/${variables.conversationId}/messages`] });
      
  //     // Refetch after delay to catch AI response
  //     setTimeout(() => {
  //       queryClient.invalidateQueries({ queryKey: [`/api/conversations/${variables.conversationId}/messages`] });
  //     }, 1500);
      
  //     // Update conversations list
  //     queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
  //   },
  //   onError: () => {
  //     toast({ title: "Failed to send message", variant: "destructive" });
  //   },
  // });

  const createMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content, role = "user" }: { conversationId: number; content: string; role?: string }) => {
      // 📡 BACKEND API CALL: POST request to FastAPI backend
      const response = await fetch(`/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,  // FastAPI expects this in body
          content,
          role,
          attachments: null,
        }),
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Clear input immediately
      setCurrentInput("");

      // Refetch messages with FastAPI endpoint
      queryClient.invalidateQueries({ queryKey: [`/chat/history/${variables.conversationId}`] });

      // Refetch after delay to catch AI response
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [`/chat/history/${variables.conversationId}`] });
      }, 1500);

      // Update conversations list (⚠️ kalau FastAPI tidak punya endpoint ini, mungkin perlu diadaptasi)
      queryClient.invalidateQueries({ queryKey: ["/chat/history"] });
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
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

  // 🚀 MESSAGE HANDLER: Entry point for user message sending
  // This function is called from PromptInput component when user sends a message
  const handleSendMessage = (text: string, files?: File[]) => {
    if (!text.trim()) return;
    
    // If no active conversation, create one first
    if (!activeConversationId) {
      setPendingMessage(text);
      // 📡 BACKEND API CALL: Create new conversation
      createConversationMutation.mutate({
        title: text.length > 50 ? text.substring(0, 50) + "..." : text,
      });
      return;
    }
    
    // 📡 BACKEND API CALL: Send message to existing conversation
    // This triggers the LLM processing in the backend
    createMessageMutation.mutate({
      conversationId: activeConversationId,
      content: text,
      role: "user"
    });
  };

  const handleSettingsOpen = (setting: 'ai' | 'theme' | 'tokens' | 'profile') => {
    setSettingsOpen(true);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        searchQuery={searchQuery}
        showSearch={showSearch}
        onSearchChange={setSearchQuery}
        onSearchToggle={() => setShowSearch(!showSearch)}
        onNewConversation={handleNewConversation}
        onSelectConversation={setActiveConversationId}
        onPinConversation={handlePinConversation}
        onDeleteConversation={handleDeleteConversation}
        onSettingsOpen={handleSettingsOpen}
        isCreatingConversation={createConversationMutation.isPending}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ChatTopBar user={user} />
        
        <ChatArea
          messages={messages}
          activeConversationId={activeConversationId}
          onRegenerate={(messageId) => console.log('Regenerate:', messageId)}
        />
        
        {activeConversationId && (
          <PromptInput
            value={currentInput}
            onChange={setCurrentInput}
            onSend={handleSendMessage}
            disabled={createMessageMutation.isPending}
            isLoading={createMessageMutation.isPending}
          />
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        user={user || null}
        onUserUpdate={(updates) => updateUserMutation.mutate(updates)}
        tokenData={tokenData}
      />
    </div>
  );
};
