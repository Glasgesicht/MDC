import { compressString } from "@/config/dtc";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { toLatString, toLongString } from "@/utils/utilFunctions";
import { storeToRefs } from "pinia";
import { toRaw } from "vue";

export const useDTCexports = () => {
  const { selectedFlight } = storeToRefs(useFlightStore());
  const { selectedPKG } = storeToRefs(usePackageStore());

  function getType() {
    switch (selectedFlight.value.aircrafttype) {
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
    console.log(val.split("."));
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

  function loadComms() {
    const toExport = {
      Aircraft: getType(), //this is F-16 only for now
      Upload: null,
      WaypointsCapture: null,
      Waypoints: null,
      CMS: null,
      Radios: {
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
              (fl) => fl.callsign === selectedFlight.value.callsign
            ) + 15,
          EnableGuard: false,
          Mode: 2,
        },
      },
      MFD: null,
      HARM: null,
      HTS: null,
      Datalink: null,
      Misc: null,
      Version: 2,
    };

    toExport.Radios.Radio1.Presets = selectedFlight.value.comms.radio1
      .map((val, i) => {
        return {
          Number: i + 1,
          Name: val?.description,
          Frequency: strToFreq(val?.freq),
        };
      })
      .filter((n) => n.Frequency !== "");

    toExport.Radios.Radio2.Presets = selectedFlight.value.comms.radio2
      .map((val, i) => {
        console.log("val2", i, toRaw(val));
        return {
          Number: i + 1,
          Name: val?.description,
          Frequency: strToFreq(val?.freq),
        };
      })
      .filter((n) => n.Frequency !== "");

    navigator.clipboard.writeText(compressString(toExport));
  }

  const loadSTPS = () => {
    const defaultSTP = {
      Aircraft: "F16C",
      Upload: null,
      WaypointsCapture: null,
      Waypoints: {
        Waypoints: [] as Array<{
          Sequence: number;
          Name: string;
          Latitude: string;
          Longitude: string;
          Elevation: number;
          TimeOverSteerpoint: string | null;
          Target: boolean;
          UseOA: boolean;
          OffsetAimpoint1: null;
          OffsetAimpoint2: null;
          UseVIP: boolean;
          VIPtoTGT: null;
          VIPtoPUP: null;
          UseVRP: boolean;
          TGTtoVRP: null;
          TGTtoPUP: null;
        }>,
      },
      CMS: null,
      Radios: null,
      MFD: null,
      HARM: null,
      HTS: null,
      Datalink: null,
      Misc: null,
      Version: 2,
    };

    selectedFlight.value.waypoints
      .sort((a, b) => a.waypointNr - b.waypointNr)
      .forEach((stp, i) =>
        defaultSTP.Waypoints.Waypoints.push({
          Elevation: stp.altitude,
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
          TimeOverSteerpoint: new Date(stp.tot).toLocaleTimeString("de-DE"),
        })
      );

    selectedFlight.value.dmpis.forEach((dmpi, i) =>
      defaultSTP.Waypoints.Waypoints.push({
        Elevation: dmpi.altitude,
        Latitude: toLatString(dmpi.latitude),
        Longitude: toLongString(dmpi.longitude),
        Name: dmpi.name,
        OffsetAimpoint1: null,
        OffsetAimpoint2: null,
        Sequence: i + 80,
        Target: false,
        UseOA: false,
        TGTtoPUP: null,
        TGTtoVRP: null,
        UseVIP: false,
        UseVRP: false,
        VIPtoPUP: null,
        VIPtoTGT: null,
        TimeOverSteerpoint: null,
      })
    );
    console.log(defaultSTP);
    navigator.clipboard.writeText(compressString(defaultSTP));
  };

  return {
    loadComms,
    loadSTPS,
  };
};
