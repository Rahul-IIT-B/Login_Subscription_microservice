// frontend\src\app\page.tsx
import { getPosts } from '@/services/api';
import { cookies } from 'next/headers';
import Link from 'next/link';
import styles from '@/app/components/Header.module.css';

export default async function Home() {
  const posts = await getPosts();
  const hasToken = !!cookies().get('token');

  return (
    <div className="min-h-screen">
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>BlogWave</Link>
            <div className={styles.navLinks}>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to BlogWave</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A platform where ideas flow freely and creativity knows no bounds
          </p>
        </div>

        <div className="card p-5 mb-8">
          <h2 className="text-3xl mb-6 text-center">Latest Posts</h2>
          
          {posts.data.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl">No posts available yet.</p>
              <p className="mt-2">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.data.map((post: any) => (
                <article 
                  key={post.id} 
                  className="card p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-2xl font-bold text-gray-800">
                      <Link 
                        href={`/posts/${post.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h4>
                    <p className="text-gray-600 line-clamp-3">
                      {post.content}
                    </p>
                    <h5 className="font-medium text-gray-700">
                      By {post.User?.email || 'Unknown author'} On {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </h5>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-10">
        <div className="container text-center">
          <p>© {new Date().getFullYear()} BlogWave. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}