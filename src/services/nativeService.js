import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

export const isNative = Capacitor.isNativePlatform();

/**
 * Trigger subtle haptic feedback for user interactions
 */
export async function triggerHaptic(type = 'light') {
  if (!isNative) return;
  try {
    if (type === 'success') {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (type === 'warning') {
      await Haptics.notification({ type: NotificationType.Warning });
    } else if (type === 'medium') {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } else if (type === 'heavy') {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch (err) {
    // Haptics unavailable on this device
  }
}

/**
 * Configure Status Bar colors according to current theme
 */
export async function syncStatusBarTheme(theme = 'sage') {
  if (!isNative) return;
  try {
    const isDark = theme === 'twilight';
    const color = isDark ? '#0f172a' : '#1e3d30';
    await StatusBar.setBackgroundColor({ color });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch (err) {
    // Status bar styling unavailable
  }
}

/**
 * Initialize Android hardware back button listener
 */
export function initAndroidBackButton(onBackPress) {
  if (!isNative) return () => {};
  
  const handleBack = CapApp.addListener('backButton', ({ canGoBack }) => {
    if (onBackPress) {
      const handled = onBackPress();
      if (handled) return;
    }
    if (canGoBack) {
      window.history.back();
    } else {
      CapApp.exitApp();
    }
  });

  return () => {
    handleBack.then(sub => sub.remove()).catch(() => {});
  };
}

/**
 * Hide splash screen smoothly after app is ready
 */
export async function hideSplashScreen() {
  if (!isNative) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: 400 });
  } catch (err) {}
}
