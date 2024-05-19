import { type freqNames, commTables } from "./frequencies";

const createFlight = (
  callsign: string,
  number: number,
  type: "F-16" | "F-15" | "F/A-18",
  pri: { name: freqNames; number: number } | string,
  sec: { name: freqNames; number: number } | string,
  ter?: { name: freqNames; number: number } | string, // TODO: Implement after someone explains me where these show up and what these are // Espere
  cx?: { name: freqNames; number: number } | string
) => {
  return {
    callsign: callsign,
    number: number,
    type: type,
    pri: {
      name: `${typeof pri === "string" ? "" : pri.name}`,
      freq: `${
        // TODO: replace 0 with selected table when selection becomes an option
        typeof pri === "string" ? pri : commTables[0][pri.name][pri.number - 1]
      }`,
      number: typeof pri === "string" ? "" : pri.number + "",
    },
    sec: {
      name: `${typeof sec === "string" ? "" : sec.name}`,
      freq: `${
        typeof sec === "string" ? sec : commTables[0][sec.name][sec.number - 1]
      }`,
      number: typeof sec === "string" ? "" : sec.number + "",
    },
  };
};

export const flights = [
  createFlight(
    "APEX",
    1,
    "F-16",
    { name: "RUBY", number: 1 },
    { name: "SILVER", number: 5 }
  ),
  createFlight(
    "CANINE",
    2,
    "F-16",
    { name: "IVORY", number: 1 },
    { name: "CARMINE", number: 8 }
  ),
  createFlight(
    "PLASMA",
    3,
    "F-16",
    { name: "SAPPHIRE", number: 2 },
    { name: "BLACK", number: 8 }
  ),
  createFlight(
    "CLAW",
    4,
    "F-16",
    { name: "VIOLET", number: 7 },
    { name: "BLUE", number: 7 }
  ),
  createFlight(
    "JACKAL",
    5,
    "F-16",
    { name: "WHITE", number: 5 },
    { name: "OCHRE", number: 7 }
  ),
  createFlight(
    "TIGER",
    6,
    "F-16",
    { name: "KHAKI", number: 5 },
    { name: "PINK", number: 3 }
  ),
  createFlight(
    "BEAST",
    7,
    "F-16",
    { name: "VIOLET", number: 1 },
    { name: "BLACK", number: 6 }
  ),
  createFlight(
    "DEMON",
    8,
    "F-16",
    { name: "GREEN", number: 7 },
    { name: "CRIMSON", number: 1 }
  ),
  createFlight(
    "PANTHER",
    1,
    "F-15",
    { name: "GOLD", number: 7 },
    { name: "SILVER", number: 8 }
  ),
  createFlight(
    "FLEX",
    2,
    "F-15",
    { name: "ORANGE", number: 4 },
    { name: "AQUA", number: 5 }
  ),
  createFlight(
    "HAMMER",
    3,
    "F-15",
    { name: "AQUA", number: 6 },
    { name: "CRIMSON", number: 6 }
  ),
  createFlight(
    "JUNGLE",
    4,
    "F-15",
    { name: "BLUE", number: 6 },
    { name: "SAPPHIRE", number: 9 }
  ),
  createFlight(
    "BUCK",
    5,
    "F-15",
    { name: "IVORY", number: 8 },
    { name: "COBALT", number: 4 }
  ),
  createFlight(
    "SLAYER",
    6,
    "F-15",
    { name: "GREEN", number: 5 },
    { name: "PURPLE", number: 2 }
  ),
  createFlight(
    "WARMAN",
    7,
    "F-15",
    { name: "AMBER", number: 7 },
    { name: "TEAL", number: 5 }
  ),
  createFlight(
    "DUDE",
    8,
    "F-15",
    { name: "GARNET", number: 2 },
    { name: "YELLOW", number: 7 }
  ),
  //createFlight("VICTORY", 1, "F/A-18"),
  createFlight(
    "TEMPLAR",
    3,
    "F/A-18",
    { name: "SAGE", number: 6 },
    { name: "IVORY", number: 2 }
  ),
  createFlight(
    "ASSASSIN",
    4,
    "F/A-18",
    { name: "GREEN", number: 6 },
    { name: "OLIVE", number: 5 }
  ),
  createFlight(
    "PALADIN",
    5,
    "F/A-18",
    { name: "JADE", number: 3 },
    { name: "GARNET", number: 9 }
  ),
  createFlight(
    "CRUSADER",
    6,
    "F/A-18",
    { name: "GOLD", number: 9 },
    { name: "GOLD", number: 5 }
  ),
  createFlight(
    "KNIGHT",
    7,
    "F/A-18",
    { name: "JADE", number: 4 },
    { name: "COBALT", number: 5 }
  ),
];

export type flightType = (typeof flights)[0];

export const F16Flights = flights.filter((flight) => flight.type === "F-16");
export const F15Flights = flights.filter((flight) => flight.type === "F-15");
export const F18Flights = flights.filter((flight) => flight.type === "F/A-18");
