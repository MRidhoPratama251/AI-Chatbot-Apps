import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { type User } from "@shared/schema";
import { DatePicker } from "./date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AIConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (config: any) => void;
}

export function AIConfigDialog({ open, onOpenChange, user, onSave }: AIConfigDialogProps) {
  const [maxTokens, setMaxTokens] = useState(user?.aiPreferences?.maxTokens || 4000);
  const [personality, setPersonality] = useState<"default" | "robot" | "cynic" | "expert">(user?.aiPreferences?.personality || "default");
  const [addressStyle, setAddressStyle] = useState(user?.aiPreferences?.addressStyle || "casual");

  const handleSave = () => {
    onSave({
      maxTokens,
      personality,
      addressStyle,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Configuration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tokens">Maximum Token Limit: {maxTokens}</Label>
            <Slider
              id="tokens"
              min={1000}
              max={8000}
              step={100}
              value={[maxTokens]}
              onValueChange={(value) => setMaxTokens(value[0])}
              className="w-full"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="personality">AI Personality</Label>
            <Select value={personality} onValueChange={(value: "default" | "robot" | "cynic" | "expert") => setPersonality(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select personality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="robot">Robot (Efficient & Rigid)</SelectItem>
                <SelectItem value="cynic">Cynic</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">How should I address you?</Label>
            <Input
              id="address"
              value={addressStyle}
              onChange={(e) => setAddressStyle(e.target.value)}
              placeholder="e.g., casual, formal, by name"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeDialog({ open, onOpenChange }: ThemeDialogProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Light Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use light colors and backgrounds
              </p>
            </div>
            <Switch
              checked={theme === "light"}
              onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use dark colors and backgrounds
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TokenUsageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenData: Array<{ date: string; tokens: number }>;
}

export function TokenUsageDialog({ open, onOpenChange, tokenData }: TokenUsageDialogProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filteredData = tokenData.filter(item => {
    const itemDate = new Date(item.date);
    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Token Usage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label>Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="flex-1">
              <Label>End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Token Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tokens" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {filteredData.reduce((sum, item) => sum + item.tokens, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total Tokens</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {filteredData.length ? Math.round(filteredData.reduce((sum, item) => sum + item.tokens, 0) / filteredData.length).toLocaleString() : 0}
                </div>
                <p className="text-xs text-muted-foreground">Daily Average</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (profile: Partial<User>) => void;
}

export function ProfileDialog({ open, onOpenChange, user, onSave }: ProfileDialogProps) {
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");

  const handleSave = () => {
    onSave({
      email: email || null,
      role: role || null,
      profilePhoto: profilePhoto || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Role/Job</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Developer, Designer, Manager"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="photo">Profile Photo URL</Label>
            <Input
              id="photo"
              value={profilePhoto}
              onChange={(e) => setProfilePhoto(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}