// ---------- Queen.draw ----------
/**
* Test case - Test draw draws the queen correctly
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - A single queen ant
* Expected  - A black circle
*/

window.onload = function() {

	var QueenDrawTest = new testCase('Test draw draws the queen correctly');
	QueenDrawTest.autorun = true;

	CANVAS_OFFSET = {x : 0, y : 0};
	MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
	CELL_SIZE = {width : 50, height : 50};
	GRID_SIZE = {width : 10, height : 10};
	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
	
	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	var species = {}
	
	var testAnt = new Queen(1, {x : 5, y : 5});
	testAnt.direction = 4.104;
	testAnt.size = CELL_SIZE;
	
	QueenDrawTest.callwith = testAnt;

	QueenDrawTest.createTest(testAnt.draw, [ctx], 'desc', 'A black circle');

	QueenDrawTest.summery();
}