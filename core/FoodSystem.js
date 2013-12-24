var FoodSystem = function() {
	this.variation = {	// Food concentration
		max : 15,
		min : 1
	};
	this.colour = '#00FF00';
};

FoodSystem.prototype.addRandFood = function(coord, radius) {
	//var affectedCells = getBlock(coord, radius);
	var affectedCells =  getSector(coord, radius, 0, 2*Math.PI)	// get a circle
	for (var i = 0; i < affectedCells.length; i++) {
		var distanceFromCenter = distance(coord, affectedCells[i]);
		var height = radius - Math.round(distanceFromCenter);
		if (height >= this.variation.min)
			MAP[coordToIndex(affectedCells[i])].food = new Food(this, height, affectedCells[i]);
	}
};