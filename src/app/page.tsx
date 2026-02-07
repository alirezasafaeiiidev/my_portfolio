import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Portfolio } from '@/components/sections/portfolio'
import { Skills } from '@/components/sections/skills'
import { Experience } from '@/components/sections/experience'
import { Testimonials } from '@/components/sections/testimonials'
import { Services } from '@/components/sections/services'
import { FAQ } from '@/components/sections/faq'
import { Blog } from '@/components/sections/blog'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <About />
      <Portfolio />
      <Skills />
      <Experience />
      <Testimonials />
      <Services />
      <FAQ />
      <Blog />
      <Contact />
    </div>
  )
}
