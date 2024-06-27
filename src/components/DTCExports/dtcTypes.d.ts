export interface DTC { // This is very F-16 specific as of now, need to refine this a lot.
    Aircraft: "F16C" | "F15E" | "FA18C",
    Upload: Upload | null
    WaypointsCapture: WaypointsCapture | null
    Waypoints: Waypoints | null
    CMS: Cms | null
    Radios: Radios | null
    MFD: Mfd | null
    HARM: Harm | null
    HTS: Hts | null
    Datalink: Datalink | null
    Misc: Misc | null
    Version: 2
}

export interface Upload {
    Waypoints: boolean
    CMS: boolean
    Radios: boolean
    MFDs: boolean
    HARMHTS: boolean
    Datalink: boolean
    Misc: boolean
}

export interface WaypointsCapture {
    NavPointsMode: number
    TgtPointsMode: number
    NavPointsRangeFrom: number
    TgtPointsRangeFrom: number
}

export interface Waypoints {
    Waypoints: Waypoint[]
}

export interface Waypoint {
    Sequence: number
    Name: string
    Latitude: string
    Longitude: string
    Elevation: number
    TimeOverSteerpoint?: string | null
    Target: boolean
    UseOA: boolean
    OffsetAimpoint1?: OffsetAimpoint1 | null
    OffsetAimpoint2?: OffsetAimpoint2 | null
    UseVIP: boolean
    VIPtoTGT: any
    VIPtoPUP: any
    UseVRP: boolean
    TGTtoVRP?: TgttoVrp | null
    TGTtoPUP?: TgttoPup | null
}

export interface OffsetAimpoint1 {
    Range: number
    Bearing: number
    Elevation: number
}

export interface OffsetAimpoint2 {
    Range: number
    Bearing: number
    Elevation: number
}

export interface TgttoVrp {
    Range: number
    Bearing: number
    Elevation: number
}

export interface TgttoPup {
    Range: number
    Bearing: number
    Elevation: number
}

export interface Cms {
    Programs: Program[]
    ChaffBingo: number
    FlareBingo: number
}

export interface Program {
    Number: number
    FlareBurstQty: number
    FlareBurstInterval: number
    FlareSalvoQty: number
    FlareSalvoInterval: number
    ChaffBurstQty: number
    ChaffBurstInterval: number
    ChaffSalvoQty: number
    ChaffSalvoInterval: number
    ToBeUpdated: boolean
}

export interface Radios {
    Radio1: Radio1
    Radio2: Radio2
}

export interface Radio1 {
    Presets: Preset[]
    SelectedFrequency: any
    SelectedPreset: number | null
    EnableGuard: boolean
    Mode: number
}

export interface Preset {
    Number: number
    Name: string
    Frequency: string
}

export interface Radio2 {
    Presets: Preset2[]
    SelectedFrequency: any
    SelectedPreset: number | null
    EnableGuard: boolean
    Mode: number
}

export interface Preset2 {
    Number: number
    Name: string
    Frequency: string
}

export interface Mfd {
    Configurations: Configuration[]
}

export interface Configuration {
    Mode: number
    LeftMFD: LeftMfd
    RightMFD: RightMfd
    ToBeUpdated: boolean
}

export interface LeftMfd {
    SelectedPage: number
    Page1: number
    Page2: number
    Page3: number
    FCRMode?: number
    FCRAzimuth: number
    FCRBars?: number
    FCRRange: number
}

export interface RightMfd {
    SelectedPage: number
    Page1: number
    Page2: number
    Page3: number
    FCRMode: any
    FCRAzimuth: number
    FCRBars: number
    FCRRange: number
}

export interface Harm {
    Tables: Table[]
}

export interface Table {
    TableNumber: number
    ToBeUpdated: boolean
    Emitters: number[]
}

export interface Hts {
    ManualTableEnabled: boolean
    ManualEmitters: number[]
    ManualEmittersToBeUpdated: boolean
    EnabledClasses: boolean[]
    ManualTableEnabledToBeUpdated: boolean
}

export interface Datalink {
    EnableOwnCallsign: boolean
    OwnCallsign: string
    FlightLead: boolean
    EnableMembers: boolean
    OwnshipIndex: number
    Members: number[]
    TDOAMembers: boolean[]
    DatalinkMode: number
}

export interface Misc {
    Bingo: number
    BingoToBeUpdated: boolean
    BullseyeToBeUpdated: boolean
    BullseyeWP: number
    CARAALOW: number
    CARAALOWToBeUpdated: boolean
    MSLFloor: number
    MSLFloorToBeUpdated: boolean
    LaserSettingsToBeUpdated: boolean
    TGPCode: number
    LSTCode: number
    LaserStartTime: number
    TACANChannel: number
    TACANBand: number
    TACANToBeUpdated: boolean
    ILSFrequency: number
    ILSCourse: number
    ILSToBeUpdated: boolean
}
