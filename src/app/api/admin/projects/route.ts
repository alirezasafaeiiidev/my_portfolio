import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const projects = await db.project.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST create project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, longDescription, githubUrl, liveUrl, tags, featured, order } = body

    if (!title || !description || !tags) {
      return NextResponse.json(
        { error: 'Title, description, and tags are required' },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        longDescription: longDescription?.trim(),
        githubUrl: githubUrl?.trim(),
        liveUrl: liveUrl?.trim(),
        tags: Array.isArray(tags) ? tags.join(',') : tags,
        featured: featured || false,
        order: order || 0,
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
