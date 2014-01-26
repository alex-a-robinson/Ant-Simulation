// ---------- randProperty ----------

/**
* Test case - Test randProperty returns a random property from an object literal
*
* Test data - {a : 0, b : 1, c : 2} [edge case] (run three times)
* Expected  - either 'a', 'b' or 'c'
*/

var randPropertyTest = new testCase('Test randProperty returns a random property from an object literal');
randPropertyTest.createTest(randProperty, [{a : 0, b : 1, c : 2}], 'desc', 'A random property from an object literal');
randPropertyTest.createTest(randProperty, [{a : 0, b : 1, c : 2}], 'desc', 'A random property from an object literal');
randPropertyTest.createTest(randProperty, [{a : 0, b : 1, c : 2}], 'desc', 'A random property from an object literal');
randPropertyTest.createTest(randProperty, [{a : 0, b : 1, c : 2}], 'desc', 'A random property from an object literal');
randPropertyTest.createTest(randProperty, [{a : 0, b : 1, c : 2}], 'desc', 'A random property from an object literal');

randPropertyTest.testAll();
randPropertyTest.summery();

