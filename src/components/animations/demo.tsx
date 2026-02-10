'use client'

import { FadeIn } from './fade-in'
import { ScrollReveal } from './scroll-reveal'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Code2, Palette, Zap } from 'lucide-react'

/**
 * Animation Components Demo
 *
 * This component demonstrates how to use the FadeIn and ScrollReveal animation components.
 *
 * Usage Examples:
 *
 * 1. FadeIn - Simple fade-in animation when element enters viewport
 *    <FadeIn delay={100} duration={500}>
 *      <YourContent />
 *    </FadeIn>
 *
 * 2. ScrollReveal - Animated reveal from different directions
 *    <ScrollReveal direction="up" delay={200}>
 *      <YourContent />
 *    </ScrollReveal>
 */

export function AnimationDemo() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Animation{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Components
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lightweight scroll animations using Intersection Observer API.
              Perfect for adding life to your pages without heavy dependencies.
            </p>
          </div>
        </FadeIn>

        {/* Animation Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* FadeIn Example */}
          <ScrollReveal direction="up" delay={100}>
            <div className="p-8 rounded-xl border bg-card space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">FadeIn</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple opacity transition
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm font-mono">
                  &lt;FadeIn delay={0} duration={500}&gt;
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  &nbsp;&nbsp;Your Content
                </p>
                <p className="text-sm font-mono">
                  &lt;/FadeIn&gt;
                </p>
              </div>
              <Button variant="outline" className="w-full gap-2">
                Try It
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>

          {/* ScrollReveal Example */}
          <ScrollReveal direction="down" delay={200}>
            <div className="p-8 rounded-xl border bg-card space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ScrollReveal</h3>
                  <p className="text-sm text-muted-foreground">
                    Multi-directional reveal
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm font-mono">
                  &lt;ScrollReveal direction="up"&gt;
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  &nbsp;&nbsp;Your Content
                </p>
                <p className="text-sm font-mono">
                  &lt;/ScrollReveal&gt;
                </p>
              </div>
              <Button variant="outline" className="w-full gap-2">
                Try It
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>
        </div>

        {/* Direction Examples */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">
            ScrollReveal Directions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { direction: 'up' as const, label: 'Up ↑', delay: 300 },
              { direction: 'down' as const, label: 'Down ↓', delay: 400 },
              { direction: 'left' as const, label: 'Left ←', delay: 500 },
              { direction: 'right' as const, label: 'Right →', delay: 600 },
            ].map((item) => (
              <ScrollReveal key={item.direction} direction={item.direction} delay={item.delay}>
                <div className="p-6 rounded-lg border bg-card text-center hover:border-primary/50 transition-colors">
                  <div className="text-sm font-semibold mb-2">{item.label}</div>
                  <div className="text-xs text-muted-foreground">
                    delay={item.delay}ms
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Staggered Animation Example */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Staggered Animations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((num, index) => (
              <FadeIn key={num} delay={index * 100} duration={400}>
                <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center h-32">
                  <div className="text-4xl font-bold text-primary/40">
                    {num}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Performance Note */}
        <FadeIn delay={800}>
          <div className="p-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Performance Benefits</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Uses native IntersectionObserver API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Zero runtime dependencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Lightweight (~1KB each)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Works with SSR/CSR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Customizable delay and duration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Configurable threshold</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Usage Tips */}
        <FadeIn delay={900}>
          <div className="p-6 rounded-xl bg-card border space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Palette className="h-5 w-5 text-accent" />
              </div>
              <h4 className="font-bold">Pro Tips</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">1. Stagger animations:</span>
                <p className="text-muted-foreground mt-1">
                  Use different delays to create cascading effects.
                  Example: delay value like index * 100 creates a 100ms stagger.
                </p>
              </div>
              <div>
                <span className="font-semibold">2. Combine with other animations:</span>
                <p className="text-muted-foreground mt-1">
                  FadeIn and ScrollReveal work great with Framer Motion,
                  use ScrollReveal for section entrances and Framer for micro-interactions.
                </p>
              </div>
              <div>
                <span className="font-semibold">3. Adjust threshold:</span>
                <p className="text-muted-foreground mt-1">
                  Lower thresholds trigger sooner (0.1 = 10% visible),
                  higher thresholds wait longer (0.5 = 50% visible).
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
