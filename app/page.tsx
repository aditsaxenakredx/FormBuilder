'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';

// Force dynamic rendering (required for auth redirect)
export const dynamic = 'force-dynamic';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #000',
        borderTopColor: 'transparent',
        borderRadius: '0',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  );
}
