'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Code2, Database, Server, Zap, Shield, Cpu, BarChart3 } from 'lucide-react'

interface Skill {
  name: string
  category: string
  level: number
  icon?: React.ComponentType<{ className?: string }>
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Frontend': Code2,
  'Backend': Server,
  'Database': Database,
  'DevOps & Tools': Shield,
  'Testing & Quality': Cpu,
  'Design': Zap,
}

const skills: Skill[] = [
  // Frontend
  { name: 'React', category: 'Frontend', level: 95 },
  { name: 'Next.js', category: 'Frontend', level: 90 },
  { name: 'TypeScript', category: 'Frontend', level: 90 },
  { name: 'Tailwind CSS', category: 'Frontend', level: 95 },
  { name: 'Vue.js', category: 'Frontend', level: 80 },
  { name: 'HTML/CSS', category: 'Frontend', level: 100 },
  { name: 'JavaScript', category: 'Frontend', level: 95 },
  { name: 'Framer Motion', category: 'Frontend', level: 85 },

  // Backend
  { name: 'Node.js', category: 'Backend', level: 90 },
  { name: 'Express', category: 'Backend', level: 85 },
  { name: 'Python', category: 'Backend', level: 85 },
  { name: 'FastAPI', category: 'Backend', level: 80 },
  { name: 'REST APIs', category: 'Backend', level: 95 },
  { name: 'GraphQL', category: 'Backend', level: 80 },
  { name: 'WebSockets', category: 'Backend', level: 75 },

  // Database
  { name: 'PostgreSQL', category: 'Database', level: 85 },
  { name: 'MongoDB', category: 'Database', level: 85 },
  { name: 'MySQL', category: 'Database', level: 80 },
  { name: 'SQLite', category: 'Database', level: 90 },
  { name: 'Prisma', category: 'Database', level: 90 },
  { name: 'Redis', category: 'Database', level: 75 },

  // DevOps & Tools
  { name: 'Git', category: 'DevOps & Tools', level: 95 },
  { name: 'Docker', category: 'DevOps & Tools', level: 85 },
  { name: 'AWS', category: 'DevOps & Tools', level: 80 },
  { name: 'CI/CD', category: 'DevOps & Tools', level: 85 },
  { name: 'Linux', category: 'DevOps & Tools', level: 80 },
  { name: 'Nginx', category: 'DevOps & Tools', level: 75 },

  // Testing & Quality
  { name: 'Jest', category: 'Testing & Quality', level: 85 },
  { name: 'Cypress', category: 'Testing & Quality', level: 80 },
  { name: 'ESLint', category: 'Testing & Quality', level: 90 },
  { name: 'Prettier', category: 'Testing & Quality', level: 95 },

  // Design
  { name: 'Figma', category: 'Design', level: 85 },
  { name: 'UI/UX Design', category: 'Design', level: 80 },
  { name: 'Responsive Design', category: 'Design', level: 95 },
]

const categories = Array.from(new Set(skills.map(s => s.category)))

export function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const progressVariants = {
    hidden: { width: 0 },
    visible: { width: '100%' },
  }

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-background via-background/50 to-muted/30 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Technical{' '}
            <span className="gradient-text">
              Skills
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My technical expertise spans across frontend, backend, databases, DevOps,
            and design, enabling me to build complete, production-ready applications.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {categories.map((category, index) => {
            const categorySkills = skills.filter(s => s.category === category)
            const Icon = categoryIcons[category]

            return (
              <motion.div
                key={category}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="card-hover h-full glass">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl glow">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        {category}
                        <Badge variant="secondary" className="ml-2">
                          {categorySkills.length}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 + skillIndex * 0.05 + 2 }}
                            className="text-xs text-muted-foreground"
                          >
                            {skill.level}%
                          </motion.span>
                        </div>
                        <motion.div
                          variants={progressVariants}
                          className="h-2 bg-muted rounded-full overflow-hidden"
                        >
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            animate={{
                              width: [0, `${skill.level}%`, `${skill.level}%`],
                            }}
                            transition={{
                              duration: 1.5,
                              ease: "easeOut",
                              delay: index * 0.1 + skillIndex * 0.05 + 0.5,
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '25+', label: 'Technologies', icon: <Code2 className="h-8 w-8" /> },
            { value: '6', label: 'Categories', icon: <BarChart3 className="h-8 w-8" /> },
            { value: '5+', label: 'Years Coding', icon: <Zap className="h-8 w-8" /> },
            { value: '100%', label: 'Committed', icon: <Shield className="h-8 w-8" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="text-center p-8 rounded-2xl bg-card border border-border/50 card-hover"
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <motion.div
                className="mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
