const createFlight = (
  callsign: string,
  number: number,
  type: "F-16" | "F-15" | "F/A-18"
) => {
  return {
    callsign: callsign,
    number: number,
    type: type,
  };
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
  //createFlight("VICTORY", 1, "F/A-18"), //Note: 212 uses different frequencies taht are off-pattern
  //createFlight("TEMPLAR", 3, "F/A-18"),
  //createFlight("ASSASSIN", 4, "F/A-18"),
  //createFlight("PALADIN", 5, "F/A-18"),
  //createFlight("CRUSADER", 6, "F/A-18"),
  //createFlight("KNIGHT", 7, "F/A-18"),
];

export type flightType = (typeof flights)[0];

export const F16Flights = flights.filter((flight) => flight.type === "F-16");
export const F15Flights = flights.filter((flight) => flight.type === "F-15");
export const F18Flights = flights.filter((flight) => flight.type === "F/A-18");
