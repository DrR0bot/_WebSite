import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ALLOWED_ORIGINS = [
  'https://hyvedynamics.com',
  'https://www.hyvedynamics.com',
  'https://hyvedynamics.co.uk',
  'http://localhost:5173',
]

function getCorsHeaders(origin: string | undefined) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cors = getCorsHeaders(req.headers.origin as string)
  Object.entries(cors).forEach(([key, value]) => res.setHeader(key, value))

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body || {}

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Valid name is required (min 2 characters)' })
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' })
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ error: 'Message is required (min 10 characters)' })
  }

  try {
    await resend.emails.send({
      from: 'Hyve Dynamics Website <noreply@hyvedynamics.com>',
      to: 'info@hyvedynamics.com',
      replyTo: email,
      subject: `Demo Request from ${name.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: #ffffff; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300;">New Demo Request</h1>
          </div>
          <div style="padding: 24px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600; color: #495057; width: 120px;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #212529;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600; color: #495057;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #212529;">
                  <a href="mailto:${email}" style="color: #0066cc;">${email}</a>
                </td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <h3 style="color: #495057; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Message</h3>
              <div style="background: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e9ecef; color: #212529; line-height: 1.6;">
                ${message.trim().replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="margin-top: 24px; font-size: 12px; color: #6c757d;">
              Submitted via hyvedynamics.com contact form
            </p>
          </div>
        </div>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Failed to send email:', error)
    return res.status(500).json({ error: 'Failed to send email. Please try again.' })
  }
}
