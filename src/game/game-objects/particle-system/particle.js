import { SphereGeometry, MeshLambertMaterial, Mesh, Sphere, Box3 } from 'three';

export class Particle {
  constructor(position, life, color, velocity, size) {
    const geometry = new SphereGeometry(size, 12, 12);
    const material = new MeshLambertMaterial({
      color,
      emissive: 0x5555ff,
      emissiveIntensity: 0.2,
      opacity: 0.8
    });
    this.object = new Mesh(geometry, material);

    this.object.position.copy(position.clone());
    this.life = life;
    this.origLife = life;
    this.velocity = velocity.clone();

    this.object.castShadow = true;
    this.bBox = new Box3(this.object);
  }

  update() {
    this.object.position.add(this.velocity);
    const lifePercentage = this.life / this.origLife;
    this.object.scale.set(lifePercentage, lifePercentage, lifePercentage);
    this.object.material.opacity -= 0.01;
    this.life--;
  }

  isDead() {
    return this.life <= 0;
  }
}
