/**
 * Created by christophermortensen on 13/02/15.
 */
/**************************************************
 ** Wall CLASS
 **************************************************/
    // x = x coodinate of center, y = y coordinate of center
    // l = number of wall blocks (l * 100px), w = width of wall, dir = HORIZONTAL or VERTICAL
var Wall = function(x, y, dir) {
    var centerX = x;
    var centerY = y;
    var height, width;
    // used when deciding dimensions
    var direction = dir;
    if(direction == "vertical"){
        height = 100;
        width = 10;
    }else{
        height = 10;
        width = 100;
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

/*
     if(currentTangentPoint.x > centerX - (width/2) &&
     currentTangentPoint.x < centerX + (width/2) &&
     currentTangentPoint.y > centerY - (height/2) &&
     currentTangentPoint.y < centerY + (height/2))

    var differenceToLower = (centerY + (height/2)) - tangentPoint.y;
    var differenceToUpper = tangentPoint.y  - (centerY - (height/2));
    var differenceToRight = (centerX + (width/2)) - tangentPoint.x;
    var differenceToLeft = tangentPoint.x - (centerX - (width/2));
    // calculate for left
    /*


    if(tangentPoint.y+moveAmount > centerY + (height/2))
    console.log("closest to lower");
    if(tangentPoint.y-moveAmount < centerY - (height/2))
    console.log("closest to upper");
    if(tangentPoint.x+moveAmount > centerX + (height/2))
    console.log("closest to right");
    if(tangentPoint.x-moveAmount < centerX - (height/2))
    console.log("closest to left");
    */
    var coords =
        [
            {"x": (centerX - (width/2)), "y": (centerY + (height/2))}, // 0
            {"x": (centerX + (width/2)), "y": (centerY + (height/2))}, // 1
            {"x": (centerX + (width/2)), "y": (centerY - (height/2))}, // 3
            {"x": (centerX - (width/2)), "y": (centerY - (height/2))}  // 2
        ];

    // takes the player, that contains all the projectiles to test on
    // If you want to bounce off a horizontal wall (e.g. top or bottom of the screen),
    // simply reverse your Y velocity. If you want to bounce off a vertical wall (e.g. left or right edge)
    // then reverse your X velocity.
    var performCollisionControl = function(player){
        // iterate through projectiles, calls invert reverse velocity.
        player.getProjectiles().forEach(function (projectile) {
            if(isCollision(projectile)){
                console.log("THERE IS COLLISION!");
                reverseVelocity(projectile);
                projectile.updateLineCoords();
            }
        });
        // for each projectile, make method to check collision on wall,
        // if collision, check on what side of the wall it was hit, to see, if it was a vertical or horizontal hit.
    };

    // if the tangentpoint of the circle touches the wall, this method returns true
    var isCollision = function(projectile){
        /*projectile.getAllTangentPoints().forEach(function (currentTangentPoint) {
            return currentTangentPoint.x > centerX - (width/2) &&
                currentTangentPoint.x < centerX + (width/2) &&
                currentTangentPoint.y > centerY - (height/2) &&
                currentTangentPoint.y < centerY + (height/2);
        });*/
        return projectile.getTangentPoint().x > centerX - (width/2) &&
            projectile.getTangentPoint().x < centerX + (width/2) &&
            projectile.getTangentPoint().y > centerY - (height/2) &&
            projectile.getTangentPoint().y < centerY + (height/2);
    };

    // either x -> -x OR y -> -y or vice versa.
    var reverseVelocity = function(projectile){
        if(touchesVerticalFacade(projectile)){
            projectile.setDegrees(calculateReflection(true, projectile.getDegrees()));
            console.log("------------------------ TOUCHES VERTICAL FACADE OF THE WALL");
        } else{
            projectile.setDegrees(calculateReflection(false, projectile.getDegrees()));
            console.log("------------------------ TOUCHES HORIZONTAL FACADE OF THE WALL");
        }
    };

    // returns true if closest to vertical facade, else false
    var touchesVerticalFacade = function(projectile){
        /*
        if((tangentPoint.x < centerX && tangentPoint.y > centerY) || (tangentPoint.x < centerX && tangentPoint.y < centerY)) // left vertical
            return true;
        if((tangentPoint.x > centerX && tangentPoint.y > centerY) || (tangentPoint.x > centerX && tangentPoint.y < centerY)) // right vertical
            return true;
        return false;
        */



        if(projectile.getTangentPoint().y+projectile.getMoveAmount() > centerY + (height/2)){
            console.log("closest to lower");
            return false;
        }

        if(projectile.getTangentPoint().y-projectile.getMoveAmount() < centerY - (height/2)){
            console.log("closest to upper");
            return false;
        }

        if(projectile.getTangentPoint().x+projectile.getMoveAmount() > centerX + (width/2)){
            console.log("closest to right");
            return true;
        }

        if(projectile.getTangentPoint().x-projectile.getMoveAmount() < centerX - (width/2)){
            console.log("closest to left");
            return true;
        }


    };



    // returns true if closest to horizontal facade, else false. REDUNDANT METHOD!
    var touchesHorizontalFacade = function(tangentPoint, moveAmount){
        if((tangentPoint.y < centerY && tangentPoint.x < centerX) || (tangentPoint.y < centerY && tangentPoint.x > centerX)) // upper horizontal
            return true;
        if((tangentPoint.y > centerY && tangentPoint.x < centerX) || (tangentPoint.y > centerY && tangentPoint.x > centerX)) // lower horizontal
            return true;
        return false;
    };

    var calculateReflection = function(hitIsVertical, angleOfIncident){
        switch (hitIsVertical){
            case true:
                if(angleOfIncident < 180){
                    return 180 - angleOfIncident;
                } else{
                    return (360 - angleOfIncident) +  180;
                }
                break;
            case false:
                return 360 - angleOfIncident;
                break;
        }
    };

    var draw = function(ctx) {
        ctx.fillStyle = "#4C4C4C";

        ctx.beginPath();
        ctx.moveTo(coords[0].x,coords[0].y);
        ctx.lineTo(coords[1].x,coords[1].y);
        ctx.lineTo(coords[2].x,coords[2].y);
        ctx.lineTo(coords[3].x,coords[3].y);
        ctx.closePath();
        ctx.fill();
    };



    return {
        draw: draw,
        performCollisionControl: performCollisionControl
    }
};