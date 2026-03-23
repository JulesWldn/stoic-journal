import sql from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const notes = await sql`
      SELECT id, title, body, timestamp, is_guided
      FROM notes
      ORDER BY created_at DESC
    `
        return NextResponse.json(notes)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const { title, body, timestamp, is_guided } = await req.json()
        const [note] = await sql`
      INSERT INTO notes (title, body, timestamp, is_guided)
      VALUES (${title || ''}, ${body || ''}, ${timestamp}, ${is_guided || false})
      RETURNING id, title, body, timestamp, is_guided
    `
        return NextResponse.json(note, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
}