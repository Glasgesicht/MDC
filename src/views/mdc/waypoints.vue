<!--
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePackageStore } from "@/stores/packageStore";

import { calculateHeading, calculateDistance } from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";
import { airports } from "@/config/airfields";

const { selectedPKG } = storeToRefs(usePackageStore());

const { getFlight } = storeToRefs(useFlightStore());

const getAirport = (sel: string) => {
  if (typeof sel == "string")
    return (
      airports.find((ap) => ap.NAME.toLowerCase() === sel.toLowerCase()) ?? {
        NAME: "",
        ARR: "",
        TACAN: "",
        HDG: "",
        ILS: "",
        ELEV: "",
        LEN: "",
      }
    );
  return {
    NAME: "",
    ARR: "",
    TACAN: "",
    HDG: "",
    ILS: "",
    ELEV: "",
    LEN: "",
  };
};

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
</script>

<template>
  <div class="mcdpage" name="mcdelement2">
    <div class="border pagenr">PAGE {{ pagenr }}</div>
    <div class="border header">WAYPOINTS</div>
    <div class="border mcd-s-3 mcd-wog">METAR</div>
    <input class="border mcd-s-29 mcd-bow" v-model="selectedPKG.metar" />

    <div class="border mcd-row-4 mcd-s-1 mcd-wog text-rotate-left">
      AIRFIELD
    </div>
    <div class="border mcd-s-2 mcd-row-1 mcd-wog"></div>
    <div class="border mcd-s-8 mcd-wog">AIRFIELD</div>
    <div class="border mcd-s-3 mcd-wog">TCN</div>
    <div class="border mcd-s-3 mcd-wog">FREQ</div>
    <div class="border mcd-s-3 mcd-wog">LENGTH</div>
    <div class="border mcd-s-3 mcd-wog">ELEV</div>
    <div class="border mcd-s-4 mcd-wog">RWY</div>
    <div class="border mcd-s-5 mcd-wog">ILS</div>

    <div class="border mcd-s-2 mcd-row-1 mcd-wog">DEP</div>

    <div class="border mcd-s-8 mcd-row-1 mcd-bow">
      {{ getFlight.DEP.NAME }}
    </div>

    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.DEP.NAME).TACAN }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getFlight.DEP.APPR }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.DEP.NAME).LEN }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.DEP.NAME).ELEV }}
    </div>
    <!--<div class="border  mcd-s-4 mcd-row-1 mcd-bow">{{ 111 }}</div>
    <div class="border mcd-s-4 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.DEP.NAME).HDG }}
    </div>
    <div class="border mcd-s-5 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.DEP.NAME).ILS }}
    </div>

    <div class="border mcd-s-2 mcd-row-1 mcd-wog">ARR</div>
    <div class="border mcd-s-8 mcd-row-1 mcd-bow">
      {{ getFlight.ARR.NAME }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ARR.NAME).TACAN }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getFlight.ARR.APPR }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ARR.NAME).LEN }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ARR.NAME).ELEV }}
    </div>
    <!--<div class="border  mcd-s-4 mcd-row-1 mcd-bow">{{ 111 }}</div>
    <div class="border mcd-s-4 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ARR.NAME).HDG }}
    </div>
    <div class="border mcd-s-5 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ARR.NAME).ILS }}
    </div>

    <div class="border mcd-s-2 mcd-row-1 mcd-wog">ALT</div>
    <div class="border mcd-s-8 mcd-row-1 mcd-bow">
      {{ getFlight.ALT.NAME }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ALT.NAME).TACAN }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getFlight.ALT.APPR }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ALT.NAME).LEN }}
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ALT.NAME).ELEV }}
    </div>
    <!--<div class="border  mcd-s-4 mcd-row-1 mcd-bow">{{ 111 }}</div>
    <div class="border mcd-s-4 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ALT.NAME).HDG }}
    </div>
    <div class="border mcd-s-5 mcd-row-1 mcd-bow">
      {{ getAirport(getFlight.ALT.NAME).ILS }}
    </div>
    <!--
    <div class="border  mcd-s-3 mcd-row-1 mcd-wog">ARR</div>
    <div class="border  mcd-s-9 mcd-row-1 mcd-bow">{{ arrivalName }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalTACAN }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalGround }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalLength }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalElevation }}</div>
    <div class="border  mcd-s-4 mcd-row-1 mcd-bow">{{ arrivalRunway }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalILS }}</div>

    <div class="border  mcd-s-3 mcd-row-1 mcd-wog">ALT</div>
    <div class="border  mcd-s-9 mcd-row-1 mcd-bow">{{ alternateName }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ alternateTACAN }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ alternateGround }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ alternateLength }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ alternateElevation }}</div>
    <div class="border  mcd-s-4 mcd-row-1 mcd-bow">{{ alternateRunway }}</div>
    <div class="border  mcd-s-3 mcd-row-1 mcd-bow">{{ alternateILS }}</div>

    <div class="border mcd-row-26 mcd-s-1 mcd-wog text-rotate-left">
      STEERPOINTS
    </div>

    <div class="border mcd-s-2 mcd-row-1 mcd-wog">#</div>
    <div class="border mcd-s-5 mcd-wog">ACTION</div>
    <div class="border mcd-s-4 mcd-wog">TOS</div>
    <div class="border mcd-s-3 mcd-wog">HDG</div>
    <div class="border mcd-s-4 mcd-wog">DIST</div>
    <div class="border mcd-s-3 mcd-wog">TAS/M</div>
    <div class="border mcd-s-3 mcd-wog">ALT</div>
    <div class="border mcd-s-3 mcd-wog">FUEL</div>
    <div class="border mcd-s-4 mcd-wog">NOTE</div>

    <div class="mcd-s-31 parent" v-for="index in new Array(24).keys()">
      <div class="border mcd-s-2 mcd-wog">
        {{ index + 1 }}
      </div>
      <div :class="`border  mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.type === "Steerpoint"
            ? getFlight?.waypoints[index]?.name
            : getFlight?.waypoints[index]?.type
        }}
      </div>
      <div :class="`border  mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : hhmmss(getFlight?.waypoints[index]?.tot)
        }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index + 1]?.longitude
            ? calculateHeading(
                getFlight?.waypoints[index]?.latitude,
                getFlight?.waypoints[index]?.longitude,
                getFlight?.waypoints[index + 1]?.latitude,
                getFlight?.waypoints[index + 1]?.longitude
              )
            : ""
        }}
      </div>
      <div :class="`border  mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index + 1]?.longitude
            ? calculateDistance(
                getFlight?.waypoints[index]?.latitude,
                getFlight?.waypoints[index]?.longitude,
                getFlight?.waypoints[index + 1]?.latitude,
                getFlight?.waypoints[index + 1]?.longitude
              ) + "nm"
            : ""
        }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.mach?.toFixed(2)
        }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.altitude
            ? getFlight?.waypoints[index]?.altitude + "ft"
            : ""
        }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{}}
      </div>
      <div :class="`border  mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          getFlight?.waypoints[index]?.hideOnMDC
            ? ""
            : getFlight?.waypoints[index]?.activity
        }}
      </div>
    </div>

    <div
      class="border mcd-wog"
      style="grid-row-start: 32; grid-column: 2 / span 2; grid-column-start: 2"
    >
      25
    </div>
    <div class="border mcd-s-5 mcd-row-1 mcd-wog" style="grid-row-start: 32">
      BULLSEYE
    </div>
    <input
      v-if="selectedPKG"
      class="border mcd-s-8 mcd-bow"
      style="grid-row-start: 32; font-weight: bold"
      v-model="selectedPKG.bullseye.name"
    />

    <div class="border mcd-s-3 mcd-wog" style="grid-row-start: 32">LAT</div>
    <input
      class="border mcd-s-5 mcd-bow"
      style="grid-row-start: 32"
      v-model="selectedPKG.bullseye.lat"
    />
    <div class="border mcd-s-3 mcd-wog" style="grid-row-start: 32">LONG</div>
    <input
      class="border mcd-s-5 mcd-bow"
      style="grid-row-start: 32"
      v-model="selectedPKG.bullseye.long"
    />
  </div>
</template>
<style scoped>
.parent {
  display: inline-grid;
  grid-template-columns: repeat(31, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.font500 {
  font-weight: 500;
}
p {
  font-weight: 600;
}
</style>
-->
