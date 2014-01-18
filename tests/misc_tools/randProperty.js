// ---------- randProperty ----------

/**
* Test case - Test randProperty returns a random property from an object literal
*
* Test data - {a : 0, b : 1, c : 2} [edge case] (run three times)
* Expected  - either 'a', 'b' or 'c'
*/

var randPropertyTest = new testCase('Test randInt returns a value within a specific range');

log('Test randProperty returns a random property from an object literal');
log('    ' + randProperty({a : 0, b : 1, c : 2}));
log('    ' + randProperty({a : 0, b : 1, c : 2}));
log('    ' + randProperty({a : 0, b : 1, c : 2}));


