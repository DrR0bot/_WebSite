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

  const { name, email, paperTitle } = req.body || {}

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Valid name is required (min 2 characters)' })
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' })
  }
  if (!paperTitle || typeof paperTitle !== 'string') {
    return res.status(400).json({ error: 'Paper title is required' })
  }

  try {
    await resend.emails.send({
      from: 'Hyve Dynamics Website <noreply@hyvedynamics.com>',
      to: 'info@hyvedynamics.com',
      replyTo: email,
      subject: `White Paper Download: ${paperTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: #ffffff; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300;">New White Paper Download</h1>
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
              <tr>
                <td style="padding: 12px 0; font-weight: 600; color: #495057;">Paper</td>
                <td style="padding: 12px 0; color: #212529;">${paperTitle}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; font-size: 12px; color: #6c757d;">
              Downloaded via hyvedynamics.com white papers page
            </p>
          </div>
        </div>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Failed to send lead notification:', error)
    return res.status(500).json({ error: 'Failed to process download request.' })
  }
}
