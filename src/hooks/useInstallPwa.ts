import { useCallback, useEffect, useState } from 'react';
import type { BeforeInstallPromptEvent } from '@/lib/pwa';
import {
  dismissInstallPrompt,
  isIosSafari,
  isMobileDevice,
  isStandalonePwa,
  wasInstallPromptDismissed,
} from '@/lib/pwa';

export function useInstallPwa() {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIosGuide, setIsIosGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (isStandalonePwa() || wasInstallPromptDismissed() || !isMobileDevice()) {
      return;
    }

    const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsIosGuide(false);
      setOpen(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    let iosTimer: number | undefined;
    if (isIosSafari()) {
      iosTimer = window.setTimeout(() => {
        setIsIosGuide(true);
        setOpen(true);
      }, 2500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      if (iosTimer) window.clearTimeout(iosTimer);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setOpen(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setOpen(false);
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  return {
    open,
    isIosGuide,
    canNativeInstall: Boolean(deferredPrompt),
    isInstalling,
    close,
    dismiss,
    install,
  };
}
