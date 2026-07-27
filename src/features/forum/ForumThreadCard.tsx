import { Link } from 'react-router-dom';
import type { ForumCategory, ForumThread } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface ForumThreadCardProps {
  thread: ForumThread;
  category?: ForumCategory;
}

export function ForumThreadCard({ thread, category }: ForumThreadCardProps) {
  return (
    <Link to={`/forum/${thread.categoryId}/${thread.id}`}>
      <Card className="group overflow-hidden p-0">
        <div className="bg-secondary/50 relative flex aspect-[4/3] items-center justify-center overflow-hidden">
          <span className="text-5xl transition duration-300 group-hover:scale-110">
            {category?.icon ?? '💬'}
          </span>
          {thread.isPinned && (
            <Badge variant="premium" className="absolute top-2 right-2">
              Закреплено
            </Badge>
          )}
        </div>
        <div className="p-4">
          {category && <p className="text-muted mb-1 text-xs">{category.name}</p>}
          <h3 className="mb-2 line-clamp-2 font-semibold">{thread.title}</h3>
          {thread.preview && (
            <p className="text-muted mb-3 line-clamp-2 text-sm">{thread.preview}</p>
          )}
          <div className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span>{thread.author}</span>
            <span>{formatDate(thread.createdAt)}</span>
            <span>💬 {thread.replyCount}</span>
            <span className="text-accent">❤️ {thread.likes}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
