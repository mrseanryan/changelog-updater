const fs = require("fs");

export type PackageDetails = {
  version: string;
  lastUpdated: Date;
};

export class PackageParser {
  constructor() {}

  parse(pathToPackageJson: string): PackageDetails {
    const json = fs.readFileSync(pathToPackageJson);
    const packageInfo: any = JSON.parse(json);

    return {
      version: packageInfo.version,
      // TODO look git history to see when was file last changed:
      lastUpdated: new Date()
    };
  }
}
