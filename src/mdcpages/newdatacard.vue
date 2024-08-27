<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, computed } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import Dropdown from "primevue/dropdown";
import Input from "primevue/inputtext";

import { flights } from "../config/flights";
import {
  calculateHeading,
  calculateDistance,
  toLatString,
  toLongString,
} from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";
import { threatRanges } from "@/config/threatRanges";

const { selectedPKG } = storeToRefs(usePackageStore());

const { selectedFlight } = storeToRefs(useFlightStore());

const getUnit = computed(() => (i: number) => {
  // console.log(selectedFlight.value.units[i]);
  return selectedFlight.value.units[i] ?? null;
});

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
  while (hour >= 24) {
    hour -= 24;
  }
  return (
    hour.toFixed(0).padStart(2, "0") +
    ":" +
    minute.toFixed(0).padStart(2, "0") +
    ":" +
    second.toFixed(0).padStart(2, "0")
  );
};

//const actions = [{}];

const actions = selectedFlight?.value.waypoints.reduce((coll, curr, i) => {
  if (curr.type != "Steerpoint")
    coll.push({
      sp: i,
      action: curr.type,
    });
  return coll;
}, new Array<{ sp: number; action: string }>());

const AAR = selectedFlight?.value.waypoints
  .filter((n) => n.type === "AAR")
  .map((n) => {
    return { time: n.tot, activity: n.activity };
  });

const showROE = inject("showROE");

const array_name = [{}];
</script>

