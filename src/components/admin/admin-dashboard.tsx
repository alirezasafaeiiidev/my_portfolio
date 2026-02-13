'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MessageSquare, Briefcase, BarChart3, Users, Trash2, LogOut, Wrench } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  createdAt: string
}

interface EngineeringRequest {
  id: string
  name: string
  email: string
  company?: string | null
  website?: string | null
  projectType: string
  budget?: string | null
  timeline?: string | null
  message: string
  status: 'NEW' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED'
  internalNote?: string | null
  createdAt: string
  updatedAt: string
}

export function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'stats' | 'engineering'>('messages')
  const [messages, setMessages] = useState<Message[]>([])
  const [engineeringRequests, setEngineeringRequests] = useState<EngineeringRequest[]>([])
  const [selectedEngineeringRequestId, setSelectedEngineeringRequestId] = useState<string | null>(null)
  const [internalNote, setInternalNote] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedEngineeringRequest = useMemo(
    () => engineeringRequests.find((item) => item.id === selectedEngineeringRequestId) || null,
    [engineeringRequests, selectedEngineeringRequestId]
  )

  useEffect(() => {
    setInternalNote(selectedEngineeringRequest?.internalNote || '')
  }, [selectedEngineeringRequest])

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
      toast({ title: 'Error', description: 'Failed to fetch messages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchEngineeringRequests = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/engineering-requests')
      if (response.status === 401 || response.status === 503) {
        router.replace('/admin/login')
        return
      }
      const data = await response.json()
      const items = (data.requests || []) as EngineeringRequest[]
      setEngineeringRequests(items)
      if (!selectedEngineeringRequestId && items.length > 0) {
        setSelectedEngineeringRequestId(items[0].id)
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch engineering requests', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [router, selectedEngineeringRequestId])

  const refreshActiveTabData = useCallback(() => {
    if (activeTab === 'engineering') {
      void fetchEngineeringRequests()
      return
    }
    void fetchMessages()
  }, [activeTab, fetchEngineeringRequests, fetchMessages])

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  const deleteMessage = async (id: string) => {
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' })
      setMessages((prev) => prev.filter((m) => m.id !== id))
      toast({ title: 'Success', description: 'Message deleted successfully' })
    } catch {
      toast({ title: 'Error', description: 'Failed to delete message', variant: 'destructive' })
    }
  }

  const updateEngineeringRequest = async (status: EngineeringRequest['status']) => {
    if (!selectedEngineeringRequestId) {
      return
    }

    try {
      const response = await fetch(`/api/admin/engineering-requests/${selectedEngineeringRequestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, internalNote }),
      })
      if (!response.ok) {
        throw new Error('failed')
      }
      const data = await response.json()
      const updated = data.request as EngineeringRequest
      setEngineeringRequests((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      toast({ title: 'Success', description: 'Engineering request updated' })
    } catch {
      toast({ title: 'Error', description: 'Failed to update request', variant: 'destructive' })
    }
  }

  useEffect(() => {
    refreshActiveTabData()
  }, [refreshActiveTabData])

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage portfolio, leads, and messages</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

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
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engineering Requests</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{engineeringRequests.length}</div>
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

        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant={activeTab === 'messages' ? 'default' : 'outline'} onClick={() => setActiveTab('messages')}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
          <Button variant={activeTab === 'engineering' ? 'default' : 'outline'} onClick={() => setActiveTab('engineering')}>
            <Wrench className="h-4 w-4 mr-2" />
            Engineering Requests
          </Button>
          <Button variant={activeTab === 'projects' ? 'default' : 'outline'} onClick={() => setActiveTab('projects')}>
            <Briefcase className="h-4 w-4 mr-2" />
            Projects
          </Button>
          <Button variant={activeTab === 'stats' ? 'default' : 'outline'} onClick={() => setActiveTab('stats')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {activeTab === 'messages' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>Messages received through the contact form</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No messages yet</div>
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
                        <TableCell>{message.subject || <span className="text-muted-foreground">-</span>}</TableCell>
                        <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => deleteMessage(message.id)}>
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

        {activeTab === 'engineering' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engineering Requests</CardTitle>
                <CardDescription>Lead pipeline: NEW → REVIEWED → ACCEPTED / REJECTED</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading requests...</div>
                ) : engineeringRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No requests yet</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {engineeringRequests.map((item) => (
                        <TableRow
                          key={item.id}
                          onClick={() => setSelectedEngineeringRequestId(item.id)}
                          className="cursor-pointer"
                        >
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.projectType}</TableCell>
                          <TableCell><Badge variant="outline">{item.status}</Badge></TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Detail</CardTitle>
                <CardDescription>Review and update status/internal note</CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedEngineeringRequest ? (
                  <p className="text-sm text-muted-foreground">Select a request from the list.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedEngineeringRequest.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedEngineeringRequest.email}</p>
                      <p><span className="font-medium">Company:</span> {selectedEngineeringRequest.company || '-'}</p>
                      <p><span className="font-medium">Type:</span> {selectedEngineeringRequest.projectType}</p>
                      <p><span className="font-medium">Budget:</span> {selectedEngineeringRequest.budget || '-'}</p>
                      <p><span className="font-medium">Timeline:</span> {selectedEngineeringRequest.timeline || '-'}</p>
                    </div>
                    <div className="rounded-md border p-3 text-sm whitespace-pre-wrap">{selectedEngineeringRequest.message}</div>
                    <div>
                      <label className="text-sm font-medium">Internal note</label>
                      <textarea
                        className="mt-2 border rounded-md px-3 py-2 bg-transparent min-h-28 w-full"
                        value={internalNote}
                        onChange={(event) => setInternalNote(event.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateEngineeringRequest('NEW')}>Mark NEW</Button>
                      <Button size="sm" variant="outline" onClick={() => updateEngineeringRequest('REVIEWED')}>Mark REVIEWED</Button>
                      <Button size="sm" onClick={() => updateEngineeringRequest('ACCEPTED')}>Mark ACCEPTED</Button>
                      <Button size="sm" variant="destructive" onClick={() => updateEngineeringRequest('REJECTED')}>Mark REJECTED</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'projects' && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
              <CardDescription>Add, edit, or remove portfolio projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Project management interface</p>
                <Button>Add New Project</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'stats' && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Performance and engagement metrics</CardDescription>
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
                    <div className="font-semibold">Lead Requests</div>
                    <div className="text-sm text-muted-foreground">All time</div>
                  </div>
                  <Badge variant="secondary" className="text-lg">{engineeringRequests.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
