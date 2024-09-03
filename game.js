const GAME_NUMBER_OF_DUCKS = 10;
const GAME_MAX_MISSED_DUCKS = 5;
const GAME_TIME_IN_MS = 30000;
const GAME_ROUND_NUMBER_OF_SHOOTS = 3;
const DUCK_ELEMENT_NAME = "duck";

const GAME_VARS = {
  gameState: "idle",
  round: 1,
  currentStep: 0,
  shotsRemaining: GAME_ROUND_NUMBER_OF_SHOOTS,
  ducksRemaining: GAME_NUMBER_OF_DUCKS,
  totalDucksShotted: 0,
  lastShotTime: 0,
  timeRemaining: GAME_TIME_IN_MS,
  score: 0,
};

const shoot = function (duckHitted) {
  if (GAME_VARS.shotsRemaining <= 1) {
    console.log("No shots remaining!");
    GAME_VARS.gameState = "idle";
    updateGameText();
    startGame();
    return;
  }

  GAME_VARS.shotsRemaining--;

  if (!duckHitted) {
    console.log("Player missed the shot...");
    updateGameText();
    return;
  }

  console.log("Duck hit!");
  GAME_VARS.score++;
  GAME_VARS.ducksRemaining--;
  GAME_VARS.totalDucksShotted++;
  GAME_VARS.gameState = "idle";
  updateGameText();
  startGame();
};

const updateGameText = function () {
  document.getElementById("shotsRemaining").innerHTML =
    GAME_VARS.shotsRemaining;
  document.getElementById("ducksRemaining").innerHTML =
    GAME_VARS.ducksRemaining;
  document.getElementById("score").innerHTML = GAME_VARS.score;
  document.getElementById("gameState").innerHTML = GAME_VARS.gameState;
  document.getElementById("lastShotTime").innerHTML = GAME_VARS.lastShotTime;
};

document.onclick = function (event) {
  if (GAME_VARS.gameState !== "round") {
    console.warn("Game is not in 'round' state, ignoring click");
    return;
  }

  event.target.id === DUCK_ELEMENT_NAME ? shoot(true) : shoot(false);
};

const startGame = async function () {
  if (GAME_VARS.currentStep === GAME_NUMBER_OF_DUCKS) {
    GAME_VARS.gameState = "idle";
    // check if player goes to next round
    // if the sum of all non shotted ducks is equal or greater than 5 then the game is over
    const numberOfTotalMissedDucks =
      GAME_NUMBER_OF_DUCKS * GAME_VARS.round - GAME_VARS.totalDucksShotted;
    if (numberOfTotalMissedDucks >= GAME_MAX_MISSED_DUCKS) {
      console.log(
        `Game over! Reason: Player missed ${GAME_MAX_MISSED_DUCKS} or more ducks`
      );
      GAME_VARS.gameState = "end";
      updateGameText();
      return;
    }

    document.getElementById("intro-text").innerHTML = "NEW ROUND!";
    GAME_VARS.round += 1;
    GAME_VARS.currentStep = 0;
    GAME_VARS.ducksRemaining = GAME_NUMBER_OF_DUCKS;
    updateGameText();
    await sleep(3000);
  }

  document.getElementById("intro-text").innerHTML =
    "Game wil start in 3 seconds...";
  await sleep(3000);
  await startRound();
};

const startRound = async function () {
  GAME_VARS.currentStep += 1;
  document.getElementById("intro-text").innerHTML = "";
  GAME_VARS.shotsRemaining = GAME_ROUND_NUMBER_OF_SHOOTS;
  GAME_VARS.gameState = "round";

  document.getElementById("round").innerHTML = GAME_VARS.round;
  document.getElementById("roundStep").innerHTML = GAME_VARS.currentStep;
  document.getElementById("shotsRemaining").innerHTML =
    GAME_VARS.shotsRemaining;
  document.getElementById("score").innerHTML = GAME_VARS.score;
  document.getElementById("gameState").innerHTML = GAME_VARS.gameState;

  const startTime = Date.now();

  while (true) {
    const currentTime = Date.now();
    const timeElapsedInMs = Math.floor(currentTime - startTime);

    if (GAME_VARS.gameState !== "round") {
      GAME_VARS.timeRemaining -= timeElapsedInMs;
      GAME_VARS.lastShotTime = timeElapsedInMs;
      updateScore();
      updateGameText();
      return;
    }

    if (GAME_VARS.timeRemaining - timeElapsedInMs <= 0) {
      console.log("Game over! Reason: Timer ran out");
      GAME_VARS.gameState = "end";
      updateGameText();
      return;
    }

    document.getElementById("timeLeft").innerText = `${Math.floor(
      (GAME_VARS.timeRemaining - timeElapsedInMs) / 1000
    )}`;

    await sleep(100);
  }
};

const updateScore = function () {
  // round serves as multiplier
  GAME_VARS.score +=
    GAME_VARS.round * GAME_VARS.shotsRemaining +
    (GAME_TIME_IN_MS - GAME_VARS.lastShotTime);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
