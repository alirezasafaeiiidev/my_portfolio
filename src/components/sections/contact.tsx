'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, MapPin, Github, Linkedin, Twitter, Instagram, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { brand } from '@/lib/brand'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n-context'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: brand.contactEmail,
    href: `mailto:${brand.contactEmail}`,
  },
  {
    icon: MessageCircle,
    label: 'Phone',
    value: brand.contactPhone,
    href: `tel:${brand.contactPhone}`,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Remote / Global',
    href: undefined,
  },
]

const socialLinks = [
  {
    name: 'GitHub',
    href: brand.githubUrl,
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: brand.linkedinUrl,
    icon: Linkedin,
  },
  {
    name: 'Telegram',
    href: brand.telegramUrl,
    icon: Send,
  },
  {
    name: 'Instagram',
    href: brand.instagramUrl,
    icon: Instagram,
  },
  {
    name: 'WhatsApp',
    href: brand.whatsappUrl,
    icon: MessageCircle,
  },
  {
    name: 'X',
    href: brand.twitterUrl,
    icon: Twitter,
  },
].filter((social) => Boolean(social.href))

export function Contact() {
  const { language } = useI18n()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '', website: '' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = () => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.message.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
  }

  const copy = {
    title: language === 'en' ? 'Start a Project Conversation' : 'شروع یک گفت‌وگوی پروژه‌ای',
    subtitle:
      language === 'en'
        ? 'Share your current infrastructure risk, delivery bottleneck, or migration challenge. You will receive a structured follow-up path.'
        : 'ریسک زیرساخت، گلوگاه تحویل، یا مسئله مهاجرت را کوتاه توضیح دهید. مسیر پیگیری ساختاریافته دریافت می‌کنید.',
    directContact: language === 'en' ? 'Direct Contact' : 'تماس مستقیم',
    profiles: language === 'en' ? 'Professional Profiles' : 'پروفایل‌ها',
    acceptingTitle: language === 'en' ? 'Accepting High-Impact Projects' : 'پذیرش پروژه‌های اثرگذار',
    acceptingDesc:
      language === 'en'
        ? 'Discovery and qualification are open for new engagements.'
        : 'برای Discovery و ارزیابی همکاری در دسترس هستم.',
    qualifyCta: language === 'en' ? 'Request Qualification' : 'درخواست Qualification',
    formTitle: language === 'en' ? 'Send Project Brief' : 'ارسال خلاصه پروژه',
    sentTitle: language === 'en' ? 'Message Sent!' : 'پیام ارسال شد',
    sentDesc:
      language === 'en'
        ? "Thank you for reaching out. I'll get back to you as soon as possible."
        : 'ممنون از پیام شما. در سریع‌ترین زمان ممکن پاسخ می‌دهم.',
    sendAnother: language === 'en' ? 'Send Another Message' : 'ارسال پیام دیگر',
    name: language === 'en' ? 'Name' : 'نام',
    email: language === 'en' ? 'Email' : 'ایمیل',
    subject: language === 'en' ? 'Subject' : 'موضوع',
    message: language === 'en' ? 'Message' : 'پیام',
    subjectPh: language === 'en' ? "What's this about?" : 'موضوع پیام چیست؟',
    messagePh:
      language === 'en'
        ? 'Tell me about your infrastructure challenge or project goals...'
        : 'در مورد مسئله زیرساخت/هدف پروژه کوتاه توضیح دهید...',
    submit: language === 'en' ? 'Send Message' : 'ارسال پیام',
    sending: language === 'en' ? 'Sending...' : 'در حال ارسال...',
    locationValue: language === 'en' ? 'Remote / Global' : 'ریموت / بین‌المللی',
    phoneLabel: language === 'en' ? 'Phone' : 'تلفن',
    namePh: language === 'en' ? 'Your name' : 'نام شما',
    emailPh: language === 'en' ? 'your.email@example.com' : 'name@company.com',
  }

  return (
    <section id="contact" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-background via-background/50 to-muted/30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {copy.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>{copy.directContact}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="p-4 rounded-xl bg-card border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          {info.label === 'Location' ? (language === 'en' ? 'Location' : 'موقعیت') : null}
                          {info.label === 'Phone' ? copy.phoneLabel : null}
                          {info.label !== 'Location' && info.label !== 'Phone' ? info.label : null}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith('mailto') ? undefined : '_blank'}
                            rel={info.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-foreground">{info.label === 'Location' ? copy.locationValue : info.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>{copy.profiles}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                      className="flex-1"
                    >
                      <div className="p-3 bg-primary/10 rounded-xl hover:bg-primary/15 transition-colors">
                        <social.icon className="h-6 w-6 text-primary" />
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex p-4 bg-primary rounded-xl">
                  <CheckCircle className="h-12 w-12 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{copy.acceptingTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    {copy.acceptingDesc}
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/qualification">{copy.qualifyCta}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle>{copy.formTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 gradient-text">{copy.sentTitle}</h3>
                  <p className="text-muted-foreground">
                    {copy.sentDesc}
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    {copy.sendAnother}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="hidden" aria-hidden="true">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">{copy.name} *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={copy.namePh}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{copy.email} *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={copy.emailPh}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{copy.subject}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={copy.subjectPh}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{copy.message} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={copy.messagePh}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting || !validateForm()}>
                    {isSubmitting ? (
                      copy.sending
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {copy.submit}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
