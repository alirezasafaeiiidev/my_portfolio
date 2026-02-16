import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { FeaturedCaseStudies } from '@/components/sections/featured-case-studies'
import { AboutSummary } from '@/components/sections/about-summary'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <Services />
      <FeaturedCaseStudies />
      <AboutSummary />
      <Contact />
    </div>
  )
}
