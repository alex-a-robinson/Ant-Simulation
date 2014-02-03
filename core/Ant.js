/**
 * @class Ant
 * @classdesc Represents a single generic ant
 * @param {integer} id - The unique ant id
 * @param {x : number, y : number} coord - The coordinate of the ant
 */
var Ant = function(id, coord) {
        /**
         * @property {width : integer, y : integer} this.size - The size of 
         * 		the ant in pixels (default: CELL_SIZE)
         * @property {x : number, y : number} this.coord - The coordinate of 
         * 		the ant
         * @property {number} this.direction - The direction in radians from 
         * 		the vertical axis clockwise
         * @property {integer} this.id - The unique ant id
         * @property {Species object} this.species - The ants species which 
         * 		determines its characteristics
         * @property {integer} this.type - The type of ant, use ANT_TYPE object
         * 		when setting e.g. ANT_TYPE.worker
         * @property {Nest object} this.nest - The ants home nest where it 
         * 		will deposit food
         * @property {string} this.colour - The hexadecimal colour of the ant
         * @property {number} this.health - The health of the ant, if <= 0 the 
         * 		ant is dead (default: 500)
         * @property {integer} this.hungerThreshold - The value of health 
         * 		bellow which the ant is determined to be hungry (default: 300)
         * @property {number} this.healthRate - The rate at which the ants 
         * 		health decreases per tick
         * @property {boolean} this.alive - (default: true)
         * @property {integer} this.goal - The current goal which the ant is 
         * 		trying to accomplish (default: GOAL.none); 
         * @property {x : number, y : number} this.target - The coordinate of a 
         * 		target the ant has choose, type of target depends on ant e.g. worker
         * 		ants have coordinates of food as their target (default: void(0))
         * @property {ants : [object], food : [object]} this.itemsInView - 
         * 		Arrays of the different items of interest in the ants view 
         * 		(default: {ants : [], food : []})
         * @property {[Pheromone object]} this.pheromonesInRange - An Array of 
         * 		all the pheromones in the ants antenna range (default: [])
         * @property {integer} this.sleep - The number of ticks the ant needs to
         * 		sleep for. Used for tasks which require actions which take 
         * 		multiple ticks (default: 0)
         * @property {boolean} this.followingPheromone - Used to tell if an ant 
         * 		is following a pheromone (default: false)
		 * @property {number} this.direction - The direction in radians from the 
		 *              vertical axis clockwise (default: *random direction*)
		 * @property {number} this.prioritizeDirection - The direction the ant will 
		 *              general move, used to get straighter more realistic paths 
		 *              (default: *random direction*)
         */
        this.size = CELL_SIZE;
        this.coord = coord;
        this.direction = randDir();
        this.id = id;
        this.species;
        this.type;
        this.nest;
        this.colour = '#1C1C1C';
        this.health;
        this.hungerThreshold = 100;
        this.healthRate = 0.1;
        this.alive = true;
        this.goal = GOAL.none;
        this.target = void(0);
        this.itemsInView = {
            ants: [],
            food: []
        };
        this.pheromonesInRange = [];
        this.sleep = 0;
        this.followingPheromone = false;
		this.direction = randDir();
		this.prioritizeDirection = randDir();
    };
/**
 * Adds the current position of the ant to the map
 */
Ant.prototype.addToMap = function() {
    if (this.alive) MAP[coordToIndex(this.coord)].ant.push(this);
};
/**
 * Removes the current position of the ant from the map
 */
Ant.prototype.removeFromMap = function() {
    var index = MAP[coordToIndex(this.coord)].ant.indexOf(this);
    MAP[coordToIndex(this.coord)].ant.splice(index, 1);
};
/**
 * Determines whether the ant is hungry or not
 * @return {boolean}
 */
Ant.prototype.isHungry = function() {
    if (this.health < this.hungerThreshold) return true;
    else return false;
};
/**
 * Updates the this.sleep variable to simulate time passing during sleep
 */
Ant.prototype.updateSleep = function() {
    if (this.sleep > 0) {
        this.sleep -= 1;
    }
};
/**
 * Determines whether a piece of food exists or not, needed if another ant eats 
 * the piece of food being targeted in the same tick
 * @return {boolean}
 */
