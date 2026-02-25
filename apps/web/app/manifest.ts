import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/conditionlog',
    name: 'ConditionLog — Rental Condition Documentation',
    short_name: 'ConditionLog',
    description:
      'Document your rental property condition with photos at move-in and move-out. Protect your security deposit with timestamped evidence.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#080C12',
    theme_color: '#00E5C5',
    categories: ['utilities', 'productivity', 'photography'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'wide',
        label: 'ConditionLog Dashboard',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'ConditionLog Mobile',
      },
    ],
  };
}
