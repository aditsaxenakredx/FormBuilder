'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { FormBuilder } from '../components/FormBuilder';

export default function EditorPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else {
                setIsReady(true);
            }
        }
    }, [user, loading, router]);

    if (loading || !isReady) {
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

    return <FormBuilder />;
}
