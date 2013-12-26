var Nest = function(id, coord) {
	// Spatial attributes
	this.nestSize = NEST_SIZE;	// The size of the ant <--- this is in {x, y} so can be scaled and size of ant can be given
	this.coord = coord;		// Coordinate of the ant
	
	// Identifiers
	this.id = id;		// The ants unique identifier
	this.species;		// The ants species
	
	this.pieces = [];
	
	// Computed attributes
	this.health = 30000;
	this.hungerThreshold = 500;		// hunger point bellow which ant starts eating food it finds/has on it
	this.healthRate = 1;				// The rate at which hunger decreases
	this.healthMax = 10000;
	this.hungry = false;
	this.alive = true;
};

Nest.prototype.isHungry = function() {
	if (this.health < this.hungerThreshold)
		this.hungry = true;
	else
		this.hungry = false;
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
	var index = antsList.indexOf(this);
	antsList.splice(index, 1);
	this.alive = false;
};

Nest.prototype.reproduce = function() {
	var prob = Math.random();
	switch (true) {
		case (prob < this.species.chars.reproduction.queen.prob):
			if (this.health >= this.species.chars.reproduction.queen.foodCost + 1000) {
				createAnt(this.species, {x : this.coord.x, y : this.coord.y}, this, 1000, ANT_TYPE.queen);
				this.health -= this.species.chars.reproduction.queen.foodCost + 1000;
			}
			break;
		case (prob < this.species.chars.reproduction.soldier.prob):
			if (this.health >= this.species.chars.reproduction.soldier.foodCost + 1000) {
				createAnt(this.species, {x : this.coord.x, y : this.coord.y}, this, 1000, ANT_TYPE.soldier);
				this.health -= this.species.chars.reproduction.soldier.foodCost + 1000;
			}
			break;
		case (prob < this.species.chars.reproduction.worker.prob):
			if (this.health >= this.species.chars.reproduction.worker.foodCost + 1000) {
				createAnt(this.species, {x : this.coord.x, y : this.coord.y}, this, 1000, ANT_TYPE.worker);
				
				this.health -= this.species.chars.reproduction.worker.foodCost + 1000;
			}
			break;
		default:
			// No ants where created
			break;
	}	
};

Nest.prototype.update = function() {
	for (var i = 0; i < this.pieces.length; i++)
		this.pieces[i].removeFromMap();
		
	this.isHungry();
	this.health -= this.healthRate;
	
	if (this.health <= 0) {
		this.die();
		return void(0);	// die
	}
		
	if (Math.random() < 0.01) {
		this.reproduce();
	}
	
	for (var i = 0; i < this.pieces.length; i++)
		this.pieces[i].addToMap();
};