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

    var canvasWidth = _canvasWidth;
    var canvasHeight = _canvasHeight;
    var mazeGenerator = new MazeGenerator(canvasWidth, canvasHeight);
    var walls = mazeGenerator.createWalls();

    // Initialise the local player
    var localPlayer = new Player(startX, startY, mazeGenerator.getBoardSize(), canvasWidth, canvasHeight);

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