import sql from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const letters = await sql`
      SELECT id, body, unlock_date, label, timestamp
      FROM letters
      ORDER BY created_at DESC
    `
        return NextResponse.json(letters)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const { body, unlock_date, label, timestamp } = await req.json()
        const [letter] = await sql`
      INSERT INTO letters (body, unlock_date, label, timestamp)
      VALUES (${body}, ${unlock_date}, ${label}, ${timestamp})
      RETURNING id, body, unlock_date, label, timestamp
    `
        return NextResponse.json(letter, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
}