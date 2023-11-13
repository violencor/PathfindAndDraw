import * as THREE from 'three';
import * as dat from 'dat.gui';
import {POS} from './algorithm/pos.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

let container;
let scene, camera, renderer, gridHelper;
let gui;
let pfHitData;
let pause = true;

const offsetX = 2515;
const offsetY = 1541;

const Collision = {
    width: 500,
    length: 500,
    get_col: function (x, y) {
        return 0;
    }
};

class PfHit {
    constructor(x, y, counter) {
        this.x = x;
        this.y = y;
        this.counter = counter;
    }
};

const gridDivision = Collision.width;
const gridSizeEach = 1;
const gridSize = gridDivision * gridSizeEach;
let pfHitGridMap = new Map();

export function PfHitRun() {

    function createGrid(x, y, z, color) {

        // box
        const boxGeom = new THREE.BoxGeometry(gridSizeEach, gridSizeEach);
        const box = new THREE.Mesh(boxGeom, new THREE.MeshBasicMaterial({ color:color }));
        box.position.set(x, y, z);

        // console.log("draw box on ", box.position);
        scene.add(box);
    }

    function createGridFromMapPos(pos, color) {
        const gridX = (pos.x - Collision.width / 2 + 1 - 0.5) * gridSizeEach;
        const gridY = (pos.y - Collision.length / 2 + 1 - 0.5) * gridSizeEach;

        createGrid(gridX, gridY, 0, color);
    }

    function readPfHitData() {
        var reader = new FileReader();
        reader.addEventListener('load', function() {
            document.getElementById('pf-hit-file').innerText = this.result;
        });
        reader.onload = function (event) {
            const contents = event.target.result;
            const lines = contents.split('\n');

            for (const line of lines) {
                const pos = line.split(' ');
                const x = parseInt(pos[0]) - offsetX;
                const y = parseInt(pos[1]) - offsetY;
                if (x < 0 || y < 0) {
                    console.log("invalid pos", x, y);
                }

                const key = y * 1000 + x;
                var hitData = pfHitGridMap.get(key);
                // console.log("key: ", key, " , value: ", hitData);
                if (hitData === undefined) {
                    pfHitGridMap.set(key, new PfHit(x, y, 1));
                    // console.log("set new key: ", key, " , value: ", pfHitGridMap.get(key));
                } else {
                    pfHitGridMap.set(key, new PfHit(x, y, hitData.counter + 1));
                    // console.log("add counter, key: ", key, " , value: ", pfHitGridMap.get(key));
                }
            }

            // renderPfHitData
            renderPfHitData();
        };
        pfHitData = reader.readAsText(document.querySelector('input').files[0]);
    }

    function renderPfHitData() {
        console.log("render pf hit data, map length: ", pfHitGridMap.size);

        var repeatedCounter = 0;

        // 遍历pfHitGridMap
        for (const [key, value] of pfHitGridMap) {
            // var value = pfHitGridMap[key];
            // console.log("draw pos", value.x, value.y);

            if (value.counter > 1) {
                const origPos = new POS(value.x + offsetX, value.y + offsetY);
                repeatedCounter+=value.counter;
                console.log("repeated pos: ", origPos, " , counter: ", value.counter);
            }

            // 绘制每个格子
            // fillTextFromMapPos(new POS(value.x, value.y), value.counter);
            createGridFromMapPos(new POS(value.x, value.y), 0xff0000);
        }

        console.log("render pf hit data, repeated pos counter: ", repeatedCounter);
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
        const cameraWidth = 1000;
        // const cameraHeight = cameraWidth;
        const cameraHeight = cameraWidth/aspectRatio;
        camera = new THREE.OrthographicCamera(cameraWidth/-2,
                                              cameraWidth/2,
                                              cameraHeight/2,
                                              cameraHeight/-2,
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

        // read pf hit file
        readPfHitData();

        // renderPfHitData
        // renderPfHitData();

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild(renderer.domElement);

        // Resize listener
        container.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // scroll listener
        container.addEventListener('scroll', () => {
            camera.position.x = window.scrollX;
            camera.position.y = window.scrollY;
        });
    }

    // Render loop
    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    init();
    animate();
}
