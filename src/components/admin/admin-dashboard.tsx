'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MessageSquare, Briefcase, BarChart3, Users, Trash2, LogOut, ClipboardList } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  createdAt: string
}

interface Lead {
  id: string
  status: 'new' | 'qualified' | 'disqualified' | 'archived'
  contactName: string
  organizationName: string
  email: string
  createdAt: string
}

export function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'leads' | 'messages' | 'projects' | 'stats'>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/leads')
      if (response.status === 401 || response.status === 503) {
        router.replace('/admin/login')
        return
      }
      const data = await response.json()
      setLeads(data.leads || [])
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch leads',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [router])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/messages')
      if (response.status === 401 || response.status === 503) {
        router.replace('/admin/login')
        return
      }
      const data = await response.json()
      setMessages(data.messages || [])
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [router])

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!response.ok) throw new Error('update failed')
      const data = await response.json()
      setLeads((prev) => prev.map((lead) => (lead.id === id ? data.lead : lead)))
      toast({ title: 'Updated', description: 'Lead status updated' })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update lead status',
        variant: 'destructive',
      })
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' })
      setMessages(messages.filter(m => m.id !== id))
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive',
      })
    }
  }

  // Load messages on mount
  useEffect(() => {
    fetchLeads()
    fetchMessages()
  }, [fetchLeads, fetchMessages])

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your portfolio content</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4K</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'leads' ? 'default' : 'outline'}
            onClick={() => setActiveTab('leads')}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Leads
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'outline'}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
          <Button
            variant={activeTab === 'projects' ? 'default' : 'outline'}
            onClick={() => setActiveTab('projects')}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Projects
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <Card>
            <CardHeader>
              <CardTitle>Leads</CardTitle>
              <CardDescription>
                Qualification submissions captured from high-intent funnels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading leads...
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leads yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.organizationName}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{lead.contactName}</div>
                            <div className="text-xs text-muted-foreground">{lead.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={lead.status === 'qualified' ? 'default' : 'secondary'}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateLeadStatus(lead.id, 'qualified')}
                            >
                              Qualify
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateLeadStatus(lead.id, 'archived')}
                            >
                              Archive
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>
                Messages received through the contact form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No messages yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell>
                          {message.subject || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          {new Date(message.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
              <CardDescription>
                Add, edit, or remove portfolio projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Project management interface
                </p>
                <Button>Add New Project</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Performance and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-semibold">Page Views</div>
                    <div className="text-sm text-muted-foreground">Last 30 days</div>
                  </div>
                  <Badge variant="secondary" className="text-lg">2,458</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-semibold">Unique Visitors</div>
                    <div className="text-sm text-muted-foreground">Last 30 days</div>
                  </div>
                  <Badge variant="secondary" className="text-lg">1,847</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-semibold">Contact Form Submissions</div>
                    <div className="text-sm text-muted-foreground">All time</div>
                  </div>
                  <Badge variant="secondary" className="text-lg">{messages.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
