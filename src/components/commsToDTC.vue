<template>
  <Button @click="toDTC()" label="Copy DTC" />
</template>
<script setup lang="ts">
import { compressString, decompressString } from "@/config/dtc";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import { toRaw } from "vue";
const { selectedFlight } = storeToRefs(useFlightStore());
const { selectedPKG } = storeToRefs(usePackageStore());

function strToFreq(val: string) {
  if (!val) return "";
  const [a, b] = val.split(".");
  console.log(val.split("."));
  if (b) {
    b.slice(0, 2);
    return `${a}.${b}`;
  }
  return a;
}

function toDTC() {
  const toExport = {
    Aircraft: "F16C", //this is F-16 only for now
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
</script>
