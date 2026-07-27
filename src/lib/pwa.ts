export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const DISMISS_KEY = 'la-moto-pwa-dismissed-at';
const DISMISS_DAYS = 7;

export function isStandalonePwa(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isMobileDevice(): boolean {
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
}

export function isIosDevice(): boolean {
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent);
}

export function isIosSafari(): boolean {
  if (!isIosDevice()) return false;
  return !/(CriOS|FxiOS|OPiOS|EdgiOS)/.test(window.navigator.userAgent);
}

export function wasInstallPromptDismissed(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;

  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;

  const ms = DISMISS_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - dismissedAt < ms;
}

export function dismissInstallPrompt(): void {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

export function clearInstallPromptDismissal(): void {
  localStorage.removeItem(DISMISS_KEY);
}
