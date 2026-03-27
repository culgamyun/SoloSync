import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SoloSync',
    short_name: 'SoloSync',
    description: 'AI-powered social health coaching PWA for real-world connection.',
    start_url: '/ko',
    display: 'standalone',
    background_color: '#f8f3eb',
    theme_color: '#1f6c8b',
    icons: [
      {
        src: '/icons/solo-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
}
