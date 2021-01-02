export function scale(items, screenWidth, screenHeight) {
  if (items.length === 0) {
    return {
      x: 0,
      y: 0,
      s: 1,
    };
  }
  const left = Math.min(...items.map(({ x, r }) => x - r));
  const right = Math.max(...items.map(({ x, r }) => x + r));
  const top = Math.min(...items.map(({ y, r }) => y - r));
  const bottom = Math.max(...items.map(({ y, r }) => y + r));
  const width = right - left;
  const height = bottom - top;
  return {
    x: left + width / 2,
    y: top + height / 2,
    s: Math.min(screenWidth / width, screenHeight / height),
  };
}
