
var scene = null,
    camera = null,
    renderer = null,
    Floors = null,
    controls = null,
    input = { left: false, right: false, up:false, down: false },
    fondoActual = 'dia.jpg';


var scale = 1;
var rotSpd = 0.05;
var spd = 10;
var input = { left: false, right: false, up:false, down: false };


scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);

camera.position.set(361, 137, 4);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Color de fondo
scene.background = new THREE.Color("white");

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.autoRotate = false;


//-----------Luces-----------------------------
var hemisphereLight = new THREE.HemisphereLight('white', 'crimson');
scene.add(hemisphereLight);

var light = new THREE.DirectionalLight('white', 0.5);
light.position.set(1, 1, 1);
scene.add(light);
//--------------------------------------------

//Cargar el fondo
loadBackground(fondoActual);
loadObjMtl("/src/modelos/OBJ_MTL/", "zoologico.mtl", "zoologico.obj", { x: 0, y: 0, z: 0 });


function loadObjMtl(path, nameMTL, nameOBJ, position) {

    //1.Load MTL (Texture)
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(path);
    mtlLoader.setPath(path);
    mtlLoader.load(nameMTL, function (material) {
        material.preload();

        // 2. Load OBJ (Mesh)
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath(path);
        objLoader.setMaterials(material);
        objLoader.load(nameOBJ, function (object) {
            // Compute the bounding box of the object
            var boundingBox = new THREE.Box3().setFromObject(object);

            // Calculate the center of the bounding box
            var center = new THREE.Vector3();
            boundingBox.getCenter(center);

            //  Calculate the position adjustment to center the object
            var offsetX = -center.x + position.x;
            var offsetY = -center.y + position.y;
            var offsetZ = -center.z + position.z;

            // Ajustar la posicion
            object.position.set(offsetX, offsetY, offsetZ);
            object.scale.set(50, 50, 50);
            scene.add(object);
        });

    });

}


// Crear un objeto contenedor para la cámara y el objetivo
var cameraContainer = new THREE.Object3D();
scene.add(cameraContainer);
cameraContainer.add(camera);

// Agregar un evento de escucha de teclado al documento
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Definir funciones para manejar eventos de teclado
function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            input.left = true;
            break;
        case 'ArrowRight':
            input.right = true;
            break;
        case 'ArrowUp':
            input.up = true;
            break;
        case 'ArrowDown':
            input.down = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.key) {
        case 'ArrowLeft':
            input.left = false;
            break;
        case 'ArrowRight':
            input.right = false;
            break;
        case 'ArrowUp':
            input.up = false;
            break;
        case 'ArrowDown':
            input.down = false;
            break;
    }
}


// ---- Mensaje de Bienvenida ----------------
document.addEventListener("DOMContentLoaded", function () {
    // se obtiene el elemento del mensaje por su id
    var mensaje = document.getElementById("welcomeMessage");

    // Espera 10 segundos (10000 milisegundos) y luego oculta el mensaje
    setTimeout(function () {
        mensaje.style.display = "none";
    }, 6000);
});

//--------Sonido de Fondo-------------------
var soundEnabled = true; // Variable para rastrear si el sonido está habilitado o deshabilitado
var audioElement = document.getElementById("audioElement");
//Cambiar icono del boton de sonido
document.getElementById("toggleSoundBtn").addEventListener('click', function () {
    var icon = document.getElementById("soundIcon")

    // Cambia el icono
    icon.classList.toggle("bi-volume-mute-fill");
    icon.classList.toggle("bi-volume-up-fill");

    // Detiene el sonido
    if (soundEnabled) {
        audioElement.pause();
        soundEnabled = false;
    } else {
        audioElement.play();
        soundEnabled = true;
    }
    // Reinicia el sonido
    audioElement.addEventListener("ended", function () {
        if (soundEnabled) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
    });
});
function initSound3D() {
    sound3D = new Sound(["../sonidos/zoo.mp3"], 30, scene, {
        debug: true,
        position: { x: 0, y: 4, z: 0 }
    });
    // Inicia la reproducción del sonido solo si soundEnabled es verdadero
    if (soundEnabled) {
        sound3D.play();
    }
}
//--------------------------------------------------------------

