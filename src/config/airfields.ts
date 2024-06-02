export const airports: {
  NAME: string;
  ICAO: string;
  GROUND: comm;
  TOWER: comm;
  APPR: comm;
  TACAN: string;
  HDG: string;
  ILS: string;
  ELEV: string;
  LEN: string;
  ATIS: comm;
}[] = [
  {
    NAME: "RAF AKROTIRI",
    ICAO: "LCRA",
    ATIS: { uhf: "", vhf: "125.00" },
    APPR: { uhf: "235.05", vhf: "123.6" }, //"123.6",
    TOWER: { uhf: "399.85", vhf: "130.07" }, //"130.07",
    GROUND: { uhf: "240.10", vhf: "122.12" }, //"122.12",
    TACAN: "107X",
    HDG: "10/28",
    ILS: "-/109.70",
    ELEV: "72 ft",
    LEN: "9005 ft",
  },
  {
    NAME: "INCIRLIK AB",
    ICAO: "LTAG",
    ATIS: { uhf: "377.47", vhf: "129.75" },
    APPR: { uhf: "340.77", vhf: "118.00" }, //"118.00",
    TOWER: { uhf: "360.10", vhf: "122.10" }, //"122.10",
    GROUND: { uhf: "371.35", vhf: "123.02" }, //"123.02",
    TACAN: "21X",
    HDG: "05/23",
    ILS: "109.30/111.70",
    ELEV: "200 ft",
    LEN: "10.000 ft",
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
  HDG: "",
  ILS: "",
  ELEV: "",
  LEN: "",
};

export type Airport = (typeof airports)[0];

type comm = { uhf: string; vhf: string };
