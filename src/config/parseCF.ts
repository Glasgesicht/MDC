import { usePackageStore } from "@/stores/packageStore";
import type {
  Flight,
  FlightMember,
  Mission,
  Package,
  Waypoint,
} from "@/types/mdcDataTypes"; // @ts-ignore // stfu
import JSZip from "jszip";
import { storeToRefs } from "pinia";
import xml2js from "xml2js";
import { flights } from "./flights";
import { getSTN, toLatString, toLongString } from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";

export function processCF(payload: any /* cf file is a zip */) {
  readCF(payload).then((res) => parseCfXML(res));

  function readCF(payload: any) {
    const zip = new JSZip();
    return new Promise<String>((resolve, reject) => {
      //resolve promise if we can load data from Mission.xml, otherwise reject
      zip
        .loadAsync(payload)
        .then((zip: any) => {
          return zip.forEach(
            (
              relativePath: string,
              file: { async: (arg0: string) => Promise<any> }
            ) => {
              // console.log(relativePath);
              if (relativePath === "mission.xml")
                return file.async("text").then((filedata) => {
                  resolve(filedata);
                });
            }
          );
        })
        .catch((error: any) => reject(error));
    });
  }

  function parseCfXML(input: String) {
    const { packages, selectedPKG } = storeToRefs(usePackageStore());

    // console.log(input); // XML as Text
    const parser = new xml2js.Parser({
      explicitArray: true,
      ignoreAttrs: true,
    });

    parser.parseStringPromise(input).then((res: { Mission: Mission }) => {
      console.dir(res); // Data as Object

      let _packages = res.Mission.Package?.reduce((coll, curr) => {
        const newPackage = {
          airThreat: "NONE",
          bullseye: {
            name: res.Mission.BlueBullseye[0]?.Name[0] ?? "",
            lat:
              toLatString(
                parseFloat(res.Mission.BlueBullseye[0]?.Lat[0] ?? "0")
              ) ?? "",
            long:
              toLongString(
                parseFloat(res.Mission.BlueBullseye[0]?.Lon[0] ?? "0")
              ) ?? "",
          },
          packageTask: "Eat Burger",
          roe: "Don't Shoot Friendlies",
          situation: "situation",
          surfaceThreat: "AAA",
          metar: "",
          name: curr.Name ? curr.Name[0] : "Name Missing",
          flights: res.Mission.Routes[0].Route.filter(
            (route) => route.PackageTag[0] === curr.Tag[0]
          ).reduce((mColl, mCurr) => {
            // match callsign with config
            let callsign = flights.find((flight) =>
              flight.callsign.includes(mCurr.CallsignNameCustom[0])
            );

            mCurr.Waypoints[0].Waypoint = mCurr.Waypoints[0].Waypoint.map(
              (wp) => {
                if (wp.Type[0].includes("(ramp)")) wp.Type[0] = "Take off";
                return wp;
              }
            );

            mColl.push({
              aircrafttype: mCurr.Aircraft[0].Type[0],
              DEP: {
                NAME:
                  mCurr.Waypoints[0].Waypoint.find((wp) =>
                    wp.Type[0].includes("Take off")
                  )?.Name[0] || "",
                ARR: "",
                TACAN: "",
                HDG: "",
                ILS: "",
                ELEV: "",
                LEN: "",
              },
              ARR: {
                NAME:
                  mCurr.Waypoints[0].Waypoint.find((wp) =>
                    wp.Type[0].includes("Landing")
                  )?.Name[0] || "",
                ARR: "",
                TACAN: "",
                HDG: "",
                ILS: "",
                ELEV: "",
                LEN: "",
              },

              ALT: {
                NAME:
                  mCurr.Waypoints[0].Waypoint.find((wp) =>
                    wp.Type[0].includes("Alternate")
                  )?.Name[0] || "",
                ARR: "",
                TACAN: "",
                HDG: "",
                ILS: "",
                ELEV: "",
                LEN: "",
              },
              callsign:
                mCurr.CallsignNameCustomIs[0] === "True"
                  ? mCurr.CallsignNameCustom[0]
                  : mCurr.CallsignName[0],
              callsignNumber: parseInt(mCurr.CallsignNumber[0]),
              MSNumber: mCurr.MSNnumber[0],
              missionType: mCurr.Task[0],
              task: "",
              gameplan: "",
              tacan: mCurr.Waypoints[0].Waypoint[0].AATCN[0],
              units: [...new Array(parseInt(mCurr.Units[0])).keys()].map(
                (_n, i) => {
                  return {
                    callsign: "",
                    tailNr: undefined,
                    STN: getSTN(
                      mCurr.Aircraft[0].Type[0],
                      mCurr.CallsignNumber[0] ?? 1,
                      i
                    ),
                    L16: (() => {
                      const callsign = (
                        mCurr.CallsignNameCustomIs[0] === "True"
                          ? mCurr.CallsignNameCustom[0]
                          : mCurr.CallsignName[0]
                      ).toUpperCase();

                      return (
                        callsign.charAt(0) +
                        callsign.charAt(callsign.length - 1) +
                        mCurr.CallsignNumber[0] +
                        (i + 1)
                      );
                    })(),
                  } satisfies FlightMember;
                }
              ), // defaults to number of wingman per cf

              flightTask: "", // not in cf
              // Try to get from CF
              /*              UHF:
                flights.find((flight) =>
                  flight.Callsign.includes(mCurr.CallsignNameCustom[0])
                )?.UHF ?? "",
              VHF:
                flights.find((flight) =>
                  flight.Callsign.includes(mCurr.CallsignNameCustom[0])
                )?.VHF ?? "",*/

              waypoints: mCurr.Waypoints[0].Waypoint.reduce(
                (wpColl, wpCurr, i) => {
                  if (i > 23) return wpColl;
                  wpColl[i] = {
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
                  };
                  return wpColl;
                }, //@ts-ignore
                [...new Array<Waypoint>().keys()].map((_n, i) => {
                  return {
                    waypoint: i,
                  };
                }) as Array<Waypoint>
              ),
            });

            return mColl;
          }, new Array<Flight>()),
        };
        if (newPackage.flights.length) coll.push(newPackage);
        return coll;
      }, new Array<Package>());

      //reset stores before comitting new values
      usePackageStore().reset();
      useFlightStore().reset();
      packages.value = _packages;

      return;
    });
  }
}
