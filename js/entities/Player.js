/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var	direction = 'up';
	var	projectiles = [];

	var ratio = 0.8;

	var speed = 8;
	var rotation = 4; // 4
	var currentDegrees = 0;
	var centerX      = 200;
	var centerY      = 250;
	var width  = 150 * ratio;
	var height = 100 * ratio;

	var pipeWidth = 175 * ratio;
	var pipeHeight = 25 * ratio;

	var iterationsLeftToShoot = 0;
	var projectilesCap = 100;


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
	var coords =
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
		coords.forEach(function(coord){
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
		coords.forEach(function(coord){
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
			var newProjectile = new Projectile(centerX, centerY, currentDegrees);
			iterationsLeftToShoot = 25;
			newProjectile.setRadius(newProjectile.getRadius() * ratio);
			newProjectile.forwardPush(85*ratio);
			projectiles.push(newProjectile);
			console.log("Shot a projectile at: " + currentDegrees + "°");
		}

		// Removes burnt out projectiles
		for(var i = 0; i < projectiles.length; i++){
			projectiles[i].setLifeAmount(projectiles[i].getLifeAmount()-1);
			if(projectiles[i].getLifeAmount() == 0){
				projectiles.splice(i, 1);
			}
		}
	};

	var update = function(keys) {
		controlProjectileLogic(keys);

		//=========== TANK MOVEMENT LOGIC ============//
		if(currentDegrees == -rotation){
			currentDegrees = 360-rotation;
		}
		if(currentDegrees == 360){
			currentDegrees = 0;
		}

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
		} else if (keys.right) {
			currentDegrees += rotation;
			updateNewCoordinatesWhenRotating(rotation);
		}
	};

	var draw = function(ctx, canvas) {
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
		ctx.moveTo(coords[0].x,coords[0].y);
		ctx.lineTo(coords[1].x,coords[1].y);
		ctx.lineTo(coords[2].x,coords[2].y);
		ctx.lineTo(coords[3].x,coords[3].y);
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
		ctx.moveTo(coords[4].x,coords[4].y);
		ctx.lineTo(coords[5].x,coords[5].y);
		ctx.lineTo(coords[6].x,coords[6].y);
		ctx.lineTo(coords[7].x,coords[7].y);
		ctx.closePath();
		ctx.fill();

	};



	return {
		update: update,
		draw: draw,
		getProjectiles: getProjectiles
	}
};