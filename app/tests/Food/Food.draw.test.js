// ---------- Food.draw ----------
/**
* Test case - Test draw draws a piece of food correctly
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - A single piece of food of amount 1
* Expected  - A piece of food of alpha value 0.2
*
* Test data - A single piece of food of amount 5
* Expected  - A piece of food of alpha value 1
*
* Test data - A single piece of food of amount 0
* Expected  - A piece of food of alpha value 0
*/

window.onload = function() {

	var FoodDrawTest = new testCase('Test draw draws a piece of food correctly');
	var foodSystem =  {colour : '#00FF00', variation : {max : 5}};
	FoodDrawTest.autorun = true;

	CANVAS_OFFSET = {x : 0, y : 0};
	MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
	CELL_SIZE = {width : 50, height : 50};
	GRID_SIZE = {width : 10, height : 10};
	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
	
	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	var testFood = new Food(foodSystem, 1, {x : 5, y : 5});
	testFood.size = CELL_SIZE;
	testFood.amount = 1;
	
	FoodDrawTest.callwith = testFood;

	FoodDrawTest.createTest(testFood.draw, [ctx], 'desc', 'A Pheromone with 0.5 alpha value');

	// 2
	testFood.amount = 5;
	FoodDrawTest.createTest(testFood.draw, [ctx], 'desc', 'No visible pheromones');
	
	// 3
	testFood.amount = 0;
	FoodDrawTest.createTest(testFood.draw, [ctx], 'desc', 'A Pheromone with 1 alpha value');

	FoodDrawTest.summery();
}