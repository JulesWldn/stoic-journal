import sql from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
    try {
        const { title, body } = await req.json()
        const [note] = await sql`
      UPDATE notes
      SET title = ${title || ''}, body = ${body || ''}
      WHERE id = ${params.id}
      RETURNING id, title, body, timestamp, is_guided
    `
        if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(note)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
}

export async function DELETE(_, { params }) {
    try {
        await sql`DELETE FROM notes WHERE id = ${params.id}`
        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
}