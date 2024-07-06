// Configuració bàsica de Three.js
const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const d = 10;
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
camera.position.set(10, 10, 10); // Posició inicial de la càmera
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Mirar cap al centre de l'escena

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding; // Correcció gamma
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Mapeig de to
renderer.toneMappingExposure = 0.9; // Ajusta segons calgui
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xfff0f0); // Color pastel (rosat clar)

// Afegir llum ambiental suau
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Afegir llums direccionals
const directionalLightTop = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLightTop.position.set(0, 10, 0);
scene.add(directionalLightTop);

const directionalLightX = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLightX.position.set(10, 0, 0);
scene.add(directionalLightX);

const directionalLightY = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLightY.position.set(0, 0, 10);
scene.add(directionalLightY);

const loader = new THREE.GLTFLoader();
loader.load('model/room.glb', function (gltf) {
    scene.add(gltf.scene);

    creeperHead = gltf.scene.getObjectByName('creeper');
    enderHead = gltf.scene.getObjectByName('ender');
    skeletonHead = gltf.scene.getObjectByName('skeleton');

    if (creeperHead) creeperHead.visible = true;
    if (enderHead) enderHead.visible = false;
    if (skeletonHead) skeletonHead.visible = false;

    animate();
}, undefined, function (error) {
    console.error(error);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.update();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let creeperClickState = 0; // 0 = Mostra Ender, 1 = Mostra Skeleton, 2 = Torna a Creeper

function onPointerDown(event) {
    let clientX = event.clientX;
    let clientY = event.clientY;

    if (event.touches) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }

    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        let selectedObject = intersects[0].object;

        while (selectedObject.parent && selectedObject.parent.type !== 'Scene' && selectedObject.name !== 'creeper') {
            selectedObject = selectedObject.parent;
        }

        if (selectedObject.name === 'creeper') {
            if (creeperClickState === 0) {
                selectedObject.visible = false;
                const enderObject = scene.getObjectByName('ender');
                if (enderObject) enderObject.visible = true;
            } else if (creeperClickState === 1) {
                const enderObject = scene.getObjectByName('ender');
                if (enderObject) enderObject.visible = false;
                const skeletonObject = scene.getObjectByName('skeleton');
                if (skeletonObject) skeletonObject.visible = true;
            } else if (creeperClickState === 2) {
                const skeletonObject = scene.getObjectByName('skeleton');
                if (skeletonObject) skeletonObject.visible = false;
                selectedObject.visible = true;
            }

            creeperClickState = (creeperClickState + 1) % 3;
        }
    }
}

window.addEventListener('click', onPointerDown);
window.addEventListener('touchstart', onPointerDown);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.left = -d * width / height;
    camera.right = d * width / height;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
});
