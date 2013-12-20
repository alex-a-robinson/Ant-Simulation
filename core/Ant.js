/**
* Ant class
*/

var Ant = function(id, coord) {

	// Spatial attributes
	this.size = CELL_SIZE;			// The size of the ant
	this.coord = coord;				// The coordinate of the ant
	this.direction = randDir();		// The direction 0 = NORTH, 1 = EAST, 2 = SOUTH, 3 = WEST
	

	// Identifiers
	this.id = id;					// The ants unique identifier
	this.species;					// The ants species
	this.type;						// The type of ant
	this.nest;
	
	// Computed attributes
	this.hunger = 10;				// Lower means ant needs to eat more quickly
	this.hungerThreshold = 3;		// hunger point bellow which ant starts eating food it finds/has on it
	this.hungerRate;				// The rate at which hunger decreases
	this.hungerMax = 20;

	this.carrying = 0;				// The amount of food an ant is carrying
	this.carryingThreshold = 3;	// least amount of food required to return to nest with food
	this.carryingMax = 5;			// The maximum amount of food an ant can carry
	
	// Logic attributes (control the ants logic)
	this.goal = GOAL.findFood;		// The current goal of the ant
	this.target;					// The coordinate of the ants current target
	this.itemsInView;				// List of items in view
	this.pheromonesInRange = [];
	
	// Test attributes (logic is tested against these)
	this.sleep = 0;					// Used to control time critical tasks
};

// Adds the current position of the ant to the map
Ant.prototype.addToMap = function() {
	MAP[coordToIndex(this.coord)].ant.push(this);
};

// Removes the previous position of the ant from the map
Ant.prototype.removeFromMap = function() {
	var index = MAP[coordToIndex(this.coord)].ant.indexOf(this);
	MAP[coordToIndex(this.coord)].ant.splice(index, 1);
};

// Update the ants coordinates
Ant.prototype.move = function() {
	var speed = this.species.chars.speed;
	if (this.direction === DIR.east || this.direction === DIR.west) this.coord.x += (this.direction === DIR.east)?speed:-1 * speed;
	if (this.direction === DIR.north || this.direction === DIR.south) this.coord.y += (this.direction === DIR.south)?speed:-1 * speed;

	boundary(this.coord, MAP_BOUNDARY);
};

Ant.prototype.isHungry = function() {
	if (this.hunger < this.hungerThreshold)
		return true;
	else
		return false
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

// Assumes standing on food
Ant.prototype.useFood = function() {
	var index = coordToIndex(this.coord);
	var food = MAP[index].food;
	
	if (this.isHungry())
		this.hunger += this.takeFood(food) * FOOD_HUNGER_RATIO;
	else
		this.target = void(0);		// Assumes the target is the food
};

// Scans the ants surrounds as far as they can see for items of interest
Ant.prototype.scan = function() {
	this.itemsInView = {
		ants : [],
		food : [],
		pheromone : []
	};

	//var block = getBlock(this.coord, this.species.chars.eyesight);
	var block = getSegment(this.coord, this.species.chars.eyesight, this.direction)

	for (var i = 0; i < block.length; i++) {
		var index = coordToIndex(block[i]);
		if (MAP[index].ant.length > 0) {	// Check for ants
			this.itemsInView.ants.push(MAP[index].ant);
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
	
	var block = []
	
	/*
	switch (this.direction) {
		case DIR.north:
			for (var i = 0; i < this.species.chars.antennaSize; i++)
				block.push(boundary({x : this.coord.x, y : this.coord.y - i}, MAP_BOUNDARY));
			break;
			
		case DIR.south:
			for (var i = 0; i < this.species.chars.antennaSize; i++)
				block.push(boundary({x : this.coord.x, y : this.coord.y + i}, MAP_BOUNDARY));
			break;
			
		case DIR.east:
			for (var i = 0; i < this.species.chars.antennaSize; i++)
				block.push(boundary({x : this.coord.x - i, y : this.coord.y}, MAP_BOUNDARY));
			break;
			
		case DIR.west:
			for (var i = 0; i < this.species.chars.antennaSize; i++)
				block.push(boundary({x : this.coord.x + i, y : this.coord.y - i}, MAP_BOUNDARY));
			break;
	}*/
	
	var block = getSegment(this.coord, this.species.chars.antennaSize, this.direction);
	
	for (var i = 0; i < block.length; i++) {
		var index = coordToIndex(block[i]);
				
		for (var k = 0; k < MAP[index].pheromone.length; k++) {
			this.pheromonesInRange.push(MAP[index].pheromone[k]);
		}
	}
};

// Chooses which target to go for
Ant.prototype.findTarget = function() {
	switch (this.goal) {
		case GOAL.findFood:
			// Find the item which involves the least effort to get
			var leastEffort = 1000;		// <-- Large number to guarantee a number will be less then this
			for (var i = 0; i < this.itemsInView.food.length; i++) {
				var effort = calcEffort(this.coord, this.itemsInView.food[i].coord, this.itemsInView.food[i].amount);
				if (effort < leastEffort) {
					leastEffort = effort;
					this.target = this.itemsInView.food[i].coord;
				}
			}
			break;
	}
};

// secrete pheromone
Ant.prototype.secrete = function() {		// Do different types of pheromone

	var index = coordToIndex(this.coord);
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
	var pheromone = new Pheromone(this.species.chars.pheromoneConcentration, {x : this.coord.x, y : this.coord.y});
	pheromone.species = this.species;
	pheromone.antID.push(this.id);
	pheromone.addToMap();
};

Ant.prototype.draw = function(ctx) {
	drawRect(ctx, scaleCoord(this.coord), this.size, this.species.colour.ant);
};

Ant.prototype.sayHello = function() {
	console.log('Hello, ant ' + this.id + ' from ' + this.species.id + ' at (' + this.coord.x + ',' + this.coord.y + ').')
};