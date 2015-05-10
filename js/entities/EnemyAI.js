var EnemyAI = function (startX, startY, _opponents) {

    // Variables
    var ratio = 0.3;
    var centerX = 300;
    var centerY = 350;
    var speed = 2;
    var currentDegrees = 0;
    var width = 150 * ratio;
    var height = 100 * ratio;
    var opponents = _opponents;
    var currentDegrees = 0;
    var rotation = 5;
    var pipeWidth = 175 * ratio;
    var pipeHeight = 25 * ratio;
    var direction = 0;
    var coordinates = setCoordinates();

    // Functions

    // Compares opponent's placement to its own and updates
    var updateNewCoordinatesWhenMoving = function (movement) {
        var targetX, targetY;
        targetX = opponents[0].getX();
        targetY = opponents[0].getY();

        console.log("Opponent is at: " + targetX + "," + targetY);
        console.log("AI is at: " + centerX + "," + centerY);

        if (targetX > centerX) {
            centerX = Math.round(centerX += speed);
        } else {
            centerX = Math.round(centerX -= speed);
        }

        if (targetY > centerY) {
            centerY = Math.round(centerY += speed);
        } else {
            centerY = Math.round(centerY -= speed);
        }

        // Update coordinates
        coordinates = setCoordinates();
    };

    var updateNewCoordinatesWhenRotating = function (degrees) {

        coordinates.forEach(function (coordinate) {
            // Rotate clockwise, angle in radians
            var newX =
                (Math.cos(degrees * Math.PI / 180) * (coordinate.x - centerX) -
                (Math.sin(degrees * Math.PI / 180) * (coordinate.y - centerY)) + centerX);
            var newY =
                (Math.sin(degrees * Math.PI / 180) * (coordinate.x - centerX) +
                (Math.cos(degrees * Math.PI / 180) * (coordinate.y - centerY)) + centerY);

            //console.log("NewX: " + newX + ", NewY: " + newY);
            coordinate.x = newX;
            coordinate.y = newY;
        });
    };

    function setCoordinates() {
        return [
            {"x": (centerX - (width / 2)), "y": (centerY + (height / 2))}, // 0
            {"x": (centerX + (width / 2)), "y": (centerY + (height / 2))}, // 1
            {"x": (centerX + (width / 2)), "y": (centerY - (height / 2))}, // 3
            {"x": (centerX - (width / 2)), "y": (centerY - (height / 2))}, // 2
            {"x": (centerX), "y": (centerY + (pipeHeight / 2))},
            {"x": (centerX + (pipeWidth / 2)), "y": (centerY + (pipeHeight / 2))},
            {"x": (centerX + (pipeWidth / 2)), "y": (centerY - (pipeHeight / 2))},
            {"x": (centerX), "y": (centerY - (pipeHeight / 2))}
        ];
    };

    // Finds the opponent's direction and updates
    // AI's if they're different
    function hasEnemyMoved(){
        var x2 = opponents[0].getX();
        var y2 = opponents[0].getY();
        var newDirection = 0;

        newDirection = Math.round((y2 - centerY) / (x2 - centerX));

        if(newDirection != direction){
            direction = newDirection;
            return true;
        }else{
            return false;
        }


    }

    function isObstacle() {
        // is there a wall in front?
        // if so, return true

        return false;
    }

    var update = function () {
        //updateNewCoordinatesWhenMoving(speed);

        if (isObstacle() || hasEnemyMoved()) {
            updateNewCoordinatesWhenRotating(-rotation);
        }

    };

    var draw = function (ctx) {

        // body
        //ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgb(0, 0, 0)";
        ctx.fillStyle = "#FE2EC8";
        ctx.beginPath();
        ctx.moveTo(coordinates[0].x,coordinates[0].y);
        ctx.lineTo(coordinates[1].x,coordinates[1].y);
        ctx.lineTo(coordinates[2].x,coordinates[2].y);
        ctx.lineTo(coordinates[3].x,coordinates[3].y);
        ctx.closePath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
        ctx.fill();

        // mount
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#4C0B5F";
        ctx.beginPath();
        ctx.arc(centerX,centerY,35*ratio,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();

        // pipe
        ctx.beginPath();
        ctx.moveTo(coordinates[4].x,coordinates[4].y);
        ctx.lineTo(coordinates[5].x,coordinates[5].y);
        ctx.lineTo(coordinates[6].x,coordinates[6].y);
        ctx.lineTo(coordinates[7].x,coordinates[7].y);
        ctx.closePath();
        ctx.fill();

    };


    return {
        draw: draw,
        update: update
    };

};