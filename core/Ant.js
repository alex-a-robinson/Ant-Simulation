var Ant = function(id, coord) {

	// Spatial attributes
	this.size = CELL_SIZE;			// The size of the ant
	this.coord = coord;				// The coordinate of the ant
	this.direction = randDir(); 		// The direction angle

	// Identifiers
	this.id = id;					// The ants unique identifier
	this.species;					// The ants species
	this.type;						// The type of ant
	this.nest;
	this.colour;
	
	// Computed attributes
	this.health = 500;
	this.hungerThreshold = 300;		// hunger point bellow which ant starts eating food it finds/has on it
	this.healthRate = 1;				// The rate at which hunger decreases
	this.healthMax = 1000;
	this.hungry = false;
	this.alive = true;

	this.carrying = 0;				// The amount of food an ant is carrying
	this.carryingThreshold = 4;	// least amount of food required to return to nest with food
	this.carryingMax = 10;			// The maximum amount of food an ant can carry
	
	// Logic attributes (control the ants logic)
	this.goal = GOAL.none;		// The current goal of the ant
	this.target;					// The coordinate of the ants current target
	this.itemsInView = {
		ants : [],
		food : [],
		pheromone : []
	};				// List of items in view
	this.pheromonesInRange = [];
	
	// Test attributes (logic is tested against these)
	this.sleep = 0;					// Used to control time critical tasks
	this.followingPheromone = false;
};

// Adds the current position of the ant to the map
Ant.prototype.addToMap = function() {
	if (this.alive)
		MAP[getCellIndex(this.coord)].ant.push(this);
};

// Removes the previous position of the ant from the map
Ant.prototype.removeFromMap = function() {
	var index = MAP[getCellIndex(this.coord)].ant.indexOf(this);
	MAP[getCellIndex(this.coord)].ant.splice(index, 1);
};

Ant.prototype.isHungry = function() {
	if (this.health < this.hungerThreshold)
		this.hungry = true;
	else
		this.hungry = false;
};

Ant.prototype.isFood = function(food) {
	if (food !== void(0) && food.amount > 0)	// food.amount should NEVER be <= 0
		return true;
	else
		return false;
}; 

// Takes a single piece of food
Ant.prototype.takeFood = function(food) {
	if (this.isFood(food)) {	// If food
		food.amount -= 1;	// Take a single peice of food
		this.sleep += ANT_FOOD_TAKE_SPEED;
		
		if (this.isFood(food))
			food.removeFromMap();
		
		return 1;
	} else {
		return 0;
	}
};

Ant.prototype.atNest = function() {
	for (var i = 0; i < MAP[getCellIndex(this.coord)].ant.length; i++) {
		var a = MAP[getCellIndex(this.coord)].ant[i]
		if (a.type === ANT_TYPE.nest && a.nest === this.nest) {
			return true;
		}
	}
	
	return false;
};

Ant.prototype.seeNest = function() {
	for (var i = 0; i < this.itemsInView.ants.length; i++) {
		var a = this.itemsInView.ants[i];
		if (a.type === ANT_TYPE.nest && a.nest === this.nest) {
			return true;
		}
	}
	
	return false;
};

// Scans the ants surrounds as far as they can see for items of interest
Ant.prototype.scan = function() {
	this.itemsInView = {
		ants : [],
		food : [],
		pheromone : []
	};

	var block = getSector(this.coord, this.species.chars.eyesight, this.direction, this.species.chars.eyeAngle);
	
	for (var i = 0; i < block.length; i++) {
		var index = coordToIndex(block[i]);
		
		if (MAP[index].ant.length > 0) {	// Check for ants
			for (var k = 0; k < MAP[index].ant.length; k++)
				this.itemsInView.ants.push(MAP[index].ant[k]);
		} if (MAP[index].food !== void(0)) {			// Check for food
			this.itemsInView.food.push(MAP[index].food);
		} if (MAP[index].pheromone.length > 0) { // Check for pheromone
			for (var k = 0; k < MAP[index].pheromone.length; k++)
				this.itemsInView.pheromone.push(MAP[index].pheromone[k]);
		}
	}
};

