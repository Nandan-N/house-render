import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

// Debugging: Check if the script is running
console.log('Script is running');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 2);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Debugging: Check if renderer is added
console.log('Renderer added');

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Grid
const grid = new THREE.GridHelper(100, 10);
scene.add(grid);
grid.name = 'grid';

// Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Interactable objects array
const interactableObjects = [];

// Selected objects array
let selectedObjects = [];

// Groups array
const groups = [];

// Function to add objects to the scene and make them interactable
function addObjectToScene(object) {
    scene.add(object);
    if (object.isMesh) {
        object.castShadow = true;
        interactableObjects.push(object);
    }
}

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
planeGeometry.rotateX(Math.PI / 2);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.name = "plane";
addObjectToScene(plane);
plane.receiveShadow = true;

// Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 'grey' });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-2, 0.5, 0);
cube.name = 'MyCube';
addObjectToScene(cube);

// Another Cube
const cubeGeometry1 = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial1 = new THREE.MeshPhongMaterial({ color: 'grey' });
const cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial1);
cube1.position.set(2, 0.5, 0);
cube1.name = 'MyCube1';
addObjectToScene(cube1);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const outlineColor = 0xffff00; // Yellow for the outline

const outlineMaterial = new THREE.MeshBasicMaterial({ color: outlineColor, side: THREE.BackSide });
const outlineMesh = new THREE.Mesh(cubeGeometry, outlineMaterial);
outlineMesh.scale.multiplyScalar(1.05);
outlineMesh.visible = false; // Initially not visible
scene.add(outlineMesh);

// DragControls setup
const dragControls = new DragControls([...interactableObjects], camera, renderer.domElement);

dragControls.addEventListener('dragstart', function (event) {
    controls.enabled = false;
    outlineMesh.position.copy(event.object.position);
    outlineMesh.rotation.copy(event.object.rotation);
    outlineMesh.scale.copy(event.object.scale).multiplyScalar(1.05);
    outlineMesh.visible = true;
});

dragControls.addEventListener('drag', function (event) {
    outlineMesh.position.copy(event.object.position);
    outlineMesh.rotation.copy(event.object.rotation);
    outlineMesh.scale.copy(event.object.scale).multiplyScalar(1.05);
});

dragControls.addEventListener('dragend', function (event) {
    controls.enabled = true;
    outlineMesh.visible = false;
});

// Hierarchy logging
function logHierarchy(object, indent = '', selectedNames = []) {
    let content = '';
    if (object.name !== 'grid' && object.name !== '') {
        let nameHtml = indent + object.name;
        if (selectedNames.includes(object.name)) {
            nameHtml = `<span class="selected hierarchy-item" data-name="${object.name}">${nameHtml}</span>`;
        } else {
            nameHtml = `<span class="hierarchy-item" data-name="${object.name}">${nameHtml}</span>`;
        }
        content += nameHtml + '<br>';
    }
    for (let i = 0; i < object.children.length; i++) {
        content += logHierarchy(object.children[i], indent + '&nbsp;&nbsp;&nbsp;&nbsp;', selectedNames);
    }
    return content;
}

// Debugging: Ensure windowContent is correctly referenced
const windowContent = document.querySelector('.movable-window .window-content');
if (!windowContent) {
    console.error('windowContent not found');
} else {
    console.log('windowContent found');
}

let selectedObjectName = ''; // Store the selected object's name

function updateHierarchy(selectedNames = []) {
    const hierarchyText = logHierarchy(scene, '', selectedNames);
    windowContent.innerHTML = hierarchyText;

    // Add event listeners for the hierarchy items
    document.querySelectorAll('.hierarchy-item').forEach(item => {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            const objectName = item.getAttribute('data-name');
            highlightObject(objectName, event.shiftKey);
        });
    });
}

// Debugging: Check if updateHierarchy runs initially
updateHierarchy();
console.log('Initial hierarchy updated');

function highlightObject(objectName, addToSelection = false) {
    const foundObject = interactableObjects.find(obj => obj.name === objectName);

    if (foundObject) {
        if (!addToSelection) {
            selectedObjects = [];
        }

        if (selectedObjects.includes(foundObject)) {
            selectedObjects = selectedObjects.filter(obj => obj !== foundObject);
        } else {
            selectedObjects.push(foundObject);
        }

        selectedObjectName = foundObject.name; // Set the selected object's name
        updateHierarchy(selectedObjects.map(obj => obj.name)); // Update the hierarchy with the selected object
        console.log('Highlighted object:', foundObject.name);

        if (selectedObjects.length > 0) {
            outlineMesh.position.copy(selectedObjects[0].position);
            outlineMesh.rotation.copy(selectedObjects[0].rotation);
            outlineMesh.scale.copy(selectedObjects[0].scale).multiplyScalar(1.05);
            outlineMesh.visible = true;
        } else {
            outlineMesh.visible = false;
        }
    }
}

// Make windows draggable
function makeElementDraggable(element) {
    element.onmousedown = function (event) {
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        element.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            element.onmouseup = null;
        };
    };
}

