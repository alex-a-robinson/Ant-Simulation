// Species class
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
		pheromoneConcentration : 0,
		reproduction : {
			worker : {prob : 0.80, foodCost : 5},		// 80 % of the time create a worker
			soldier : {prob : 0.15, foodCost : 15},
			queen : {prob : 0.05, foodCost : 50},
		}
	};
	
	this.colour = {
		worker : '#1C1C1C',
		soldier : '#1C1C1C',
		queen : '#1C1C1C',
		nest : '#1C1C1C',
		pheromone : '#D9D366'
	}
};

// Functions may be needed in the future:
/*
// Checks if any characteristics mutate and Mutates a particular characteristic
// This should create a new species rather then modifying the exsitsing one!  <------
Species.prototype.mutate = function() {
	if (Math.random() <= this.mutationRate) {	// See if it is bellow the mutation threshold.  While loop giving each characteristic a chance to mutate??
		var characteristic = randProperty(this.chars);
		var charRange = CHAR_RANGE[characteristic];
		if (charRange.type === VALUE_TYPE.integerValue)	// If characteristic requires a integer
			this.chars[characteristic] = randInt(charRange.min, charRange.max);
		else	// if characteristic requires a float
			this.chars[characteristic] = Math.random();
	}
};
*/