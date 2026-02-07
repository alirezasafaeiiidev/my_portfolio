'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/animations'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
  rating: number
  company: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'CEO, Tech Startup',
    content: 'Working with this developer was an absolute pleasure. They delivered our project on time and exceeded all expectations. The attention to detail and problem-solving skills are exceptional.',
    avatar: '👨‍💼',
    rating: 5,
    company: 'InnovateTech Inc.',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Product Manager',
    content: 'Incredible developer with a deep understanding of modern web technologies. The portfolio website they built for us has significantly improved our online presence.',
    avatar: '👩‍💻',
    rating: 5,
    company: 'Digital Solutions Ltd.',
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'CTO',
    content: 'Outstanding work on our platform. Clean code, excellent communication, and delivered ahead of schedule. Highly recommend for any project.',
    avatar: '👨‍🦱',
    rating: 5,
    company: 'TechVentures',
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'Marketing Director',
    content: 'Amazing attention to detail and user experience. Our website conversion rate increased by 40% after the redesign.',
    avatar: '👩‍💼',
    rating: 5,
    company: 'BrandCo Agency',
  },
  {
    id: '5',
    name: 'David Wilson',
    role: 'Founder',
    content: 'Exceptional developer who brings creative solutions to complex problems. A true professional who delivers quality work consistently.',
    avatar: '👨‍🦲',
    rating: 5,
    company: 'Startup Studio',
  },
  {
    id: '6',
    name: 'Lisa Brown',
    role: 'Lead Designer',
    content: 'Best developer I\'ve worked with. Perfect balance between technical skills and creative design sensibilities.',
    avatar: '👩‍💼',
    rating: 5,
    company: 'Creative Agency',
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        nextSlide()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [autoPlay, currentIndex])

  const currentTestimonial = testimonials[currentIndex]

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/30 relative overflow-hidden">
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
            className="text-center space-y-4 mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Client Testimonials
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear what our clients have to say about working with us.
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Auto-play Toggle */}
        <ScrollReveal direction="up" delay={200}>
          <div className="flex justify-center mb-8">
            <Button
              variant={autoPlay ? 'default' : 'outline'}
              onClick={() => setAutoPlay(!autoPlay)}
              className="gap-2 card-hover"
            >
              {autoPlay ? '⏸️ Pause Auto-play' : '▶️ Start Auto-play'}
            </Button>
          </div>
        </ScrollReveal>

        {/* Testimonials Slider */}
        <ScrollReveal direction="up" delay={300}>
          <div className="relative">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-0 top-1/2 z-20 h-12 w-12 card-hover"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-0 top-1/2 z-20 h-12 w-12 card-hover"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Carousel */}
            <div className="overflow-hidden mx-8">
              <AnimatePresence mode="wait" custom direction={direction}>
                <motion.div
                  key={currentIndex}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -50) {
                      nextSlide()
                    } else if (offset.x > 50) {
                      prevSlide()
                    }
                  }}
                  className="max-w-2xl mx-auto"
                >
                  <Card className="card-hover border-primary/20">
                    <CardContent className="p-8 text-center space-y-6">
                      {/* Avatar */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6 }}
                        className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4 text-4xl"
                      >
                        {currentTestimonial.avatar}
                      </motion.div>

                      {/* Quote */}
                      <Quote className="h-12 w-12 text-primary/20 mx-auto mb-6 block" />

                      {/* Name & Role */}
                      <h3 className="text-xl font-bold mb-2">{currentTestimonial.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {currentTestimonial.role}
                      </p>
                      <Badge className="mb-4" variant="secondary">
                        {currentTestimonial.company}
                      </Badge>

                      {/* Content */}
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        "{currentTestimonial.content}"
                      </p>

                      {/* Rating */}
                      <div className="flex justify-center gap-1 mt-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= currentTestimonial.rating
                                ? 'fill-primary'
                                : 'text-muted-foreground'
                            }`}
                            fill={star <= currentTestimonial.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary scale-125'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={400}>
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold mb-2">
                  Ready to work together?
                </h2>
                <p className="text-muted-foreground">
                  Join our list of satisfied clients. Let\'s create something amazing together!
                </p>
                <Button size="lg" className="gap-2 card-hover shine-effect">
                  Get In Touch
                  <Quote className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
