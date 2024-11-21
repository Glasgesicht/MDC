<script setup lang="ts">
import { computed } from "vue";

import { storeToRefs } from "pinia";
import { threats, usePackageStore } from "@/stores/packageStore";

import {
  generateInlineGrid,
  generateInlineGridFixed,
} from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";
import type { Coordinate } from "@/controller/coordinates";

const { selectedPKG } = storeToRefs(usePackageStore());

const threatsVisible = threats.value.filter((n) => n.display);

const { getFlight } = storeToRefs(useFlightStore());

const landingTime = computed(() => {
  const date = getFlight?.value.waypoints.find((n) =>
    n.type.toLowerCase().includes("land")
  )?.tot;
  if (date)
    return (
      new Date(date)
        .toTimeString()
        ?.match(/.*?(\d{2}:\d{2})/)
        ?.at(1)
        ?.padStart(5, "0") + "Z"
    );
  return "";
});

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
  if (curr.type != "STP")
    coll.push({
      sp: curr.waypointNr,
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
  <div class="bdr mdcpage" name="mdcpage">
    <div class="c36 r bdr ctr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y bdr ctr">PAGE {{ pagenr }}</div>
    <div class="c33 g bdr ctr">MISSION DATA</div>

    <div class="c3 g bdr ctr">MSN</div>
    <div class="c4 w bdr ctr">{{ getFlight?.MSNumber }}</div>
    <div class="c3 g bdr ctr">C/S</div>
    <div class="c4 w bdr ctr">
      {{ getFlight?.callsign }} {{ getFlight?.callsignNumber }}
    </div>
    <div class="c3 g bdr ctr">PKG</div>
    <div class="c4 w bdr ctr">{{ selectedPKG?.name }}</div>
    <div class="c15 g bdr ctr"></div>

    <div class="c2 g bdr ctr">#</div>
    <div class="c2 g bdr ctr">A/C</div>
    <div class="c7 g bdr ctr">PILOT</div>
    <div class="c3 g bdr ctr">STN</div>
    <div class="c2 g bdr ctr">M3</div>
    <div class="c2 g bdr ctr">IDM</div>
    <div class="c2 g bdr ctr">A/A</div>
    <div class="c3 g bdr ctr">LASER</div>
    <div class="c3 g bdr ctr">SRCH</div>
    <div class="c3 g bdr ctr">CAP</div>
    <div class="c3 g bdr ctr">BLOCK</div>
    <div class="c4 g bdr ctr">SANC</div>
    <div class="c36 child" v-for="index in new Array(4).keys()">
      <div class="c2 g bdr ctr">{{ index + 1 }}</div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getUnit(index)?.tailNr }}
      </div>
      <div :class="`c7 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getUnit(index)?.callsign }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getUnit(index)?.STN.padStart(5, "0") }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getUnit(index)?.STN }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ selectedPKG?.flights.indexOf(getFlight) + 5 }}{{ index + 1 }}
      </div>
      <div :class="`c2 hr bdr ctr`">
        {{ getUnit(index)?.tacan }}
      </div>
      <div :class="`c3 hr bdr ctr`">
        {{ getUnit(index)?.laser }}
      </div>
      <div :class="`c3 hr bdr ctr`">
        {{ getUnit(index)?.search }}
      </div>
      <input class="c3 tb hr bdr ctr" />
      <input class="c3 tb hr bdr ctr" />
      <input class="c4 tb hr bdr ctr" />
    </div>

    <div class="c3 g bdr ctr">DEP</div>
    <div class="c6 w bdr ctr">{{ getFlight?.DEP.NAME }}</div>
    <div class="c3 g bdr ctr">ARR</div>
    <div class="c6 w bdr ctr">{{ getFlight?.ARR.NAME }}</div>
    <div class="c3 g bdr ctr">ALT</div>
    <div class="c6 w bdr ctr">{{ getFlight?.ALT.NAME }}</div>
    <div class="c3 g bdr ctr">DIV</div>
    <input class="c6 tb w bdr ctr" />

    <div class="c3 g bdr ctr">STEP</div>
    <input class="c3 tb w bdr ctr" />
    <div class="c3 g bdr ctr">START</div>
    <input class="c3 tb w bdr ctr" />
    <div class="c3 g bdr ctr">CX IN</div>
    <input class="c3 tb w bdr ctr" />
    <div class="c3 g bdr ctr">TAXI</div>
    <input class="c3 tb w bdr ctr" v-model="getFlight.taxi" />
    <div class="c3 g bdr ctr">T/O</div>
    <input class="c3 w bdr ctr" v-model="getFlight.takeoff" />
    <div class="c3 g bdr ctr">LAND</div>
    <div class="c3 tb w bdr ctr">
      {{ landingTime }}
    </div>

    <div class="c36 r9 w bdr ctr"></div>

    <div class="c29 r7 w bdr ctr"></div>

    <div :style="generateInlineGridFixed(30, 20, 7, 10)">
      <div class="c2 g bdr ctr">SP</div>
      <div class="c5 g bdr ctr">ACTION</div>
      <div class="child" v-for="index in new Array(9).keys()">
        <div class="c2 w bdr ctr">{{ actions.at(index)?.sp }}</div>
        <div class="c5 w bdr ctr">{{ actions.at(index)?.action }}</div>
      </div>
    </div>

    <div class="child">
      <div class="c4 g bdr ctr">AAR C/S</div>
      <div class="c3 g bdr ctr">ALT</div>
      <div class="c2 g bdr ctr">A/A</div>
      <div class="c3 g bdr ctr">GIVE</div>
      <div class="c7 g bdr ctr">TIME</div>
      <div class="c7 g bdr ctr">POSITION</div>
      <div class="c3 g bdr ctr">HOT</div>
      <div class="child" v-for="index in new Array(2).keys()">
        <div class="c4 w bdr ctr">
          {{ tankers.at(index) ? tankers[index].name : "" }}
        </div>
        <div class="c3 w bdr ctr">
          {{
            tankers.at(index) ? tankers[index].location.getElevation("FL") : ""
          }}
        </div>
        <div class="c2 w bdr ctr">{{ tankers.at(index)?.tacan }}</div>
        <div class="c3 w bdr ctr"></div>
        <div class="c7 w bdr ctr">
          {{
            AAR.at(index)?.time
              ? hhmmss(AAR.at(index)?.time ?? "") +
                "-" +
                takeoffTime(
                  hhmmss(AAR.at(index)?.time ?? ""),
                  AAR.at(index)?.activity ?? ""
                )
              : ""
          }}
        </div>
        <div class="c7 w bdr ctr">
          {{
            tankers.at(index)
              ? selectedPKG?.bullseyes.find(
                  (x) => x.wp == getFlight.misc.BullseyeWP
                )?.name
              : ""
          }}
          {{
            tankers.at(index)
              ? selectedPKG.bullseyes
                  .find((n) => n.wp == getFlight.misc.BullseyeWP)
                  ?.location.calculateDistance(
                    tankers.at(index)!.location as Coordinate
                  )
                  .toFixed(0) + " / "
              : ""
          }}
          {{
            tankers.at(index)
              ? selectedPKG.bullseyes
                  .find((n) => n.wp == getFlight.misc.BullseyeWP)
                  ?.location.headingTo(
                    tankers.at(index)!.location as Coordinate
                  ) + "nm"
              : ""
          }}
        </div>
        <div class="c3 w bdr ctr"></div>
      </div>
    </div>
    <div class="c6 g bdr ctr">CODEWORD</div>
    <div class="c12 g bdr ctr">MEANING</div>
    <div class="c8 g bdr ctr">CLASS</div>
    <div class="c2 g bdr ctr">MTR</div>
    <div class="c2 g bdr ctr">FR</div>
    <div class="c2 g bdr ctr">DOR</div>
    <div class="c2 g bdr ctr">DR</div>
    <div class="c2 g bdr ctr">MAR</div>

    <div class="c36 child" v-for="index in new Array(8).keys()">
      <div :class="`c6 tb ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ selectedPKG.codewords[index]?.name }}
      </div>
      <div :class="`c12 tb ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ selectedPKG.codewords[index]?.action }}
      </div>
      <div class="c8 hr bdr ctr">
        {{ threatsVisible[index]?.class }}
      </div>
      <input class="c2 tb hr bdr ctr" />
      <input class="c2 tb hr bdr ctr" />
      <div class="c2 hr bdr ctr">
        {{ threatsVisible[index]?.dor?.toFixed(1) }}
      </div>
      <div class="c2 hr bdr ctr">
        {{ threatsVisible[index]?.dr?.toFixed(1) }}
      </div>
      <div class="c2 hr bdr ctr">
        {{ threatsVisible[index]?.mar?.toFixed(1) }}
      </div>
    </div>

    <div class="c5 g bdr ctr">C/S</div>
    <div class="c3 g bdr ctr">TASK</div>
    <div class="c1 g bdr ctr">#</div>
    <div class="c3 g bdr ctr">TYPE</div>
    <div class="c3 g bdr ctr">WPN</div>
    <div class="c3 g bdr ctr">STN</div>
    <div class="c2 g bdr ctr">M1</div>
    <div class="c3 g bdr ctr">CAP</div>
    <div class="c3 g bdr ctr">PRI</div>
    <div class="c3 g bdr ctr">SANC</div>
    <div class="c3 g bdr ctr">M3</div>
    <div class="c2 g bdr ctr">IDM</div>
    <div class="c2 g bdr ctr">FC</div>

    <div class="c36 child" v-for="index in new Array(5).keys()">
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ selectedPKG.flights[index]?.callsign }}
        {{ selectedPKG.flights[index]?.callsignNumber }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ selectedPKG.flights[index]?.missionType }}
      </div>
      <div :class="`c1 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ selectedPKG.flights[index]?.units.length }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ selectedPKG.flights[index]?.aircrafttype }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr ctr`"></div>
      <div :class="`c3 hr bdr ctr`">
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(0, 4)
            .concat("X")
        }}
      </div>
      <input class="c2 tb hr bdr ctr" />
      <input class="c3 tb hr bdr ctr" />
      <div class="c3 hr bdr ctr">
        {{
          selectedPKG?.flights[index]?.aircrafttype === "F-16CM"
            ? getFlight.comms.radio2[index + 14]?.freq
            : getFlight.comms.radio1[index + 14]?.freq
        }}
      </div>
      <input class="c3 tb hr bdr ctr" />
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(1, 4)
            .concat("X")
        }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{
          selectedPKG.flights[index]?.aircrafttype === "F-16CM"
            ? index + 5 + "0"
            : ""
        }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'} bdr ctr`">001</div>
    </div>

    <div class="c3 g bdr ctr">JKR</div>
    <div class="c3 g bdr ctr">FUEL</div>
    <div class="c3 g bdr ctr">WPN</div>
    <div class="c11 g bdr ctr">ACTION</div>
    <div class="c7 g bdr ctr">TAKE IF SHUFFLE</div>
    <div class="c3 g bdr ctr">PRE</div>
    <div class="c3 g bdr ctr">FRQ</div>
    <div class="c3 g bdr ctr">CMRK</div>
    <div class="c36 child" v-for="index in new Array(4).keys()">
      <div class="c3 g bdr ctr">
        {{ (index + 1) % 4 ? "J" + (index + 1) : "BGO" }}
      </div>
      <input :class="`c3 tb ${(index + 1) % 4 ? 'hr' : 'hg'} bdr ctr`" />
      <input :class="`c3 tb ${index % 2 ? 'hg' : 'w'} bdr ctr`" />
      <input :class="`c11 tb ${index % 2 ? 'hg' : 'w'} bdr ctr`" />
      <div class="c2 g bdr ctr">
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
      <div :class="`c5 w ${index < 2 ? 'w' : 'hr'} bdr ctr`">
        {{
          index < 2 && getFlight.comms.radio1[index + 4] !== undefined
            ? getFlight.comms.radio1[index + 4]?.name +
              " " +
              (getFlight.comms.radio1[index + 4]?.number ?? "")
            : ""
        }}
      </div>
      <div :class="`c3 g ctr bdr`">{{ 5 + index }}</div>
      <div :class="`c3 w ${index < 2 ? 'w' : 'hr'}  bdr ctr`">
        {{ index < 2 ? getFlight.comms.radio1[index + 4]?.freq : "" }}
      </div>
      <input :class="`c3 hr bdr ctr`" />
    </div>
    <div class="c36 r bdr ctr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
  </div>
</template>
<style scoped>
@import "@/assets/newstyle.css";

.font500 {
  font-weight: 500;
}
</style>
