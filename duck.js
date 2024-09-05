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
    {position: "-131px -238px", width : 31, height: 29 }
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

function updateCurrentFrame() {
    const angle = calculateAngle(xVelocity, yVelocity);
    //check direction angle to apply animation
    if (Math.abs(angle) <= 45) {
        currentFrame = frameUp;
    } else if (angle > 45 && angle <= 135) {
        currentFrame = frameDiagonalRight;
    } else if (angle >= -135 && angle < -45) {
        currentFrame = frameDiagonalRight;
    } else {
        currentFrame = frameUp;
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
            requestAnimationFrame(updateFrame);
        }
    }
    requestAnimationFrame(updateFrame);
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
    if (timeEnded && !leaveScreen) {
        currentFrame = frameUp;
        yVelocity = -Math.abs(yVelocity);
        xVelocity = 0;
        leaveScreen = true;
        animate(currentFrame, animationInterval);
    }

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
        if (!timeEnded) {
            yPos = 0;
            yVelocity = -yVelocity;
        } else {
            yPos = -duckHeight;
            
            if(leaveScreen) {
                clearInterval(intervalMovement);
                duck.style.display = 'none';
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

function startDuckFallAnimation() {
    let fallVelocity = 5;
    const containerHeight = container.clientHeight;
    const duckHeight = duck.clientHeight;

    const fallInterval = setInterval(() => {
        let currentY = parseFloat(duck.style.top) || 0;
        
        if (currentY < containerHeight) {
            currentY += fallVelocity;
            duck.style.top = `${currentY}px`;

            if (duck.style.transform === 'scaleX(1)') {
                duck.style.transform = 'scaleX(-1) scale(3)';
            } else {
                clearInterval(fallInterval);
                duck.style.display = 'none';
            }
        }
    }, 50);
}

function flipDuck(flip) {
    const flipScale = flip ? 'scaleX(-1)' : 'scaleX(1)';
    duck.style.transition = 'transform 0.05s';
    duck.style.transform = `${flipScale} scale(3)`;
}

function resetDuckPosition() {
    clearInterval(intervalMovement);

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const duckWidth = duck.clientWidth;
    const duckHeight = duck.clientHeight;

    initialYPosition = containerHeight - duckHeight;
    initialXPosition = (containerWidth - duckWidth) / 2;

    duck.style.left = `${initialXPosition}px`;
    duck.style.top = `${initialYPosition}px`;

    xVelocity = (Math.random() > 0.5 ? 1 : -1) * 2;
    yVelocity = -2;

    resetFrame();

    leaveScreen = false;
    timeEnded = false;
    intervalMovement = null;
}

//make the duck move
function startMovement() {
    if (!intervalMovement){
        intervalMovement = setInterval(moveDuck, 20);
     
        setTimeout(() => {
            timeEnded = true;
        }, 10000);   
    }
}

function createDuck() {
    resetDuckPosition();
    duck.style.display = 'block';
    animate(currentFrame, animationInterval);
    startMovement()
}

function initializeGame() {
    console.log("initializeGame");
    createDuck();
}
