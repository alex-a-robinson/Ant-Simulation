// ---------- randColour ----------

/**
* Test case - Test randColour generates random colours (3 tests)
* Test data - N/A
* Expected  - To see random colours being generated
*/

var randColourTest = new testCase('Test randColour generates random colours');
randColourTest.createTest(randColour, [], 'desc', 'A HEX colour');
randColourTest.createTest(randColour, [], 'desc', 'A HEX colour');
randColourTest.createTest(randColour, [], 'desc', 'A HEX colour');

randColourTest.testAll();
randColourTest.summery();

