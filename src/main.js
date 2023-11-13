import { RobotRun } from './robot.js';
import { MapRun } from './map.js';
import { DemoRun } from './demo.js';
import { PfHitRun } from './pf_hit.js';

function clearDrawContainer() {
    const container = document.getElementById('draw_container');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

const robotBtn = document.getElementById('robot-run');
robotBtn.addEventListener('click', function () {
    clearDrawContainer();
    RobotRun();
});

const mapBtn = document.getElementById('map-run');
mapBtn.addEventListener('click', function () {
    clearDrawContainer();
    MapRun();
});

const demoBtn = document.getElementById('demo-run');
demoBtn.addEventListener('click', function () {
    clearDrawContainer();
    DemoRun();
});

const pfHitBtn = document.getElementById('pf-hit-run');
pfHitBtn.addEventListener('click', function () {
    clearDrawContainer();
    PfHitRun();
});
