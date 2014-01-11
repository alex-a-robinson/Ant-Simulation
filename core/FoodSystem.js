var FOOD_CHANCE = 0.005;

// An Object which controls all food within the map
var FoodSystem = function() {
	// The variation in food amount
	this.variation = {
		max : 15,
		min : 1
	};
	this.colour = '#00FF00';
};

// Adds a random amount of food at a certin coordinate of a maximum radius
FoodSystem.prototype.addRandFood = function(coord, radius) {
	// Find all the cells in a circal of a particual radius around an origin coordinate
	var affectedCells =  getSector(coord, radius, 0, 2*Math.PI)	// get a circle
	
	// For each cell, calculate the amount it should have
	for (var i = 0; i < affectedCells.length; i++) {
		var distanceFromCenter = distance(coord, affectedCells[i]);
		var amount = radius - Math.round(distanceFromCenter);
		if (amount >= this.variation.min)
			MAP[coordToIndex(affectedCells[i])].food = new Food(this, amount, affectedCells[i]);
	}
};

// Adds a random amount of food at a certin coordinate of a maximum radius
FoodSystem.prototype.addFood = function(coord, radius) {
	// Find all the cells in a circal of a particual radius around an origin coordinate
	for (var i = 0; i < NUM_OF_CELLS; i++) {
		if (Math.random() < FOOD_CHANCE) {
			this.addRandFood(indexToCoord(i), 5);
		}
	}
};