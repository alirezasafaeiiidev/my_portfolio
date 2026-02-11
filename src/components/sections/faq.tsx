import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, ArrowRight } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    question: 'What technologies do you use?',
    answer: 'I specialize in modern web technologies including Next.js, React, TypeScript, Node.js, and various databases like PostgreSQL and MongoDB. For styling, I use Tailwind CSS with shadcn/ui components.',
    category: 'General',
  },
  {
    question: 'Do you work with clients remotely?',
    answer: 'Yes! I work with clients from all over the world. We can collaborate through video calls, messaging apps, or email. I use tools like GitHub for project management and code review.',
    category: 'Collaboration',
  },
  {
    question: 'What is your typical timeline for a project?',
    answer: 'Simple landing pages or portfolios: 1-2 weeks. Full-stack applications: 2-6 weeks. Complex web applications: 1-3 months. The timeline depends on project scope, requirements, and features.',
    category: 'Timeline',
  },
  {
    question: 'Do you provide ongoing support after project completion?',
    answer: 'Absolutely! I offer ongoing maintenance, bug fixes, and feature additions. Support packages can be tailored to your needs with hourly rates or retainer arrangements.',
    category: 'Support',
  },
  {
    question: 'Can you help me choose the right technology stack for my project?',
    answer: "I'd be happy to help! During our initial consultation, I'll discuss your requirements, budget, timeline, and goals. Then I'll recommend a tech stack that balances performance, maintainability, and team expertise.",
    category: 'Consulting',
  },
  {
    question: 'Do you create mobile apps?',
    answer: 'Currently I specialize in web applications. However, I can work with React Native or Flutter for cross-platform mobile apps, or connect you with mobile developers from my network.',
    category: 'Capabilities',
  },
  {
    question: 'What is your pricing structure?',
    answer: 'I offer flexible pricing based on project complexity and scope: simple projects start at $2,000, mid-size projects at $5,000+, and large projects at $10,000+. Consulting is $150/hour. All prices include a detailed scope and deliverables document.',
    category: 'Pricing',
  },
  {
    question: 'How do you handle project changes?',
    answer: "I embrace change! Before starting any significant work, we document the change in writing. This ensures everyone is aligned and helps us track progress. Small changes within scope are typically included, while major changes require updated estimates.",
    category: 'Process',
  },
  {
    question: 'Can you work with my existing team?',
    answer: "Yes! I can collaborate with your in-house team, lead them, or augment your capabilities during peak times. I provide detailed code reviews and mentorship to help your team grow.",
    category: 'Collaboration',
  },
]

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? Here are answers to the most common ones.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-6 pb-2">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Category: <Badge variant="secondary">{faq.category}</Badge>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Still have questions? Let's discuss your project.
          </p>
          <Button size="lg" className="gap-2">
            Get In Touch
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
