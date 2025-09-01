import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@shared/schema";

interface AIConfigurationProps {
  user: User | null;
  onSave: (config: any) => void;
}

export function AIConfiguration({ user, onSave }: AIConfigurationProps) {
  const [maxTokens, setMaxTokens] = useState(
    user?.aiPreferences?.maxTokens || 1024
  );
  const [personality, setPersonality] = useState<
    "default" | "robot" | "cynic" | "expert"
  >(user?.aiPreferences?.personality || "default");
  const [addressStyle, setAddressStyle] = useState(
    user?.aiPreferences?.addressStyle || "casual"
  );

  const handleSave = () => {
    onSave({
      maxTokens,
      personality,
      addressStyle,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tokens">
            Maximum Token Limit: {maxTokens.toLocaleString()}
          </Label>
          <Slider
            id="tokens"
            min={256}
            max={8192}
            step={64}
            value={[maxTokens]}
            onValueChange={(value) => setMaxTokens(value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Higher values allow for longer responses but consume more resources
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="personality">AI Personality</Label>
          <Select 
            value={personality} 
            onValueChange={(value: "default" | "robot" | "cynic" | "expert") => 
              setPersonality(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select personality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default - Helpful and balanced</SelectItem>
              <SelectItem value="robot">Robot - Efficient and precise</SelectItem>
              <SelectItem value="cynic">Cynic - Critical and analytical</SelectItem>
              <SelectItem value="expert">Expert - Technical and detailed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address Style</Label>
          <Select value={addressStyle} onValueChange={setAddressStyle}>
            <SelectTrigger>
              <SelectValue placeholder="How should I address you?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  );
}