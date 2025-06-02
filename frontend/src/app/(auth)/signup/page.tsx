// frontend\src\app\(auth)\signup\page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/app/components/AuthForm.module.css';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password);
      router.push('/dashboard');
    } catch (err: any) {
        setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2>Create your Account</h2>
        </div>
        <form className={styles.authForm} onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="form-group mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className={styles.authFooter}>
          <p className="text-gray-700">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="font-medium text-primary hover:underline"
          >
            Log in
          </button>
        </p>
        </div>
      </div>
    </div>
  );
}