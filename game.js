const GAME_NUMBER_OF_DUCKS = 10;
const GAME_MAX_MISSED_DUCKS = [4, 3, 2, 1, 0]; // 5 levels of missed ducks
const GAME_TIME_IN_MS = 1200000; // global timeout
const GAME_ROUND_MAX_TIME_DUCK_STAYS_IN_MS = 5000;
const GAME_ROUND_NUMBER_OF_SHOOTS = 3;
const DUCK_ELEMENT_NAME = "score";

const GAME_VARS = {
  gameState: "idle", // idle, round, duck_flew_away, end
  round: 1,
  currentStep: 0,
  duckRoundArray: [],
  shotsRemaining: GAME_ROUND_NUMBER_OF_SHOOTS,
  ducksRemaining: GAME_NUMBER_OF_DUCKS,
  ducksShotOnRound: 0,
  totalDucksShotted: 0,
  lastShotTime: 0,
  timeRemaining: GAME_TIME_IN_MS,
  score: 0,
};

const ANIMATIONS_TIME_IN_MS = {
  startDogAnimation: 7000,
  dogCatchBird: 5000,
  dogLaugh: 5000,
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
  if (GAME_VARS.shotsRemaining < 1) {
    console.log("No shots remaining!");
    //GAME_VARS.gameState = "idle";
    //updateGameText();
    //startGame();
    return;
  }

  GAME_VARS.shotsRemaining--;

  if (!duckHitted) {
    console.log("Player missed the shot...");
    const bulletToRemove = `bullet-${GAME_VARS.shotsRemaining + 1}`;
    document.getElementById(bulletToRemove).outerHTML = "";
    updateGameText();
    return;
  }

  console.log("Duck hit!");
  GAME_VARS.gameState = "idle";
  GAME_VARS.score++;
  GAME_VARS.duckRoundArray.push(1);
  GAME_VARS.ducksRemaining--;
  GAME_VARS.ducksShotOnRound++;
  GAME_VARS.totalDucksShotted++;
  updateGameText();
  startGame();
};

const updateGameText = function () {
  document.getElementById("round-value").innerHTML = GAME_VARS.round;
  document.getElementById("score-number").innerHTML = GAME_VARS.score
    .toString()
    .padStart(6, "0");

  // add simple red background for now
  for (let i = 1; i <= GAME_VARS.duckRoundArray.length; i++) {
    if (GAME_VARS.duckRoundArray[i - 1] === 1) {
      const node = document.getElementById(`duck-${i}`);
      node.classList.add("red");
    }
  }
};

document.onclick = function (event) {
  if (GAME_VARS.gameState !== "round") {
    console.warn("Game is not in 'round' state, ignoring click");
    return;
  }
  event.target.id === DUCK_ELEMENT_NAME ? shoot(true) : shoot(false);
};

const updateDuckLimitContainer = function () {
  document.getElementById("container-duck-target").innerHTML = "";

  const pipesPerDuck = 3;
  for (let i = 1; i <= GAME_NUMBER_OF_DUCKS - getMaxMissedDucks(); i++) {
    for (let j = 1; j <= pipesPerDuck; j++) {
      const node = document.createElement("span");
      node.innerHTML = `|`;
      document.getElementById("container-duck-target").appendChild(node);
    }
  }
};

