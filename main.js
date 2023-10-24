const letters = document.querySelectorAll('.scoreboard-letter');
const loading = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5; //Stays the same all the time, hence the screaming case.. 

async function init() {
    let currentGuess = '';
    let currentRow = 0;


    const res = await fetch("https://words.dev-apis.com/word-of-the-day") //put ?random=1 to get a new word every single page refresh
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    setLoading(false);
    

    /*This function puts the letters inside the game squares. 
    If the current guess length is already 5 it will replace the last letter of the 5 letter word with whatever the user types*/
    
    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            // add letter to the end
            currentGuess += letter;
        } else {
            // replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            // do nothing
            return; 
        }
        // TODO validate the word

        // TODO do all the marking as "correct" "close" or "wrong"

        // TODO did they win or lose?

        currentRow++;
        currentGuess = '';
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }

    document.addEventListener('keydown', function handleKeyPress (event) {
        const action = event.key;

        if (action === 'Enter') {
            commit();
        } else if (action === 'Backspace') {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
            // do nothing
        }
    });
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
    loading.classList.toggle('hidden', !isLoading);
}

init();