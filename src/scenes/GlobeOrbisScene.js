import * as THREE from 'three';
import * as GLOBE from 'globe';

class GlobeOrbisScene extends THREE.Scene {
  // Following Scene
  previousQuaternion;
  targetQuaternion;
  slerpedQuaternion;
  slerpTime;

  // Scene objects
  camera;
  cameraTarget;
  root;
  
  // Orbises
  grassOrbisGroup;
  motherRockOrbisPivotGroup;
  motherRockOrbisGroup;
  satelliteRockOrbis1PivotGroup;
  satelliteRockOrbis1Group;
  satelliteRockOrbis2PivotGroup;
  satelliteRockOrbis2Group;

  // Player
  playerGroup;
  playerNode;

  // Npcs
  motherNpc1Group;
  motherNpc1Node;
  motherNpc2Group;
  motherNpc2Node;
  satelliteNpc1Group;
  satelliteNpc1Node;

  // Peoples
  peoples = {};

  constructor() {
    super();

    this.previousQuaternion = new THREE.Quaternion();
    this.targetQuaternion = new THREE.Quaternion();
    this.slerpedQuaternion = new THREE.Quaternion();
    this.slerpTime = 0;

    this.background = new THREE.Color(0x001632);
    this.fog = new THREE.Fog(0x001632, 1000, 2000);

    this.root = new THREE.Group();
    this.add(this.root);

    this.initializeCamera();
    this.initializeLights();
    this.initializeOrbises();
    this.initializePlayer();
    this.initializeNpcs();
  }

  initializeCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 200, 3000);
    this.camera.position.set(0, 800, -50);
    // this.camera.position.set(0, 0, 1000);

    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    // this.cameraTarget = new THREE.Vector3(0, 0, 1);
  }

  initializeLights() {
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

  initializeOrbises() {
    this.grassOrbisGroup = new THREE.Group();
    this.grassOrbisGroup.add(new GLOBE.GlobeGrassOrbisMesh({ size: 200, detail: 4 }));
    this.grassOrbisGroup.add(new GLOBE.GlobeRingOrbisMesh({ size: 400, width: 3 }))
    
    this.motherRockOrbisGroup = new THREE.Group();
    this.motherRockOrbisGroup.add(new GLOBE.GlobeRockOrbisMesh({ size: 600, detail: 4 }))
    this.motherRockOrbisGroup.position.set(-300, -1200, -500);
    this.motherRockOrbisPivotGroup = new THREE.Group();
    this.motherRockOrbisPivotGroup.add(this.motherRockOrbisGroup);
    this.grassOrbisGroup.add(this.motherRockOrbisPivotGroup);

    this.satelliteRockOrbis1Group = new THREE.Group();
    this.satelliteRockOrbis1Group.add(new GLOBE.GlobeRockOrbisMesh({ size: 40, detail: 2 }));
    this.satelliteRockOrbis1Group.position.set(0, -500, 0);
    this.satelliteRockOrbis1PivotGroup = new THREE.Group();
    this.satelliteRockOrbis1PivotGroup.add(this.satelliteRockOrbis1Group);
    this.grassOrbisGroup.add(this.satelliteRockOrbis1PivotGroup);

    this.satelliteRockOrbis2Group = new THREE.Group();
    this.satelliteRockOrbis2Group.add(new GLOBE.GlobeRockOrbisMesh({ size: 40, detail: 2 }));
    this.satelliteRockOrbis2Group.position.set(350, 0, -300);
    this.satelliteRockOrbis2PivotGroup = new THREE.Group();
    this.satelliteRockOrbis2PivotGroup.add(this.satelliteRockOrbis2Group);
    this.grassOrbisGroup.add(this.satelliteRockOrbis2PivotGroup);

    this.root.add(this.grassOrbisGroup);
  }

  initializePlayer() {
    this.playerGroup = new THREE.Group();
    this.playerNode = new GLOBE.GlobeRobotCharaNode();
    this.playerNode.position.y = 200;
    this.playerNode.action = 'Idle';
    this.playerGroup.add(this.playerNode);
    this.grassOrbisGroup.add(this.playerGroup);
  }

  initializeNpcs() {
    this.motherNpc1Group = new THREE.Group();
    this.motherNpc1Group.quaternion.setFromEuler(new THREE.Euler(70, 74, 0));
    this.motherNpc1Node = new GLOBE.GlobeRobotCharaNode();
    this.motherNpc1Node.position.y = 600;
    this.motherNpc1Node.action = 'Running';
    this.motherNpc1Group.add(this.motherNpc1Node);
    this.motherRockOrbisGroup.add(this.motherNpc1Group);
    
    this.motherNpc2Group = new THREE.Group();
    this.motherNpc2Group.quaternion.setFromEuler(new THREE.Euler(160, 74, 0));
    this.motherNpc2Node = new GLOBE.GlobeRobotCharaNode();
    this.motherNpc2Node.position.y = 600;
    this.motherNpc2Node.action = 'Running';
    this.motherNpc2Group.add(this.motherNpc2Node);
    this.motherRockOrbisGroup.add(this.motherNpc2Group);

    this.satelliteNpc1Group = new THREE.Group();
    this.satelliteNpc1Group.quaternion.setFromEuler(new THREE.Euler(82, 44, 0));
    this.satelliteNpc1Node = new GLOBE.GlobeRobotCharaNode();
    this.satelliteNpc1Node.position.y = 40;
    this.satelliteNpc1Node.action = 'Dance';
    this.satelliteNpc1Group.add(this.satelliteNpc1Node);
    this.satelliteRockOrbis1Group.add(this.satelliteNpc1Group);

    this.satelliteNpc2Group = new THREE.Group();
    this.satelliteNpc2Group.quaternion.setFromEuler(new THREE.Euler(23, 77, 0));
    this.satelliteNpc2Node = new GLOBE.GlobeRobotCharaNode();
    this.satelliteNpc2Node.position.y = 40;
    this.satelliteNpc2Node.action = 'Running';
    this.satelliteNpc2Group.add(this.satelliteNpc2Node);
    this.satelliteRockOrbis2Group.add(this.satelliteNpc2Group);
  }

  setAspectRatio(aspectRatio) {
    if (this.camera.aspect == aspectRatio) return;

    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  setOnPlayerStatusListener(listener) {
    this.playerStatusListener = listener;
  }

  updatePeopleStatus(id, data) {
    if (this.peoples[id] == null) {
      console.log(id, data);

      const grassPeopleGroup = new THREE.Group();
      this.grassOrbisGroup.add(grassPeopleGroup);

      const grassPeopleNode = new GLOBE.GlobeRobotCharaNode();
      grassPeopleNode.position.y = 200;
      grassPeopleNode.action = 'Walking';
      grassPeopleGroup.add(grassPeopleNode);
      grassPeopleGroup.quaternion.copy(data.quaternion);

      this.peoples[id] = {
        quaternion: new THREE.Quaternion(),
        previousQuaternion: grassPeopleGroup.quaternion.clone(),
        targetQuaternion: grassPeopleGroup.quaternion.clone(),
        node: grassPeopleNode,
        group: grassPeopleGroup,
        slerpTime: 1,
      };
    } else {
      const people = this.peoples[id];
      people.previousQuaternion.copy(people.group.quaternion.clone());
      people.targetQuaternion.copy(data.quaternion);
      people.slerpTime = 0;
    }
  }

  idlePlayer() {
    this.playerNode.fadeToAction('Idle', 0.2);
  }

  walkPlayer() {
    this.playerNode.fadeToAction('Walking', 0.2);
  }

  jumpPlayer() {
    this.playerNode.fadeToAction("Jump", 0.5, true);
  }

  randomActionPlayer() {
    this.playerNode.fadeToAction("Random", 0.5, true)
  }

  movePlayer(movingDirection, turningDirection) {
    let x = 0, y = 0;

    if (turningDirection < 0) y = -0.04;
    else if (turningDirection > 0) y = 0.04;

    if (movingDirection > 0) x = -0.01;
    else if (movingDirection < 0) x = 0.01;
    const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, 0));
    const playerQuaternionInverted = this.playerGroup.quaternion.clone().invert();
    const rotatedQuaternion = rotationQuaternion.multiply(playerQuaternionInverted).invert();
    this.playerGroup.quaternion.copy(rotatedQuaternion);
      
    // Camera following
    this.previousQuaternion = this.root.quaternion.clone();
    this.targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, 0));
    this.targetQuaternion.multiply(playerQuaternionInverted);
    this.slerpTime = 0;

    // Event
    if (this.playerStatusListener) {
      this.playerStatusListener({ 'quaternion': rotatedQuaternion, 'status': 'Walking' });
    }
  }

  updateAnimation() {
    this.camera.lookAt(this.cameraTarget);
  
    (() => {
      this.motherRockOrbisPivotGroup.rotation.z = Date.now() / 40000;
      this.motherRockOrbisPivotGroup.rotation.y = -0.5;
      this.motherRockOrbisGroup.rotation.z = Date.now() / 20000;
      this.motherRockOrbisGroup.rotation.y = Date.now() / 40000;

      this.satelliteRockOrbis1PivotGroup.rotation.z = Date.now() / 5000;
      this.satelliteRockOrbis1PivotGroup.rotation.y = 0.5;
      this.satelliteRockOrbis1Group.rotation.z = Date.now() / 1000;
      this.satelliteRockOrbis1Group.rotation.y = Date.now() / 3000;

      this.satelliteRockOrbis2PivotGroup.rotation.z = Date.now() / 4000;
      this.satelliteRockOrbis2PivotGroup.rotation.y = 1.5;
      this.satelliteRockOrbis2Group.rotation.z = Date.now() / 1000;
      this.satelliteRockOrbis2Group.rotation.y = Date.now() / 3000;

      // Slerp
      this.slerpedQuaternion.slerpQuaternions(this.previousQuaternion, this.targetQuaternion, this.slerpTime += 0.05);
      this.root.quaternion.copy(this.slerpedQuaternion);
    })();

    (() => {
      const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.01 / 3 * 2, 0, 0));
      const motherNpcQuaternionInverted = this.motherNpc1Group.quaternion.clone().invert();
      const rotatedQuaternion = rotationQuaternion.multiply(motherNpcQuaternionInverted).invert();
      this.motherNpc1Group.quaternion.copy(rotatedQuaternion);
    })();

    (() => {
      const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.01 / 3 * 2, 0, 0));
      const motherNpcQuaternionInverted = this.motherNpc2Group.quaternion.clone().invert();
      const rotatedQuaternion = rotationQuaternion.multiply(motherNpcQuaternionInverted).invert();
      this.motherNpc2Group.quaternion.copy(rotatedQuaternion);
    })();

    (() => {
      const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.04, 0, 0));
      const satelliteNpcQuaternionInverted = this.satelliteNpc2Group.quaternion.clone().invert();
      const rotatedQuaternion = rotationQuaternion.multiply(satelliteNpcQuaternionInverted).invert();
      this.satelliteNpc2Group.quaternion.copy(rotatedQuaternion);
    })();

    this.playerNode.updateAnimation();
    this.motherNpc1Node.updateAnimation();
    this.motherNpc2Node.updateAnimation();
    this.satelliteNpc1Node.updateAnimation();
    this.satelliteNpc2Node.updateAnimation();

    for (const id in this.peoples) {
      const people = this.peoples[id];

      // Slerp
      people.quaternion.slerpQuaternions(people.previousQuaternion, people.targetQuaternion, Math.min(1, people.slerpTime += 0.02));
      people.group.quaternion.copy(people.quaternion);

      // Animation
      people.node.updateAnimation();
    }
  }
}

export { GlobeOrbisScene }