'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/animations'
import { useI18n } from '@/lib/i18n-context'
import { ArrowRight, Mail, Github, Linkedin, Twitter, Sparkles } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Hero() {
  const { t } = useI18n()

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 animated-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background/90 pointer-events-none" />

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none floating"
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-bl from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none floating"
        animate={{
          y: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <ScrollReveal direction="up" delay={100}>
            <div className="flex justify-center mb-8">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium glass"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.span
                  className="relative flex h-2 w-2"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </motion.span>
                <span className="text-sm font-medium">
                  {t('hero.available')}
                </span>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal direction="up" delay={200}>
            <motion.div variants={itemVariants} className="text-center space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('hero.description')}
              </p>
            </motion.div>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal direction="up" delay={300}>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => scrollToSection('#portfolio')}
                className="gap-2 card-hover shine-effect relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  {t('hero.viewWork')}
                </motion.span>
                <motion.div
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#contact')}
                className="gap-2 card-hover"
              >
                <Mail className="h-4 w-4" />
                {t('hero.getInTouch')}
              </Button>
            </motion.div>
          </ScrollReveal>

          {/* Social Links */}
          <ScrollReveal direction="up" delay={400}>
            <motion.div variants={itemVariants} className="flex gap-4 justify-center items-center">
              {[Github, Linkedin, Twitter].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 h-12 w-12 card-hover"
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="up" delay={500}>
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
              {[
                { value: '5+', label: t('hero.yearsExperience') },
                { value: '50+', label: t('hero.projectsCompleted') },
                { value: '30+', label: t('hero.happyClients') },
                { value: '10+', label: t('hero.awardsWon') },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-6 rounded-xl bg-card border border-border/50 card-hover"
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.div
                    className="text-3xl font-bold text-primary gradient-text"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </ScrollReveal>
        </motion.div>
      </div>
    </section>
  )
}
