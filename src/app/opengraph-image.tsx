import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Arpan Singh - Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc', // Very light slate background
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* --- CREATIVE BACKGROUND ORBS --- */}
        {/* Top Right Cyan Blob */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-100px',
            width: '650px',
            height: '650px',
            background: 'radial-gradient(circle, rgba(165, 243, 252, 0.6) 0%, rgba(248, 250, 252, 0) 70%)',
            borderRadius: '50%',
          }}
        />
        {/* Bottom Left Indigo Blob */}
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            left: '-150px',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(199, 210, 254, 0.5) 0%, rgba(248, 250, 252, 0) 70%)',
            borderRadius: '50%',
          }}
        />

        {/* --- FROSTED GLASS MAIN CARD --- */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '1060px',
            height: '490px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            border: '3px solid rgba(255, 255, 255, 1)',
            borderRadius: '48px',
            padding: '60px 70px',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Top Badges */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#eff6ff', // Light blue
                color: '#2563eb', // Blue-600
                padding: '10px 24px',
                borderRadius: '100px',
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              🚀 Digital Space
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fef3c7', // Light amber
                color: '#d97706', // Amber-600
                padding: '10px 24px',
                borderRadius: '100px',
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              📍 Bhilai, CG
            </div>
          </div>

          {/* Huge Dynamic Name */}
          <h1
            style={{
              fontSize: '110px',
              fontWeight: 900,
              color: '#0f172a', // Slate-900
              margin: '0 0 16px 0',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            ARPAN<span style={{ color: '#3b82f6' }}>.</span>
          </h1>

          {/* Catchy Subtitle */}
          <p
            style={{
              fontSize: '42px',
              fontWeight: 600,
              color: '#475569', // Slate-600
              margin: '0 0 50px 0',
              lineHeight: 1.2,
            }}
          >
            Engineering logic ⚙️ <br /> Designing experiences 🎨
          </p>

          {/* Bubble Emoji Tech Tags */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 36px',
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                color: '#334155',
                borderRadius: '100px',
                fontSize: '28px',
                fontWeight: 800,
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
              }}
            >
              🐍 Python
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 36px',
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                color: '#334155',
                borderRadius: '100px',
                fontSize: '28px',
                fontWeight: 800,
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
              }}
            >
              ✨ UI/UX
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 36px',
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                color: '#334155',
                borderRadius: '100px',
                fontSize: '28px',
                fontWeight: 800,
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
              }}
            >
              ⚛️ Next.js
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
