var FoodSystem = function() {
	this.ctx;		// Needed if food will be displayed on a seperate canvas
	this.variation = {	// Food concentration
		max : 5,
		min : 2
	};
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