import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/features/auth/AuthModal';
import { InstallPwaPrompt } from '@/features/pwa/InstallPwaPrompt';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <InstallPwaPrompt />
    </div>
  );
}
