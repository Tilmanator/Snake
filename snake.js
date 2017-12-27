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

var snake = new Array(0); // Array of all the current snake's locations -- 0,20,40
var snakeLength = 3;
var food = 0; // random spawn point of first food

// example of extracting coordinates
snake.push(32);
/*
var y = Math.floor(snake[0]/boardSize); //round down to nearest int
var x = snake[0]%boardSize; // Takes the remainder
console.log(x+" "+y);
*/


function GenerateFood()
{
    var potFoodLoc = Math.floor(Math.Random()*400);

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
    // Move in the current direction or change direction if possible

    // Check if snake is eating food and update score
    if(snake[snake.length-1] == food){
        ++snakeLength;
        food = GenerateFood();
    }

    // Check if snake is in bounds

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

        this.interval = setInterval(turn, 1); // Every single second, a new turn occurs
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
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    reset: function() {
       // Do dis later
    }
}

function updateGraphics(){

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
