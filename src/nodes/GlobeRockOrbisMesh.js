import {
	Mesh,
	IcosahedronGeometry,
} from 'three';
import { GlobeRockMaterial } from 'globe';

class GlobeRockOrbisMesh extends Mesh {
  constructor({ size = 200, detail = 2 }) {
    const geometry = new IcosahedronGeometry( size, detail ); 
    const material = new GlobeRockMaterial(Math.ceil(size / 50)); 
    
    super(geometry, material);
  }
}

export { GlobeRockOrbisMesh }