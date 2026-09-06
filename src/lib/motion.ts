export type MotionControls = {
  isSupported: () => Promise<boolean>;
  isEnabled: () => boolean;
  start: () => Promise<void>;
  stop: () => void;
  addEventListener?: (event: "gyroscope-updated", callback: (event: { gyroscopeEnabled: boolean }) => void) => void;
  removeEventListener?: (event: "gyroscope-updated", callback: (event: { gyroscopeEnabled: boolean }) => void) => void;
};

type OrientationPermission = { requestPermission?: () => Promise<string> } | undefined;
export type MotionResult = "enabled" | "unsupported" | "denied" | "insecure" | "cancelled";

// Call directly from the button's click handler: Safari needs user activation
// before any asynchronous support check can consume that gesture.
export async function enableMotion(
  controls: MotionControls,
  orientation: OrientationPermission,
  secure: boolean,
  isCurrent: () => boolean = () => true
): Promise<MotionResult> {
  if (!secure) return "insecure";
  if (!orientation) return "unsupported";
  try {
    const permission = orientation.requestPermission?.();
    if (permission && await permission !== "granted") return "denied";
    if (!isCurrent()) return "cancelled";
    if (!await controls.isSupported()) return "unsupported";
    if (!isCurrent()) return "cancelled";
    await controls.start();
    if (!isCurrent()) return "cancelled";
    return controls.isEnabled() ? "enabled" : "denied";
  } catch {
    return isCurrent() ? "denied" : "cancelled";
  }
}
