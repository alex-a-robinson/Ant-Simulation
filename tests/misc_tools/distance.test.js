// ---------- distance ----------

/**
* Test case - Check it returns the correct distance
*
*
* GRID_SIZE = {width : 10, height : 10}
*
* Test data - coord1 : {x : 0, y : 0}, coord2 : {x : 0, y : 0} [edge case]
* Expected  - 0
*
* Test data - coord1 : {x : -2, y : 1}, coord2 : {x : 1, y : 5} [functional value]
* Expected  - 5
*/

var distanceTest = new testCase('Check it returns the correct distance');

distanceTest.createTest(distance, [{x : 0, y : 0}, {x : 0, y : 0}], 'equal', 0);
distanceTest.createTest(distance, [{x : -2, y : 1}, {x : 1, y : 5}], 'equal', 5);
distanceTest.testAll();

distanceTest.summery();


