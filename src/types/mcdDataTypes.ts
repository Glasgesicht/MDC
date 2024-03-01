export type Waypoint = {
  /**Number of Waypoint */
  waypointNr: number;

  /**Activity length, hh:mm:ss */
  activity: string;
  /** ground speed */
  groundspeed: number;
  /**KCAS */
  airspeed_calibrated: number;
  /**TAS */
  airspeed_total: number;
  /**MACH */
  mach: number;

  /** Latitude */
  latitude: number;
  /**Longitude */
  longitude: number;
  /** altitude*/
  altitude: number;

  /**Name of Waypoing, EG Incirlik AB */
  name: string;
  /** Time on Target */
  tot: string;
  /**Type of Waypoint, eg Landing */
  type: string;
};

export type Flight = {
  /**Type of aircraft */
  aircrafttype: string; // TODO: Set to possible Aircraft via CF
  /**Callsign without number */
  callsign: string;
  /**Callsign Number, eg 1 in APEX 1 */
  callsignNumber: number;
  /**Mission Number, is a String */
  MSNumber: String;
  /**Task, like OCA */
  task: string;
  /**Number of aircraft */
  units: number;
  /**TACAN grab from frist waypoint*/
  tacan: string;
  /**Waypoints */
  waypoints: Waypoint[];

  /**Homeplate, deduct from "Take off (ramp)" waypoint, maybe stp1 */
  homeplate: string;
  /**Alternate, deduct from "Alternate" waypoint */
  alternate: string;
  /**Arrival, deduct from "Landing" waypoint */
  arrival: string;
};

//@ts-ignore
export type Package = {
  /** Name of Package */
  name: string;
  /** Flights in Package */
  flights: Flight[];
};
