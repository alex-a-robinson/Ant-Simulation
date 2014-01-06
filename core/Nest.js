var Nest = function(id, coord) {
	// Spatial attributes
	this.nestSize = NEST_SIZE;	// The size of the ant <--- this is in {x, y} so can be scaled and size of ant can be given
	this.coord = coord;		// Coordinate of the ant
	
	// Identifiers
	this.id = id;		// The ants unique identifier
	this.species;		// The ants species
	
	this.pieces = [];
	
	// Computed attributes
	this.health = 3000;
	this.hungerThreshold = 500;		// hunger point bellow which ant starts eating food it finds/has on it
	this.healthRate = 0.1;				// The rate at which hunger decreases
	this.healthMax = 10000;
	this.hungry = false;
	this.alive = true;
};

Nest.prototype.isHungry = function() {
	if (this.health < this.hungerThreshold)
		return true;
	else
		return false;
};

Nest.prototype.createNest = function() {
	var block = getBlock(this.coord, this.nestSize);
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