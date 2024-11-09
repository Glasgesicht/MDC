import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";

export class Coordinate {
  lat = 0;
  lon = 0;
  elevation = 0;

  toJSON() {
    return {
      lat: this.lat,
      lon: this.lon,
      elevation: this.elevation,
    };
  }

  /**
   * Creates a new coordinate object from either a string (DD°MM.MMM) format or a number (DD.DDDDDD format)
   * @param {number|string} lat latitude in degrees, or a string in DDMM.MM or DDD.DDDDD format
   * @param {number|string} lon longitude in degrees, or a string in DDMM.MM or DDD.DDDDD format
   * @param {number} [elevation=0] elevation above sea level in meters
   */
  constructor(
    lat: number | string, // Not too familiar with JS classes due to my Java background....
    lon: number | string, // Why do I have to name those differently? Seems unneccessary?!
    elevation: number = 0
  ) {
    this.lat = typeof lat === "string" ? this.fromLatString(lat) : lat;
    this.lon = typeof lon === "string" ? this.fromLongString(lon) : lon;
    this.elevation = elevation;
  }

  /*
  // TODO: Implement the reverse LatLong => MGRS

  public static fromMGRS(MGRS: string) {
    const { latitude, longitude } = Coordinate.mgrsToLatLong(MGRS);
    return new Coordinate(latitude, longitude);
  }*/

  /**
   * Converts a latitude in decimal degrees to a string in the format "N/S [degrees]°[minutes]'"
   * @returns {string} A string representation of the latitude, or an empty string if the input is invalid
   */
  toLatString(format: "DD" | "DMM" | "DMS" = "DMM"): string {
    switch (format) {
      case "DD":
        return `${this.lat > 0 ? "N" : "S"} ${Math.abs(this.lat).toFixed(5)}’`;
      case "DMM":
        return `${this.lat > 0 ? "N" : "S"} ${Math.floor(
          Math.abs(this.lat)
        )}°${((Math.abs(this.lat) % 1) * 60).toFixed(3).padStart(6, "0")}’`;
      case "DMS":
        return `${this.lat > 0 ? "N" : "S"} ${Math.floor(
          Math.abs(this.lat)
        )}°${((Math.abs(this.lat) % 1) * 60).toFixed(0)}'${(
          (((Math.abs(this.lat) % 1) * 60) % 1) *
          60
        ).toFixed(5)}’`; // .padStart(6, "0")
    }
  }

  /**
   * Converts a longitude in decimal degrees to a string in the format "E/W [degrees]°[minutes]'"
   * @returns {string} A string representation of the longitude, or an empty string if the input is invalid
   */
  toLongString(format: "DD" | "DMM" | "DMS" = "DMM"): string {
    switch (format) {
      case "DD":
        return `${this.lon > 0 ? "E" : "W"} ${Math.abs(this.lon).toFixed(5)}’`;
      case "DMM":
        return `${this.lon > 0 ? "E" : "W"} ${String(
          Math.floor(Math.abs(this.lon))
        ).padStart(3, "0")}°${((Math.abs(this.lon) % 1) * 60)
          .toFixed(3)
          .padStart(6, "0")}’`;
      case "DMS":
        return `${this.lon > 0 ? "E" : "W"} ${String(
          Math.floor(Math.abs(this.lon))
        ).padStart(3, "0")}°${((Math.abs(this.lon) % 1) * 60).toFixed(0)}'${(
          (((Math.abs(this.lon) % 1) * 60) % 1) *
          60
        ).toFixed(5)}’`;
    }
  }
  /**
   * Converts the coordinate to a string in the format "N/S [degrees]°[minutes]' E/W [degrees]°[minutes]'"
   * @returns {string} A string representation of the coordinate, or an empty string if the input is invalid
   */
  toString(): string {
    return this.toLatString() + " " + this.toLongString();
  }

  /**
   * TO BRA
   */
  public toBRA(): string {
    const { selectedPKG } = storeToRefs(usePackageStore());
    const { getFlight } = storeToRefs(useFlightStore());
    const bullseye = selectedPKG.value.bullseyes.find(
      (x) => x.wp == getFlight.value.misc.BullseyeWP
    );
    if (!bullseye?.location) return "";

    const headingTo = bullseye.location.headingTo(this);

    return `${bullseye.name} ${headingTo} /  ${bullseye.location
      .calculateDistance(this)
      .toFixed(0)}`;
  }

  // not sure this is needed, just have them read only
  // setLat(lat: number | string) {}
  // setLon(lon: number | string) {}

  /**
   * @returns {number} The longitude of the coordinate
   */
  getLat(): number {
    return this.lat;
  }

  /**
   * @returns {number} The latitude of the coordinate
   */
  getLon(): number {
    return this.lon;
  }

  /**
   * @returns {number|string} The elevation above sea level in feet
   */
  getElevation(mode: "FL"): string;
  getElevation(mode: "ft" | "m"): number;
  getElevation(mode: "ft" | "m" | "FL" = "ft"): number | string {
    switch (mode) {
      case "ft":
        return this.elevation;
      case "m": // convert ft to m
        return this.elevation * 0.3048;
      case "FL": // convert ft to FL
        return "FL " + (this.elevation / 100).toFixed(0);
    }
  }

