// Canvas info
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const sleep = ms => new Promise(r => setTimeout(r, ms)) // Miliseconds

// Selection info
let selected = false // If a square is selected or not
let selectedX = 0   // the x position of the selected square
let selectedY = 0   // the y position of the selected square
let prevSelectedX = 0 // The previously selected x point on the board
let prevSelectedY = 0 // The previously selected y point on the board

const maxGrid = 15  // The size of the grid

// Colours:
const newSpotColour = 'black'
const selectedSpotColour = 'white'
const flagColour = 'red'
const bombColour = 'orange'

let start = false; // A new game is started
let started = false; // The animation has ended and the game started

/* Grid spot info:
    - 0 = unselected
    - 1 = selected and empty
    - 2 = flag
    - 3 = bomb or = 99 on gridNums
*/

/// ****************************** vvv BASIC GRID INFO vvv ***************************************

// Sizes for grid
const width = height = 700
const w = width/maxGrid
const h = height/maxGrid
ctx.canvas.width = width
ctx.canvas.height = height

let grid = []      // Grid
let gridNums = []   // If a number is around a bomb

function makeGrid(){
    grid = []      // Grid
    gridNums = []   // If a number is around a bomb

    // Making basic grid
    for (let i = 0; i < maxGrid; i++){
        grid.push([])
        gridNums.push([])
        for (let j = 0; j < maxGrid; j++){
            grid[i].push(0)
            gridNums[i].push(0)
        }
    }
    console.table(grid)
}


let animating = 0; // if animating = 211 or greater then the animation is done
async function drawGrid() {
    
    for (let i = 0; i <= maxGrid; i++){
        // Filling Colours in the grid:
        for (let j = 0; j < maxGrid; j++){

            // Images   --------------------
            let img = new Image();
            img.src = 'https://i.ibb.co/VxYrJ2X/tile.png';  // Tile
            imgBomb = new Image();
            imgBomb.src = 'https://i.ibb.co/BGVwMTr/bomb.png';  // Bomb
            // Images ^^^^^^^^^^^^^^^
            const x = i * w;
            const y = j * w;

            if (i !== maxGrid){
                if (grid[i][j] === 0){
                    //img.onload = function() { ctx.drawImage(img, x, y, w, h) }  // Tiles
                    ctx.fillStyle = newSpotColour
                }
                else if (grid[i][j] === 1){
                    ctx.fillStyle = selectedSpotColour
                }
                else if (grid[i][j] === 2){
                    if (endGame) ctx.fillStyle = bombColour // If the game is over display bombs
                    else ctx.fillStyle = newSpotColour //img.onload = function() { ctx.drawImage(img, x, y, w, h) }
                }
                else if (grid[i][j] === 3){
                    ctx.fillStyle = flagColour
                }
            }

            // filling in the grid
            if (start){
                // Animate the starting grid if start is true
                for (let k = 1; k <= 4; k++){
                    let a = k * 0.25
                    ctx.globalAlphs = a
                    ctx.fillRect(i * w, j * w, w, w, h)
                    await sleep(0)
                    if (i === maxGrid) start = false;
                    
                }
                animating++; 
                clickedButton()
            }

            else {
                ctx.fillRect(i * w, j * w, w, w, h)
            }

            if (animating >= maxGrid*maxGrid+1){    // for each square in the grid
                animating = 0
                started = true
                clickedButton()
            }
        }
    }
    
    // Displaying the grid lines:
    for (let i = 0; i <= maxGrid; i++){
        if (i === 0 || i === maxGrid){
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 4
        }

        else{
            ctx.strokeStyle = 'grey'
            ctx.lineWidth = 1.3
        }

        ctx.beginPath()
        ctx.moveTo(0, i * w)
        ctx.lineTo(width, i * w)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(i * w, 0)
        ctx.lineTo(i * w, width)
        ctx.stroke()
    }
}


async function displayGridNums(){
    ctx.font = '25px bold'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'

    for (let i = 0; i <= 14; i++){
        for (let j = 0; j <= 14; j++){
            const num = gridNums[i][j]

            if (num === 0 || num === 99 || grid[i][j] === 3) continue;

            placeText(num, i, j) 
        }
    }
}


/// ****************************** ^^^ GRID INFO ^^^ ****************************************

// vvvvvvvvvvvvvvv MOUSE FUNCTIONS vvvvvvvvvvvvvvv

let clickType;  // What button the user pressed
// 0 : Left mouse button
// 1 : Wheel button or middle button
// 2 : Right mouse button

function validMouseClick(e){
    /* if the spot clicked has already not been clicked or game has not started, 
    do not register click */

    clickType = e.button;
    if (endGame) return false; // If the game ended

    if (grid[Math.floor(e.offsetX / w)][Math.floor(e.offsetY / w)] === 0 || start || clickType === 2){
        if (clickType === 2 || clickType === 0){
            start = false    // Skip animation if screen is clicked
            if (animating > 0) started = true  // The game started
            console.log("started", clickType)
            return true;
        }
    }

    if (clickType === 0 && gridNums[Math.floor(e.offsetX / w)][Math.floor(e.offsetY / w)] === 99){
        endGame = true
        console.log("Game Over")
        gameOver()  // Displays an end game screen
    }

    return false;
}

canvas.addEventListener('mousedown', (e) => {
    if (validMouseClick(e)){
        const x = e.offsetX;
        const y = e.offsetY;
        selectedX = Math.floor(x / w)
        selectedY = Math.floor(y / w)

        console.log (animating)
        if (animating === 0 && started){
        
            resetScreen()
            console.log(selectedX, selectedY)
            if (clickType === 2){
                grid[selectedX][selectedY] = 3
                console.log(grid[selectedX][selectedY], "p")
            }
            else{
                if (grid[selectedX][selectedY] === 3){
                    console.log("Game Over")
                }
                
                else{
                    grid[selectedX][selectedY] = 1;
                    openGrid(selectedX, selectedY)
                }
                
            }
        }
        else{
            animating = -1   // Means there is no current animation playing
        }

        updateDisplay()
        displayGridNums()
    }
})

canvas.addEventListener('contextmenu', e => e.preventDefault());    // Prevents right click on board

// ^^^^^^^^^^^^ MOUSE FUNCTIONS ^^^^^^^^^^^^^^^

function resetScreen(){
    // Reset the screen
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)
}

function placeText(num, i, j){
    //console.log(selectedX, selectedY, i + ", " + j)
    ctx.fillStyle = 'black'
    ctx.fillText(num, i * w + w/2, (j + 1) * w - w/4)
}

function getRandomInt() {
    min = Math.ceil(0)
    max = Math.floor(maxGrid)
    return Math.floor(Math.random() * (max - min)) + min;
}

function updateDisplay(){
    resetScreen()
    drawGrid()
}

// Button functions:
const buttonDisabledColour = "#178d9c";
const buttonColour = "#575757";


function clickedButton(){
    // Timer countdown for re-clicking buttons
    const playButton = document.getElementById('play_button') // Setting the play button

    // const currentTime = Date.now()
    // while (Date.now() - currentTime < 2000) {
    //     playButton.disabled = true
    // }
    playButton.disabled = true
    playButton.style.background = buttonColour
    if (started){
        playButton.style.background = buttonDisabledColour
        playButton.disabled = false
    }
}

makeGrid()
updateDisplay()
