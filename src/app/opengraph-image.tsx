// lint-conventions: skip-file — @vercel/og's ImageResponse requires inline styles + hex literals
import { ImageResponse } from 'next/og';
import { COMPANY_NAME, COMPANY_TAGLINE } from '@/config/site';

export const runtime = 'edge';
export const alt = `${COMPANY_NAME} — ${COMPANY_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BRAND = {
  cream: '#FFF9F5',
  teal: '#14525F',
  tealDeep: '#10333A',
  rose: '#BF9789',
  taupe: '#80655D',
  rule: 'rgba(20, 82, 95, 0.16)',
} as const;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: BRAND.cream,
          color: BRAND.tealDeep,
          fontFamily: 'Georgia, serif',
          padding: '88px 96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: BRAND.rose,
          }}
        >
          {COMPANY_NAME}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              fontStyle: 'italic',
              fontSize: '32px',
              color: BRAND.rose,
            }}
          >
            Dear reader,
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '76px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              maxWidth: '1000px',
              color: BRAND.tealDeep,
            }}
          >
            We are not a corporation. We are a family.
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '24px',
              lineHeight: 1.45,
              color: BRAND.taupe,
              maxWidth: '900px',
            }}
          >
            Picture books made by family, for families. Hardcover. Ages 4–8.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `1px solid ${BRAND.rule}`,
            paddingTop: '24px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: BRAND.rose,
            }}
          >
            Made by family · est. 2024
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              fontWeight: 500,
              letterSpacing: '0.05em',
              color: BRAND.teal,
            }}
          >
            maglandbooks.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
