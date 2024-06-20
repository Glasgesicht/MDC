<script setup lang="ts">
import { compressString, decompressString } from "@/config/dtc";
import { getSTN, toLatString, toLongString } from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
const { selectedFlight } = storeToRefs(useFlightStore());

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

const loadSTPS = () => {
  selectedFlight.value.waypoints.forEach((stp, i) =>
    defaultSTP.Waypoints.Waypoints.push({
      Elevation: stp.altitude,
      Latitude: toLatString(stp.latitude),
      Longitude: toLongString(stp.longitude),
      Name: stp.name,
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
</script>
<template><Button label="to DTC" @click="loadSTPS" /></template>
