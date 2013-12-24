Queen.prototype = new Ant(-1, {x : void(0), y : void(0)});
Queen.prototype.constructor = Queen;
Queen.prototype.parent = Ant;

function Queen(id, coord) {
	// Spatial attributes
	this.coord = coord;		// Coordinate of the ant
	this.steps;				// Number of steps to take until nest site reached
	
	// Identifiers
	this.id = id;			// The ants unique identifier	
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
	this.steps = randInt(QUEEN_STEPS);
};

Queen.prototype.createNest = function() {
	var nest = new Nest(genID(), this.coord);
	nest.species = this.species;
	nest.createNest();
	antsList.push(nest);
};

Queen.prototype.update = function() {
	this.removeFromMap();
	
	this.doTask();
	this.updateGoal();
	
	this.move();
	
	this.addToMap();
};