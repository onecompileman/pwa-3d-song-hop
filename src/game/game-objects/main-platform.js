import {
  PlaneGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  MeshLambertMaterial,
  Mesh,
  BoxGeometry,
  BoxBufferGeometry
} from 'three';

export class MainPlatform {
  constructor() {
    const geometry = new BoxBufferGeometry(5, 30, 0.2);
    const geometry1 = new EdgesGeometry(geometry);
    const material = new LineBasicMaterial({
      color: 0x2222ff
    });
    this.scaled = 0.01;
    this.maxScaled = 1;
    this.scaleInc = 0.01;
    this.object = new LineSegments(geometry1, material);
    this.object.position.z = 2;
    this.object.rotation.x = Math.PI * 0.51;

    // this.object.rotation.y = Math.PI * 2;
  }

  update() {
    if (this.scaled >= this.maxScaled || this.scaled <= 0) {
      this.scaleInc = -this.scaleInc;
    }
    this.scaled += this.scaleInc;
    this.object.scale.z = this.scaled;
  }
}
