var Species = function(id) {
	this.id = id;
	
	this.ants = [];
	this.nests = [];
		
	this.chars = {
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
			worker : {prob : 0.5, foodCost : 5},
			soldier : {prob : 0.00, foodCost : 0},
			queen : {prob : 0.01, foodCost : 25},
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

Species.prototype.mutateChar = function(characteristic) {
	console.log(characteristic)
	var charRange = CHARS[characteristic];
	
	if (charRange.type === VALUE_TYPE.integerValue)
		return randInt(charRange);
	else
		return randFloat(charRange);
};

Species.prototype.mutate = function() {
	if (Math.random() <= this.mutationRate) {
		var altChars = clone(this.chars);
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
	newSpecies(getDOM('data'), species);
	
	return species;
};