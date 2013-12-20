/**
* Functions responsible for creating/placing food and having it regrow
*/

var FoodSystem = function(amount) {
	this.ctx;		// Needed if food will be displayed on a seperate canvas
	this.amount = amount;
	this.variation = {	// Food concentration
		max : 5,
		min : 2
	};
	this.colours = ['#FFFFFF', '#004F00', '#006F00', '#008F00', '#00AF00', '#00DF00', '#00FF00']; // index is food concentration, value is the colour of that food concentration
	
	
};

FoodSystem.prototype.addFood = function() {
	for (var i = 0; i < this.amount; i++) {
		var index = randInt(0, NUM_OF_CELLS - 1);	// As inclusive
			MAP[index].food = new Food(randInt(this.variation.min, this.variation.max), indexToCoord(index));	
	}
};

FoodSystem.prototype.addRandFood = function(coord, radius) {
	var affectedCells = getBlock(coord, radius);
	for (var i = 0; i < affectedCells.length; i++) {
		var distanceFromCenter = calcDist(coord, affectedCells[i]);
		var height = radius - distanceFromCenter;
		if (height >= this.variation.min)
			MAP[coordToIndex(affectedCells[i])].food = new Food(height, affectedCells[i]);
	}
};