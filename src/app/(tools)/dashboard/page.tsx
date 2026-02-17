import type { Metadata } from 'next'
import { ToolboxDashboardClient } from '@/components/tools/toolbox-dashboard'

export const metadata: Metadata = {
  title: 'داشبورد ابزارها',
  description: 'مدیریت تاریخچه محلی، تنظیمات و import/export ابزارها',
}

export default function ToolboxDashboardPage() {
  return <ToolboxDashboardClient />
}
