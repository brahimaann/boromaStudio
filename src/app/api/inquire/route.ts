import { Resend } from 'resend'
import { NextResponse } from 'next/server'

type InquiryPayload = {
  service: string
  name: string
  email: string
  budget: string
  scope: string
  timestamp: string
}

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  let payload: InquiryPayload

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const { service, name, email, budget, scope, timestamp } = payload

  const text = [
    `New inquiry — ${service}`,
    ``,
    `Name:      ${name}`,
    `Email:     ${email}`,
    `Budget:    ${budget}`,
    `Submitted: ${timestamp}`,
    ``,
    `Scope:`,
    scope,
  ].join('\n')

  try {
    const { error } = await resend.emails.send({
      from: 'noreply@boroma.studio',
      to: 'letswork@boroma.studio',
      subject: `New inquiry — ${service} from ${name}`,
      text,
    })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
