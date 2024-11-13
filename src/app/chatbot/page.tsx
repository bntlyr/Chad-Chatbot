'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Menu, Plus, Home, MessageCircle, BookOpen, FileText, Settings, Send, Mic } from 'lucide-react'

type Message = {
  content: string
  sender: 'user' | 'chad'
}

type ChatSession = {
  id: string
  title: string
  messages: Message[]
}

type JournalEntry = {
  id: string
  title: string
  content: string
  date: string
}

type Resource = {
  id: string
  title: string
  description: string
  url: string
}

type NavButtonProps = {
  icon: ReactNode
  label: string
  tab: string
}

export default function Component() {
  const [activeTab, setActiveTab] = useState('home')
  const [input, setInput] = useState('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [resources] = useState<Resource[]>([
    { id: '1', title: 'Mindfulness Techniques', description: 'Learn various mindfulness techniques to reduce stress and anxiety.', url: '#' },
    { id: '2', title: 'CBT Workbook', description: 'A comprehensive guide to Cognitive Behavioral Therapy exercises.', url: '#' },
    { id: '3', title: 'Healthy Sleep Habits', description: 'Tips for improving your sleep quality and establishing a healthy sleep routine.', url: '#' },
  ])
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatSessions, activeChatId])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { content: input, sender: 'user' }
      if (activeChatId) {
        setChatSessions(prev => prev.map(session => 
          session.id === activeChatId 
            ? { ...session, messages: [...session.messages, newMessage] }
            : session
        ))
      } else {
        const newChatId = Date.now().toString()
        setChatSessions(prev => [...prev, { id: newChatId, title: input.slice(0, 30), messages: [newMessage] }])
        setActiveChatId(newChatId)
      }
      setInput('')
      setTimeout(() => {
        const chadResponse: Message = { content: `This is a response to: "${input}"`, sender: 'chad' }
        setChatSessions(prev => prev.map(session => 
          session.id === (activeChatId || prev[prev.length - 1].id)
            ? { ...session, messages: [...session.messages, chadResponse] }
            : session
        ))
      }, 1000)
    }
  }

  const addJournalEntry = (title: string, content: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toLocaleDateString()
    }
    setJournalEntries(prev => [...prev, newEntry])
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3">
        <Button 
          className="w-full bg-[#E3C5A8] hover:bg-[#E3C5A8]/90 text-white font-medium rounded-md text-sm"
          onClick={() => {
            setActiveChatId(null)
            setActiveTab('chat')
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          <NavButton icon={<Home className="h-5 w-5" />} label="Home" tab="home" />
          <NavButton icon={<MessageCircle className="h-5 w-5" />} label="Chat History" tab="history" />
          <NavButton icon={<FileText className="h-5 w-5" />} label="Journal" tab="journal" />
          <NavButton icon={<BookOpen className="h-5 w-5" />} label="Resources" tab="resources" />
          <NavButton icon={<Settings className="h-5 w-5" />} label="Settings" tab="settings" />
        </div>
      </ScrollArea>
    </div>
  )

  const NavButton = ({ icon, label, tab }: NavButtonProps) => (
    <Button
      variant="ghost"
      className={`w-full justify-start px-2 py-2 text-sm font-medium transition-colors ${
        activeTab === tab ? 'bg-[#E3C5A8]/10 text-[#B38B6D]' : 'text-gray-600 hover:bg-[#E3C5A8]/10'
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </Button>
  )

  return (
    <div className={`flex flex-col h-screen bg-white overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <header className="h-14 flex items-center px-4 bg-[#E3C5A8] border-b border-[#D4A373]">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6 text-white" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-800">
            <div className="h-14 flex items-center px-4 bg-[#E3C5A8] border-b border-[#D4A373]">
              <h1 className="text-lg font-semibold text-white">CHAD</h1>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold text-white">CHAD</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 overflow-hidden dark:bg-gray-900 dark:text-white">
        {activeTab === 'home' && (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Start A new Chat with Chad
              </h2>
              <Button 
                className="bg-[#E3C5A8] hover:bg-[#E3C5A8]/90 text-white font-medium px-6 py-2 rounded-md text-base shadow-md"
                onClick={() => setActiveTab('chat')}
              >
                Start Chatting
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4 mb-4 overflow-auto">
              {activeChatId && chatSessions.find(session => session.id === activeChatId)?.messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-[#E3C5A8] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button size="icon"                 className="bg-[#E3C5A8] hover:bg-[#E3C5A8]/90 text-white"
                onClick={handleSend}
              >
                <Send className="h-5 w-5" />
              </Button>
              <Button size="icon" className="bg-[#E3C5A8] hover:bg-[#E3C5A8]/90 text-white">
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Chat History</h2>
            {chatSessions.length > 0 ? (
              chatSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setActiveChatId(session.id)
                    setActiveTab('chat')
                  }}
                >
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-gray-500">
                    {session.messages.length > 0
                      ? session.messages[session.messages.length - 1].content.slice(0, 30)
                      : 'No messages yet'}
                  </p>
                </div>
              ))
            ) : (
              <p>No chat sessions found.</p>
            )}
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Journal Entries</h2>
            {journalEntries.length > 0 ? (
              journalEntries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{entry.title}</h3>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                  <p className="mt-2">{entry.content}</p>
                </div>
              ))
            ) : (
              <p>No journal entries found.</p>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <h3 className="font-medium">{resource.title}</h3>
                <p className="text-sm text-gray-500">{resource.description}</p>
                <a href={resource.url} className="text-[#E3C5A8] hover:underline mt-2 inline-block">
                  Learn more
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Dark Mode</Label>
              <Switch
                checked={darkMode}
                onCheckedChange={(checked) => setDarkMode(checked)}
                aria-label="Toggle Dark Mode"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Notifications</Label>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => setNotifications(checked)}
                aria-label="Toggle Notifications"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

