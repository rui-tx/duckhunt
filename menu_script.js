document.addEventListener("DOMContentLoaded", () => {
  const pressStartBtn = document.getElementById("press-start-btn");
  const selector = document.querySelector(".selector");
  const topScoreElement = document.getElementById("var-top-score");
  const menuContainer = document.getElementById("menu-container");
  let topScore = 12000;
  let backgroundMusic;

  // Function to update the score in the HTML
  function updateTopScore(newScore) {
    topScore = newScore;
    topScoreElement.textContent = `TOP SCORE = ${topScore}`;
  }

  // Update the score like this:
  updateTopScore(12000);

  // Function to play the menu sound and hide the "Press Start" button
  function playMenuSound() {
    // Hide the "Press Start" button
    pressStartBtn.style.display = "none";
    playPreciseAudioLoop("sound/Title.mp3", 0, 3.8);

    // Activate the menu by removing the inactive class
    menuContainer.classList.remove("inactive");
  }

  // Initially disable all clicks and interactions in the menu
  menuContainer.classList.add("inactive");

  pressStartBtn.addEventListener("click", playMenuSound);

  // Function to move selector to the hovered button
  function moveSelector(button) {
    const buttonRect = button.getBoundingClientRect();
    const menuRect = document
      .getElementById("menu-container")
      .getBoundingClientRect();
    const topPosition = buttonRect.top - menuRect.top;
    const leftPosition = buttonRect.left - menuRect.left - 20;
    selector.style.transform = `translate(${leftPosition}px, ${topPosition}px)`;
    selector.style.opacity = 1;
  }

  const btnA = document.querySelector(".btn-a");
  const btnB = document.querySelector(".btn-b");
  const btnC = document.querySelector(".btn-c");

  btnA.addEventListener("mouseenter", () => moveSelector(btnA));
  btnB.addEventListener("mouseenter", () => moveSelector(btnB));
  btnC.addEventListener("mouseenter", () => moveSelector(btnC));

  document
    .getElementById("menu-container")
    .addEventListener("mouseleave", () => {
      selector.style.opacity = 0;
    });

  // Add click event to btnA to open game.html
  btnA.addEventListener("click", () => {
    stopAudioLoop();
    window.location.href = "game.html";
  });
});

/******************************************************************************/

let audioContext;
let sourceNode;

function playPreciseAudioLoop(url, loopStart, loopEnd) {
  // Create audio context if it doesn't exist
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Fetch the audio file
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      // Create a buffer source node
      sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;

      // Set loop points
      sourceNode.loop = false;
      sourceNode.loopStart = loopStart;
      sourceNode.loopEnd = loopEnd;

      // Connect the source to the audio context destination
      sourceNode.connect(audioContext.destination);

      // Start playing
      sourceNode.start(0, loopStart);
    })
    .catch((e) => console.error("Error with decoding audio data", e));
}

// Function to stop the music
function stopAudioLoop() {
  if (sourceNode) {
    sourceNode.stop();
  }
}
