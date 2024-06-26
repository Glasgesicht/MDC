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
      ATIS: { uhf: "", vhf: "125.000" },
      APPR: { uhf: "235.050", vhf: "123.600" }, //"123.6",
      TOWER: { uhf: "399.850", vhf: "130.075" }, //"130.07",
      GROUND: { uhf: "240.100", vhf: "122.125" }, //"122.12",
      TACAN: "107X",
      HDG: "10/28",
      ILS: "-/109.70",
      ELEV: "72 ft",
      LEN: "9005 ft",
    },
    {
      NAME: "INCIRLIK AB",
      ICAO: "LTAG",
      ATIS: { uhf: "377.475", vhf: "129.750" },
      APPR: { uhf: "340.775", vhf: "118.000" }, //"118.00",
      TOWER: { uhf: "360.100", vhf: "122.100" }, //"122.10",
      GROUND: { uhf: "371.350", vhf: "123.025" }, //"123.02",
      TACAN: "21X",
      HDG: "05/23",
      ILS: "109.30/111.70",
      ELEV: "200 ft",
      LEN: "10.000 ft",
    },
    {
      NAME: "HATAY",
      ICAO: "LTDA",
      APPR: { vhf: "118.725", uhf: "" },
      ATIS: { vhf: "", uhf: "" },
      ELEV: "",
      GROUND: { vhf: "121.700", uhf: "" },
      HDG: "",
      ILS: "",
      LEN: "",
      TACAN: "74X",
      TOWER: { vhf: "128.525", uhf: "" },
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
