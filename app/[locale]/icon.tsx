import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          fontSize: 38,
          fontWeight: 900,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(to bottom right, #6366f1, #a855f7, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-0.05em',
          }}
        >
          {'{'}YK{'}'}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}