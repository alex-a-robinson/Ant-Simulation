// ---------- Pheromone.draw ----------
/**
* Test case - Test draw draws the pheromone correctly
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - A single pheromone of concentration 0.5
* Expected  - A Pheromone with 0.5 alpha value
*
* Test data - A single pheromone of concentration 0
* Expected  - No visible pheromones
*
* Test data - A single pheromone of concentration 1
* Expected  - A Pheromone with 1 alpha value
*/

window.onload = function() {

	var PheromoneDrawTest = new testCase('Test draw draws the pheromone correctly');
	var species =  {colour : {pheromone : '#FF0000'}};
	PheromoneDrawTest.autorun = true;

	CANVAS_OFFSET = {x : 0, y : 0};
	MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
	CELL_SIZE = {width : 50, height : 50};
	GRID_SIZE = {width : 10, height : 10};
	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
	
	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	var testPheromone = new Pheromone(1, {x : 5, y : 5});
	testPheromone.species = species;
	testPheromone.size = CELL_SIZE;
	testPheromone.concentration = 0.5;
	
	PheromoneDrawTest.callwith = testPheromone;

	PheromoneDrawTest.createTest(testPheromone.draw, [ctx], 'desc', 'A Pheromone with 0.5 alpha value');

	// 2
	testPheromone.concentration = 0;
	PheromoneDrawTest.createTest(testPheromone.draw, [ctx], 'desc', 'No visible pheromones');
	
	// 3
	testPheromone.concentration = 1;
	PheromoneDrawTest.createTest(testPheromone.draw, [ctx], 'desc', 'A Pheromone with 1 alpha value');


	PheromoneDrawTest.summery();
}