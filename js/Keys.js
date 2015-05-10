/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function(up, left, right, down, space, laser) {
	var up = up || false,
		left = left || false,
		right = right || false,
		down = down || false,
		space = space || false,
		rotate = rotate || false,
		laser = laser || false;

		
	var onKeyDown = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			// Controls
			case 37: // Left
				that.left = true;
				break;
			case 38: // Up
				that.up = true;
				break;
			case 39: // Right
				that.right = true; // Will take priority over the left key
				break;
			case 40: // Down
				that.down = true;
				break;
			case 32: // SPACE - FIRE
				that.space = true;
				break;
			case 76: // l - key
				that.laser = true;
				break;
		};
	};

	var onKeyUp = function(e) {
		var that = this,
			c = e.keyCode;
			console.log(c);
		switch (c) {
			case 37: // Left
				that.left = false;
				break;
			case 38: // Up
				that.up = false;
				break;
			case 39: // Right
				that.right = false;
				break;
			case 40: // Down
				that.down = false;
				break;
			case 32: // SPACE - FIRE
				that.space = false;
				break;
			case 76: // l - key
				that.laser = false;
				break;
		};
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		space: space,
		laser: laser,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};