let bombCount = 25;
let bombs = []    // locations where bombs were placed

let endGame = false; // Whether the game has ended or not
let gameWon = false; // Whether the game has been won or not

///////////////////////////////////////////////////////////

function startGame(){
    /* starts the game, bombCount must be set */
    
    // Reset previous game over message if it exists
    if (document.getElementById('gameOver')) document.getElementById('gameOver').remove();

    // Setting up basic components and setting variables
    makeGrid()
    updateDisplay()
    bombs = [{  }]
    start = true;
    started = false;
    endGame = false;
    gameWon = false;
    let newBomb;

    for (let i = bombCount; i > 0; i--) {
        newBomb = { 
            x: getRandomInt(),
            y: getRandomInt()
        }

        // Checking if the bomb is already on the grid
        while (bombs.filter(bomb => bomb.x === newBomb.x && bomb.y === newBomb.y).length > 0) {
            newBomb = {
                x: getRandomInt(),
                y: getRandomInt()
            }
        }

        grid[newBomb.x][newBomb.y] = 2;
        bombs.push(newBomb)
    }

    aroundMines()   // Checks for spaces around mines
    updateDisplay()
    clickedButton() // Adds a delay to the button, registers a click to play
}


function aroundMines() {
    for (let z = 0; z <= bombCount; z++) {

        // Finding bomb info:
        const { x, y } = bombs[z]

        // Checking around the bomb:
        for (let i = x - 1; i <= x + 1; i++) {
          if (i < 0 || i > maxGrid-1) continue;
          
          for (let j = y - 1; j <= y + 1; j++) {
                if (j < 0 || j > maxGrid-1) continue;

                if (grid[i][j] !== 2) gridNums[i][j] += 1   // Adding the numbers of bombs touching a tile
                else gridNums[i][j] = 99;   // Setting the bomb spot to 99
            }
        }
    }
}

// Opening the grid after a click:
function openGrid(x, y){

    /* Opens all spots on the grid that a bomb is not on */
    for (let i = x - 1; i <= x + 1; i++) {
        if (i < 0 || i > maxGrid-1) continue;

        for (let j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j > maxGrid-1) continue;

            if (isSpotAvailable(i, j)){
                grid[i][j] = 1; // Opening the space on the grid
                if (gridNums[i][j] === 0) openGrid(i, j) // if the space is empty with no bombs touching, check around it
            }
        }
    }
}


function isSpotAvailable(x, y){
    // checks if a spot on the grid is available to open
    if (grid[x][y] === 0 && gridNums[x][y] !== 99) return true
    return false
}

function checkWin(){
    // Checks if the game has been won
    let count = 0;
    for (let i = 0; i < maxGrid; i++){
        for (let j = 0; j < maxGrid; j++){
            if (grid[i][j] === 1) count += 1
        }
    }

    if (count === maxGrid*maxGrid - bombCount) {
        gameWon = true;
        gameOver()
    }
}


function gameOver(){
    if (endGame){
        // If the game has ended display game over on screen
        let header = document.createElement("h1")
        header.setAttribute("id", "gameOver")
        document.body.appendChild(header)

        let text = document.createTextNode("Game Over! You lost :(")
        header.appendChild(text)

        updateDisplay() // Display bombs. Now that endGame is set true
    }

    else if (gameWon){
        // If the game has ended display game over on screen
        let header = document.createElement("h1")
        header.setAttribute("id", "gameOver")
        document.body.appendChild(header)

        let text = document.createTextNode("Congratulations! You Won :)")
        header.appendChild(text)

        updateDisplay() // Display bombs. Now that endGame is set true
    }

    // If end game is not true and a new game has started
    else if (start){
        // removes the game over or game won header if it exists
        console.log("game restart")
    }
}
