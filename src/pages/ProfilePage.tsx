import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/features/auth/AuthContext';
import { BIKE_ICONS } from '@/mocks/users';
import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { setToStorage } from '@/lib/utils';

const AUTH_KEY = 'la-moto-user';

export function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (user) setProfile({ ...user });
  }, [user]);

  if (!isAuthenticated || !profile) {
    return <Navigate to="/" replace />;
  }

  const updateProfile = (updates: Partial<User>) => {
    const next = { ...profile, ...updates };
    setProfile(next);
    setToStorage(AUTH_KEY, next);
  };

  return (
    <>
      <Helmet>
        <title>Профиль — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Профиль</h1>
        <div className="glass-panel space-y-4 rounded-xl p-6">
          <div>
            <label className="text-muted text-sm">Никнейм</label>
            <p className="text-lg font-medium">{profile.nickname}</p>
          </div>
          <div>
            <label className="text-muted text-sm">Email</label>
            <p>{profile.email}</p>
          </div>
          <div>
            <label className="text-muted mb-1 block text-sm">Город</label>
            <Select
              options={[
                { value: 'Киев', label: 'Киев' },
                { value: 'Львов', label: 'Львов' },
                { value: 'Одесса', label: 'Одесса' },
              ]}
              value={profile.city}
              onChange={(e) => updateProfile({ city: e.target.value })}
            />
          </div>
          <div>
            <label className="text-muted mb-1 block text-sm">Иконка мото</label>
            <div className="flex gap-2">
              {BIKE_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => updateProfile({ bikeIcon: icon })}
                  className={`rounded-lg p-2 text-2xl ${profile.bikeIcon === icon ? 'bg-accent/30 ring-accent ring-2' : 'bg-white/5'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-muted text-sm">Тип мотоцикла</label>
            <p>{profile.bikeType}</p>
          </div>
          <div>
            <label className="text-muted text-sm">Провайдер</label>
            <p className="capitalize">{profile.provider}</p>
          </div>
          <Button variant="outline" onClick={logout} className="w-full">
            Выйти
          </Button>
        </div>
      </div>
    </>
  );
}
