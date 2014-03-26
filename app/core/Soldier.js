/**
 * @class Soldier
 * @extends Ant
 * @classdesc Represents a single soldier ant
 */
Soldier.prototype = new Ant(-1, {
    x: void(0),
    y: void(0)
});
Soldier.prototype.constructor = Soldier;
Soldier.prototype.parent = Ant;

/**
 * @constructor
 * @param {integer} id - The unique ant id
 * @param {x : number, y : number} coord - The coordinate of the ant
 */

function Soldier(id, coord) {
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
     *              food then this value and cannot see any food near it, ant
     *              will return to the nest to deposit the food (default: 4)
     * @property {Ant object} this.targetAnt - The enemy ant which the soldier
     *              is targeting to attack (default: void(0))
     * @property {boolean} this.moving - Used for determining when an ant is in
     *              a static position i.e. guarding the nest (default:false)
     * @property {integer} this.steps - Used for moving an ant a certain number
     *              of steps away from an object. Used for spreading out closely
     *              spaced soldier ants (default: *random integer*)
     * @property {boolean} this.nearNest - Determines if an ant is close to the
     *              nest (even if It cannot see it) (default: false)
     * @property {boolean} this.nearFood - Determines if an ant is close to food
     *              (even if It cannot see it) (default: false)
     */
    this.id = id;
    this.coord = coord;
    this.type = ANT_TYPE.soldier;

    this.direction = randDir();
    this.prioritizeDirection = randDir();

    this.targetAnt = void(0);

    this.moving = true;
    this.steps = 0;
    this.nearNest = false;
    this.nearFood = false;
}

/**
 * Determines if there are other friendly soldiers in view
 * @return {boolean}
 */
Soldier.prototype.soldiersInView = function () {
    for (var i = 0; i < this.itemsInView.ants.length; i++) {
        if (this.itemsInView.ants[i].type === ANT_TYPE.soldier &&
            this.itemsInView.ants[i].species === this.species &&
            this.itemsInView.ants[i] !== this) {
            return true;
        }
    }

    return false;
};

/**
 * Determines if an ant can see food
 * @return {boolean}
 */
Soldier.prototype.seeFood = function () {
    if (this.itemsInView.food.length > 0) 
        return true;
    else 
        return false;
};

/**
 * Chooses which ant the soldier should target
 */
Soldier.prototype.pickTarget = function () {
    if (this.targetAnt === void(0)) { // If don't already have a target
        this.targetAnt = void(0);
        for (var i = 0; i < this.itemsInView.ants.length; i++) {
            var ant = this.itemsInView.ants[i];
            // If the ant or nest is of a different species
            if (this.species !== ((ant.type === ANT_TYPE.nest) ? ant.nest.species : ant.species)) {
                this.targetAnt = ant; // Set it as the target
                break; // Pick first ant in list
            }
        }
    }
};

/**
 * Sets the ants direction to intercept the path of the target ant, so that
 * it can attack
 */
Soldier.prototype.follow = function () {
    if (this.targetAnt !== void(0)) {
        this.direction = angleTo(this.coord, this.targetAnt.coord);
        this.prioritizeDirection = this.direction;
    }
};

/**
 * Attacks a specific ant
 */
Soldier.prototype.attack = function () {
    var dist = distance(this.coord, this.targetAnt.coord);
    if (dist <= this.species.chars.stingSize) { // If the ant is in range
        // Do a damage (negative health) to the ant
        this.targetAnt.health -= this.species.chars.jawSize * DAMAGE_MULTIPLIER;
        if (this.targetAnt.health <= 0) { // If the ant has died
            this.targetAnt.removeFromMap();
            this.targetAnt.die();
            this.targetAnt = void(0);
        }
    } else if (dist > SOLDIER_ANT_MAX_TARGET_DISTANCE) { // Stop targeting if far away
        this.targetAnt = void(0);
    }
};

/**
 * Updates the soldiers ants health
 */
Soldier.prototype.updateHealth = function () {
    this.health -= this.healthRate;
    if (this.isHungry()) {
        this.GOAL = GOAL.findFood;
    }

    if (this.health <= 0) 
        this.die();
};

/**
 * Updates the this.steps variable
 */
Soldier.prototype.updateSteps = function () {
    if (this.steps > 0) this.steps -= 1;
};

/**
 * Controls soldiers logic if assigned goal of guarding the nest
 */
