import type { ReactNode } from 'react'

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/20 text-right">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {children}
      </div>
    </div>
  )
}
