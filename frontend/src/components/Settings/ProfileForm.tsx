import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Briefcase, Camera } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface ProfileFormProps {
  user: UserType | null;
  onSave: (profile: Partial<UserType>) => void;
}

export function ProfileForm({ user, onSave }: ProfileFormProps) {
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");

  const handleSave = () => {
    onSave({
      email: email || null,
      role: role || null,
      profilePhoto: profilePhoto || null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profilePhoto || undefined} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Label htmlFor="photo">Profile Photo URL</Label>
            <div className="flex space-x-2">
              <Input
                id="photo"
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={user?.username || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Username cannot be changed
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role / Occupation</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Developer, Designer, Manager"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Account Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Account Type:</span>
              <p className="font-medium">Free User</p>
            </div>
            <div>
              <span className="text-muted-foreground">Member Since:</span>
              <p className="font-medium">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Conversations:</span>
              <p className="font-medium">Active</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium text-green-600">Online</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline">Reset</Button>
          <Button onClick={handleSave}>Save Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}