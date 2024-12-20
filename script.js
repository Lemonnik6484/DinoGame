const dino = document.getElementById('dino');
const game = document.body;
let scoreText = document.getElementById('score');
let root = document.querySelector(':root');
const gravity = 0.75;
const jumpForce = 15;
const groundLevel = 13;
let dinoY = 13;
let isJumping = false;
let velocity = 0;
let cactusPositions = [];
let score = 0;
let speed = 3.5;

function update() {
    velocity -= gravity;
    dinoY += velocity

    if (dinoY <= groundLevel) {
        dinoY = groundLevel;
        velocity = 0;
        isJumping = false;
    }

    dino.style.bottom = `${dinoY}px`;

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping) {
        isJumping = true;
        velocity = jumpForce;
    } else if (e.code === 'ArrowDown' && !isJumping) {
        dino.classList.add('crouch');
    } else if (e.code === 'ArrowDown' && isJumping) {
        dino.classList.add('crouch');
        velocity = jumpForce * -1;
    }
})

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        dino.classList.remove('crouch');
    } else if (e.code === 'ArrowDown') {
        dino.classList.remove('crouch');
    }
})

function updateScore() {
    score += 1;
    scoreText.innerText = `Score: ${score}`;

    speed -= 0.000001;
    root.style.setProperty('--speed', `${speed}s`);
}

setInterval(updateScore, 100);

function spawnCactus() {
    const cactus = document.createElement('div');
    cactus.classList.add('cactus');
    cactus.style.right = '0px';
    game.appendChild(cactus);

    cactusPositions.push(cactus);

    const cactusInterval = setInterval(() => {
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();

        if (dinoRect.right > cactusRect.left && dinoRect.left < cactusRect.right && dinoRect.bottom > cactusRect.top) {
            dino.classList.add('dead');
            clearInterval(cactusInterval);
            alert("Game over!");
            location.reload();
        }

        if (cactusRect.right <= 0) {
            cactus.remove();
            clearInterval(cactusInterval);
            cactusPositions.splice(cactusPositions.indexOf(cactus), 1);
        }
    }, 50);

    const spawnNewCactus = () => {
        const safeDistance = 750;
        const canSpawn = cactusPositions.every(existingCactus => {
            const existingRect = existingCactus.getBoundingClientRect();
            return existingRect.right < window.innerWidth - safeDistance || existingRect.left > safeDistance;
        });

        if (canSpawn) {
            setTimeout(spawnCactus, Math.random() * 2000 + 1000);
        } else {
            setTimeout(spawnNewCactus, 100);
        }
    };

    spawnNewCactus();
}

function spawnCloud() {
    const cloud = document.createElement('div');
    const size = Math.random() * 50 + 50;
    const speed = (150 - size) / 20;

    cloud.classList.add('cloud');
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size/3}px`;
    cloud.style.top = `${Math.random() * 75}vh`
    cloud.style.animationDuration = `${speed}s`
    cloud.style.backgroundSize = `${size}px ${size/3}px`;
    cloud.style.zIndex = `${size}`;

    game.appendChild(cloud);

    setTimeout(() => {
        cloud.remove();
    }, speed * 1000);

    setTimeout(spawnCloud, Math.random() * 2000 + 500);
}

function spawnPter () {
    const pter = document.createElement('div');

    pter.classList.add('pterodactyl');
    pter.style.right = "0px";

    game.appendChild(pter);

    const pterInterval = setInterval(() => {
        const dinoRect = dino.getBoundingClientRect();
        const pterRect = pter.getBoundingClientRect();

        if (dinoRect.right > pterRect.left && dinoRect.left < pterRect.right && (dinoRect.top > pterRect.bottom && dinoRect.bottom < pterRect.bottom && dinoRect.bottom < pterRect.top)) {
            dino.classList.add('dead');
            clearInterval(pterInterval);
            alert("Game over!");
            location.reload();
        }

        if (pterRect.right <= 0) {
            pter.remove();
            clearInterval(pterInterval);
            setTimeout(() => {
                spawnPter()
            }, Math.random() * 15000 + 1500);
        }
    }, 50);
}

spawnCloud();
spawnCactus();
setTimeout(() => {
    spawnPter();
}, Math.random() * 25000 + 10000);
update();
isJumping = true;
velocity = jumpForce;