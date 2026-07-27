import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForum } from '@/hooks/useForum';
import { formatDate } from '@/lib/utils';

export function ForumThreadPage() {
  const { categoryId, threadId } = useParams<{ categoryId: string; threadId: string }>();
  const { threads, posts, addPost, toggleLike } = useForum();
  const [reply, setReply] = useState('');

  const thread = threads.find((t) => t.id === threadId);
  const threadPosts = posts.filter((p) => p.threadId === threadId);

  const handleReply = () => {
    if (!reply.trim() || !threadId) return;
    addPost({
      id: `p-${Date.now()}`,
      threadId,
      author: 'Guest',
      content: reply.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    });
    setReply('');
  };

  return (
    <>
      <Helmet>
        <title>{thread?.title ?? 'Тема'} — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to={`/forum/${categoryId}`}
          className="text-accent mb-4 inline-block text-sm hover:underline"
        >
          ← Назад
        </Link>
        <h1 className="mb-6 text-2xl font-bold">{thread?.title}</h1>

        <div className="mb-6 space-y-4">
          {threadPosts.map((post) => (
            <Card key={post.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{post.author}</span>
                <span className="text-muted text-xs">{formatDate(post.createdAt)}</span>
              </div>
              <p className="text-sm">{post.content}</p>
              <button
                onClick={() => toggleLike(post.id)}
                className="text-muted hover:text-accent mt-2 text-xs"
              >
                ❤️ {post.likes}
              </button>
            </Card>
          ))}
        </div>

        <div className="glass-panel rounded-xl p-4">
          <Input
            placeholder="Ваш ответ..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button className="mt-3" size="sm" onClick={handleReply}>
            Ответить
          </Button>
        </div>
      </div>
    </>
  );
}
