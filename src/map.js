import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Collision from './collision.js';
import {POS} from './algorithm/pos.js'
import * as Factory from './algorithm/factory.js';

let container;
let scene, camera, renderer, gridHelper;
let gui;
let pf;

var components = {
    colMeshes : [], // 碰撞Mesh数组
    startMesh : undefined, // 起点Mesh
    endMesh : undefined, // 终点Mesh
    closePathMeshes : [], // 遍历过close的路径Mesh数组
    lastPathFoundCount : 0, // 上一次找到的路径数量
    resultPathMeshes : [], // 寻路结果路径Mesh数组
};

const gridRenderOrder = 2;
const boxRenderOrder = 1;

const gridSizeEach = 1;
const gridDivision = Collision.width;
const gridSize = gridDivision * gridSizeEach;

export function MapRun() {

    var pf_ctrl = {
        start_pos : Collision.start_pos,
        end_pos : Collision.end_pos,
        algo: Factory.algos[0],
        pause : true,
        step : function() {
            if (pf == undefined) {
                alert("run first!");
                return;
            }
            nextStep();
        },
        finished : false,

        reset : function() {
            this.finished = false;
        }
    }

    function nextStep() {

        if (pf_ctrl.finished) return;

        // set last path to close
        for (let i = 0; i < components.lastPathFoundCount; ++i) {
            var idx = components.closePathMeshes.length - 1 - i;
            var grid = components.closePathMeshes[idx];
            grid.material.color.setHex(0x33ff33);
        }
        components.lastPathFoundCount = 0;

        if (!pf.found()) {
            // 还没找到路径, 继续找
            var pos_list = pf.step();

            // draw new path
            for (let i = 0; i < pos_list.length; ++i) {
                var pos = pos_list[i];

                var grid = createGridFromMapPos(pos, 0x4876FF);
                components.closePathMeshes.push(grid);
            }

            components.lastPathFoundCount = pos_list.length;
        } else {
            // 找到路径后, 把路径画出来
            var path = pf.getResult();
            for (let i = 0; i < path.length; ++i) {
                var pos = path[i];

                var grid = createGridFromMapPos(pos, 0xff3333);
                components.resultPathMeshes.push(grid);
            }

            pf_ctrl.finished = true;
        }
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

        // const cameraFolder = gui.addFolder('CameraHelper');
        // cameraFolder.add(camera.position, 'x');
        // cameraFolder.add(camera.position, 'y');
        // cameraFolder.add(camera.position, 'z');
        // cameraFolder.open();

        const controlFolder = gui.addFolder('Controller');
        const dropdownController =
            controlFolder.add(pf_ctrl, 'algo', Factory.algos).name('Algorithm');
        controlFolder.add(pf_ctrl, "pause");
        controlFolder.add(pf_ctrl, "step").name("Click to step");
        controlFolder.open();

        // Listen for changes in the dropdown value
        dropdownController.onChange(function(value) {
            pf_ctrl.algo = value;
            pf_ctrl.reset();
            pf = Factory.create(pf_ctrl.algo, pf_ctrl.start_pos, pf_ctrl.end_pos);
            clearPath();
        });

    }

    function colColor(colVal) {
        if (colVal <= 1) return 0xFFFFFF;
        if (colVal < 8) return 0xE0E0E0;
        if (colVal < 16) return 0xC0C0C0;
        if (colVal <= 32) return 0xA0A0A0;

        return 0x808080;
    }

    function initMap() {
        // collision
        for (var j = 0; j < Collision.length; ++j) {
            for (var i = 0; i < Collision.width; ++i) {
                var colPos = new POS(i, j);
                var colVal = Collision.get_col(colPos);
                if (colVal == 0) continue;

                var colGrid = createGridFromMapPos(colPos, colColor(colVal));
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
        // console.log("" + window.innerWidth + " " + window.innerHeight);
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
        pf = Factory.create(pf_ctrl.algo, pf_ctrl.start_pos, pf_ctrl.end_pos);
    }

    // Render loop
    function animate() {
        requestAnimationFrame(animate);

        if (!pf_ctrl.pause) nextStep();

        renderer.render(scene, camera);
    }

    function clearPath() {
        // clear path
        for (let i = 0; i < components.closePathMeshes.length; ++i) {
            var grid = components.closePathMeshes[i];
            scene.remove(grid);
        }
        components.closePathMeshes = [];
        for (let i = 0; i < components.resultPathMeshes.length; ++i) {
            var grid = components.resultPathMeshes[i];
            scene.remove(grid);
        }
        components.resultPathMeshes = [];
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
