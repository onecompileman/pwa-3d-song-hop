import {
  SphereGeometry,
  MeshLambertMaterial,
  Mesh,
  Sphere,
  Box3,
  Vector3
} from 'three';

export class Player {
  constructor() {
    const geometry = new SphereGeometry(0.3, 12, 12);
    const material = new MeshLambertMaterial({
      color: 0x4444ff,
      emissive: 0x7777ff,
      emissiveIntensity: 0.5
    });
    this.object = new Mesh(geometry, material);
    this.object.position.y = 1;
    this.follow = new Vector3(0, 1, 0);
    this.isDown = false;
    this.onDownListener = null;
    this.object.castShadow = true;
    this.platformToBounce = null;
    this.bBox = new Box3().setFromObject(this.object);
  }

  get position() {
    return this.object.position.clone();
  }

  goDown() {
    this.isDown = true;
    this.follow.y = 0.2;
  }

  update() {
    if (this.follow) {
      if (Math.abs(this.object.position.y - this.follow.y) <= 0.02) {
        if (this.isDown) {
          this.onDownListener();
          this.isDown = false;
          this.follow.y = 1;
        }
      }
      if (!this.object.position.equals(this.follow)) {
        this.object.position.lerp(this.follow, 0.3);
      }
    }
    this.bBox.setFromObject(this.object);
  }
}
