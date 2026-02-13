'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SearchBar } from '@/components/search/search-bar'
import { ExternalLink, Github, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { portfolioProjects } from '@/lib/profile-content'

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  featured?: boolean
}

const projects: Project[] = portfolioProjects

export function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach(p => p.tags.forEach(tag => tags.add(tag)))
    return ['all', ...Array.from(tags)]
  }, [])

  // Filter projects based on search and tag
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Tag filter
      const matchesTag = selectedTag === 'all' || project.tags.includes(selectedTag)

      return matchesSearch && matchesTag
    })
  }, [searchQuery, selectedTag])

  const featuredProjects = filteredProjects.filter(p => p.featured)
  const otherProjects = filteredProjects.filter(p => !p.featured)

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="portfolio" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-muted/30 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Featured{' '}
            <span className="gradient-text">
              Projects
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of my recent work that showcases my skills and passion for building
            exceptional digital experiences.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SearchBar
              placeholder="Search projects by title, description, or technology..."
              onSearch={setSearchQuery}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-2 justify-center"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by technology" />
              </SelectTrigger>
              <SelectContent>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag === 'all' ? 'All Technologies' : tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <motion.span
              className="text-sm text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ({filteredProjects.length} projects)
            </motion.span>
          </motion.div>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full" />
              Featured Projects
            </h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer"
                >
                  <Card className="card-hover h-full relative overflow-hidden group">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-primary/0 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300">
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 3 }}
                        >
                          <div className="text-center p-4">
                            <div className="text-4xl font-bold text-primary/20 mb-2">
                              {project.title.charAt(0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Project Preview
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                          >
                            <Badge variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          </motion.span>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {project.githubUrl && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2 card-hover"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(project.githubUrl, '_blank')
                            }}
                          >
                            <Github className="h-4 w-4" />
                            Code
                          </Button>
                        </motion.div>
                      )}
                      {project.liveUrl && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="flex-1 gap-2 shine-effect relative overflow-hidden"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(project.liveUrl, '_blank')
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live
                          </Button>
                        </motion.div>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔍
            </motion.div>
            <h3 className="text-2xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </motion.div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-secondary rounded-full" />
              More Projects
            </h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {otherProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer"
                >
                  <Card className="card-hover h-full group">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-primary/0 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300">
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 3 }}
                        >
                          <div className="text-center p-4">
                            <div className="text-4xl font-bold text-primary/20 mb-2">
                              {project.title.charAt(0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Project Preview
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-50"
              >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass">
                  <DialogHeader>
                    <DialogTitle className="text-2xl gradient-text">{selectedProject.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-primary/0 rounded-lg overflow-hidden relative">
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.05, 1],
                          transition: { duration: 3, repeat: Infinity }
                        }}
                      >
                        <div className="text-center p-4">
                          <div className="text-6xl font-bold text-primary/20 mb-2">
                            {selectedProject.title.charAt(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {selectedProject.title}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground">
                          {selectedProject.longDescription || selectedProject.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tags.map((tag) => (
                            <motion.div
                              key={tag}
                              whileHover={{ scale: 1.1, rotate: 3 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge variant="secondary">
                                {tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        {selectedProject.githubUrl && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                            <Button
                              className="w-full gap-2 card-hover"
                              onClick={() => window.open(selectedProject.githubUrl, '_blank')}
                            >
                              <Github className="h-4 w-4" />
                              View Code
                            </Button>
                          </motion.div>
                        )}
                        {selectedProject.liveUrl && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                            <Button
                              className="w-full gap-2 shine-effect relative overflow-hidden"
                              onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Live
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
