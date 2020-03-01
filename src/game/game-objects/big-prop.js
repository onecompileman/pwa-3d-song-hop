import {
  BoxGeometry,
  MeshToonMaterial,
  Mesh,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  Color
} from 'three';
import { getRandomItem, getRandomInt } from '../utils/randomizer';

export class BigProp {
  constructor(position) {
    const geometry = new EdgesGeometry(
      new BoxGeometry(getRandomInt(10, 30), getRandomInt(15, 30), 5)
    );
    const material = new LineBasicMaterial({
      color: 0x1112ff,
      linewidth: 1000
    });
    this.object = new LineSegments(geometry, material);
    this.object.position.copy(position);
    this.direction = getRandomItem(['x', 'y']);
    this.move = 0;
    this.increment = getRandomInt(0.05, 0.1);
    this.colors = [0x004fb3, 0xb3400f, 0x4fb300, 0xb3114f].map(
      c => new Color(c)
    );
  }

  update() {
    if (this.move >= 10.5 || this.move <= -10.5) {
      this.increment = -this.increment;
      this.move = 0;
      this.object.material.color.set(getRandomItem(this.colors).getHex());
    }

    this.move += this.increment;
    this.object.position[this.direction] += this.increment;
  }
}
