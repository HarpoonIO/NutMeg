/**************************************************
 ** Wall CLASS
 **************************************************/
// x = x coodinate of center, y = y coordinate of center
// l = number of wall blocks (l * 100px), w = width of wall, dir = HORIZONTAL or VERTICAL
var Wall = function (x, y, dir, length, _cellX, _cellY) {
    var cellX = _cellX;
    var cellY = _cellY;
    var centerX = x;
    var centerY = y;
    var height, width;
    // used when deciding dimensions
    var direction = dir;

    if(direction === "vertical" || direction === "horizontal" || direction === "both"){
        height = length;
        width = length;
    }
    else{
        direction = undefined;
    }

    // COORDS ARE FULLY DEPENDENT ON THE centerX and centerY coordinates
    //  0-----------------------------------> 	X
    //	0|			2 _______._______ 3
    //	 |		    .|_ _ _ _|_ _ _ _|.                                · = tangentpoint
    //	 |			 |_______|_______|
    //	 |		    0        .         1
    //   v
    //
    // 	 Y


    var coords =
        [
            {"x": (centerX - (width / 2)), "y": (centerY + (height / 2))}, // 0
            {"x": (centerX + (width / 2)), "y": (centerY + (height / 2))}, // 1
            {"x": (centerX + (width / 2)), "y": (centerY - (height / 2))}, // 3
            {"x": (centerX - (width / 2)), "y": (centerY - (height / 2))}  // 2
        ];

    if(direction == "both"){
        height = length;
        width = 15;
    }

    // takes the player, that contains all the projectiles to test on
    // If you want to bounce off a horizontal wall (e.g. top or bottom of the screen),
    // simply reverse your Y velocity. If you want to bounce off a vertical wall (e.g. left or right edge)
    // then reverse your X velocity.
    var performCollisionControl = function (player) {
        // iterate through projectiles, calls invert reverse velocity.
        player.getProjectiles().forEach(function (projectile) {
            if (isCollision(projectile)) {
                reverseVelocity(projectile);
                projectile.updateLineCoords();
            }
        });
        // for each projectile, make method to check collision on wall,
        // if collision, check on what side of the wall it was hit, to see, if it was a vertical or horizontal hit.
    };


    // if the tangentpoint of the circle touches the wall, this method returns true
    var isCollision = function (projectile) {
        if(direction != undefined){
            return projectile.getCurrentCell().x == cellX && projectile.getCurrentCell().y == cellY;
        }
        return false;
    };

    var reverseVelocity = function (projectile) {
        if (touchesVerticalFacade(projectile)) {
            projectile.setDegrees(calculateReflection(true, projectile.getDegrees()));
            console.log("------------------------ TOUCHES VERTICAL FACADE OF THE WALL");
        } else {
            projectile.setDegrees(calculateReflection(false, projectile.getDegrees()));
            console.log("------------------------ TOUCHES HORIZONTAL FACADE OF THE WALL");
        }
    };

    // returns true if closest to vertical facade, else false
    var touchesVerticalFacade = function (projectile) {
        var centerY = projectile.getCenterCell().y;
        var tangentY = projectile.getCurrentCell().y;

        if(centerY != tangentY) { // touches horizontal
            return false;
        }
        return true;

    };

    var calculateReflection = function (hitIsVertical, angleOfIncident) {
        switch (hitIsVertical) {
            case true:
                if (angleOfIncident < 180) {
                    return 180 - angleOfIncident;
                } else {
                    return (360 - angleOfIncident) + 180;
                }
                break;
            case false:
                return 360 - angleOfIncident;
                break;
        }
    };

    var draw = function (ctx) {
        if(direction){
            ctx.fillStyle = "#4C4C4C";
            ctx.beginPath();


            ctx.moveTo(coords[0].x, coords[0].y);
            ctx.lineTo(coords[1].x, coords[1].y);
            ctx.lineTo(coords[2].x, coords[2].y);
            ctx.lineTo(coords[3].x, coords[3].y);


            ctx.closePath();
            ctx.fill();
        }
    };

    return {
        draw: draw,
        performCollisionControl: performCollisionControl
    }
};