let bombCount = 10;
let bombs = []    // locations where bombs were placed

function startGame(){
    /* starts the game, bombCount must be set */

    // Setting up basic components
    makeGrid()
    updateDisplay()
    bombs = []
    start = true;

    for (let i = bombCount; i >= 0; i--){
        let randomX = getRandomInt();
        let randomY = getRandomInt();

        while (bombs.includes(randomX + ", " + randomY)){
            randomX = getRandomInt();
            randomY = getRandomInt();
        }

        grid[randomX][randomY] = 2;
        bombs.push(randomX + ", " + randomY)
    }
    aroundMines()   // Checks for spaces around mines
    updateDisplay()
}


function aroundMines(){
    let mine_count;
    console.log(grid)
    for (let z = 0; z < bombCount; z++){

        // Finding bomb info:
        let location = bombs[z]
        let posX = parseInt(location.substr(0, 1))
        let pY = location.substr(3)
        pY.replace(" ", "")
        posY = parseInt(pY)
        console.log(posX, posY)

        // Changing the numbers around the bombs to include a count
        let lowX = -1
        let maxX = 2
        let lowY = -1
        let maxY = 2
        // Changing x values:
        if (posX === 0){
            maxY = 1
        }
        else if (posX === 14){
            lowY = 0
        }
        // y values:
        if (posY === 0){
            maxX = 1
        }
        else if (posY === 14){
            lowX = 0
        }        
        
        for (let i = lowX; i < maxX; i++){
            for (let j = lowY; j < maxY; j++){
                gridNums[posX + i][posY + j] += 1;
            }
        }
        console.log(gridNums)
    }
}