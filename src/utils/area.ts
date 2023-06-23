export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const areRectanglesOverlapping = (rect1: Rect, rect2: Rect) => {
  const r1xmin = rect1.x;
  const r1xmax = rect1.x + rect1.width;
  const rect1ymax = rect1.y;
  const rect1ymin = rect1.y + rect1.height;

  const r2xmin = rect2.x;
  const r2xmax = rect2.x + rect2.width;
  const r2ymax = rect2.y;
  const r2ymin = rect2.y + rect2.height;

  return !(
    r1xmin > r2xmax ||
    r1xmax < r2xmin ||
    rect1ymax > r2ymin ||
    rect1ymin < r2ymax
  );
};

export const isRectInBounds = (rect: Rect, bounds: Rect) =>
  !(
    rect.x < bounds.x ||
    rect.x + rect.width > bounds.x + bounds.width ||
    rect.y + rect.height > bounds.height
  );

export const pad = (value: number, padding: number) =>
  Math.max(padding, value - padding);
