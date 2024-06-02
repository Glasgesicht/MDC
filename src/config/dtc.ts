import { deflate, inflate, gzip } from "pako";

import { toByteArray, fromByteArray, byteLength } from "base64-js";

export function decompressString(compressedText: string): DTC {
  const gZipBuffer = toByteArray(compressedText);
  const decompressedBuffer = inflate(gZipBuffer.slice(4));

  return JSON.parse(new TextDecoder("utf-8").decode(decompressedBuffer));
}

/*export function compressString(input: any) {
  const stringToCompress = JSON.stringify(input);

  const asArray = new TextEncoder().encode(stringToCompress);
  const lengthAsArray = encodeTo4Bytes(asArray.length);
  const compressed = deflate(asArray);

  const compressedWithLength = new Uint8Array(compressed.length + 4);
  compressedWithLength.set(compressed, 4);
  compressedWithLength.set(lengthAsArray, 0);

  return fromByteArray(compressedWithLength);
}

function encodeTo4Bytes(number: number) {
  const byteArray = new Uint8Array(4);

  byteArray[3] = number >> 24;
  byteArray[2] = number >> 16;
  byteArray[1] = number >> 8;
  byteArray[0] = number;

  return byteArray;
}*/

export function compressString(text: any) {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(JSON.stringify(text));
  const compressedData = gzip(buffer);

  const gZipBuffer = new Uint8Array(compressedData.length + 4);
  const originalLength = buffer.length;

  // Write the original length to the first 4 bytes
  gZipBuffer[0] = (originalLength >> 0) & 0xff;
  gZipBuffer[1] = (originalLength >> 8) & 0xff;
  gZipBuffer[2] = (originalLength >> 16) & 0xff;
  gZipBuffer[3] = (originalLength >> 24) & 0xff;

  // Copy the compressed data to the new buffer starting from byte 4
  gZipBuffer.set(compressedData, 4);

  // Convert to Base64
  return btoa(String.fromCharCode.apply(null, Array.from(gZipBuffer)));
}

/**
 * Converts a UTF-8 string to a Uint8Array without using TextEncoder.
 *
 * @param input - The UTF-8 string to be converted.
 * @returns A Uint8Array representing the UTF-8 encoded string.
 */
function utf8StringToUint8Array(input: string): Uint8Array {
  const utf8: number[] = [];

  for (let i = 0; i < input.length; i++) {
    let charCode = input.charCodeAt(i);

    if (charCode < 0x80) {
      utf8.push(charCode);
    } else if (charCode < 0x800) {
      utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
    } else if (charCode < 0x10000) {
      utf8.push(
        0xe0 | (charCode >> 12),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f)
      );
    } else {
      utf8.push(
        0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f)
      );
    }
  }

  return new Uint8Array(utf8);
}

/**
 * Converts a Uint8Array to a UTF-8 string without using TextDecoder.
 *
 * @param uint8Array - The Uint8Array to be converted.
 * @returns A UTF-8 string decoded from the Uint8Array.
 */
function uint8ArrayToUtf8String(uint8Array: Uint8Array): string {
  let result = "";
  let i = 0;

  while (i < uint8Array.length) {
    const byte1 = uint8Array[i++];

    if (byte1 < 0x80) {
      result += String.fromCharCode(byte1);
    } else if (byte1 < 0xe0) {
      const byte2 = uint8Array[i++];
      result += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
    } else if (byte1 < 0xf0) {
      const byte2 = uint8Array[i++];
      const byte3 = uint8Array[i++];
      result += String.fromCharCode(
        ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f)
      );
    } else {
      const byte2 = uint8Array[i++];
      const byte3 = uint8Array[i++];
      const byte4 = uint8Array[i++];
      const codePoint =
        (((byte1 & 0x07) << 18) |
          ((byte2 & 0x3f) << 12) |
          ((byte3 & 0x3f) << 6) |
          (byte4 & 0x3f)) -
        0x10000;

      result += String.fromCharCode(
        0xd800 + (codePoint >> 10),
        0xdc00 + (codePoint & 0x3ff)
      );
    }
  }

  return result;
}

/** Types */

