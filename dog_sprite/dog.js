const dog = document.getElementById("dog");
let isJumping = false;
/*
function startDogAnimation() {
  dog.style.display = "block";
  dog.style.left = "120px";

  setTimeout(() => {
    if (!isJumping) {
      stopWalkingAndPrepareJump();
    }
  }, 5000);
}

function stopWalkingAndPrepareJump() {
  if (isJumping) return;
  isJumping = true;

  // Stop all animations but keep the current position
  let currentLeft = window.getComputedStyle(dog).getPropertyValue("left");
  dog.style.animation = "none";
  dog.style.left = currentLeft; // Maintain the horizontal position

  // Change to first sprite of second row
  dog.style.backgroundPosition = "0px -58px";

  setTimeout(() => {
    // Change to second sprite of second row for jump
    dog.style.backgroundPosition = "-60px -58px";
    jump();
  }, 500);
}

function jump() {
  let currentLeft = dog.style.left;
  dog.style.transition = "bottom 0.3s ease-out";
  dog.style.bottom = "550px";

  setTimeout(() => {
    dog.style.transition = "bottom 0.3s ease-in";
    dog.style.bottom = "400px";
    dog.style.left = currentLeft;

    setTimeout(() => {
      dog.style.display = "none";
      isJumping = false;
    }, 300);
  }, 500);
}
  */

function dogLaugh() {
  dog.style.display = "block";

  dog.style.left = "40%";
  dog.style.bottom = "120%";

  let laughStart = Date.now();
  let frameDuration = 140;

  function animateLaugh() {
    let now = Date.now();
    let elapsed = now - laughStart;
    let frame = Math.floor(elapsed / frameDuration) % 2;

    dog.style.backgroundPosition =
      frame === 0 ? "-180px -58px" : "-240px -58px";

    laughAnimationFrame = requestAnimationFrame(animateLaugh);
  }

  animateLaugh();
}

function stopDogLaugh() {
  if (laughAnimationFrame) {
    cancelAnimationFrame(laughAnimationFrame);
  }
}

//startDogAnimation();
//dogLaugh();
//setTimeout(stopDogLaugh, 5000);