Ant.prototype.isFood = function(food) {
    if (food !== void(0) && food.amount > 0) // food.amount should NEVER be <= 0
		return true;
    else 
		return false;
};
/**
 * Takes a single piece of food
 * @return {boolean} - 1 if there is still food, otherwise 0
 */
Ant.prototype.takeFood = function(food) {
    if (this.isFood(food)) { // If food
        food.amount -= 1; // Take a single piece of food
        this.sleep += ANT_FOOD_TAKE_SPEED;
        if (!this.isFood(food)) // If food is all gone remove it from the map
			food.removeFromMap();
        return 1;
    } else {
        return 0;
    }
};
/**
 * Determines whether the ant is currently at its own nest i.e. standing on top 
 * of a NestPiece
 * @return {boolean}
 */
Ant.prototype.atNest = function() {
    for (var i = 0; i < MAP[coordToIndex(this.coord)].ant.length; i++) {
        var a = MAP[coordToIndex(this.coord)].ant[i]
        if (a.type === ANT_TYPE.nest && a.nest === this.nest) {
            return true;
        }
    }
    return false;
};
/**
 * Determines whether the ant can see its own nest
 * @return {boolean}
 */
Ant.prototype.seeNest = function() {
    for (var i = 0; i < this.itemsInView.ants.length; i++) {
        var a = this.itemsInView.ants[i];
        if (a.type === ANT_TYPE.nest && a.nest === this.nest) {
            return true;
        }
    }
    return false;
};
/**
 * Choose the target piece of food the ant should go for
 */
Ant.prototype.findFoodTarget = function() {
	// Ant will pick the first piece of food it sees
	if (this.itemsInView.food.length > 0)
		this.target = this.itemsInView.food[0].coord;
};
/**
 * Walk towards food until on top of it and then pick it up
 */
Ant.prototype.getFood = function() {
    this.direction = angleTo(this.coord, this.target); // Point towards the food
    // If on the food pick it up. As this.coord is a number, work out which 
    // cell the ant is mostly in using coordToIndex
    if (coordToIndex(this.coord) === coordToIndex(this.target)) {
        this.useFood();
    }
};
/**
 * Determines the best use of food - Eating it or Carrying it
 */
Ant.prototype.useFood = function() {
    var index = coordToIndex(this.coord);
    var food = MAP[index].food;
    if (this.isFood(food)) // check the food still exists i.e. already eaten
		this.health += this.takeFood(food) * FOOD_HEALTH_RATIO;
    else // Food is not there/cannot be carried
		this.target = void(0);
};
/**
 * Scans in front of the ant a certain number of cell collecting all items 
 * of interest
 */
Ant.prototype.scan = function() {
    this.itemsInView = {
        ants: [],
        food: [],
    };
    // Find the blocks which lie in a sector of a circle of a 
    // certain radius (eyesight) at a certain angle (eyeAngle) from the ant
    // in the direction its facing
    var block = getSector(this.coord, this.species.chars.eyesight, 
                            this.direction, this.species.chars.eyeAngle);
    // Go through each block and add other ants and pieces of food
    for (var i = 0; i < block.length; i++) {
        var index = coordToIndex(block[i]);
        if (MAP[index].ant.length > 0) { // Check for ants
            for (var k = 0; k < MAP[index].ant.length; k++)
            this.itemsInView.ants.push(MAP[index].ant[k]);
        }
        if (MAP[index].food !== void(0)) { // Check for food
            this.itemsInView.food.push(MAP[index].food);
        }
    }
};
/**
 * Smiler to this.scan() - Scans a certain number of blocks in front at a 
 * specific angle and collects all the pheromones
 */
Ant.prototype.smell = function() {
    this.pheromonesInRange = [];
    // Find the blocks which lie in a sector of a circle of a 
    // certain radius (antennaSize) at a certain angle (antennaAngle) 
    // from the ant in the direction its facing
    var block = getSector(this.coord, this.species.chars.antennaSize, 
                            this.direction, this.species.chars.antennaAngle);
    // Go through each block and add pheromones to the pheromonesInRange object
    for (var i = 0; i < block.length; i++) {
        var index = coordToIndex(block[i]);
        if (index === coordToIndex(this.coord)) // don't smell own square
			continue;
        for (var k = 0; k < MAP[index].pheromone.length; k++) {
            this.pheromonesInRange.push(MAP[index].pheromone[k]);
        }
    }
};
/**
 * Secrete pheromones
 */
