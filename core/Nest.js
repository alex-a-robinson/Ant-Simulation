/**
* @class Nest
* @classdesc Represents the ant nest entity
* @property {integer} id - A unique identifier
* @property {x : number, y : number} coord - The coordinate of the piece
*/
var Nest = function(id, coord) {
	/**
	* @property {x : integer, y : integer} this.nestSize - The number of pieces the nest extends both in the x and y directions
	* @property {x : number, y : number} this.coord - The coordinate of the nest
	* @property {integer} this.id - A unique identifier
	* @property {Species object} this.species - The species which the nest belongs to
	* @property {[NestPiece object]} this.pieces - An array of the NestPiece objects belonging to the nest
	* @property {number} this.health - The health the nest has
	* @property {number} this.hungerThreshold - The threshold below which the nest is hungry and tries to preserve food
	* @property {number} this.healthRate - The rate at which the nests health reduces each tick
	* @property {boolean} this.hungry - If hungry ant tries to preserve food
	* @property {boolean} this.alive - If the ant is alive or not, needed if ant dies mid execution so does not keep acting as if it is alive
	*/
	
	this.nestSize = NEST_SIZE;
	this.coord = coord;
	
	this.id = id;
	this.species;
	
	this.pieces = [];
	
	this.health = 3000;
	this.hungerThreshold = 500;
	this.healthRate = 0.1;
	this.hungry = false;
	this.alive = true;
};

/**
* Creates all the nest pieces
*/
Nest.prototype.createNest = function() {
	var block = getBlock(this.coord, this.nestSize);	// Get block around
	for (var i = 0; i < block.length; i++)
		this.addNestPiece(block[i]);	
};

Nest.prototype.addNestPiece = function(coord) {
	var nestPiece = new NestPiece(genID(), coord, this);
	this.pieces.push(nestPiece);
	nestPiece.addToMap();
};

Nest.prototype.die = function() {
	var index = ANTS_LIST.indexOf(this);
	ANTS_LIST.splice(index, 1);
	this.alive = false;
};

Nest.prototype.reproduce = function() {
	var prob = Math.random();
	
	var reproduction = this.species.chars.reproduction;
	
	// normalise the probabilities
	var sum = reproduction.queen.prob + reproduction.soldier.prob + reproduction.worker.prob;
	var queenProb = reproduction.queen.prob / sum;
	var soldierProb = reproduction.soldier.prob / sum;
	var workerProb = reproduction.worker.prob / sum;
	
	var ordered = [{prob : queenProb, type : ANT_TYPE.queen}, {prob : soldierProb, type : ANT_TYPE.soldier}, {prob : workerProb, type : ANT_TYPE.worker}].sort(function(a,b){return a.prob - b.prob});
		
	switch (true) {
		case (prob < ordered[0].prob):
			var cost = this.getCost(ordered[0].type);
			if (this.health - cost >= this.hungerThreshold) {
				createAnt(this.species, {x : this.coord.x, y : this.coord.y}, this, cost, ordered[0].type);
				this.health -= cost;
			}
			break;
		case (prob < ordered[1].prob + ordered[0].prob):
			var cost = this.getCost(ordered[1].type);
			if (this.health - cost >= this.hungerThreshold) {
				createAnt(this.species, {x : this.coord.x, y : this.coord.y}, this, cost, ordered[1].type);
				this.health -= cost;
			}
			break;
		case (prob < ordered[2].prob + ordered[1].prob + ordered[0].prob):
			var cost = this.getCost(ordered[2].type);
			if (this.health - cost >= this.hungerThreshold) {
				createAnt(this.species, {x : this.coord.x, y : this.coord.y}, this, cost, ordered[2].type);
				this.health -= cost;
			}
			break;
		default:
			// No ants where created
			break;
	}	
};

Nest.prototype.getCost = function(antType) {
	switch (antType) {
		case ANT_TYPE.worker:
			return this.species.chars.reproduction.worker.foodCost * FOOD_HEALTH_RATIO;
		case ANT_TYPE.queen:
			return this.species.chars.reproduction.queen.foodCost * FOOD_HEALTH_RATIO;
		case ANT_TYPE.soldier:
			return this.species.chars.reproduction.soldier.foodCost * FOOD_HEALTH_RATIO;
	}
};

Nest.prototype.updateHealth = function() {
	this.health -= this.healthRate;
	
	if (this.health <= 0)
		this.die();
};

Nest.prototype.update = function() {
	for (var i = 0; i < this.pieces.length; i++)
		this.pieces[i].removeFromMap();
		
	this.updateHealth();
	
	if (!this.alive)
		return void(0);
		
	if (Math.random() < this.species.chars.reproduction.rate) {
		this.reproduce();
	}
	
	for (var i = 0; i < this.pieces.length; i++)
		this.pieces[i].addToMap();
};