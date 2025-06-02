// frontend\src\app\dashboard\page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { createPost, getPosts } from '@/services/api';
import Link from 'next/link';
import styles from '@/app/components/Header.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState({ title: '', content: '' });
  const [userPosts, setUserPosts] = useState<Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user's posts when user is available
  const fetchUserPosts = useCallback(async () => {
    if (user?.id) {
      setIsLoading(true);
      try {
        const response = await getPosts(user.id);
        setUserPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        await createPost(post);
        setPost({ title: '', content: '' });
        await fetchUserPosts();
    } catch (error: any) {
        const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors && error.response.data.errors.join(', ')) ||
        'Failed to create post. Please try again.';
        setError(message);
    }
    };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}> Dashboard </Link>
            <div className={styles.navLinks}>
              <Link href="/" className="btn btn-primary">
                All Posts
              </Link>
              <button
                onClick={logout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="container py-10">        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
            <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={post.title}
                  onChange={(e) => setPost({...post, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={post.content}
                  onChange={(e) => setPost({...post, content: e.target.value})}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-4"
              >
                Publish Post
              </button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Posts</h2>
            {isLoading ? (
              <div className="text-center py-10">
                <p>Loading your posts...</p>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div key={post.id} className="card p-5 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold mb-2">
                      <Link href={`/posts/${post.id}`} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center">
                <p>You haven't created any posts yet.</p>
                <p className="mt-2">Start by creating your first post!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}