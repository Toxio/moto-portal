import { Link } from 'react-router-dom';
import type { Listing } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link to={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {listing.isPremium && (
            <Badge variant="premium" className="absolute top-2 right-2">
              Premium
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 line-clamp-1 font-semibold">{listing.title}</h3>
          <p className="text-accent mb-2 text-lg font-bold">
            {formatPrice(listing.price, listing.currency)}
          </p>
          <div className="text-muted flex items-center gap-2 text-xs">
            <span>{listing.city}</span>
            {listing.source && <Badge variant="source">{listing.source.toUpperCase()}</Badge>}
          </div>
        </div>
      </Card>
    </Link>
  );
}
