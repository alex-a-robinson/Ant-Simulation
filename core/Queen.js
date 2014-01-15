/**
* @class Queen
* @extends Ant
* @classdesc Represents a single queen ant
*/
Queen.prototype = new Ant(-1, {x : void(0), y : void(0)});
Queen.prototype.constructor = Queen;
Queen.prototype.parent = Ant;

/**
* @constructor 
* @param {integer} id - The unqiue ant id
* @param {x : number, y : number} coord - The coordinate of the ant
*/
function Queen(id, coord) {
	/**
	 * @property {x : number, y : number} this.coord - The coordinate of the ant
	 * @property {integer} this.steps - The number of steps the Queen will take until reaching the nest site
	 * @property {integer} this.id - The unqiue ant id
	 * @property {GOAL : integer} this.goal - The current goal the ant is trying to accomplish (default: GOAL.none)
	 * @property {ANT_TYPE : integer} this.type - The type of ant i.e. Queen ant (defualt: ANT_TYPE.queen)
	 */
	this.coord = coord;
	this.steps;
	
	this.id = id;
	this.type = ANT_TYPE.queen;
};

/**
* Decide what actions need to be done to accomplish a task
*/
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

/**
* Checks to see if the goal is accomplished and updates it if nessocery
*/
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

/**
* Used to pick a direction in which the Queen will walk a specific number of steps in (this.steps) and then create a nest
*/
Queen.prototype.pickDirection = function() {
	this.direction = randDir();
	this.steps = randInt(this.species.chars.queenSteps);
};

Queen.prototype.createNest = function() {
	var nest = new Nest(genID(), this.coord);
	nest.species = this.species;
	nest.colour = nest.species.colour.nest;
	nest.createNest();
	
	nest.species.nests.push(nest);
	ANTS_LIST.push(nest);
};

/**
* Update the Queen each tick
*/
Queen.prototype.update = function() {
	this.removeFromMap();	// As Queen may move, remove from the map
	
	this.doTask();
	this.updateGoal();
	
	this.move();
	
	this.addToMap();	// Add the Queen back to the map once it has moved
};