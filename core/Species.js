/**
* @class Species
* @classdesc Represents an ants species
* @param {integer} id - The unique ant id
*/
var Species = function(id) {
	/**
	* @property {integer} this.id - The unique ant id
	* @property {[Ant object]} this.ants - List of all ants belonging to the species (used to provide details to the data panel) (default: [])
	* @property {[Nest object]} this.nests - The List of all the nests belonging to the species (used to provide details to the data panel) (default: [])
	* @property {object} this.chars - The species characteristics which influence ants and nests who belong to the species
	* @property {[string]} this.colour - The hexadecimal colours given to each type of ant/nest that belongs to the species
	* @property {number} this.mutationRate - The chance that a characteristic will be mutated
	*/

	this.id = id;
	
	this.ants = [];
	this.nests = [];
		
	this.chars = {
		/**
		* @property {number} speed - The speed the ant moves, 1 = 1 Cell per tick
		* @property {integer} antennaSize - The range the ant can smell pheromones
		* @property {integer} exoSkeletonThickness - N/A
		* @property {integer} jawStrength - N/A
		* @property {integer} jawSize - N/A
		* @property {integer} stingSize - N/A
		* @property {integer} stingSize - N/A
		* @property {integer} eyesight - The range the ant can see items in front of it
		* @property {number} eyeAngle - The angle of the sector the ant can see in front of it
		* @property {number} antennaAngle - The angle of the sector the ant can smell pheromones in front of it
		* @property {number} pheromoneConcentration - The concentration of pheromones secreted
		* @property {number} nestCoordMemory - A measure of how well the ant knows where the nest is, used when navigating to the nest, represents memory of familiarly landmarks near the nest
		* @property {number} exploitativeness - N/A
		* @property {number} pheromoneInfluence - How likely it is that an ant will follow a pheromones
		* @property {min : integer, max : integer} queenSteps - The range of steps the queen will take when navigating to a new nest site i.e. lower values mean closer nests
		* @property {object} reproduction
		*/
		speed : 0,
		antennaSize : 0,
		exoSkeletonThickness : 0,
		jawStrength : 0,
		jawSize : 0,
		stingSize : 0,
		eyesight : 0,
		eyeAngle : 0,
		antennaAngle : 0,
		pheromoneConcentration : 0,
		nestCoordMemory : 0.1,
		exploitativeness : 0.05,
		pheromoneInfluence : 0.95,
		queenSteps : {
			min : 150,
			max : 300
		},
		reproduction : {
			/**
			* @property {prob : number, foodCost : number} worker, soldier, queen  - The probability of creating each type of ant, and the food cost for each type of ant i.e. the amount of food needed to create the ant
			* @property {number} rate - The chance each tick of creating a new ant
			*/
			worker : {prob : 0.5, foodCost : 5},
			soldier : {prob : 0.00, foodCost : 0},
			queen : {prob : 0.1, foodCost : 25},
			rate : 0.05
		}
	};
	
	this.colour = {
		worker : '#1C1C1C',
		soldier : '#0000FF',
		queen : '#FF0000',
		nest : '#1C1C1C',
		pheromone : '#D9D366'
	};
	
	this.mutationRate = 0.5;
};

/**
* Mutate a specific characteristic
* @param {string} characteristic - The characteristic which will be mutated
* @return {number} - The mutated value of the characteristic
*/
Species.prototype.mutateChar = function(characteristic) {
	var charRange = CHARS[characteristic];
	
	// Depending on type of value needed return an random integer or random float in a specific range
	if (charRange.type === VALUE_TYPE.integerValue)
		return randInt(charRange);
	else
		return randFloat(charRange);
};

/**
* Mutate a single characteristic in the species
* @return {Species object} - Returns the new mutated species object
*/
Species.prototype.mutate = function() {
	if (Math.random() <= this.mutationRate) {
		var altChars = clone(this.chars);	// Clone the current characteristics
		var altCharacteristic = randProperty(altChars);
		if (altCharacteristic !== 'reproduction') {		// Altering reproduction rates requires extra logic
			var altValue = this.mutateChar(altCharacteristic);
		
			altChars[altCharacteristic] = altValue;
			var species = this.createSpecies(altChars);
			return species;
		} else {
			return this;
		}
	} else {
		return this;
	}
};

/**
* Creates a new species
* @param {object} chars - The characteristic set of the new species
* @return {Species object} - Returns the new species object
*/
Species.prototype.createSpecies = function(chars) {
	var species = new Species(genID());
	var colour = randColour();

	species.chars = chars;
	species.colour = {
		worker : colour,
		soldier : colour,
		queen : colour,
		nest : colour,
		pheromone : colour,
	};	
	
	SPECIES_LIST.push(species);
	createSpeciesData(species);
	
	return species;
};