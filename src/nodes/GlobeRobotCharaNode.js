import {
	Group,
	AnimationMixer,
  Clock,
  LoopRepeat,
  LoopOnce
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class GlobeRobotCharaNode extends Group {
  static stateOptions = {
    'Idle': { loop: true },
    'Walking': { loop: true },
    'Running': { loop: true },
    'Dance': { loop: true },
    'Death': { loop: false },
    'Sitting': { loop: false },
    'Standing': { loop: false },
    'Jump': { loop: false },
    'Yes': { loop: false },
    'No': { loop: false },
    'Wave': { loop: true },
    'Punch': { loop: false },
    'ThumbsUp': { loop: false },
  };

  action; // Name

  mixer;
  clock;
  actions;

  activeAction;
  previousAction;

  constructor() {
    super();

    const loader = new GLTFLoader();
    loader.load(
      '/libs/threejs/models/gltf/RobotExpressive/RobotExpressive.glb',
      (gltf) => this.onModelLoaded(gltf),
      undefined,
      (error) => this.onModelError(error),
    );
  }

  onModelLoaded(gltf) {
    this.model = gltf.scene;
    this.model.scale.x = 15;
    this.model.scale.y = 15;
    this.model.scale.z = 15;

    this.animations = gltf.animations;
    this.add(this.model);

    this.mixer = new AnimationMixer(this.model);
    this.clock = new Clock();
    this.actions = {};
    for ( let i = 0; i < this.animations.length; i ++ ) {
      const clip = this.animations[i];

      const stateOptions = GlobeRobotCharaNode.stateOptions[clip.name];
      if (stateOptions == null) {
        continue;
      }

      const action = this.mixer.clipAction(clip);
      if (stateOptions.loop) {
        action.clampWhenFinished = false;
        action.loop = LoopRepeat;
      } else {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
      }

      this.actions[clip.name] = action;
    }

    this.activeAction = this.actions[this.action || 'Idle'];
    this.activeAction.play();
  }

  onModelError(error) {
    console.error(error);
  }

  fadeToAction(name, duration = 0.2, force = false) {
    if (this.actions[name] == null) return;
    if (force == false) {
      if ( this.activeAction == this.actions[name] ) return;
    }

    this.previousAction = this.activeAction;
    this.activeAction = this.actions[name];

    if (this.previousAction !== this.activeAction) {
      this.previousAction.fadeOut(duration);
    }

    this.activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }

  updateAnimation() {
    if (this.mixer) {
      const dt = this.clock.getDelta();
      this.mixer.update( dt );
    }
  }
}

export { GlobeRobotCharaNode }