  /**
   * Calculates the distance between two geographical points on the Earth's surface in nautical miles.
   * Utilizes the Haversine formula for the calculation.
   *
   * @returns A string representing the distance between the two points in nautical miles, rounded to one decimal place.
   */
  calculateDistance(target: Coordinate) {
    const phi1 = Coordinate.toRad(this.lat);
    const phi2 = Coordinate.toRad(target.lat);
    const deltaPhi = Coordinate.toRad(target.lat - this.lat);
    const deltaLambda = Coordinate.toRad(target.lon - this.lon);

    // Haversine formula
    const a =
      Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Earth's radius in nautical miles is approximately 3440.065
    let distanceNM = 3440.065 * c;

    // Round the distance to a reasonable number of decimal places
    distanceNM = Math.round(distanceNM * 10) / 10;

    return distanceNM;
  }

  //headingTo() { }

  headingTo(target: Coordinate): number {
    // Convert latitude and longitude from degrees to radians
    const lat1 = Coordinate.toRad(this.lat);
    const lon1 = Coordinate.toRad(this.lon);
    const lat2 = Coordinate.toRad(target.lat);
    const lon2 = Coordinate.toRad(target.lon);

    // Calculate the difference in longitudes
    const dLon = lon2 - lon1;

    // Calculate the bearing using the arctan2 function
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = Math.atan2(y, x); // Bearing in radians

    // Convert the bearing from radians to degrees
    bearing = Coordinate.toDegrees(bearing);

    // Adjust bearing to fall within the range [0, 360)
    bearing = (bearing + 360) % 360;

    return Math.round(bearing); // Return a whole number
  }

  /**
   * TODO: implement
   */
  calculateTimeTo(target: Coordinate, speed: number) {}

  /**
   * Converts a latitude string in the format "N/S [degrees]°[minutes]'" to decimal degrees
   * @param {string} latString - The latitude string to convert
   * @returns {number | null} The latitude in decimal degrees, or null if the input is invalid
   */
  private fromLatString(latString: string): number {
    const regex = /^([NS])\s(\d{2,3})°(\d{2}(?:\.\d{3})?)’$/;
    const match = latString.match(regex);

    if (match) {
      const hemisphere = match[1];
      const degrees = parseInt(match[2], 10);
      const minutes = parseFloat(match[3]);

      // Convert degrees and minutes to decimal degrees
      let decimalDegrees = degrees + minutes / 60;

      // If the hemisphere is 'S', make the latitude negative
      if (hemisphere === "S") {
        decimalDegrees = -decimalDegrees;
      }

      return decimalDegrees;
    }
    throw new Error("Invalid latitude string");
  }

  /**
   * Converts a longitude string in the format "E/W [degrees]°[minutes]'" to decimal degrees
   * @param {string} lonString - The longitude string to convert
   * @returns {number | null} The longitude in decimal degrees, or null if the input is invalid
   */
  private fromLongString(lonString: string): number {
    const regex = /^([EW])\s(\d{3})°(\d{2}(?:\.\d{3})?)’$/;
    const match = lonString.match(regex);

    if (match) {
      const hemisphere = match[1];
      const degrees = parseInt(match[2], 10);
      const minutes = parseFloat(match[3]);

      // Convert degrees and minutes to decimal degrees
      let decimalDegrees = degrees + minutes / 60;

      // If the hemisphere is 'W', make the longitude negative
      if (hemisphere === "W") {
        decimalDegrees = -decimalDegrees;
      }

      return decimalDegrees;
    }

    throw new Error("Invalid longitude string");
  }

  /**
   * Calculates the UTM (Universal Transverse Mercator) zone number for the coordinate's longitude.
   * The UTM zone is a number between 1 and 60, each covering 6 degrees of longitude.
   * @returns {number} The UTM zone number
   */
  getUTMZone(): number {
    return Math.floor((this.lon + 180) / 6) + 1;
  }

  /**
   * Returns the latitude band letter of the coordinate, which is needed to uniquely identify a UTM coordinate
   * @returns {string} The latitude band letter of the coordinate
   */
  getLatitudeBand(): string {
    const bands = "CDEFGHJKLMNPQRSTUVWX";
    const index = Math.floor((this.lat + 80) / 8);
    return bands.charAt(index);
  }

