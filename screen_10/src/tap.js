// Touch-first replacement for onClick: fires when a finger (or mouse) is pressed and
// released on the same element without dragging. A press that turns into a scroll gets
// pointercancel from the browser and never fires.
const SLOP_PX = 12;
const presses = new WeakMap();

export function tap(handler) {
  return {
    onPointerDown(e) {
      if (e.isPrimary) presses.set(e.currentTarget, { id: e.pointerId, x: e.clientX, y: e.clientY });
    },
    onPointerUp(e) {
      const press = presses.get(e.currentTarget);
      presses.delete(e.currentTarget);
      if (!press || press.id !== e.pointerId) return;
      if (Math.hypot(e.clientX - press.x, e.clientY - press.y) > SLOP_PX) return;
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      if (hit && !e.currentTarget.contains(hit)) return;
      handler(e);
    },
    onPointerCancel(e) {
      presses.delete(e.currentTarget);
    },
  };
}
