<script setup lang="ts">
import { computed } from "vue";

import { storeToRefs } from "pinia";
import { usePackageStore } from "@/stores/packageStore";

import { useFlightStore } from "@/stores/flightStore";

const { selectedPKG } = storeToRefs(usePackageStore());

const { getFlight } = storeToRefs(useFlightStore());

const getUnit = computed(() => (i: number) => {
  // console.log(getFlight.value.units[i]);
  return getFlight.value.units[i] ?? null;
});

// const pagenr = 1; // TODO: Compute based on selected pages for export

const timeStep = "10:00:10";
const timeStart = "10:00:10";
const timeTaxi = "10:00:10";
const timeTakeoff = "10:00:10";

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const sourceTrackNumber = "03131";

const fenceInOut = "10 / 23";

const fighterChannel = "009";
const missionChannel = "057";
const surveillanceChannel = "083";

const mode1time1 = "2300Z";
const mode1code1 = "21";
const mode1time2 = "0000Z";
const mode1code2 = "31";
const mode1time3 = "0100Z";
const mode1code3 = "41";
const mode2code = "3090";
const mode3code = "ATC";

const timeOnTarget = "23:59:59";

const pilotName = "Prophet";
const pilotTailnumber = "890";
const pilotSearch = "L";
const pilotIdm = "21";
const pilotTacan = "60Y";
const pilotLaser = "1581";
const pilotMode2 = "3090";
const pilotSourceTrackNumber = "03151";

const flightCallsign = "JACKAL 5";
const flightSize = "4";
const flightType = "F-16CM";
const flightTask = "BARCAP";
const flightPrimaryFrequency = "141.50";
const flightSecondaryFrequency = "267.50";
const flightLinkCallsign = "JL5X";
const flightSourceTrackNumber = "0315X";
const flightPushTime = "14:15:16";

const supportAgency = "TANKER";
const supportCallsign = "TEXACO";
const supportCallsignNumber = "6";
const supportType = "KC-135";
const supportFrequency = "252.60";
const supportBullseye = "207 / 103";
const supportAltitude = "FL240";
const supportTacan = "106X";

const airspaceCoordination = "Fly around and shoot stuff!";
</script>

