// An object which represents a single peice of food
var Food = function(foodSystem, amount, coord) {
	this.foodSystem = foodSystem;	// its parent system
	this.size = CELL_SIZE;		// The size of the food on the map in pixels
	this.amount = amount;		// The density of the food
	this.coord = coord;
	this.colour;
};

// Adds the peice of food to the map
Food.prototype.addToMap = function() {
	var index = coordToIndex(this.coord);
	MAP[index].food = this;
};

// Removes the peice of food from the map
Food.prototype.removeFromMap = function() {
	var index = coordToIndex(this.coord);	// Legle as only one peice of food per cell
	MAP[index].food = void(0);
};

// Draws the peice of food onto the canvas
Food.prototype.draw = function (ctx) {
	ctx.globalAlpha = this.amount/this.foodSystem.variation.max;
	drawRect(ctx, scaleCoord(this.coord), this.size, this.foodSystem.colour);
	ctx.globalAlpha = 1;
};