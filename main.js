// ==========================================
// DETECCIÓN DE DISPOSITIVO
// ==========================================
const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

// Cantidades adaptadas para que no sean estorbosas
const CFG = {
    particles:   isMobile ? 10  : 25,
    flowers:     isMobile ? 10  : 20,
    butterflies: isMobile ? 8   : 15,
    fireflies:   isMobile ? 12  : 30,
};

// ==========================================
// 1. LLUVIA DE CORAZONES
// ==========================================
tsParticles.load("tsparticles", {
    detectRetina: false,
    fpsLimit: isMobile ? 30 : 60,
    particles: {
        shape: {
            type: "image",
            options: {
                image: {
                    src: "corazon.png",
                    width: 100,
                    height: 100
                }
            }
        },
        opacity: { value: 0.8, animation: { enable: false } },
        size: {
            value: isMobile ? { min: 8, max: 18 } : { min: 10, max: 25 },
            animation: { enable: !isMobile, speed: 2, minimumValue: 8 }
        },
        move: {
            enable: true,
            speed: isMobile ? { min: 1, max: 3 } : { min: 2, max: 5 },
            direction: "bottom",
            straight: true,
            outModes: { default: "out" }
        },
        number: {
            density: { enable: true, area: 800 },
            value: CFG.particles
        }
    }
});

// ==========================================
// 2. GENERADOR DEL JARDÍN
// ==========================================
const gardenContainer = document.getElementById('garden-container');

const flowerTemplate = `
    <div class="flower flower--1">
        <div class="flower__leafs flower__leafs--1">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__white-circle"></div>
            <div class="flower__line__leaf flower__line__leaf--1"></div>
            <div class="flower__line__leaf flower__line__leaf--2"></div>
            <div class="flower__line__leaf flower__line__leaf--3"></div>
            <div class="flower__line__leaf flower__line__leaf--4"></div>
        </div>
        <div class="flower__line"></div>
    </div>
`;

function buildGarden() {
    let i = 0;
    function addBatch() {
        const batchSize = isMobile ? 3 : 8;
        const end = Math.min(i + batchSize, CFG.flowers);
        const fragment = document.createDocumentFragment();
        for (; i < end; i++) {
            let wrapper = document.createElement('div');
            wrapper.className = 'flower-wrapper';
            wrapper.innerHTML = flowerTemplate;

            let yPos    = Math.random();
            let leftPos = Math.random() * 100;
            let scale   = 0.5 + (yPos * 0.8);
            let delay   = Math.random() * 5;

            wrapper.style.cssText = `
                left: ${leftPos}%;
                transform: scale(${scale});
                z-index: ${Math.floor(yPos * 100)};
                filter: hue-rotate(${Math.random() * 20 - 10}deg) brightness(${0.8 + (yPos * 0.4)});
            `;

            let line  = wrapper.querySelector('.flower__line');
            let leafs = wrapper.querySelector('.flower__leafs');
            if (line)  line.style.animationDelay  = `${delay}s`;
            if (leafs) leafs.style.animationDelay = `${delay + 1.1}s`;

            fragment.appendChild(wrapper);
        }
        gardenContainer.appendChild(fragment);
        if (i < CFG.flowers) setTimeout(addBatch, 60);
    }
    addBatch();
}
buildGarden();

// ==========================================
// 3. FRASES SECUENCIALES Y FOTO FINAL
// ==========================================
const frases = [
    "Cada momento a tu lado hace que mi mundo sea mucho más bonito.",
    "Gracias por tu amor, tu ternura y por iluminar todos mis días.",
    "Ni la mejor fotografía podría capturar lo especial y preciosa que eres.",
    "Te amo muchísimo, gracias por cada sonrisa y por nuestra historia juntos."
];

let fraseIndex = 0;
const messageContainer = document.getElementById('message-container');
const photoContainer = document.getElementById('photo-container');

function mostrarSiguienteFrase() {
    gsap.to(messageContainer, {
        opacity: 0,
        duration: 1.2,
        onComplete: () => {
            if (fraseIndex < frases.length) {
                messageContainer.innerHTML = frases[fraseIndex];
                fraseIndex++;
                gsap.to(messageContainer, { opacity: 1, duration: 1.5 });
                setTimeout(mostrarSiguienteFrase, 7000);
            } else if (photoContainer) {
                // Al terminar las frases, aparece la fotografía Polaroid
                gsap.to(photoContainer, {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "back.out(1.5)"
                });
            }
        }
    });
}

// ==========================================
// 4. MARIPOSAS
// ==========================================
const maxButterflyY = window.innerHeight * 0.55;

function createButterfly() {
    let wrapper = document.createElement('div');
    wrapper.className = 'butterfly-wrapper';

    let wing = document.createElement('div');
    wing.className = 'butterfly-wing';
    wing.style.animationDuration = `${Math.random() * 0.15 + 0.15}s`;

    wrapper.appendChild(wing);
    document.body.appendChild(wrapper);

    let startX = Math.random() * window.innerWidth;
    let startY = Math.random() * maxButterflyY;
    let scale  = (Math.random() * 0.4 + 0.4) * (isMobile ? 0.7 : 1);

    wrapper.style.left      = startX + 'px';
    wrapper.style.top       = startY + 'px';
    wrapper.style.transform = `scale(${scale})`;

    gsap.set(wrapper, { opacity: 0 });
    gsap.to(wrapper, {
        opacity: 1,
        duration: 1,
        onComplete: () => flyButterfly(wrapper)
    });
}

