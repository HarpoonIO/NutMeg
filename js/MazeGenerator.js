/**
 * Created by thomashed & christophermortensen on 05/05/15.
 */
var MazeGenerator = function (_canvasHeight, _canvasWidth) {
    var boardSize = 11;
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

        addOuterWalls();
        var ent = addEntrance();
        addInnerWalls(true, 1, grid.length - 2, 1, grid.length - 2, ent);
    }

    function addOuterWalls() {
        for (var i = 0; i < grid.length; i++) {
            if (i == 0 || i == (grid.length - 1)) {
                for (var j = 0; j < grid.length; j++) {
                    grid[i][j] = "vertical";
                }
            } else {
                grid[i][0] = "horizontal";
                grid[i][grid.length - 1] = "horizontal";
            }
        }
    }

    function addEntrance() {
        var x = randomNumber(1, grid.length - 1);
        grid[grid.length - 1][x] = "vertical";
        return x;
    }

    function addInnerWalls(h, minX, maxX, minY, maxY, gate) {
        if (h) {

            if (maxX - minX < 2) {
                return;
            }

            var y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
            addHWall(minX, maxX, y);

            addInnerWalls(!h, minX, maxX, minY, y - 1, gate);
            addInnerWalls(!h, minX, maxX, y + 1, maxY, gate);
        } else {
            if (maxY - minY < 2) {
                return;
            }

            var x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
            addVWall(minY, maxY, x);

            addInnerWalls(!h, minX, x - 1, minY, maxY, gate);
            addInnerWalls(!h, x + 1, maxX, minY, maxY, gate);
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

        for(var i = 0; i < 11; i++){
            for(var j = 0; j < 11; j++){
                walls[i][j].draw(ctx);
            }
        }



    };

    var createWalls = function () {
        // Find the coordinates for this wall in the array
        for (var row = 0; row < walls.length; row++) {
            for (var i = 0; i < walls[0].length; i++) { // TODO: Why does this not work when i is col???
                var knowledgeExchange = convertCoordinate(canvasHeight, canvasWidth, row, i);
                walls[row][i] = new Wall(knowledgeExchange.x, knowledgeExchange.y, grid[row][i], knowledgeExchange.wallLength);
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
        generate(11); // TODO: Figure out these arguments -.-



    };

    // converts 2d-array placement to   canvas coordinate-values.
    var convertCoordinate = function (canvasHeight, canvasWidth, row, col) {
        var wallLength = canvasHeight / boardSize;

        return {
            x: wallLength * (row ),
            y: wallLength * (col ),
            wallLength: wallLength
        };

    };

    return {
        draw: draw,
        createWalls: createWalls
    };
};
