/**
 * @class FoodSystem
 * @classdesc Controls all the food on the map
 */
var FoodSystem = function() {
        /**
         * @property {min : integer, max : integer} this.variation - The minimum 
         *                  and maximum amounts of food a single piece can contain
         * @property {string} this.colour - The colour of the food
         */

        this.variation = {
            min: 1,
            max: 15
        };
        this.colour = FOOD_COLOUR;
    };

/**
 * Creates a circle of food with reducing amounts around a coordinate
 * @param {x : number, y : number} coord - The coordinate of the centre of the circle
 * @param {integer} radius - The maximum distance a piece of food can be from 
 *                              the centre coord
 */
FoodSystem.prototype.addRandFood = function(coord, radius) {
    var affectedCells = getSector(coord, radius, 0, 2 * Math.PI); // All cells in a circle

    // For each cell, calculate the amount it should have
    for (var i = 0; i < affectedCells.length; i++) {
        var distanceFromCenter = distance(coord, affectedCells[i]);
        var amount = radius - Math.round(distanceFromCenter);
        if (amount >= this.variation.min)   // create food and add to map
            MAP[coordToIndex(affectedCells[i])].food = new Food(this, amount, affectedCells[i]); 
    }
};

/**
 * Adds random amounts of food at random positions in the map
 */
FoodSystem.prototype.addFood = function() {
    for (var i = 0; i < NUM_OF_CELLS; i++) {
        if (Math.random() < FOOD_CHANCE) {
            this.addRandFood(indexToCoord(i), randInt(this.variation));
        }
    }
};