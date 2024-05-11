// Fetch data from JSON file
fetch('data.json')
  .then(response => response.json()) // Parse the JSON response
  .then(wordsData => {
    // Get random category
    const categories = Object.keys(wordsData); // Get all categories
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]; // Choose a random category

    // Get random word from the chosen category
    const wordsInCategory = wordsData[randomCategory]; // Get words in the chosen category
    const randomWord = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)]; // Choose a random word

    // Display category
    document.querySelector(".game-info .category span").innerHTML = randomCategory; // Display the chosen category

    // Display letters for the chosen word
    const lettersGuessContainer = document.querySelector(".letters-guess"); // Select the container for guessed letters
    for (let i = 0; i < randomWord.length; i++) {
      const letter = randomWord[i]; // Get each letter of the word
      const span = document.createElement("span"); // Create a span element for each letter
      span.textContent = letter === " " ? " " : "_"; // Display the letter or space as an underscore
      lettersGuessContainer.appendChild(span); // Append the span to the container
    }

    // Select Guess Spans
    let guessSpans = document.querySelectorAll(".letters-guess span"); // Select all spans for guessed letters

    // Handle clicking on letters
    const letterBoxes = document.querySelectorAll('.letter-box'); // Select all letter boxes
    letterBoxes.forEach(box => { // Loop through each letter box
      box.addEventListener('click', () => { // Add click event listener
        if (!box.classList.contains('clicked')) { // Check if the box has not been clicked before
          let checker = null; // flag to check if user succeed or not
          box.classList.add('clicked'); // Mark the box as clicked
          const clickedLetter = box.textContent.toLowerCase(); // Get the clicked letter
          const wordLetters = randomWord.toLowerCase().split(''); // Split the word into individual letters
          let correctGuess = false; // Flag to track if the guess is correct
          wordLetters.forEach((wordLetter, index) => { // Loop through each letter in the word
            if (wordLetter === clickedLetter) { // Check if the clicked letter matches the current letter in the word
              correctGuess = true; // Set correct guess flag to true
              guessSpans[index].textContent = clickedLetter; // Display the correctly guessed letter
            }
          });
          if (!correctGuess) { // If the guess is incorrect
            wrongAttempts++; // Increment wrong attempts
            endGame(checker); // Update level based on wrong attempts
            theDraw.classList.add(`wrong-${wrongAttempts}`); // Add CSS class to draw element to display part of hangman
            document.getElementById("fail").play(); // Play fail sound
            if (wrongAttempts === maxAttempts) { // If maximum attempts reached
              checker = false;
              endGame(checker); // End the game
            }
          } else { // If the guess is correct
            const allLettersGuessed = Array.from(guessSpans).every(span => span.textContent !== '_'); // Check if all letters have been guessed
            if (allLettersGuessed) { // If all letters have been guessed
              checker = true;
              endGame(checker);
            } else {
              document.getElementById("success").play(); // Play success sound
            }
          }
        }
      });
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error); // Log error if fetching data fails
  });

//Letters
const Letters = "abcdefghijklmnopqrstuvwxyz";

// Convert string into array
let lettersArray = Array.from(Letters);

// Select Letters Container
let lettersContainer = document.querySelector(".letters");

// Loop on the Array named "lettersArray"
lettersArray.forEach((letter) => {
  // Create Span
  let span = document.createElement("span");

  // Create Letters Text Node
  let theLetter = document.createTextNode(letter);

  // Append the Letters To Span
  span.appendChild(theLetter);

  // Add Class On Span
  span.className = "letter-box";

  // Append Span To The Letters Container
  lettersContainer.appendChild(span);
});

// Set Wrong Attempts
let wrongAttempts = 0;
let maxAttempts = 8; // Maximum attempts allowed

// Select The Draw Element
let theDraw = document.querySelector(".hangman-draw");

// Function to end the game
function endGame(checker) {
  if (checker === true) {
    updateLevel();
  } else if (checker === false) {
    Swal.fire({
      title: "Game Over",
      text: `Try Again`,
      icon: "warning",
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload(); // Reload the page when the user clicks "Ok"
      }
    });
  }
}

function updateLevel() {
  let level;
  let levelClass;
  if (wrongAttempts <= 3) {
    level = "Expert";
    levelClass = "level-expert";
  } else if (wrongAttempts > 3 && wrongAttempts <= 6) {
    level = "Good";
    levelClass = "level-good";
  } else if (wrongAttempts > 6)  {
    level = "Bad";
    levelClass = "level-bad";
  }
  Swal.fire({
    title: "Good job!",
    html: `Your level is <span class="${levelClass}">${level}</span>`, // Using HTML to apply the CSS class
    icon: "success",
    confirmButtonText: "Ok",
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload(); // Reload the page when the user clicks "Ok"
    }
  });
}

