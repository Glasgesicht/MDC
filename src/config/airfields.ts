export const airports: readonly {
  NAME: string;
  ARR: string;
  TACAN: string;
  HDG: string;
  ILS: string;
  ELEV: string;
  LEN: string;
}[] = [
  {
    NAME: "RAF AKROTIRI",
    ARR: "123.6",
    TACAN: "107X",
    HDG: "10/28",
    ILS: "-/109.70",
    ELEV: "72 ft",
    LEN: "9005 ft",
  },
  {
    NAME: "INCIRLIK AB",
    ARR: "118.00",
    TACAN: "21X",
    HDG: "05/23",
    ILS: "109.30/111.70",
    ELEV: "200 ft",
    LEN: "10.000 ft",
  },
];

export type Airport = (typeof airports)[0];
