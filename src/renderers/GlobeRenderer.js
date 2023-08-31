import * as THREE from 'three';
import * as GLOBE from 'globe';

import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

THREE.Cache.enabled = true;

class GlobeRenderer {
  static CARTOON_MODE = true;

  container;
  testElement;

  renderer;
  effect;
  scene;

  keyStatus = {};

  constructor(container) {
    this.container = container;
    this.testElement = document.querySelector('.test');

    this._initializeRenderer();
    this._initializeScene();
    this._initializeEvent();
  }

  _initializeRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    if (GlobeRenderer.CARTOON_MODE) {
      this.effect = new OutlineEffect(this.renderer);
    }
  }

  _initializeScene() {
    this.scene = new GLOBE.GlobeOrbisScene();
    this.scene.setOnPlayerStatusListener((status) => this._onPlayerStatus(status));
  }

  _initializeEvent() {
    window.addEventListener('message', (event) => this._onMessage(event));
    window.addEventListener('resize', (event) => this._onWindowResize(event));
    window.addEventListener('keydown', (event) => this._onKeyDown(event));
    window.addEventListener('keyup', (event) => this._onKeyUp(event));
  }

  _onPlayerStatus({ quaternion, action }) {
    window.postMessage({
      'type': 'player-status',
      'quaternion': {
        x: quaternion.x,
        y: quaternion.y,
        z: quaternion.z,
        w: quaternion.w,
      },
      'action': action,
    });
  }

  _onMessage(event) {
    if (event.data.type == 'people-status') {
      this.scene.updatePeopleStatus(event.data.id, event.data);
    }
  }

  _onWindowResize() {
    this.scene.setAspectRatio(window.innerWidth / window.innerHeight);

    if (GlobeRenderer.CARTOON_MODE) {
      this.effect.setSize( window.innerWidth, window.innerHeight );
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  _onKeyDown(event) {
    const keyCode = event.which;
    if (keyCode == 37) this.keyStatus.left = { pressed: true, ts: Date.now() };
    if (keyCode == 39) this.keyStatus.right = { pressed: true, ts: Date.now() };
    if (keyCode == 38) this.keyStatus.up = { pressed: true, ts: Date.now() };
    if (keyCode == 40) this.keyStatus.down = { pressed: true, ts: Date.now() };
    if (keyCode == 32) {
      this.scene.randomActionPlayer();
      this.keyStatus.left = null;
      this.keyStatus.right = null;
      this.keyStatus.up = null;
      this.keyStatus.down = null;
      return;
    }
    if (this.keyStatus.left != null || this.keyStatus.right != null || this.keyStatus.up != null || this.keyStatus.down != null) {
      this.scene.walkPlayer();
    }
  }

  _onKeyUp(event) {
    const keyCode = event.which;
    if (keyCode == 37) this.keyStatus.left = null;
    if (keyCode == 39) this.keyStatus.right = null;
    if (keyCode == 38) this.keyStatus.up = null;
    if (keyCode == 40) this.keyStatus.down = null;
    if (keyCode == 32) return;
    if (this.keyStatus.left == null && this.keyStatus.right == null && this.keyStatus.up == null && this.keyStatus.down == null) {
      this.scene.idlePlayer();
    }
  }

  start() {
    this._loop();
  }

  _loop() {
    this._compute();
    this._render();

    requestAnimationFrame(() => this._loop());
  }

  _compute() {
    this._computePlayerStatus();
    this._computeScene();
    this.scene.updateAnimation();
  }

  _computePlayerStatus() {
    let movingDirection = 0, turningDirection = 0;
    if (this.keyStatus.left) turningDirection = -1;
    else if (this.keyStatus.right) turningDirection = 1;
    if (this.keyStatus.up) movingDirection = 1;
    else if (this.keyStatus.down) movingDirection = -1;

    this.scene.movePlayer(movingDirection, turningDirection);
  }

  _computeScene() {
    const v = new THREE.Vector3();
    this.scene.playerNode.getWorldPosition(v);
    v.project(this.scene.camera);
    const x = (v.x + 1) * window.innerWidth * 0.5;
    const y = (1 - v.y) * window.innerHeight * 0.5;
    this.testElement.style.left = x + 'px';
    this.testElement.style.top = y + 'px';
  }

  _render() {
    if (GlobeRenderer.CARTOON_MODE) {
      this.effect.clear();
      this.effect.render(this.scene, this.scene.camera);
    } else {
      this.renderer.clear();
      this.renderer.render(this.scene, this.scene.camera);
    }
  }
}

export { GlobeRenderer }