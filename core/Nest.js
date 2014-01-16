/**
* @class Nest
* @classdesc Represents the ant nest entity
* @param {integer} id - A unique identifier
* @param {x : number, y : number} coord - The coordinate of the piece
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
	this.healthRate = 0.5;
	this.hungry = false;
	this.alive = true;
};

/**
* Create a single nest piece
*/
Nest.prototype.addNestPiece = function(coord) {
	var nestPiece = new NestPiece(genID(), coord, this);
	this.pieces.push(nestPiece);
	nestPiece.addToMap();
};

/**
* Creates all the nest pieces
*/
Nest.prototype.createNest = function() {
	var block = getBlock(this.coord, this.nestSize);	// Get block around
	for (var i = 0; i < block.length; i++)
		this.addNestPiece(block[i]);	
};

/**
* Kills a this ant by removing it from the ants list, it will therefore not be updated and JavaScripts garbage collection should delete the object
*/
Nest.prototype.die = function() {
	console.log('Nest died')
	// Remove from ants list
	var index = ANTS_LIST.indexOf(this);
	ANTS_LIST.splice(index, 1);
	
	// Remove from species nests list
	index = this.species.nests.indexOf(this);
	this.species.nests.splice(index, 1);
	
	
	for (var i = 0; i < this.pieces.length; i++) {
		this.pieces[i].removeFromMap();
	}
	
	this.alive = false;
};

/**
* Returns the cost in the amount of health needed to create a specific type of ant
* @param {ANT_TYPE} type - Represents a specific type of ant
* @return {integer} - The health required
*/
Nest.prototype.getCost = function(type) {
	switch (type) {
		case ANT_TYPE.worker:
			return this.species.chars.reproduction.worker.foodCost * FOOD_HEALTH_RATIO;
		case ANT_TYPE.queen:
			return this.species.chars.reproduction.queen.foodCost * FOOD_HEALTH_RATIO;
		case ANT_TYPE.soldier:
			return this.species.chars.reproduction.soldier.foodCost * FOOD_HEALTH_RATIO;
	}
};

/**
* Determines whether or not it is viable to create a specific type of ant
* @param {ANT_TYPE} type - Represents a specific type of ant
* @return {boolean}
*/
Nest.prototype.viable = function(type) {
	if (this.health - this.getCost(type) >= this.hungerThreshold)	// If creating the ant will make the nest hungry then do not create the ant
		return true;
	else
		return false;
};

/**
* Creates a new ant
* @param {ANT_TYPE} type - Represents a specific type of ant
* @param {number} cost - Specifies how much health the ant requires to be created
*/
Nest.prototype.createAnt = function(type) {
	var cost = this.getCost(type);
	createAnt(this.species, {x : this.coord.x, y : this.coord.y}, this, cost, type);
	this.health -= cost;
};

/**
* Determines what type of ant to create
*/
Nest.prototype.reproduce = function() {
	var prob = Math.random();
	
	var reproduction = this.species.chars.reproduction;
	
	// Normalize probabilities and then sort into ascending order
	var sum = reproduction.queen.prob + reproduction.soldier.prob + reproduction.worker.prob;
	var queenProb = reproduction.queen.prob / sum;
	var soldierProb = reproduction.soldier.prob / sum;
	var workerProb = reproduction.worker.prob / sum;
	
	var ordered = [{prob : queenProb, type : ANT_TYPE.queen}, {prob : soldierProb, type : ANT_TYPE.soldier}, {prob : workerProb, type : ANT_TYPE.worker}].sort(function(a,b){return a.prob - b.prob});
		
	// Determine which outcome occurred
	switch (true) {
		case (prob < ordered[0].prob):
			if (this.viable(ordered[0].type))
				this.createAnt(ordered[0].type);
			break;
		case (prob < ordered[1].prob + ordered[0].prob):	// cumulative probability
			if (this.viable(ordered[1].type))
				this.createAnt(ordered[1].type);
			break;
		case (prob < ordered[2].prob + ordered[1].prob + ordered[0].prob):
			if (this.viable(ordered[2].type))
				this.createAnt(ordered[2].type);
			break;
	}	
};

Nest.prototype.updateHealth = function() {
	this.health -= this.healthRate;
	
	if (this.health <= 0)
		this.die();
};

/**
* Updates the ant each tick
*/
Nest.prototype.update = function() {
	this.updateHealth();
	
	if (!this.alive)
		return void(0);
	
	// Determines if a new ant should be created or not
	if (Math.random() < this.species.chars.reproduction.rate) {
		this.reproduce();
	}
};