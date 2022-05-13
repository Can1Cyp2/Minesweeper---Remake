const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const sleep = ms => new Promise(r => setTimeout(r, ms)) // Miliseconds

// Selection info
let selected = false // If a square is selected or not
let selectedX = 0   // the x position of the selected square
let selectedY = 0   // the y position of the selected square
let prevSelectedX = 0 // The previously selected x point on the board
let prevSelectedY = 0 // The previously selected y point on the board

// Colours:
let selectedSpot = 'white'
let newSpot = 'black'

let start = false; // A new game is started

/* Grid spot info:
    - 0 = unselected
    - 1 = selected and empty
    - 2 = flag
    - 3 = bomb
*/

/// ****************************** vvv BASIC GRID INFO vvv ***************************************

// Sizes for grid
const width = height = 700
const w = width/15
const h = height/15
ctx.canvas.width = width
ctx.canvas.height = height

let grid = []      // Grid
let gridNums = []   // If a number is around a bomb

function makeGrid(){
    grid = []      // Grid
    gridNums = []   // If a number is around a bomb

    // Making basic grid
    for (let i = 0; i < 15; i++){
        grid.push([])
        gridNums.push([])
        for (let j = 0; j < 15; j++){
            grid[i].push(0)
            gridNums[i].push(0)
        }
    }

    console.table(grid)
}


async function drawGrid() {
    for (let i = 0; i <= 15; i++){
        
        // Filling colours in the grid:
        if (i !== 15){
            for (let j = 0; j < 15; j++){
                if (grid[i][j] === 0){
                    ctx.fillStyle = 'black'
                }
                else if (grid[i][j] === 1){
                    ctx.fillStyle = 'white'
                }
                else if (grid[i][j] === 2){
                    ctx.fillStyle = 'orange'
                }
                else if (grid[i][j] === 3){
                    ctx.fillStyle = 'red'
                }


                // filling in the grid
                if (start){
                    // Animate the starting grid if start is true
                    for (let k = 1; k <= 4; k++){
                        let a = k * 0.25
                        ctx.globalAlphs = a
                        ctx.fillRect(i * w, j * w, w, w, h)
                        await sleep(0.1)
                        if (i === 14) start = false;
                    }
                }

                else {
                    ctx.fillRect(i * w, j * w, w, w, h)
                }

            }
        }
    }
    
    // Displaying the grid lines:
    for (let i = 0; i <= 15; i++){
        if (i === 0 || i === 15){
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
    for (let i = 0; i < 14; i++){
        for (let j = 0; j < 14; j++){
            const num = gridNums[i][j]

            if (num === 0) continue;

            ctx.font = '20px'
            ctx.fillStyle = 'black'
            ctx.textAlign = 'center'

            placeText(num, i, j) 

        }
    }
}


/// ****************************** ^^^ GRID INFO ^^^ ****************************************

// vvvvvvvvvvvvvvv MOUSE FUNCTIONS vvvvvvvvvvvvvvv

canvas.addEventListener('mousedown', (e) => {
    if (!start){
        textCol = 'darkBlue'
        const x = e.offsetX;
        const y = e.offsetY;
        selectedX = Math.floor(x / w)
        selectedY = Math.floor(y / w)
    
        resetScreen()
        console.log(selectedX, selectedY)
    
        if (grid[selectedX][selectedY] === 3){
            console.log("Game Over")
        }
        else{
            grid[selectedX][selectedY] = 1;
        }
    
        updateDisplay()
    }

    // Skip animation if screen is clicked
    else{
        start = false
    }
    displayGridNums()
})

// ^^^^^^^^^^^^ MOUSE FUNCTIONS ^^^^^^^^^^^^^^^

function resetScreen(){
    // Reset the screen
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)
}

function placeText(num, i, j){
    console.log(selectedX, selectedY, i + ", " + j)
    textCol = 'darkBlue'
    ctx.fillStyle = textCol
    ctx.fillText(num, i * w + w/2, (j + 1) * w - w/4)
}

function getRandomInt() {
    min = Math.ceil(0)
    max = Math.floor(15)
    return Math.floor(Math.random() * (max - min)) + min;
}

function updateDisplay(){
    resetScreen()
    drawGrid()
}

makeGrid()
updateDisplay()