/**
 * @class Worker
 * @extends Ant
 * @classdesc Represents a single worker ant
 */
Worker.prototype = new Ant(-1, {
    x: void(0),
    y: void(0)
});
Worker.prototype.constructor = Worker;
Worker.prototype.parent = Ant;

/**
 * @constructor
 * @param {integer} id - The unique ant id
 * @param {x : number, y : number} coord - The coordinate of the ant
 */

function Worker(id, coord) {
    /**
     * @property {integer} this.id - The unique ant id
     * @property {x : number, y : number} this.coord - The coordinate of the ant
     * @property {ANT_TYPE : integer} this.type - The type of ant i.e. Queen ant
     *              (default: ANT_TYPE.queen)
     * @property {number} this.direction - The direction in radians from the
     *              vertical axis clockwise (default: *random direction*)
     * @property {number} this.prioritizeDirection - The direction the ant will
     *              general move, used to get straighter more realistic paths
     *              (default: *random direction*)
     * @property {integer} this.carrying - The amount of food the ant is carrying
     *              (default: 0)
     * @property {integer} this.carryingThreshold - If an ant is carrying more
     *              food then this value and cannot see any food near it,
     *              ant will return to the nest to deposit the food (default: 4)
     */
    this.id = id;
    this.coord = coord;
    this.type = ANT_TYPE.worker;

    this.direction = randDir();
    this.prioritizeDirection = randDir();

    this.carrying = 0;
    this.carryingThreshold = 0.4;
}

/**
 * Determines if an ant can carry food or not
 * @return {boolean}
 */
Worker.prototype.canCarry = function () {
    if (this.carrying < this.species.chars.jawStrength) 
        return true;
    else 
        return false;
};

/**
 * Navigate towards the nest and deposit food at the nest
 */
Worker.prototype.depositeFood = function () {
    if (this.atNest()) { // Deposit food when at the nest
        if (this.dropFood(this.nest)) {
            this.goal = GOAL.findFood;
            this.target = void(0);
        }
    } else if (this.seeNest()) { // If can see the nest, head straight towards it
        this.direction = angleTo(this.coord, this.nest.coord);
    } else {
        if (Math.random() < this.species.chars.nestCoordMemory) // Ant has a sense of the
        // direction of the nest
            this.prioritizeDirection = angleTo(this.coord, this.nest.coord);

        this.wonder(); // If not cannot see the nest, walk around randomly
    }
};

/**
 * Drop food at the nest
 * @return {boolean} - True if there is no more food to drop off
 */
Worker.prototype.dropFood = function (nest) {
    if (this.carrying > 0) {
        nest.health += 1 * FOOD_HEALTH_RATIO;
        this.carrying -= 1;
        this.sleep += ANT_FOOD_DROP_SPEED;
    }
    if (this.carrying > 0) return false;
    else return true;

};

/**
 * Determines the best use of food - Eating it or Carrying it
 */
Worker.prototype.useFood = function () {
    var index = coordToIndex(this.coord);
    var food = MAP[index].food;

    if (this.hungry && this.isFood(food)) // Eat the food (this.ifFood(food) 
    // needed to check the food still exists
    // as another ant may have taken it)
        this.health += this.takeFood(food) * FOOD_HEALTH_RATIO;
    else if (this.canCarry() && this.isFood(food)) // Carry the food
        this.carrying += this.takeFood(food);
    else // Food is not there/cannot be carried
        this.target = void(0);
};

/**
 * Performs the actions required to complete a task
 */
Worker.prototype.doTask = function () {
    switch (this.goal) {
    case GOAL.findFood:
        this.wonder();
        this.findFoodTarget();
        break;

    case GOAL.getFood:
        this.getFood();
        break;

    case GOAL.dropFood:
        this.depositeFood();
        this.secrete();
        break;
    }
};

/**
 * Determines if a goal has been completed or not and updates the next goal
 * for the ant
 */
Worker.prototype.updateGoal = function () {
    switch (this.goal) {

    case GOAL.none:
        this.goal = GOAL.findFood;
        break;

    case GOAL.findFood:
        if (this.target !== void(0)) // If found a target
            this.goal = GOAL.getFood;
        break;

    case GOAL.getFood:
        // If have enough food, drop it off at the nest
        if (this.carrying >= Math.floor(this.carryingThreshold * this.species.chars.jawStrength)) {
            this.goal = GOAL.dropFood;
            this.target = void(0);
        } else if (this.target === void(0)) { // If the food has been taken by another
            // ant, go back to looking for food
            this.goal = GOAL.findFood;
        }

        break;

    case GOAL.dropFood:
        this.target = void(0);
        break;
    }
};

Worker.prototype.updateHealth = function () {
    if (this.isHungry() && this.carrying > 0) { // If got food and hungry, eat food
        this.health += this.carrying * FOOD_HEALTH_RATIO;
        this.carrying = 0;
        this.goal = GOAL.none;
    }

    this.health -= this.healthRate;

    if (this.health <= 0) 
        this.die();
};

/**
 * Draw the ant onto the canvas context
 */
Worker.prototype.draw = function (ctx) {
    var scaledCoord = scaleCoord(this.coord); // Scale the coordinates so they
    // map to pixels rather then cells

    ctx.save();

    // Translate and rotate the canvas (done so can draw at an angle)
    ctx.translate(scaledCoord.x + this.size.width / 2, scaledCoord.y + this.size.height / 2);
    ctx.rotate(this.direction);
    drawRect(ctx, {
        x: -this.size.width / 2,
        y: -this.size.height / 2
    }, this.size, this.colour);
    if (this.carrying > 0) {
        drawRect(ctx, {
            x: -this.size.width / 4,
            y: -this.size.height / 4
        }, {
            width: this.size.width / 2,
            height: this.size.height / 2
        }, FOOD_COLOUR);
    }
    ctx.restore();
};

/**
 * Update the ant each tick
 */
Worker.prototype.update = function () {
    this.removeFromMap(); // Remove from map as ant may move
    this.updateHealth();

    // May have died during the updateHealth so no need to continue if dead
    if (!this.alive) 
        return void(0);

    this.scan();
    this.smell();

    this.doTask();
    this.updateGoal();

    this.updateSleep();

    this.move();

    this.addToMap(); // Once moved add back to map
};