// ---------- Worker.draw ----------
/**
* Test case - Test draw draws the ant correctly
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*	MAX_PHEROMONE_CONCENTRATION = 1;
*	A single ant in a static position with pheromones around it
*
* Test data - Ant carrying food
* Expected  - Black square with white square in the centre
*
* Test data - Ant not carrying food
* Expected  - Black square
*/

window.onload = function() {

	var AntDrawTest = new testCase('Test draw draws the ant correctly');
	AntDrawTest.autorun = true;

	CANVAS_OFFSET = {x : 0, y : 0};
	MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
	CELL_SIZE = {width : 50, height : 50};
	GRID_SIZE = {width : 10, height : 10};
	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
	
	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	var testAnt = new Worker(1, {x : 5, y : 5});
	testAnt.direction = 4.104;
	testAnt.carrying = 1;
	testAnt.size = CELL_SIZE;
	
	AntDrawTest.callwith = testAnt;

	AntDrawTest.createTest(testAnt.draw, [ctx], 'desc', 'Black square with white square in the centre');

	// 2
	testAnt.carrying = 0;
	AntDrawTest.createTest(testAnt.draw, [ctx], 'desc', 'Black square');


	AntDrawTest.summery();

}