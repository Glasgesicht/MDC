// this doesn't account of the magnetic whaatever, idk, it's like 6° off in syria
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
  bearing = toDegrees(bearing);

  bearing = (bearing + 360) % 360;

  return Math.round(bearing);
}

export function getSTN(type: string, no: number | string, i: number | string) {
  return (
    "" +
    String(
      type.includes("-15")
        ? "49"
        : type.includes("16")
        ? "31"
        : type.includes("18")
        ? "21"
        : "00"
    ) +
    "" +
    (parseInt(no + "") % 7) +
    "" +
    (Number(i) + 1)
  );
}

export function toLatString(lat: number) {
  if (lat)
    return `${lat > 0 ? "N" : "S"} ${lat.toFixed(0)}"${((lat % 1) * 60).toFixed(
      3
    )}`;
  return "";
}

export function toLongString(lon: number) {
  if (lon)
    return `${lon > 0 ? "E" : "W"} ${lon.toFixed(0)}"${((lon % 1) * 60).toFixed(
      3
    )}`;
  return "";
}

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
