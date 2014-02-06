/**
 * @class Species
 * @classdesc Represents an ants species
 * @param {integer} id - The unique ant id
 */
var Species = function(id) {
        /**
         * @property {integer} this.id - The unique ant id
         * @property {[Ant object]} this.ants - List of all ants belonging to 
         *              the species (used to provide details to the data panel) 
         *              (default: [])
         * @property {[Nest object]} this.nests - The List of all the nests 
         *              belonging to the species (used to provide details to 
         *              the data panel) (default: [])
         * @property {object} this.chars - The species characteristics which 
         *              influence ants and nests who belong to the species
         * @property {[string]} this.colour - The hexadecimal colours given to 
         *              each type of ant/nest that belongs to the species
         * @property {number} this.mutationRate - The chance that a characteristic 
         *              will be mutated
         */

        this.id = id;

        this.ants = [];
        this.nests = [];

        this.chars = {
            /**
             * @property {number} speed - The speed the ant moves, 1 = 1 Cell 
             *              per tick
             * @property {integer} antennaSize - The range the ant can smell pheromones
             * @property {integer} jawStrength - The strength of the ants jaw 
             *              (determines how much food the ant can carry)
             * @property {integer} jawSize - The amount of damage a soldier ant 
             *              does when attack
             * @property {integer} stingSize - The range which the soldier ant 
             *              can attack
             * @property {integer} eyesight - The range the ant can see items in
             *              front of it
             * @property {number} eyeAngle - The angle of the sector the ant can
             *              see in front of it
             * @property {number} antennaAngle - The angle of the sector the ant
             *              can smell pheromones in front of it
             * @property {number} pheromoneConcentration - The concentration of 
             *              pheromones secreted
             * @property {number} nestCoordMemory - A measure of how well the ant
             *              knows where the nest is, used when navigating to the
             *              nest, represents memory of familiarly landmarks
             *              near the nest
             * @property {number} explorativeInfluence - The likelihood of an ant 
             *              changing direction rather then continue going in
             *              the direction its facing
             * @property {number} pheromoneInfluence - How likely it is that an
             *              ant will follow a pheromones
             * @property {integer} queenStepsMin, queenStepsMax - The range of 
             *              steps the queen will take when navigating to a new
             *              nest site i.e. lower values mean closer nests
             * @property {number} reproductionWorkerProb, reproductionQueenProb, reproductionSoldierProb 
             *              - The probability a particular type of ant will be 
             *              born compared with others
             * @property {integer} reproductionWorkerFoodCost, reproductionQueenFoodCost, reproductionSoldierFoodCost
             *              - The amount of food required to create this type of
             *              ant (This is the amount of food the ant will start with)
             * @property {number} reproductionRate - The chance each tick of
             *              creating a new ant
             */
            speed: 0.25,
            antennaSize: 5,
            jawStrength: 10,
            jawSize: 1,
            stingSize: 1,
            eyesight: 5,
            eyeAngle: Math.PI / 2,
            antennaAngle: Math.PI / 2,
            pheromoneConcentration: 0.4,
            nestCoordMemory: 0.1,
            explorativeInfluence: 0.05,
            pheromoneInfluence: 0.90,
            queenStepsMin: 200,
            queenStepsMax: 800,
            reproductionWorkerProb: 0.5,
            reproductionWorkerFoodCost: 5,
            reproductionQueenProb: 0.05,
            reproductionQueenFoodCost: 25,
            reproductionSoldierProb: 0.1,
            reproductionSoldierFoodCost: 8,
            reproductionRate: 0.05
        };

        this.colour = {
            worker: '#1C1C1C',
            soldier: '#1C1C1C',
            queen: '#1C1C1C',
            nest: '#1C1C1C',
            pheromone: '#1C1C1C'
        };

        this.mutationRate = 0.5;

        this.averageFoodIntake = 0;
    };

/**
 * Mutate a specific characteristic
 * @param {string} characteristic - The characteristic which will be mutated
 * @return {number} - The mutated value of the characteristic
 */
Species.prototype.mutateChar = function(characteristic) {
    var charRange = CHARS[characteristic];

    // Depending on type of value needed return an random integer or random
    // float in a specific range
    if (charRange.type === VALUE_TYPE.integerValue) return randInt(charRange);
    else return randFloat(charRange);
};

/**
 * Mutate a single characteristic in the species
 * @return {Species object} - Returns the new mutated species object
 */
Species.prototype.mutate = function() {
    if (Math.random() <= this.mutationRate) {
        var altChars = clone(this.chars); // Clone the current characteristics
        var altCharacteristic = randProperty(altChars); // pick a random characteristic
                                                            // to alter
        var altValue = this.mutateChar(altCharacteristic);

        altChars[altCharacteristic] = altValue;
        var species = this.createSpecies(altChars);
        return species;
    } else {
        return this; // Otherwise return an non mutated version
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
        worker: colour,
        soldier: colour,
        queen: colour,
        nest: colour,
        pheromone: colour,
    };

    SPECIES_LIST.push(species);
    createSpeciesData(species);

    return species;
};