// ---- Info Panda ---------------------------------------------
var pandaButton = document.getElementById("pandaBtn");
var mensajePanda = document.getElementById("infoPanda");
var infoPandaSound = document.getElementById("infoPandaSound");
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
   
    let currentPanel = null;
    function toggleMensaje(button, panel) {
        if (currentPanel === panel && currentPanel.style.display === "block") {
            panel.style.display = "none";
            currentPanel = null;
            infoPandaSound.pause();
            infoOrcaSound.pause();
            infoJirafaSound.pause();
            infoCocodriloSound.pause();
            mensajeCocodrilo.style.display="none";
            mensajeOrca.style.display="none";
            mensajeJirafa.style.display="none";
            audioElement.play();
        } else {
            if (currentPanel) {
                currentPanel.style.display = "none";
            }
            panel.style.display = "block";
            mensajeCocodrilo.style.display="none";
            mensajeOrca.style.display="none";
            mensajeJirafa.style.display="none";
            currentPanel = panel;
            infoPandaSound.play();
            audioElement.play();
        }
    }
  
    pandaButton.addEventListener("click", function (event) {
        toggleMensaje(pandaButton, mensajePanda);
        event.stopPropagation();
    });
    // Se Cierra el panel actual si se hace clic en cualquier parte
    document.addEventListener("click", function () {
        if (currentPanel) {
            currentPanel.style.display = "none";
            currentPanel = null;
            infoPandaSound.pause();
            audioElement.play();
        }
    });
});

// ---- Info Cocodrilo -------------------------------------------------
var cocodriloButton = document.getElementById("cocodriloBtn");
var mensajeCocodrilo = document.getElementById("infoCocodrilo");
var infoCocodriloSound = document.getElementById("infoCocodriloSound");
//----------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    let currentPanel = null;
  
    function toggleMensaje(button, panel) {
        if (currentPanel === panel && currentPanel.style.display === "block") {
            panel.style.display = "none";
            currentPanel = null;
            infoCocodriloSound.pause();
            infoOrcaSound.pause();
            infoPandaSound.pause();
            infoJirafaSound.pause();
            mensajeOrca.style.display="none";
            mensajePanda.style.display="none";
            mensajeJirafa.style.display="none";
            audioElement.play();
        } else {
            if (currentPanel) {
                currentPanel.style.display = "none";
            }
            panel.style.display = "block";
            mensajeOrca.style.display="none";
            mensajePanda.style.display="none";
            mensajeJirafa.style.display="none";
            currentPanel = panel;
            infoCocodriloSound.play();
            audioElement.play();
        }
    }

    cocodriloButton.addEventListener("click", function (event) {
        toggleMensaje(cocodriloButton, mensajeCocodrilo);
        event.stopPropagation();
    });
    // Se Cierra el panel actual si se hace clic en cualquier parte
    document.addEventListener("click", function () {
        if (currentPanel) {
            currentPanel.style.display = "none";
            currentPanel = null;
            infoCocodriloSound.pause();
            audioElement.play();
        }
    });

});

// ---- Info Jirafa -----------------------------------------------------
var jirafaButton = document.getElementById("jirafaBtn");
var mensajeJirafa = document.getElementById("infoJirafa");
var infoJirafaSound = document.getElementById("infoJirafaSound");
//------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    let currentJirafaPanel = null;

    function toggleJirafaMensaje(button, panel) {
        if (currentJirafaPanel === panel && currentJirafaPanel.style.display === "block") {
            panel.style.display = "none";
            currentJirafaPanel = null;
            infoJirafaSound.pause();
            infoOrcaSound.pause();
            infoPandaSound.pause();
            infoCocodriloSound.pause();
            mensajeCocodrilo.style.display="none";
            mensajePanda.style.display="none";
            mensajeOrca.style.display="none";
            audioElement.play();
        } else {
            if (currentJirafaPanel) {
                currentJirafaPanel.style.display = "none";
            }
            panel.style.display = "block";
            mensajeCocodrilo.style.display="none";
            mensajePanda.style.display="none";
            mensajeOrca.style.display="none";
            currentJirafaPanel = panel;
            infoJirafaSound.play();
            audioElement.play();
        }
    }

    jirafaButton.addEventListener("click", function (event) {
        toggleJirafaMensaje(jirafaButton, mensajeJirafa);
        event.stopPropagation();
    });

    // Se Cierra el panel de la jirafa si se hace clic en cualquier parte
    document.addEventListener("click", function () {
        if (currentJirafaPanel) {
            currentJirafaPanel.style.display = "none";
            currentJirafaPanel = null;
            infoJirafaSound.pause();
            audioElement.play();
        }
    });
});

