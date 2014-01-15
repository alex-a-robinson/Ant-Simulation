/**
* @class Worker
* @extends Ant
* @classdesc Represents a single worker ant
*/
Worker.prototype = new Ant(-1, {x : void(0), y : void(0)});
Worker.prototype.constructor = Worker;
Worker.prototype.parent = Ant;

/**
* @constructor 
* @param {integer} id - The unique ant id
* @param {x : number, y : number} coord - The coordinate of the ant
*/
function Worker (id, coord) {
	/**
	* @property {integer} this.id - The unique ant id
	* @property {x : number, y : number} this.coord - The coordinate of the ant
	* @property {ANT_TYPE : integer} this.type - The type of ant i.e. Queen ant (default: ANT_TYPE.queen)
	* @property {number} this.direction - The direction in radians from the vertical axis clockwise (default: *random direction*)
	* @property {number} this.prioritizeDirection - The direction the ant will general move, used to get straighter more realistic paths (default: *random direction*)
	*/
	this.id = id;
	this.coord = coord;
	this.type = ANT_TYPE.worker;
	
	this.direction = randDir();
	this.prioritizeDirection = randDir();
};

/**
* Walk towards food until on top of it and then pick it up
*/
Worker.prototype.getFood = function() {
	this.direction = angleTo(this.coord, this.target);	// Point towards the food
	if (getCellIndex(this.coord) === coordToIndex(this.target)) {	// If on the food pick it up. As this.coord is a number, work out which cell the ant is mostly in using getCellIndex
		this.useFood();
		this.followOwnPheromone = false;
	}
};

/**
* Determines if an ant can carry food or not
* @return {boolean}
*/
Worker.prototype.canCarry = function() {
	if (this.carrying < this.carryingMax)
		return true;
	else
		return false;
};

/**
* Navigate towards the nest and deposit food at the nest
*/
Worker.prototype.depositeFood = function() {	
	if (this.atNest()) {	// Deposit food when at the nest
		if (this.dropFood(this.nest)) {
			this.goal = GOAL.findFood;
			this.target = void(0);
		}
	} else  if (this.seeNest()) {	// If can see the nest, head straight towards it
		this.direction = angleTo(this.coord, this.nest.coord);
	} else {
		if (Math.random() < this.species.chars.nestCoordMemory)  // Ant has a sense of the direction of the nest, so randomly it will pick the right direction depending on how strong the nestCoordMemeory is
			this.prioritizeDirection = angleTo(this.coord, this.nest.coord);
			
		this.wonder();	// If not cannot see the nest, walk around randomly
	}
};

/**
* Drop food at the nest
* @return {boolean} - True if there is no more food to drop off
*/
Worker.prototype.dropFood = function(nest) {
	if (this.carrying > 0) {
		nest.health += 1 * FOOD_HEALTH_RATIO;
		this.carrying -= 1;
		this.sleep += ANT_FOOD_DROP_SPEED;
	}
	if (this.carrying > 0)
		return false;
	else
		return true;
	
};

/**
* Determines the best use of food - Eating it or Carrying it
*/
Ant.prototype.useFood = function() {
	var index = getCellIndex(this.coord);
	var food = MAP[index].food;
	
	if (this.hungry && this.isFood(food))	// Eat the food (this.ifFood(food) needed to check the food still exists as another ant may have taken it)
		this.health += this.takeFood(food) * FOOD_HEALTH_RATIO;
	else if (this.canCarry() && this.isFood(food))	// Carry the food
		this.carrying += this.takeFood(food);
	else	// Food is not there/cannot be carried
		this.target = void(0);
};

/**
* Performs the actions required to complete a task
*/
Worker.prototype.doTask = function() {
	switch (this.goal) {
		case GOAL.findFood:
			this.wonder();
			this.findFoodTarget();
			break;

		case GOAL.getFood:
			this.getFood();
			break;

		case GOAL.dropFood:
			this.depositeFood();
			this.secrete();
			break;
	}
};

/**
* Choose the target piece of food the worker should go for
*/
Worker.prototype.findFoodTarget = function() {
	var leastEffort = 999999;		// Large number to guarantee a number will be less then this
	
	// Go through each peice of food and pick the piece which involves the least amount of effort to collect. Effort is determined by the distance to the peice of food by the amount of food which is in the piece
	for (var i = 0; i < this.itemsInView.food.length; i++) {
		var effort = calcEffort(this.coord, this.itemsInView.food[i].coord, this.itemsInView.food[i].amount);
		if (effort < leastEffort) {
			leastEffort = effort;
			this.target = this.itemsInView.food[i].coord;
		}
	}
};

/**
* Determines if a goal has been completed or not and updates the next goal for the ant
*/
Worker.prototype.updateGoal = function() {
	switch (this.goal) {
	
		case GOAL.none:
			this.goal = GOAL.findFood;
			break;
	
		case GOAL.findFood:
			if (this.target !== void(0))	// If found a target
				this.goal = GOAL.getFood;
			break;

		case GOAL.getFood:
			if (this.carrying >= this.carryingThreshold) {	// If have enough food, drop it off at the nest
				this.goal = GOAL.dropFood;
				this.target = void(0);
			} else if (this.target === void(0)) {	// If the food has been taken by another ant, go back to looking for food
				this.goal = GOAL.findFood;
			}
			
			break;
			
		case GOAL.dropFood:
			this.target = void(0);
			break;
	}
};

Worker.prototype.updateHealth = function() {	
	if (this.isHungry() && this.carrying > 0) {		// If have food and is hungry, eat the food
		this.health += this.carrying * FOOD_HEALTH_RATIO;
		this.carrying = 0;
		this.goal = GOAL.none;
	}

	this.health -= this.healthRate;
	
	if (this.health <= 0)
		this.die();
};

/**
* Update the ant each tick
*/
Worker.prototype.update = function() {
	this.removeFromMap();	// Remove from map as ant may move
	
	this.updateHealth();
	
	// May have died during the updateHealth so no need to continue if dead
	if (!this.alive)
		return void(0);
	
	this.scan();
	this.smell();

	this.doTask();
	this.updateGoal();
	
	// If performing an action which takes multiple ticks this.sleep will be > 0
	if (this.sleep > 0)	
		this.sleep -= 1;
	
	this.move();

	this.addToMap();	// Once moved add back to map
};