Ant.prototype.secrete = function() {
    var index = coordToIndex(this.coord);
    var pheromones = MAP[index].pheromone;
    // Check if there are already pheromones in the cell
    for (var i = 0; i < pheromones.length; i++) {
        if (pheromones[i].species == this.species) { // Add to exsisting
            pheromones[i].concentration += this.species.chars.pheromoneConcentration;
            if (pheromones[i].concentration > MAX_PHEROMONE_CONCENTRATION) 
                pheromones[i].concentration = MAX_PHEROMONE_CONCENTRATION;
            return void(0);
        }
    }
    // If pheromone from own species not found, create a new pheromone
    var pheromone = new Pheromone(this.species.chars.pheromoneConcentration, 
                                    getCellCoord(this.coord));
    pheromone.species = this.species;
    pheromone.addToMap();
};
/**
 * Wonder around the map, following pheromone of own species
 */
Ant.prototype.wonder = function() {
    var M = 0;
    var Mxy = {
        x: 0,
        y: 0
    };
    var CoM = {
        x: 0,
        y: 0
    };
    var pheromones = false; // If can follow pheromones i.e. if there are 
                            // no pheromones cannot follow them
    // Look at all nearby pheromones of the same species and add up x and y 
    // coordinates for each as well as the total concentration
    for (var i = 0; i < this.pheromonesInRange.length; i++) {
        if (this.pheromonesInRange[i].species === this.species) {
            M += this.pheromonesInRange[i].concentration;
            Mxy.y += this.pheromonesInRange[i].coord.y * this.pheromonesInRange[i].concentration;
            Mxy.x += this.pheromonesInRange[i].coord.x * this.pheromonesInRange[i].concentration;
            pheromones = true; // Pheromones to follow
        }
    }
    CoM = {x: Mxy.x / M, y: Mxy.y / M}; // The mean coordinate of all the 
    // pheromones of the same species weighed by pheromone concentration

    // Every so often change the prioritize direction
    if (Math.random() < this.species.chars.explorativeInfluence) 
        this.prioritizeDirection = randDir();
    if (pheromones && Math.random() < this.species.chars.pheromoneInfluence) {
		// If there are pheromones to follow, go towards them however 
		// there is a chance this will not happen depending on how 
		// influential pheromones are (pheromoneInfluence)
        var angle = angleTo(this.coord, CoM);
		angle = validateDirection(angle);
        if (angle > this.direction - Math.PI / 3 && angle < this.direction + Math.PI / 3) { 
            // will only join pheromones which lie in a cretin angle i.e. simulating
			// that ants will not turn directly around
            this.direction = angle;
            this.prioritizeDirection = this.direction;
            this.followingPheromone = true;
			
        } else {
            this.direction = this.prioritizeDirection;
            this.followingPheromone = false;
        }
    } else { // Otherwise head in the prioritized direction
        this.direction = this.prioritizeDirection;
        this.followingPheromone = false;
    }
};
/**
 * Update the ants coordinates
 */
Ant.prototype.move = function() {
    if (this.sleep <= 0) { // only move when not waiting for a task to complete
        this.coord.x += Math.sin(this.direction) * this.species.chars.speed;
        this.coord.y -= Math.cos(this.direction) * this.species.chars.speed;
    }
    boundary(this.coord, MAP_BOUNDARY); // Make sure if the ant is out of bounds
};
/**
 * Remove the ant from ANT_LIST and the its species.ants list so the ant is not
 * updated next tick and will be collected by the JS garbage collection
 */
Ant.prototype.die = function() {
    var index = ANTS_LIST.indexOf(this);
    ANTS_LIST.splice(index, 1);
    var index = this.species.ants.indexOf(this);
    this.species.ants.splice(index, 1);
    this.alive = false;
};