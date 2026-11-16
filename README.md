# Freifunk API Generator

## Setup
- Execute `npm ci` to install the prerequisites. If you want to have the latest released versions use `npm install`.
- Execute `npm start` to start the application.

Browse to http://localhost:3000 to see the application in action.

By default the generator loads the current released API spec from GitHub. To test an unreleased spec, set `VITE_SCHEMA_URL`, e.g.:

```
VITE_SCHEMA_URL=https://raw.githubusercontent.com/freifunk/api.freifunk.net/master/specs/development.json npm start
```

## File Structure

Let's briefly have a look at the most important files:

- `src/schema.json` contains the JSON schema (The JSON schema of the generator tool).
- `src/uischema.json` contains the UI schema.

The generator can be previewed at https://freifunk.github.io/generator.api.freifunk.net/
