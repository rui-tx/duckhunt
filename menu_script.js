document.addEventListener('DOMContentLoaded', () => {
    const pressStartBtn = document.getElementById('press-start-btn');
    const selector = document.querySelector('.selector');
    const topScoreElement = document.getElementById('var-top-score');
    const menuContainer = document.getElementById('menu-container');

    // Retrieve the current top score from localStorage
    function getTopScore() {
    return parseInt(localStorage.getItem('topScore')) || 0;
    }

    let topScore = getTopScore();
    topScoreElement.textContent = `TOP SCORE = ${topScore}`;

    // Function to play the menu sound and hide the "Press Start" button
    function playMenuSound() {
        // Play the sound
        menuSound.currentTime = 0;
        menuSound.play().catch(error => {
            console.log('Sound playback prevented by browser:', error);
        });

        // Hide the "Press Start" button
        pressStartBtn.style.display = 'none';

        // Activate the menu by removing the inactive class
        menuContainer.classList.remove('inactive');
    }

    // Initially disable all clicks and interactions in the menu
    menuContainer.classList.add('inactive');

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
