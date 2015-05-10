/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, _boardSize, _canvasWidth, _canvasHeight, _walls) {
	var walls = _walls; // TODO: I mean seriously... this is clumsy, BUT USEFUL FOR THE LASER

	var boardSize = _boardSize;
	var canvasWidth = _canvasWidth;
	var canvasHeight = _canvasHeight;

	var	direction = 'up';
	var	projectiles = [];
	var ratio = 0.3;

	var speed = 3;
	var rotation = 4; // 4
	var currentDegrees = 0; // 0
	var centerX      = 200;
	var centerY      = 250;
	var width  = 150 * ratio;
	var height = 100 * ratio;

	var pipeWidth = 175 * ratio;
	var pipeHeight = 25 * ratio;

	var iterationsLeftToShoot = 0;
	var projectilesCap = 7;

	var laserToggleSleep = 25;
	var enableLaser = false;
	var laserSight = new LaserSight(centerX, centerY, currentDegrees, boardSize, canvasWidth, canvasHeight);
	laserSight.forwardPush(85*ratio);

	// COORDS ARE FULLY DEPENDENT ON THE centerX and centerY coordinates


	//  0-----------------------------------> 	X
	//	0|			2 ___________ 3
	//	 |		     |			 |
	//	 |			 |			 |
	//	 |			 |	         |
	//	 |			 |			 |
	//	 |			 | 			 |
	//	 |			 |___________|
	//	 |		    0             1
	//   v
	//
	// 	 Y


	var coordinates =
		[
			// body
			{"x": (centerX - (width/2)), "y": (centerY + (height/2))}, // 0
			{"x": (centerX + (width/2)), "y": (centerY + (height/2))}, // 1
			{"x": (centerX + (width/2)), "y": (centerY - (height/2))}, // 3
			{"x": (centerX - (width/2)), "y": (centerY - (height/2))},  // 2
			// pipe
			{"x": (centerX), "y": (centerY + (pipeHeight/2))},
			{"x": (centerX + (pipeWidth/2)), "y": (centerY + (pipeHeight/2))},
			{"x": (centerX + (pipeWidth/2)), "y": (centerY - (pipeHeight/2))},
			{"x": (centerX), "y": (centerY - (pipeHeight/2))}
		];


	var getProjectiles = function(){
		return projectiles;
	};

	// http://stackoverflow.com/questions/22261388/find-vertices-of-rectangle-after-rotating-it
	var updateNewCoordinatesWhenRotating = function(degrees){
		coordinates.forEach(function(coord){
			// Rotate clockwise, angle in radians
			var newX =
				(Math.cos(degrees * Math.PI/180) * (coord.x - centerX) -
				(Math.sin(degrees * Math.PI/180) * (coord.y - centerY)) + centerX);
			var	newY =
				(Math.sin(degrees * Math.PI/180) * (coord.x - centerX) +
				(Math.cos(degrees * Math.PI/180) * (coord.y - centerY)) + centerY);
			coord.x = newX;
			coord.y = newY;
		});
	};

	/*
	 Du ganger punktets y koordinat med vektorens y værdi og det samme med x værdien.
	 Længden af vektoren er lig med kvadratroden af x koordinaten i 2. plus y koordinaten i 2.

	 //http://www.mathsisfun.com/algebra/vectors.html
	 x (vektorens x-koordinat) = r × cos( θ )
	 y (vektoresn y-koordinat) = r × sin( θ )
	 */

	/*
	 how to mulitply coordinates (a+b)*(c+d) = (ac+ad+bc+bd).

	 */
	var updateNewCoordinatesWhenMoving = function(movement){
		var newCenterX = (movement * Math.cos(currentDegrees * Math.PI/180)) + centerX;
		var newCenterY = (movement * Math.sin(currentDegrees * Math.PI/180)) + centerY;
		centerX = newCenterX;
		centerY = newCenterY;
		coordinates.forEach(function(coord){
			// VectorX * CurrentX OR VectorY * CurrentY
			var newX = (movement * Math.cos(currentDegrees * Math.PI/180)) + coord.x;
			var newY = (movement * Math.sin(currentDegrees * Math.PI/180)) + coord.y;
			coord.x = newX;
			coord.y = newY;
		});

	};

	var controlProjectileLogic = function(keys){
		if(iterationsLeftToShoot > 0){
			iterationsLeftToShoot--;
		}

		if (keys.space && projectiles.length < projectilesCap && iterationsLeftToShoot == 0){
			var newProjectile = new Projectile(centerX, centerY, currentDegrees, boardSize, canvasWidth, canvasHeight);
			iterationsLeftToShoot = 25;
			newProjectile.setRadius(newProjectile.getRadius() * 1); // ratio
			newProjectile.forwardPush(85*ratio); //
			projectiles.push(newProjectile);
			console.log("Shot a projectile at: " + currentDegrees + "°" + " (" + newProjectile.getCurrentCell().x + "," + newProjectile.getCurrentCell().y + ")");
		}

		// Removes burnt out projectiles
		for(var i = 0; i < projectiles.length; i++){
			projectiles[i].setLifeAmount(projectiles[i].getLifeAmount()-1);
			if(projectiles[i].getLifeAmount() == 0){
				projectiles.splice(i, 1);
			}
		}
	};

	// it is basically has projectile logic, that is appeared as a static zig-zag line
	var emitLaserSight = function(){

		if(enableLaser){
			laserSight.setDegrees(currentDegrees);
			laserSight.setCenter({x:centerX, y:centerY});
			laserSight.emptyCoordinates();

			laserSight.forwardPush(85*ratio);

			while(!laserSight.isDoneBuilding() && !laserSight.isOutOfBounds()){
				//console.log("inside while. LaserProjectile X: " + laserSight.getTangentPoint().x + " LaserProjectile Y: " + laserSight.getTangentPoint().y);
				laserSight.forwardPush(laserSight.getMoveAmount());

				walls.forEach(function (row) {
					row.forEach(function(wall){
						wall.performCollisionControl(laserSight, true);

					});
				});

			}

		}
	};

	var laserEvent = function(keys){
		if (keys.laser){
			if(laserToggleSleep == 0){
				laserToggleSleep = 25;
				enableLaser = !enableLaser;
				if(enableLaser)
					emitLaserSight();
			}
		}
		if(laserToggleSleep > 0){
			laserToggleSleep--;
		}
	};

	var movementEvent = function(keys){
		// Up key takes priority over down
		if (keys.up) {
			updateNewCoordinatesWhenMoving(speed);
		} else if (keys.down) {
			updateNewCoordinatesWhenMoving(-(speed/2));
		}

		// Left key takes priority over right
		if (keys.left) {
			currentDegrees -= rotation;
			updateNewCoordinatesWhenRotating(-rotation); // PLACED INSIDE KEY-EVENT, TO SAVE REDUNDANT CALCULATIONS
			emitLaserSight();
		} else if (keys.right) {
			currentDegrees += rotation;
			updateNewCoordinatesWhenRotating(rotation);
			emitLaserSight();
		}
	};

	var update = function(keys) {
		//=========== PROJECTILE LOGIC ============//
		controlProjectileLogic(keys)

		//================= LASER LOGIC ============//
		laserEvent(keys);
		
		//=========== TANK MOVEMENT LOGIC ============//
		if(currentDegrees == -rotation){
			currentDegrees = 360-rotation;
		}
		if(currentDegrees == 360){
			currentDegrees = 0;
		}
		movementEvent(keys);

	};

	var draw = function(ctx, canvas) {
		// lasersight
		if(enableLaser)
		laserSight.draw(ctx);

		// projectiles
		projectiles.forEach(function(projectile){
			projectile.draw(ctx);
		});
		// body
		//ctx.lineWidth = 4;
		ctx.shadowBlur = 15;
		ctx.shadowColor = "rgb(0, 0, 0)";
		ctx.fillStyle = "#002040";
		ctx.beginPath();
		ctx.moveTo(coordinates[0].x,coordinates[0].y);
		ctx.lineTo(coordinates[1].x,coordinates[1].y);
		ctx.lineTo(coordinates[2].x,coordinates[2].y);
		ctx.lineTo(coordinates[3].x,coordinates[3].y);
		ctx.closePath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fill();

		// mount
		ctx.lineWidth = 2;
		ctx.shadowBlur = 0;
		ctx.fillStyle = "#193653";
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

    // getters and setters
    var getX = function () {
        return Math.round(centerX);
    };

    var getY = function () {
        return Math.round(centerY);
    };

	return {
		update: update,
		draw: draw,
		getProjectiles: getProjectiles,
		getX: getX,
		getY: getY
	}
};