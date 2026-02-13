export interface PortfolioProject {
  id: string
  title: string
  description: string
  longDescription: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  featured: boolean
}

export interface TimelineItem {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string | null
  current: boolean
  type: 'work' | 'education'
  description: string
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'asdev-platform',
    title: 'ASDEV Platform',
    description: 'Governance and standards hub for multi-repository delivery.',
    longDescription:
      'Designed and implemented a central platform for standards, process governance, automation contracts, and reporting across multiple repositories without monorepo lock-in.',
    githubUrl: 'https://github.com/alirezasafaeiiidev/asdev-standards-platform',
    tags: ['TypeScript', 'Node.js', 'Automation', 'CI/CD', 'Governance'],
    featured: true,
  },
  {
    id: 'persian-tools',
    title: 'Persian Tools',
    description: 'Production-grade Persian utility suite with SEO/PWA focus.',
    longDescription:
      'Built and maintained a high-performance Next.js tool suite with deployment runbooks, readiness gates, and operational checks for reliable VPS releases.',
    githubUrl: 'https://github.com/alirezasafaeiiidev/asdev-persiantoolbox',
    liveUrl: 'https://persiantoolbox.ir',
    tags: ['Next.js', 'TypeScript', 'PWA', 'SEO', 'VPS'],
    featured: true,
  },
  {
    id: 'my-portfolio',
    title: 'My Portfolio',
    description: 'Personal brand site with bilingual UX and admin APIs.',
    longDescription:
      'Developed a bilingual personal website with structured SEO, contact workflows, and admin endpoints to support content evolution and future CMS-style control.',
    githubUrl: 'https://github.com/alirezasafaeiiidev/asdev-portfolio',
    liveUrl: 'https://alirezasafaeidev.ir',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'SEO', 'i18n'],
    featured: true,
  },
  {
    id: 'deploy-automation',
    title: 'Deploy Automation Toolkit',
    description: 'Reusable scripts and workflows for staged deployment/rollback.',
    longDescription:
      'Implemented reusable deployment scripts for Nginx + PM2 environments with staged promotion, rollback support, and post-deploy verification reporting.',
    tags: ['Bash', 'GitHub Actions', 'Nginx', 'PM2', 'DevOps'],
    featured: false,
  },
]

export const timelineItems: TimelineItem[] = [
  {
    id: 'founder-dev',
    title: 'Founder & Full-Stack Developer',
    company: 'Independent / Personal Products',
    location: 'Tehran, Iran',
    startDate: '2023-01',
    endDate: null,
    current: true,
    type: 'work',
    description:
      'Building and shipping end-to-end web products with ownership over architecture, implementation, deployment, observability, and release operations.',
  },
  {
    id: 'frontend-freelance',
    title: 'Frontend/Full-Stack Developer',
    company: 'Freelance Projects',
    location: 'Remote',
    startDate: '2020-01',
    endDate: '2022-12',
    current: false,
    type: 'work',
    description:
      'Delivered custom web applications for clients with a strong focus on UX quality, maintainable code, and predictable delivery timelines.',
  },
  {
    id: 'self-learning',
    title: 'Applied Software Engineering Track',
    company: 'Self-Directed Learning + Real Projects',
    location: 'Remote',
    startDate: '2018-01',
    endDate: '2019-12',
    current: false,
    type: 'education',
    description:
      'Hands-on learning path across frontend, backend, databases, and deployment by shipping production-like projects instead of theory-only study.',
  },
]
