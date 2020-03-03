import { Vector3 } from 'three';
import { Particle } from './particle';
import { getRandomInt } from '../../utils/randomizer';

export class ParticleSystem {
  constructor(
    scene,
    count,
    speed,
    generationSpeed,
    life,
    position,
    color,
    size,
    minVel,
    maxVel,
    loop = true
  ) {
    this.scene = scene;
    this.count = count;
    this.speed = speed;
    this.generationSpeed = generationSpeed;
    this.life = life;
    this.position = position;
    this.color = color;
    this.size = size;
    this.minVel = minVel;
    this.maxVel = maxVel;
    this.loop = loop;

    this.particles = [];
  }

  start() {
    if (this.loop) {
      this.generationInterval = setInterval(() => {
        // console.log(this.particles);
        this.createParticles();
      }, this.generationSpeed);
    } else {
      this.createParticles();
    }
  }

  stop() {
    this.particles.forEach(particle => this.scene.remove(particle.object));
    if (this.generationInterval) {
      clearInterval(this.generationInterval);
    }
  }

  setPosition(position) {
    this.position = position.clone();
  }

  isDead() {
    return !this.loop && this.life <= 0;
  }

  createParticles() {
    for (let i = 0; i < this.count; i++) {
      const position = this.position.clone();
      const velocity = new Vector3(
        getRandomInt(this.minVel.x, this.maxVel.x),
        getRandomInt(this.minVel.y, this.maxVel.y),
        getRandomInt(this.minVel.z, this.maxVel.z)
      );
      velocity.normalize().multiplyScalar(this.speed);
      const particle = new Particle(
        position,
        this.life,
        this.color.clone(),
        velocity,
        this.size
      );
      this.scene.add(particle.object);
      this.particles.push(particle);
    }
  }

  update() {
    this.particles = this.particles.filter(particle => {
      particle.update();
      if (particle.isDead()) {
        this.scene.remove(particle.object);
      }
      return !particle.isDead();
    });
    if (!this.loop) {
      this.life--;
    }
  }
}
