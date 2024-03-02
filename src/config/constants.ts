const createFlight = (
  callsign: String,
  number: Number,
  type: "F-16" | "F-15" | "F/A-18"
) => {
  switch (type) {
    case "F-16":
      return {
        Callsign: `${callsign} ${number}`, // callsign + ' ' + number
        callsignRaw: callsign,
        number: number,
        UHF: `267.${number}0`,
        VHF: `141.${number}0`,
        type: type,
      };
    case "F-15":
      return {
        Callsign: `${callsign} ${number}`, // callsign + ' ' + number
        callsignRaw: callsign,
        number: number,
        UHF: `269.${number}0`,
        VHF: `144.${number}0`,
        type: type,
      };
    case "F/A-18":
      return {
        Callsign: `${callsign} ${number}`, // callsign + ' ' + number
        callsignRaw: callsign,
        number: number,
        UHF: `267.${number}0`,
        VHF: `141.${number}0`,
        type: type,
      };
  }
};

export const flights = [
  createFlight("APEX", 1, "F-16"),
  createFlight("CANINE", 2, "F-16"),
  createFlight("PLASMA", 3, "F-16"),
  createFlight("CLAW", 4, "F-16"),
  createFlight("JACKAL", 5, "F-16"),
  createFlight("TIGER", 6, "F-16"),
  createFlight("BEAST", 7, "F-16"),
  createFlight("DEMON", 8, "F-16"),
  createFlight("PANTHER", 1, "F-15"),
  createFlight("FLEX", 2, "F-15"),
  createFlight("HAMMER", 3, "F-15"),
  createFlight("JUNGLE", 4, "F-15"),
  createFlight("BUCK", 5, "F-15"),
  createFlight("SLAYER", 6, "F-15"),
  createFlight("WARMAN", 7, "F-15"),
  createFlight("COUGAR", 8, "F-15"),
];

export const rnlaf313members: Array<{ callsign: string; tailnr: number }> = [
  {
    callsign: "Espere",
    tailnr: 894,
  },
];

export const F16Flights = flights.filter((flight) => flight.type === "F-16");
export const F15Flights = flights.filter((flight) => flight.type === "F-15");

/*type Package = Array<{
  callsign: flightConfig;
  plightplan: Array<{
    steerpointnr: number;
    Coordinates: String;
    timeOnStation: String;
  }>;
}>;
*/