// -------------Info Orca ---------------------------------------------
var orcaButton = document.getElementById("orcaBtn");
var mensajeOrca = document.getElementById("infoOrca");
var infoOrcaSound = document.getElementById("infoOrcaSound");
document.addEventListener("DOMContentLoaded", function () {
    let currentOrcaPanel = null;

    function toggleOrcaMensaje(button, panel) {
        if (currentOrcaPanel === panel && currentOrcaPanel.style.display === "block") {
            panel.style.display = "none";
            currentOrcaPanel = null;
            infoOrcaSound.pause();
            infoPandaSound.pause();
            infoJirafaSound.pause();
            infoCocodriloSound.pause();
            mensajeCocodrilo.style.display="none";
            mensajePanda.style.display="none";
            mensajeJirafa.style.display="none";
            audioElement.play();
        } else {
            if (currentOrcaPanel) {
                currentOrcaPanel.style.display = "none";
            }
            panel.style.display = "block";
            mensajeCocodrilo.style.display="none";
            mensajePanda.style.display="none";
            mensajeJirafa.style.display="none";
            currentOrcaPanel = panel;
            infoOrcaSound.play();
            audioElement.play();
        }
    }

    orcaButton.addEventListener("click", function (event) {
        toggleOrcaMensaje(orcaButton, mensajeOrca);
        event.stopPropagation();
    });

    // Se Cierra el panel de la orca si se hace clic en cualquier parte
    document.addEventListener("click", function () {
        if (currentOrcaPanel) {
            currentOrcaPanel.style.display = "none";
            currentOrcaPanel = null;
            infoOrcaSound.pause();
            audioElement.play();
        }
    });
});

//-------------------------------------------------------------------
//Funcion para cargar el fondo
function loadBackground(backgroundFile) {
    //Load background texture
    const loader = new THREE.TextureLoader();
    loader.load('/src/img/' + backgroundFile, function (texture) {
        scene.background = texture;
    });
}

//Funcion para seleccionar el fondo
function changeBackground() {

    // Cambiar el fondo al hacer clic en el botón
    if (fondoActual === 'dia.jpg') {
        fondoActual = 'noche.jpg';
    } else {
        fondoActual = 'dia.jpg';
    }
    loadBackground(fondoActual);
}
// Agregar un botón en tu HTML con el id "changeBackgroundBtn"
document.getElementById("changeBackgroundBtn").addEventListener("click", changeBackground);

//---------------------------------------------------------

//---Cambiar icono y texto del boton de modo noche/modo dia --------------
document.getElementById("modeBtn").addEventListener('click', function () {
    var icon = document.getElementById("modeIcon");
    var buttonText = document.getElementById("modeText");

    // Cambia el icono
    icon.classList.toggle("bi-cloud-moon-fill");
    icon.classList.toggle("bi-cloud-sun-fill");

    // Cambia el texto del botón
    if (icon.classList.contains("bi-cloud-moon-fill")) {
        buttonText.textContent = "Modo Noche";
    } else {
        buttonText.textContent = "Modo Día";
    }

});





//------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    // Rotar el objeto contenedor según las teclas presionadas

    // Rotar el objeto contenedor según las teclas presionadas
    if (input.left) {
        cameraContainer.rotation.y += rotSpd;
    } else if (input.right) {
        cameraContainer.rotation.y -= rotSpd;
    }

    renderer.render(scene, camera);
    
    // console.log(camera.position)
    //console.log(camera.rotation.y)
}

//Funcion para renderizar
animate();
