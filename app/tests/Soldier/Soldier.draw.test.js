// ---------- Soldier.draw ----------
/**
* Test case - Test draw draws the soldier correctly
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - A single soldier ant
* Expected  - A black square with a white cross over it in the centre
*/

window.onload = function() {

	var SoldierDrawTest = new testCase('Test draw draws the soldier correctly');
	SoldierDrawTest.autorun = true;

	CANVAS_OFFSET = {x : 0, y : 0};
	MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
	CELL_SIZE = {width : 50, height : 50};
	GRID_SIZE = {width : 10, height : 10};
	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
	
	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	var testAnt = new Soldier(1, {x : 5, y : 5});
	testAnt.direction = 4.104;
	testAnt.size = CELL_SIZE;
	
	SoldierDrawTest.callwith = testAnt;

	SoldierDrawTest.createTest(testAnt.draw, [ctx], 'desc', 'A black square with a white cross over it in the centre');

	SoldierDrawTest.summery();
}