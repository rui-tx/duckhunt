const duck = document.getElementById('duck');
const container = document.getElementsByClassName('container-sky')[0];

const frameRight = [
    {position: "-130px -121px", width : 34 , height: 24 },
    {position: "-170px -123px", width : 34 , height: 20 },
    {position: "-211px -119px", width : 32 , height: 28 }
];

const frameDiagonalRight = [
    {position: "-134px -157px", width : 25 , height: 31 },
    {position: "-171px -158px", width : 32 , height: 29 },
    {position: "-213px -157px", width : 27 , height: 31 }
];

const frameUp = [
    {position: "-135px -197px", width : 24 , height: 31 },
    {position: "-171px -197px", width : 32 , height: 31 },
    {position: "-212px -198px", width : 30 , height: 30 }
];

const frameDead = [
    {position: "-178px -237px", width : 18 , height: 30 }
]

const frameShot = [
    {position: "-131px -238px", width : 31, height: 29}
]

let xVelocity = 500;
let yVelocity = 500;
let intervalMovement;
let timeEnded = false;
let leaveScreen = false;
let initialYPosition;
let initialXPosition;
let isFirstDuck = true;
let currentFrame = frameRight;
let currentFrameIndex = 0;
let isFlipped = false;
let animationInterval = 200;
let baseVelocity = 2;
let isFalling = false;
let animationId;

function updateCurrentFrame() {
    const angle = calculateAngle(xVelocity, yVelocity);
    //check direction angle to apply animation
    if (Math.abs(angle) <= 45) {
        currentFrame = frameRight;
    } else if (angle > 45 && angle <= 135) {
        currentFrame = frameDiagonalRight;
    } else if (angle >= -135 && angle < -45) {
        currentFrame = frameDiagonalRight;
    } else {
        currentFrame = frameRight;
    }
    resetFrame();
}

function calculateAngle(xVelocity, yVelocity) {
    return Math.atan2(yVelocity, xVelocity) * (180 / Math.PI);
}

function resetFrame() {
    currentFrameIndex = 0;

    duck.style.backgroundPosition = currentFrame[0].position;
    duck.style.width = currentFrame[0].width + "px";
    duck.style.height = currentFrame[0].height + "px";
}

function animate(frame, interval) {
    let lastUpdate = 0;

    function updateFrame(timestamp) {
        if (timestamp - lastUpdate >= interval) {
            duck.style.backgroundPosition = frame[currentFrameIndex].position;
            duck.style.width = frame[currentFrameIndex].width + "px";
            duck.style.height = frame[currentFrameIndex].height + "px";
            currentFrameIndex = (currentFrameIndex + 1) % frame.length;
            lastUpdate = timestamp;
        }
        if (duck.style.display !== 'none') {
            animationId = requestAnimationFrame(updateFrame);
        }

    }
    animationId = requestAnimationFrame(updateFrame);
}

//move duck randomly
function moveDuck() {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const duckWidth = duck.clientWidth;
    const duckHeight = duck.clientHeight;

    //actual duck position
    let xPos = parseFloat(duck.style.left) || 0;
    let yPos = parseFloat(duck.style.top) || 0;


    //if time ends the duck leave by the top screen
    // if (timeEnded) {
    //     cancelAnimationFrame(animationId);
    //     currentFrame = frameUp;
    //     yVelocity = -Math.abs(yVelocity);
    //     xVelocity = 0;
    //     leaveScreen = true;
    //     animate(currentFrame, animationInterval);
    // }

    //get the position by the velocity
    xPos += xVelocity;
    yPos += yVelocity;

    if (xVelocity < 0 && !isFlipped) {
        isFlipped = true;
        flipDuck(isFlipped);
        updateCurrentFrame();
    } else if (xVelocity > 0 && isFlipped) {
        isFlipped = false;
        flipDuck(isFlipped);
        updateCurrentFrame();
    }

    //check if the duck colide with the borders
    if (xPos + duckWidth > containerWidth || xPos < 0) {
        xVelocity = -xVelocity;
    }

    if (yPos < 0) {
        if (leaveScreen) {
            duck.style.visibility = "hidden";
        }
        if (!timeEnded) {
            yPos = 0;
            yVelocity = -yVelocity;
        } else {
            yPos = -duckHeight;
            
            if(leaveScreen) {
                duck.style.visibility = "hidden";
                // clearInterval(intervalMovement);
                // duck.style.display = 'none';
                // currentFrame = frameRight;
                // setTimeout(newDuck, 500);
                return;
            }
        }
        
    } else if (yPos + duckHeight > containerHeight) {
        yVelocity = -yVelocity;
    }
       

    //get duck new position
    duck.style.left = `${xPos}px`;
    duck.style.top = `${yPos}px`;
}

