import {
	MeshBasicMaterial,
  DoubleSide,
} from 'three';

class GlobeRingMaterial extends MeshBasicMaterial {
  constructor() {
    super({ color: 0x00c8ff, alphaTest: 0.4, transparent: true, side: DoubleSide } );
  }
}

export { GlobeRingMaterial }