interface DTC {
  Aircraft: string;
  Upload: Upload;
  WaypointsCapture: WaypointsCapture;
  Waypoints: Waypoints;
  CMS: CMS;
  Radios: Radios;
  MFD: MFD;
  HARM: HARM;
  HTS: HTS;
  Datalink: Datalink;
  Misc: Misc;
  Version: number;
}
interface Upload {
  Waypoints: boolean;
  CMS: boolean;
  Radios: boolean;
  MFDs: boolean;
  HARMHTS: boolean;
  Datalink: boolean;
  Misc: boolean;
}
interface WaypointsCapture {
  NavPointsMode: number;
  TgtPointsMode: number;
  NavPointsRangeFrom: number;
  TgtPointsRangeFrom: number;
}
interface Waypoints {
  Waypoints?: WaypointsEntity[] | null;
}
interface WaypointsEntity {
  Sequence: number;
  Name: string;
  Latitude: string;
  Longitude: string;
  Elevation: number;
  TimeOverSteerpoint: string;
  Target: boolean;
  UseOA: boolean;
  OffsetAimpoint1?: null;
  OffsetAimpoint2?: null;
  UseVIP: boolean;
  VIPtoTGT?: null;
  VIPtoPUP?: null;
  UseVRP: boolean;
  TGTtoVRP?: null;
  TGTtoPUP?: null;
}
interface CMS {
  Programs?: ProgramsEntity[] | null;
  ChaffBingo: number;
  FlareBingo: number;
}
interface ProgramsEntity {
  Number: number;
  FlareBurstQty: number;
  FlareBurstInterval: number;
  FlareSalvoQty: number;
  FlareSalvoInterval: number;
  ChaffBurstQty: number;
  ChaffBurstInterval: number;
  ChaffSalvoQty: number;
  ChaffSalvoInterval: number;
  ToBeUpdated: boolean;
}
interface Radios {
  Radio1: Radio1;
  Radio2: Radio2;
}
interface Radio1 {
  Presets?: PresetsEntity[] | null;
  SelectedFrequency?: null;
  SelectedPreset: string;
  EnableGuard: boolean;
  Mode: number;
}
interface PresetsEntity {
  Number: number;
  Name: string;
  Frequency: string;
}
interface Radio2 {
  Presets?: PresetsEntity[] | null;
  SelectedFrequency: string;
  SelectedPreset: string;
  EnableGuard: boolean;
  Mode: number;
}
interface MFD {
  Configurations?: ConfigurationsEntity[] | null;
}
interface ConfigurationsEntity {
  Mode: number;
  LeftMFD: LeftMFD;
  RightMFD: RightMFDOrLeftMFD;
  ToBeUpdated: boolean;
}
interface LeftMFD {
  SelectedPage: number;
  Page1: number;
  Page2: number;
  Page3: number;
  FCRMode?: number | null;
  FCRAzimuth: number;
  FCRBars: number;
  FCRRange: number;
}
interface RightMFDOrLeftMFD {
  SelectedPage: number;
  Page1: number;
  Page2: number;
  Page3: number;
  FCRMode?: null;
  FCRAzimuth: number;
  FCRBars: number;
  FCRRange: number;
}
interface HARM {
  Tables?: TablesEntity[] | null;
}
interface TablesEntity {
  TableNumber: number;
  ToBeUpdated: boolean;
  Emitters?: number[] | null;
}
interface HTS {
  ManualTableEnabled: boolean;
  ManualEmitters?: null[] | null;
  ManualEmittersToBeUpdated: boolean;
  EnabledClasses?: boolean[] | null;
  ManualTableEnabledToBeUpdated: boolean;
}
interface Datalink {
  EnableOwnCallsign: boolean;
  OwnCallsign: string;
  FlightLead: boolean;
  EnableMembers: boolean;
  OwnshipIndex: number;
  Members?: number[] | null;
  TDOAMembers?: boolean[] | null;
  DatalinkMode: number;
}
interface Misc {
  Bingo: number;
  BingoToBeUpdated: boolean;
  BullseyeToBeUpdated: boolean;
  BullseyeWP: number;
  CARAALOW: number;
  CARAALOWToBeUpdated: boolean;
  MSLFloor: number;
  MSLFloorToBeUpdated: boolean;
  LaserSettingsToBeUpdated: boolean;
  TGPCode: number;
  LSTCode: number;
  LaserStartTime: number;
  TACANChannel: number;
  TACANBand: number;
  TACANToBeUpdated: boolean;
  ILSFrequency: number;
  ILSCourse: number;
  ILSToBeUpdated: boolean;
}
