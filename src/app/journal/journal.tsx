'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Mic, StopCircle, Play, Pause, MoreVertical, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type JournalEntry = {
  id: string
  title: string
  content: string
  date: Date
  type: 'text' | 'voice'
  audioUrls: string[]
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'First day of journaling',
      content: 'I decided to start journaling today. It feels good to write down my thoughts.',
      date: new Date(2023, 5, 15),
      type: 'text',
      audioUrls: []
    },
    {
      id: '2',
      title: 'Feeling accomplished',
      content: 'Completed a major project at work today. Feeling proud of my team and myself.',
      date: new Date(2023, 5, 17),
      type: 'text',
      audioUrls: []
    },
    {
      id: '3',
      title: 'Voice note: Weekend plans',
      content: '',
      date: new Date(2023, 5, 19),
      type: 'voice',
      audioUrls: ['/placeholder-audio.mp3']
    }
  ])
  const [newEntry, setNewEntry] = useState({ title: '', content: '', audioUrls: [] as string[] })
  const [isAdding, setIsAdding] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries))
  }, [entries])

  const handleAddEntry = () => {
    if (newEntry.title && (newEntry.content || newEntry.audioUrls.length > 0)) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        date: new Date(),
        type: newEntry.audioUrls.length > 0 ? 'voice' : 'text',
        audioUrls: newEntry.audioUrls
      }
      setEntries([entry, ...entries])
      setNewEntry({ title: '', content: '', audioUrls: [] })
      setIsAdding(false)
    }
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const handleEditEntry = (id: string) => {
    const entryToEdit = entries.find(entry => entry.id === id)
    if (entryToEdit) {
      setNewEntry({ title: entryToEdit.title, content: entryToEdit.content, audioUrls: entryToEdit.audioUrls })
      setIsAdding(true)
      setEditingId(id)
    }
  }

  const handleUpdateEntry = () => {
    if (editingId) {
      setEntries(entries.map(entry =>
        entry.id === editingId
          ? { ...entry, title: newEntry.title, content: newEntry.content, audioUrls: newEntry.audioUrls }
          : entry
      ))
      setNewEntry({ title: '', content: '', audioUrls: [] })
      setIsAdding(false)
      setEditingId(null)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      setIsRecording(true)

      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setNewEntry(prev => ({ ...prev, audioUrls: [...prev.audioUrls, url] }))
      }

      recorder.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast({
        title: "Error",
        description: "Unable to access microphone. Please check your permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const togglePlayPause = (url: string) => {
    if (isPlaying === url) {
      audioRef.current?.pause()
      setIsPlaying(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        setIsPlaying(url)
      }
    }
  }

  const removeAudio = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      audioUrls: prev.audioUrls.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Your Journal</h2>
          <p className="text-sm text-muted-foreground">
            Total Entries: {entries.length}
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="ml-auto rounded-full w-12 h-12 p-0 md:w-auto md:h-auto md:px-4 md:py-2"
          aria-label="New Entry"
        >
          <Plus className="h-6 w-6 md:mr-2 md:h-4 md:w-4" />
          <span className="hidden md:inline">New Entry</span>
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Journal Entry' : 'New Journal Entry'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Title"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="mb-2"
            />
            <Textarea
              placeholder="Write your thoughts..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="min-h-[100px] mb-2"
            />
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {newEntry.audioUrls.map((url, index) => (
                <div key={index} className="flex items-center bg-secondary rounded-full p-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => togglePlayPause(url)}
                  >
                    {isPlaying === url ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <span className="text-xs mx-2">Recording {index + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => removeAudio(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              {!isRecording ? (
                <Button  className="w-full md:w-auto" type="button" size="sm" onClick={startRecording}>
                  <Mic className="h-4 w-4 mr-2" />
                  Record Voice
                </Button>
              ) : (
                <Button className="w-full md:w-auto" type="button" size="sm" onClick={stopRecording} variant="destructive">
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full md:w-auto" onClick={editingId ? handleUpdateEntry : handleAddEntry}>
              {editingId ? 'Update Entry' : 'Save Entry'}
            </Button>
          </CardFooter>
        </Card>
      )}

      <ScrollArea className="flex-grow">
        {entries.map((entry) => (
          <Card key={entry.id} className="mb-4">
            <CardHeader className="pb-0 pt-2 px-4">
              <CardTitle className="flex justify-between items-center">
                <span className="truncate mr-2">{entry.title}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditEntry(entry.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteEntry(entry.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="hidden md:flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditEntry(entry.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-1 pb-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                {entry.date.toLocaleDateString()} at {entry.date.toLocaleTimeString()}
              </p>
              {entry.type === 'text' ? (
                <p className="pr-3 text-sm sm:text-base">{entry.content}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {entry.audioUrls.map((url, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => togglePlayPause(url)}
                    >
                      {isPlaying === url ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      Voice {index + 1}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      <audio ref={audioRef} onEnded={() => setIsPlaying(null)} />
    </div>
  )
}