/**
 * Created by christophermortensen on 05/05/15.
 */
var grid;

function generate(dimensions, numDoors) {
    grid = new Array();
    for (var i = 0; i < dimensions; i++) {
        grid[i] = new Array();

        for (var j = 0; j < dimensions; j++) {
            grid[i][j] = " ";
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
                grid[i][j] = "-";
            }
        } else {
            grid[i][0] = "|";
            grid[i][grid.length - 1] = "|";
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

        var y = Math.floor(randomNumber(minY, maxY)/2)*2;
        addHWall(minX, maxX, y);

        addInnerWalls(!h, minX, maxX, minY, y-1, gate);
        addInnerWalls(!h, minX, maxX, y + 1, maxY, gate);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(randomNumber(minX, maxX)/2)*2;
        addVWall(minY, maxY, x);

        addInnerWalls(!h, minX, x-1, minY, maxY, gate);
        addInnerWalls(!h, x + 1, maxX, minY, maxY, gate);
    }
}

function addHWall(minX, maxX, y) {
    var hole = Math.floor(randomNumber(minX, maxX)/2)*2+1;

    for (var i = minX; i <= maxX; i++) {
        if (i == hole) grid[y][i] = "P";
        else grid[y][i] = "-";
    }
}

function addVWall(minY, maxY, x) {
    var hole = Math.floor(randomNumber(minY, maxY)/2)*2+1;

    for (var i = minY; i <= maxY; i++) {
        if (i == hole) grid[i][x] = "P";
        else grid[i][x] = "|";
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
        output += "";
        console.log(output);
    }
};
generate(31, 1);
display();

var draw = function(ctx){

};
