const GAME_NUMBER_OF_DUCKS = 10;
const GAME_MAX_MISSED_DUCKS = [4, 3, 2, 1, 0]; // 5 levels of missed ducks
const GAME_TIME_IN_MS = 1200000;
const GAME_ROUND_MAX_TIME_DUCK_STAYS_IN_MS = 5000;
const GAME_ROUND_NUMBER_OF_SHOOTS = 3;
const DUCK_ELEMENT_NAME = "duck";

const GAME_VARS = {
  gameState: "idle", // idle, round, duck_flew_away, end
  round: 1,
  currentStep: 0,
  shotsRemaining: GAME_ROUND_NUMBER_OF_SHOOTS,
  ducksRemaining: GAME_NUMBER_OF_DUCKS,
  ducksShotOnRound: 0,
  totalDucksShotted: 0,
  lastShotTime: 0,
  timeRemaining: GAME_TIME_IN_MS,
  score: 0,
};

const getMaxMissedDucks = function () {
  if (GAME_VARS.round === 20) return GAME_MAX_MISSED_DUCKS[4];
  else if (GAME_VARS.round >= 15 && GAME_VARS.round <= 19)
    return GAME_MAX_MISSED_DUCKS[3];
  else if (GAME_VARS.round >= 13 && GAME_VARS.round <= 14)
    return GAME_MAX_MISSED_DUCKS[2];
  else if (GAME_VARS.round >= 11 && GAME_VARS.round <= 12)
    return GAME_MAX_MISSED_DUCKS[1];
  else return GAME_MAX_MISSED_DUCKS[0];
};

const shoot = function (duckHitted) {
  if (GAME_VARS.shotsRemaining <= 1) {
    console.log("No shots remaining!");
    //GAME_VARS.gameState = "idle";
    //updateGameText();
    //startGame();
    return;
  }

  GAME_VARS.shotsRemaining--;

  if (!duckHitted) {
    console.log("Player missed the shot...");
    updateGameText();
    return;
  }

  console.log("Duck hit!");
  GAME_VARS.gameState = "idle";
  GAME_VARS.score++;
  GAME_VARS.ducksRemaining--;
  GAME_VARS.ducksShotOnRound++;
  GAME_VARS.totalDucksShotted++;
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
    const maxMissedDucks = getMaxMissedDucks();

    // check if player goes to next round
    const numberOfTotalMissedDucks =
      GAME_NUMBER_OF_DUCKS - GAME_VARS.ducksShotOnRound;
    if (numberOfTotalMissedDucks >= maxMissedDucks) {
      console.log(
        `Game over! Reason: Player missed ${maxMissedDucks} or more ducks: ${numberOfTotalMissedDucks}`
      );
      GAME_VARS.gameState = "end";
      updateGameText();

      const waitTime = 3000;
      document.getElementById(
        "intro-text"
      ).innerHTML = `Dog animation laughing for ${waitTime} miliseconds...`;
      return;
    }

    document.getElementById("intro-text").innerHTML = "NEW ROUND!";
    GAME_VARS.round += 1;
    GAME_VARS.currentStep = 0;
    GAME_VARS.ducksShotOnRound = 0;
    GAME_VARS.ducksRemaining = GAME_NUMBER_OF_DUCKS;
    updateGameText();
    await sleep(3000);
  }

  // only shows dog walk and jump animation when is the first step round
  if (GAME_VARS.currentStep === 0) {
    const waitTime = 3000;
    document.getElementById(
      "intro-text"
    ).innerHTML = `Initial animation for ${waitTime} miliseconds...`;
    await sleep(3000);
    await startRound();

    if (GAME_VARS.gameState === "duck_flew_away") {
      document.getElementById(
        "intro-text"
      ).innerHTML = `Dog animation laughing when duck flies away for ${waitTime} miliseconds...`;
      await sleep(waitTime);

      await startGame();
    }
    return;
  }

  // wait for round to end
  await startRound();
  // if duck flew away then start game again
  if (GAME_VARS.gameState === "duck_flew_away") {
    const waitTime = 3000;
    document.getElementById(
      "intro-text"
    ).innerHTML = `Dog animation laughing when duck flies away for ${waitTime} miliseconds...`;
    await sleep(waitTime);

    await startGame();
  }
};

const startRound = async function () {
  // only shows dog showing the shot ducks when is not the first step round and game is idle
  if (GAME_VARS.currentStep > 0 && GAME_VARS.gameState === "idle") {
    const waitTime = 2000;
    document.getElementById(
      "intro-text"
    ).innerHTML = `Dog animation when showing ducks shot for ${waitTime} miliseconds...`;
    await sleep(waitTime);
  }

  GAME_VARS.currentStep += 1;
  document.getElementById("intro-text").innerHTML = "Round is on";

  GAME_VARS.shotsRemaining = GAME_ROUND_NUMBER_OF_SHOOTS;
  GAME_VARS.gameState = "round";

  document.getElementById("round").innerHTML = GAME_VARS.round;
  document.getElementById("roundStep").innerHTML = GAME_VARS.currentStep;
  document.getElementById("shotsRemaining").innerHTML =
    GAME_VARS.shotsRemaining;
  document.getElementById("score").innerHTML = GAME_VARS.score;
  document.getElementById("gameState").innerHTML = GAME_VARS.gameState;
  document.getElementById("maxMissedDucks").innerHTML = getMaxMissedDucks();

  const startTime = Date.now();

  while (true) {
    const currentTime = Date.now();
    const timeElapsedInMs = Math.floor(currentTime - startTime);

    if (GAME_VARS.gameState !== "round") {
      GAME_VARS.timeRemaining -= timeElapsedInMs;
      GAME_VARS.lastShotTime = timeElapsedInMs;
      updateScore();
      updateGameText();
      break;
    }

    if (timeElapsedInMs >= GAME_ROUND_MAX_TIME_DUCK_STAYS_IN_MS) {
      GAME_VARS.gameState = "duck_flew_away";

      const waitTime = 3000;
      document.getElementById(
        "intro-text"
      ).innerHTML = `Duck animation when flying away for ${waitTime} miliseconds...`;
      await sleep(waitTime);

      updateScore();
      updateGameText();
      break;
    }

    if (GAME_VARS.timeRemaining - timeElapsedInMs <= 0) {
      console.log("Game over! Reason: Timer ran out");
      GAME_VARS.gameState = "end";
      updateGameText();
      break;
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
    GAME_VARS.round * GAME_VARS.shotsRemaining + lastShotTimeInSeconds();
};

const lastShotTimeInSeconds = function () {
  return Math.floor(GAME_VARS.lastShotTime / 1000);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