  /**
   * Converts degrees to radians
   * @param {number} deg - The angle in degrees to be converted
   * @returns {number} The angle in radians
   */
  static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Converts radians to degrees
   * @param {number} radians - The angle in radians to be converted
   * @returns {number} The angle in degrees
   */
  static toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  /**
   * Converts the coordinate to Universal Transverse Mercator (UTM) coordinates
   * @returns {{ zone: number; easting: number; northing: number; letter: string }} Object containing the UTM zone, easting, northing, and letter
   */
  toUTM(): { zone: number; easting: number; northing: number; letter: string } {
    const a = 6378137.0; // WGS84 major axis
    const f = 1 / 298.257223563; // WGS84 flattening
    const k0 = 0.9996; // scale factor
    const e = Math.sqrt(f * (2 - f)); // eccentricity

    const zone = this.getUTMZone();
    const λ0 = Coordinate.toRad((zone - 1) * 6 - 180 + 3); // central meridian

    const φ = Coordinate.toRad(this.lat);
    const λ = Coordinate.toRad(this.lon);

    const N = a / Math.sqrt(1 - Math.pow(e * Math.sin(φ), 2)); // radius of curvature
    const T = Math.pow(Math.tan(φ), 2); // square of tangent
    const C = ((e * e) / (1 - e * e)) * Math.pow(Math.cos(φ), 2); // eccentricity prime squared
    const A = Math.cos(φ) * (λ - λ0); // angular distance from central meridian

    const M =
      a *
      ((1 -
        (e * e) / 4 -
        (3 * Math.pow(e, 4)) / 64 -
        (5 * Math.pow(e, 6)) / 256) *
        φ -
        ((3 * e * e) / 8 +
          (3 * Math.pow(e, 4)) / 32 +
          (45 * Math.pow(e, 6)) / 1024) *
          Math.sin(2 * φ) +
        ((15 * Math.pow(e, 4)) / 256 + (45 * Math.pow(e, 6)) / 1024) *
          Math.sin(4 * φ) -
        ((35 * Math.pow(e, 6)) / 3072) * Math.sin(6 * φ));

    const easting =
      k0 *
        N *
        (A +
          ((1 - T + C) * Math.pow(A, 3)) / 6 +
          ((5 - 18 * T + T * T + 72 * C - 58 * Math.pow(e, 2)) *
            Math.pow(A, 5)) /
            120) +
      500000;

    let northing =
      k0 *
      (M +
        N *
          Math.tan(φ) *
          ((A * A) / 2 +
            ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
            ((61 - 58 * T + T * T + 600 * C - 330 * Math.pow(e, 2)) *
              Math.pow(A, 6)) /
              720));

    if (this.lat < 0) {
      northing += 10000000; // Add false northing for southern hemisphere
    }

    const letter = this.getUTMLetter(this.lat); // Get the UTM letter based on latitude

    return { zone, easting, northing, letter };
  }

  private static e100kLetters = ["ABCDEFGH", "JKLMNPQR", "STUVWXYZ"];
  private static n100kLetters = [
    "ABCDEFGHJKLMNPQRSTUV",
    "FGHJKLMNPQRSTUVABCDE",
  ]; // Alternates every 2M meters

  /**
   * Converts a latitude and longitude to a Military Grid Reference System (MGRS) string
   * @returns {string} The MGRS string in the format "zone latitudeBand 100kmEastingLetter 100kmNorthingLetter eastingWithin100k northingWithin100k"
   */
  toMGRS(): string {
    const { zone, easting, northing } = this.toUTM();

    const latitudeBand = this.getLatitudeBand();

    // Calculate the correct 100km grid square letters for easting and northing
    const setNumber = zone % 6;

    const e100k = Math.floor(easting / 100000);
    const n100k = Math.floor(northing / 100000) % 20;

    // This honetly is the result of some trial and error, because I couldn't figure out why this didn't work until it did,
    // my test cases (testing against another conversion service indicate this works though)
    const e100kLetter = Coordinate.e100kLetters[(setNumber - 1) % 3].charAt(
      e100k - 1
    );
    const n100kLetter = Coordinate.n100kLetters[(zone + 1) % 2].charAt(n100k);

    // Calculate easting and northing within the 100km square
    const eastingWithin100k = Math.floor(easting % 100000)
      .toString()
      .padStart(5, "0");
    const northingWithin100k = Math.floor(northing % 100000)
      .toString()
      .padStart(5, "0");

    return `${zone}${latitudeBand} ${e100kLetter}${n100kLetter} ${eastingWithin100k} ${northingWithin100k}`;
  }

  /**
   * Returns the UTM letter for the given latitude
   * @param {number} lat The latitude in decimal degrees
   * @returns {string} The UTM letter for the given latitude
   */
  private getUTMLetter(lat: number): string {
    if (lat < 0) {
      // Southern Hemisphere
      if (lat >= -8) return "N";
      if (lat >= -16) return "P";
      if (lat >= -24) return "Q";
      if (lat >= -32) return "R";
      if (lat >= -40) return "S";
      if (lat >= -48) return "T";
      if (lat >= -56) return "U";
      if (lat >= -64) return "V";
      if (lat >= -72) return "W";
      return "X"; // -80 to -90
    } else {
      // Northern Hemisphere
      if (lat < 8) return "C";
      if (lat < 16) return "D";
      if (lat < 24) return "E";
      if (lat < 32) return "F";
      if (lat < 40) return "G";
      if (lat < 48) return "H";
      if (lat < 56) return "J";
      if (lat < 64) return "K";
      if (lat < 72) return "L";
      return "M"; // 72 to 80
    }
  }
}
