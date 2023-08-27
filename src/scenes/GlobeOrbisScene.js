import * as THREE from 'three';

class GlobeOrbisScene extends THREE.Scene {
  constructor() {
    super();

    this.background = new THREE.Color(0x001632);
    this.fog = new THREE.Fog(0x001632, 1000, 2000);

    // LIGHTS
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight1.position.set(0.5, -0.5, 1).normalize();
    this.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight2.position.set(-0.5, -0.5, 1).normalize();
    this.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight3.position.set(0, 2, 1).normalize();
    this.add(dirLight3);
  }
}

export { GlobeOrbisScene }