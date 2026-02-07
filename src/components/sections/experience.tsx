'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Briefcase, GraduationCap, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Experience {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  description: string
  current: boolean
  type: 'work' | 'education'
}

const experiences: Experience[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    startDate: '2022-03',
    endDate: null,
    current: true,
    type: 'work',
    description: 'Leading development of scalable web applications, mentoring junior developers, and implementing best practices for code quality and performance. Architected microservices-based solutions that improved system reliability by 40%.',
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'Digital Solutions LLC',
    location: 'New York, NY',
    startDate: '2020-06',
    endDate: '2022-02',
    current: false,
    type: 'work',
    description: 'Developed and maintained multiple client-facing applications using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines and automated testing, reducing deployment time by 60%.',
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'Creative Agency',
    location: 'Remote',
    startDate: '2019-01',
    endDate: '2020-05',
    current: false,
    type: 'work',
    description: 'Created responsive and interactive user interfaces for various clients. Collaborated with designers to implement pixel-perfect designs and ensured cross-browser compatibility.',
  },
  {
    id: '4',
    title: 'Junior Web Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    startDate: '2018-06',
    endDate: '2018-12',
    current: false,
    type: 'work',
    description: 'Started my professional journey building web applications. Learned industry best practices and contributed to the development of company\'s main product.',
  },
]

const education: Experience[] = [
  {
    id: '1',
    title: 'Bachelor of Science in Computer Science',
    company: 'University of Technology',
    location: 'Boston, MA',
    startDate: '2014-09',
    endDate: '2018-05',
    current: false,
    type: 'education',
    description: 'Graduated with honors. Focus on software engineering, algorithms, and web development. Active member of the coding club and hackathon participant.',
  },
]

function formatDateRange(startDate: string, endDate: string | null, current: boolean): string {
  const start = new Date(startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
  if (current) {
    return `${start} - Present`
  }
  const end = new Date(endDate!).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
  return `${start} - ${end}`
}

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  }

  const Icon = experience.type === 'education' ? GraduationCap : Briefcase

  return (
    <motion.div
      key={experience.id}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-primary/30"
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
      />
      <Card className="relative card-hover ml-6 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{experience.title}</h3>
                  <p className="text-lg text-primary font-medium">{experience.company}</p>
                </div>
                {experience.current && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className="shrink-0 gradient-text">Current</Badge>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="md:text-right flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDateRange(experience.startDate, experience.endDate, experience.current)}
              </div>
              {experience.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {experience.location}
                </div>
              )}
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <section id="experience" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-background via-background/50 to-muted/30 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Professional{' '}
            <span className="gradient-text">
              Experience
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My journey in the tech industry, from my first junior role to leading development
            teams and architecting scalable solutions.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto space-y-16 relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

          {/* Work Experience */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
              <motion.div
                className="p-2 bg-gradient-to-r from-primary to-primary/70 rounded-full glow"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              <span className="w-8 h-1 bg-white rounded-full" />
              Work Experience
            </h3>
            <div className="space-y-6">
              {experiences.map((experience, index) => (
                <ExperienceCard key={experience.id} experience={experience} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
              <motion.div
                className="p-2 bg-gradient-to-r from-secondary to-secondary/70 rounded-full"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1,
                }}
              />
              <span className="w-8 h-1 bg-white rounded-full" />
              Education
            </h3>
            <div className="space-y-6">
              {education.map((item, index) => (
                <ExperienceCard key={item.id} experience={item} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Download Resume Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Want to learn more about my experience and qualifications?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-lg font-medium card-hover shine-effect relative overflow-hidden"
            >
              <Building2 className="h-5 w-5" />
              Download Full Resume
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
