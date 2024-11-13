'use client'

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, FileText, BookOpen, MessageCircle, User, Settings, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
}

const Sidebar = ({ setActiveTab, isDarkMode, setIsDarkMode }: SidebarProps) => (
  <div className="bg-background text-foreground w-64 p-4 hidden lg:flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-primary">CHAD</h2>
    </div>
    <ScrollArea className="flex-grow mb-4">
      <nav>
        <ul className="space-y-2">
          <li><Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('home')}><Home className="mr-2 h-4 w-4" /> Home</Button></li>
          <li><Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('journal')}><FileText className="mr-2 h-4 w-4" /> Journal</Button></li>
          <li><Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('resources')}><BookOpen className="mr-2 h-4 w-4" /> Resources</Button></li>
          <li><Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('history')}><MessageCircle className="mr-2 h-4 w-4" /> Chat History</Button></li>
          <li><Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('profile')}><User className="mr-2 h-4 w-4" /> Profile</Button></li>
        </ul>
      </nav>
    </ScrollArea>
    <div className="border-t border-border pt-4">
      <Button variant="ghost" className="w-full justify-start mb-2 hover:bg-secondary">
        <Settings className="mr-2 h-4 w-4" /> Settings
      </Button>
      <Button variant="ghost" className="w-full justify-start hover:bg-secondary" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
        {isDarkMode ? 'Light mode' : 'Dark mode'}
      </Button>
    </div>
  </div>
);

export default Sidebar;