Ant.prototype.smell = function() {
	this.pheromonesInRange = [];

	var block = getSector(this.coord, this.species.chars.antennaSize, this.direction, this.species.chars.antennaAngle);
	
	for (var i = 0; i < block.length; i++) {
		var index = coordToIndex(block[i]);
		
		if (index === getCellIndex(this.coord))	// don't smell own square (check this is nessocery)
			continue;

		for (var k = 0; k < MAP[index].pheromone.length; k++) {
			this.pheromonesInRange.push(MAP[index].pheromone[k]);
		}
	}
};

// secrete pheromone
Ant.prototype.secrete = function() {		// Do different types of pheromone
	var index = getCellIndex(this.coord);
	var pheromones = MAP[index].pheromone;

	for (var i = 0; i < pheromones.length; i++) {
		if (pheromones[i].species == this.species) {
			pheromones[i].concentration += this.species.chars.pheromoneConcentration;
			if (pheromones[i].concentration > MAX_PHEROMONE_CONCENTRATION)
				pheromones[i].concentration = MAX_PHEROMONE_CONCENTRATION;	// Cannot be over the maximum
			if (pheromones[i].antID.indexOf(this.id) < 0)
				pheromones[i].antID.push(this.id);
			return void(0);
		}
	}
	
	// If pheromone from own species not found, create it!
	var pheromone = new Pheromone(this.species.chars.pheromoneConcentration, getCellCoord(this.coord));
	pheromone.species = this.species;
	pheromone.antID.push(this.id);
	pheromone.addToMap();
};

Ant.prototype.wonder = function() {
	var M = 0;
	var Mxy = {x  : 0, y : 0};
	var CoM =  {x  : 0, y : 0};
	
	var pheromones = false;
	
	for (var i = 0; i < this.pheromonesInRange.length; i++) {
		if (this.pheromonesInRange[i].species === this.species) {		// only follow pheromones of own species
			M += this.pheromonesInRange[i].concentration;
			Mxy.y += this.pheromonesInRange[i].coord.y * this.pheromonesInRange[i].concentration;
			Mxy.x += this.pheromonesInRange[i].coord.x * this.pheromonesInRange[i].concentration;
			pheromones = true;
		}
	}
	
	CoM = {x : Mxy.x / M, y : Mxy.y / M};

	// Every so often change the direction
	var choice = Math.random();
	if (choice < CHANGE_DIRECTION_THRESHOLD)
		this.prioritizeDirection = randFloat({min : this.direction - Math.PI/2, max : this.direction + Math.PI /2})//randDir();
	
	choice = Math.random();
	
	if (this.followingPheromone && this.pheromonesInRange.length <= 0 && (this.atNest() || this.seeNest())) {
		this.direction = turnAround(this.direction);
		this.prioritizeDirection = this.direction;
		this.followingPheromone = false;
	} else if (pheromones && choice < PHEROMONE_INFLUENCE) {	// 95% of the time go towards best pheromone
		this.direction = angleTo(this.coord, CoM);
		this.prioritizeDirection = this.direction;
		this.followingPheromone = true;
	} else {
		this.direction = this.prioritizeDirection;
		this.followingPheromone = false;
	}
};

// Update the ants coordinates
Ant.prototype.move = function() {
	var speed = this.species.chars.speed;
	if (this.sleep <= 0) {
		this.coord.x += Math.sin(this.direction) * this.species.chars.speed;
		this.coord.y -= Math.cos(this.direction) * this.species.chars.speed;
	}
	
	boundary(this.coord, MAP_BOUNDARY);
};

Ant.prototype.die = function() {
	var index = antsList.indexOf(this);
	antsList.splice(index, 1);
	this.alive = false;
};

Ant.prototype.draw = function(ctx) {
	var scaledCoord = scaleCoord(this.coord);
	
	ctx.save();
	
	ctx.translate(scaledCoord.x + this.size.width/2, scaledCoord.y + this.size.height/2);
	ctx.rotate(this.direction);
	drawRect(ctx, {x: -this.size.width/2, y:-this.size.height/2}, this.size, this.colour);	
	drawRect(ctx, {x: 0, y:0}, {width : 1, height: this.size.height}, this.colour);	// pointer to show direction
	
	ctx.restore();
};

Ant.prototype.sayHello = function() {
	console.log('Hello, ant ' + this.id + ' from ' + this.species.id + ' at (' + this.coord.x + ',' + this.coord.y + ').')
};