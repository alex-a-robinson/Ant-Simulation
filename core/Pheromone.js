/**
* @class Pheromone
* @classdesc Represents a single pheromone
* @param {float} concentration - The concentration of the pheromone
* @param {x : number, y : number} coord - The coordinate of the pheromone
*/
var Pheromone = function(concentration, coord) {
	/**
	 * @property {float} this.concentration - The concentration of the pheromone
	 * @property {x : number, y : number} this.coord - The coordinate of the pheromone
	 * @property {{width : {number}, height : {number}} this.size - The size the pheromone will be in pixels
	 * @property {Species object} this.species - The species which the pheromone belongs to
	 */
	this.concentration = concentration;
	this.coord = coord;
	this.size = CELL_SIZE;
	this.species;
};

/**
* Adds the pheromone to the map
*/
Pheromone.prototype.addToMap = function() {
	MAP[coordToIndex(this.coord)].pheromone.push(this);
};

/**
* Removes the pheromone from the map
*/
Pheromone.prototype.removeFromMap = function() {
	var index = MAP[coordToIndex(this.coord)].pheromone.indexOf(this);
	MAP[coordToIndex(this.coord)].pheromone.splice(index, 1);
};

/**
* Draws the pheromone onto the canvas context
* @param {canvas context 2d} ctx - The context which the pheromone will be drawn onto
*/
Pheromone.prototype.draw = function(ctx) {
	if (this.concentration > 0) {	// If pheromone exists
		ctx.globalAlpha = this.concentration;	// alter opacity depending on pheromone concentration
		drawRect(ctx, scaleCoord(this.coord), this.size, this.species.colour.pheromone);
		ctx.globalAlpha = 1;	// Reset opacity
	}
};

/**
* Update the pheromones concentration each tick
*/
Pheromone.prototype.update = function() {

	this.concentration -= PHEROMONE_EVAPERATION_RATE;	
	
	// Remove pheromone if no concentration
	if (this.concentration <= 0)
		this.removeFromMap();
};