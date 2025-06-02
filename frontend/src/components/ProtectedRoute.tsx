// frontend\src\components\ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cookies } from 'next/headers';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const hasToken = !!cookies().get('token');
  const router = useRouter();

  useEffect(() => {
    if (!user && !hasToken) {
      router.push('/login');
    }
  }, [user, hasToken, router]);

  return <>{user ? children : null}</>;
}