/**
 * @jest-environment node
 */
import { POST } from '../inquire/route'
import { Resend } from 'resend'

jest.mock('resend', () => ({ Resend: jest.fn() }))

const MockResend = Resend as jest.MockedClass<typeof Resend>

const validPayload = {
  service: 'Brand Identity',
  name: 'Test User',
  email: 'test@example.com',
  budget: '$5,000 — $10,000',
  scope: 'Design a full brand system.',
  timestamp: '2026-04-17T00:00:00.000Z',
}

function makeRequest(body: object) {
  return new Request('http://localhost/api/inquire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/inquire', () => {
  let mockSend: jest.Mock

  beforeEach(() => {
    mockSend = jest.fn()
    MockResend.mockImplementation(() => ({ emails: { send: mockSend } } as any))
    process.env.RESEND_API_KEY = 'test-key'
  })

  it('returns { ok: true } and sends email on valid payload', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })

    const res = await POST(makeRequest(validPayload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toEqual({ ok: true })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@boroma.studio',
        to: 'letswork@boroma.studio',
        subject: expect.stringContaining('Test User'),
      })
    )
  })

  it('returns { ok: false } with 500 when Resend returns an error', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'API error' } })

    const res = await POST(makeRequest(validPayload))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.ok).toBe(false)
    expect(json.error).toBe('API error')
  })

  it('returns 500 when Resend throws', async () => {
    mockSend.mockRejectedValue(new Error('Network failure'))

    const res = await POST(makeRequest(validPayload))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.ok).toBe(false)
  })
})
