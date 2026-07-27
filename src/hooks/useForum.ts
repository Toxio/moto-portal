import { useEffect, useState } from 'react';
import type { ForumCategory, ForumPost, ForumThread } from '@/lib/types';
import { delay, getFromStorage, setToStorage } from '@/lib/utils';
import { mockForumCategories, mockForumPosts, mockForumThreads } from '@/mocks/forum';

const THREADS_KEY = 'la-moto-forum-threads';
const POSTS_KEY = 'la-moto-forum-posts';

export function useForum() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(300).then(() => {
      setCategories(mockForumCategories);
      setThreads(getFromStorage(THREADS_KEY, mockForumThreads));
      setPosts(getFromStorage(POSTS_KEY, mockForumPosts));
      setLoading(false);
    });
  }, []);

  const addThread = (thread: ForumThread) => {
    setThreads((prev) => {
      const next = [thread, ...prev];
      setToStorage(THREADS_KEY, next);
      return next;
    });
  };

  const addPost = (post: ForumPost) => {
    setPosts((prev) => {
      const next = [...prev, post];
      setToStorage(POSTS_KEY, next);
      return next;
    });
    setThreads((prev) =>
      prev.map((t) => (t.id === post.threadId ? { ...t, replyCount: t.replyCount + 1 } : t)),
    );
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) => {
      const next = prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      setToStorage(POSTS_KEY, next);
      return next;
    });
  };

  return { categories, threads, posts, loading, addThread, addPost, toggleLike };
}
