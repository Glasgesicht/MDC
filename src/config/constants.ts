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

type flightConfig = {
  CALLSIGN: String;
  VHF: String;
  UHF: String;
};

export const flights: Array<flightConfig> = [
  {
    CALLSIGN: "BEAST 7",
    VHF: "141.70",
    UHF: "267.70",
  },
  { CALLSIGN: "APEX 1", UHF: "267.10", VHF: "141.10" },
];

type Package = Array<{
  callsign: flightConfig;
  plightplan: Array<{
    steerpointnr: number;
    Coordinates: String;
    timeOnStation: String;
  }>;
}>;
