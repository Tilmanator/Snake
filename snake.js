// TODO: graphics and score

var direction = 2;  // up, left, down, right
var reqDir = 2; // initially going down

var boardSize = 20; 
var board = new Array(boardSize);
for (var i = 0; i < boardSize; ++i)
{
    board[i] = new Array(boardSize);
    for (var j = 0; j < boardSize; ++j)
    {
        board[i][j] = 0;
    }
}

// Array of all the current snake's locations -- 0,20,40
// The head is at the beginning so snake(0)
var snake = new Array(0); 

var snakeLength = 3;
var food = 20; // random spawn point of first food

// Snake tail to remove, saves having to redraw entire board every turn
var rem = -1;

// Start point of snake
snake.push(32);

//Player score
var score = 0;

//High score
var highScore = 0;

//Used to decrease score 
var counter = 0;

// FUNCTIONS

function startGame(){
    $("#title").hide();
    $("#startButton").hide();
    $("#score").show();
    $("#highScore").show();
    myGameArea.start();
}

function restartGame(){
    myGameArea.context.clearRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height);
    reqDir = 2;
    direction = 2;
    snakeLength = 3;
    $("#highScore").text("High Score: "+ score)
    
    score = 0;
    $("#score").text("Score: " + score);
    myGameArea.reset();
}

function gameOver(){
    myGameArea.clear();
    //myGameArea.context.clearRect(0,0,myGameArea.canvas.width, myGameArea.canvas.height);
}

/*
 Simulates a 'turn' where the snake moves one spot in some amount of time specified as interval
*/
function turn(){
    // Move in the current direction or change direction if possible
    if(reqDir != direction && Math.abs(reqDir-direction) != 2){ // eg can't go up if moving down
        direction = reqDir;
    }

    // Check if snake is eating food and update score
    if(snake[0] == food){
        ++snakeLength;
        food = GenerateFood();
    }

    // Check if snake is in bounds and move snake forward
    var y = Math.floor(snake[0]/boardSize); //round down to nearest int
    var x = snake[0]%boardSize; // Takes the remainder

    // Ensure it is all good;
    switch(direction){
        case 0: // up
        if(y==0){
            gameOver();
            break;
        }
        snake.unshift(snake[0]-boardSize);
        break;

        case 1: // left
        if(x==0){
            gameOver();
            break;
        }
        snake.unshift(snake[0]-1);
        break;

        case 2: // down
        if(y==boardSize-1){
            gameOver();
            break;
        }
        snake.unshift(snake[0]+boardSize);
        break;

        case 3: // right
        if(x==boardSize-1){
            gameOver();
            break;
        }
        snake.unshift(snake[0]+1);
        break;
    }

    // Check for self-collision
    for(var i=1;i<snake.length;++i){
        if(snake[0]==snake[i]){
            gameOver();
            break;
        }
    }

    rem = -1;
    // if the snake is over max length
    if(snake.length > snakeLength){
        rem = snake.pop();
    }

    // Update graphics
    updateGraphics();

    //Update score
    Score();
}

// The object that handles game interactions
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = $(document).width()-20;
        this.canvas.height = $(document).height()-$(document).height()/5.8;
        this.context = this.canvas.getContext("2d");

        $("body").append(this.canvas);

        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: // left
                reqDir = 1;
                break;
                case 38: // up
                reqDir = 0;
                break;
                case 39: // right
                reqDir = 3;
                break;
                case 40: // down
                reqDir = 2;
                break;
                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
        this.reset();
    },
    clear : function() {
        clearInterval(this.interval);
        $("#gameOverMessage").text("GAME OVER").show();
        $("#restartButton").show();
    },
    reset: function() {
        $("#gameOverMessage").hide();
        $("#restartButton").hide();
        snake = [32];
        food = GenerateFood();
        // Create the original grid
        //makeGrid();
        this.interval = setInterval(turn, 200); // Can change turn rate (speed) here
    }
}

function updateGraphics(){
    var ctx = myGameArea.context;
    var boxWidth = myGameArea.canvas.width/boardSize;
    var boxHeight = myGameArea.canvas.height/boardSize;
    // undraw snake tail if need be
    if(rem >= 0){
        var y = Math.floor(rem/boardSize); //round down to nearest int
        var x = rem%boardSize;
        ctx.clearRect(Math.floor(x*boxWidth), Math.floor(y*boxHeight), boxWidth, boxHeight);
    }

    var y = Math.floor(food/boardSize); //round down to nearest int
    var x = food%boardSize;

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(Math.floor(x*boxWidth)+1, Math.floor(y*boxHeight)+1, boxWidth-2, boxHeight-2);
    ctx.closePath();

    snake.forEach(function(el){
        y = Math.floor(el/boardSize); //round down to nearest int
        x = el%boardSize;
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(Math.floor(x*boxWidth)+1, Math.floor(y*boxHeight)+1, boxWidth-2, boxHeight-2);
        ctx.closePath();
    });
}

// Generates 'food' at a random, empty board spot
function GenerateFood()
{
    var potFoodLoc = Math.floor(Math.random()*(boardSize*boardSize));

    for (var i = 0; i < snake; ++i)
    {
        if (potFoodLoc == snake[i])
        {
            return GenerateFood();
        }
    } 

    return potFoodLoc;
}

// Called once to make the original grid
function makeGrid(){
    var boxWidth = myGameArea.canvas.width/boardSize;
    var boxHeight = myGameArea.canvas.height/boardSize;
    var ctx = myGameArea.context;

    for(var i = 0; i < boardSize; i++){
        var w = Math.floor(i*boxWidth);
        var h = Math.floor(i*boxHeight);
        // Draw vertical lines
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w, myGameArea.canvas.height);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(myGameArea.canvas.width, h);
        ctx.stroke();
        ctx.closePath();
    }
}

//Handles everything to do with score
function Score(){
   if (snake[0] == food)
   {
    score += 100;
    $("#score").text("Score: " + score);
    counter = 0;
   }
   //Decreases score at a constant rate
   else{
    counter++;
    if (isInt(counter/5) == true && score != 0){ //Can change score decay speed here
        score--;
        $("#score").text("Score: " + score);
    }
   }
}

//Checks if number is an integer 
function isInt(x) {
    if (x % 1 == 0){
        return true;
    }
    else{
        return false;
    }
}