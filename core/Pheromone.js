var Pheromone = function(concentration, coord) {
	this.concentration = concentration;
	this.coord = coord;
	this.size = CELL_SIZE;
	this.species;
	this.antID = [];	// Ant ID's of ants which created the pheromone
};

Pheromone.prototype.addToMap = function() {
	MAP[coordToIndex(this.coord)].pheromone.push(this);
};

Pheromone.prototype.removeFromMap = function() {
	var index = MAP[coordToIndex(this.coord)].pheromone.indexOf(this);
	MAP[coordToIndex(this.coord)].pheromone.splice(index, 1);
};

Pheromone.prototype.draw = function(ctx) {
	if (this.concentration > 0) {	// If pheromone exists
		ctx.globalAlpha = this.concentration;
		drawRect(ctx, scaleCoord(this.coord), this.size, this.species.colour.pheromone);
		ctx.globalAlpha = 1;	// Reset alpha
	}
};

Pheromone.prototype.update = function() {

	this.concentration -= PHEROMONE_EVAPERATION_RATE;
	
	if (this.concentration <= 0)
		this.removeFromMap();    // Otherwise, Need to delete object although JavaScript garbage collection may get it
};