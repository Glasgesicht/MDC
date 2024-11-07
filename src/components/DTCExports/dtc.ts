import { compressString } from "@/utils/dtc";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import type {
  DTCF16,
  Datalink,
  Waypoint,
  Radios,
  Waypoints,
  Misc,
  DTCF15E,
  MiscF15E,
} from "../../types/dtcTypes";
import { bullseyes } from "@/config/bullseye";
import type { theatre } from "@/types/theatre";
import { useGlobalStore } from "@/stores/theatreStore";
import { get } from "lodash";

export const useDTCexports = () => {
  const { getFlight } = storeToRefs(useFlightStore());
  const { selectedPKG } = storeToRefs(usePackageStore());
  const { theatre } = storeToRefs(useGlobalStore());

  /** Util Functions */
  function getType() {
    switch (getFlight.value.aircrafttype) {
      case "F-16CM":
        return "F-16C";
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

  function makeDTC(flight: DTCF16 | DTCF15E) {
    return compressString(flight);
  }

  function toClipboard(input: string) {
    navigator.clipboard.writeText(input);
  }

  /** Data Functions */
  function getComms() {
    const Radios: Radios = {
      Radio1: {
        Presets: [],
        SelectedFrequency: null,
        SelectedPreset: null,
        EnableGuard: true,
        Mode: 0,
      },
      Radio2: {
        Presets: [],
        SelectedFrequency: null,
        SelectedPreset:
          selectedPKG.value.flights.findIndex(
            (fl) =>
              fl.callsign === getFlight.value.callsign &&
              fl.callsignNumber === getFlight.value.callsignNumber
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
            Elevation: parseInt("" + stp.location.elevation),
            Latitude: stp.location.toLatString(),
            Longitude: stp.location.toLongString(),
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
          Elevation: dmpi.location.elevation,
          Latitude: dmpi.location.toLatString(),
          Longitude: dmpi.location.toLongString(),
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
          Latitude: bullzeye.location.toLatString(),
          Longitude: bullzeye.location.toLongString(),
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

  const getMISCF15E = (): MiscF15E => {
    return {
      BullseyeCoord: selectedPKG.value.bullseyes
        .find((w) => w.wp === getFlight.value.misc.BullseyeWP)
        ?.location.toString(),
      BullseyeToBeUpdated: true,
    };
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
    // console.log(getFlight.value.aircrafttype);
    switch (getFlight.value.aircrafttype) {
      case "F-15E":
        return f15();
      case "F-16C":
        return f16();
    }
    return f16();
    function f16() {
      const flight: DTCF16 = newBasicF16Flight();
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

    function f15() {
      const flight: DTCF15E = newBasicF15EFlight();
      if (input.Waypoints) flight.RouteA = getWaypoints(input.Waypoints);
      if (input.Radios) flight.Radios = getComms();
      //if (input.Datalink) flight.Datalink = getDataLink();
      if (input.Misc) flight.Misc = getMISCF15E();
      flight.Upload = {
        // CMS: false,
        // Datalink: input.Datalink,
        Radios: input.Radios,
        RouteA: !!input.Waypoints,
        // HARMHTS: false,
        //    MFDs: false,
        Misc: input.Misc,
        Displays: false,
        RouteB: false,
        SmartWeapons: false,
        RouteC: false,
        DisplayUploadMode: 1,
      };

      // console.log("exporting:", JSON.stringify(flight));
      return flight;
    }
  }

  /** export Functions */
  function loadSTPS(mode: "all" | "dmpi" | "waypoints") {
    const flight: DTCF16 = newBasicF16Flight();
    flight.Waypoints = getWaypoints(mode);
    toClipboard(makeDTC(flight));
  }

  function loadComms() {
    let flight: DTCF16 | DTCF15E;
    switch (getFlight.value.aircrafttype) {
      case "F-16CM":
        flight = newBasicF16Flight();
        flight.Radios = getComms();
        toClipboard(makeDTC(flight));
        break;
      case "F-15E":
        flight = newBasicF15EFlight();
        flight.Radios = getComms();
        toClipboard(makeDTC(flight));
      case "F/A-18C":
        // Not Implemented
        break;
    }
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
    // console.log(getDTC(input));
    toClipboard(makeDTC(getDTC(input)));
  }

  /** Creates Empty DTC template */
  function newBasicF16Flight() {
    return {
      Aircraft: "F16C",
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
      WaypointsCapture: null,
    } satisfies DTCF16;
  }

  function newBasicF15EFlight() {
    return {
      Aircraft: "F15E",
      Misc: null,
      Radios: null,
      Upload: null,
      Version: 2,
      RouteA: null,
      RouteB: null,
      RouteC: null,
      WaypointsCapture: null,
      Displays: null,
      SmartWeapons: null,
    } satisfies DTCF15E;
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
