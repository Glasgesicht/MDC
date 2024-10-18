// this doesn't account of the magnetic whaatever, idk, it's like 6° off in syria

export function generateInlineGrid(x: number, y: number) {
  return `;grid-column-end: span ${x};
  grid-row-end: span ${y};
  display: inline-grid;
  grid-template-columns: repeat(${x}, 1fr);
  grid-template-rows: repeat(${y}, 1fr);`;
}

/**
 * Generates a CSS string for a grid item with a fixed position and size
 * @param col The starting column of the grid item
 * @param row The starting row of the grid item
 * @param x The number of columns the grid item spans
 * @param y The number of rows the grid item spans
 * @returns The CSS string as an inline style
 */

export function generateInlineGridFixed(
  col: number,
  row: number,
  x: number,
  y: number
) {
  return `
  ;grid-column: ${col} / span ${x};
  grid-row: ${row} / span ${y};
  display: inline-grid;
  grid-template-columns: repeat(${x}, 1fr);
  grid-template-rows: repeat(${y}, 1fr);`;
}

/**
 * Calculates the initial bearing (direction) from a starting point to a destination point
 * @param lat1 The latitude of the starting point in degrees
 * @param lon1 The longitude of the starting point in degrees
 * @param lat2 The latitude of the destination point in degrees
 * @param lon2 The longitude of the destination point in degrees
 * @returns The initial bearing in degrees, rounded to the nearest whole number
 */
export function calculateHeading(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  // Convert latitude and longitude from degrees to radians
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Calculate the difference in longitudes
  const dLon = lon2 - lon1;

  // Calculate the bearing using the arctan2 function
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let bearing = Math.atan2(y, x);

  // Convert the bearing from radians to degrees
  bearing = Math.abs(toDegrees(bearing));

  bearing = bearing % 360;

  return Math.round(bearing);
}

const callsigns313 = [
  "APEX",
  "CANINE",
  "CLAW",
  "PLASMA",
  "JACKAL",
  "TIGER",
  "BEAST",
  "DEMON",
];

/**
 * Generates a 4-digit identifier for a flight, based on the aircraft type,
 * callsign, and sequence number.
 *
 * @param {string} type - The type of aircraft (e.g. "F-15C", "F-16CM", etc.)
 * @param {string} callsign - The callsign of the flight (e.g. "APEX", "CANINE", etc.)
 * @param {number|string} no - The sequence number of the flight (0-7)
 * @param {number|string} i - The index of the flight in the package (0-7)
 * @returns {string} A 4-digit identifier for the flight
 */
export function getSTN(
  type: string,
  callsign: string,
  no: number | string,
  i: number | string
) {
  return (
    "" +
    String(
      type.includes("-15")
        ? "49"
        : callsigns313.includes(callsign)
        ? "31"
        : type.includes("18")
        ? "21"
        : type.includes("16")
        ? "60"
        : "00"
    ) +
    "" +
    (parseInt(no + "") % 8) +
    "" +
    (Number(i) + 1)
  );
}

/**
 * Converts a latitude in decimal degrees to a string in the format "N/S [degrees]°[minutes]'"
 * @param {number} lat - The latitude in decimal degrees
 * @returns {string} A string representation of the latitude, or an empty string if the input is invalid
 */
export function toLatString(lat: number) {
  if (lat)
    return `${lat > 0 ? "N" : "S"} ${Math.floor(Math.abs(lat))}°${(
      (Math.abs(lat) % 1) *
      60
    )
      .toFixed(3)
      .padStart(6, "0")}’`;
  return "";
}

/**
 * Converts a longitude in decimal degrees to a string in the format "E/W [degrees]°[minutes]'"
 * @param {number} lon - The longitude in decimal degrees
 * @returns {string} A string representation of the longitude, or an empty string if the input is invalid
 */

export function toLongString(lon: number) {
  if (lon)
    return `${lon > 0 ? "E" : "W"} ${String(Math.floor(Math.abs(lon))).padStart(
      3,
      "0"
    )}°${((Math.abs(lon) % 1) * 60).toFixed(3).padStart(6, "0")}’`;
  return "";
}

/**
 * Calculates the distance between two points on the surface of the Earth, given in decimal degrees.
 * @param {number} lat1 - The latitude of the first point in decimal degrees
 * @param {number} lon1 - The longitude of the first point in decimal degrees
 * @param {number} lat2 - The latitude of the second point in decimal degrees
 * @param {number} lon2 - The longitude of the second point in decimal degrees
 * @returns {number} The distance between the two points in nautical miles, rounded to one decimal place.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Earth's radius in nautical miles is approximately 3440.065
  let distanceNM = 3440.065 * c;

  // Round the distance to a reasonable number of decimal places
  distanceNM = Math.round(distanceNM * 10) / 10;

  return distanceNM.toFixed(1);
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}
