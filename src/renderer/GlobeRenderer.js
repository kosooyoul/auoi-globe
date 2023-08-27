import * as THREE from 'three';
import * as GLOBE from 'globe';

import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

class GlobeRenderer {
  THREE.Cache.enabled = true;

  let container;

  let renderer, effect;
  let camera, cameraTarget, scene;

  let root, grassOrbisGroup;
  let motherRockOrbisPivotGroup, motherRockOrbisGroup;
  let satelliteRockOrbisPivotGroup, satelliteRockOrbisGroup;

  let playerGroup, playerNode;
  let motherNpc1Group, motherNpc1Node;
  let motherNpc2Group, motherNpc2Node;
  let satelliteNpcGroup, satelliteNpcNode;

  let previousQuaternion = new THREE.Quaternion();
  let targetQuaternion = new THREE.Quaternion();
  let slerpedQuaternion = new THREE.Quaternion();
  let slerpTime = 0;

  let keyStatus = {};

  init();
  animate();

  function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 400, 3000);
    camera.position.set(0, 800, -50);
    // camera.position.set(0, 0, 1000);

    cameraTarget = new THREE.Vector3(0, 0, 0);
    // cameraTarget = new THREE.Vector3(0, 0, 1);

    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001632);
    scene.fog = new THREE.Fog(0x001632, 1000, 2000);

    // LIGHTS
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight1.position.set(0.5, -0.5, 1).normalize();
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight2.position.set(-0.5, -0.5, 1).normalize();
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight3.position.set(0, 2, 1).normalize();
    scene.add(dirLight3);

    root = new THREE.Group();
    root.position.y = 0;

    grassOrbisGroup = new THREE.Group();
    grassOrbisGroup.add(new GLOBE.GlobeGrassOrbisMesh({ size: 200, detail: 4 }));
    grassOrbisGroup.add(new GLOBE.GlobeRingOrbisMesh({ size: 400, width: 3 }))
    
    motherRockOrbisGroup = new THREE.Group();
    motherRockOrbisGroup.add(new GLOBE.GlobeRockOrbisMesh({ size: 600, detail: 4 }))
    motherRockOrbisGroup.position.set(-300, -1200, -500);
    motherRockOrbisPivotGroup = new THREE.Group();
    motherRockOrbisPivotGroup.add(motherRockOrbisGroup);
    grassOrbisGroup.add(motherRockOrbisPivotGroup);

    satelliteRockOrbisGroup = new THREE.Group();
    satelliteRockOrbisGroup.add(new GLOBE.GlobeRockOrbisMesh({ size: 40, detail: 2 }));
    satelliteRockOrbisGroup.position.set(0, -500, 0);
    satelliteRockOrbisPivotGroup = new THREE.Group();
    satelliteRockOrbisPivotGroup.add(satelliteRockOrbisGroup);
    grassOrbisGroup.add(satelliteRockOrbisPivotGroup);

    scene.add(root);

    root.add(grassOrbisGroup);

    playerGroup = new THREE.Group();
    grassOrbisGroup.add( playerGroup );

    playerNode = new GLOBE.GlobeRobotCharaNode();
    playerNode.position.y = 200;
    playerGroup.add(playerNode);

    motherNpc1Group = new THREE.Group();
    motherRockOrbisGroup.add( motherNpc1Group );

    motherNpc1Node = new GLOBE.GlobeRobotCharaNode();
    motherNpc1Node.position.y = 600;
    motherNpc1Node.action = 'Running';
    motherNpc1Group.add(motherNpc1Node);
    motherNpc1Group.quaternion.setFromEuler(new THREE.Euler(70, 74, 0));

    motherNpc2Group = new THREE.Group();
    motherRockOrbisGroup.add( motherNpc2Group );

    motherNpc2Node = new GLOBE.GlobeRobotCharaNode();
    motherNpc2Node.position.y = 600;
    motherNpc2Node.action = 'Running';
    motherNpc2Group.add(motherNpc2Node);
    motherNpc2Group.quaternion.setFromEuler(new THREE.Euler(160, 74, 0));

    satelliteNpcGroup = new THREE.Group();
    satelliteRockOrbisGroup.add( satelliteNpcGroup );

    satelliteNpcNode = new GLOBE.GlobeRobotCharaNode();
    satelliteNpcNode.position.y = 40;
    satelliteNpcNode.action = 'Dance';
    satelliteNpcGroup.add(satelliteNpcNode);
    satelliteNpcGroup.quaternion.setFromEuler(new THREE.Euler(82, 44, 0));

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    effect = new OutlineEffect(renderer)

    renderer.setAnimationLoop(() => {
      motherRockOrbisPivotGroup.rotation.z = Date.now() / 40000;
      motherRockOrbisPivotGroup.rotation.y = -0.5;
      motherRockOrbisGroup.rotation.z = Date.now() / 20000;
      motherRockOrbisGroup.rotation.y = Date.now() / 40000;

      satelliteRockOrbisPivotGroup.rotation.z = Date.now() / 5000;
      satelliteRockOrbisPivotGroup.rotation.y = 0.5;
      satelliteRockOrbisGroup.rotation.z = Date.now() / 1000;
      satelliteRockOrbisGroup.rotation.y = Date.now() / 3000;

      // Slerp
      slerpedQuaternion.slerpQuaternions(previousQuaternion, targetQuaternion, slerpTime += 0.05);
      root.quaternion.copy(slerpedQuaternion);
    })
  }

  function animate() {
    compute();
    render();

    requestAnimationFrame(animate);
  }

  function compute() {
    (() => {
      // Player moving
      let x = 0, y = 0;
      if (keyStatus.left) y = -0.04;
      else if (keyStatus.right) y = 0.04;
      if (keyStatus.up) x = -0.01;
      else if (keyStatus.down) x = 0.01;
      
      const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, 0));
      const playerQuaternionInverted = playerGroup.quaternion.clone().invert();
      const rotatedQuaternion = rotationQuaternion.multiply(playerQuaternionInverted).invert();
      playerGroup.quaternion.copy(rotatedQuaternion);
        
      // Camera following
      previousQuaternion = root.quaternion.clone();
      targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, 0));
      targetQuaternion.multiply(playerQuaternionInverted);
      slerpTime = 0;
    })();
    
    (() => {
      const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.01 / 3 * 2, 0, 0));
      const motherNpcQuaternionInverted = motherNpc1Group.quaternion.clone().invert();
      const rotatedQuaternion = rotationQuaternion.multiply(motherNpcQuaternionInverted).invert();
      motherNpc1Group.quaternion.copy(rotatedQuaternion);
    })();

    (() => {
      const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.01 / 3 * 2, 0, 0));
      const motherNpcQuaternionInverted = motherNpc2Group.quaternion.clone().invert();
      const rotatedQuaternion = rotationQuaternion.multiply(motherNpcQuaternionInverted).invert();
      motherNpc2Group.quaternion.copy(rotatedQuaternion);
    })();

    playerNode.updateAnimation();
    motherNpc1Node.updateAnimation();
    motherNpc2Node.updateAnimation();
    satelliteNpcNode.updateAnimation();
  }

  function render() {

    camera.lookAt(cameraTarget);

    // renderer.clear();
    // renderer.render(scene, camera);

    effect.clear();
    effect.render(scene, camera);
  }
}

export { GlobeRenderer }