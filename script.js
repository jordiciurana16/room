// script.js
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

// Canviar el color de fons a un color pastel
renderer.setClearColor(0xfff0f0); // Color pastel (rosat clar)

// Afegir llum ambiental suau
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Llum ambiental suau
scene.add(ambientLight);

// Funció per crear una rodona negra
function addBlackDot(position) {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    scene.add(sphere);
}

// Afegir llum direccional zenital
const directionalLightTop = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLightTop.position.set(0, 10, 0);
scene.add(directionalLightTop);
addBlackDot(directionalLightTop.position);

// Afegir llum direccional en l'eix X
const directionalLightX = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLightX.position.set(10, 0, 0);
scene.add(directionalLightX);
addBlackDot(directionalLightX.position);

// Afegir llum direccional en l'eix Y
const directionalLightY = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLightY.position.set(0, 0, 10);
scene.add(directionalLightY);
addBlackDot(directionalLightY.position);

let creeperHead, enderHead, skeletonHead;

// Carregar el model GLTF
const loader = new THREE.GLTFLoader();
loader.load('model/room.glb', function (gltf) {
    scene.add(gltf.scene);

    // Suposant que els models estan nomenats correctament dins del GLTF
    creeperHead = gltf.scene.getObjectByName('creeper');
    enderHead = gltf.scene.getObjectByName('ender');
    skeletonHead = gltf.scene.getObjectByName('skeleton');

    // Mostrar només el Creeper Head per defecte
    if (creeperHead) creeperHead.visible = true;
    if (enderHead) enderHead.visible = false;
    if (skeletonHead) skeletonHead.visible = false;

    // Rotar el model 90 graus en sentit horari

    animate();
}, undefined, function (error) {
    console.error(error);
});

// Controls per l'usuari (zoom i moviment)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.update();

// Funció per alternar la visibilitat dels models amb un clic
function toggleHeads() {
    if (creeperHead && enderHead && skeletonHead) {
        if (creeperHead.visible) {
            creeperHead.visible = false;
            enderHead.visible = true;
        } else if (enderHead.visible) {
            enderHead.visible = false;
            skeletonHead.visible = true;
        } else if (skeletonHead.visible) {
            skeletonHead.visible = false;
            creeperHead.visible = true;
        }
    }
}

// Afegir Event Listener per al clic
window.addEventListener('click', toggleHeads);

// Funció d'animació
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Actualitzar els controls
    renderer.render(scene, camera);
}

// Ajustar la mida de la finestra
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
