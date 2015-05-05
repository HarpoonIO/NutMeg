/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
/*	var x = startX,
		y = startY;*/
	var	moveForwardAmount = 8;
	var moveBackwardsAmount = 4;
	var	direction = 'up';
	var	projectiles = [];

/*	var width = 200;
	var height = 140;

	var cx = x + 0.5 *width;
	var cy = y + 0.5 *height;

	var deg = 0;*/
	var deg = 0;
	var x      = 200;
	var y      = 100;
	var width  = 100;
	var height = 150;
	var cx     = x + 0.5 * width;   // x of shape center
	var cy     = y + 0.5 * height;  // y of shape center

	var pX,
		pY;

	var update = function(keys, ctx) {
		deg = 0;
		cx = x + 0.5 * width;
		cy = y + 0.5 * height;
		ctx.translate(cx, cy);              //translate to center of shape
		// Up key takes priority over down
		if (keys.up) {

		//	ctx.clearRect(x,y, canvas.width,canvas.height);
			y -= moveForwardAmount;
			direction = 'up';

		} else if (keys.down) {

		//	ctx.clearRect(x,y, canvas.width,canvas.height);
			y += moveBackwardsAmount;
			direction = 'down';
		};

		// Left key takes priority over right
		if (keys.left) {
			deg = -4;
			ctx.rotate( (Math.PI / 180) * deg);  //rotate 'deg' degrees.
			direction = 'left';
		//	ctx.clearRect(x,y, canvas.width,canvas.height);

		} else if (keys.right) {
			deg = 4;
			direction = 'right';
			ctx.rotate( (Math.PI / 180) * deg);  //rotate 'deg' degrees.
		//	ctx.clearRect(x,y, canvas.width,canvas.height);


		}
		ctx.translate(-cx, -cy);              //translate to center of shape

		if (keys.space){
			var newProjectile = new Projectile(pX, pY, direction);
			projectiles.push(newProjectile);
		}

		// Rotation logic
		if (keys.rotate){
			deg += 0.1;
		}



	};

	var draw = function(ctx, canvas) {

		switch (direction) {
			// Controls
			case 'up': // up
				pX = x-4;
				pY = y-24;
				break;
			case 'down': // down
				pX = x-4;
				pY = y+24;
				break;
			case 'right': // Right

				pX = x + 24;
				pY = y-4;
				break;
			case 'left': // left

				pX = x - 24;
				pY = y-4;
				break;
		};


		/*
		ctx.save();

		ctx.restore();*/
		//ctx.shadowBlur = 15;
		//ctx.shadowColor = "rgb(0, 0, 0)";
		ctx.fillStyle = "#000000";
		ctx.clearRect(x-20, y-20, canvas.width, canvas.height);
		ctx.fillRect(x-5, y-5, width+10, height+10);
		ctx.fillStyle = "#5F5F5F";
		ctx.fillRect(x, y, width, height);
		ctx.fillStyle = "#808080";
		ctx.fillRect(cx-8, y-10, 16, (height/2)+20);

		ctx.beginPath();
		ctx.arc(cx,cy,10,0,2*Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(cx,cy,40,0,2*Math.PI);
		ctx.stroke();

		ctx.fillRect(cx,cy, 2, 2000);
		ctx.fillRect(cx,cy, 2000, 2);

		ctx.fillRect(0,0, 2, 2000);
		ctx.fillRect(0,0, 2000, 2);


		projectiles.forEach(function(projectile){
			console.log('hello');
			projectile.draw(ctx);
		});

	};



	return {
		update: update,
		draw: draw
	}
};