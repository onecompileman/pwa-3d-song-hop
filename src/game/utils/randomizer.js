export function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}
