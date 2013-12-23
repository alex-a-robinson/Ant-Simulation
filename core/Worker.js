Worker.prototype = new Ant(-1, {x : void(0), y : void(0)});
Worker.prototype.constructor = Worker;
Worker.prototype.parent = Ant;


function Worker(id, coord) {
	this.id = id;
	this.coord = coord;
	this.type = ANT_TYPE.worker;
	
	this.prioritizeDirection = randDir();
	this.followingPheromone = false;
};

// Moves ant towards food and then uses it
Worker.prototype.getFood = function() {
	this.direction = angleTo(this.coord, this.target);	// Go to food
	if (getCell(this.coord) === coordToIndex(this.target)) {	// If on the food pick it up
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
	//this.direction = angleTo(this.coord, this.nest.coord);
	
	if (this.seeNest()) {
		this.direction = angleTo(this.coord, this.nest.coord);
	} else {
		if (Math.random() < NEST_COORD_MEMORY)  // sense of direction of nest
			this.prioritizeDirection = angleTo(this.coord, this.nest.coord);
			
		this.wonder();
	}
	
	if (this.atNest()) {
		this.dropFood(this.nest);
		this.goal = GOAL.findFood;
		this.target = void(0);
	}
};

Worker.prototype.dropFood = function(nest) {
	nest.health += this.carrying * FOOD_HEALTH_RATIO;
	this.carrying = 0;
	
};

Ant.prototype.useFood = function() {
	var index = getCell(this.coord);
	var food = MAP[index].food;
	
	if (this.hungry && this.isFood(food))
		this.health += this.takeFood(food) * FOOD_HEALTH_RATIO;
	else if (this.canCarry() && this.isFood(food))
		this.carrying += this.takeFood(food);
	else
		this.target = void(0);		// Assuming the food is the target should really be this.GOAL is not this.getFood
};

// Shuffle algoritm 
// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
Worker.prototype.shuffle = function(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

Worker.prototype.wonder = function() {

	var M = 0;
	var Mxy = {x  : 0, y : 0};
	var CoM =  {x  : 0, y : 0};
	
	var best = 0;
	var bestCoord = {x : void(0), y : void(0)};
	
	for (var i = 0; i < this.pheromonesInRange.length; i++) {
		M += this.pheromonesInRange[i].concentration;
		Mxy.y += this.pheromonesInRange[i].coord.y * this.pheromonesInRange[i].concentration;
		Mxy.x += this.pheromonesInRange[i].coord.x * this.pheromonesInRange[i].concentration;
		
		if (this.pheromonesInRange[i].concentration > best) {
			var best = this.pheromonesInRange[i].concentration;
			var bestCoord = this.pheromonesInRange[i].corod;
		}
	}
	
	CoM = {x : Mxy.x / M, y : Mxy.y / M};

	var choice = Math.random();
	if (choice < CHANGE_DIRECTION_THRESHOLD)
		this.prioritizeDirection = randDir();
	
	
	
	
	choice = Math.random();
	
	if (this.pheromonesInRange.length <= 0 && (this.atNest() || this.seeNest())) {
		this.direction = turnAround(this.direction);
		this.prioritizeDirection = this.direction;
		this.followingPheromone = false;
	} else if (this.pheromonesInRange.length > 0 && choice < 0.99) {	// 95% of the time go towards best pheromone
		this.direction = angleTo(this.coord, CoM);
		this.prioritizeDirection = this.direction;
		this.followingPheromone = true;
	} else {
		this.direction = this.prioritizeDirection;
		this.followingPheromone = false;
	}
};

// Performs the current task
Worker.prototype.doTask = function() {
	switch (this.goal) {

		case GOAL.findFood:
			this.wonder();
			this.findTarget();
			break;

		case GOAL.getFood:
			this.getFood();
			break;

		case GOAL.dropFood:
			this.depositeFood();
			break;
	}
};

Worker.prototype.atNest = function() {
	for (var i = 0; i < MAP[getCell(this.coord)].ant.length; i++) {
		var a = MAP[getCell(this.coord)].ant[i]
		if (a.type === ANT_TYPE.nest && a.nest === this.nest) {
			return true;
		}
	}
	
	return false;
}

Worker.prototype.seeNest = function() {
	for (var i = 0; i < this.itemsInView.ants.length; i++) {
		var a = this.itemsInView.ants[i];
		if (a.type === ANT_TYPE.nest && a.nest === this.nest) {
			return true;
		}
	}
	
	return false;
}

Worker.prototype.updateGoal = function() {
	switch (this.goal) {
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

Worker.prototype.update = function() {
	this.removeFromMap();
	
	
	if (this.sleep > 0) {		// When sleep timer triggered don't move
		this.sleep -= 1;
	} else {
		this.move();
	}
	
	this.isHungry();
	this.health -= this.healthRate;
	
	while (this.hungry && this.carrying > 0) {
		this.health += FOOD_HEALTH_RATIO;
		this.carrying -= 1;	// take one piece of food from carrying
		this.isHungry();	// recalculate this.hungry
	}
		
	
	if (this.health <= 0) {
		this.die();
		return void(0);	// die
	}
	
	this.scan();
	this.smell();
		
	this.doTask();
	this.updateGoal();
	
	if (this.goal == GOAL.dropFood)
		this.secrete();
	if (this.target != void(0)) {
		var s = new show(this.target, genID());
		s.colour = '#0000FF';
		s.addToMap();
		console.log(this.target);
	}

	this.addToMap();
};