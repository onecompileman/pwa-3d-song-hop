import {
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
  Box3,
  BoxBufferGeometry
} from 'three';

export class Platform {
  constructor(position, velocity) {
    const geometry = new BoxBufferGeometry(1.26, 0.3, 1.26);
    const material = new MeshLambertMaterial({
      color: 0x1111fe,
      emissive: 0x4444ff,
      emissiveIntensity: 0.4
    });

    this.object = new Mesh(geometry, material);
    this.object.position.copy(position);
    this.object.receiveShadow = true;
    this.bBox = new Box3().setFromObject(this.object);
    this.velocity = velocity.clone();
    this.bounced = false;
  }

  update() {
    this.object.position.add(this.velocity);
    this.bBox.setFromObject(this.object);
  }

  isDead() {
    return this.object.position.z >= 0.8;
  }
}
