/** Brief haptic tick on supported devices (mainly Android Chrome — iOS Safari has no Vibration API and silently no-ops here). */
export function triggerHapticTick() {
  navigator.vibrate?.(10)
}
