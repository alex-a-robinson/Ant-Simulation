Soldier.prototype = new Ant(-1, {x : void(0), y : void(0)});
Soldier.prototype.constructor = Soldier;
Soldier.prototype.parent = Ant;

function Soldier(id, coord) {
	// Spatial attributes
	this.coord = coord;		// Coordinate of the ant
	
	this.direction = randDir();
	this.prioritizeDirection = randDir();
	this.followingPheromone = false;
	
	// Identifiers
	this.id = id;			// The ants unique identifier
	
	this.damage = 10000;
	this.targetAnt = void(0);			// The ant obj which soldier is attacking
	
	this.goal = GOAL.none;
	
	this.type = ANT_TYPE.soldier;
	
	this.itemsInView = {
		ants : [],
		food : [],
		pheromone : []
	};				// List of items in view
	this.pheromonesInRange = [];
	this.moving = true;
	this.steps = randInt({min : 0, max : 5});
	this.guardTarget;
	this.nearNest = false;
};

Soldier.prototype.doTask = function() {
	switch (this.goal) {

		case GOAL.guardNest:
			this.guardNest();
			break;
			
		case GOAL.guardPheromone:
			this.guardPheromone();
			break;
		
		case GOAL.guardFood:
			this.guardFood();
			break;
			
		case GOAL.attack:
			this.nearNest = false;
			this.moving = true;
			this.follow();
			this.attack();
			break;
	}
};

Soldier.prototype.updateGoal = function() {
	switch (this.goal) {
		case GOAL.none:
			this.goal = randInt({min : 7, max : 7});
			break;
		
		case GOAL.guardNest:
			if (this.targetAnt !== void(0)) {
				this.goal = GOAL.attack;
				this.guardTarget = GOAL.guardNest
			}
			break;
			
		case GOAL.guardPheromone:
			if (this.targetAnt !== void(0)) {
				this.goal = GOAL.attack;
				this.guardTarget = GOAL.guardPheromone
			}
			break;
		
		case GOAL.guardFood:
			if (this.targetAnt !== void(0)) {
				this.goal = GOAL.attack;
				this.guardTarget = GOAL.guardFood
			}
			break;
		
		case GOAL.attack:
			if (this.targetAnt === void(0))
				this.goal = this.guardTarget;
			break;
	}
};

Soldier.prototype.guardNest = function() {
	if ((this.nearNest || this.seeNest()) && !this.soldiersInView() && this.steps <= 0) {
		this.moving = false;
		this.nearNest = true;
		this.direction = turnAround(this.direction);	// so its looking outwards
	} else {
		if (Math.random() < this.species.nestCoordMemory)  // sense of direction of nest
			this.prioritizeDirection = angleTo(this.coord, this.nest.coord);
		
		this.nearNest = false;
		this.wonder();
		if (this.steps <= 0)
			this.steps = 5;
		this.moving = true;
	}
};

Soldier.prototype.guardPheromone = function() {
	this.wonder();
	this.moving = true;
};

Soldier.prototype.guardFood = function() {
	if (this.seeFood && !this.soldiersInView() && this.steps <= 0) {
		this.moving = false;
		this.direction += 0.2;
	} else {
		this.wonder();
		this.steps = 5;
		this.moving = true;
	}
};

Soldier.prototype.soldiersInView = function() {
	for (var i = 0; i < this.itemsInView.ants.length; i++)
		if (this.itemsInView.ants[i].type === ANT_TYPE.soldier && this.itemsInView.ants[i].species === this.species) {
			return true;
	}
	
	return false;
};

Soldier.prototype.seeFood = function() {
	if (this.itemsInView.food.length > 0)
		return true;
	else
		return false;
};

Soldier.prototype.pickTarget = function() {
	this.targetAnt = void(0);
	var leastEffort = 100000;		// <-- Large number to guarantee a number will be less then this
	var effort;
	for (var i = 0; i < this.itemsInView.ants.length; i++) {
		var ant = this.itemsInView.ants[i];
		if (ant.species != this.species  && ant.type === ANT_TYPE.nest) {
			console.log('see target nest ant!');
			this.targetAnt = ant;/*
			effort = calcEffort(this.coord, ant.coord, ant.health);		// should be more prone to attack the ant with the least health rather then the most
			if (effort < leastEffort || ant.type === ANT_TYPE.nest) {
				leastEffort = effort;
				this.targetAnt = ant;
			}
		*/}
	}
};

Soldier.prototype.follow = function() {
	if (this.targetAnt !== void(0)) {
		this.direction = angleTo(this.coord, this.targetAnt.coord);
		this.prioritizeDirection = this.direction;
	}
};

Soldier.prototype.attack = function() {
	var block = getBlock(this.coord, 1);		// can attack all enemies within a radius of 1
	for (var i = 0; i < block.length; i++) {
		var index = coordToIndex(block[i]);
		for (var k = 0; k < MAP[index].ant.length; k++) {
			var ant = MAP[index].ant[k];
			if (this.targetAnt === ant) {
				ant.health -= this.damage;
				console.log('attacking nest!')
			}
		}
	}
};


Soldier.prototype.update = function() {
	this.removeFromMap();
	
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
	
	this.pickTarget();

	this.doTask();
	this.updateGoal();
	
	if (this.sleep > 0)		// When sleep timer triggered don't move
		this.sleep -= 1;
	
	if (this.steps > 0)
		this.steps -= 1;
	
	if (this.moving)
		this.move();
	
	this.addToMap();
};