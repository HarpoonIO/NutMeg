/**
 * Created by thomashed & christophermortensen on 05/05/15.
 */
var MazeGenerator = function (_canvasHeight, _canvasWidth) {
    var boardSize = 111;
    var canvasHeight = _canvasHeight;
    var canvasWidth = _canvasWidth;
    var grid;
    var walls;
    init();

    function generate(dimensions, numDoors) {
        grid = new Array();
        for (var i = 0; i < dimensions; i++) {
            grid[i] = new Array();

            for (var j = 0; j < dimensions; j++) {
                grid[i][j] = "";
            }
        }

        addInnerWalls(true, 1, grid.length - 2, 1, grid.length - 2);
        addOuterWalls();
    }

    function addOuterWalls() {


        // Vertical Walls
        for (var row = 0; row < grid.length; row++) {
            // Horizontal Walls
            if(row != grid.length-1){
                grid[row][0] = "horizontal";
                grid[row][grid.length-1] = "horizontal";
            }
            // Extra Whitespace
            if(row != grid.length-2){
                grid[row][1] = "";
                grid[row][grid.length-2] = "";
            }

            if (row == 0 || row == (grid.length - 1)) {
                for (var col = 0; col < grid.length; col++) {
                    grid[row][col] = "vertical";
                }
            }
        }

        grid[0][0] = "both";
        grid[grid.length-1][grid.length-1] = "both";
    }

    function addEntrance() {
        var x = randomNumber(1, grid.length - 1);
        grid[grid.length - 1][x] = "vertical";
        return x;
    }

    function addInnerWalls(h, minX, maxX, minY, maxY) {
        if (h) {

            if (maxX - minX < 2) {
                return;
            }

            var y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
            addHWall(minX, maxX, y);

            addInnerWalls(!h, minX, maxX, minY, y - 1);
            addInnerWalls(!h, minX, maxX, y + 1, maxY);
        } else {
            if (maxY - minY < 2) {
                return;
            }

            var x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
            addVWall(minY, maxY, x);

            addInnerWalls(!h, minX, x - 1, minY, maxY);
            addInnerWalls(!h, x + 1, maxX, minY, maxY);
        }
    }

    function addHWall(minX, maxX, y) {
        var hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;

        for (var i = minX; i <= maxX; i++) {
            if (i == hole) grid[y][i] = "";
            else grid[y][i] = "vertical";
        }
    }

    function addVWall(minY, maxY, x) {
        var hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;

        for (var i = minY; i <= maxY; i++) {
            if (i == hole) grid[i][x] = "";
            else grid[i][x] = "horizontal";
        }
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function display() {
        for (var i = 0; i < grid.length; i++) {
            var output = "";
            for (var j = 0; j < grid.length; j++) {
                output += grid[i][j];
            }
            output += "\n";
            console.log(output);
        }
    };

    // Loops through all walls and draw them
    // NOTE: if undefined, does nothing -> no wall
    var draw = function (ctx) {

        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                walls[i][j].draw(ctx);
            }
        }

    };

    var createWalls = function () {
        // Find the coordinates for this wall in the array
        for (var row = 0; row < walls.length; row++) {
            for (var col = 0; col < walls[0].length; col++) { // TODO: Why does this not work when i is col???
                var knowledgeExchange = convertCoordinate(canvasHeight, canvasWidth, row, col);
                walls[row][col] = new Wall(knowledgeExchange.x, knowledgeExchange.y, grid[row][col], knowledgeExchange.wallLength, row, col);
            }
        }
        return walls;
    };

    function init() {
        // Create wall 2d array to return
        walls = new Array(boardSize);
        for (var i = 0; i < walls.length; i++) {
            walls[i] = new Array(boardSize);
        }
        generate(boardSize, 1, 1); // TODO: Figure out these arguments -.-


    };

    // converts 2d-array placement to   canvas coordinate-values.
    var convertCoordinate = function (canvasHeight, canvasWidth, row, col) {
        var wallLength = canvasHeight / boardSize;

        return {
            x: (wallLength * (row ))+wallLength/2,
            y: (wallLength * (col ))+wallLength/2,
            wallLength: wallLength
        };

    };

    var getBoardSize = function(){
        return boardSize;
    };

    return {
        draw: draw,
        createWalls: createWalls,
        getBoardSize: getBoardSize
    };
};
