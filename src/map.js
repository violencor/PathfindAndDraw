import * as THREE from 'three';

let container;
let scene, camera, renderer;

export function MapRun() {

    init();
    // createCylinder();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );

        // camera setup
        camera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2,
                                              window.innerHeight/2, -window.innerHeight/2,
                                              1, 1000);

        // Create a grid of cubes 
        const gridSize = 10;
        const gridHelper = new THREE.GridHelper(gridSize, gridSize, 0x000000, 0x000000);
        scene.add(gridHelper);

        // Boxes
        const boxGeom = new THREE.BoxGeometry(1, 1);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const box = new THREE.Mesh(boxGeom, new THREE.MeshBasicMaterial({color: 'teal'}));
                box.position.set(i, j, 0);
                scene.add(box);
            }
        }

        // // lights
        // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
        // hemiLight.position.set( 0, 20, 0 );
        // scene.add( hemiLight );

        // const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
        // dirLight.position.set( 0, 20, 10 );
        // scene.add( dirLight );

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild(renderer.domElement);

        // Resize listener
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }




    // const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    // const cubeMat = new THREE.MeshLambertMaterial({color: 0xcccccc});

    // for(let i=0; i<gridSize; i++) {
    //     for(let j=0; j<gridSize; j++) {
    //         const cube = new THREE.Mesh(cubeGeo, cubeMat);
    //         cube.position.set(i, 0, j);
    //         cube.scale.set(2, 2, 2);
    //         scene.add(cube);
    //     }
    // }

    function createCylinder() {
        // Cylinder unit
        const cylGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const cylMat = new THREE.MeshPhongMaterial({color: 0xff0000}); 
        const cylinder = new THREE.Mesh(cylGeo, cylMat);

        // Place at a grid position 
        cylinder.position.set(3, 0.5, 5); 
        cylinder.scale.set(2, 2, 2);
        scene.add(cylinder);
    }

    // Render loop
    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    // // Movement
    // let unitX = 3;
    // let unitZ = 5;

    // function moveUnit(dx, dz) {
    //     unitX += dx;
    //     unitZ += dz;
    //     cylinder.position.set(unitX, 0.5, unitZ);
    // }

    // // Bind keys
    // document.addEventListener('keydown', (e) => {
    //     switch(e.key) {
    //         case 'ArrowLeft': 
    //             moveUnit(-1, 0);
    //             break;
    //         case 'ArrowRight':
    //             moveUnit(1, 0);
    //             break;
    //         case 'ArrowUp':
    //             moveUnit(0, 1);
    //             break; 
    //         case 'ArrowDown':
    //             moveUnit(0, -1);
    //             break;
    //     }
    // });
}
