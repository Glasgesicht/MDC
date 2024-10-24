<script setup lang="ts">
import { inject, computed } from "vue";
import { storeToRefs } from "pinia";
import { usePackageStore } from "@/stores/packageStore";

import {
  calculateHeading,
  calculateDistance,
  toLatString,
  toLongString,
} from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";

const { getFlight } = storeToRefs(useFlightStore());
const { selectedPKG } = storeToRefs(usePackageStore());
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
  selectedPKG.value.bullseyes.at(Number(selectedPKG.value.selectedBullseye))
    ?.name;
};
const getBullseyeLocation = (index: number) => {
  const bullz = selectedPKG.value.bullseyes.at(
    Number(selectedPKG.value.selectedBullseye)
  );

  return bullz?.location.lat + " " + bullz?.location.lon;
};

const toLatLongString = (lat: number, long: number) => {
  if (lat && long) return toLatString(lat) + " / " + toLongString(long);
  return "";
};

const fuelRange = 10;
const fuelEndurance = 4400;

const calculateMinimumFuel = (steerpoint: number): string => {
  let routeFuel = 1200;
  const landingIndex = getFlight.value.waypoints.findIndex((n) =>
    n.type.includes("Landing")
  );
  if (landingIndex !== -1) {
    for (let i = steerpoint; i < landingIndex; i++) {
      const distance = calculateDistance(
        getFlight.value.waypoints[i - 1]?.location.lat,
        getFlight.value.waypoints[i - 1]?.location.lon,
        getFlight.value.waypoints[i]?.location.lat,
        getFlight.value.waypoints[i]?.location.lon
      );
      routeFuel += fuelRange * parseFloat(distance);
      if (i !== 1) {
        const activity = getFlight.value.waypoints[i - 1].activity;
        const hours = parseInt(activity.substring(0, 2));
        const minutes = parseInt(activity.substring(3, 5));
        const seconds = parseInt(activity.substring(6, 8));
        routeFuel += (seconds / 60 / 60 + minutes / 60 + hours) * fuelEndurance;
      }
    }
  }
  return routeFuel.toFixed(0);
};

const calculateTakeoffTime = (
  takeoffTimeStr: string,
  activityStr: string
): string => {
  if (!activityStr || !activityStr) return "";
  const takeoffTime = takeoffTimeStr.split(":").map(Number);
  const activity = activityStr.split(":").map(Number);
  if (!takeoffTime || !activity) return "";

  const hour = takeoffTime[0] + activity[0];
  const minute = takeoffTime[1] + activity[1];
  const second = takeoffTime[2] + activity[2];

  let newHour = hour;
  let newMinute = minute;
  let newSecond = second;

  if (newSecond >= 60) {
    newMinute += Math.floor(newSecond / 60);
    newSecond %= 60;
  }
  if (newMinute >= 60) {
    newHour += Math.floor(newMinute / 60);
    newMinute %= 60;
  }
  if (newHour >= 24) {
    newHour %= 24;
  }

  return `${newHour.toString().padStart(2, "0")}:${newMinute
    .toString()
    .padStart(2, "0")}:${newSecond.toString().padStart(2, "0")}`;
};

const showROE = inject("showROE");
</script>

