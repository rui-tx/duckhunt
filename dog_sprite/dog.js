const dog = document.getElementById("dog");
let isJumping = false;

function startDogAnimation() {
  dog.style.display = "block";

  dog.addEventListener("animationend", (event) => {
    if (event.animationName === "dogMove" && !isJumping) {
      stopWalkingAndPrepareJump();
    }
  });
}

function stopWalkingAndPrepareJump() {
  isJumping = true;
  // Stop all animations but keep the current position
  let currentLeft = window.getComputedStyle(dog).left;
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
    }, 300);
  }, 500);
}

startDogAnimation();