Soldier.prototype.guardNest = function () {
    if (this.nearNest) { // If the ant is close to the nest
        if (this.steps <= 0 && !this.soldiersInView()) { // and no soldiers in view
            this.moving = false;
            this.direction += TURN_RATE; // slowly turn i.e. observing surroundings
        } else if (this.soldiersInView()) { // If soldiers in view, keep moving
            this.nearNest = false;
        }
    } else if (this.seeNest() && !this.atNest()) { // If near the nest, move a
        // specific number of steps away
        this.nearNest = true;
        this.steps = NEST_GUARD_RADIUS;
    } else { // Otherwise, keep looking for the nest
        this.wonder();
        this.moving = true;

    }
};

/**
 * Controls soldiers logic if assigned goal of guarding the pheromone trials
 */
Soldier.prototype.guardPheromone = function () {
    this.wonder(); // wonder around following pheromone trials if found
    this.moving = true;
};

/**
 * Controls soldiers logic if assigned goal of guarding food
 */
Soldier.prototype.guardFood = function () {
    if (this.seeFood() && !this.soldiersInView()) { // If close to food and no other 
        // soldiers in view
        this.moving = false;
        this.direction += TURN_RATE; // slowly turn i.e. observing surroundings
    } else { // Otherwise, keep looking
        this.wonder();
        this.moving = true;
    }
};

/**
 * Controls soldiers logic if it is looking for food
 */
Soldier.prototype.findFood = function () {
    this.wonder();
    this.findFoodTarget();
    if (this.target !== void(0)) {
        this.getFood();
    }
};

/**
 * Performs the actions required to complete a task
 */
Soldier.prototype.doTask = function () {

    switch (this.goal) {

    case GOAL.guardNest:
        this.guardNest();
        break;

    case GOAL.guardPheromone:
        this.guardPheromone();
        break;

    case GOAL.guardFood:
        this.guardFood();
        break;

    case GOAL.attack:
        this.moving = true;
        this.follow();
        this.attack();
        break;
    case GOAL.findFood:
        this.findFood();
    }
};

/**
 * Determines if a goal has been completed or not and updates the next goal
 * for the ant
 */
Soldier.prototype.updateGoal = function () {
    switch (this.goal) {
    case GOAL.none:
        this.goal = randInt({
            min: GOAL.guardNest,
            max: GOAL.guardFood
        });
        break;

    case GOAL.guardNest:
        if (this.targetAnt !== void(0)) // attack interupts task
            this.goal = GOAL.attack;
        break;

    case GOAL.guardPheromone:
        if (this.targetAnt !== void(0))
            this.goal = GOAL.attack;
        break;

    case GOAL.guardFood:
        if (this.targetAnt !== void(0))
            this.goal = GOAL.attack;
        break;

    case GOAL.attack:
        if (this.targetAnt === void(0)) // If killed/lost targetAnt, new random goal
            this.goal = randInt({
                min: GOAL.guardNest,
                max: GOAL.guardFood
            });
        break;
    case GOAL.findFood:
        if (!this.isHungry()) // If not hungry choose a random new goal
            this.goal = randInt({
                min: GOAL.guardNest,
                max: GOAL.guardFood
            });
        break;
    }
};

/**
 * Draw the ant onto the canvas context
 */
Soldier.prototype.draw = function (ctx) {
    var scaledCoord = scaleCoord(this.coord); // Scale the coordinates so they 
    // map to pixels rather then cells

    ctx.save();

    var crossColour = (this.goal === GOAL.attack) ? '#FF0000' : '#FFFFFF';

    // Translate and rotate the canvas (done so can draw at an angle)
    ctx.translate(scaledCoord.x + this.size.width / 2, scaledCoord.y + this.size.height / 2);
    ctx.rotate(this.direction);

    // Draw the main soldiers body
    drawRect(ctx, {
        x: -this.size.width / 2,
        y: -this.size.height / 2
    }, this.size, this.colour);

    // Draws a cross onto the ant
    drawLine(ctx, {
        x: -this.size.width / 4,
        y: -this.size.height / 4
    }, {
        x: this.size.width / 4,
        y: this.size.height / 4
    }, crossColour, 1);
    drawLine(ctx, {
        x: -this.size.width / 4,
        y: this.size.height / 4
    }, {
        x: this.size.width / 4,
        y: -this.size.height / 4
    }, crossColour, 1);

    ctx.restore();
};

/**
 * Update the ant each tick
 */
Soldier.prototype.update = function () {
    this.removeFromMap(); // Remove from map as ant may move

    this.updateHealth();

    // May have died during the updateHealth so no need to continue if dead
    if (!this.alive) 
        return void(0);

    this.scan();
    this.smell();

    this.pickTarget(); // Look for potential ants to attack

    this.doTask();
    this.updateGoal();

    this.updateSleep();
    this.updateSteps();

    if (this.moving) 
        this.move();

    this.addToMap(); // Once moved add back to map
};