import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="flex items-center justify-center space-x-2 h-16"
          >
            <Sun className="h-5 w-5" />
            <span>Light Mode</span>
          </Button>
          
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="flex items-center justify-center space-x-2 h-16"
          >
            <Moon className="h-5 w-5" />
            <span>Dark Mode</span>
          </Button>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Quick Toggle</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes instantly
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center space-x-2"
            >
              <Monitor className="h-4 w-4" />
              <span>Toggle</span>
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Current theme:</strong> {theme === "light" ? "Light" : "Dark"} mode
            <br />
            Theme settings are automatically saved and will persist across sessions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}