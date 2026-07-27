import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { NAV_ITEMS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileOpen(false);
    }
  };

  return (
    <header className="bg-primary/90 sticky top-0 z-40 border-b border-white/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="shrink-0 text-xl font-bold text-white">
          La <span className="text-accent">Moto</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 md:block md:max-w-sm lg:max-w-md">
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm transition',
                  isActive ? 'bg-accent/20 text-accent' : 'text-muted hover:text-white',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-muted hidden text-sm hover:text-white sm:block">
                {user?.bikeIcon} {user?.nickname}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Выйти
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={openAuthModal}>
              Войти
            </Button>
          )}
          <button
            className="text-muted rounded-lg p-2 hover:bg-white/5 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm',
                    isActive ? 'bg-accent/20 text-accent' : 'text-muted',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