const startGame = async function () {
  updateDuckLimitContainer();

  if (GAME_VARS.currentStep === GAME_NUMBER_OF_DUCKS) {
    GAME_VARS.gameState = "idle";

    GAME_VARS.duckRoundArray = GAME_VARS.duckRoundArray.sort((a, b) => b - a);

    for (let i = 1; i <= GAME_NUMBER_OF_DUCKS; i++) {
      const node = document.getElementById(`duck-${i}`);
      node.classList.remove("red");

      if (GAME_VARS.duckRoundArray[i - 1] === 1) {
        node.classList.add("red");
      }
    }

    console.log("Showing ducks shot and not shot on round...");
    await sleep(5000);
    GAME_VARS.duckRoundArray = [];

    for (let i = 1; i <= GAME_NUMBER_OF_DUCKS; i++) {
      const node = document.getElementById(`duck-${i}`);
      node.classList.remove("red");
    }

    const maxMissedDucks = getMaxMissedDucks();
    // check if player goes to next round
    const numberOfTotalMissedDucks =
      GAME_NUMBER_OF_DUCKS - GAME_VARS.ducksShotOnRound;
    if (numberOfTotalMissedDucks > maxMissedDucks) {
      console.log(
        `Game over! Reason: Player missed more then ${maxMissedDucks} ducks: ${numberOfTotalMissedDucks}`
      );
      GAME_VARS.gameState = "end";
      updateGameText();

      dogLaugh();
      console.log(
        `Dog animation laughing for ${ANIMATIONS_TIME_IN_MS.dogLaugh} miliseconds...`
      );
      sleep(ANIMATIONS_TIME_IN_MS.dogLaugh);
      return;
    }

    console.log("NEW ROUND!");

    GAME_VARS.round += 1;
    GAME_VARS.currentStep = 0;
    GAME_VARS.ducksShotOnRound = 0;
    GAME_VARS.ducksRemaining = GAME_NUMBER_OF_DUCKS;

    const roundTag = document.getElementById("round-tag");
    roundTag.style.display = "block";

    await sleep(3000);
    roundTag.style.display = "none";
  }

  // only shows dog walk and jump animation when is the first step round
  if (GAME_VARS.currentStep === 0) {
    const roundTag = document.getElementById("round-tag");
    roundTag.style.display = "block";

    console.log(
      `Initial animation for ${ANIMATIONS_TIME_IN_MS.startDogAnimation} miliseconds...`
    );
    startDogAnimation();
    await sleep(ANIMATIONS_TIME_IN_MS.startDogAnimation);

    roundTag.style.display = "none";
    await startRound();

    if (GAME_VARS.gameState === "duck_flew_away") {
      console.log(
        `Dog animation laughing when duck flies away for ${ANIMATIONS_TIME_IN_MS.dogLaugh} miliseconds...`
      );
      dogLaugh();
      await sleep(ANIMATIONS_TIME_IN_MS.dogLaugh);

      await startGame();
    }
    return;
  }

  // wait for round to end
  await startRound();
  // if duck flew away then start game again
  if (GAME_VARS.gameState === "duck_flew_away") {
    console.log(
      `Dog animation laughing when duck flies away for ${ANIMATIONS_TIME_IN_MS.dogLaugh} miliseconds...`
    );
    dogLaugh();
    await sleep(ANIMATIONS_TIME_IN_MS.dogLaugh);

    await startGame();
  }
};

const startRound = async function () {
  // only shows dog showing the shot ducks when is not the first step round and game is idle
  if (GAME_VARS.currentStep > 0 && GAME_VARS.gameState === "idle") {
    console.log(
      `Dog animation when showing ducks shot for ${ANIMATIONS_TIME_IN_MS.dogCatchBird} miliseconds...`
    );
    dogCatchBird();
    await sleep(ANIMATIONS_TIME_IN_MS.dogCatchBird);
  }

  GAME_VARS.currentStep += 1;

  // update bullets div
  document.getElementById("bullet-list").innerHTML = "";
  for (let i = 1; i <= GAME_ROUND_NUMBER_OF_SHOOTS; i++) {
    const node = document.createElement("div");
    node.id = `bullet-${i}`;
    document.getElementById("bullet-list").appendChild(node);
  }

  console.log("Round is on");

  GAME_VARS.shotsRemaining = GAME_ROUND_NUMBER_OF_SHOOTS;
  GAME_VARS.gameState = "round";
  document.getElementById("round-value").innerHTML = GAME_VARS.round;

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

    if (
      timeElapsedInMs >= GAME_ROUND_MAX_TIME_DUCK_STAYS_IN_MS ||
      GAME_VARS.shotsRemaining < 1
    ) {
      GAME_VARS.gameState = "duck_flew_away";
      GAME_VARS.duckRoundArray.push(0);

      const waitTime = 3000;
      const flyTag = document.getElementById("fly-tag");
      flyTag.style.display = "block";

      console.log(
        `Duck animation when flying away for ${waitTime} miliseconds...`
      );
      await sleep(waitTime);
      flyTag.style.display = "none";

      updateScore();
      updateGameText();
      break;
    }

    if (GAME_VARS.timeRemaining - timeElapsedInMs <= 0) {
      const waitTime = 3000;
      const gameOver = document.getElementById("game-over-id");
      gameOver.style.display = "block";

      console.log("Game over! Reason: Timer ran out");
      GAME_VARS.gameState = "end";
      updateGameText();

      await sleep(waitTime);
      gameOver.style.display = "none";
      dogLaugh();
      break;
    }

    // document.getElementById("timeLeft").innerText = `${Math.floor(
    //   (GAME_VARS.timeRemaining - timeElapsedInMs) / 1000
    // )}`;

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
