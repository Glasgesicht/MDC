import { useFlightStore } from "@/stores/flightStore";
import { storeToRefs } from "pinia";
import type { Misc } from "./dtcTypes";
import type { Coordinate } from "@/controller/coordinates";

export type FlightMember = {
  callsign: string;
  tailNr?: string;
  STN: string;
  L16: string;
  search: string;
  tacan: string;
  laser: string;
  m2: string;
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
  location: Coordinate;

  /**Name of Waypoing, EG Incirlik AB */
  name: string;
  /** Time on Target */
  tot: string;
  /**Type of Waypoint, eg Landing */
  type: string;
};

export const initFlight = {
  aircrafttype: "",
  callsign: "",
  callsignNumber: NaN,
  isActive: false,
  taxi: "",
  takeoff: "",
  flightTask: "",
  fence_in: 0,
  fence_out: 0,
  comms: {
    // This is awfully F-16 specific, but we can just overwrite this, might adjust the type though
    radio1: new Array<{
      freq: string;
      name: string;
      number?: number;
      description: string;
    }>(20),
    // Also, those values are not computed, because we need to be able to freely set them if needed
    radio2: new Array<{
      freq: string;
      name: string;
      number?: number;
      description: string;
    }>(20),
  },
  gameplan: "",
  MSNumber: "",
  missionType: "",
  tacan: "",
  task: "",
  units: new Array<FlightMember>(),
  waypoints: new Array<{
    activity: string;
    airspeed_calibrated: number;
    airspeed_total: number;
    groundspeed: number;
    location: Coordinate;
    mach: number;
    name: string;
    tot: string;
    type: string;
    waypointNr: number;
    hideOnMDC: boolean;
  }>(),
  dmpis: new Array<{
    note: string;
    location: Coordinate;
    name: string;
    type: string;
  }>(20),

  DEP: {
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
  },
  ARR: {
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
  },
  ALT: {
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
  },
  misc: {
    Bingo: 2400,
    BingoToBeUpdated: false,
    BullseyeToBeUpdated: true,
    BullseyeWP: 97,
    CARAALOW: 700,
    CARAALOWToBeUpdated: true,
    ILSCourse: 0,
    ILSFrequency: 0,
    ILSToBeUpdated: false,
    LaserSettingsToBeUpdated: false,
    LaserStartTime: 0,
    LSTCode: 0,
    MSLFloor: 0,
    MSLFloorToBeUpdated: false,
    TACANBand: 0,
    TACANChannel: 0,
    TACANToBeUpdated: false,
    TGPCode: 1688,
  } satisfies Misc,
};

export type Flight = typeof initFlight;

export type Package = {
  /** Name of Package */
  name: string;
  bullseyes: {
    wp: number;
    name: string;
    location: Coordinate;
    note: string;
  }[];
  selectedBullseye: number;
  /** Flights in Package */
  flights: Flight[];

  /** not from CF Export */

  situation: string;
  surfaceThreat: string;
  airThreat: string;
  roe: string;
  packageTask: string;
  metar: string;
  ramrod: string;

  codewords: Array<{
    name: string;
    criteria: string;
    authority: string;
    action: string;
  }>;
  agencies: Array<{
    name: string;
    freq: string;
    type: string;
    activity: string;
    tacan: string;
    location: Coordinate;
    active: boolean;
  }>;
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
  Orbits: OrbitsEntity[];
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
