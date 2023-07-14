import { RobotRun } from './robot.js';
import { MapRun } from './map.js';

const robotBtn = document.getElementById('robot-run');
robotBtn.addEventListener('click', RobotRun);

const mapBtn = document.getElementById('map-run');
mapBtn.addEventListener('click', MapRun);
