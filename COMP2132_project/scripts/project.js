/*
Game Object
*/

class hangmanGame {
    constructor() {
        this.word = "";
        this.hint = "";
        this.wrongGuess = 0;
        this.maxWrongGuess = 6;
        this.display = [];

    }
    startGame(wordhint) {
        this.word = wordhint.word;
        this.hint = wordhint.hint;
        this.wrongGuess = 0;
        this.display = [];

        for (let i = 0; i < this.word.length; i++) {
            this.display.push("_");
        }
    }

    guess(letter) {
        letter = letter.toLowerCase();
        if (this.word.includes(letter)) {
            for (let i = 0; i < this.word.length; i++) {
                if (this.word[i] === letter) {
                    this.display[i] = letter;
                }
            }
        } else {
            this.wrongGuess++;
        }
    }

    isWin() {
        for (let i = 0; i < this.word.length; i++) {
            if (this.display[i] !== this.word[i]) {
                return false;
            }
        }
        return true;
    }

    isLose() {
        if (this.wrongGuess >= this.maxWrongGuess) {
            return true;
        } else {
            return false;
        };
    }
}

const hangman = new hangmanGame();

function pickRandomWordHint(json) {
    const numberOfWord = json.length;
    const randomNumber = Math.floor(Math.random() * numberOfWord);
    return json[randomNumber]
}

/*
Fetch the word hint json
*/
const displayhint = document.getElementById("hint");
const displayword = document.getElementById("word");


fetch("scripts/word_hint.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        hangman.startGame(pickRandomWordHint(json));
        displayhint.innerHTML = `Hint: ` + hangman.hint;
        displayword.innerHTML = hangman.display.join(" ");
    })
/*
image input
*/

const hangmanPic = document.getElementById("hangman-pic");
const initialImageNumber = 0;

hangmanPic.src = `images/image0${initialImageNumber}.png`

/*
letter button input
*/

const keys = document.querySelectorAll(".all-key");
const keysRelax = document.getElementsByClassName("key-relax");
const keysPressed = document.getElementsByClassName("key-pressed");
const displayMessage = document.getElementById("message");

displayMessage.innerHTML = `Chances left: ${hangman.wrongGuess} / ${hangman.maxWrongGuess}`;


for (let i = 0; i < keysRelax.length; i++) {
    keysRelax[i].addEventListener("click", function () {
        const letter = this.value;
        this.disabled = true;
        hangman.guess(letter);
        displayhint.style.fontWeight = `${200*hangman.wrongGuess}`;
        displayhint.innerHTML = `Hint: ` + hangman.hint;
        displayword.innerHTML = hangman.display.join(" ");
        displayMessage.innerHTML = `Chances left: ${hangman.wrongGuess} / ${hangman.maxWrongGuess}`;
        hangmanPic.src = `images/image0${hangman.wrongGuess}.png`
        this.classList.remove("key-relax");
        this.classList.add("key-pressed");

        if (hangman.isWin()) {
            displayMessage.classList.add("won");
            displayMessage.innerHTML = "You saved the day!";
            for (let i = 0; i < keysRelax.length; i++) {
                keysRelax[i].disabled = true;
                keysRelax[i].classList.add("key-pressed");
            }
        }

        else if (hangman.isLose()) {
            displayMessage.classList.add("lost");
            displayMessage.innerHTML = "Game Over!"
            for (let i = 0; i < keysRelax.length; i++) {
                keysRelax[i].disabled = true;
                keysRelax[i].classList.add("key-pressed");
            }
        }
    }
    )

}


/*
play again button
*/

const playAgainBtn = document.getElementById("playagain");


playAgainBtn.addEventListener("click", function () {
    Array.from(keys).forEach(key => {
        key.disabled = false;
        key.classList.remove("key-pressed");
        key.classList.add("key-relax");
    });
        playAgain();
});

function playAgain() {
    fetch("scripts/word_hint.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            hangman.startGame(pickRandomWordHint(json));
            displayhint.style.fontWeight = 100;
            displayhint.innerHTML = `Hint: ` + hangman.hint;
            displayword.innerHTML = hangman.display.join(" ");
            hangmanPic.src = `images/image0${initialImageNumber}.png`;
            hangman.wrongGuess = 0;
            displayMessage.innerHTML = `Chances left: ${hangman.wrongGuess} / ${hangman.maxWrongGuess}`;
            displayMessage.classList.remove("lost");
            displayMessage.classList.remove("won");
        })
}




