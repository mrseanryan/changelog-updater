import { Arguments } from "./Arguments";

const fs = require("fs");
const os = require("os");
const readline = require("readline")

export enum UpdateResult {
  Nothing,
  AddOnly,
  ChangesOnly,
  AddsAndChanges,
  ChangeLogNotFound
}

enum CommentedTokens {
  Unreleased = "Unreleased",
  ReleaseDate = "ReleaseDate",
  Added = "Added",
  Changed = "Changed"
}

export class ChangeLogUpdater {
  constructor(private readonly args: Arguments) {}

  private newLines: string[] = [];
  private hasChanges = false;
  private hasHitReleased = false;

  update(releaseDate: Date, version: string): Promise<UpdateResult> {
    const header = fs.readFileSync(this.args.pathToHeader);

    var lineReader = readline.createInterface({
      input: fs.createReadStream(this.args.pathToChangeLog)
    });

    const releaseDateText = releaseDate.toDateString();

    const self = this;

    return new Promise((resolve, _reject) => {
      lineReader.on("line", (line: string) => {
        const newLine = self.processLine(line, releaseDateText, version);
        if (newLine !== line) {
          self.hasChanges = true;
        }
        self.newLines.push(newLine);
      });

      lineReader.on("close", () => {
        self.saveNewLines(header);

        resolve(
          self.hasChanges ? UpdateResult.AddsAndChanges : UpdateResult.Nothing
        );
      });
    });
  }

  private saveNewLines(header: string) {
    const data = header + os.EOL + this.newLines.join(os.EOL);

    fs.writeFileSync(this.args.pathToChangeLog, data);
  }

  private processLine(
    line: string,
    releaseDate: string,
    version: string
  ): string {
    if (this.isReleasedLine(line)) {
      this.hasHitReleased = true;
    }
    if (this.hasHitReleased) {
      // No need to process the rest of the file:
      return line;
    }

    if (!this.isCommentLine(line)) {
      return line;
    }

    if (line.indexOf(CommentedTokens.ReleaseDate) >= 0) {
      line = line.replace(CommentedTokens.ReleaseDate, releaseDate);
    }

    if (line.indexOf(CommentedTokens.Unreleased) >= 0) {
      line = line.replace(CommentedTokens.Unreleased, version);
    }

    // TODO xxx
    // Squash any un-used sections, and set appropriate result:
    // Added = "Added",
    // Changed = "Changed"

    return line;
  }

  private isCommentLine(line: string): boolean {
    return line.startsWith("#");
  }

  private isReleasedLine(line: string): boolean {
    // examples:
    /*
    # [0.3] - 1 June 2019
    # [2.2]
    # [2.2.3.3]
    # [2]
    */
    const regex = /^#+\s\[[\d\.]+\].*/gm;

    return regex.test(line);
  }
}
