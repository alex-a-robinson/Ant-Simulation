// ---------- FoodSystem.addFood ----------

function drawFood(ctx) {
	for (var i = 0; i < NUM_OF_CELLS; i++) {
		if (MAP[i].food !== void(0))
			MAP[i].food.draw(ctx);
	}
}

/**
* Test case - Test that addFood adds random looking food all over the map
*
* Environment:
*   CANVAS_OFFSET = {x : 0, y : 0};
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - Run three times
* Expected  - Random looking placement of food throughout the map
*/

window.onload = function() {

	var addFoodTest = new testCase('Test that addFood adds random looking food all over the map');
	addFoodTest.autorun = true;

	CANVAS_OFFSET = {x : 0, y : 0};
	MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
	CELL_SIZE = {width : 10, height : 10};
	GRID_SIZE = {width : 50, height : 50};
	FOOD_CHANCE = 0.1;
	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
	
	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	var testFoodSystem = new FoodSystem();
	
	addFoodTest.callwith = testFoodSystem;
	
	
	// 1
	createMap();
	
	addFoodTest.createTest(testFoodSystem.addFood, [], 'desc', 'Random looking placement of food throughout the map');
	
	drawFood(ctx);
	
	// 2
	createMap();
	
	addFoodTest.createTest(testFoodSystem.addFood, [], 'desc', 'Random looking placement of food throughout the map');
	
	drawFood(ctx);
	
	// 3
	createMap();
	
	addFoodTest.createTest(testFoodSystem.addFood, [], 'desc', 'Random looking placement of food throughout the map');
	
	drawFood(ctx);

	addFoodTest.summery();
}