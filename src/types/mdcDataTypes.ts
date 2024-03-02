export type FlightMember = {
  callsign: string;
  tailNr?: number;
  STN: String; // leading 0's ?
  L16: String; //BT71
  TACAN: String; //
  LCODE: String; //
};

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
  units: FlightMember[];
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

  /** NON CF, Task of indivisual flight*/
  flightTask: string;

  /** UHF of flight, try to deduct from CF, then set via flights*/
  UHF: string;

  /** UHF of flight, try to deduct from CF, then set via flights*/
  VHF: string;
};

export type Package = {
  /** Name of Package */
  name: string;
  /** Flights in Package */
  flights: Flight[];
};

//** Combat Flite Export Types */
export interface Mission {
  Theater: string[];
  MissionName: string[];
  Situation: string[];
  BlueBriefing: string[];
  RedBriefing: string[];
  NeutralBriefing: string[];
  Situation_Rtf: string[];
  BlueBriefing_Rtf: string[];
  RedBriefing_Rtf: string[];
  NeutralBriefing_Rtf: string[];
  BlueRAMROD: string[];
  RedRAMROD: string[];
  NeutralRAMROD: string[];
  BlueBriefingPics: BlueBriefingPicsEntity[];
  RedBriefingPics: RedBriefingPicsEntity[];
  NeutralBriefingPics: NeutralBriefingPicsEntity[];
  Environment: EnvironmentEntity[];
  PortableBeacons: string[];
  Sides: SidesEntity[];
  Package: PackageEntity[];
  Routes: RoutesEntity[];
  miz_all: string[];
  Carrier: CarrierEntity[];
  Airspace: AirspaceEntity[];
  BlueBullseye: BlueBullseyeEntityOrRedBullseyeEntityOrNeutralBullseyeEntity[];
  RedBullseye: BlueBullseyeEntityOrRedBullseyeEntityOrNeutralBullseyeEntity[];
  NeutralBullseye:
    | BlueBullseyeEntityOrRedBullseyeEntityOrNeutralBullseyeEntity[];
}
export interface BlueBriefingPicsEntity {
  BlueBriefingPicture: string[];
}
export interface RedBriefingPicsEntity {
  RedBriefingPicture: string[];
}
export interface NeutralBriefingPicsEntity {
  NeutralBriefingPicture: string[];
}
export interface EnvironmentEntity {
  Year: string[];
  Month: string[];
  Day: string[];
  Starttime: string[];
  MagVar: string[];
  QNH: string[];
  Wind1600_Dir: string[];
  Wind1600_Speed: string[];
  Wind26000_Dir: string[];
  Wind26000_Speed: string[];
  Wind33_Dir: string[];
  Wind33_Speed: string[];
  Wind6600_Dir: string[];
  Wind6600_Speed: string[];
  CloudBase: string[];
  CloudCoverage: string[];
  CloudThickness: string[];
  Fog: string[];
  FogThickness: string[];
  Precipitation: string[];
  Temperature: string[];
  Turbulence: string[];
  Visibility: string[];
  Dynamic: string[];
  Preset: string[];
  HaloPreset: string[];
  CrystalPreset: string[];
  Dust: string[];
  DustVisibility: string[];
}
export interface SidesEntity {
  Blue: BlueEntityOrRedEntityOrNeutralEntity[];
  Red: BlueEntityOrRedEntityOrNeutralEntity[];
  Neutral: BlueEntityOrRedEntityOrNeutralEntity[];
}
export interface BlueEntityOrRedEntityOrNeutralEntity {
  Country: string[];
}
export interface PackageEntity {
  Name: string[];
  Enabled: string[];
  Side: string[];
  Tag: string[];
}
export interface RoutesEntity {
  Route: RouteEntity[];
}
export interface RouteEntity {
  Name: string[];
  PackageTag: string[];
  MSNnumber: string[];
  CallsignName: string[];
  CallsignNameCustom: string[];
  CallsignNameCustomIs: string[];
  CallsignNumber: string[];
  Side: string[];
  Country: string[];
  Task: string[];
  lateActivation: string[];
  hiddenOnMap: string[];
  DCS_groupId: string[];
  DCS_groupName: string[];
  Units: string[];
  Enabled: string[];
  Bogus: string[];
  QFE: string[];
  Color: string[];
  Aircraft: AircraftEntity[];
  DCS_INUFixPoints_lua: string[];
  DCS_NavTargetPoints_lua: string[];
  DCS_tasks_lua: string[];
  FlightMembers: FlightMembersEntity[];
  Waypoints: WaypointsEntity[];
}
export interface AircraftEntity {
  Type: string[];
}
export interface FlightMembersEntity {
  FlightMember: FlightMemberEntity[];
}
export interface FlightMemberEntity {
  DL: string[];
  Skill: string[];
  EasternCallsign: string[];
  heading: string[];
  DCS_unitId: string[];
  DCS_unitName: string[];
  DCS_AddPropAircraft_lua: string[];
  DCS_dataCartridge_lua: string[];
  DCS_hardpoint_racks_lua: string[];
  DCS_livery_id_lua: string[];
  DCS_onboard_num_lua: string[];
  DCS_Radio_lua: string[];
  Aircraft: AircraftEntity1[];
}
export interface AircraftEntity1 {
  Type: string[];
  InitFuel: string[];
  Chaffs: string[];
  Flares: string[];
  GunAmmoType: string[];
  GunAmmoCount: string[];
  InitWeight: string[];
  InitDI: string[];
  InitFuel_Internal: string[];
  Stores: (string | StoresEntity)[];
}
export interface StoresEntity {
  Store: StoreEntity[];
}
export interface StoreEntity {
  Pylon: string[];
  StoreName: string[];
  CLSID: string[];
}
export interface WaypointsEntity {
  Waypoint: WaypointEntity[];
}
export interface WaypointEntity {
  Name: string[];
  Type: string[];
  Frq: string[];
  AATCN: string[];
  Lon: string[];
  Lat: string[];
  Altitude: string[];
  AGL: string[];
  TOT: string[];
  KTAS: string[];
  KCAS: string[];
  GS: string[];
  Mach: string[];
  SpeedType: string[];
  Activity: string[];
  TimeLocked: string[];
  DCS_AirdromeId: string[];
  DCS_LinkUnit: string[];
  Waypoint_DCS_tasks_lua: string[];
  DoghouseShow: string[];
  DoghouseDraggedOffsetX: string[];
  DoghouseDraggedOffsetY: string[];
  DoghouseSize: string[];
  WPLabelShow: string[];
  WPLabelSize: string[];
  Locked: string[];
  DMPIs: string[];
}
export interface CarrierEntity {
  Country: string[];
  Lat: string[];
  Lon: string[];
  Side: string[];
  BRC: string[];
  ClassName: string[];
  Speed: string[];
  ICLS: string[];
  ICLScallsign: string[];
  TCN: string[];
  TCNcallsign: string[];
  CarrierUnitId: string[];
  Tag: string[];
  ImageKey: string[];
  Enabled: string[];
  Locked: string[];
}
export interface AirspaceEntity {
  Name: string[];
  Tag: string[];
  Enabled: string[];
  Expanded: string[];
  Polygons: PolygonsEntity[];
  Circles: (string | CirclesEntity)[];
  Orbits: (string | OrbitsEntity)[];
  AORs: string[];
  RefPoints: (string | RefPointsEntity)[];
  GUSs: string[];
  ITBs: (ITBsEntity | string)[];
  Overlays: string[];
}
export interface PolygonsEntity {
  Polygon: PolygonEntity[];
}
export interface PolygonEntity {
  Name: string[];
  Tag: string[];
  Enabled: string[];
  Locked: string[];
  ImageKey: string[];
  Color: string[];
  Filled: string[];
  Closed: string[];
  ShowPoints: string[];
  ShowText: string[];
  Type: string[];
  MinAlt: string[];
  MaxAlt: string[];
  Frq: string[];
  CorridorWidth: string[];
  LineStyle: string[];
  LineThickness: string[];
  LineOpacity: string[];
  FillOpacity: string[];
  ArrowEndSize: string[];
  ArrowEndStyle: string[];
  ArrowStartSize: string[];
  ArrowStartStyle: string[];
  Polypoints: PolypointsEntity[];
}
export interface PolypointsEntity {
  Polypoint: PolypointEntity[];
}
export interface PolypointEntity {
  Name: string[];
  Lon: string[];
  Lat: string[];
}
export interface CirclesEntity {
  Circle: CircleEntity[];
}
export interface CircleEntity {
  Name: string[];
  Tag: string[];
  Enabled: string[];
  Locked: string[];
  ImageKey: string[];
  Color: string[];
  Filled: string[];
  ShowLabels: string[];
  ShowCenterLabel: string[];
  Radius: string[];
  MaxAlt: string[];
  Lon: string[];
  Lat: string[];
  ExportToDCS: string[];
  LineStyle: string[];
  LineThickness: string[];
  LineOpacity: string[];
  FillOpacity: string[];
}
export interface OrbitsEntity {
  Orbit: OrbitEntity[];
}
export interface OrbitEntity {
  Name: string[];
  Tag: string[];
  Enabled: string[];
  Locked: string[];
  ImageKey: string[];
  Type: string[];
  MinAlt: string[];
  MaxAlt: string[];
  Frq: string[];
  Color: string[];
  Clockwise: string[];
  Brg: string[];
  Leg: string[];
  Width: string[];
  Lon: string[];
  Lat: string[];
  Lon2: string[];
  Lat2: string[];
}
export interface RefPointsEntity {
  RefPoint: RefPointEntity[];
}
export interface RefPointEntity {
  Name: string[];
  Comment: string[];
  Tag: string[];
  Enabled: string[];
  Locked: string[];
  ImageKey: string[];
  Type: string[];
  Color: string[];
  Lon: string[];
  Lat: string[];
}
export interface ITBsEntity {
  ITB: ITBEntity[];
}
export interface ITBEntity {
  Text: string[];
  Tag: string[];
  Enabled: string[];
  Locked: string[];
  ImageKey: string[];
  Bold: string[];
  Border: string[];
  Filled: string[];
  BackColor: string[];
  ForeColor: string[];
  Lon: string[];
  Lat: string[];
  FontSize: string[];
}
export interface BlueBullseyeEntityOrRedBullseyeEntityOrNeutralBullseyeEntity {
  Name: string[];
  Color: string[];
  OuterRing: string[];
  Rings: string[];
  Spokes: string[];
  Lon: string[];
  Lat: string[];
  ShowName: string[];
  ShowRngLabels: string[];
  LineThickness: string[];
  Opacity: string[];
  Locked: string[];
}
