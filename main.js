// Set the number of rounds and the answer length
const ROUNDS = 6;  // Number of rounds in the game
const ANSWER_LENGTH = 5;  // Length of the word to guess

// Select DOM elements
const letters = document.querySelectorAll('.scoreboard-letter');  // Selects all elements with class 'scoreboard-letter'
const loading = document.querySelector('.info-bar');  // Selects the element with class 'info-bar'

// Initialize the game
async function init() {
    // Initialize variables
    let currentGuess = '';  // Holds the current user's guess
    let currentRow = 0;  // Tracks the current row of guesses
    let done = false;  // Indicates if the game is finished
    let isLoading = true;  // Indicates if data is currently being loaded

    // Fetch a word from an external API
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");  // API call to get the word of the day
    const resObj = await res.json();  // Parse the API response as JSON
    const word = resObj.word.toUpperCase();  // Convert the word to uppercase
    const wordParts = word.split("");  // Split the word into an array of characters
    isLoading = false;  // Data loading is complete
    setLoading(isLoading);  // Toggle the loading UI

    // Function to add a letter to the current guess
    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            // Add letter to the end
            currentGuess += letter;
        } else {
            // Replace the last letter if the guess length is already 5
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText = letter;
    }

    // Function to validate and process the current guess
    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            // Do nothing if the guess length is not equal to the answer length
            return;
        }

        isLoading = true;  // Set loading state
        setLoading(isLoading);  // Toggle the loading UI

        // Validate the current guess with an external API
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({ word: currentGuess })
        });
        
        const resObj = await res.json();  // Parse the API response as JSON
        const validWord = resObj.validWord;

        isLoading = false;  // Reset loading state
        setLoading(isLoading);  // Toggle the loading UI

        // Process the guess and update the UI
        if (!validWord) {
            markInvalidWord();
            return;
        } 

        // Check the correctness of the guess and update the UI
        // ...

        // Handle game outcomes
        // ...

        // Reset variables for the next round
        currentRow++;
        currentGuess = "";

        // Handle win condition
        // ...
    }

    // Function to handle backspace
    function backspace() {
        // Remove the last letter from the current guess
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
    }

    // Function to mark an invalid word
    function markInvalidWord() {
        alert('NOT A VALID WORD');

        // Add visual feedback for an invalid word
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

            // Use a timeout for a brief visual effect
            setTimeout(function () {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
            }, 10);
        }
    }

    // Event listener for keyboard input
    document.addEventListener('keydown', function handleKeyPress (event) {
        if (done || isLoading) {
            // Do nothing if the game is finished or loading
            return;
        }
        const action = event.key;

        // Perform actions based on keyboard input
        if (action === 'Enter') {
            commit();
        } else if (action === 'Backspace') {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
            // Do nothing for other keys
        }
    });
}

// Function to check if a character is a letter
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

// Function to toggle loading UI
function setLoading(isLoading) {
    loading.classList.toggle('hidden', !isLoading);
}

// Function to create a frequency map of characters in an array
function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}

// Start the game
init();
