let bombCount = 25;
let bombs = []    // locations where bombs were placed

let endGame = false; // Whether the game has ended or not

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
    let newBomb;

    for (let i = bombCount; i > 0; i--){
        newBomb = { 
            x: getRandomInt(),
            y: getRandomInt()
        }

        while (bombs.includes(newBomb)){
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


function aroundMines(){
    for (let z = 1; z <= bombCount; z++){
        // Finding bomb info:
        const { x, y } = bombs[z]

        for (let i = x - 1; i <= x + 1; i++){
            if (i < 0 || i > maxGrid-1) continue;
            
            for (let j = y - 1; j <= y + 1; j++){
                if (j < 0 || j > maxGrid-1) continue;
                console.log(i, j)

                if (grid[i][j] !== 2) gridNums[i][j] += 1   // Adding the numbers of bombs touching a tile
                else gridNums[i][j] = 99;   // Setting the bomb spot to 99
            }
        }
    }
    console.log(gridNums, grid)
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
    console.log()
}


function isSpotAvailable(x, y){
    // checks if a spot on the grid is available to open
    if (grid[x][y] === 0 && gridNums[x][y] !== 99) return true
    return false
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

    // If end game is not true and a new game has started
    else if (start){
        // removes the game over header if it exists
        console.log("game restart")
    }
}
