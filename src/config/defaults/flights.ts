import { type freqNames, commTables } from "./frequencies";

const createFlight = (
  callsign: string,
  number: number,
  type: "F-16CM" | "F-15E" | "F/A-18" | "AH-64D" | "OH-58D" | "F-4E",
  pri: { name: freqNames; number: number } | string,
  sec?: { name: freqNames; number: number } | string,
  ter?: { name: freqNames; number: number } | string, // TODO: Implement after someone explains me where these show up and what these are // Espere
  cx?: { name: freqNames; number: number } | string // If they have no meaning to our Kneeboard, we might just OMIT them.
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
    sec: sec
      ? {
          name: `${typeof sec === "string" ? "" : sec.name}`,
          freq: `${
            typeof sec === "string"
              ? sec
              : commTables[0][sec.name][sec.number - 1]
          }`,
          number: typeof sec === "string" ? "" : sec.number + "",
        }
      : {
          name: "",
          freq: "",
          number: "",
        },
  };
};
// Macro to create Flights selectable via "Pick Callsign".
// TODO: Make component to add and remove flights an persist them via DB
export const flights = [
  // RNLAF 313 SQN
  createFlight(
    "APEX",
    1,
    "F-16CM",
    { name: "RUBY", number: 1 },
    { name: "SILVER", number: 5 }
  ),
  createFlight(
    "CANINE",
    2,
    "F-16CM",
    { name: "IVORY", number: 1 },
    { name: "CARMINE", number: 8 }
  ),
  createFlight(
    "PLASMA",
    3,
    "F-16CM",
    { name: "SAPPHIRE", number: 2 },
    { name: "BLACK", number: 8 }
  ),
  createFlight(
    "CLAW",
    4,
    "F-16CM",
    { name: "VIOLET", number: 7 },
    { name: "BLUE", number: 7 }
  ),
  createFlight(
    "JACKAL",
    5,
    "F-16CM",
    { name: "WHITE", number: 5 },
    { name: "OCHRE", number: 7 }
  ),
  createFlight(
    "TIGER",
    6,
    "F-16CM",
    { name: "KHAKI", number: 5 },
    { name: "PINK", number: 3 }
  ),
  createFlight(
    "BEAST",
    7,
    "F-16CM",
    { name: "VIOLET", number: 1 },
    { name: "BLACK", number: 6 }
  ),
  createFlight(
    "DEMON",
    8,
    "F-16CM",
    { name: "GREEN", number: 7 },
    { name: "CRIMSON", number: 1 }
  ),
  // PolAF 6th SQN

  createFlight(
    "KHARMA",
    1,
    "F-16CM",
    { name: "INDIGO", number: 2 },
    { name: "SAGE", number: 9 }
  ),
  createFlight(
    "DETOX",
    2,
    "F-16CM",
    { name: "MAGENTA", number: 4 },
    { name: "BLACK", number: 5 }
  ),
  createFlight(
    "STALK",
    3,
    "F-16CM",
    { name: "RED", number: 9 },
    { name: "OCHRE", number: 1 }
  ),
  createFlight(
    "ANGRY",
    4,
    "F-16CM",
    { name: "AQUA", number: 5 },
    { name: "SCARLET", number: 8 }
  ),
  createFlight(
    "SKEET",
    5,
    "F-16CM",
    { name: "GOLD", number: 1 },
    { name: "SAPPHIRE", number: 6 }
  ),

  createFlight(
    "BEAVER",
    6,
    "F-16CM",
    { name: "RUBY", number: 6 },
    { name: "BLACK", number: 9 }
  ),
  createFlight(
    "EVADE",
    7,
    "F-16CM",
    { name: "AMBER", number: 6 },
    { name: "EMERALD", number: 2 }
  ),
  createFlight(
    "INSANE",
    8,
    "F-16CM",
    { name: "COBALT", number: 9 },
    { name: "PURPLE", number: 5 }
  ),

  // 494th FS
  createFlight(
    "PANTHER",
    1,
    "F-15E",
    { name: "GOLD", number: 7 },
    { name: "SILVER", number: 8 }
  ),
  createFlight(
    "FLEX",
    2,
    "F-15E",
    { name: "ORANGE", number: 4 },
    { name: "AQUA", number: 5 }
  ),
  createFlight(
    "HAMMER",
    3,
    "F-15E",
    { name: "AQUA", number: 6 },
    { name: "CRIMSON", number: 6 }
  ),
  createFlight(
    "JUNGLE",
    4,
    "F-15E",
    { name: "BLUE", number: 6 },
    { name: "SAPPHIRE", number: 9 }
  ),
  createFlight(
    "BUCK",
    5,
    "F-15E",
    { name: "IVORY", number: 8 },
    { name: "COBALT", number: 4 }
  ),
  createFlight(
    "SLAYER",
    6,
    "F-15E",
    { name: "GREEN", number: 5 },
    { name: "PURPLE", number: 2 }
  ),
  createFlight(
    "WARMAN",
    7,
    "F-15E",
    { name: "AMBER", number: 7 },
    { name: "TEAL", number: 5 }
  ),
  createFlight(
    "DUDE",
    8,
    "F-15E",
    { name: "GARNET", number: 2 },
    { name: "YELLOW", number: 7 }
  ),

  // 212 Carrier People
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

  // ADD Helicopters etc
  createFlight(
    "SNAKE",
    6,
    "AH-64D",
    "",
    { name: "COBALT", number: 3 },
    { name: "BRONZE", number: 3 },
    { name: "RUBY", number: 8 }
  ),
  createFlight(
    "PALEHORSE",
    7,
    "OH-58D",
    "",
    { name: "OCHRE", number: 2 },
    { name: "KHAKI", number: 2 }
  ),

  // F-4E
  createFlight("PHANTOM", 1, "F-4E", { name: "PURPLE", number: 3 }),
  createFlight("RHINO", 2, "F-4E", { name: "PURPLE", number: 8 }),
  createFlight("SMOKEY", 3, "F-4E", { name: "PURPLE", number: 9 }),
];

export type flightType = (typeof flights)[0];

export const F16Flights = flights.filter((flight) => flight.type === "F-16CM");
export const F15Flights = flights.filter((flight) => flight.type === "F-15E");
export const F18Flights = flights.filter((flight) => flight.type === "F/A-18");
