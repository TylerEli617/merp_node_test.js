var Test = require("merp_test.js");

var fs = require("fs");
var path = require("path");

var runTestSuites = Test.runTestSuites;

function findAndRunTestSuites(initialDirectory, print, testsDone)
{
    var defferCount = 0;
    var fileList = [];
    var suiteResultCollection = [];

    if (typeof initialDirectory === "undefined")
    {
        initialDirectory = path.join(process.cwd(), "tests");
    }

    if (typeof testsDone !== "function")
    {
        testsDone = function(){};
    }

    function addFileToList(file)
    {
        file = String(file);

        if (file.indexOf(".js", file.length - 3) !== -1)
        {
            fileList.push(file);
        }
    }

    function findTest(directory)
    {
        function readDirectoryCallback(error, list)
        {
            defferCount--;

            if (error)
            {
                throw error;
            }

            function processEntry(entry)
            {
                var path = directory + "/" + entry;

                function processEntryStat(statError, stat)
                {
                    defferCount--;

                    if (statError)
                    {
                        throw statError;
                    }

                    if (stat && stat.isDirectory())
                    {
                        findTest(path);
                    }
                    else
                    {
                        addFileToList(path);
                    }
                }

                defferCount++;
                fs.stat(path, processEntryStat);
            }

            list.forEach(processEntry);
        }

        defferCount++;
        fs.readdir(directory, readDirectoryCallback);
    }

    function finishrunTestSuites()
    {
        if (defferCount == 0)
        {
            var moduleList = [];

            function addModule(fileName)
            {
                moduleList.push(require(fileName));
            }

            fileList.forEach(addModule);

            runTestSuites(moduleList, print, testsDone);
        }
        else
        {
            setTimeout(finishrunTestSuites, 0);
        }
    }

    findTest(initialDirectory);
    setTimeout(finishrunTestSuites, 0);
}

exports.findAndRunTestSuites = findAndRunTestSuites;

function simpleExit()
{
    process.exit();
}

if (require.main === module)
{
    findAndRunTestSuites(path.join(process.cwd(), "tests"), console.log, simpleExit);
}
