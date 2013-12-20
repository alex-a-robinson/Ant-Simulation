var Nest = function(id, coord) {
	// Spatial attributes
	this.size = NEST_SIZE;	// The size of the ant <--- this is in {x, y} so can be scaled and size of ant can be given
	this.coord = coord;		// Coordinate of the ant
	
	// Identifiers
	this.id = id;		// The ants unique identifier
	this.species;		// The ants species
	
	this.pieces = [];
	
	// Computed attributes
	this.hunger = 10;		// Lower means ant needs to eat more quickly
	this.hungerThreshold = 3;// hunger point bellow which ant starts eating food it finds/has on it
	this.hungerRate;	// The rate at which hunger decreases
	this.hungerMax = 20;

	this.carrying = 0;		// The amount of food an ant is carrying
	this.carryingMax = 5;	// The maximum amount of food an ant can carry
	
};

Nest.prototype.reproduce = function() {
	var prob = Math.random();
	switch (true) {
		case (prob < this.species.reproduction.queen.prob):
			if (this.carrying >= this.species.reproduction.queen.cost) {
				createAnt(this.species, this.coord);
				this.carrying -= this.species.reproduction.queen.cost;
			}
			break;
		case (prob < this.species.reproduction.soldier.prob):
			if (this.carrying >= this.species.reproduction.soldier.cost) {
				createAnt(this.species, this.coord);
				this.carrying -= this.species.reproduction.soldier.cost;
			}
			break;
		case (prob < this.species.reproduction.worker.prob):
			if (this.carrying >= this.species.reproduction.worker.cost) {
				createAnt(this.species, this.coord);
				this.carrying -= this.species.reproduction.worker.cost;
			}
			break;
		default:
			// No ants where created
			break;
	}
};

Nest.prototype.addNestPiece = function(coord) {
	var nestPiece = new NestPiece(genID(), coord, this);
	this.pieces.push(nestPiece);
	nestPiece.addToMap();
};


Nest.prototype.update = function() {
	for (var i = 0; i < this.pieces.length; i++)
		this.pieces[i].removeFromMap();

	//if (Math.random() > 0.8)
	//	this.reproduce();
	
	for (var i = 0; i < this.pieces.length; i++)
		this.pieces[i].addToMap();
};