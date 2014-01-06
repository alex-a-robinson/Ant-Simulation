Queen.prototype = new Ant(-1, {x : void(0), y : void(0)});
Queen.prototype.constructor = Queen;
Queen.prototype.parent = Ant;

function Queen(id, coord) {
	// Spatial attributes
	this.coord = coord;		// Coordinate of the ant
	this.steps;				// Number of steps to take until nest site reached
	
	// Identifiers
	this.id = id;			// The ants unique identifier
	this.goal = GOAL.none;
	this.type = ANT_TYPE.queen;
};

Queen.prototype.doTask = function() {
	switch (this.goal) {
		case GOAL.pickDirection:
			this.pickDirection();
			break;
			
		case GOAL.gotoNestSite:
			this.steps -= 1;
			break;

		case GOAL.createNest:
			this.createNest();
			this.die();
			break;
	}
};

Queen.prototype.updateGoal = function() {
	switch (this.goal) {
		case GOAL.none:
			this.goal = GOAL.pickDirection;
			break;
	
		case GOAL.pickDirection:
			this.goal = GOAL.gotoNestSite;
			break
		
		case GOAL.gotoNestSite:
			if (this.steps <= 0)
				this.goal = GOAL.createNest;
			break;
		
		case GOAL.createNest:
			// Ant should be dead by this point
			break;
	}
};

Queen.prototype.pickDirection = function() {
	this.direction = randDir();
	this.steps = randInt(this.species.chars.queenSteps);
};

Queen.prototype.createNest = function() {
	var nest = new Nest(genID(), this.coord);
	nest.species = this.species.mutate();
	nest.colour = nest.species.colour.nest;
	nest.createNest();
	nest.species.nests.push(nest);
	ANTS_LIST.push(nest);
};

Queen.prototype.update = function() {
	this.removeFromMap();
	
	this.doTask();
	this.updateGoal();
	
	this.move();
	
	this.addToMap();
};