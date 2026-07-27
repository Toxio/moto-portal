import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/features/auth/AuthContext';

export function AuthModal() {
  const { showAuthModal, closeAuthModal, login } = useAuth();

  return (
    <Modal open={showAuthModal} onClose={closeAuthModal} title="Вход в La Moto">
      <p className="text-muted mb-4 text-sm">
        Выберите способ входа (mock — без реальной авторизации)
      </p>
      <div className="flex flex-col gap-3">
        <Button onClick={() => login('google')}>Войти через Google</Button>
        <Button variant="secondary" onClick={() => login('telegram')}>
          Войти через Telegram
        </Button>
        <Button variant="secondary" onClick={() => login('facebook')}>
          Войти через Facebook
        </Button>
      </div>
    </Modal>
  );
}
