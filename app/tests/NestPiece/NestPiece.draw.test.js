// ---------- NestPiece.draw ----------
/**
* Test case - Test draw draws the nest piece correctly
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - A single nest piece
* Expected  - A black square
*/

window.onload = function() {

	var NestPieceDrawTest = new testCase('Test draw draws the nest piece correctly');
	NestPieceDrawTest.autorun = true;

	CANVAS_OFFSET = {x : 0, y : 0};
	MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
	CELL_SIZE = {width : 50, height : 50};
	GRID_SIZE = {width : 10, height : 10};
	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
	
	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	var species = {colour : {nest : '#000000'}};
	
	var nest = {};
	nest.species = species;
	
	var testNestPiece = new NestPiece(1, {x : 5, y : 5}, nest);
	testNestPiece.size = CELL_SIZE;

	NestPieceDrawTest.callwith = testNestPiece;

	NestPieceDrawTest.createTest(testNestPiece.draw, [ctx], 'desc', 'A black square');

	NestPieceDrawTest.summery();
}