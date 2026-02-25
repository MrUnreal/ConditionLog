'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Something went wrong</h1>
          <p style={{ color: '#6b7280', maxWidth: '28rem' }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          {error.digest && (
            <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Error ID: {error.digest}</p>
          )}
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#18181b',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
