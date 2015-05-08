/**
 * Created by christophermortensen on 13/02/15.
 */

// this class should contain the player
// this class should contain all the walls used at the playground.
// the class should also contain the logic to build itself up from the bottom

/**************************************************
 ** PLAYGROUND CLASS
 **************************************************/
var Playground = function (_canvasWidth, _canvasHeight, startX, startY) {
    /*
     0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
     ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
     0   | | | | |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |_|_|_|_|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     1   | | | | |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |_|_|_|_|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     2   | | | | |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |_|_|_|_|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     3   | | |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |_|_|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     4   | |_|   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     5   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     6   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     7   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     8   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|
     9   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
     |___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|

     */
    var canvasWidth = _canvasWidth;
    var canvasHeight = _canvasHeight;
    var mazeGenerator = new MazeGenerator(canvasWidth, canvasHeight);
    var walls = mazeGenerator.createWalls();

    // Initialise the local player
    var localPlayer = new Player(startX, startY);

    var draw = function (ctx) {
        // Draw the local player
        localPlayer.draw(ctx);
        mazeGenerator.draw(ctx);
        /*
        * walls.forEach(function (wall) {
         wall.draw(ctx);
         });
        * */
    };

    var update = function (keys) {
        localPlayer.update(keys);
        walls.forEach(function (row) {
            row.forEach(function(wall){
                wall.performCollisionControl(localPlayer);
            });

        });
    };

    return {
        update: update,
        draw: draw
    }
};