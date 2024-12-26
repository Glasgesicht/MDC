# MDC

Small project to genertate MDC's from Data import with many contextual presets for the use in the flight simulator "DCS: World"

This is in a heavy WIP state.
The current programm represets a rough scaffold of what this will eventually become.

Currently implemented features include:

1. Full set of Kneeboard pages for export. [Done in collaboration with @github/iProphet]
2. Selective export to JPEG/ZIP for single pages, flights and packages.
3. Save and Load Presets, independently of CF Files.
4. Chooseable Airfields with their properties. 
5. DTC export.
6. Some QOL features, such as fully working Undo/Redo

Current WIP Items

1. Completely adjustable configuration, including the addition and modification of
   1. Squadrons
   2. Flights/Callsigns
   3. Airfields
   4. Weather Presets
2. Utilization of Local Storage (Indexed DB) to preserve changes made without saving/loading .JSONs
3. UI Changes, usability improvements.
4. Addition of better support for different types of aircraft.
5. Web Editor to edit missions from the MDC tool

Later in development, this will also be a include a backend to enhace shareability of MDCs/Mission Data in generall.
Further plans are to include an event planner to host and organise public events more easily.

### to get started:

1. install Node.js from https://nodejs.org/en
2. navigate to project folder
3. install dependencied with `npm install`
4. run project via `npx vite`

Created with by and for [CJTF-13](https://discord.gg/tawdcs)
