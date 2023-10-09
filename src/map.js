import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Collision from './collision.js';
import { BFS } from './algorithm/breadth_first_search.js';
import {POS} from './algorithm/pos.js'

let container;
let scene, camera, renderer, gridHelper;
let gui;
let pf;
let pause = true;

const gridSize = 50;
const gridDivision = Collision.width;
const gridSizeEach = gridSize/gridDivision;

export function MapRun() {

    function createGrid(x, y, z, color) {

        // box
        const boxGeom = new THREE.BoxGeometry(gridSizeEach, gridSizeEach);
        const box = new THREE.Mesh(boxGeom, new THREE.MeshBasicMaterial({ color:color }));
        box.position.set(x, y, z);
        scene.add(box);
    }

    function createGridFromMapPos(pos, color) {
        const gridX = (pos.x - Collision.width / 2 + 1 - 0.5) * gridSizeEach;
        const gridY = (pos.y - Collision.length / 2 + 1 - 0.5) * gridSizeEach;

        createGrid(gridX, gridY, 0, color);
    }

    function init() {
        gui = new dat.GUI();

        container = document.createElement('div');
        document.body.appendChild(container);

        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );

        // camera setup
        const aspectRatio = window.innerWidth/window.innerHeight;
        const cameraWidth = 100;
        const cameraHeight = cameraWidth/aspectRatio;
        camera = new THREE.OrthographicCamera(cameraWidth/-2, cameraWidth/2, cameraHeight/2, cameraHeight/-2,
                                              1, 1000);
        camera.position.z = 10;
        camera.lookAt(0, 0, 0);

        const cameraFolder = gui.addFolder('CameraHelper');
        cameraFolder.add(camera.position, 'x');
        cameraFolder.add(camera.position, 'y');
        cameraFolder.add(camera.position, 'z');
        cameraFolder.open();

        // const controlFolder = gui.addFolder('Controller');
        // controlFolder.add(pause);
        // controlFolder.open();

        // grid helper
        gridHelper = new THREE.GridHelper(gridSize, gridDivision, 0x000000, 0x000000);
        gridHelper.rotation.x = Math.PI / 2;
        scene.add(gridHelper);

        // collision
        for (var j = 0; j < Collision.length; ++j) {
            for (var i = 0; i < Collision.width; ++i) {
                if (Collision.get_col(i, j) == 0) continue;

                var col_pos = new POS(i, j);
                createGridFromMapPos(col_pos, 0x808080);
            }
        }

        var start_pos = new POS(1, 1);
        createGridFromMapPos(start_pos, 0xff3333);
        var end_pos = new POS(17, 17);
        createGridFromMapPos(end_pos, 0x6600cc);

        // pf
        pf = new BFS(start_pos, end_pos);

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

    // Render loop
    function animate() {
        requestAnimationFrame(animate);

        if (pause) {
            var pos_list = pf.step();

            for (let i = 0; i < pos_list.length; ++i) {
                var pos = pos_list[i];
                createGridFromMapPos(pos, 0x33ff33);
            }
        }
        renderer.render(scene, camera);
    }

    init();
    animate();
}
