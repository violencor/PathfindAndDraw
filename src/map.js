import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Collision from './collision.js';
import { BFS } from './algorithm/breadth_first_search.js';
import {POS} from './algorithm/pos.js'

let container;
let scene, camera, renderer, gridHelper;
let gui;
let pf;

var components = {
    colMeshes : [], // 碰撞Mesh数组
    startMesh : undefined, // 起点Mesh
    endMesh : undefined, // 终点Mesh
    pathMeshes : [], // 路径Mesh数组
    lastPathFoundCount : 0, // 上一次找到的路径数量
};

const gridRenderOrder = 2;
const boxRenderOrder = 1;

const gridSizeEach = 1;
const gridDivision = Collision.width;
const gridSize = gridDivision * gridSizeEach;

export function MapRun() {

    const algos = ['BFS', 'DFS', 'A*'];
    const pf_ctrl = {
        start_pos : new POS(1, 1),
        end_pos : new POS(17, 17),
        algo: algos[0],
        pause : true,
        step : function() {
            if (pf == undefined) {
                alert("run first!");
                return;
            }
            nextStep();
        },
    }

    function nextStep() {
        var pos_list = pf.step();

        // set last path to white
        for (let i = 0; i < components.lastPathFoundCount; ++i) {
            var idx = components.pathMeshes.length - 1 - i;
            var grid = components.pathMeshes[idx];
            grid.material.color.setHex(0x33ff33);
        }

        // draw new path
        for (let i = 0; i < pos_list.length; ++i) {
            var pos = pos_list[i];

            var grid = createGridFromMapPos(pos, 0x4876FF);
            components.pathMeshes.push(grid);
        }

        components.lastPathFoundCount = pos_list.length;
    }

    function createGrid(x, y, z, color) {

        // box
        const boxSize = gridSizeEach;
        const boxGeom = new THREE.BoxGeometry(boxSize, boxSize);
        const box = new THREE.Mesh(boxGeom, new THREE.MeshBasicMaterial({ color:color }));
        box.renderOrder = boxRenderOrder;
        box.position.set(x, y, z);
        scene.add(box);

        return box;
    }

    function createGridFromMapPos(pos, color) {
        const gridX = (pos.x - Collision.width / 2 + 1 - 0.5) * gridSizeEach;
        const gridY = (pos.y - Collision.length / 2 + 1 - 0.5) * gridSizeEach;

        return createGrid(gridX, gridY, 0, color);
    }

    function setupGUI() {

        gui = new dat.GUI();

        const cameraFolder = gui.addFolder('CameraHelper');
        cameraFolder.add(camera.position, 'x');
        cameraFolder.add(camera.position, 'y');
        cameraFolder.add(camera.position, 'z');
        cameraFolder.open();

        const controlFolder = gui.addFolder('Controller');
        const dropdownController =
            controlFolder.add(pf_ctrl, 'algo', algos).name('Algorithm');
        controlFolder.add(pf_ctrl, "pause");
        controlFolder.add(pf_ctrl, "step").name("Click to step");
        controlFolder.open();

        // Listen for changes in the dropdown value
        dropdownController.onChange(function(value) {
            console.log('Selected dropdown value:', value);
        });

    }

    function initMap() {
        // collision
        for (var j = 0; j < Collision.length; ++j) {
            for (var i = 0; i < Collision.width; ++i) {
                var colPos = new POS(i, j);
                if (Collision.get_col(colPos) == 0) continue;

                var colGrid = createGridFromMapPos(colPos, 0x808080);
                components.colMeshes.push(colGrid);
            }
        }

        components.startMesh = createGridFromMapPos(pf_ctrl.start_pos, 0xff3333);
        components.endMesh = createGridFromMapPos(pf_ctrl.end_pos, 0x6600cc);
    }

    function initRenderer() {

        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );

        // camera setup
        const aspectRatio = window.innerWidth/window.innerHeight;
        console.log("" + window.innerWidth + " " + window.innerHeight);
        const cameraWidth = 100;
        const cameraHeight = cameraWidth/aspectRatio;
        camera = new THREE.OrthographicCamera(cameraWidth/-2,
                                              cameraWidth/2,
                                              cameraHeight/2,
                                              cameraHeight/-2,
                                              1, 1000);
        camera.position.z = 10;
        camera.lookAt(0, 0, 0);

        // grid helper
        gridHelper = new THREE.GridHelper(gridSize, gridDivision, 0x000000, 0x000000);
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.renderOrder = gridRenderOrder;
        gridHelper.material.depthTest = false;
        scene.add(gridHelper);

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );

        container = document.getElementById('draw_container');
        container.appendChild(renderer.domElement);

        // Resize listener
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    function init() {
        // renderer
        initRenderer();

        // gui
        setupGUI();

        // 绘制初始地图
        initMap();

        // pf
        pf = new BFS(pf_ctrl.start_pos, pf_ctrl.end_pos);
    }

    // Render loop
    function animate() {
        requestAnimationFrame(animate);

        if (!pf_ctrl.pause) nextStep();

        renderer.render(scene, camera);
    }

    function clearPath() {
        // clear path
        for (let i = 0; i < components.pathMeshes.length; ++i) {
            var grid = components.pathMeshes[i];
            scene.remove(grid);
        }
        components.pathMeshes = [];
        components.lastPathFoundCount = 0;
    }

    function clearComponents() {
        // clear col
        for (let i = 0; i < components.colMeshes.length; ++i) {
            var grid = components.colMeshes[i];
            scene.remove(grid);
        }
        components.colMeshes = [];

        // clear start
        if (components.startMesh != undefined) {
            scene.remove(components.startMesh);
            components.startMesh = undefined;
        }

        // clear end
        if (components.endMesh != undefined) {
            scene.remove(components.endMesh);
            components.endMesh = undefined;
        }

        // clear path
        clearPath();
    }

    function clear() {
        clearComponents();
        container = undefined;
        scene = undefined;
        camera = undefined;
        renderer = undefined;
        gridHelper = undefined;
        if (gui != undefined) gui.destroy();
        gui = undefined;
        pf = undefined;
    }

    clear();
    init();
    animate();
}
