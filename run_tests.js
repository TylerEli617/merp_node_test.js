var NodeTest = require("./index.js");

var path = require("path");

var print = console.log;

findAndRunTestSuites = NodeTest.findAndRunTestSuites;

function countResults(results)
{
    var count = 0;

    for (var suiteIndex = 0; suiteIndex < results.testSuiteResults.length; suiteIndex++)
    {
        count += results.testSuiteResults[suiteIndex].testCaseResults.length;
    }

    return count;
}

function countPassedResults(results)
{
    var count = 0;

    for (var suiteIndex = 0; suiteIndex < results.passedTestSuiteResults.length; suiteIndex++)
    {
        count += results.passedTestSuiteResults[suiteIndex].passedTestCaseResults.length;
    }

    return count;
}

function countFailedResults(results)
{
    var count = 0;

    for (var suiteIndex = 0; suiteIndex < results.failedTestSuiteResults.length; suiteIndex++)
    {
        count += results.failedTestSuiteResults[suiteIndex].failedTestCaseResults.length;
    }

    return count;
}

function printFailed(results)
{
    for (var suiteIndex = 0; suiteIndex < results.failedTestSuiteResults.length; suiteIndex++)
    {
        var suite = results.failedTestSuiteResults[suiteIndex];

        for (var caseIndex = 0; caseIndex < suite.failedTestCaseResults.length; caseIndex++)
        {
            print(suite.failedTestCaseResults[caseIndex]);
        }
    }
}

function testsDone(results)
{
    var totalTests = countResults(results);
    var passedTests = countPassedResults(results);
    var failedTests = countFailedResults(results);

    print("Ran    : " + totalTests);
    print("Passed : " + passedTests);
    print("Failed : " + failedTests);

    printFailed(results);

    if (module.simpleTestRan && (failedTests === 0))
    {
        process.exit(0);
    }
    else
    {
        process.exit(1);
    }
}

module.simpleTestRan = false;

if (require.main === module)
{
    findAndRunTestSuites(path.join(process.cwd(), "tests"), print, testsDone);
}
