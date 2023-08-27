import {
	Mesh,
	IcosahedronGeometry,
} from 'three';
import { GlobeGrassMaterial } from 'globe';

class GlobeGrassOrbisMesh extends Mesh {
  constructor({ size = 200, detail = 2 }) {
    const geometry = new IcosahedronGeometry( size, detail ); 
    const material = new GlobeGrassMaterial(Math.ceil(size / 50)); 
    
    super(geometry, material);
  }
}

export { GlobeGrassOrbisMesh }