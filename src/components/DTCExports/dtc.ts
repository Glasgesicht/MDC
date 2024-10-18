import { compressString } from "@/utils/dtc";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { toLatString, toLongString } from "@/utils/utilFunctions";
import { storeToRefs } from "pinia";
import type {
  DTC,
  Datalink,
  Waypoint,
  Radios,
  Waypoints,
  Misc,
} from "../../types/dtcTypes";
import { bullseyes } from "@/config/bullseye";
import type { theatre } from "@/types/theatre";
import { useGlobalStore } from "@/stores/theatreStore";

export const useDTCexports = () => {
  const { getFlight } = storeToRefs(useFlightStore());
  const { selectedPKG } = storeToRefs(usePackageStore());
  const { theater } = storeToRefs(useGlobalStore());

  /** Util Functions */
  function getType() {
    switch (getFlight.value.aircrafttype) {
      case "F-16CM":
        return "F16C";
      case "F-15E":
        return "F15E";
      case "F/A-18C":
        return "FA18C";
    }
  }

  function strToFreq(val: string) {
    if (!val) return "";
    const [a, b] = val.split(".");

    if (b) {
      if (getType() === "F15E")
        switch (b[1]) {
          case "2":
          case "7":
            return `${a}.${b.padEnd(3, "5")}`;
          default:
            return `${a}.${b.padEnd(3, "0")}`;
        }
      else {
        return `${a}.${b.slice(0, 2)}`;
      }
    }
    return a;
  }

  function makeDTC(flight: DTC) {
    return compressString(flight);
  }

  function toClipboard(input: string) {
    navigator.clipboard.writeText(input);
  }

  /** Data Functions */
  function getComms() {
    const Radios: Radios = {
      Radio1: {
        Presets: [
          { Number: 2, Name: "test2", Frequency: "322.00" },
          { Number: 1, Name: "test1", Frequency: "300.00" },
        ],
        SelectedFrequency: null,
        SelectedPreset: null,
        EnableGuard: true,
        Mode: 0,
      },
      Radio2: {
        Presets: [
          { Number: 1, Name: "test3", Frequency: "124.00" },
          { Number: 2, Name: "test3", Frequency: "125.00" },
        ],
        SelectedFrequency: null,
        SelectedPreset:
          selectedPKG.value.flights.findIndex(
            (fl) => fl.callsign === getFlight.value.callsign
          ) + 15,
        EnableGuard: false,
        Mode: 2,
      },
    };

    Radios.Radio1.Presets = getFlight.value.comms.radio1
      .map((val, i) => {
        return {
          Number: i + 1,
          Name: val?.description,
          Frequency: strToFreq(val?.freq),
        };
      })
      .filter((n) => n.Frequency !== "");

    Radios.Radio2.Presets = getFlight.value.comms.radio2
      .map((val, i) => {
        return {
          Number: i + 1,
          Name: val?.description,
          Frequency: strToFreq(val?.freq),
        };
      })
      .filter((n) => n.Frequency !== "");

    return Radios;
  }

  const getWaypoints = (mode: "waypoints" | "bullseye" | "dmpi" | "all") => {
    const wpts: Waypoints = { Waypoints: new Array<Waypoint>() }; //Weirdly nested per spec

    if (mode === "all" || mode === "waypoints")
      getFlight.value.waypoints
        .sort((a, b) => a.waypointNr - b.waypointNr)
        .forEach((stp, i) =>
          wpts.Waypoints.push({
            Elevation: parseInt("" + stp.altitude),
            Latitude: toLatString(stp.latitude),
            Longitude: toLongString(stp.longitude),
            Name: stp.type === "Steerpoint" ? stp.name : stp.type,
            OffsetAimpoint1: null,
            OffsetAimpoint2: null,
            Sequence: stp.waypointNr,
            Target: false,
            UseOA: false,
            TGTtoPUP: null,
            TGTtoVRP: null,
            UseVIP: false,
            UseVRP: false,
            VIPtoPUP: null,
            VIPtoTGT: null,
            TimeOverSteerpoint: new Date(stp.tot).toLocaleTimeString("de-DE"), // 18:45:23
          })
        );

    if (mode === "all" || mode === "dmpi")
      getFlight.value.dmpis.forEach((dmpi, i) => {
        wpts.Waypoints.push({
          Elevation: dmpi.altitude,
          Latitude: toLatString(dmpi.latitude),
          Longitude: toLongString(dmpi.longitude),
          Name: dmpi.name,
          OffsetAimpoint1: null,
          OffsetAimpoint2: null,
          Sequence: i + 81,
          Target: false,
          UseOA: false,
          TGTtoPUP: null,
          TGTtoVRP: null,
          UseVIP: false,
          UseVRP: false,
          VIPtoPUP: null,
          VIPtoTGT: null,
          TimeOverSteerpoint: null,
        });
      });

    if (mode === "all" || mode === "bullseye")
      selectedPKG.value.bullseyes.forEach((bullzeye) => {
        wpts.Waypoints.push({
          Elevation: 0,
          Latitude: bullzeye.lat,
          Longitude: bullzeye.long,
          Name: bullzeye.name,
          OffsetAimpoint1: null,
          OffsetAimpoint2: null,
          Sequence: bullzeye.wp,
          Target: false,
          UseOA: false,
          TGTtoPUP: null,
          TGTtoVRP: null,
          UseVIP: false,
          UseVRP: false,
          VIPtoPUP: null,
          VIPtoTGT: null,
          TimeOverSteerpoint: null,
        });
      });
    return wpts;
  };

  // TODO: needs more granuality to be setup via Flight Settings.
  const getDataLink = (): Datalink => {
    return {
      DatalinkMode: 1,
      EnableMembers: true,
      EnableOwnCallsign: true,
      FlightLead: true,
      Members: [
        ...getFlight.value.units.map((unit) => parseInt(unit.STN)),
        ...new Array(8 - getFlight.value.units.length).fill("0"),
      ],
      OwnCallsign:
        getFlight.value.callsign.charAt(0) +
        getFlight.value.callsign.charAt(getFlight.value.callsign.length - 1) +
        getFlight.value.callsignNumber +
        "1",
      OwnshipIndex: 1, // Assumes Flight lead
      TDOAMembers: [
        ...getFlight.value.units.map(() => true),
        ...new Array<boolean>(8 - getFlight.value.units.length).fill(false),
      ],
    } satisfies Datalink;
  };

  const getMISC = (): Misc => {
    return getFlight.value.misc;
  };

  function getDTC(input: {
    CMS: boolean;
    Datalink: boolean;
    HARM: boolean;
    HTS: boolean;
    MFD: boolean;
    Misc: boolean;
    Radios: boolean;
    Upload: boolean;
    Waypoints: "all" | "dmpi" | "waypoints" | false;
  }) {
    const flight: DTC = newBasicFlight();
    if (input.Waypoints) flight.Waypoints = getWaypoints(input.Waypoints);
    if (input.Radios) flight.Radios = getComms();
    if (input.Datalink) flight.Datalink = getDataLink();
    if (input.Misc) flight.Misc = getMISC();
    flight.Upload = {
      CMS: false,
      Datalink: input.Datalink,
      Radios: input.Radios,
      Waypoints: !!input.Waypoints,
      HARMHTS: false,
      MFDs: false,
      Misc: input.Misc,
    };

    // console.log("exporting:", JSON.stringify(flight));
    return flight;
  }

  /** export Functions */
  function loadSTPS(mode: "all" | "dmpi" | "waypoints") {
    const flight: DTC = newBasicFlight();
    flight.Waypoints = getWaypoints(mode);
    toClipboard(makeDTC(flight));
  }

  function loadComms() {
    const flight: DTC = newBasicFlight();
    flight.Radios = getComms();
    toClipboard(makeDTC(flight));
  }

  function loadDTC(input: {
    CMS: boolean;
    Datalink: boolean;
    HARM: boolean;
    HTS: boolean;
    MFD: boolean;
    Misc: boolean;
    Radios: boolean;
    Upload: boolean;
    Waypoints: "all" | "dmpi" | "waypoints" | false;
  }) {
    toClipboard(makeDTC(getDTC(input)));
  }

  /** Creates Empty DTC template */
  function newBasicFlight() {
    return {
      Aircraft: getType()!,
      CMS: null,
      Datalink: null,
      HARM: null,
      HTS: null,
      MFD: null,
      Misc: null,
      Radios: null,
      Upload: null,
      Version: 2,
      Waypoints: null,
    } as DTC;
  }

  return {
    loadSTPS,
    loadComms,
    loadDTC,
    // getComms,
    // getWaypoints,
    // getDataLink
  };
};
