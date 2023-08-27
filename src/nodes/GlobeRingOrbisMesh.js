import {
	Mesh,
	TorusGeometry,
} from 'three';
import { GlobeRingMaterial } from 'globe';

class GlobeRingOrbisMesh extends Mesh {
  constructor({ size = 200, width = 3 }) {
    const geometry = new TorusGeometry( size, width, size / 8 ); 
    const material = new GlobeRingMaterial(); 
    
    super(geometry, material);
  }
}

export { GlobeRingOrbisMesh }