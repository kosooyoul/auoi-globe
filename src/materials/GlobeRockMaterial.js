import {
	TextureLoader,
	MeshLambertMaterial,
  RepeatWrapping,
  FrontSide
} from 'three';

class GlobeRockMaterial extends MeshLambertMaterial {
  constructor({ size = 1 }) {
    
    const ambient = new TextureLoader().load( '/assets/textures/rock/ambient.jpg' );
    const basecolor = new TextureLoader().load( '/assets/textures/rock/basecolor.jpg' );
    const normal = new TextureLoader().load( '/assets/textures/rock/normal.jpg' );
    const roughness = new TextureLoader().load( '/assets/textures/rock/roughness.jpg' );
    const mapHeight = new TextureLoader().load( '/assets/textures/rock/height.png' );

    ambient.wrapS = RepeatWrapping;
    ambient.wrapT = RepeatWrapping;
    ambient.repeat.set( size, size )
    
    basecolor.wrapS = RepeatWrapping;
    basecolor.wrapT = RepeatWrapping;
    basecolor.repeat.set( size, size )
    
    normal.wrapS = RepeatWrapping;
    normal.wrapT = RepeatWrapping;
    normal.repeat.set( size, size )
    
    roughness.wrapS = RepeatWrapping;
    roughness.wrapT = RepeatWrapping;
    roughness.repeat.set( size, size )
    
    mapHeight.wrapS = RepeatWrapping;
    mapHeight.wrapT = RepeatWrapping;
    mapHeight.repeat.set( size, size )

    
    super( {
      map: basecolor,
      aoMap: ambient,
      bumpMap: normal,
      color: 0x999999,
      // specular: 0xcccccc,
      // displacementScale: 5,
      // shininess: 2,
      bumpMap: mapHeight,
      bumpScale: 2,
      side: FrontSide,
      transparent: true,
      flatShading: true,
    } );

  }
}

export { GlobeRockMaterial }