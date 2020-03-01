export function constrain(value, min = null, max = null) {
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
}
