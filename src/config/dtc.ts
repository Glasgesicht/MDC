import { deflate, inflate } from "pako";
import { toByteArray, fromByteArray, byteLength } from "base64-js";

export function decompressString(compressedText: string): DTC {
  const gZipBuffer = toByteArray(compressedText);
  const decompressedBuffer = inflate(gZipBuffer.slice(4));

  return JSON.parse(uint8ArrayToUtf8String(decompressedBuffer));
}

export function compressString(input: DTC) {
  const stringToCompress = JSON.stringify(input);

  const asArray = utf8StringToUint8Array(stringToCompress);
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
}

const encodedData = `3SkAAB+LCAAAAAAAAArtWmtu20YQvorA3wqxLz7/BDQtyYL1qkTFBQL/YGxKFkqRLkW5TQUDvUZvkTPkKD1JZ0nxIWppS2mMgm0BWuY+Znbn29mZ2VnuJGsV3UXuIpZMqYtVW2pL80c/dO8lcyfduJ8fw1UQbyRz4fobry3Zw1n+PnXvV2HRNOxeFoUrazq8coq+l27s+qvgJ8mMoy3vvNrc7Ruf28U4tvsYbyOPjz1ynyZJ3TC8hwrUlpxlXKnJ+0zdYOl1o3AtmbjUsVxdHqYi28edNPN+3nrBnZfQj9w1vEiOdd0Zd7uAyMCNV/GWDyqNWlT9+kUxZFVBf/7+B28Mg2XW2mkhqnz9QpisZc0d33sC8jAA1ooKk1utvfGTF81iz4uSGQAdIiZFJkLQ33GjpRfnwM033tjKS+PFYuPF1mqdEGLJDLa+X60mWTXQfuhPcmJ4j0On52TNSXkyn5S7T4vu0DMOk4q0OSnn3Z/bZdBIDpo96A8vRJARLOuGWgsZZTIi+AgyoiCE6kCjJmImIU0FjRagTef9WecINYAFKTKluhg19vULI7JOlHNRw5pJcFNRY6+hBrAQTWa4Rtd4M5E142zUCDx6U1FTctQsayqCDKuyatQoGgWDR2Sqnb09iWayxiqaepqiadn+EymaAoqmnYuaAkZNbSpqWo7aZD67alki1KgiAwC1rgAbRfOpqDFwniaiTUVNz1GbWe/U1mg8da5EyIG9Z3oNchp4CyozYhwjh3WlHjiMTdRYdTMOgZuN52LgMANkXgTOEGxUipheDxwBjWts8IFRjlznx77TuqhxCi9tVKR9y0alhskaq28Yn+IVVJkZpNYrYF3WmHEubEw1UWPDD0xOi3UN/YVYF8tIZefCpmB4Ggvbq0eE9GBl1GkbP1gRWdHPhE0BVwqq3ljYijPCwBpd9ke973mGfxE23UTNha2IeJEwbDNkQrRawBRN1hUqBAz9S9MeuIh2sRAxOB7QGhXjO5fKOiNnIwYhm9FYxIpIlwgjDiwrGqlFjOoypuq5iDFkkuYiVoS47AgxmnhNpin1ZsyQFUGG6BXEFKPBdowUoa1Sg5hq0PqoVgEzdyZikImEp0lR7e3zPpm/kyZRuIzcdZoIH23Xn7woSYN3fTfyLrbRJv4h/lyp6QexFz25PqThIW+7b5m5/lOY9kXlqqIzhHAw7IO7WBzwLWqqfJOWQ75FVYWvE15488d7N/bu86uFQiDyJgIhWXkTgRK+LwtEjwQ6ELHMK5O0GFc5fX2ySYu4VqRRvnl12BsII1qbvy/MCSujnC4MOph72rdW1bQz5OGMKwJxxmKJtFdFUv/e7nmjzXPeCt1mrFfBMixt6bz8XNxp7tI3nNpHD8xzxTwWCfXJda/VHTgt7i+7UeqFYHISUSH6Q1IZxVKEnVERARWpUGlHVPSIyjgaqzgEDfuDVm9uTS+rVIxCAueQqjhxOtboujOtksBFgHpIUiDRH1q9Tsu+6tjXFTJqIJkdkhVQWH37/fv3RxSGjCtzK2LHybWT4MAE6PFxYKlnnu/dweqXmlNHmDWky8pDd55W6QTuJ9/rbd3oPr+jTq6ZSaYVpFYXSldS/Q9CpDEc0pWKNK9rEIaUx/kaxKnO1yDM4Lz7At49Id58rHq8JUmEdhXs7POBPdrPyZcEHGs7DBar5TZKArAU8rQT7PuBt4j33fIR3GXaxl9g45L0jeR1NDVE9jTnAu/Wb6v1Nn5ILZw9vXCjTeqN7Gny9QAUEruwWj6IByT5gCwfkAoHTNXv9DHFFnmP0/8Q0JO0QMkXRf0ui/KPKwK3TYUesO+yFRoHQmU3KP9Zg8CPcfxbKz4NhxvV1E4mr6Wj3DElGOH1KoaQiRNgiIUwYvBH2xgcE0YaMK6wIa+zgQgTQ74Cg78BjwdsjGM29AQ2MAtCgFyH/yqw029TQfkHZbDmbrB1/YRp6khKTiRpKvG6rdYJx0652L672SQAJv7/7J98rPLURGpb+hputx98/Etgu76/WS2DLPw4qJLsm+RLiq7P9W7g8e/z0m4p/dDj6G5KtJuH1WM/uPd+TRQgb/9IwWe34YfwH8p/WPsdzh8QwrkcW0X/04XPpNrvpufsK7+dtI+wGeMZlKRwZNKgHnbDxvvsvdB0A9kLws8M1tSyBuMbfrWNiqKAcjgbdP0w5OqLk/xNViHoO3A3kNfx4hgmKNQTpzexU9lUHWKjwczZF/WkmJDHbhTzHFFyp+9YtjWCM0cQeHAugR2R1ly4ATDlZ2JeEsykP5iVwijYRjKF3lBrh3As4uYAkoJQFDgG6QMsW3rD8/wX8pJNst0pAAA=`;

console.log(
  JSON.stringify(
    decompressString(compressString(decompressString(encodedData)))
  )
);

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
