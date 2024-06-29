<script setup lang="ts">
import { inject, computed } from "vue";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";

import { calculateHeading, calculateDistance } from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";
import { bullseyes } from "@/config/bullseye";

const { selectedFlight } = storeToRefs(useFlightStore());

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const hhmmss = (time: string) => {
  if (!time) return "";
  const date = new Date(time);
  return `${date.toLocaleTimeString()}`;
};

const getBullseyeName = (index: number) => {
  if (bullseyes.at(index)) {
    return bullseyes?.at(index)?.name;
  }
  return "";
};
const getBullseyeLocation = (index: number) => {
  if (bullseyes.at(index)) {
    return bullseyes?.at(index)?.location;
  }
  return "";
};

const toLatString = (lat: number) => {
  if (lat)
    return `${lat > 0 ? "N" : "S"} ${lat.toFixed(0).padStart(2, "0")}°${(
      (lat % 1) *
      60
    )
      .toFixed(3)
      .padStart(6, "0")}` + "'";
  return "";
};

const toLongString = (lon: number) => {
  if (lon)
    return `${lon > 0 ? "E" : "W"} ${lon.toFixed(0).padStart(3, "0")}°${(
      (lon % 1) *
      60
    )
      .toFixed(3)
      .padStart(6, "0")}` + "'";
  return "";
};

const toLatLongString = (lat: number, long: number) => {
  if (lat && long) return toLatString(lat) + " / " + toLongString(long);
  return "";
};

const fuelRange = 10;
const fuelEndurance = 4400;

const minimumFuel = (steerpoint: number) => {
  var routeFuel = 1200;
  for (let i = steerpoint; i < selectedFlight.value.waypoints.length; i++) {
    routeFuel +=
      fuelRange *
      parseFloat(
        calculateDistance(
          selectedFlight?.value.waypoints[i - 1]?.latitude,
          selectedFlight?.value.waypoints[i - 1]?.longitude,
          selectedFlight?.value.waypoints[i]?.latitude,
          selectedFlight?.value.waypoints[i]?.longitude
        )
      );
    if (i !== 1) {
      routeFuel +=
        (parseInt(
          selectedFlight?.value.waypoints[i - 1].activity.substring(6, 8)
        ) /
          60 /
          60) *
          fuelEndurance +
        (parseInt(
          selectedFlight?.value.waypoints[i - 1].activity.substring(3, 5)
        ) /
          60) *
          fuelEndurance +
        parseInt(
          selectedFlight?.value.waypoints[i - 1].activity.substring(0, 2)
        ) *
          fuelEndurance;
    }
  }
  return routeFuel.toFixed(0);
};

const takeoffTime = (tot: string, activity: string) => {
  var hour = parseInt(tot?.substring(0, 2));
  var minute = parseInt(tot?.substring(3, 5));
  var second = parseInt(tot?.substring(6, 8));
  hour += parseInt(activity?.substring(0, 2));
  minute += parseInt(activity?.substring(3, 5));
  second += parseInt(activity?.substring(6, 8));
  while (second > 60) {
    second -= 60;
    minute += 1;
  }
  while (minute > 60) {
    minute -= 60;
    hour += 1;
  }
  while (hour > 24) {
    hour -= 24;
  }
  return (
    hour?.toFixed(0).padStart(2, "0") +
    ":" +
    minute?.toFixed(0).padStart(2, "0") +
    ":" +
    second?.toFixed(0).padStart(2, "0")
  );
};

const showROE = inject("showROE");
</script>