<template>
  <div class="mdcpage">
    <div class="c36 r">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y">PAGE {{ pagenr }}</div>
    <div class="c33 g">MISSION DATA</div>

    <div class="c3 g">MSN</div>
    <div class="c4 w">{{ selectedFlight?.MSNumber }}</div>
    <div class="c3 g">C/S</div>
    <div class="c4 w">
      {{ selectedFlight?.callsign }} {{ selectedFlight?.callsignNumber }}
    </div>
    <div class="c3 g">PKG</div>
    <div class="c4 w">{{ selectedPKG?.name }}</div>
    <div class="c15 g"></div>

    <div class="c2 g">#</div>
    <div class="c2 g">A/C</div>
    <div class="c7 g">PILOT</div>
    <div class="c3 g">STN</div>
    <div class="c2 g">M3</div>
    <div class="c2 g">IDM</div>
    <div class="c2 g">A/A</div>
    <div class="c3 g">LASER</div>
    <div class="c3 g">SRCH</div>
    <div class="c3 g">CAP</div>
    <div class="c3 g">BLOCK</div>
    <div class="c4 g">SANC</div>
    <div class="c36 parent" v-for="index in new Array(4).keys()">
      <div class="c2 g">{{ index + 1 }}</div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">
        {{ getUnit(index)?.tailNr }}
      </div>
      <div :class="`c7 ${index % 2 ? 'hg' : 'w'}`">
        {{ getUnit(index)?.callsign }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ getUnit(index)?.STN.padStart(5, "0") }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">
        {{ getUnit(index)?.STN }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG?.flights.indexOf(selectedFlight) + 5 }}{{ index + 1 }}
      </div>
      <div :class="`c2 hr`">
        {{ getUnit(index)?.tacan }}
      </div>
      <Input class="c3 tb hr" />
      <input class="c3 tb hr" />
      <input class="c3 tb hr" />
      <input class="c3 tb hr" />
      <input class="c4 tb hr" />
    </div>

    <div class="c3 g">DEP</div>
    <div class="c6 w">{{ selectedFlight?.DEP.NAME }}</div>
    <div class="c3 g">ARR</div>
    <div class="c6 w">{{ selectedFlight?.ARR.NAME }}</div>
    <div class="c3 g">ALT</div>
    <div class="c6 w">{{ selectedFlight?.ALT.NAME }}</div>
    <div class="c3 g">DIV</div>
    <input class="c6 tb w" />

    <div class="c3 g">STEP</div>
    <input class="c3 tb w" />
    <div class="c3 g">START</div>
    <input class="c3 tb w" />
    <div class="c3 g">CX IN</div>
    <input class="c3 tb w" />
    <div class="c3 g">TAXI</div>
    <input class="c3 tb w" v-model="selectedFlight.taxi" />
    <div class="c3 g">T/O</div>
    <input class="c3 w" v-model="selectedFlight.takeoff" />
    <div class="c3 g">LAND</div>
    <input class="c3 tb w" />

    <div class="c36 r9 w"></div>

    <div class="c29 r7 w"></div>
    <div class="c2 g">SP</div>
    <div class="c5 g">ACTION</div>

    <div class="c2 w">{{ actions.at(1)?.sp }}</div>
    <div class="c5 w">{{ actions.at(1)?.action }}</div>

    <div class="c2 w">{{ actions.at(2)?.sp }}</div>
    <div class="c5 w">{{ actions.at(2)?.action }}</div>

    <div class="c2 w">{{ actions.at(3)?.sp }}</div>
    <div class="c5 w">{{ actions.at(3)?.action }}</div>

    <div class="c2 w">{{ actions.at(4)?.sp }}</div>
    <div class="c5 w">{{ actions.at(4)?.action }}</div>

    <div class="c2 w">{{ actions.at(5)?.sp }}</div>
    <div class="c5 w">{{ actions.at(5)?.action }}</div>

    <div class="c2 w">{{ actions.at(6)?.sp }}</div>
    <div class="c5 w">{{ actions.at(6)?.action }}</div>

    <div class="c4 g">AAR C/S</div>
    <div class="c3 g">ALT</div>
    <div class="c2 g">A/A</div>
    <div class="c3 g">GIVE</div>
    <div class="c7 g">TIME</div>
    <div class="c7 g">POSITION</div>
    <div class="c3 g">HOT</div>
    <div class="c2 w">{{ actions.at(7)?.sp }}</div>
    <div class="c5 w">{{ actions.at(7)?.action }}</div>

    <div class="c4 w">{{ selectedFlight.comms.radio1[12]?.description }}</div>
    <div class="c3 w"></div>
    <div class="c2 w"></div>
    <div class="c3 w"></div>
    <div class="c7 w">
      {{
        AAR.at(1)?.time
          ? hhmmss(AAR.at(1)?.time ?? "") +
            "-" +
            takeoffTime(
              hhmmss(AAR.at(1)?.time ?? ""),
              AAR.at(1)?.activity ?? ""
            )
          : ""
      }}
    </div>
    <div class="c7 w"></div>
    <div class="c3 w"></div>
    <div class="c2 w">{{ actions.at(8)?.sp }}</div>
    <div class="c5 w">{{ actions.at(8)?.action }}</div>

    <div class="c4 w"></div>
    <div class="c3 w"></div>
    <div class="c2 w"></div>
    <div class="c3 w"></div>
    <div class="c7 w">
      {{
        AAR.at(2)?.time
          ? hhmmss(AAR.at(2)?.time ?? "") +
            "-" +
            takeoffTime(
              hhmmss(AAR.at(2)?.time ?? ""),
              AAR.at(2)?.activity ?? ""
            )
          : ""
      }}
    </div>
    <div class="c7 w"></div>
    <div class="c3 w"></div>
    <div class="c2 w">{{ actions.at(9)?.sp }}</div>
    <div class="c5 w">{{ actions.at(9)?.action }}</div>

    <div class="c6 g">CODEWORD</div>
    <div class="c12 g">MEANING</div>
    <div class="c8 g">CLASS</div>
    <div class="c2 g">MTR</div>
    <div class="c2 g">FR</div>
    <div class="c2 g">DOR</div>
    <div class="c2 g">DR</div>
    <div class="c2 g">MAR</div>

    <div class="c36 parent" v-for="index in new Array(8).keys()">
      <input :class="`c6 tb ${index % 2 ? 'hg' : 'w'}`" />
      <input :class="`c12 tb ${index % 2 ? 'hg' : 'w'}`" />
      <div class="c8 hr">{{ threatRanges[index]?.class }}</div>
      <input class="c2 tb hr" />
      <input class="c2 tb hr" />
      <div class="c2 hr">{{ threatRanges[index]?.dor?.toFixed(1) }}</div>
      <div class="c2 hr">{{ threatRanges[index]?.dr?.toFixed(1) }}</div>
      <div class="c2 hr">{{ threatRanges[index]?.mar?.toFixed(1) }}</div>
    </div>

    <div class="c5 g">C/S</div>
    <div class="c3 g">TASK</div>
    <div class="c1 g">#</div>
    <div class="c3 g">TYPE</div>
    <div class="c3 g">WPN</div>
    <div class="c3 g">STN</div>
    <div class="c2 g">M1</div>
    <div class="c3 g">CAP</div>
    <div class="c3 g">PRI</div>
    <div class="c3 g">SANC</div>
    <div class="c3 g">M3</div>
    <div class="c2 g">IDM</div>
    <div class="c2 g">FC</div>

    <div class="c36 parent" v-for="index in new Array(5).keys()">
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG.flights[index]?.callsign }}
        {{ selectedPKG.flights[index]?.callsignNumber }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG.flights[index]?.missionType }}
      </div>
      <div :class="`c1 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG.flights[index]?.units.length }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG.flights[index]?.aircrafttype }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`"></div>
      <div :class="`c3 hr`">
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(0, 4)
            .concat("X")
        }}
      </div>
      <input class="c2 tb hr" />
      <input class="c3 tb hr" />
      <div class="c3 hr">
        {{
          selectedPKG?.flights[index]?.aircrafttype === "F-16CM"
            ? selectedFlight.comms.radio2[index + 14]?.freq
            : selectedFlight.comms.radio1[index + 14]?.freq
        }}
      </div>
      <input class="c3 tb hr" />
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(1, 4)
            .concat("X")
        }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">
        {{
          selectedPKG.flights[index]?.aircrafttype === "F-16CM"
            ? index + 5 + "0"
            : ""
        }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">001</div>
    </div>

    <div class="c3 g">JKR</div>
    <div class="c3 g">FUEL</div>
    <div class="c3 g">WPN</div>
    <div class="c11 g">ACTION</div>
    <div class="c7 g">TAKE IF SHUFFLE</div>
    <div class="c3 g">PRE</div>
    <div class="c3 g">FRQ</div>
    <div class="c3 g">CMRK</div>
    <div class="c36 parent" v-for="index in new Array(4).keys()">
      <div class="c3 g">{{ (index + 1) % 4 ? "J" + (index + 1) : "BGO" }}</div>
      <input :class="`c3 tb ${(index + 1) % 4 ? 'hr' : 'hg'}`" />
      <input :class="`c3 tb ${index % 2 ? 'hg' : 'w'}`" />
      <input :class="`c11 tb ${index % 2 ? 'hg' : 'w'}`" />
      <div class="c2 g">
        {{
          (index + 1) % 4
            ? (index + 1) % 3
              ? (index + 1) % 2
                ? "CX"
                : "PRI"
              : "SEC"
            : "TER"
        }}
      </div>
      <div :class="`c5 w ${index < 2 ? 'w' : 'hr'}`">
        {{
          index < 2 && selectedFlight.comms.radio1[index + 4] !== undefined
            ? selectedFlight.comms.radio1[index + 4]?.name +
              " " +
              selectedFlight.comms.radio1[index + 4]?.number
            : ""
        }}
      </div>
      <div :class="`c3 g`">{{ "2" + index }}</div>
      <div :class="`c3 w ${index < 2 ? 'w' : 'hr'}`">
        {{ index < 2 ? selectedFlight.comms.radio1[index + 4]?.freq : "" }}
      </div>
      <input :class="`c3 hr`" />
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