<template>
  <div class="mcdpage">
    <div class="border pagenr ctr">PAGE {{ pagenr }}</div>
    <div class="border header ctr">DATACARD</div>

    <div class="border mcd-s-3 mcd-wog">MSN</div>
    <div class="border mcd-s-4 mcd-bow">
      {{ getFlight?.MSNumber }}
    </div>
    <div class="border mcd-s-5 mcd-wog">CALLSIGN</div>
    <div class="border mcd-s-6 mcd-bow">
      {{ getFlight?.callsign }} {{ getFlight?.callsignNumber }}
    </div>
    <div class="border mcd-s-5 mcd-wog">PACKAGE</div>
    <div class="border mcd-s-9 mcd-bow">{{ selectedPKG?.name }}</div>

    <div class="border mcd-s-3 mcd-wog">STEP</div>
    <div class="border mcd-s-5 mcd-bog">{{ timeStep }}</div>
    <div class="border mcd-s-3 mcd-wog">START</div>
    <div class="border mcd-s-5 mcd-bog">{{ timeStart }}</div>
    <div class="border mcd-s-3 mcd-wog">TAXI</div>
    <div class="border mcd-s-5 mcd-bog">{{ timeTaxi }}</div>
    <div class="border mcd-s-3 mcd-wog">T/O</div>
    <div class="border mcd-s-5 mcd-bog">{{ timeTakeoff }}</div>

    <div class="border mcd-s-5 mcd-wog">FENCE I/O</div>
    <div class="border mcd-s-3 mcd-wog">TIME</div>
    <div class="border mcd-s-2 mcd-wog">M1</div>
    <div class="border mcd-s-1 mcd-wog"></div>
    <div class="border mcd-s-2 mcd-wog">M2</div>
    <div class="border mcd-s-3 mcd-bow">{{ mode2code }}</div>
    <div class="border mcd-s-1 mcd-wog"></div>
    <div class="border mcd-s-1 mcd-wog">0</div>
    <div class="border mcd-s-1 mcd-wog">1</div>
    <div class="border mcd-s-1 mcd-wog">2</div>
    <div class="border mcd-s-1 mcd-wog">3</div>
    <div class="border mcd-s-1 mcd-wog">4</div>
    <div class="border mcd-s-1 mcd-wog">5</div>
    <div class="border mcd-s-1 mcd-wog">6</div>
    <div class="border mcd-s-1 mcd-wog">7</div>
    <div class="border mcd-s-1 mcd-wog">8</div>
    <div class="border mcd-s-1 mcd-wog">9</div>

    <div class="border mcd-s-2 mcd-wog">STN</div>
    <div class="border mcd-s-3 mcd-bow">{{ sourceTrackNumber }}</div>

    <div class="border mcd-s-5 mcd-bog">{{ fenceInOut }}</div>
    <div class="border mcd-s-3 mcd-bog">{{ mode1time1 }}</div>
    <div class="border mcd-s-2 mcd-bog">{{ mode1code1 }}</div>
    <div class="border mcd-s-1 mcd-wog"></div>
    <div class="border mcd-s-2 mcd-wog">M3</div>
    <div class="border mcd-s-3 mcd-bog">{{ mode3code }}</div>
    <div class="border mcd-s-1 mcd-wog"></div>
    <div class="border mcd-s-1 mcd-bog" v-for="index in new Array(10).keys()">
      {{ selectedPKG.ramrod.charAt(index) }}
    </div>
    <div class="border mcd-s-2 mcd-wog">FC</div>
    <div class="border mcd-s-2 mcd-bog">{{ fighterChannel }}</div>
    <div class="border mcd-s-1 mcd-wog"></div>

    <div class="border mcd-s-5 mcd-wog">TOT</div>
    <div class="border mcd-s-3 mcd-bow">{{ mode1time2 }}</div>
    <div class="border mcd-s-2 mcd-bow">{{ mode1code2 }}</div>
    <div class="border mcd-s-1 mcd-wog"></div>
    <div class="border mcd-s-3 mcd-wog">POS 1</div>
    <div class="border mcd-s-1 mcd-bow">1</div>
    <div class="border mcd-s-1 mcd-bow"></div>
    <div class="border mcd-s-1 mcd-bow"></div>
    <div class="border mcd-s-1 mcd-bow"></div>
    <div class="border mcd-s-1 mcd-bow">4</div>
    <div class="border mcd-s-2 mcd-wog">ON</div>
    <div class="border mcd-s-1 mcd-bow">N</div>
    <div class="border mcd-s-2 mcd-wog">OF</div>
    <div class="border mcd-s-1 mcd-bow">8</div>
    <div class="border mcd-s-2 mcd-wog"></div>
    <div class="border mcd-s-2 mcd-wog">MC</div>
    <div class="border mcd-s-2 mcd-bow">{{ missionChannel }}</div>
    <div class="border mcd-s-1 mcd-wog"></div>

    <div class="border mcd-s-5 mcd-bog">{{ timeOnTarget }}</div>
    <div class="border mcd-s-3 mcd-bog">{{ mode1time3 }}</div>
    <div class="border mcd-s-2 mcd-bog">{{ mode1code3 }}</div>
    <div class="border mcd-s-1 mcd-wog"></div>
    <div class="border mcd-s-3 mcd-wog">POS 2</div>
    <div class="border mcd-s-1 mcd-bog">1</div>
    <div class="border mcd-s-1 mcd-bog">2</div>
    <div class="border mcd-s-1 mcd-bog">3</div>
    <div class="border mcd-s-1 mcd-bog">C</div>
    <div class="border mcd-s-1 mcd-bog">4</div>
    <div class="border mcd-s-2 mcd-wog">ON</div>
    <div class="border mcd-s-1 mcd-bog">W</div>
    <div class="border mcd-s-2 mcd-wog">OF</div>
    <div class="border mcd-s-1 mcd-bog">11</div>
    <div class="border mcd-s-2 mcd-wog"></div>
    <div class="border mcd-s-2 mcd-wog">SC</div>
    <div class="border mcd-s-2 mcd-bog">{{ surveillanceChannel }}</div>
    <div class="border mcd-s-1 mcd-wog"></div>

    <div class="border mcd-row-5 mcd-s-1 mcd-wog text-rotate-left">FLIGHT</div>
    <div class="border mcd-s-2 mcd-wog"></div>
    <div class="border mcd-s-9 mcd-wog">NAME</div>
    <div class="border mcd-s-2 mcd-wog">A/C</div>
    <div class="border mcd-s-3 mcd-wog">SEARCH</div>
    <div class="border mcd-s-3 mcd-wog">IDM</div>
    <div class="border mcd-s-3 mcd-wog">TCN</div>
    <div class="border mcd-s-3 mcd-wog">LSR</div>
    <div class="border mcd-s-3 mcd-wog">M2</div>
    <div class="border mcd-s-3 mcd-wog">STN</div>

    <div class="mcd-s-31 parent" v-for="index in new Array(4).keys()">
      <div class="border mcd-s-2 mcd-wog">
        {{ index + 1 }}
      </div>
      <div :class="`border  mcd-s-9 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ getUnit(index)?.callsign }}
      </div>
      <div :class="`border  mcd-s-2 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ getUnit(index)?.tailNr }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ getUnit(index)?.search }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ getUnit(index)?.L16.slice(-2) }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ getUnit(index)?.tacan }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ getUnit(index)?.laser }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ getUnit(index)?.m2 }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ getUnit(index)?.STN.padStart(5, "0") }}
      </div>
    </div>

    <div class="border mcd-row-6 mcd-s-1 mcd-wog text-rotate-left">PACKAGE</div>
    <div class="border mcd-s-6 mcd-wog">CALLSIGN</div>
    <div class="border mcd-s-4 mcd-wog">TYPE</div>
    <div class="border mcd-s-5 mcd-wog">TASK</div>
    <div class="border mcd-s-3 mcd-wog">PRI</div>
    <div class="border mcd-s-3 mcd-wog">SEC</div>
    <div class="border mcd-s-3 mcd-wog">L16</div>
    <div class="border mcd-s-3 mcd-wog">STN</div>
    <div class="border mcd-s-4 mcd-wog">PUSH</div>

    <div class="mcd-s-31 parent" v-for="index in new Array(5).keys()">
      <div :class="`border  mcd-s-6 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ selectedPKG.flights[index]?.callsign }}
        {{ selectedPKG.flights[index]?.callsignNumber }}
      </div>
      <div :class="`border  mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ selectedPKG.flights[index]?.units.length }}
        {{ selectedPKG.flights[index]?.aircrafttype }}
      </div>
      <div :class="`border  mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ selectedPKG.flights[index]?.missionType }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ flightPrimaryFrequency }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ flightSecondaryFrequency }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          selectedPKG.flights[index]?.units[0].L16.substring(0, 3).concat("X")
        }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(0, 4)
            .concat("X")
        }}
      </div>
      <div :class="`border  mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ flightPushTime }}
      </div>
    </div>

    <div class="border mcd-row-6 mcd-s-1 mcd-wog text-rotate-left">SUPPORT</div>
    <div class="border mcd-s-6 mcd-wog">AGENCY</div>
    <div class="border mcd-s-6 mcd-wog">CALLSIGN</div>
    <div class="border mcd-s-5 mcd-wog">TYPE</div>
    <div class="border mcd-s-3 mcd-wog">FREQ</div>
    <div class="border mcd-s-5 mcd-wog">BULLS</div>
    <div class="border mcd-s-3 mcd-wog">ALT</div>
    <div class="border mcd-s-3 mcd-wog">TCN</div>

    <div class="mcd-s-31 parent" v-for="index in new Array(5).keys()">
      <div :class="`border  mcd-s-6 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ supportAgency }}
      </div>
      <div :class="`border  mcd-s-6 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ supportCallsign }} {{ supportCallsignNumber }}
      </div>
      <div :class="`border  mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ supportType }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ supportFrequency }}
      </div>
      <div :class="`border  mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ supportBullseye }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ supportAltitude }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ supportTacan }}
      </div>
    </div>

    <div class="border mcd-s-32 mcd-wog">AIRSPACE COORDINATION</div>
    <div class="border mcd-s-32 mcd-row-7 mcd-bog">
      {{ airspaceCoordination }}
    </div>
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
</style>
