/**************************************************
 ** Projectile CLASS
 **************************************************/
var Projectile = function(x, y, deg, _boardSize, _canvasWidth, _canvasHeight) {
    var boardSize = _boardSize;
    var canvasWidth = _canvasWidth;
    var canvasHeight = _canvasHeight;
    var centerX = x;
    var centerY = y;
    var degrees = deg;
    var moveAmount = 5; // 10
    var lifeAmount = 1000; // 400
    var radius = 10;

    var wallLength = canvasHeight / boardSize;
    var oldGridCell = {};
    var currentGridCell = {};

    var lineCoords =
    [
        {"x": (10000 * Math.cos(degrees * Math.PI/180)) + centerX, "y": (10000 * Math.sin(degrees * Math.PI/180)) + centerY},
        {"x": (-10000 * Math.cos(degrees * Math.PI/180)) + centerX, "y": (-10000 * Math.sin(degrees * Math.PI/180)) + centerY}
    ];

    var draw = function(ctx) {
        forwardPush(moveAmount);
        updateCellData();

        // Vector-Line
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(lineCoords[0].x, lineCoords[0].y);
        ctx.lineTo(lineCoords[1].x, lineCoords[1].y);
        ctx.strokeStyle = "#E6E6E6";
        ctx.stroke();

        // Projectile
        ctx.fillStyle = "#800000";
        ctx.beginPath();
        ctx.arc(centerX,centerY,radius,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();

    };

    // only update them when collision, because they "constant" if degrees doesn't change
    var updateLineCoords = function(){
        lineCoords[0].x = (10000 * Math.cos(degrees * Math.PI/180)) + centerX;
        lineCoords[0].y = (10000 * Math.sin(degrees * Math.PI/180)) + centerY;
        lineCoords[1].x = (-10000 * Math.cos(degrees * Math.PI/180)) + centerX;
        lineCoords[1].y = (-10000 * Math.sin(degrees * Math.PI/180)) + centerY;
    };

    // the point on the arc where the center of the circle will be on, after 'radius' pixels
    var getTangentPoint = function(){
        return {"x": (radius * Math.cos(degrees * Math.PI/180)) + centerX, "y": (radius * Math.sin(degrees * Math.PI/180)) + centerY};
    };

    var getTangentPoint_Special = function(_direction){
        if(_direction == "right"){
            return {"x": (radius * Math.cos(0 * Math.PI/180)) + centerX, "y": (radius * Math.sin(0 * Math.PI/180)) + centerY};
        }
        else if(_direction == "down"){
            return {"x": (radius * Math.cos(90 * Math.PI/180)) + centerX, "y": (radius * Math.sin(90 * Math.PI/180)) + centerY};
        }
        else if(_direction == "left"){
            return {"x": (radius * Math.cos(180 * Math.PI/180)) + centerX, "y": (radius * Math.sin(180 * Math.PI/180)) + centerY};
        } else{
            return {"x": (radius * Math.cos(270 * Math.PI/180)) + centerX, "y": (radius * Math.sin(270 * Math.PI/180)) + centerY};
        }
    };

    var getAllTangentPoints = function(){
        var tangentPoints = [];
        for(var i = 0; i < 360; i++){
            tangentPoints.push({"x": (radius * Math.cos(i * Math.PI/180)) + centerX, "y": (radius * Math.sin(i * Math.PI/180)) + centerY});
        }
        return tangentPoints;
    };

    var getFourTangentPoints = function(){
       var tangentPoints = [];
       tangentPoints.push({"x": (radius * Math.cos(0 * Math.PI/180)) + centerX, "y": (radius * Math.sin(0 * Math.PI/180)) + centerY});
        tangentPoints.push({"x": (radius * Math.cos(90 * Math.PI/180)) + centerX, "y": (radius * Math.sin(90 * Math.PI/180)) + centerY});
        tangentPoints.push({"x": (radius * Math.cos(180 * Math.PI/180)) + centerX, "y": (radius * Math.sin(180 * Math.PI/180)) + centerY});
        tangentPoints.push({"x": (radius * Math.cos(270 * Math.PI/180)) + centerX, "y": (radius * Math.sin(270 * Math.PI/180)) + centerY});
        return tangentPoints;
    };

    var forwardPush = function(amount){
        var newCenterX = (amount * Math.cos(degrees * Math.PI/180)) + centerX;
        var newCenterY = (amount * Math.sin(degrees * Math.PI/180)) + centerY;
        centerX = newCenterX;
        centerY = newCenterY;
    };

    var getLifeAmount = function(){
        return lifeAmount;
    };

    var setLifeAmount = function(life){
        lifeAmount = life;
    };

    var getRadius = function(){
        return radius;
    };

    var setRadius = function(newRadius){
        radius = newRadius;
    };

    var getDegrees = function(){
        return degrees;
    };

    var setDegrees = function(newDegrees){
        degrees = newDegrees;
    };

    var getMoveAmount = function(){
        return moveAmount;
    };

    var setMoveAmount = function(newMoveAmount){
        moveAmount = newMoveAmount;
    };

    var getDirectionWord = function(){
        if(degrees > 315 && degrees <= 45){
            return "right";
        }
        if(degrees > 45 && degrees <= 135){
            return "down";
        }
        if(degrees > 135 && degrees <= 225){
            return "left";
        }
        if(degrees > 225 && degrees <= 315){
            return "up";
        }
    };

    var updateCellData = function(){
        var temp = { x: currentGridCell.x, y: currentGridCell.y};
        currentGridCell = {
            x:Math.floor(getTangentPoint().x / wallLength),
            y:Math.floor(getTangentPoint().y / wallLength)
        };
        if(temp.x != currentGridCell.x || temp.y != currentGridCell.y){
            oldGridCell = { x: temp.x, y: temp.y };
        }
    };

    var getCurrentCell = function(){
        return currentGridCell;
    };

    var getOldCell = function () {
        return oldGridCell;
    };

    var disappear = function(){
        radius = 0;
    };

    var getCenterCell = function(){
        return { x:Math.floor(centerX / wallLength), y:Math.floor(centerY / wallLength) };
    };

    return {
        forwardPush: forwardPush,
        draw: draw,
        getLifeAmount: getLifeAmount,
        setLifeAmount: setLifeAmount,
        getRadius: getRadius,
        setRadius: setRadius,
        getDegrees: getDegrees,
        setDegrees: setDegrees,
        getMoveAmount: getMoveAmount,
        setMoveAmount: setMoveAmount,
        updateLineCoords: updateLineCoords,
        getTangentPoint: getTangentPoint,
        getAllTangentPoints: getAllTangentPoints,
        getFourTangentPoints: getFourTangentPoints,
        getDirectionWord: getDirectionWord,
        getTangentPoint_Special: getTangentPoint_Special,
        getCurrentCell: getCurrentCell,
        disappear: disappear,
        getOldCell: getOldCell,
        getCenterCell: getCenterCell
    }
};