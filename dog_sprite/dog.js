const dog = document.getElementById("dog");
let isJumping = false;

/**************************DOG ANIMATION***************************** */

function startDogAnimation() {
  dog.style.display = "block";
  dog.style.left = "120px";
  dog.style.animation =
    "dogWalk 0.8s steps(1) infinite, dogMove 5s linear forwards";

  setTimeout(() => {
    if (!isJumping) {
      stopWalkingAndPrepareJump();
    }
  }, 5000);
}

/**************************DOG WALK AND STOP TO JUMP***************************** */

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

/**************************DOG LAUGH***************************** */

function dogLaugh() {
  const dog = document.getElementById("dog");
  let isLaughing = false;

  // Set initial position
  dog.style.display = "block";
  dog.style.left = "40%";
  dog.style.bottom = "290px";
  dog.style.zIndex = "100";

  // Function to change laugh sprite
  function toggleLaughSprite() {
    if (isLaughing) {
      dog.style.backgroundPosition = "-240px -58px";
    } else {
      dog.style.backgroundPosition = "-180px -58px";
    }
    isLaughing = !isLaughing;
  }

  // Start laughing animation
  const laughInterval = setInterval(toggleLaughSprite, 240);

  // Move dog up
  setTimeout(() => {
    dog.style.transition = "bottom 2s ease-out";
    dog.style.bottom = "400px";
  }, 10);

  // Move dog down
  setTimeout(() => {
    dog.style.transition = "bottom 2s ease-in";
    dog.style.bottom = "260px";
  }, 4000);

  // Stop animation and hide dog
  setTimeout(() => {
    clearInterval(laughInterval);
    dog.style.display = "none";
  }, 5500);
}

/**************************CATCH ONE BIRD***************************** */

function dogCatchBird() {
  dog.style.display = "block";
  // Initial sprite
  dog.style.backgroundPosition = "-319px 0px";
  dog.style.left = "800px";
  dog.style.bottom = "300px";
  dog.style.zIndex = "-100";
  dog.offsetHeight;
  // Start rising animation
  setTimeout(() => {
    dog.style.bottom = "400px";
    dog.style.transition = "bottom 1s ease 0.5s";
  }, 1000);
  // Hold at the top
  setTimeout(() => {
    dog.style.backgroundPosition = "-319px 0px";
  }, 1000);
  // Start descending slowly
  setTimeout(() => {
    dog.style.bottom = "300px";
  }, 3000); // Time to stay on top
  //Reset position
  setTimeout(() => {
    dog.style.display = "none";
  }, 4000);
}

//dogCatchBird();
//startDogAnimation();
dogLaugh();
