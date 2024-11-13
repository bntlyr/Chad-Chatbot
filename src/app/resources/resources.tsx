'use client'

import { useState } from 'react'
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableOfContents, BookOpen, Video, Headphones, Link, Search, ExternalLink } from 'lucide-react'

type Resource = {
  id: string
  title: string
  description: string
  link: string
  type: 'article' | 'video' | 'audio' | 'external'
}

const initialResources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety',
    description: 'A comprehensive guide to understanding and managing anxiety.',
    link: 'https://example.com/anxiety-guide',
    type: 'article'
  },
  {
    id: '2',
    title: 'Meditation for Beginners',
    description: 'Learn the basics of meditation with this introductory video.',
    link: 'https://example.com/meditation-video',
    type: 'video'
  },
  {
    id: '3',
    title: 'Stress Relief Techniques',
    description: 'Audio guide with practical stress relief techniques you can use anywhere.',
    link: 'https://example.com/stress-relief-audio',
    type: 'audio'
  },
  {
    id: '4',
    title: 'National Mental Health Resources',
    description: 'Directory of mental health resources and helplines.',
    link: 'https://example.com/mental-health-resources',
    type: 'external'
  },
]
export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getIconForType = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return <BookOpen className="h-6 w-6" />
      case 'video':
        return <Video className="h-6 w-6" />
      case 'audio':
        return <Headphones className="h-6 w-6" />
      case 'external':
        return <Link className="h-6 w-6" />
    }
  }

  return (
    <div className="flex h-full">
      <Sidebar setActiveTab={setActiveTab} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Healing Resources</h2>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Tabs defaultValue="all" className="flex-grow flex flex-col">
        <div className="mb-4 overflow-x-auto">
          {/* TabsList - Horizontal scrolling enabled */}
          <TabsList className="flex space-x-2 min-w-max">
            <TabsTrigger value="all" className="whitespace-nowrap text-center flex-shrink-0">
              {/* Icon for "All" tab */}
              <TableOfContents className="h-5 w-5 sm:hidden" /> {/* Hide text on mobile */}
              <span className="hidden sm:inline">{/* Text for "All" tab */}All</span>
            </TabsTrigger>
            <TabsTrigger value="article" className="whitespace-nowrap text-center flex-shrink-0">
              {/* Icon for "Article" tab */}
              <BookOpen className="h-5 w-5 sm:hidden" /> {/* Hide text on mobile */}
              <span className="hidden sm:inline">{/* Text for "Article" tab */}Articles</span>
            </TabsTrigger> 
            <TabsTrigger value="video" className="whitespace-nowrap text-center flex-shrink-0">
              {/* Icon for "Video" tab */}
              <Video className="h-5 w-5 sm:hidden" /> {/* Hide text on mobile */}
              <span className="hidden sm:inline">{/* Text for "Video" tab */}Videos</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="whitespace-nowrap text-center flex-shrink-0">
              {/* Icon for "Audio" tab */}
              <Headphones className="h-5 w-5 sm:hidden" /> {/* Hide text on mobile */}
              <span className="hidden sm:inline">{/* Text for "Audio" tab */}Audio</span>
            </TabsTrigger>
            <TabsTrigger value="external" className="whitespace-nowrap text-center flex-shrink-0">
              {/* Icon for "External" tab */}
              <Link className="h-5 w-5 sm:hidden" /> {/* Hide text on mobile */}
              <span className="hidden sm:inline">{/* Text for "External" tab */}External</span>
            </TabsTrigger>
          </TabsList>
          </div>

          <ScrollArea className="flex-grow">
          <TabsContent value="all" className="mt-0">
            <ResourceGrid resources={filteredResources} />
          </TabsContent>
          <TabsContent value="article" className="mt-0">
            <ResourceGrid resources={filteredResources.filter(r => r.type === 'article')} />
          </TabsContent>
          <TabsContent value="video" className="mt-0">
            <ResourceGrid resources={filteredResources.filter(r => r.type === 'video')} />
          </TabsContent>
          <TabsContent value="audio" className="mt-0">
            <ResourceGrid resources={filteredResources.filter(r => r.type === 'audio')} />
          </TabsContent>
          <TabsContent value="external" className="mt-0">
            <ResourceGrid resources={filteredResources.filter(r => r.type === 'external')} />
          </TabsContent>
        </ScrollArea>
        </Tabs>
      </div>
    </div>
  )

  function ResourceGrid({ resources }: { resources: Resource[] }) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
        {resources.map((resource) => (
          <Card key={resource.id} className="flex flex-col p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="p-2 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                {getIconForType(resource.type)}
                <span className="truncate">{resource.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-2 sm:p-4">
              <p className="text-sm sm:text-base text-muted-foreground">{resource.description}</p>
            </CardContent>
            <CardFooter className="p-2 sm:p-4">
              <Button variant="outline" className="w-full text-xs sm:text-sm" asChild>
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  Open Resource
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
}
