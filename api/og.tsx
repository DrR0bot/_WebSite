import React from 'react'
import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || 'Hyve Dynamics'
  const subtitle =
    searchParams.get('subtitle') ||
    'Transforming Industries Through Real-World Intelligence'
  const description =
    searchParams.get('description') ||
    'Conformable, high-density sensing arrays delivering real-time pressure, temperature and strain data.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0B0E1B 0%, #1a1a2e 50%, #0f1729 100%)',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Geometric accent shapes */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-40px',
            width: '400px',
            height: '400px',
            background: 'linear-gradient(135deg, rgba(129,183,194,0.15) 0%, rgba(97,137,146,0.05) 100%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            right: '200px',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(63,72,91,0.3) 0%, rgba(129,183,194,0.1) 100%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '60px',
            width: '600px',
            height: '3px',
            background: 'linear-gradient(90deg, #81b7c2 0%, rgba(129,183,194,0) 100%)',
            display: 'flex',
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '30px',
          }}
        >
          {/* Simplified geometric logo mark */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: '34px solid #81b7c2',
                display: 'flex',
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: '34px solid #3f485b',
                display: 'flex',
              }}
            />
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 300,
              color: '#81b7c2',
              letterSpacing: '6px',
              display: 'flex',
            }}
          >
            HYVE DYNAMICS
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              fontSize: title.length > 30 ? '48px' : '56px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '20px',
              display: 'flex',
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.5,
              maxWidth: '750px',
              display: 'flex',
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(129,183,194,0.2)',
            paddingTop: '24px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              color: 'rgba(129,183,194,0.6)',
              letterSpacing: '2px',
              display: 'flex',
            }}
          >
            hyvedynamics.com
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
            }}
          >
            Intelligent Surface Monitoring Platform
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
