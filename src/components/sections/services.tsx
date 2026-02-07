'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Shield, Zap, Code2, Layers, Globe, Smartphone, Check, ArrowRight } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  price: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
  popular?: boolean
}

const services: Service[] = [
  {
    id: '1',
    title: 'Frontend Development',
    description: 'Modern, responsive, and accessible web applications built with React, Next.js, and TypeScript.',
    price: '$75/hour',
    features: [
      'React & Next.js Applications',
      'TypeScript Development',
      'Responsive Design',
      'Performance Optimization',
    ],
    icon: Code2,
    popular: true,
  },
  {
    id: '2',
    title: 'Full Stack Applications',
    description: 'End-to-end web applications including database design and API development.',
    price: '$120/hour',
    features: [
      'Database Design & Integration',
      'RESTful API Development',
      'Authentication Systems',
      'Real-time Features',
    ],
    icon: Layers,
    popular: true,
  },
  {
    id: '3',
    title: 'UI/UX Design',
    description: 'Beautiful and intuitive user interfaces that users love to use.',
    price: '$65/hour',
    features: [
      'Wireframing & Prototyping',
      'Responsive Design',
      'Design Systems',
      'Component Libraries',
    ],
    icon: Smartphone,
  },
  {
    id: '4',
    title: 'Performance Optimization',
    description: 'Make your applications lightning fast with optimization techniques.',
    price: '$100/hour',
    features: [
      'Code Splitting',
      'Image Optimization',
      'Caching Strategies',
      'Bundle Size Reduction',
    ],
    icon: Zap,
  },
  {
    id: '5',
    title: 'Consulting & Support',
    description: 'Expert advice and ongoing support for your projects.',
    price: '$150/hour',
    features: [
      'Code Reviews',
      'Architecture Consulting',
      'Performance Audits',
      'Best Practices Guidance',
    ],
    icon: Shield,
  },
  {
    id: '6',
    title: 'API Development',
    description: 'Robust and scalable APIs for your applications.',
    price: '$110/hour',
    features: [
      'RESTful API Design',
      'GraphQL Integration',
      'API Documentation',
      'Rate Limiting & Security',
    ],
    icon: Globe,
  },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0 },
}

export function Services() {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-background via-background/50 to-muted/30 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            My{' '}
            <span className="gradient-text">
              Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional services tailored to your needs, from concept to deployment.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card
                className={`card-hover h-full relative overflow-hidden group ${
                  service.popular ? 'border-2 border-primary' : 'border-border'
                }`}
              >
                {service.popular && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-4 right-4 z-10"
                  >
                    <Badge className="bg-primary text-primary-foreground gradient-text">
                      Popular
                    </Badge>
                  </motion.div>
                )}
                <CardHeader>
                  <motion.div
                    className="flex items-start justify-between"
                  >
                    <motion.div
                      className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl glow"
                      whileHover={{ scale: 1.1, rotate: 3 }}
                    >
                      <service.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </motion.div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <motion.div
                          className="h-5 w-5 text-muted-foreground shrink-0"
                          animate={{
                            scale: [1, 1.1, 1],
                            transition: { duration: 2, repeat: Infinity },
                          }}
                        >
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        </motion.div>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    <motion.span
                      className="text-2xl font-bold text-primary mb-2 gradient-text"
                      animate={{
                        scale: [1, 1.05, 1],
                        transition: { duration: 3, repeat: Infinity },
                      }}
                    >
                      {service.price}
                    </motion.span>
                    <span className="text-sm text-muted-foreground">
                      hourly rate
                    </span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="flex-1 shine-effect relative overflow-hidden">
                      Get Quote
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-muted-foreground mb-4">
            Need a custom solution for your next project?
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="gap-2">
              Let's Talk
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
