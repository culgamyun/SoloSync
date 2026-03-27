import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(140deg, #1f6c8b 0%, #ff8b54 100%)',
          color: 'white',
          fontSize: 220,
          fontWeight: 700,
          borderRadius: 120
        }}
      >
        S
      </div>
    ),
    size
  );
}
