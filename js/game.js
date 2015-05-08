/**************************************************
 ** GAME VARIABLES
 **************************************************/
var canvas,			// Canvas DOM element
    ctx,			// Canvas rendering context
    keys,			// Keyboard input
    localPlayGround;    // Local playground


/**************************************************
 ** GAME INITIALISATION
 **************************************************/
function init() {
    // Declare the canvas and rendering context
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    // Maximise the canvas
    //canvas.width = window.innerWidth * 0.9;
    //canvas.height = window.innerHeight;

    canvas.width = 500;
    canvas.height = 500;

    // Initialise keyboard controls
    keys = new Keys();

    // Calculate a random start position for the local player
    // The minus 5 (half a player size) stops the player being
    // placed right on the egde of the screen
    //var startX = Math.round(Math.random()*(canvas.width-5)),
    //	startY = Math.round(Math.random()*(canvas.height-5));

    var startX = Math.round(Math.random() * (canvas.width - 5)),
        startY = Math.round(Math.random() * (canvas.height - 5));

    console.log("Start coordinates: " + startX + ", " + startY);

    localPlayGround = new Playground(canvas.width, canvas.height, startX, startY);

    // Start listening for events
    setEventHandlers();
};


/**************************************************
 ** GAME EVENT HANDLERS
 **************************************************/
var setEventHandlers = function () {
    // Keyboard
    window.addEventListener("keydown", onKeydown, false);
    window.addEventListener("keyup", onKeyup, false);

    // Window resize
    window.addEventListener("resize", onResize, false);
};

// Keyboard key down
function onKeydown(e) {
    if (localPlayGround) {
        keys.onKeyDown(e);
    }
    ;
};

// Keyboard key up
function onKeyup(e) {
    if (localPlayGround) {
        keys.onKeyUp(e);
    }
    ;
};

// Browser window resize
function onResize(e) {
    // Maximise the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};


/**************************************************
 ** GAME ANIMATION LOOP
 **************************************************/
function animate() {
    update();
    draw();

    // Request a new animation frame using Paul Irish's shim
    window.requestAnimFrame(animate);
};


/**************************************************
 ** GAME UPDATE
 **************************************************/
function update() {
    localPlayGround.update(keys);
};


/**************************************************
 ** GAME DRAW
 **************************************************/
function draw() {
    // Wipe the canvas clean
//	ctx.save();
//	ctx.translate(0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
//	ctx.restore();
    localPlayGround.draw(ctx);
};