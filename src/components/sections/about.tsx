'use client'

// About section component
// Updated with Server icon


import { ScrollReveal, FadeIn } from '@/components/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n-context'
import { brand } from '@/lib/brand'
import {
  Calendar,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Download,
  Briefcase,
  GraduationCap,
  Code2,
  Heart,
  ExternalLink,
  Server,
  Palette,
  Smartphone,
} from 'lucide-react'

interface Experience {
  id: string
  type: 'work' | 'education'
  title: string
  company: string
  description: string
  startDate: string
  endDate?: string
  current?: boolean
}

interface Skill {
  name: string
  level: number
  icon: React.ComponentType<{ className?: string }>
  category: string
}

interface Language {
  name: string
  level: number
  flag: string
}

const experiences: Experience[] = [
  {
    id: '1',
    type: 'work',
    title: 'Senior Full Stack Developer',
    company: 'Tech Company',
    description: 'Leading development of scalable web applications using Next.js, React, and Node.js.',
    startDate: '2021-01',
    current: true,
  },
  {
    id: '2',
    type: 'work',
    title: 'Full Stack Developer',
    company: 'Digital Agency',
    description: 'Developed modern web applications for various clients using React and Vue.',
    startDate: '2019-06',
    endDate: '2020-12',
  },
  {
    id: '3',
    type: 'education',
    title: 'Bachelor\'s in Computer Science',
    company: 'University of Technology',
    description: 'Graduated with honors. Specialized in web development and database systems.',
    startDate: '2015-09',
    endDate: '2019-06',
  },
  {
    id: '4',
    type: 'education',
    title: 'Full Stack Web Development',
    company: 'Online Academy',
    description: 'Intensive bootcamp focusing on modern web technologies and best practices.',
    startDate: '2019-07',
    endDate: '2019-12',
  },
]

const skills: Skill[] = [
  { name: 'React / Next.js', level: 95, icon: Code2, category: 'Frontend' },
  { name: 'TypeScript', level: 90, icon: Code2, category: 'Language' },
  { name: 'Node.js', level: 88, icon: Code2, category: 'Backend' },
  { name: 'Database (PostgreSQL)', level: 85, icon: Server, category: 'Backend' },
  { name: 'Tailwind CSS', level: 92, icon: Palette, category: 'Styling' },
  { name: 'UI/UX Design', level: 87, icon: Smartphone, category: 'Design' },
  { name: 'Git / GitHub', level: 90, icon: Github, category: 'Tools' },
]

const languages: Language[] = [
  { name: 'English', level: 90, flag: '🇺🇸' },
  { name: 'Persian (فارسی)', level: 100, flag: '🇮🇷' },
]

export function About() {
  const { t } = useI18n()

  return (
    <section id="about" className="min-h-screen py-20 bg-muted/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background/90 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Header */}
        <ScrollReveal direction="up" delay={100}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"
              >
                <Heart className="h-8 w-8 text-primary-foreground" fill="currentColor" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {brand.shortNameFa}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {brand.shortNameEn} | {brand.roleEn}
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Bio */}
        <FadeIn delay={200}>
          <div className="mb-16">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-2">
                      Hello, I&apos;m {brand.fullNameEn}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      I build modern web products end-to-end with focus on performance, maintainability, and production reliability. My core stack includes Next.js, TypeScript, React, Node.js, and practical DevOps for fast and safe releases.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      <Button size="lg" className="gap-2 card-hover shine-effect" asChild>
                        <a href={`mailto:${brand.email}`}>
                        <Mail className="h-4 w-4" />
                        {t('contact.sendMessage')}
                        </a>
                      </Button>
                      <Button size="lg" variant="outline" className="gap-2" asChild>
                        <a href={brand.social.github} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          View GitHub
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-32 h-32 rounded-2xl bg-background flex items-center justify-center"
                    >
                      <Github className="h-16 w-16 text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Skills */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
              Key Skills
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <FadeIn key={skill.name} delay={index * 100}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="card-hover h-full">
                      <CardContent className="p-6 text-center space-y-3">
                        <motion.div
                          className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                        >
                          <skill.icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <h3 className="font-semibold text-sm">{skill.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {skill.category}
                        </Badge>
                        <motion.div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Languages */}
        <ScrollReveal direction="up" delay={400}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
              Languages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map((lang, index) => (
                <FadeIn key={lang.name} delay={index * 100}>
                  <Card className="card-hover">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <h3 className="font-semibold">{lang.name}</h3>
                          <motion.div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${lang.level}%` }}
                              transition={{ duration: 1, delay: index * 0.5 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </motion.div>
                        </div>
                      </div>
                      <Badge variant={lang.level >= 90 ? 'default' : 'secondary'} className="text-xs">
                        {lang.level >= 90 ? 'Native' : 'Professional'}
                      </Badge>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Experience Timeline */}
        <ScrollReveal direction="up" delay={500}>
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
              Experience & Education
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />

              <div className="space-y-8 ml-16">
                {experiences.map((exp, index) => (
                  <FadeIn key={exp.id} delay={index * 150}>
                    <motion.div
                      className="relative pl-8 pb-8"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Timeline Dot */}
                      <motion.div
                        className={`absolute left-0 top-0 w-4 h-4 rounded-full border-4 z-10 ${
                          exp.current
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`}
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        {exp.type === 'work' && <Briefcase className="h-2 w-2 text-white" />}
                        {exp.type === 'education' && <GraduationCap className="h-2 w-2 text-white" />}
                      </motion.div>

                      {/* Content */}
                      <Card className="card-hover ml-6">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-2 mb-2">
                            <motion.div
                              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                exp.type === 'work' ? 'bg-primary/10' : 'bg-accent/10'
                              }`}
                            >
                              {exp.type === 'work' && <Briefcase className="h-4 w-4 text-primary" />}
                              {exp.type === 'education' && <GraduationCap className="h-4 w-4 text-accent" />}
                            </motion.div>
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{exp.title}</h3>
                              <p className="text-sm text-muted-foreground mb-1">{exp.company}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{exp.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{exp.startDate}</span>
                            {exp.endDate && <span> - {exp.endDate}</span>}
                            {exp.current && (
                              <Badge className="ml-2" variant="outline">Current</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Call to Action */}
        <FadeIn delay={600}>
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold mb-2">
                  Ready to work together?
                </h2>
                <p className="text-muted-foreground">
                  I'm always interested in new opportunities and collaborations. Let's build something amazing together!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gap-2 card-hover shine-effect">
                    <Mail className="h-4 w-4" />
                    {t('contact.sendMessage')}
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    {t('portfolio.live')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Social Links */}
        <FadeIn delay={700}>
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Connect With Me</h3>
            <div className="flex gap-4 justify-center">
              {[Github, Linkedin, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-primary/10 rounded-full blur-md"
                  />
                  <Button variant="ghost" size="icon" className="h-12 w-12 relative z-10 card-hover">
                    <Icon className="h-5 w-5" />
                  </Button>
                </motion.a>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
