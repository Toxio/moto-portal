import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useInstallPwa } from '@/hooks/useInstallPwa';

export function InstallPwaPrompt() {
  const { open, isIosGuide, canNativeInstall, isInstalling, close, dismiss, install } =
    useInstallPwa();

  return (
    <Modal open={open} onClose={close} title="Добавить La Moto на экран">
      <div className="space-y-4">
        <p className="text-muted text-sm">
          Установите приложение на главный экран — быстрый доступ к объявлениям, карте и 3D-моделям.
        </p>

        {isIosGuide ? (
          <ol className="text-muted list-decimal space-y-2 pl-5 text-sm">
            <li>Нажмите «Поделиться» в Safari</li>
            <li>Выберите «На экран Домой»</li>
            <li>Подтвердите добавление</li>
          </ol>
        ) : (
          <p className="text-sm text-white/90">
            Нажмите «Установить», чтобы добавить ярлык La Moto на рабочий стол телефона.
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {canNativeInstall && (
            <Button className="flex-1" onClick={install} disabled={isInstalling}>
              {isInstalling ? 'Установка…' : 'Установить'}
            </Button>
          )}
          <Button
            variant={canNativeInstall ? 'outline' : 'primary'}
            className="flex-1"
            onClick={dismiss}
          >
            {canNativeInstall ? 'Позже' : 'Понятно'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
