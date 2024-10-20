<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, computed } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { threats, usePackageStore } from "@/stores/packageStore";
import Dropdown from "primevue/dropdown";
import Input from "primevue/inputtext";

import {
  generateInlineGrid,
  generateInlineGridFixed,
  fromLatString,
  fromLongString,
} from "@/utils/utilFunctions";

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

const threatsVisible = threats.value.filter((n) => n.display);

const { getFlight } = storeToRefs(useFlightStore());

const getUnit = computed(() => (i: number) => {
  // console.log(getFlight.value.units[i]);
  return getFlight.value.units[i] ?? null;
});

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const tankers = selectedPKG.value.agencies.filter(
  (n) => n.type === "KC-135" && n.active
);

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

const actions = getFlight?.value.waypoints.reduce((coll, curr, i) => {
  if (curr.type != "Steerpoint")
    coll.push({
      sp: i + 1,
      action: curr.type,
    });
  return coll;
}, new Array<{ sp: number; action: string }>());

const AAR = getFlight?.value.waypoints
  .filter((n) => n.type === "AAR")
  .map((n) => {
    return { time: n.tot, activity: n.activity };
  });
</script>

<template>
  {{ selectedPKG.bullseyes[selectedPKG.selectedBullseye].lat }} <br />
  {{ selectedPKG.bullseyes[selectedPKG.selectedBullseye].long }}
  <br />
  {{ tankers[0].lat }} <br />
  {{ tankers[0].lon }} <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <div class="bdr mdcpage" name="mdcpage">
    <div class="c36 r bdr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y bdr">PAGE {{ pagenr }}</div>
    <div class="c33 g bdr">MISSION DATA</div>

    <div class="c3 g bdr">MSN</div>
    <div class="c4 w bdr">{{ getFlight?.MSNumber }}</div>
    <div class="c3 g bdr">C/S</div>
    <div class="c4 w bdr">
      {{ getFlight?.callsign }} {{ getFlight?.callsignNumber }}
    </div>
    <div class="c3 g bdr">PKG</div>
    <div class="c4 w bdr">{{ selectedPKG?.name }}</div>
    <div class="c15 g bdr"></div>

    <div class="c2 g bdr">#</div>
    <div class="c2 g bdr">A/C</div>
    <div class="c7 g bdr">PILOT</div>
    <div class="c3 g bdr">STN</div>
    <div class="c2 g bdr">M3</div>
    <div class="c2 g bdr">IDM</div>
    <div class="c2 g bdr">A/A</div>
    <div class="c3 g bdr">LASER</div>
    <div class="c3 g bdr">SRCH</div>
    <div class="c3 g bdr">CAP</div>
    <div class="c3 g bdr">BLOCK</div>
    <div class="c4 g bdr">SANC</div>
    <div class="c36 parent" v-for="index in new Array(4).keys()">
      <div class="c2 g bdr">{{ index + 1 }}</div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getUnit(index)?.tailNr }}
      </div>
      <div :class="`c7 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getUnit(index)?.callsign }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getUnit(index)?.STN.padStart(5, "0") }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getUnit(index)?.STN }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ selectedPKG?.flights.indexOf(getFlight) + 5 }}{{ index + 1 }}
      </div>
      <div :class="`c2 hr bdr`">
        {{ getUnit(index)?.tacan }}
      </div>
      <div :class="`c3 hr bdr`">
        {{ getUnit(index)?.laser }}
      </div>
      <div :class="`c3 hr bdr`">
        {{ getUnit(index)?.search }}
      </div>
      <input class="c3 tb hr bdr" />
      <input class="c3 tb hr bdr" />
      <input class="c4 tb hr bdr" />
    </div>

    <div class="c3 g bdr">DEP</div>
    <div class="c6 w bdr">{{ getFlight?.DEP.NAME }}</div>
    <div class="c3 g bdr">ARR</div>
    <div class="c6 w bdr">{{ getFlight?.ARR.NAME }}</div>
    <div class="c3 g bdr">ALT</div>
    <div class="c6 w bdr">{{ getFlight?.ALT.NAME }}</div>
    <div class="c3 g bdr">DIV</div>
    <input class="c6 tb w bdr" />

    <div class="c3 g bdr">STEP</div>
    <input class="c3 tb w bdr" />
    <div class="c3 g bdr">START</div>
    <input class="c3 tb w bdr" />
    <div class="c3 g bdr">CX IN</div>
    <input class="c3 tb w bdr" />
    <div class="c3 g bdr">TAXI</div>
    <input class="c3 tb w bdr" v-model="getFlight.taxi" />
    <div class="c3 g bdr">T/O</div>
    <input class="c3 w bdr" v-model="getFlight.takeoff" />
    <div class="c3 g bdr">LAND</div>
    <input class="c3 tb w bdr" />

    <div class="c36 r9 w bdr"></div>

    <div class="c29 r7 w bdr"></div>

    <div :style="generateInlineGridFixed(30, 20, 7, 10)">
      <div class="c2 g bdr">SP</div>
      <div class="c5 g bdr">ACTION</div>
      <div
        :style="generateInlineGrid(7, 1)"
        v-for="index in new Array(9).keys()"
      >
        <div class="c2 w bdr">{{ actions.at(index)?.sp }}</div>
        <div class="c5 w bdr">{{ actions.at(index)?.action }}</div>
      </div>
    </div>

    <div :style="generateInlineGridFixed(1, 27, 30, 3)">
      <div class="c4 g bdr">AAR C/S</div>
      <div class="c3 g bdr">ALT</div>
      <div class="c2 g bdr">A/A</div>
      <div class="c3 g bdr">GIVE</div>
      <div class="c7 g bdr">TIME</div>
      <div class="c7 g bdr">POSITION</div>
      <div class="c3 g bdr">HOT</div>
      <div
        :style="generateInlineGrid(30, 1)"
        v-for="index in new Array(2).keys()"
      >
        <div class="c4 w bdr">
          {{ tankers.at(index) ? tankers[index].name : "" }}
        </div>
        <div class="c3 w bdr">
          {{
            tankers.at(index) ? "FL" + parseInt(tankers[index].alt) / 100 : ""
          }}
        </div>
        <div class="c2 w bdr"></div>
        <div class="c3 w bdr"></div>
        <div class="c7 w bdr">
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
        <div class="c7 w bdr">
          {{
            tankers.at(index)
              ? selectedPKG?.bullseyes.find(
                  (x) => x.wp == getFlight.misc.BullseyeWP
                )?.name
              : ""
          }}
          {{
            tankers.at(index)
              ? calculateHeading(
                  fromLatString(
                    selectedPKG.bullseyes[selectedPKG.selectedBullseye].lat
                  )!,
                  fromLongString(
                    selectedPKG.bullseyes[selectedPKG.selectedBullseye].long
                  )!,
                  parseFloat(tankers[index].lat),
                  parseFloat(tankers[index].lon)
                ) + " -"
              : ""
          }}

          {{
            tankers.at(index)
              ? calculateDistance(
                  fromLatString(
                    selectedPKG.bullseyes[selectedPKG.selectedBullseye].lat
                  )!,
                  fromLongString(
                    selectedPKG.bullseyes[selectedPKG.selectedBullseye].long
                  )!,
                  parseFloat(tankers[index].lat),
                  parseFloat(tankers[index].lon)
                ).split(".")[0]
              : ""
          }}
        </div>
        <div class="c3 w bdr"></div>
      </div>
    </div>
    <div class="c6 g bdr">CODEWORD</div>
    <div class="c12 g bdr">MEANING</div>
    <div class="c8 g bdr">CLASS</div>
    <div class="c2 g bdr">MTR</div>
    <div class="c2 g bdr">FR</div>
    <div class="c2 g bdr">DOR</div>
    <div class="c2 g bdr">DR</div>
    <div class="c2 g bdr">MAR</div>

    <div class="c36 parent" v-for="index in new Array(8).keys()">
      <div :class="`c6 tb ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ selectedPKG.codewords[index]?.name }}
      </div>
      <div :class="`c12 tb ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ selectedPKG.codewords[index]?.action }}
      </div>
      <div class="c8 hr bdr">
        {{ threatsVisible[index]?.class }}
      </div>
      <input class="c2 tb hr bdr" />
      <input class="c2 tb hr bdr" />
      <div class="c2 hr bdr">
        {{ threatsVisible[index]?.dor?.toFixed(1) }}
      </div>
      <div class="c2 hr bdr">
        {{ threatsVisible[index]?.dr?.toFixed(1) }}
      </div>
      <div class="c2 hr bdr">
        {{ threatsVisible[index]?.mar?.toFixed(1) }}
      </div>
    </div>

    <div class="c5 g bdr">C/S</div>
    <div class="c3 g bdr">TASK</div>
    <div class="c1 g bdr">#</div>
    <div class="c3 g bdr">TYPE</div>
    <div class="c3 g bdr">WPN</div>
    <div class="c3 g bdr">STN</div>
    <div class="c2 g bdr">M1</div>
    <div class="c3 g bdr">CAP</div>
    <div class="c3 g bdr">PRI</div>
    <div class="c3 g bdr">SANC</div>
    <div class="c3 g bdr">M3</div>
    <div class="c2 g bdr">IDM</div>
    <div class="c2 g bdr">FC</div>

    <div class="c36 parent" v-for="index in new Array(5).keys()">
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ selectedPKG.flights[index]?.callsign }}
        {{ selectedPKG.flights[index]?.callsignNumber }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ selectedPKG.flights[index]?.missionType }}
      </div>
      <div :class="`c1 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ selectedPKG.flights[index]?.units.length }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ selectedPKG.flights[index]?.aircrafttype }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr`"></div>
      <div :class="`c3 hr bdr`">
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(0, 4)
            .concat("X")
        }}
      </div>
      <input class="c2 tb hr bdr" />
      <input class="c3 tb hr bdr" />
      <div class="c3 hr bdr">
        {{
          selectedPKG?.flights[index]?.aircrafttype === "F-16CM"
            ? getFlight.comms.radio2[index + 14]?.freq
            : getFlight.comms.radio1[index + 14]?.freq
        }}
      </div>
      <input class="c3 tb hr bdr" />
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(1, 4)
            .concat("X")
        }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{
          selectedPKG.flights[index]?.aircrafttype === "F-16CM"
            ? index + 5 + "0"
            : ""
        }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr`">001</div>
    </div>

    <div class="c3 g bdr">JKR</div>
    <div class="c3 g bdr">FUEL</div>
    <div class="c3 g bdr">WPN</div>
    <div class="c11 g bdr">ACTION</div>
    <div class="c7 g bdr">TAKE IF SHUFFLE</div>
    <div class="c3 g bdr">PRE</div>
    <div class="c3 g bdr">FRQ</div>
    <div class="c3 g bdr">CMRK</div>
    <div class="c36 parent" v-for="index in new Array(4).keys()">
      <div class="c3 g bdr">
        {{ (index + 1) % 4 ? "J" + (index + 1) : "BGO" }}
      </div>
      <input :class="`c3 tb ${(index + 1) % 4 ? 'hr' : 'hg'} bdr`" />
      <input :class="`c3 tb ${index % 2 ? 'hg' : 'w'} bdr`" />
      <input :class="`c11 tb ${index % 2 ? 'hg' : 'w'} bdr`" />
      <div class="c2 g bdr">
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
      <div :class="`c5 w ${index < 2 ? 'w' : 'hr'} bdr`">
        {{
          index < 2 && getFlight.comms.radio1[index + 4] !== undefined
            ? getFlight.comms.radio1[index + 4]?.name +
              " " +
              getFlight.comms.radio1[index + 4]?.number
            : ""
        }}
      </div>
      <div :class="`c3 g`">{{ "2" + index }}</div>
      <div :class="`c3 w ${index < 2 ? 'w' : 'hr'}  bdr`">
        {{ index < 2 ? getFlight.comms.radio1[index + 4]?.freq : "" }}
      </div>
      <input :class="`c3 hr bdr`" />
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
