'use client'

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun } from 'lucide-react';

interface TopNavProps {
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
}

const TopNav = ({ setActiveTab, isDarkMode, setIsDarkMode }: TopNavProps) => (
  <header className="bg-background border-b border-border p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <h1 className="text-2xl font-bold text-primary">CHAD</h1>
    </div>
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        <span className="sr-only">{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setActiveTab('profile')} aria-label="Open profile">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </Button>
    </div>
  </header>
);

export default TopNav;
