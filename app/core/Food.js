/**
 * @class Food
 * @classdesc Represents a single piece of food
 * @param {FoodSystem object} foodSystem - A parent food system
 * @param {integer} amount - The concentration of food the piece has
 * @param {x : number, y : number} coord - The coordinate of the piece of food
 */
var Food = function (foodSystem, amount, coord) {
    /**
     * @property {FoodSystem object} this.foodSystem - The food system which
     * 													controls the food pieces
     * @property {width : number, height : number} this.size - The size in pixels
     * @property {integer} this.amount - The concentration of food the piece has
     * @property {x : number, y : number} this.coord - The coordinate of the
     *                                                      piece of food
     */

    this.foodSystem = foodSystem;
    this.size = CELL_SIZE;
    this.amount = amount;
    this.coord = coord;
};

/**
 * Adds the piece of food to the map
 */
Food.prototype.addToMap = function () {
    var index = coordToIndex(this.coord);
    MAP[index].food = this;
};

/**
 * Removes the piece of food from the map
 */
Food.prototype.removeFromMap = function () {
    var index = coordToIndex(this.coord); // Legal as only one piece of food per cell
    MAP[index].food = void(0);
};

/**
 * Draws the piece of food onto the canvas context
 * @param {canvas context 2d} ctx - The context which the food will be drawn onto
 */
Food.prototype.draw = function (ctx) {
    ctx.globalAlpha = this.amount / this.foodSystem.variation.max; // alter opacity 
    drawRect(ctx, scaleCoord(this.coord), this.size, this.foodSystem.colour);
    ctx.globalAlpha = 1; // reset opacity
};

/**
 * Adds to the amount of all surrounding pieces of food. Creates surrounding
 * food if it dose not exist.
 */
Food.prototype.grow = function () {
    this.amount++; // adds 1 amount to itself
    
    // Gets block around food
    var block = getBlock(this.coord, {
        width: 1,
        height: 1
    });

    // For each piece of food, if already exists add 1 to amount otherwise 
    // create new piece of food.
    for (var i = 0; i < block.length; i++) {
        var food = MAP[coordToIndex(block[i])].food;
        if (food !== void(0)) {
            food.amount++;
        } else {
            MAP[coordToIndex(block[i])].food = new Food(this.foodSystem, 1, block[i]);
        }
    }
}