// ---------- FoodSystem.addFoodBlob ----------

function drawFood(ctx) {
	for (var i = 0; i < NUM_OF_CELLS; i++) {
		if (MAP[i].food !== void(0))
			MAP[i].food.draw(ctx);
	}
}

/**
* Test case - Test that addFoodBlob adds a food blob of correct size
*
* Environment:
*   CANVAS_OFFSET = {x : 0, y : 0};
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - Food blob radius = 5, 
* Expected  - A green circle radius 5 which is darkest in the middle and gets brighter the further out it goes
*
* Test data - Food blob radius = 25, 
* Expected  - A green circle radius 25 which is darkest in the middle and gets brighter the further out it goes
*
* Test data - Food blob radius = 0, 
* Expected  - A green circle radius 5 which is darkest in the middle and gets brighter the further out it goes
*/

window.onload = function() {

	var addFoodBlobTest = new testCase('Test that addFoodBlob adds a food blob of correct size');
	addFoodBlobTest.autorun = true;

	CANVAS_OFFSET = {x : 0, y : 0};
	MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
	CELL_SIZE = {width : 10, height : 10};
	GRID_SIZE = {width : 50, height : 50};
	FOOD_CHANCE = 0.1;
	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
	
	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	var testFoodSystem = new FoodSystem();
	
	addFoodBlobTest.callwith = testFoodSystem;
	
	
	// 1
	createMap();
	
	addFoodBlobTest.createTest(testFoodSystem.addFoodBlob, [{x : 25, y : 25}, 5], 'desc', 'A green circle radius 5 which is darkest in the middle and gets brighter the further out it goes');
	
	drawFood(ctx);
	
	// 2
	createMap();
	
	addFoodBlobTest.createTest(testFoodSystem.addFoodBlob, [{x : 25, y : 25}, 25], 'desc', 'A green circle radius 25 which is darkest in the middle and gets brighter the further out it goes');
	
	drawFood(ctx);
	
	// 3
	createMap();
	
	addFoodBlobTest.createTest(testFoodSystem.addFoodBlob, [{x : 25, y : 25}, 0], 'desc', 'A green circle radius 0 which is darkest in the middle and gets brighter the further out it goes');
	
	drawFood(ctx);

	addFoodBlobTest.summery();
}