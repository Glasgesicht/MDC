import { usePackageStore } from "@/stores/packageStore";
import type {
  Flight,
  FlightMember,
  Mission,
  OrbitsEntity,
  Package,
  Waypoint,
} from "@/types/mdcDataTypes"; // @ts-ignore // stfu
import JSZip from "jszip";
import { storeToRefs } from "pinia";
import xml2js from "xml2js";
import { flights } from "./flights";
import { getSTN, toLatString, toLongString } from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";
import { random } from "lodash";

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
          agencies: res.Mission.Airspace.map((n) => n.Orbits).reduce<
            OrbitsEntity[]
          >((coll, curr) => {
            //@ts-ignore
            if (curr[0] !== "") return [...coll, ...curr]; // this is bad practice, don't do stuff like that if you're planning on getting paid.
            return coll;
          }, new Array<OrbitsEntity>()),

          /*.reduce(
            (coll, curr) => {
              if (curr.Type.includes("AAR"))
                coll.push({
                  agency: curr.Type,
                  callsign: curr.Name,
                  type: "KC-135", // we filter for AAR and this is pretty much all we got... besides KC-130?
                });

              return coll;
            },
            new Array()
          ),*/ airThreat: "NONE",
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
          ramrod: res.Mission.BlueRAMROD[0],
          situation: res.Mission.Situation[0].replaceAll("&#x13&#x10;", "\n"),
          surfaceThreat: "AAA",
          metar: "",
          name: curr.Name ? curr.Name[0] : "Name Missing",
          flights: res.Mission.Routes[0].Route.filter(
            (route) => route.PackageTag[0] === curr.Tag[0]
          ).reduce((mColl, mCurr) => {
            mCurr.Waypoints[0].Waypoint = mCurr.Waypoints[0].Waypoint.map(
              (wp) => {
                if (wp.Type[0].includes("(ramp)")) wp.Type[0] = "Take off";
                return wp;
              }
            );

            mColl.push({
              // Sanitize Aircraft Type names for display
              aircrafttype:
                mCurr.Aircraft[0].Type[0] === "F-16C_50"
                  ? "F-16CM"
                  : mCurr.Aircraft[0].Type[0] === "F-15ESE"
                  ? "F-15E" //FA-18C_hornet
                  : mCurr.Aircraft[0].Type[0] === "FA-18C_hornet"
                  ? "F/A-18C"
                  : mCurr.Aircraft[0].Type[0],
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
                    callsign: "TBA",
                    search: "",
                    tacan: mCurr.Waypoints[0].Waypoint[0].AATCN[0],
                    laser: "",
                    m2: "",
                    tailNr: "",
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
                        (1 + i)
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
        } satisfies Package;
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
