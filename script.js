// Configuració bàsica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Canviar el color de fons a un color pastel
renderer.setClearColor(0xfff0f0); // Color pastel (rosat clar)

// Afegir llum ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Llum ambiental
scene.add(ambientLight);

// Afegir llum direccional
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(1, 1, 0.5).normalize();
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, 1, 0.5).normalize();
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight3.position.set(0.5, 1, 1).normalize();
scene.add(directionalLight3);

const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight4.position.set(0.5, 1, -1).normalize();
scene.add(directionalLight4);

// Carregar el model GLTF
const loader = new THREE.GLTFLoader();
loader.load('model/room.glb', function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    animate();
}, undefined, function (error) {
    console.error(error);
});

// Configurar la càmera
camera.position.set(0, 1.6, 3);

// Controls per l'usuari (zoom i moviment)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

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
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
