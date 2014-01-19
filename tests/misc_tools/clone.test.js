// ---------- clone ----------

/**
* Test case - Test clone produces an exact clone of an object
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - {a : [1, 2, 3], b : {c : 4, d : '5'}, e : {f : {g : 6}}, h : [['end', 'of', ['object']]]}
* Expected  - {a : [1, 2, 3], b : {c : 4, d : '5'}, e : {f : {g : 6}}, h : [['end', 'of', ['object']]]}
*/

var cloneExactCloneTest = new testCase('Test clone produces an exact clone of an object');

cloneExactCloneTest.createTest(clone, [{a : [1, 2, 3], b : {c : 4, d : '5'}, e : {f : {g : 6}}, h : [['end', 'of', ['object']]]}], 'equal', {a : [1, 2, 3], b : {c : 4, d : '5'}, e : {f : {g : 6}}, h : [['end', 'of', ['object']]]});
cloneExactCloneTest.testAll();

cloneExactCloneTest.summery();

/**
* Test case - Test clone produces a copy of the object i.e. not by reference
* as:
*	var a = {prop1 : 'spam', prop2 : 'eggs'};
*	var b = {prop1 : 'spam', prop2 : 'eggs'};
*	var c = a;	// by reference
*	
*	a === b -> FALSE
*	a === c -> TRUE
*	b === c -> FALSE
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - let b = {a : 1}
* Expected  - {a : 1} != b
*/

var cloneCopyTest = new testCase('Test clone produces a copy of the object i.e. not by reference');
cloneCopyTest.evaluateTo = false;

cloneCopyTest.createTest(clone, [{a : 1}], 'exactlyEqual', {a : 1});
cloneCopyTest.testAll();

cloneCopyTest.summery();

