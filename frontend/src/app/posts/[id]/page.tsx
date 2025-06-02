// frontend\src\app\posts\[id]\page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import styles from '@/app/components/Header.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/posts`);
  const posts = await res.json();
  return posts.map((post: { id: number }) => ({
    id: post.id.toString(),
  }));
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_URL}/posts/${params.id}`);
  if (!res.ok) return notFound();
  const post = await res.json();
  const hasToken = !!cookies().get('token');

  return (
    <div className="min-h-screen">
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>BlogWave</Link>
            <div className={styles.navLinks}>
              <Link href="/" className="btn btn-primary">
                All Posts
              </Link>
              {hasToken ? (
                <Link href="/dashboard" className="btn btn-secondary">
                  Dashboard
                </Link>
              ) : (
                <div className={styles.authLinks}>
                  <Link href="/login" className="btn btn-secondary">
                    Login
                  </Link>
                  <Link href="/signup" className="btn btn-secondary">
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      
      <main className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              <div>
                <p className="font-medium">{post.User?.email || 'Unknown author'}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-800 leading-relaxed">
                {post.content}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-10 mt-12">
        <div className="container text-center">
          <p>© {new Date().getFullYear()} BlogWave. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