function flyButterfly(butterfly) {
    let destX    = Math.random() * window.innerWidth;
    let destY    = Math.random() * maxButterflyY;
    let duration = isMobile
        ? Math.random() * 7 + 6
        : Math.random() * 5 + 3;

    let curX   = parseFloat(butterfly.style.left) || 0;
    let facing = destX >= curX ? "scaleX(1)" : "scaleX(-1)";
    butterfly.querySelector('.butterfly-wing').style.transform = facing;

    let midX = (curX + destX) / 2;
    let midY = Math.max(0, Math.min(maxButterflyY, destY + (Math.random() * 50 - 25)));

    gsap.to(butterfly, {
        duration: duration / 2,
        left: midX,
        top:  midY,
        ease: "sine.inOut",
        onComplete: () => {
            butterfly.style.left = midX + 'px';
            butterfly.style.top  = midY + 'px';
            gsap.to(butterfly, {
                duration: duration / 2,
                left: destX,
                top:  destY,
                ease: "sine.inOut",
                onComplete: () => {
                    butterfly.style.left = destX + 'px';
                    butterfly.style.top  = destY + 'px';
                    flyButterfly(butterfly);
                }
            });
        }
    });
}

for (let i = 0; i < CFG.butterflies; i++) {
    setTimeout(createButterfly, i * (isMobile ? 400 : 150));
}

// ==========================================
// 5. LUCIÉRNAGAS
// ==========================================
function spawnFireflies() {
    const fireflyContainer = document.getElementById('fireflies-container');
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < CFG.fireflies; i++) {
        let firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.cssText = `
            left: ${Math.random() * 100}%;
            bottom: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 3 + 2}s;
            animation-delay: ${Math.random() * 2}s;
        `;
        fragment.appendChild(firefly);
    }
    fireflyContainer.appendChild(fragment);
}
spawnFireflies();

// ==========================================
// 6. SINCRONIZACIÓN LETRAS (Dos idiomas)
// ==========================================
var audio = document.getElementById("miAudio");
var lyrics = document.querySelector("#lyrics");

var lyricsData = [
    { text: "I wanna be your vacuum cleaner<br><span class='es-lyric'>Quiero ser tu aspiradora</span>", time: 16 },
    { text: "Breathing in your dust<br><span class='es-lyric'>Respirando tu polvo</span>", time: 20 },
    { text: "I wanna be your Ford Cortina<br><span class='es-lyric'>Quiero ser tu Ford Cortina</span>", time: 23 },
    { text: "I will never rust<br><span class='es-lyric'>Nunca me oxidaré</span>", time: 27 },
    { text: "If you like your coffee hot<br><span class='es-lyric'>Si te gusta el café caliente</span>", time: 30 },
    { text: "Let me be your coffee pot<br><span class='es-lyric'>Déjame ser tu cafetera</span>", time: 33 },
    { text: "You call the shots, babe<br><span class='es-lyric'>Tú mandas, nena</span>", time: 37 },
    { text: "I just wanna be yours<br><span class='es-lyric'>Solo quiero ser tuyo</span>", time: 41 },
    { text: "Secrets I have held in my heart<br><span class='es-lyric'>Secretos que he guardado en mi corazón</span>", time: 48 },
    { text: "Are harder to hide than I thought<br><span class='es-lyric'>Son más difíciles de ocultar de lo que pensaba</span>", time: 51 },
    { text: "Maybe I just wanna be yours<br><span class='es-lyric'>Tal vez solo quiero ser tuyo</span>", time: 55 },
    { text: "I wanna be yours<br><span class='es-lyric'>Quiero ser tuyo</span>", time: 59 }
];

function updateLyrics() {
    if(!audio) return;
    var time        = Math.floor(audio.currentTime);
    var currentLine = lyricsData.find(line => time >= line.time && time < line.time + 4);
    if (currentLine) {
        lyrics.style.opacity = 1;
        lyrics.innerHTML     = currentLine.text;
    } else {
        lyrics.style.opacity = 0;
        lyrics.innerHTML     = "";
    }
}
setInterval(updateLyrics, isMobile ? 800 : 500);

// ==========================================
// 7. INICIO DE AUDIO Y FRASES AL HACER CLIC
// ==========================================
const pantallaInicio = document.getElementById('pantalla-inicio');
const botonIniciar = document.getElementById('boton-iniciar');

botonIniciar.addEventListener('click', () => {
    // 1. Ocultamos la pantalla de inicio
    pantallaInicio.style.opacity = '0';
    setTimeout(() => {
        pantallaInicio.style.display = 'none';
    }, 1500);

    // 2. Iniciamos las frases secuenciales justo después de entrar
    setTimeout(mostrarSiguienteFrase, 1500);

    // 3. Reproducimos la música
    if (audio) {
        audio.play().catch(error => {
            console.warn("Detalle con el audio (revisa la ruta o el Live Server):", error);
        });
    }
});