function flipDuck(flip) {
    const flipScale = flip ? 'scaleX(-1)' : 'scaleX(1)';
    duck.style.transition = 'transform 0.05s';
    duck.style.transform = `${flipScale} scale(3)`;
}

function resetDuckPosition() {
    cancelAnimationFrame(animationId);
    clearInterval(intervalMovement);
    isFalling = false;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const duckWidth = duck.clientWidth;
    const duckHeight = duck.clientHeight;

    initialYPosition = containerHeight - duckHeight - 2;
    initialXPosition = (containerWidth - duckWidth) * Math.random();

    duck.style.left = `${initialXPosition}px`;
    duck.style.top = `${initialYPosition}px`;

    xVelocity = (Math.random() > 0.5 ? 1 : -1) * baseVelocity;
    yVelocity = -baseVelocity;

    resetFrame();

    leaveScreen = false;
    timeEnded = false;
    intervalMovement = null;
}

//make the duck move
function startMovement() {
    if (!intervalMovement){
        
        intervalMovement = setInterval(moveDuck, 20);
        animate(currentFrame, animationInterval);
     
        // setTimeout(() => {
        //     timeEnded = true;
        // }, 10000);   
    }
}

function duckLeaves() {

    cancelAnimationFrame(animationId);
    currentFrame = frameUp;
    yVelocity = -Math.abs(yVelocity);
    xVelocity = 0;
    leaveScreen = true;
    animate(currentFrame, animationInterval);

}

function setDuckScale(scale) {
    duck.style.transform = `scale(${scale})`;
}

//get a new duck
function newDuck() {
    resetDuckPosition();
    duck.style.visibility = "visible";
    //duck.style.display = 'block';
    setDuckScale(3); // Define a escala 3
    currentFrame = frameRight;
    //animate(currentFrame, animationInterval);
    startMovement();
    startDuckFlapSound();
}

function stopDuckMovement() {
    timeEnded = true;
    clearInterval(intervalMovement);
    //clearInterval(moveDuck);
    //resetFrame();
}

function initializeGame() {
    console.log("initializeGame");
    resetDuckPosition();
    duck.style.display = 'block';
    
    if (isFirstDuck) {
            animate(currentFrame, animationInterval);
            startMovement();
            isFirstDuck = false;
    } else {
        newDuck();
    }
}

//get duck starting position when reload page
//initializeGame();

function animateHit() {
    duck.style.backgroundPosition = frameShot[0].position;
    duck.style.width = frameShot[0].width + "px";
    duck.style.height = frameShot[0].height + "px";
    duck.style.transform = `scale(3)`; // Define a escala 3

    xVelocity = 0;
    yVelocity = 0;

    cancelAnimationFrame(animationId);
    //let y = yVelocity;

    //stopDuckMovement();
    //animateFall();
    duck.style.backgroundPosition = frameShot[0].position;
    setTimeout(() => {
        duck.style.backgroundPosition = frameDead[0].position; // Inicia a animação de queda após a animação de acerto
        yVelocity = 5;

        setTimeout(() => {
            duck.style.backgroundPosition = frameDead[0].position;
            duck.style.visibility = "hidden";
        } , 750);

        
    }, 500); // Duração da animação de acerto

    
    
    //leaveScreen = true;
    //yVelocity = y;

    
    
    
}

function animateFall() {
    // Altera o frame para a animação de queda
    //currentFrame = frameDead;
    // animate(currentFrame, animationInterval);

    // // Inicia o movimento para baixo
    // yVelocity = 3; // Ajuste a velocidade conforme necessário
    // xVelocity = 0;
    // leaveScreen = true;
    // setDuckScale(3); // Define a escala 3
    // stopDuckMovement();
}

let audioContext;
let duckFlapSource;
function startDuckFlapSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  fetch("sound/duck_flap.mp3")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      duckFlapSource = audioContext.createBufferSource();
      duckFlapSource.buffer = audioBuffer;
      duckFlapSource.loop = true;
      duckFlapSource.playbackRate.value = 0.9;
      duckFlapSource.connect(audioContext.destination);
      duckFlapSource.start();
    })
    .catch((e) => console.error("Error with duck flap sound:", e));
}
function stopDuckFlapSound() {
  if (duckFlapSource) {
    duckFlapSource.stop();
    duckFlapSource = null;
  }
}