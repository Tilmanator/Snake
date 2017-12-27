var direction = 2;  // up, left, down, right
var boardSize = 20; 
var board = new Array(boardSize);
var reqDir = 2; // initially going down
 
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

// Snake tail to remove
var rem = -1;

// example of extracting coordinates
snake.push(32);

/*
var y = Math.floor(snake[0]/boardSize); //round down to nearest int
var x = snake[0]%boardSize; // Takes the remainder
console.log(x+" "+y);
*/


function GenerateFood()
{
    var potFoodLoc = Math.floor(Math.random()*400);

    for (var i = 0; i < snake; ++i)
    {
        if (potFoodLoc == snake[i])
        {
            return GenerateFood();
        }
    } 

    return potFoodLoc;
}

/*
 This happens every second
*/
function turn(){

    /*for(var i=0;i<snake.length;++i){
        console.log(snake[i]);
    }*/


    // Move in the current direction or change direction if possible
    if(reqDir != direction && Math.abs(reqDir-direction) != 2){ // eg can't go up if moving down
        direction = reqDir;
    }

    //rem = food;
    //food = GenerateFood();

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
            myGameArea.clear();
            break;
        }
        snake.unshift(snake[0]-boardSize);
        break;

        case 1: // left
        if(x==0){
            myGameArea.clear();
            break;
        }
        snake.unshift(snake[0]-1);
        break;

        case 2: // down
        if(y==boardSize-1){
            myGameArea.clear();
            break;
        }
        snake.unshift(snake[0]+boardSize);
        break;

        case 3: // right
        if(x==boardSize-1){
            myGameArea.clear();
            break;
        }
        snake.unshift(snake[0]+1);
        break;
    }

    //rem = -1;
    // if the snake is over max length
    if(snake.length > snakeLength){
        rem = snake.pop();
    }

    // Update graphics
    updateGraphics();
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = $(document).width()-20;
        this.canvas.height = $(document).height()-30;
        this.context = this.canvas.getContext("2d");

        $("body").append(this.canvas);

        this.interval = setInterval(turn, 1000); // Every single second, a new turn occurs
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
        makeGrid();
        
    },
    clear : function() {
        clearInterval(this.interval);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    reset: function() {
       // Do dis later
    }
}

function updateGraphics(){
    var ctx = myGameArea.context;
    var boxWidth = myGameArea.canvas.width/boardSize;
    var boxHeight = myGameArea.canvas.height/boardSize;
    // undraw snake tail
    if(rem >= 0){
        var y = Math.floor(rem/boardSize); //round down to nearest int
        var x = rem%boardSize;
        ctx.clearRect(Math.floor(x*boxWidth)+1, Math.floor(y*boxHeight)+1, boxWidth-2, boxHeight-2);
    }

    //ctx.clearRect(0,0, myGameArea.canvas.width, myGameArea.canvas.height);

    var y = Math.floor(food/boardSize); //round down to nearest int
    var x = food%boardSize;


    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(Math.floor(x*boxWidth)+1, Math.floor(y*boxHeight)+1, boxWidth-2, boxHeight-2);
    ctx.closePath();


    for(var i=0;i<snake.length; ++i){
        y = Math.floor(snake[i]/boardSize); //round down to nearest int
        x = snake[i]%boardSize;
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(Math.floor(x*boxWidth)+1, Math.floor(y*boxHeight)+1, boxWidth-2, boxHeight-2);
        ctx.closePath();
    }

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

function startGame(){
    $("#title").hide();
    $("#startButton").hide();
    myGameArea.start();
}
