<template>
  <Button @click="toDTC()" label="Copy DTC" />
</template>
<script setup lang="ts">
import { compressString, decompressString } from "@/config/dtc";
import { useFlightStore } from "@/stores/flightStore";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import { toRaw } from "vue";
const { selectedFlight } = storeToRefs(useFlightStore());

function strToFreq(val: string) {
  const [a, b] = val.split(".");
  b.slice(0, 2);
  return `${a}.${b}`;
}

function toDTC() {
  const toExport = {
    Aircraft: "F16C",
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
        Mode: 2,
      },
      Radio2: {
        Presets: [
          { Number: 1, Name: "test3", Frequency: "124.00" },
          { Number: 2, Name: "test3", Frequency: "125.00" },
        ],
        SelectedFrequency: null,
        SelectedPreset: null,
        EnableGuard: false,
        Mode: 0,
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
        Name: val.description,
        Frequency: strToFreq(val.freq),
      };
    })
    .filter((n) => n.Frequency !== "");

  toExport.Radios.Radio2.Presets = selectedFlight.value.comms.radio2
    .map((val, i) => {
      console.log("val2", i, toRaw(val));
      return {
        Number: i + 1,
        Name: val.description,
        Frequency: strToFreq(val.freq),
      };
    })
    .filter((n) => n.Frequency !== "");

  navigator.clipboard.writeText(compressString(toExport));
}
</script>
