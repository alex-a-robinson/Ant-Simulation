// ---------- Ant.takeFood ----------

/**
* Test case - Test ant takes correct amount of food
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*	ANT_FOOD_TAKE_SPEED = 1;
*	A single ant in a static position with piece of food underneith it
*
* Test data - void(0) i.e. No food [functional value]
* Expected  - return 0
*/

var AntTakeFoodTest = new testCase('Test ant takes correct amount of food');
AntTakeFoodTest.autorun = true;

var testAntSpecies = {chars : {pheromoneConcentration : 0.5}};	// simulate a species
var testAnt = new Ant(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 3.67;

AntTakeFoodTest.callwith = testAnt;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
ANT_FOOD_TAKE_SPEED = 1;

createMap();
AntTakeFoodTest.createTest(testAnt.takeFood, [void(0)], 'equal', 0);

createMap();
// Simulate the dummy food
MAP[coordToIndex({x : 25, y : 25})].food = new Food(void(0), 3, {x : 25, y : 25});


AntTakeFoodTest.createTest(testAnt.takeFood, [MAP[coordToIndex({x : 25, y : 25})].food], 'equal', 1);
AntTakeFoodTest.createTest(MAP[coordToIndex({x : 25, y : 25})].food.amount, [], 'equal', 2);

AntTakeFoodTest.createTest(testAnt.takeFood, [MAP[coordToIndex({x : 25, y : 25})].food], 'equal', 1);
AntTakeFoodTest.createTest(MAP[coordToIndex({x : 25, y : 25})].food.amount, [], 'equal', 1);

AntTakeFoodTest.createTest(testAnt.takeFood, [MAP[coordToIndex({x : 25, y : 25})].food], 'equal', 1);
AntTakeFoodTest.createTest(MAP[coordToIndex({x : 25, y : 25})].food, [], 'equal', void(0));

AntTakeFoodTest.createTest(testAnt.takeFood, [MAP[coordToIndex({x : 25, y : 25})].food], 'equal', 0);

AntTakeFoodTest.summery();

/* Previously failed:

OLD FUNCTION
Ant.prototype.takeFood = function(food) {
	if (this.isFood(food)) {	// If food
		food.amount -= 1;	// Take a single piece of food
		this.sleep += ANT_FOOD_TAKE_SPEED;
		
		if (this.isFood(food))	// If food is all gone remove it from the map
			food.removeFromMap();
		
		return 1;
	} else {
		return 0;
	}
};

NEW FUNCTION - added a not on the line if (!this.isFood(food)) as was only taking a single piece befor

Ant.prototype.takeFood = function(food) {
	if (this.isFood(food)) {	// If food
		food.amount -= 1;	// Take a single piece of food
		this.sleep += ANT_FOOD_TAKE_SPEED;
		
		if (!this.isFood(food))	// If food is all gone remove it from the map
			food.removeFromMap();
		
		return 1;
	} else {
		return 0;
	}
};

*/