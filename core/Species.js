var Species = function(id) {
	this.id = id;
		
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
		reproduction : {
			worker : {prob : 0.80, foodCost : 5},		// 80 % of the time create a worker
			soldier : {prob : 0.15, foodCost : 15},
			queen : {prob : 0.1, foodCost : 50},
		}
	};
	
	this.colour = {
		worker : '#1C1C1C',
		soldier : '#1C1C1C',
		queen : '#FF0000',
		nest : '#1C1C1C',
		pheromone : '#D9D366'
	};
	
	this.mutationRate = 0.5;
};

Species.prototype.mutateChar = function(characteristic) {
	console.log(characteristic)
	var charRange = CHAR_RANGE[characteristic];
	
	if (charRange.type === VALUE_TYPE.integerValue)
		return randInt(charRange);
	else
		return randFloat(charRange);
};

Species.prototype.mutate = function() {
	if (Math.random() <= this.mutationRate) {
		var altChars = this.chars;
		var altCharacteristic = randProperty(altChars);
		if (altCharacteristic !== 'reproduction') {		// Altering reproduction rates requires extra logic
			var altValue = this.mutateChar(altCharacteristic);
		
			altChars[altCharacteristic] = altValue;
			var species = this.createSpecies(altChars);
			return species;
		}
	} else {
		return this;
	}
};

Species.prototype.createSpecies = function(chars) {
	var species = new Species(genID());
	species.chars = chars;
	species.colour = {
		worker : '#FF0000',
		soldier : '#FF0000',
		queen : '#FF0000',
		nest : '#FF0000',
		pheromone : '#FF0000',
	};	
	
	return species;
};