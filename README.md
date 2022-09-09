# Read CI Flag

This GitHub Action will parse a pull request description to look for a special
text flag that controls the desired CI jobs.

The action scans the description text for a line that begins with a special
prefix (`label`), optionally followed by a colon. The label is followed by a
list of one or more flags, delimited by whitespace and/or commas. The label and
flags are case-insensitive.

For example, if the action is run with `label: Silo Mode`, then the following
description would have the flags `control` and `all`:

> Fix a regression from #94054 so that signing in no longer causes the database
> to be dropped.
>
> Silo Mode: control, all
>
> Depends on #93383.

## Using

### Inputs

* `appId`: GitHub App ID to read the pull request.
* `privateKey`: GitHub App private key to read the pull request.
* `label`: The prefix that designates a line in the pull request description to
  contain the flags.
* `targets`: A list of one or more flag values to check for.

### Outputs

* `isFlagPresent`: A boolean value indicating whether one or more of the target
  flags were found in the pull request's description.

## Developing

Install the dependencies  
```bash
$ yarn install
```

Build the typescript and package it for distribution
```bash
$ yarn dist
```

Run the tests :heavy_check_mark:  
```bash
$ yarn test
```
