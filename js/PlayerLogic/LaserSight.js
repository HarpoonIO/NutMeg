/**
 * Created by thomashed & christophermortensen on 09/05/15.
 */
/**************************************************
 ** LaserSight CLASS --
 **************************************************/
var LaserSight = function(x, y, deg, _boardSize, _canvasWidth, _canvasHeight) {
    var boardSize = _boardSize;
    var canvasWidth = _canvasWidth;
    var canvasHeight = _canvasHeight;
    var centerX = x;
    var centerY = y;
    var degrees = deg;
    var moveAmount = 5; // 10
    var radius = 10;

    var wallLength = canvasHeight / boardSize;
    var oldGridCell = {};
    var currentGridCell = {};

    var pointCap = 21;
    var coordinates = [];

    var draw = function(ctx) {

        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgb(0, 0, 0)";
        ctx.setLineDash([5, 15]);
        for(var i = 0; i < coordinates.length-1; i++){
            ctx.beginPath();
            ctx.moveTo(coordinates[i].x, coordinates[i].y);
            ctx.lineTo(coordinates[i+1].x, coordinates[i+1].y);
            ctx.strokeStyle = "#005C00";
            ctx.stroke();
        }


        ctx.lineWidth = 12;
        ctx.fillStyle = "#800000";
        ctx.beginPath();
        ctx.arc(centerX,centerY,radius,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([0, 0]);

    };

    var isOutOfBounds = function(){
      return currentGridCell.x < 0 || currentGridCell.x < 0 ||
              currentGridCell.x > boardSize-1 || currentGridCell.y > boardSize-1;

    };

    var getCoordinates = function(){
        return coordinates;
    };

    var getCap = function(){
        return pointCap;
    };

    var isDoneBuilding = function(){
        return coordinates.length == pointCap;
    };

    var itIsAHit = function(){
        //console.log("There was a hit at " + {x:getTangentPoint().x, y:getTangentPoint().y});
       coordinates.push({x:centerX, y:centerY});
    };

    var emptyCoordinates = function(){
        coordinates = [];
        coordinates.push({x:centerX, y:centerY});
    };

    // the point on the arc where the center of the circle will be on, after 'radius' pixels
    var getTangentPoint = function(){
        return {"x": (radius * Math.cos(degrees * Math.PI/180)) + centerX, "y": (radius * Math.sin(degrees * Math.PI/180)) + centerY};
    };
    currentGridCell = { x:Math.floor(getTangentPoint().x / wallLength), y:Math.floor(getTangentPoint().y / wallLength) };

    var forwardPush = function(amount){

        var newCenterX = (amount * Math.cos(degrees * Math.PI/180)) + centerX;
        var newCenterY = (amount * Math.sin(degrees * Math.PI/180)) + centerY;
        centerX = newCenterX;
        centerY = newCenterY;

        updateCellData();
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

    var updateCellData = function(){
        var temp = { x: currentGridCell.x, y: currentGridCell.y};
        currentGridCell = { x:Math.floor(getTangentPoint().x / wallLength), y:Math.floor(getTangentPoint().y / wallLength) };

        if(temp.x != currentGridCell.x || temp.y != currentGridCell.y){
            //console.log("moved from " + temp.x + "," + temp.y + " to " + currentGridCell.x + "," + currentGridCell.y);

            oldGridCell = { x: temp.x, y: temp.y };
        }
    };

    var getCurrentCell = function(){
        //var wallLength = canvasHeight / boardSize;
        //return { x:Math.floor(getTangentPoint().x / wallLength), y:Math.floor(getTangentPoint().y / wallLength) };
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

    var setCenter = function(_newCoord){
        centerX = _newCoord.x;
        centerY = _newCoord.y;
    };

    return {
        forwardPush: forwardPush,
        draw: draw,
        getRadius: getRadius,
        setRadius: setRadius,
        getDegrees: getDegrees,
        setDegrees: setDegrees,
        getMoveAmount: getMoveAmount,
        setMoveAmount: setMoveAmount,
        getTangentPoint: getTangentPoint,
        getCurrentCell: getCurrentCell,
        disappear: disappear,
        getOldCell: getOldCell,
        getCenterCell: getCenterCell,
        isDoneBuilding: isDoneBuilding,
        getCap: getCap,
        emptyCoordinates: emptyCoordinates,
        getCoordinates: getCoordinates,
        itIsAHit: itIsAHit,
        setCenter: setCenter,
        isOutOfBounds: isOutOfBounds
    }
};