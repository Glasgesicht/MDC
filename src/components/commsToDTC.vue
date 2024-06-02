<template>
  <Button @click="toDTC()" label="Copy DTC" />
</template>
<script setup lang="ts">
import { compressString, decompressString } from "@/config/dtc";
import { useFlightStore } from "@/stores/flightStore";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
const { selectedFlight } = storeToRefs(useFlightStore());

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
      return { Number: i + 1, Name: val.description, Frequency: val.freq };
    })
    .filter((n) => n.Frequency !== "");

  toExport.Radios.Radio2.Presets = selectedFlight.value.comms.radio2
    .map((val, i) => {
      return { Number: i + 1, Name: val.description, Frequency: val.freq };
    })
    .filter((n) => n.Frequency !== "");
  console.log(decompressString(compressString(toExport)));

  navigator.clipboard.writeText(compressString(toExport));

  const dtc =
    "fgMAAB+LCAAAAAAAAAqtUs1OwkAQfhUy54a024qGG/KniQUCVQ+GwwqDaVxa3G5JCGnia3jyFTh58qRv4pM43bItYryZvcx838zk+2Z2C61QziRfKGhCz2m0wYLrlYj5HJpRKoQFt3yzisNIJW2+UqnEXzg0t4fJ3RYm+JRiNKNSx4IBX1IA55gIHtH0K65Clc5zbFDz3I+dw+qux76eX3Iyjh4M263ZnvexcxtEnxV0V+Ca2uOIJp8yZkEQLnG4RjlRiFIrMPICLh+QsgUXCZKnBIetMhsuFgmqVrjULY7p+QkzA1PvzeWobKZYxUE/MLTOR9ejw/JxVU6VKtbAXliel+XZNLOg7U8MO+bzMNYr1RFJ28JIIskqVjtIl/coocnKxSpMSKoFPVlsfUOYy1jdtiGzqobqEp/v9N70e63e8QTb1hOmFl1T4Ezh/IAutBqi0GfQbsTvBfZTLukLKZnSCvw4Pygjp9oU+8tUpTE35R5Jcph3bOrnFn43nPyHh/0dCxN2Ri78XsdUXrTGfhkH5Rk7XHERRo8m98NkVv4XlIn+wiz7BgK4FFx+AwAA";
  const decr = decompressString(dtc);
  console.log(compressString(decompressString(dtc)) === dtc);
  console.log(
    compressString(decr) ===
      compressString(decompressString(compressString(decr)))
  );
}
</script>
