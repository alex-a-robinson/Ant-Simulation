/**
 * @class Nest
 * @classdesc Represents the ant nest entity
 * @param {integer} id - A unique identifier
 * @param {x : number, y : number} coord - The coordinate of the piece
 */
var Nest = function(id, coord) {
        /**
         * @property {x : integer, y : integer} this.nestSize - The number of 
         *              pieces the nest extends both in the x and y directions
         * @property {x : number, y : number} this.coord - The coordinate of the nest
         * @property {integer} this.id - A unique identifier
         * @property {Species object} this.species - The species which the nest belongs to
         * @property {[NestPiece object]} this.pieces - An array of the NestPiece 
         *              objects belonging to the nest
         * @property {number} this.health - The health the nest has
         * @property {number} this.hungerThreshold - The threshold below which 
         *              the nest is hungry and tries to preserve food
         * @property {number} this.healthRate - The rate at which the nests health 
         *              reduces each tick
         * @property {boolean} this.alive - If the nest is alive or not, needed if nest
         *              dies mid execution so does not keep acting as if it is alive
         */

        this.nestSize = NEST_SIZE;
        this.coord = coord;

        this.id = id;
        this.species;

        this.pieces = [];

        this.health = 3000;
        this.hungerThreshold = 300;
        this.healthRate = 1;
        this.alive = true;
    };

/**
 * Create a single nest piece
 * @param {x : number, y : number} coord - The coordinate of the nest piece to add
 */
Nest.prototype.addNestPiece = function(coord) {
    var nestPiece = new NestPiece(genID(), coord, this);
    this.pieces.push(nestPiece);
    nestPiece.addToMap();
};

/**
 * Creates all the nest pieces
 */
Nest.prototype.createNest = function() {
    var block = getBlock(this.coord, this.nestSize); // Get block around
    for (var i = 0; i < block.length; i++)
    this.addNestPiece(block[i]);
};

/**
 * Removing nest from the ants list, it will therefore not be 
 * updated and JavaScripts garbage collection should delete the object
 */
Nest.prototype.die = function() {
    console.log('Nest died');
    // Remove from ants list
    var index = ANTS_LIST.indexOf(this);
    ANTS_LIST.splice(index, 1);

    // Remove from species nests list
    index = this.species.nests.indexOf(this);
    this.species.nests.splice(index, 1);

    if (this.species.nests.length <= 0) {
        removeSpeciesData(this.species.id);
        index = SPECIES_LIST.indexOf(this.species);
        SPECIES_LIST.splice(index, 1);
    }

    for (var i = 0; i < this.pieces.length; i++) {
        this.pieces[i].removeFromMap();
    }

    this.alive = false;
};

/**
 * Returns the cost in the amount of health needed to create a specific type of ant
 * @param {ANT_TYPE} type - Represents a specific type of ant
 * @return {number} - The health required
 */
Nest.prototype.getCost = function(type) {
    switch (type) {

    case ANT_TYPE.worker:
        return this.species.chars.reproductionWorkerFoodCost * FOOD_HEALTH_RATIO;
    case ANT_TYPE.queen:
        return this.species.chars.reproductionQueenFoodCost * FOOD_HEALTH_RATIO;
    case ANT_TYPE.soldier:
        return this.species.chars.reproductionSoldierFoodCost * FOOD_HEALTH_RATIO;
    }
};


/**
 * Calculates the cost of the characteristics due to the species
 * @return {number} - The health cost
 */
Nest.prototype.calcSpeciesCost = function() {
	var specieCost = 0;
	for (prop in CHARS) {
		specieCost += CHARS[prop].healthModifier * this.species.chars[prop];
	}

    return specieCost;
};

/**
 * Determines whether or not it is viable to create a specific type of ant
 * @param {ANT_TYPE} type - Represents a specific type of ant
 * @return {boolean}
 */
Nest.prototype.viable = function(type) {
    // If creating the ant will make the nest hungry then do not create the ant
    if (this.health - (this.getCost(type) + this.calcSpeciesCost()) >= this.hungerThreshold)
        return true;
    else
        return false;
};

/**
 * Creates a new ant
 * @param {ANT_TYPE} type - Represents a specific type of ant
 */
Nest.prototype.createAnt = function(type) {
    var cost = this.getCost(type);
    createAnt(this.species, {
        x: this.coord.x,
        y: this.coord.y
    }, this, cost - this.calcSpeciesCost(), type);
    this.health -= cost;
};

/**
 * Determines what type of ant to create
 */
Nest.prototype.reproduce = function() {
    var prob = Math.random();

    var chars = this.species.chars;

    // Normalize probabilities and then sort into ascending order
    var sum = chars.reproductionQueenProb + chars.reproductionSoldierProb + 
                chars.reproductionWorkerProb;
	if (sum > 0) {
		var queenProb = chars.reproductionQueenProb / sum;
		var soldierProb = chars.reproductionSoldierProb / sum;
		var workerProb = chars.reproductionWorkerProb / sum;
	}

    var ordered = [{
        prob: queenProb,
        type: ANT_TYPE.queen
    }, {
        prob: soldierProb,
        type: ANT_TYPE.soldier
    }, {
        prob: workerProb,
        type: ANT_TYPE.worker
    }].sort(function(a, b) {
        return a.prob - b.prob;
    }); // sort min to max

    // Determine which outcome occurred
    if (prob < ordered[0].prob && this.viable(ordered[0].type))
        this.createAnt(ordered[0].type);
    else if ((prob < ordered[1].prob + ordered[0].prob) && // cumulative probability
                this.viable(ordered[1].type))
        this.createAnt(ordered[1].type);
    else if (prob < ordered[2].prob + ordered[1].prob + ordered[0].prob && 
                this.viable(ordered[2].type))
        this.createAnt(ordered[2].type);
};

Nest.prototype.updateHealth = function() {
    this.health -= this.healthRate;

    if (this.health <= 0) this.die();
};

/**
 * Updates the nest each tick
 */
Nest.prototype.update = function() {
    this.updateHealth();

    if (!this.alive) return void(0);

    // Determines if a new ant should be created or not
    if (Math.random() < this.species.chars.reproductionRate) {
        this.reproduce();
    }
};