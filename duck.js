const duck = document.getElementById('duck');
const container = document.getElementById('container');

const frameRight = [
    {position: "-130px -121px", width : 34 , height: 24 },
    {position: "-170px -123px", width : 34 , height: 20 },
    {position: "-211px -119px", width : 32 , height: 28 }
];

const frameDiagonalUpRight = [
    {position: "-134px -157px", width : 25 , height: 31 },
    {position: "-171px -158px", width : 32 , height: 29 },
    {position: "-213px -157px", width : 27 , height: 31 }
];

function rotateDuck(angle, flip = false) {
    const flipScale = flip ? 'scaleX(-1)' : '';
    duck.style.transform = `rotate(${angle}deg) ${flipScale} scale(2)`;
}

const frameUp = [
    {position: "-135px -197px", width : 24 , height: 31 },
    {position: "-171px -197px", width : 32 , height: 31 },
    {position: "-212px -198px", width : 30 , height: 30 }
];

const frameDead = [
    {position: "-178px -237px", width : 18 , height: 30 }
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

function animate(frame, interval) {
    function updateFrame() {
        duck.style.backgroundPosition = frame[currentFrameIndex].position;
        duck.style.width = frame[currentFrameIndex].width + "px";
        duck.style.height = frame[currentFrameIndex].height + "px";

        currentFrameIndex = (currentFrameIndex + 1) % frame.length;
    }

    updateFrame();
    setInterval(updateFrame, interval);
}

//move duck randomly
function moveDuck() {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const duckWidth = duck.clientWidth;
    const duckHeight = duck.clientHeight;

    //actual duck position
    let xPos = parseFloat(duck.style.left);
    let yPos = parseFloat(duck.style.top);

    //get the position by the velocity
    xPos += xVelocity;
    yPos += yVelocity;

    if (!leaveScreen) {
        //check if the duck colide with the borders
        if (xPos + duckWidth > containerWidth || xPos < 0) {
            xVelocity = -xVelocity;
        }
        if (yPos < 0 || yPos + duckHeight > containerHeight) {
            yVelocity = -yVelocity;
        }

        //check direction to apply animation
        if (xVelocity > 0 && yVelocity > 0) {
            currentFrame = frameDiagonalUpRight;
        } else if (xVelocity < 0 && yVelocity > 0) {
            currentFrame = frameDiagonalUpRight;
            rotateDuck(0, true);
        } else if (xVelocity > 0 && yVelocity < 0) {
            currentFrame = frameDiagonalUpRight;
        } else if (xVelocity < 0 && yVelocity < 0) {
            currentFrame = frameDiagonalUpRight;
            rotateDuck(0, true);
        } else if (xVelocity > 0) {
            currentFrame = frameRight;
        } else if (xVelocity < 0) {
            currentFrame = frameRight;
            rotateDuck(0, true);
        }
    } else {
        currentFrame = frameUp;
        yVelocity = -5;

        if (yPos + duckHeight < 0) {
            clearInterval(intervalMovement);
            duck.style.display = 'none';
            setTimeout(newDuck, 500);
            return;
        }
    }
    
    //get duck new position
    duck.style.left = `${xPos}px`;
    duck.style.top = `${yPos}px`;

    animate(currentFrame, 200);

    if (timeEnded && !leaveScreen) {
        leaveScreen = true;
    }
}

function resetDuckPosition() {
    clearInterval(intervalMovement);

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const duckWidth = duck.clientWidth;
    const duckHeight = duck.clientHeight;

    initialYPosition = (containerHeight - duckHeight) / 2;
    initialXPosition = (containerWidth - duckWidth) / 2;

    duck.style.left = `${initialXPosition}px`;
    duck.style.top = `${initialYPosition}px`;

    xVelocity = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1);
    yVelocity = -Math.abs(Math.random() * 2 + 1);

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
        }, 5000);   
    }
}

//get a new duck
function newDuck() {
    resetDuckPosition();
    duck.style.display = 'block';
    startMovement();
}

function initializeGame() {
    resetDuckPosition();
    duck.style.display = 'block';
    
    if (isFirstDuck) {
        duck.addEventListener('click', function onFirstClick() {
            animate(currentFrame, 200);
            startMovement();
            duck.removeEventListener('click', onFirstClick);
            isFirstDuck = false;
        });
    } else {
        newDuck();
    }
}

//get duck starting position when reload page
window.onload = initializeGame;