<template>
  <div class="mdcpage">
    <div class="c36 r">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y">PAGE {{ pagenr }}</div>
    <div class="c33 g">STEERPOINTS</div>

    <div class="c2 g">SP</div>
    <div class="c5 g">NAME</div>
    <div class="c3 g">TOS</div>
    <div class="c4 g">HDG / DIST</div>
    <div class="c3 g">GS / M</div>
    <div class="c3 g">ALT</div>
    <div class="c3 g">>FUEL</div>
    <div class="c9 g">LAT / LONG</div>
    <div class="c4 g">ACTIVITY</div>

    <div class="c36 parent" v-for="index in new Array(25).keys()">
      <div class="c2 g">{{ index + 1 }}</div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'}`">
        {{
          selectedFlight?.waypoints[index]?.type === "Steerpoint"
            ? selectedFlight?.waypoints[index]?.name
            : selectedFlight?.waypoints[index]?.type
        }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ index === 0 ? takeoffTime(hhmmss(selectedFlight?.waypoints[index]?.tot), selectedFlight?.waypoints[index]?.activity) : hhmmss(selectedFlight?.waypoints[index]?.tot) }}
      </div>
      <div :class="`c4 ${index % 2 ? 'hg' : 'w'}`">
        {{
          selectedFlight?.waypoints[index]?.longitude &&
          selectedFlight?.waypoints[index - 1]?.longitude
            ? calculateHeading(
                selectedFlight?.waypoints[index - 1]?.latitude,
                selectedFlight?.waypoints[index - 1]?.longitude,
                selectedFlight?.waypoints[index]?.latitude,
                selectedFlight?.waypoints[index]?.longitude
              )
                .toFixed(0)
                .padStart(3, "0") +
              "°M / " +
              parseInt(
                calculateDistance(
                  selectedFlight?.waypoints[index - 1]?.latitude,
                  selectedFlight?.waypoints[index - 1]?.longitude,
                  selectedFlight?.waypoints[index]?.latitude,
                  selectedFlight?.waypoints[index]?.longitude
                )
              ) +
              "nm"
            : ""
        }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{
          index !== 0 ?
          selectedFlight?.waypoints[index]?.groundspeed !== undefined
            ? selectedFlight?.waypoints[index]?.groundspeed?.toFixed(0) +
              " / " +
              selectedFlight?.waypoints[index]?.mach
                ?.toFixed(2)
                .replace("0.", ".")
            : ""
            : ""
        }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{
          selectedFlight?.waypoints[index]?.altitude
            ? selectedFlight?.waypoints[index]?.altitude?.toLocaleString(
                "en-EN"
              ) + " ft"
            : ""
        }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{
          selectedFlight?.waypoints[index]
            ? parseInt(minimumFuel(index + 1)).toLocaleString("en-EN")
            : ""
        }}
      </div>
      <div :class="`c9 hr`">
        {{
          selectedFlight?.waypoints[index]?.latitude !== undefined
            ? toLatString(selectedFlight?.waypoints[index]?.latitude) +
              " // " +
              toLongString(selectedFlight?.waypoints[index]?.longitude)
            : ""
        }}
      </div>
      <div :class="`c4 ${index % 2 ? 'hg' : 'w'}`">
        {{
          selectedFlight?.waypoints[index]?.activity !== "00:00:00"
            ? index !== 0
              ? selectedFlight?.waypoints[index]?.activity
              : ""
            : ""
        }}
      </div>
    </div>

    <div class="c36 g">OPEN STEERPOINTS</div>

    <div class="c2 g">SP</div>
    <div class="c3 g">TYPE</div>
    <div class="c5 g">NAME</div>
    <div class="c9 g">LAT / LONG</div>
    <div class="c3 g">ELEV</div>
    <div class="c14 g">NOTES</div>

    <div class="c36 parent" v-for="index in new Array(19).keys()">
      <div class="c2 g">{{ index + 81 }}</div>
      <div :class="`c3 ${index + 81 < 97 ? (index % 2 ? 'hg' : 'w') : 'g'}`">
        {{ index + 81 < 97 ? selectedFlight.dmpis[index]?.type : "BULLS" }}
      </div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'}`">
        {{
          index + 81 < 97
            ? selectedFlight.dmpis[index]?.name
            : getBullseyeName(index - 16)
        }}
      </div>
      <div :class="`c9 hr`">
        {{
          index + 81 < 97
            ? toLatLongString(
                selectedFlight.dmpis[index]?.latitude,
                selectedFlight.dmpis[index]?.longitude
              )
            : getBullseyeLocation(index - 16)
        }}
      </div>
      <div :class="`c3 ${index + 81 < 97 ? (index % 2 ? 'hg' : 'w') : 'g'}`">
        {{ index + 81 < 97 ? selectedFlight.dmpis[index]?.altitude : "" }}
      </div>
      <div :class="`c14 noborder ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedFlight.dmpis[index]?.note }}
      </div>
    </div>

    <div class="c36 r">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
  </div>
</template>
<style scoped>
@import "@/assets/newstyle.css";
.parent {
  display: inline-grid;
  grid-template-columns: repeat(36, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.bingo {
  display: inline-grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.shuffle {
  display: inline-grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.font500 {
  font-weight: 500;
}
</style>
