export const airports: {
  NAME: string;
  ICAO: string;
  GROUND: comm;
  TOWER: comm;
  APPR: comm;
  TACAN: string;
  ILS: string[];
  ELEV: string;
  LEN: string;
  ATIS: comm;
  COURSE: string[];
}[] = [
  {
    NAME: "RAF AKROTIRI",
    ICAO: "LCRA",
    ATIS: { uhf: "", vhf: "125.000" },
    APPR: { uhf: "235.050", vhf: "123.600" }, //"123.6",
    TOWER: { uhf: "399.850", vhf: "130.075" }, //"130.07",
    GROUND: { uhf: "240.100", vhf: "122.125" }, //"122.12",
    TACAN: "107X",
    ILS: ["109.70"],
    ELEV: "72 ft",
    LEN: "9005 ft",
    COURSE: ["283"],
  },
  {
    NAME: "INCIRLIK AB",
    ICAO: "LTAG",
    ATIS: { uhf: "377.475", vhf: "129.750" },
    APPR: { uhf: "340.775", vhf: "118.000" }, //"118.00",
    TOWER: { uhf: "360.100", vhf: "122.100" }, //"122.10",
    GROUND: { uhf: "371.350", vhf: "123.025" }, //"123.02",
    TACAN: "21X",
    ILS: ["109.30", "111.70"],
    ELEV: "200 ft",
    LEN: "10.000 ft",
    COURSE: ["049", "229"],
  },
  {
    NAME: "HATAY",
    ICAO: "LTDA",
    APPR: { vhf: "118.725", uhf: "" },
    ATIS: { vhf: "", uhf: "" },
    ELEV: "",
    GROUND: { vhf: "121.700", uhf: "" },
    ILS: ["108.90", ""],
    LEN: "",
    TACAN: "74X",
    TOWER: { vhf: "128.525", uhf: "" },
    COURSE: ["039", "216"],
  },
];

export const airfieldEmpty = {
  NAME: "",
  ICAO: "",
  ATIS: { uhf: "", vhf: "" },
  APPR: { uhf: "", vhf: "" },
  TOWER: { uhf: "", vhf: "" },
  GROUND: { uhf: "", vhf: "" },
  TACAN: "",
  COURSE: [""],
  ILS: [""],
  ELEV: "",
  LEN: "",
};

export type Airport = (typeof airports)[0];

type comm = { uhf: string; vhf: string };
