document.addEventListener('DOMContentLoaded', () => {
    const pressStartBtn = document.getElementById('press-start-btn');
    const selector = document.querySelector('.selector');
    const topScoreElement = document.getElementById('top-score'); // Get the top score element

    let topScore = 12000;

    // Function to update the score in the HTML
    function updateTopScore(newScore) {
        topScore = newScore;
        topScoreElement.textContent = `TOP SCORE = ${topScore}`;
    }

    // Example: You can update the score like this:
    updateTopScore(13000); 

    // Function to play the menu sound and hide the "Press Start" button
    function playMenuSound() {
        // Play the sound
        menuSound.currentTime = 0;
        menuSound.play().catch(error => {
            console.log('Sound playback prevented by browser:', error);
        });

        // Hide the "Press Start" button
        pressStartBtn.style.display = 'none';
    }

    pressStartBtn.addEventListener('click', playMenuSound);

     // Function to move selector to the hovered button
     function moveSelector(button) {
        const buttonRect = button.getBoundingClientRect();
        const menuRect = document.getElementById('menu-container').getBoundingClientRect();

        const topPosition = buttonRect.top - menuRect.top;
        const leftPosition = buttonRect.left - menuRect.left - 20;

        selector.style.transform = `translate(${leftPosition}px, ${topPosition}px)`;
        selector.style.opacity = 1;
    }

    const btnA = document.querySelector('.btn-a');
    const btnB = document.querySelector('.btn-b');
    const btnC = document.querySelector('.btn-c');

    btnA.addEventListener('mouseenter', () => moveSelector(btnA));
    btnB.addEventListener('mouseenter', () => moveSelector(btnB));
    btnC.addEventListener('mouseenter', () => moveSelector(btnC));

    document.getElementById('menu-container').addEventListener('mouseleave', () => {
        selector.style.opacity = 0;
    });
});