makeElementDraggable(document.getElementById('movableWindow'));
makeElementDraggable(document.getElementById('searchContainer'));
makeElementDraggable(document.getElementById('groupContainer'));

// Debugging: Check if draggable functionality is applied
console.log('Draggable functionality applied');

// Mouse down event for object selection
document.addEventListener('mousedown', onMouseDown);
function onMouseDown(event) {
    const coords = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(coords, camera);
    const intersects = raycaster.intersectObjects(interactableObjects, true);
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.name !== 'grid' && obj.name !== 'plane') {
            if (!event.shiftKey) {
                selectedObjects = [];
            }
            if (!selectedObjects.includes(obj)) {
                selectedObjects.push(obj);
            }
            outlineMesh.position.copy(obj.position);
            outlineMesh.rotation.copy(obj.rotation);
            outlineMesh.visible = true;
            outlineMesh.userData.lastOutlined = obj;
            selectedObjectName = obj.name; // Set the selected object's name
            updateHierarchy(selectedObjects.map(o => o.name)); // Update the hierarchy with the selected object
        }
    }
}

document.addEventListener('mouseup', onMouseUp);
function onMouseUp() {
    if (outlineMesh.userData.lastOutlined) {
        outlineMesh.visible = false;
        delete outlineMesh.userData.lastOutlined;
    }
}

// Animate function
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Debugging: Ensure animate function runs
console.log('Starting animation');
animate();

// Search functionality
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

if (!searchButton) {
    console.error('Search button not found');
} else {
    console.log('Search button found');
}

if (!searchInput) {
    console.error('Search input not found');
} else {
    console.log('Search input found');
}

searchButton.addEventListener('click', () => {
    console.log('Search button clicked');
    const searchTerm = searchInput.value.toLowerCase();
    console.log('Search term:', searchTerm);
    const foundObject = interactableObjects.find(obj => obj.name.toLowerCase() === searchTerm);

    if (foundObject) {
        selectedObjects = [foundObject];
        outlineMesh.position.copy(foundObject.position);
        outlineMesh.rotation.copy(foundObject.rotation);
        outlineMesh.scale.set(foundObject.scale.x * 1.05, foundObject.scale.y * 1.05, foundObject.scale.z * 1.05);
        outlineMesh.visible = true;
        selectedObjectName = foundObject.name; // Set the selected object's name
        updateHierarchy([foundObject.name]); // Update the hierarchy with the selected object
        console.log('Found:', foundObject.name);
    } else {
        outlineMesh.visible = false;
        selectedObjectName = ''; // Clear the selected object's name
        updateHierarchy(); // Update the hierarchy without highlighting any object
        console.log('Object not found');
    }
});

// Ensure input can be typed into
searchInput.addEventListener('input', (event) => {
    console.log('Input changed:', event.target.value);
});

// Group functionality
const createGroupButton = document.getElementById('createGroupButton');
const clearGroupsButton = document.getElementById('clearGroupsButton');
const groupsList = document.getElementById('groupsList');

createGroupButton.addEventListener('click', () => {
    if (selectedObjects.length > 0) {
        const newGroup = new THREE.Group();
        selectedObjects.forEach(obj => newGroup.add(obj));
        const groupName = 'Group' + (groups.length + 1);
        newGroup.name = groupName;
        groups.push(newGroup);
        scene.add(newGroup);
        updateGroupsList();
        selectedObjects = []; // Clear selected objects after grouping
        updateHierarchy(); // Update hierarchy to reflect changes
        console.log('Group created:', groupName);
    } else {
        console.log('No objects selected to create a group');
    }
});

clearGroupsButton.addEventListener('click', () => {
    groups.forEach(group => {
        group.children.forEach(child => scene.add(child)); // Re-add children to the scene
        scene.remove(group);
    });
    groups.length = 0; // Clear the array
    updateGroupsList();
    updateHierarchy(); // Update hierarchy to reflect changes
    console.log('All groups cleared');
});

function updateGroupsList() {
    groupsList.innerHTML = groups.map(group => `<div class="group-item" data-name="${group.name}">${group.name}</div>`).join('');

    // Add event listeners for the group items
    document.querySelectorAll('.group-item').forEach(item => {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            const groupName = item.getAttribute('data-name');
            highlightGroup(groupName);
        });
    });
}

// Highlight objects in a group
function highlightGroup(groupName) {
    const group = groups.find(g => g.name === groupName);

    if (group) {
        selectedObjects = group.children.filter(obj => obj.isMesh);
        updateHierarchy(selectedObjects.map(obj => obj.name));

        if (selectedObjects.length > 0) {
            outlineMesh.position.copy(selectedObjects[0].position);
            outlineMesh.rotation.copy(selectedObjects[0].rotation);
            outlineMesh.scale.copy(selectedObjects[0].scale).multiplyScalar(1.05);
            outlineMesh.visible = true;
        } else {
            outlineMesh.visible = false;
        }

        console.log('Group highlighted:', groupName);
    }
}