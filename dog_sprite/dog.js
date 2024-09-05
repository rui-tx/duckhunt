const dog = document.getElementById("dog");
let isJumping = false;
const mediaQueries = {
  mobile: window.matchMedia("(max-width: 430px) and (max-height: 932px)"),
  ipad: window.matchMedia("(max-width: 1024px) and (max-height: 1366px)"),
};
function getDeviceType() {
  if (mediaQueries.mobile.matches) return "mobile";
  if (mediaQueries.ipad.matches) return "ipad";
  return "desktop";
}
function adjustAnimationForDevice() {
  const deviceType = getDeviceType();
  let scale, bottom, duration;
  switch (deviceType) {
    case "mobile":
      scale = 3;
      bottom = 100;
      duration = 6;
      break;
    case "ipad":
      scale = 4;
      bottom = 150;
      duration = 6;
      break;
    default:
      scale = 4;
      bottom = 200;
      duration = 6;
  }
  dog.style.scale = scale;
  dog.style.bottom = `${bottom}px`;
  return duration;
}

/**************************DOG SOUNDS***************************** */

const dogSound = new Audio("sound/dog_intro.mp3");
const dogBarkSound = new Audio("sound/dog_bark.mp3");
const catchBird = new Audio("sound/dog_catch_bird.mp3");
const laugh = new Audio("sound/dog_laugh.mp3");
const gunshot = new Audio("sound/gun.mp3");
let barkCount = 0;

function playRapidBarks() {
  if (barkCount < 3) {
    dogBarkSound.currentTime = 0;
    dogBarkSound.play();
    barkCount++;

    setTimeout(playRapidBarks, 130);
  } else {
    barkCount = 0;
  }
}

function playDogSounds() {
  dogSound.play();

  dogSound.onended = () => {
    playRapidBarks();
    dogSound.onended = null;
  };
}

/**************************DOG ANIMATION***************************** */

function startDogAnimation() {
  playDogSounds();

  const duration = adjustAnimationForDevice();
  dog.style.display = "block";
  dog.style.left = "10%";
  dog.style.bottom = "80%";
  dog.style.animation = `dogWalk 0.5s steps(1) infinite, dogMove ${duration}s linear forwards`;
  setTimeout(() => {
    if (!isJumping) {
      stopWalkingAndPrepareJump();
    }
  }, duration * 1000);
}

/**************************DOG WALK AND STOP TO JUMP***************************** */

function stopWalkingAndPrepareJump() {
  if (isJumping) return;
  isJumping = true;
  let currentLeft = window.getComputedStyle(dog).getPropertyValue("left");
  dog.style.animation = "none";
  dog.style.left = currentLeft;
  dog.style.backgroundPosition = "0px -58px";
  setTimeout(() => {
    dog.style.backgroundPosition = "-60px -58px";
    jump();
  }, 500);
}
function jump() {
  const deviceType = getDeviceType();
  let jumpHeight, initialBottom;
  switch (deviceType) {
    case "mobile":
      jumpHeight = 400;
      initialBottom = 280;
      break;
    case "ipad":
      jumpHeight = 550;
      initialBottom = 390;
      break;
    default:
      jumpHeight = 550;
      initialBottom = 380;
  }
  let currentLeft = dog.style.left;
  dog.style.transition = "bottom 0.3s ease-out";
  dog.style.bottom = `${jumpHeight}px`;
  setTimeout(() => {
    dog.style.transition = "bottom 0.3s ease-in";
    dog.style.bottom = `${initialBottom}px`;
    dog.style.left = currentLeft;
    setTimeout(() => {
      dog.style.display = "none";
      isJumping = false;
    }, 300);
  }, 500);
}

/**************************DOG LAUGH***************************** */

function dogLaugh() {
  setTimeout(() => {
    laugh.play();
  }, 800);

  dog.style.backgroundPosition = "-240px -58px";

  const deviceType = getDeviceType();
  let initialBottom, laughJumpHeight, finalJumpHeight;

  switch (deviceType) {
    case "mobile":
      initialBottom = 280;
      laughJumpHeight = 100;
      finalJumpHeight = 40;
      break;
    case "ipad":
      initialBottom = 290;
      laughJumpHeight = 120;
      finalJumpHeight = 60;
      break;
    default:
      initialBottom = 298;
      laughJumpHeight = 100;
      finalJumpHeight = 60;
  }

  adjustAnimationForDevice();
  let isLaughing = false;
  dog.style.display = "block";
  dog.style.left = "40%";
  dog.style.zIndex = "100";
  dog.style.bottom = `${initialBottom}px`;

  function toggleLaughSprite() {
    if (isLaughing) {
      dog.style.backgroundPosition = "-240px -58px";
    } else {
      dog.style.backgroundPosition = "-180px -58px";
    }
    isLaughing = !isLaughing;
  }

  const laughInterval = setInterval(toggleLaughSprite, 100);

  setTimeout(() => {
    dog.style.transition = "bottom 0.8s ease-out";
    dog.style.bottom = `${initialBottom + laughJumpHeight}px`;
  }, 10);

  setTimeout(() => {
    dog.style.transition = "bottom 0.5s ease-in";
    dog.style.bottom = `${initialBottom + laughJumpHeight - finalJumpHeight}px`;
  }, 1500);

  setTimeout(() => {
    clearInterval(laughInterval);
    dog.style.display = "none";
  }, 2000);
}

/**************************CATCH ONE BIRD***************************** */

function dogCatchBird() {
  setTimeout(() => {
    catchBird.play();
  }, 800);

  const deviceType = getDeviceType();
  let jumpHeight, initialBottom;

  switch (deviceType) {
    case "mobile":
      jumpHeight = 100;
      initialBottom = 280;
      break;
    case "ipad":
      jumpHeight = 100;
      initialBottom = 310;
      break;
    default:
      jumpHeight = 100;
      initialBottom = 300;
  }

  adjustAnimationForDevice();
  dog.style.display = "block";
  dog.style.backgroundPosition = "-319px 0px";
  dog.style.left = "50%";
  dog.style.zIndex = "-100";
  dog.style.bottom = `${initialBottom}px`;
  dog.offsetHeight;

  setTimeout(() => {
    dog.style.bottom = `${initialBottom + jumpHeight}px`;
    dog.style.transition = "bottom 1s ease 0.5s";
  }, 0);

  setTimeout(() => {
    dog.style.backgroundPosition = "-319px 0px";
  }, 1000);

  setTimeout(() => {
    dog.style.bottom = `${initialBottom}px`;
  }, 1000);

  setTimeout(() => {
    dog.style.display = "none";
  }, 2000);
}
