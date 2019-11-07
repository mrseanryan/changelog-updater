import { ChangeLogUpdater, UpdateResult } from "./ChangeLogUpdater";
import { PackageParser } from "./PackageParser";
import { Arguments } from "./Arguments";

const path = require("path");

console.log("changelog-updater");

const rawArgs = process.argv.slice(2);
if (rawArgs.length !== 2) {
  showUsage();
  process.exit(1);
}

const args: Arguments = {
  pathToChangeLog: rawArgs[0],
  pathToHeader: rawArgs[1]
};

function showUsage() {
  console.log("change-log <path to CHANGELOG.md> <path to header template>");
}

function getPathToPackageJson(filePath: string) {
  return path.join(path.dirname(filePath), "package.json");
}

const packageParser = new PackageParser();

const packageDetails = packageParser.parse(
  getPathToPackageJson(args.pathToChangeLog)
);

const updater = new ChangeLogUpdater(args);
updater.update(
  packageDetails.lastUpdated,
  packageDetails.version
).then(result => {
  console.log(
    `Updated CHANGELOG at ${args.pathToChangeLog}: ${UpdateResult[result]}`
  );  
})
.catch(e => console.error(e));
