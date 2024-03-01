/*export const flights = [
  "APEX 1",
  "CANINE 2",
  "PLASMA 3",
  "CLAW 4",
  "JACKAL 5",
  "TIGER 6",
  "BEAST 7",
  "DEMON 8",

  "PANTHER 1",
  "FLEX 2",
  "HAMMER 3",
  "JUNGLE 4",
  "BUCK 5",
  "SLAYER 6",
  "WARMAN 7",
  "COUGAR 8",
];
*/

const createFlight = (
  callsign: String,
  number: Number,
  type: "F-16" | "F-15" | "F/A-18"
) => {
  switch (type) {
    case "F-16":
      return {
        Callsign: `${callsign} ${number}`, // callsign + ' ' + number
        UHF: `267.${number}0`,
        VHF: `141.${number}0`,
        type: type,
      };
    case "F-15":
      return {
        Callsign: `${callsign} ${number}`, // callsign + ' ' + number
        UHF: `267.${number}0`,
        VHF: `141.${number}0`,
        type: type,
      };
    case "F/A-18":
      return {
        Callsign: `${callsign} ${number}`, // callsign + ' ' + number
        UHF: `267.${number}0`,
        VHF: `141.${number}0`,
        type: type,
      };
  }
};

export const flights = [createFlight("Apex", 1, "F-16")];

const f16s = flights.filter((flight) => flight.type === "F-16");

/*type Package = Array<{
  callsign: flightConfig;
  plightplan: Array<{
    steerpointnr: number;
    Coordinates: String;
    timeOnStation: String;
  }>;
}>;
*/
