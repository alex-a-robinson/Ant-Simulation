/**
 * @class FoodSystem
 * @classdesc Controls all the food on the map
 */
var FoodSystem = function () {
    /**
     * @property {min : integer, max : integer} this.variation - The minimum
     *                  and maximum amounts of food a single piece can contain
     * @property {string} this.colour - The colour of the food
     */

    this.variation = {
        min: 0,
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
FoodSystem.prototype.addFoodBlob = function (coord, radius) {
    var affectedCells = getSector(coord, radius, 0, 2 * Math.PI); // All cells in a circle

    // For each cell, calculate the amount it should have
    for (var i = 0; i < affectedCells.length; i++) {
        var distanceFromCenter = distance(coord, affectedCells[i]);
        var amount = radius - Math.round(distanceFromCenter);
        if (amount >= this.variation.min) // create food and add to map
            MAP[coordToIndex(affectedCells[i])].food = new Food(this, amount, affectedCells[i]);
    }
};

/**
 * Adds random amounts of food at random positions in the map
 */
FoodSystem.prototype.addFood = function () {
    for (var i = 0; i < NUM_OF_CELLS; i++) {
        if (Math.random() < FOOD_CHANCE) {
            this.addFoodBlob(indexToCoord(i), randInt(this.variation));
        }
    }
};

/**
 * Randomly picks pieces of food in the map to grow. The probability of a single
 * piece of food being selected is set in config.js
 */
FoodSystem.prototype.growFood = function () {
    if (Math.random() < FOOD_GROW_RATE) {
        for (var i = 0; i < FOOD_GROW_AMOUNT; i++) {
            // Pick a random index
            var index = randInt({
                min: 0,
                max: NUM_OF_CELLS - 1
            });

            var food = MAP[index].food;

            // Determine if it has food
            if (food !== void(0)) {
                food.grow();
            } else {
                continue;
            }
        }
    }
}