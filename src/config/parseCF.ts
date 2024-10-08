import { usePackageStore } from "@/stores/packageStore";
import { useGlobalStore } from "@/stores/theatreStore";
import type {
  Flight,
  Mission,
  Package,
  PackageEntity,
  RouteEntity,
  WaypointEntity,
} from "@/types/mdcDataTypes";
import JSZip from "jszip";
import { storeToRefs } from "pinia";
import xml2js from "xml2js";
import { flights } from "./flights";
import { getSTN, toLatString, toLongString } from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";
import { airports } from "./airfields";
import { DateTime } from "luxon";

export function processCF(
  payload:
    | string
    | number[]
    | Uint8Array
    | ArrayBuffer
    | Blob
    | NodeJS.ReadableStream
    | Promise<
      | string
      | number[]
      | Uint8Array
      | ArrayBuffer
      | Blob
      | NodeJS.ReadableStream
    > /* cf file is a zip */
) {
  readCF(payload).then((res) => parseCfXML(res));

  async function readCF(
    payload:
      | string
      | number[]
      | Uint8Array
      | ArrayBuffer
      | Blob
      | NodeJS.ReadableStream
      | Promise<
        | string
        | number[]
        | Uint8Array
        | ArrayBuffer
        | Blob
        | NodeJS.ReadableStream
      >
  ) {
    const zip = new JSZip();
    try {
      const zipData = await zip.loadAsync(payload);
      for await (const [relativePath, file] of Object.entries(zipData.files)) {
        if (relativePath === "mission.xml") {
          return await file.async("text");
        }
      }
      throw new Error("Mission.xml not found in zip");
    } catch (error) {
      console.error("Error reading zip:", error);
      throw error;
    }
  }

  function parseCfXML(input: string) {
    const { packages } = storeToRefs(usePackageStore());
    const { theater } = storeToRefs(useGlobalStore());
    const parser = new xml2js.Parser({
      explicitArray: true,
      ignoreAttrs: true,
    });

    parser
      .parseStringPromise(input)
      .then((res: { Mission: Mission }) => {
        console.dir(res); // Data as Object
        theater.value = res.Mission.Theater[0];

        const _packages: Package[] = res.Mission.Package?.reduce(
          (coll: Package[], curr: PackageEntity) => {
            const newPackage: Package = {
              //agencies: res.Mission.Airspace.flatMap((n) => n.Orbits),
              // Empty Codewords on start
              codewords: [null, null, null, null, null, null, null].map(
                (_n, i) => {
                  return {
                    name: "⠀",
                    criteria: "⠀",
                    authority: "⠀",
                    action: "⠀",
                  };
                }
              ),
              agencies: makeAgencies(res.Mission.Routes[0].Route),
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
              packageTask: "",
              roe: "Don't Shoot Friendlies",
              ramrod: res.Mission.BlueRAMROD[0],
              situation: res.Mission.Situation[0].replaceAll(
                "&#x13&#x10;",
                "\n"
              ),
              surfaceThreat: "",
              metar: "",
              name: curr.Name ? curr.Name[0] : "Name Missing", //
              flights: makeFlight(res.Mission.Routes[0].Route, curr),
            };

            if (newPackage.flights.length) coll.push(newPackage);
            return coll;
          },
          []
        );

        usePackageStore().reset();
        useFlightStore().reset();
        packages.value = _packages;
        //console.log(toRaw(agencies.value));
      })
      .catch((error) => console.error("Error parsing XML:", error));
  }

  function getAircraftType(type: string): string {
    switch (type) {
      case "F-16C_50":
        return "F-16CM";
      case "F-15ESE":
        return "F-15E";
      case "FA-18C_hornet":
        return "F/A-18C";
      default:
        return type;
    }
  }

  function makeAgencies(rt: RouteEntity[]) {
    if (rt)
      return rt
        .filter((item) => // Filter out tankers/AWACS
          ["KC-135", "KC135MPRS", "KC130", "E-3A"].includes(
            item.Aircraft[0].Type[0]
          )
        )
        .map((agency) => {
          return {
            name:
              (agency.CallsignNameCustom[0] || agency.CallsignName[0]) +
              " " +
              agency.CallsignNumber[0],
            freq: agency.Waypoints[0].Waypoint[0].Frq[0],
            type: agency.Aircraft[0].Type[0],
            activity: agency.Waypoints[0].Waypoint[0].Activity[0],
            tacan: agency.Waypoints[0].Waypoint[0].AATCN[0],
            lat: agency.Waypoints[agency.Waypoints.length - 1].Waypoint[
              agency.Waypoints[agency.Waypoints.length - 1].Waypoint.length - 1
            ].Lat[0],
            lon: agency.Waypoints[agency.Waypoints.length - 1].Waypoint[
              agency.Waypoints[agency.Waypoints.length - 1].Waypoint.length - 1
            ].Lon[0],
            alt: agency.Waypoints[agency.Waypoints.length - 1].Waypoint[
              agency.Waypoints[agency.Waypoints.length - 1].Waypoint.length - 1
            ].Altitude[0],
            active: false,
          };
        }); // parse them into an array to be selectable from
    return [];
  }

  function makeFlight(rt: RouteEntity[], pkg: PackageEntity): Flight[] {
    if (!rt) return [];
    return rt
      .filter((route) => route.PackageTag[0] === pkg.Tag[0])
      .filter(
        (item) =>
          !["KC-135", "KC135MPRS", "KC130", "E-3A"].includes(
            item.Aircraft[0].Type[0]
          )
      )
      .map((mCurr, i, pkg): Flight => {
        const comm = assignComms(pkg, i);

        let startTime = DateTime.fromJSDate(
          new Date(mCurr.Waypoints[0].Waypoint[0].TOT[0])
        ).minus({ hours: 3 }); // TODO: HARDCODED SYRIA/ PG UTC TIME OFFSET
        const taxiReg = mCurr.Waypoints[0].Waypoint[0].Activity[0].match(
          /(\d{1,2}):(\d{1,2}):(\d{2})/
        );
        startTime = startTime.plus({
          hours: parseInt(taxiReg?.at(1) || "0") || 0,
          minute: parseInt(taxiReg?.at(2) || "0") || 0,
        });
        const takeoff = `${startTime.hour
          .toString()
          .padStart(2, "0")}:${startTime.minute.toString().padStart(2, "0")}Z`;
        startTime = startTime.minus({ minute: 6 });
        const taxi = `${startTime.hour
          .toString()
          .padStart(2, "0")}:${startTime.minute.toString().padStart(2, "0")}Z`;

        return {
          isActive: true,
          // taxiTime:
          aircrafttype: getAircraftType(mCurr.Aircraft[0].Type[0]),
          DEP: getWaypoint(mCurr, "Take off"),
          ARR: getWaypoint(mCurr, "Landing").NAME // Use Take Off, If landing not avail
            ? getWaypoint(mCurr, "Landing")
            : getWaypoint(mCurr, "Take off"),
          ALT: getWaypoint(mCurr, "Alternate"),
          fence_in: getWaypointIndex(mCurr, "Push Pt"),
          fence_out: getWaypointIndex(mCurr, "Exit Pt"),

          takeoff: takeoff,
          taxi: taxi,
          gameplan: "",
          task: "",
          flightTask: "",
          callsign: getCallsign(mCurr),
          callsignNumber: parseInt(mCurr.CallsignNumber[0]),
          MSNumber: mCurr.MSNnumber[0],
          missionType: mCurr.Task[0],
          tacan: mCurr.Waypoints[0].Waypoint[0].AATCN[0],
          units: getUnits(mCurr),
          comms: comm,
          waypoints: getWaypoints(mCurr.Waypoints[0].Waypoint),
          dmpis: new Array(),
          mycomm: {
            pri: {
              description: comm.radio1[i + 14]?.description ?? "",
              freq: comm.radio1[i + 14]?.freq ?? "",
              name: comm.radio1[i + 14]?.name ?? "",
              number: comm.radio1[i + 14]?.number ?? NaN,
            },
            sec: {
              description: comm.radio2[i + 14]?.description ?? "",
              freq: comm.radio2[i + 14]?.freq ?? "",
              name: comm.radio2[i + 14]?.name ?? "",
              number: comm.radio2[i + 14]?.number ?? NaN,
            },
          },

          /*mycomm: {
            pri: assignComms(pkg, i).radio1[i + 15] || {
              freq: "",
              name: "",
              number: NaN,
              description: "",
            },
            sec: assignComms(pkg, i).radio2[i + 15] || {
              freq: "",
              name: "",
              number: NaN,
              description: "",
            },
          },*/
        };
      });
  }

  function getWaypoint(mCurr: RouteEntity, type: string) {
    const wp = mCurr.Waypoints[0].Waypoint.find((wp) =>
      wp.Type[0].includes(type)
    );
    const ap = airports.find((n) =>
      wp?.Name[0].toUpperCase().includes(n?.NAME.toUpperCase())
    ) ?? {
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
    };

    return structuredClone(ap);
  }

  function getWaypointIndex(mCurr: RouteEntity, type: string): number {
    return mCurr.Waypoints[0].Waypoint.findIndex((wp) => wp.Type[0] === type);
  }

  function getCallsign(mCurr: RouteEntity): string {
    return mCurr.CallsignNameCustomIs[0] === "True"
      ? mCurr.CallsignNameCustom[0]
      : mCurr.CallsignName[0];
  }

  function getUnits(mCurr: RouteEntity) {
    return [...new Array(parseInt(mCurr.Units[0])).keys()].map((_n, i) => ({
      callsign: "",
      search: "",
      tacan: mCurr.Waypoints[0].Waypoint[0].AATCN[0],
      laser: "",
      m2: "",
      tailNr: "",
      STN: getSTN(
        mCurr.Aircraft[0].Type[0],
        mCurr.CallsignNameCustom[0],
        mCurr.CallsignNumber[0] ?? 1,
        i
      ),
      L16:
        getCallsign(mCurr).toUpperCase().charAt(0) +
        getCallsign(mCurr)
          .toUpperCase()
          .charAt(getCallsign(mCurr).length - 1) +
        mCurr.CallsignNumber[0] +
        (1 + i),
    }));
  }

  function assignComms(pkg: RouteEntity[], i: number) {
    /**
     * One of the problem here, is that
     *
     */
    const radio1: {
      freq: string;
      name: string;
      number?: number;
      description: string;
    }[] = new Array(20).fill({}).map(() => {
      return {
        freq: "",
        name: "",
        description: "",
        number: NaN,
      };
    });
    const radio2: {
      freq: string;
      name: string;
      number?: number;
      description: string;
    }[] = new Array(pkg[i].Aircraft[0].Type[0].includes("15") ? 40 : 20) // 40 Channels on F-15, 20 on F-16
      .fill({})
      .map(() => {
        return {
          freq: "",
          name: "",
          description: "",
          number: NaN,
        };
      });

    const takeoff = getWaypoint(pkg[i], "Take off");
    const landing = getWaypoint(pkg[i], "Landing");
    const alt = getWaypoint(pkg[i], "Alternate");

    // DEPARTURE

    if (takeoff.ICAO) {
      radio1[0] = {
        freq: takeoff.ATIS.uhf,
        description: takeoff.ICAO + " " + "ATIS",
        name: "",
      };
      radio2[0] = {
        freq: takeoff.ATIS.vhf,
        description: takeoff.ICAO + " " + "ATIS",
        name: "",
      };

      radio1[1] = {
        freq: takeoff.GROUND.uhf,
        description: takeoff.ICAO + " " + "GRND",
        name: "",
      };
      radio2[1] = {
        freq: takeoff.GROUND.vhf,
        description: takeoff.ICAO + " " + "GRND",
        name: "",
      };

      radio1[2] = {
        freq: takeoff.TOWER.uhf,
        description: takeoff.ICAO + " " + "TOWR",
        name: "",
      };
      radio2[2] = {
        freq: takeoff.TOWER.vhf,
        description: takeoff.ICAO + " " + "TOWR",
        name: "",
      };

      radio1[3] = {
        freq: takeoff.APPR.uhf,
        description: takeoff.ICAO + " " + "APR",
        name: "",
      };
      radio2[3] = {
        freq: takeoff.APPR.vhf,
        description: takeoff.ICAO + " " + "APR",
        name: "",
      };
    }
    // LANDING
    if (landing.ICAO) {
      radio1[8] = {
        freq: landing.GROUND.uhf,
        description: landing.ICAO + " " + "GRND",
        name: "",
      };
      radio2[8] = {
        freq: landing.GROUND.vhf,
        description: landing.ICAO + " " + "GRND",
        name: "",
      };

      radio1[7] = {
        freq: landing.TOWER.uhf,
        description: landing.ICAO + " " + "TOWR",
        name: "",
      };
      radio2[7] = {
        freq: landing.TOWER.vhf,
        description: landing.ICAO + " " + "TOWR",
        name: "",
      };

      radio1[6] = {
        freq: landing.APPR.uhf,
        description: landing.ICAO + " " + "APR",
        name: "",
      };
      radio2[6] = {
        freq: landing.APPR.vhf,
        description: landing.ICAO + " " + "APR",
        name: "",
      };
    }
    // ALTERNATE
    if (alt.ICAO) {
      radio1[11] = {
        freq: alt.GROUND.uhf,
        description: alt.ICAO + " " + "GRND",
        name: "",
      };
      radio2[11] = {
        freq: alt.GROUND.vhf,
        description: alt.ICAO + " " + "GRND",
        name: "",
      };

      radio1[10] = {
        freq: alt.TOWER.uhf,
        description: alt.ICAO + " " + "TOWR",
        name: "",
      };
      radio2[10] = {
        freq: alt.TOWER.vhf,
        description: alt.ICAO + " " + "TOWR",
        name: "",
      };

      radio1[9] = {
        freq: alt.APPR.uhf,
        description: alt.ICAO + " " + "APR",
        name: "",
      };
      radio2[9] = {
        freq: alt.APPR.vhf,
        description: alt.ICAO + " " + "APR",
        name: "",
      };
    }
    radio1[19] = {
      freq: "362.30",
      description: "NATO COMBINED",
      name: "",
    };
    pkg.forEach((flight, i) => {
      const t = flights.find(
        (f) => f.callsign === flight.CallsignNameCustom[0]
      );

      if (t) {
        radio1[i + 14] = {
          freq: t.pri.freq,
          name: t.pri.name,
          number: parseInt(t.pri.number),
          description: t.callsign + " " + t.number,
        };
        radio2[i + 14] = {
          freq: t.sec.freq,
          name: t.sec.name,
          number: parseInt(t.sec.number),
          description: t.callsign + " " + t.number,
        };
      } else if (flight.Waypoints[0].Waypoint[0].Frq) {
        if (parseFloat(flight.Waypoints[0].Waypoint[0].Frq[0]) > 200)
          radio1[i + 14] = {
            freq: flight.Waypoints[0].Waypoint[0].Frq[0],
            name: "",
            number: NaN,
            description:
              (flight.CallsignNameCustom[0] || flight.CallsignName[0]) +
              " " +
              flight.CallsignNumber[0],
          };
        else
          radio2[i + 14] = {
            freq: flight.Waypoints[0].Waypoint[0].Frq[0],
            name: "",
            number: NaN,
            description:
              (flight.CallsignNameCustom[0] || flight.CallsignName[0]) +
              " " +
              flight.CallsignNumber[0],
          };
      }
    });

    // console.log(radio1);
    return { radio1: radio1, radio2: radio2 };
  }

  function getWaypoints(waypoints: WaypointEntity[]) {
    return waypoints.slice(0, 24).map((wp, i: number) => ({
      activity: wp.Activity[0],
      airspeed_calibrated: parseFloat(wp.KCAS[0]),
      airspeed_total: parseFloat(wp.KTAS[0]),
      altitude: parseInt(wp.Altitude[0]),
      groundspeed: parseFloat(wp.GS[0]),
      latitude: parseFloat(wp.Lat[0]),
      longitude: parseFloat(wp.Lon[0]),
      mach: parseFloat(wp.Mach[0]),
      name: wp.Name[0],
      tot: wp.TOT[0],
      type: wp.Type[0],
      waypointNr: i + 1,
      hideOnMDC: false,
    }));
  }
}
