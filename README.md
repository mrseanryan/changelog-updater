# change-log updater

A simple command line tool to update a CHANGELOG.md file, after a package has been published:

- sets the version to match the package.json
- sets the release date to today's date 
- adds new empty Added or Changed sections, ready for the next release

## Usage

```
./go.sh <path to CHANGELOG.md>
```

Example:

```
./go.sh  ./test-data/CHANGELOG.add-and-change.md
```

## License

License = MIT - copyright 2019 Sean Ryan
