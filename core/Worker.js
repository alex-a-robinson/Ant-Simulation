Worker.prototype = new Ant(-1, {x : void(0), y : void(0)});
Worker.prototype.constructor = Worker;
Worker.prototype.parent = Ant;


function Worker(id, coord) {
	this.id = id;
	this.coord = coord;
	this.type = ANT_TYPE.worker;
	
	this.prevDirection = [];
	this.prioritizeDirection = randDir();
	this.followOwnPheromone = true;
	
	
	//this.constructor.call(this);
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
	this.direction = pathTo(this.coord, this.nest.coord);
	for (var i = 0; i < MAP[getCell(this.coord)].ant.length; i++) {
		if (MAP[getCell(this.coord)].ant[i].type === ANT_TYPE.nest && MAP[getCell(this.coord)].ant[i].nest === this.nest) {
			this.dropFood(this.nest);
			this.goal = GOAL.findFood;
			this.target = void(0);
			
			// Reverse prioritised direciotn
			this.prioritizeDirection = reverseDir(this.dir);
			this.dir = reverseDir(this.dir);
		}
	}
};

Worker.prototype.dropFood = function(nest) {
	nest.carrying += this.carrying;
	this.carrying = 0;
	
};

Ant.prototype.useFood = function() {
	var index = getCell(this.coord);
	var food = MAP[index].food;
	
	if (this.isHungry() && this.isFood(food))
		this.hunger += this.takeFood(food) * FOOD_HUNGER_RATIO;
	else if (this.canCarry() && this.isFood(food))
		this.carrying += this.takeFood(food);
	else
		this.target = void(0);		// Assuming the food is the target should really be this.GOAL is not this.getFood
};

// Walk randomly
/*Worker.prototype.wonder = function() {

	
	var leastEffort = 10000;
	var choosen = void(0);
			
	for (var i = 0; i < this.itemsInView.pheromone.length; i++) {
		var pheromone = this.itemsInView.pheromone[i];
		if (pheromone.coord != this.coord && pheromone.species === this.species && ! (pheromone.antID.length == 1 && pheromone.antID[0] == this.id)) {	// if the pheromone is of the same species and the pheromone was not soley laid by the ant
			var effort = calcEffort(this.coord, pheromone.coord, pheromone.concentration);
			if (effort < leastEffort) {
				leastEffort = effort;
				choosen = pheromone;
			}
		}
		
	}
	
	if (choosen === void(0)) {
		this.direction = randDir();	// Random direction
	} else {
		this.direction = pathTo(this.coord, choosen.coord);
	}
		
	this.findTarget();		// search for targets
};*/

// Shuffle algoritm 
// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
Worker.prototype.shuffle = function(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

Worker.prototype.wonder = function() {

	var best = 0;
	var bestCoord;
	
	for (var i = 0; i < this.pheromonesInRange.length; i++) {
		if (this.pheromonesInRange[i].concentration > best) {
			var best = this.pheromonesInRange[i].concentration;
			var bestCoord = this.pheromonesInRange[i].coord;
		}
	}

	var choice = Math.random();
	if (this.pheromonesInRange.length > 0 && choice < 0.95) {	// 95% of the time go towards best pheromone
		this.direction = angleTo(this.coord, bestCoord);
	} else {
		this.direction = this.prioritizeDirection;
	}
	
	choice = Math.random();
	if (choice < CHANGE_DIRECTION_THRESHOLD)
		this.prioritizeDirection = randDir();
		
	this.findTarget();		// search for targets
	
	/*
	// All directions start with equal probability of each direction
	var northPull = 1;
	var southPull = 1;
	var eastPull = 1;
	var westPull = 1;
	
	
	// Change the probabilities depending on pheromones within view distance
	for (var i = 0; i < this.pheromonesInRange.length; i++) {
		var pheromone = this.pheromonesInRange[i];
		
		// If the pheromone is of the same species and is not the ants pheromone
		if (pheromone.species === this.species) {
			switch (pathTo(this.coord, pheromone.coord)) {	// find direction of pheromone
				case DIR.north:
					northPull += calcEffort(this.coord, pheromone.coord, pheromone.concentration) * PHEROMONE_PULL_FACTOR;
					break;
				case DIR.sourth:
					southPull += calcEffort(this.coord, pheromone.coord, pheromone.concentration) * PHEROMONE_PULL_FACTOR;
					break;
				case DIR.east:
					eastPull += calcEffort(this.coord, pheromone.coord, pheromone.concentration) * PHEROMONE_PULL_FACTOR;
					break;
				case DIR.west:
					westPull += calcEffort(this.coord, pheromone.coord, pheromone.concentration) * PHEROMONE_PULL_FACTOR;
					break;
			}
		}
	}
			
	switch(this.prioritizeDirection) {
		case DIR.north:
			northPull += MOMENTUM_INFLUENCE;
			break;
		case DIR.south:
			southPull += MOMENTUM_INFLUENCE;
			break;
		case DIR.east:
			eastPull += MOMENTUM_INFLUENCE;
			break;
		case DIR.west:
			westPull += MOMENTUM_INFLUENCE;
			break;
	}
	console.log(randDir())
	console.log(northPull.toFixed(2) + ':' + southPull.toFixed(2) + ':' + eastPull.toFixed(2) + ':' + westPull.toFixed(2));
	
	// Normalize values so sum = 1
	var sum = northPull + southPull + eastPull + westPull;
	
	var normNorthPull = northPull / sum;
	var normSouthPull = southPull / sum;
	var normEastPull = eastPull / sum;
	var normWestPull = westPull / sum;
	
	console.log(normNorthPull.toFixed(2) + ':' + normSouthPull.toFixed(2) + ':' + normEastPull.toFixed(2) + ':' + normWestPull.toFixed(2));
			
	// calc direction
	var direction = Math.random();
	
	// Randomize so random direction if all are equal
	var pull = [[normNorthPull, DIR.north], [normSouthPull, DIR.south], [normEastPull, DIR.east], [normWestPull, DIR.west]];
	pull = this.shuffle(pull);
		
	// order ascending
	var pullOrdered = pull.sort(function(a,b){return a[0]-b[0]});
		
	// Work out order
	switch (true) {
		case direction < pullOrdered[0][0]:
			this.direction = pullOrdered[0][1];
			break;
		case direction < pullOrdered[1][0] + pullOrdered[0][0]:
			this.direction = pullOrdered[1][1];
			break;
		case direction < pullOrdered[2][0] + pullOrdered[1][0] + pullOrdered[0][0]:
			this.direction = pullOrdered[2][1];
			break;
		case direction < pullOrdered[3][0] + pullOrdered[2][0] + pullOrdered[1][0] + pullOrdered[0][0]:
			this.direction = pullOrdered[3][1];
			break;
	}
	
	this.prioritizeDirection = this.direciton;
	
	*/
		
	
};

// Performs the current task
Worker.prototype.doTask = function() {
	switch (this.goal) {

		case GOAL.findFood:
			this.wonder();
			break;

		case GOAL.getFood:
			this.getFood();
			break;

		case GOAL.dropFood:
			this.depositeFood();
			break;
	}
};

Worker.prototype.updateGoal = function() {
	switch (this.goal) {
		case GOAL.findFood:
			if (this.target !== void(0))	// If found a target
				this.goal = GOAL.getFood;
			break;

		case GOAL.getFood:
			console.log('Getting food @');
			console.log(this.target);
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