Worker.prototype = new Ant(-1, {x : void(0), y : void(0)});
Worker.prototype.constructor = Worker;
Worker.prototype.parent = Ant;

function Worker (id, coord) {
	this.id = id;
	this.coord = coord;
	this.type = ANT_TYPE.worker;
	
	this.direction = randDir();
	this.prioritizeDirection = randDir();
};

// Moves ant towards food and then uses it
Worker.prototype.getFood = function() {
	this.direction = angleTo(this.coord, this.target);	// Go to food
	if (getCellIndex(this.coord) === coordToIndex(this.target)) {	// If on the food pick it up
		this.useFood();
		this.followOwnPheromone = false;
	}
};

Worker.prototype.canCarry = function() {
	if (this.carrying < this.carryingMax)
		return true;
	else
		return false;
};

Worker.prototype.depositeFood = function() {	

	if (this.atNest()) {
		if (this.dropFood(this.nest)) {
			this.goal = GOAL.findFood;
			this.target = void(0);
		}
	} else  if (this.seeNest()) {
		this.direction = angleTo(this.coord, this.nest.coord);
	} else {
		if (Math.random() < this.species.chars.nestCoordMemory)  // sense of direction of nest
			this.prioritizeDirection = angleTo(this.coord, this.nest.coord);
			
		this.wonder();
	}
};

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

Ant.prototype.useFood = function() {
	var index = getCellIndex(this.coord);
	var food = MAP[index].food;
	
	if (this.hungry && this.isFood(food))
		this.health += this.takeFood(food) * FOOD_HEALTH_RATIO;
	else if (this.canCarry() && this.isFood(food))
		this.carrying += this.takeFood(food);
	else
		this.target = void(0);		// Assuming the food is the target should really be this.GOAL is not this.getFood
};

// Performs the current task
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

// Chooses which target to go for
Worker.prototype.findFoodTarget = function() {
	var leastEffort = 100000;		// <-- Large number to guarantee a number will be less then this
	for (var i = 0; i < this.itemsInView.food.length; i++) {
		var effort = calcEffort(this.coord, this.itemsInView.food[i].coord, this.itemsInView.food[i].amount);
		if (effort < leastEffort) {
			leastEffort = effort;
			this.target = this.itemsInView.food[i].coord;
		}
	}
};

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
			if (this.carrying >= this.carryingThreshold) {	// If have enough food
				this.goal = GOAL.dropFood;
				this.target = void(0);
			} else if (this.target === void(0)) {	// If have no target and still need food
				this.goal = GOAL.findFood;
			}
			
			break;
			
		case GOAL.dropFood:
			this.target = void(0);
			break;
		default:
			console.log('Error: updateGoal(): Invalid goal: ' + this.goal);
	}
};

Worker.prototype.updateHealth = function() {	
	// Eat food carrying if hungry
	if (this.isHungry() && this.carrying > 0) {
		this.health += this.carrying * FOOD_HEALTH_RATIO;
		this.carrying = 0;
		this.goal = GOAL.none;
	}

	this.health -= this.healthRate;
	
	if (this.health <= 0)
		this.die();
};

Worker.prototype.update = function() {
	this.removeFromMap();
	
	this.updateHealth();
	
	// May have died during the updateHealth so no need to continue if dead
	if (!this.alive)
		return void(0);
	
	this.scan();
	this.smell();

	this.doTask();
	this.updateGoal();
	
	if (this.sleep > 0)		// When sleep timer triggered don't move
		this.sleep -= 1;
	
	this.move();

	this.addToMap();
};