<template>
  <div class="mdcpage bdr" id="mdcpage" name="mdcpage">
    <div class="c36 r bdr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y bdr">PAGE {{ pagenr }}</div>
    <div class="c33 g bdr">STEERPOINTS</div>

    <div class="c2 g bdr">SP</div>
    <div class="c5 g bdr">NAME</div>
    <div class="c3 g bdr">TOS</div>
    <div class="c4 g bdr">HDG / DIST</div>
    <div class="c3 g bdr">GS / M</div>
    <div class="c3 g bdr">ALT</div>
    <div class="c3 g bdr">>FUEL</div>
    <div class="c9 g bdr">LAT / LONG</div>
    <div class="c4 g bdr">ACTIVITY</div>

    <div class="c36 parent" v-for="index in new Array(25).keys()">
      <div class="c2 g bdr">{{ index + 1 }}</div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'}  bdr`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.type === "Steerpoint"
            ? getFlight?.waypoints[index]?.name
            : getFlight?.waypoints[index]?.type
        }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}  bdr`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : index === 0
            ? calculateTakeoffTime(
                hhmmss(getFlight?.waypoints[index]?.tot),
                getFlight?.waypoints[index]?.activity
              )
            : hhmmss(getFlight?.waypoints[index]?.tot)
        }}
      </div>
      <div :class="`c4 ${index % 2 ? 'hg' : 'w'}  bdr`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.location.lat &&
              getFlight?.waypoints[index - 1]?.location.lon
            ? calculateHeading(
                getFlight?.waypoints[index - 1]?.location.lat,
                getFlight?.waypoints[index - 1]?.location.lon,
                getFlight?.waypoints[index]?.location.lat,
                getFlight?.waypoints[index]?.location.lon
              )
                .toFixed(0)
                .padStart(3, "0") +
              "°M / " +
              parseInt(
                calculateDistance(
                  getFlight?.waypoints[index - 1]?.location.lat,
                  getFlight?.waypoints[index - 1]?.location.lon,
                  getFlight?.waypoints[index]?.location.lat,
                  getFlight?.waypoints[index]?.location.lon
                )
              ) +
              "nm"
            : ""
        }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}  bdr`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : index !== 0
            ? getFlight?.waypoints[index]?.groundspeed !== undefined
              ? getFlight?.waypoints[index]?.groundspeed?.toFixed(0) +
                " / " +
                getFlight?.waypoints[index]?.mach?.toFixed(2).replace("0.", ".")
              : ""
            : ""
        }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}  bdr`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.location.elevation
            ? getFlight?.waypoints[index]?.location.elevation?.toLocaleString(
                "en-EN"
              ) + " ft"
            : ""
        }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}  bdr`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]
            ? parseInt(calculateMinimumFuel(index + 1)).toLocaleString("en-EN")
            : ""
        }}
      </div>
      <div :class="`c9 hr  bdr`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.location.lat !== undefined
            ? toLatString(getFlight?.waypoints[index]?.location.lat) +
              " // " +
              toLongString(getFlight?.waypoints[index]?.location.lon)
            : ""
        }}
      </div>
      <div :class="`c4 ${index % 2 ? 'hg' : 'w'}  bdr`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.activity !== "00:00:00"
            ? index !== 0
              ? getFlight?.waypoints[index]?.activity
              : ""
            : ""
        }}
      </div>
    </div>

    <div class="c36 g bdr">OPEN STEERPOINTS</div>

    <div class="c2 g bdr">SP</div>
    <div class="c3 g bdr">TYPE</div>
    <div class="c5 g bdr">NAME</div>
    <div class="c9 g bdr">LAT / LONG</div>
    <div class="c3 g bdr">ELEV</div>
    <div class="c14 g bdr">NOTES</div>

    <div class="c36 parent" v-for="index in new Array(16).keys()">
      <div class="c2 g bdr">{{ index + 81 }}</div>
      <div
        :class="`c3 ${index + 81 < 97 ? (index % 2 ? 'hg' : 'w') : 'g'} bdr`"
      >
        {{ index + 81 < 97 ? getFlight.dmpis[index]?.type : "BULLS" }}
      </div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{
          index + 81 < 97
            ? getFlight.dmpis[index]?.name
            : getBullseyeName(index - 16)
        }}
      </div>
      <div :class="`c9 hr bdr`">
        {{
          index + 81 < 97
            ? toLatLongString(
                getFlight.dmpis[index]?.location.lat,
                getFlight.dmpis[index]?.location.lon
              )
            : getBullseyeLocation(index - 16)
        }}
      </div>
      <div
        :class="`c3 ${index + 81 < 97 ? (index % 2 ? 'hg' : 'w') : 'g'} bdr`"
      >
        {{ index + 81 < 97 ? getFlight.dmpis[index]?.location.elevation : "" }}
      </div>
      <div :class="`c14 nobdr ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getFlight.dmpis[index]?.note }}
      </div>
    </div>
    <div class="c36 parent" v-for="index in new Array(3).keys()">
      <div class="c2 g bdr">
        {{
          selectedPKG.bullseyes[index] ? selectedPKG.bullseyes[index].wp : ""
        }}
      </div>
      <div class="c3 g bdr">BULLS</div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{
          selectedPKG.bullseyes[index] ? selectedPKG.bullseyes[index].name : ""
        }}
      </div>
      <div :class="`c9 hr bdr`">
        {{
          selectedPKG.bullseyes[index]
            ? selectedPKG.bullseyes[index].location.toLatString() + " / "
            : ""
        }}

        {{
          selectedPKG.bullseyes[index]
            ? selectedPKG.bullseyes[index].location.toLongString()
            : ""
        }}
      </div>
      <div class="c3 hg bdr"></div>
      <div :class="`c14 nobdr ${index % 2 ? 'hg' : 'w'} bdr`">
        {{
          selectedPKG.bullseyes[index] ? selectedPKG.bullseyes[index].note : ""
        }}
      </div>
    </div>

    <div class="c36 r bdr">
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
