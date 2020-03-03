import {
  Vector3,
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  ConeGeometry,
  SphereGeometry,
  Mesh,
  BoxBufferGeometry
} from 'three';
import { getRandomInt, getRandomItem } from '../utils/randomizer';

export class Props {
  constructor(position, shape) {
    const geometry1 = new EdgesGeometry(this.getGeometryShape(shape));
    const material = new LineBasicMaterial({
      color: 0x1112ff
    });
    this.object = new LineSegments(geometry1, material);
    this.object.position.copy(position.clone());
    this.velocity = new Vector3(0, 0, 0.08);
  }

  update() {
    this.object.position.add(this.velocity);
  }

  isDead() {
    return this.object.position.z >= 2;
  }

  getGeometryShape(shape) {
    switch (shape) {
      case 'box':
        const randomSize = 0.05;
        return new BoxBufferGeometry(randomSize, randomSize, randomSize);
      case 'cone':
        const randomW = getRandomInt(0.2, 0.5);
        const randomH = getRandomInt(0.4, 1);
        return new ConeGeometry(randomW, randomH, 10);
      case 'sphere':
        const randomR = getRandomInt(0.3, 1);
        return new SphereGeometry(randomR, 5, 5);
    }
  }
}
