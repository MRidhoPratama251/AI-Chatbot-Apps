import { 
  users, conversations, messages, tokenUsage,
  type User, type InsertUser,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type TokenUsage, type InsertTokenUsage
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Conversation methods
  getConversations(userId: number): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  deleteConversation(id: number): Promise<boolean>;

  // Message methods
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Token usage methods
  getTokenUsage(userId: number, startDate?: Date, endDate?: Date): Promise<TokenUsage[]>;
  createTokenUsage(usage: InsertTokenUsage): Promise<TokenUsage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private tokenUsage: Map<number, TokenUsage>;
  private currentUserId: number;
  private currentConversationId: number;
  private currentMessageId: number;
  private currentTokenUsageId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.tokenUsage = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentTokenUsageId = 1;

    // Add sample data
    this.initSampleData();
  }

  private async initSampleData() {
    // Create sample user
    const user = await this.createUser({
      username: "demo_user",
      password: "password",
      email: "demo@example.com",
      role: "Developer",
      profilePhoto: null,
    });

    // Create sample conversations
    const conv1 = await this.createConversation({
      userId: user.id,
      title: "Crude apa saja yang diolah pa...",
      isPinned: false,
    });

    // Add sample messages
    await this.createMessage({
      conversationId: conv1.id,
      content: "Crude apa saja yang diolah pada bulan Mei 2025 ?",
      role: "user",
      attachments: null,
    });

    await this.createMessage({
      conversationId: conv1.id,
      content: "Pada bulan Mei 2025, unit pengolahan di Kilang Cilacap mengolah kombinasi dari beberapa jenis minyak mentah (crude oil) untuk memenuhi spesifikasi produk dan optimasi biaya operasional.\n\nJenis Crude Oil yang Diolah:\n\nMinas Crude: Merupakan crude oil yang diproduksi secara domestik dari sumur minyak di Indonesia. Ini adalah minyak mentah yang stabil dengan kadar sulfur rendah, sering digunakan sebagai base load di kilang kami.\n\nSaudi Light Crude: Diimpor dari Arab Saudi, minyak mentah ini memiliki kandungan sulfur yang moderat dan gravitasi API yang lebih ringan, sangat ideal untuk menghasilkan bensin dan nafta berkualitas tinggi.\n\nWTI (West Texas Intermediate) Crude: Jenis minyak mentah ini berasal dari Amerika Serikat. Digunakan sebagai topping untuk meningkatkan produksi produk-produk distillate ringan seperti avtur dan kerosene.",
      role: "assistant",
      attachments: null,
    });

    // Add sample token usage
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      await this.createTokenUsage({
        userId: user.id,
        tokensUsed: Math.floor(Math.random() * 5000) + 1000,
      });
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      profilePhoto: insertUser.profilePhoto || null,
      role: insertUser.role || null,
      aiPreferences: {
        maxTokens: 4000,
        personality: 'default',
        addressStyle: 'casual'
      }
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Conversation methods
  async getConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
      });
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const now = new Date();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      isPinned: insertConversation.isPinned || false,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;

    const updatedConversation = { 
      ...conversation, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }

  async deleteConversation(id: number): Promise<boolean> {
    // Delete associated messages
    Array.from(this.messages.values())
      .filter(message => message.conversationId === id)
      .forEach(message => this.messages.delete(message.id));
    
    return this.conversations.delete(id);
  }

  // Message methods
  async getMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      attachments: insertMessage.attachments as string[] | null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    
    // Update conversation timestamp
    await this.updateConversation(insertMessage.conversationId, { updatedAt: new Date() });
    
    return message;
  }

  // Token usage methods
  async getTokenUsage(userId: number, startDate?: Date, endDate?: Date): Promise<TokenUsage[]> {
    let usage = Array.from(this.tokenUsage.values())
      .filter(usage => usage.userId === userId);

    if (startDate) {
      usage = usage.filter(u => new Date(u.date!) >= startDate);
    }
    if (endDate) {
      usage = usage.filter(u => new Date(u.date!) <= endDate);
    }

    return usage.sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
  }

  async createTokenUsage(insertUsage: InsertTokenUsage): Promise<TokenUsage> {
    const id = this.currentTokenUsageId++;
    const usage: TokenUsage = {
      ...insertUsage,
      id,
      date: new Date(),
    };
    this.tokenUsage.set(id, usage);
    return usage;
  }
}

export const storage = new MemStorage();
