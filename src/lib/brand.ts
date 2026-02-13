export interface BrandProfile {
  fullNameEn: string
  fullNameFa: string
  shortNameEn: string
  shortNameFa: string
  roleEn: string
  roleFa: string
  siteNameEn: string
  siteNameFa: string
  email: string
  phone: string
  locationEn: string
  locationFa: string
  social: {
    github: string
    linkedin: string
    x: string
  }
  urls: {
    engineeringHub: string
    engineeringRequest: string
  }
}

export const brand: BrandProfile = {
  fullNameEn: 'Alireza Safaei',
  fullNameFa: 'علیرضا صفایی',
  shortNameEn: 'Alireza Safaei Dev',
  shortNameFa: 'علیرضا صفایی',
  roleEn: 'Full-Stack Developer',
  roleFa: 'توسعه‌دهنده فول‌استک',
  siteNameEn: 'Alireza Safaei Portfolio',
  siteNameFa: 'نمونه‌کار علیرضا صفایی',
  email: 'contact@alirezasafaeidev.ir',
  phone: '',
  locationEn: 'Tehran, Iran',
  locationFa: 'تهران، ایران',
  social: {
    github: 'https://github.com/alirezasafaeiiidev',
    linkedin: '',
    x: '',
  },
  urls: {
    engineeringHub: 'https://alirezasafaeidev.ir/engineering',
    engineeringRequest: 'https://alirezasafaeidev.ir/engineering/request',
  },
}

export const availableSocialLinks = [
  { name: 'GitHub', href: brand.social.github },
  { name: 'LinkedIn', href: brand.social.linkedin },
  { name: 'X', href: brand.social.x },
].filter((item) => item.href.length > 0)
