/**
 * Created by thomashed & christophermortensen on 05/05/15.
 */
var MazeGenerator = function (_canvasHeight, _canvasWidth) {
    var boardSize = 11;
    var canvasHeight = _canvasHeight;
    var canvasWidth = _canvasWidth;
    var grid;
    var walls;

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
                    grid[i][j] = "w";
                }
            } else {
                grid[i][0] = "w";
                grid[i][grid.length - 1] = "w";
            }
        }
    }

    function addEntrance() {
        var x = randomNumber(1, grid.length - 1);
        grid[grid.length - 1][x] = "g";
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
            else grid[y][i] = "w";
        }
    }

    function addVWall(minY, maxY, x) {
        var hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;

        for (var i = minY; i <= maxY; i++) {
            if (i == hole) grid[i][x] = "";
            else grid[i][x] = "w";
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
    generate(11, 1, 1);
    display();

    var draw = function (ctx) {

    };

    var createWalls = function () {
        // Find the coordinates for this wall in the array
        for(var row = 0; row < walls.length; row++){
            for(var col = 0; col < walls[0].lenght; col++){
                walls[row][col] = "";





                


            }
        }



        convertCoordinate(canvasHeight, canvasWidth, 0, 0);


    };

    var init = function () {
        // Create wall 2d array to return
        walls = new Array(boardSize);
        walls.forEach(function () {
            new Array(boardSize);
        });
    };

    // converts 2d-array placement to canvas coordinate-values.
    var convertCoordinate = function (canvasHeight, canvasWidth, row, col) {
        var wallLength = canvasHeight / grid[0].length;
        return {
            x: wallLength * row,
            y: wallLength * col,
            wallLength: wallLength
        };
    };

    return {
        draw: draw
    };
};
