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
		case GOAL.findFood:
			this.findFood();
	}
};

Soldier.prototype.updateGoal = function() {
	switch (this.goal) {
		case GOAL.none:
			this.goal = randInt({min : GOAL.guardNest, max : GOAL.guardFood});
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
		case GOAL.findFood:
			if (!this.isHungry()) {
				this.goal = randInt({min : GOAL.guardNest, max : GOAL.guardFood});
			}
	}
};

Soldier.prototype.guardNest = function() {
	if (this.nearNest) {
		if (this.steps <= 0 && !this.soldiersInView()) {
			this.moving = false;
			this.direction += 0.02;
		} else if (this.soldiersInView()){
			this.nearNest = false;
		}
	} else if (this.seeNest() && !this.atNest()) {
		this.nearNest = true;
		this.steps = 100;	// guard nest radius
	} else {
		if (Math.random() < this.species.nestCoordMemory)  // sense of direction of nest
			this.prioritizeDirection = angleTo(this.coord, this.nest.coord);
		
		this.wonder();
		this.moving = true;
		
	}
};

Soldier.prototype.guardPheromone = function() {
	this.wonder();
	this.moving = true;
};

Soldier.prototype.guardFood = function() {
	if (this.seeFood() && !this.soldiersInView()) {
		this.moving = false;
	} else {
		this.wonder();
		this.moving = true;
	}
};

Soldier.prototype.findFood = function() {
	this.wonder();
	this.findFoodTarget();
	if (this.target !== void(0)) {
		this.getFood();
	}
};

Soldier.prototype.soldiersInView = function() {
	for (var i = 0; i < this.itemsInView.ants.length; i++)
		if (this.itemsInView.ants[i].type === ANT_TYPE.soldier && this.itemsInView.ants[i].species === this.species && this.itemsInView.ants[i] !== this) {
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
	if (this.targetAnt === void(0)) {
		this.targetAnt = void(0);
		var leastEffort = 999999;		// <-- Large number to guarantee a number will be less then this
		var effort;
		for (var i = 0; i < this.itemsInView.ants.length; i++) {
			var ant = this.itemsInView.ants[i];
			if (this.species !== ((ant.type === ANT_TYPE.nest)?ant.nest.species:ant.species)) {
				effort = calcEffort(this.coord, ant.coord, ant.health);		// should be more prone to attack the ant with the least health rather then the most
				if (effort < leastEffort || ant.type === ANT_TYPE.nest) {
					leastEffort = effort;
					this.targetAnt = ant;
				}
			}
		}
	}
};

Soldier.prototype.follow = function() {
	if (this.targetAnt !== void(0)) {
		this.direction = angleTo(this.coord, this.targetAnt.coord);
		this.prioritizeDirection = this.direction;
	}
};

Soldier.prototype.attack = function() {
	var dist = distance(this.coord, this.targetAnt.coord);
	if (dist <= this.species.chars.stingSize) {
		this.targetAnt.health -= this.species.chars.jawSize * DAMAGE_MULTIPLIER;
		if (this.targetAnt.health <= 0) {
			this.targetAnt.removeFromMap();
			this.targetAnt.die();
			this.targetAnt = void(0);
		}
	} else if (dist > 25) {
		this.targetAnt = void(0);
	}
};

Soldier.prototype.updateHealth = function() {	
	this.health -= this.healthRate;
	if (this.isHungry()) {
		this.GOAL = GOAL.findFood;
	}
	
	if (this.health <= 0)
		this.die();
};

/**
* Updates the this.steps variable
*/ 
Soldier.prototype.updateSteps = function() {
	if (this.steps > 0) {
		this.steps -= 1;
	}
};

/**
* Draw the ant onto the canvas context 
*/ 
Soldier.prototype.draw = function(ctx) {
	var scaledCoord = scaleCoord(this.coord);	// Scale the coordinates so they map to pixels rather then cells
	
	ctx.save();
	
	// Translate and rotate the canvas (done so can draw at an angle)
	ctx.translate(scaledCoord.x + this.size.width/2, scaledCoord.y + this.size.height/2);
	ctx.rotate(this.direction);
	drawRect(ctx, {x: -this.size.width/2, y: -this.size.height/2}, this.size, this.colour);	
	drawLine(ctx, {x: -this.size.width/4, y: -this.size.height/4}, {x: this.size.width/4, y: this.size.height/4}, '#FFFFFF', 1)
	drawLine(ctx, {x: -this.size.width/4, y: this.size.height/4}, {x: this.size.width/4, y: -this.size.height/4}, '#FFFFFF', 1)
	
	ctx.restore();
};

Soldier.prototype.update = function() {
	this.removeFromMap();
	
	if (!this.alive)
		return void(0);

	this.scan();
	this.smell();
	
	this.pickTarget();

	this.doTask();
	this.updateGoal();
	
	this.updateSleep();
	
	this.updateSteps();
	
	if (this.moving)
		this.move();
	
	this.addToMap();
};