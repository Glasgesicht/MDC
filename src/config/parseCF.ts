import { useMCDStore } from "@/stores/mdcData";
import type {
  Flight,
  FlightMember,
  Mission,
  Package,
  Waypoint,
} from "@/types/mdcDataTypes";
import JSZip from "jszip";
import { storeToRefs } from "pinia";
import xml2js from "xml2js";

export function processCF(payload: any /* cf file is a zip */) {
  readCF(payload).then((res) => parseCfXML(res));

  function readCF(payload: any) {
    const zip = new JSZip();
    return new Promise<String>((resolve, reject) => {
      //resolve promise if we can load data from Mission.xml, otherwise reject
      zip
        .loadAsync(payload)
        .then((zip) => {
          return zip.forEach((relativePath, file) => {
            // console.log(relativePath);
            if (relativePath === "mission.xml")
              return file.async("text").then((filedata) => {
                resolve(filedata);
              });
          });
        })
        .catch((error) => reject(error));
    });
  }

  function parseCfXML(input: String) {
    const { packages } = storeToRefs(useMCDStore());

    // console.log(input); // XML as Text
    const parser = new xml2js.Parser({
      explicitArray: true,
      ignoreAttrs: true,
    });

    parser.parseStringPromise(input).then((res: { Mission: Mission }) => {
      // console.dir(res); // Data as Object

      let _packages = res.Mission.Package?.reduce((coll, curr) => {
        coll.push({
          name: curr.Name ? curr.Name[0] : "Name Missing",
          flights: res.Mission.Routes[0].Route.filter(
            (route) => route.PackageTag[0] === curr.Tag[0]
          ).reduce((mColl, mCurr) => {
            //@ts-ignore
            mColl.push({
              //@ts-ignore
              aircrafttype: mCurr.Aircraft[0].Type[0],
              alternate:
                mCurr.Waypoints[0].Waypoint.find(
                  (wp) => wp.Type[0] === "Alternate"
                )?.Name[0] || "",
              arrival:
                mCurr.Waypoints[0].Waypoint.find(
                  (wp) => wp.Type[0] === "Landing"
                )?.Name[0] || "",
              callsign: mCurr.CallsignNameCustomIs[0]
                ? mCurr.CallsignNameCustom[0]
                : mCurr.CallsignName[0],
              callsignNumber: parseInt(mCurr.CallsignNumber[0]),
              homeplate: mCurr.Waypoints[0].Waypoint[0].Name[0],
              MSNumber: mCurr.MSNnumber[0],
              task: mCurr.Task[0],
              tacan: mCurr.Waypoints[0].Waypoint[0].AATCN[0],
              units: new Array<FlightMember>(parseInt(mCurr.Units[0])),

              waypoints: mCurr.Waypoints[0].Waypoint.reduce(
                (wpColl, wpCurr, i) => {
                  wpColl.push({
                    activity: wpCurr.Activity[0],
                    airspeed_calibrated: parseFloat(wpCurr.KCAS[0]),
                    airspeed_total: parseFloat(wpCurr.KTAS[0]),
                    altitude: parseInt(wpCurr.Altitude[0]),
                    groundspeed: parseFloat(wpCurr.GS[0]),
                    latitude: parseFloat(wpCurr.Lat[0]),
                    longitude: parseFloat(wpCurr.Lon[0]),
                    mach: parseFloat(wpCurr.Mach[0]),
                    name: wpCurr.Name[0],
                    tot: wpCurr.TOT[0],
                    type: wpCurr.Type[0],
                    waypointNr: i,
                  });
                  return wpColl;
                },
                new Array<Waypoint>()
              ),
            });

            return mColl;
          }, new Array<Flight>()),
        });
        return coll;
      }, new Array<Package>());

      packages.value = _packages;

      return;
    });
  }
}
