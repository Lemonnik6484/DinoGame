const dino = document.getElementById('dino');
const game = document.body;
let scoreText = document.getElementById('score');
let isJumping = false;
let cactusPositions = [];
let score = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isJumping) {
        isJumping = true;
        dino.style.bottom = '125px';

        setTimeout(() => {
            dino.style.bottom = '22px';
            setTimeout(() => {
                isJumping = false;
            }, 200)
        }, 350) // jump time
    }
})

function updateScore() {
    score += 1;
    scoreText.innerText = `Score: ${score}`;
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
        const safeDistance = 1000;
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

spawnCactus();