<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import Dropdown from "primevue/dropdown";

import { flights } from "../config/flights";
import {
  calculateHeading,
  calculateDistance,
  toLatString,
  toLongString,
} from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";

const { selectedPKG } = storeToRefs(usePackageStore());

const { selctedFlight } = storeToRefs(useFlightStore());

// const pagenr = 1; // TODO: Compute based on selected pages for export

const timeStep = "10:00:10";
const timeStart = "10:00:10";
const timeTaxi = "10:00:10";
const timeTakeoff = "10:00:10";

const {pagenr} = defineProps({
  pagenr:{
    required:true,
    type: Number
  }
})

const iffMode2 = "3010";
const sourceTrackNumber = "03131";

const fenceInOut = "10 / 23"

const ramrodCharacter1 = "S";
const ramrodCharacter2 = "W";
const ramrodCharacter3 = "E";
const ramrodCharacter4 = "A";
const ramrodCharacter5 = "R";
const ramrodCharacter6 = "B";
const ramrodCharacter7 = "L";
const ramrodCharacter8 = "I";
const ramrodCharacter9 = "N";
const ramrodCharacter10 = "D";

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

const showROE = inject("showROE");
</script>

<template>
  <div class="mcdpage">
    <div class="border pagenr"><p>PAGE {{ pagenr }}</p></div>
    <div class="border header"><p>DATACARD</p></div>

    <div class="border mcd-s-3 mcd-wog"><p>MSN</p></div>
    <div class="border mcd-s-4 mcd-bow"><p>{{ selctedFlight?.MSNumber }}</p></div>    
    <div class="border mcd-s-5 mcd-wog"><p>CALLSIGN</p></div>
    <div class="border mcd-s-6 mcd-bow"><p>{{ selctedFlight?.callsign }} {{ selctedFlight?.callsignNumber }}</p></div>
    <div class="border mcd-s-5 mcd-wog"><p>PACKAGE</p></div>
    <div class="border mcd-s-9 mcd-bow"><p>{{ selectedPKG?.name }}</p></div>
    
    <div class="border mcd-s-3 mcd-wog"><p>STEP</p></div>
    <div class="border mcd-s-5 mcd-bog"><p>{{ timeStep }}</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>START</p></div>
    <div class="border mcd-s-5 mcd-bog"><p>{{ timeStart }}</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>TAXI</p></div>
    <div class="border mcd-s-5 mcd-bog"><p>{{ timeTaxi }}</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>T/O</p></div>
    <div class="border mcd-s-5 mcd-bog"><p>{{ timeTakeoff }}</p></div>

    <div class="border mcd-s-5 mcd-wog"><p>FENCE I/O</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>TIME</p></div>
    <div class="border mcd-s-2 mcd-wog"><p>M1</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>
    <div class="border mcd-s-2 mcd-wog"><p>M2</p></div>
    <div class="border mcd-s-3 mcd-bow"><p>{{ mode2code }}</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>
    <div class="border mcd-s-1 mcd-wog"><p>1</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>2</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>3</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>4</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>5</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>6</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>7</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>8</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>9</p></div>
    <div class="border mcd-s-1 mcd-wog"><p>10</p></div>
    
    <div class="border mcd-s-2 mcd-wog"><p>STN</p></div>
    <div class="border mcd-s-3 mcd-bow"><p>{{ sourceTrackNumber }}</p></div>

    <div class="border mcd-s-5 mcd-bog"><p>{{ fenceInOut }}</p></div>
    <div class="border mcd-s-3 mcd-bog"><p>{{ mode1time1 }}</p></div>
    <div class="border mcd-s-2 mcd-bog"><p>{{ mode1code1 }}</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>
    <div class="border mcd-s-2 mcd-wog"><p>M3</p></div>
    <div class="border mcd-s-3 mcd-bog"><p>{{ mode3code }}</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter1 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter2 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter3 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter4 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter5 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter6 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter7 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter8 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter9 }}</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>{{ ramrodCharacter10 }}</p></div>
    <div class="border mcd-s-2 mcd-wog"><p>FC</p></div>
    <div class="border mcd-s-2 mcd-bog"><p>{{ fighterChannel }}</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>

    <div class="border mcd-s-5 mcd-wog"><p>TOT</p></div>
    <div class="border mcd-s-3 mcd-bow"><p>{{ mode1time2 }}</p></div>
    <div class="border mcd-s-2 mcd-bow"><p>{{ mode1code2 }}</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>
    <div class="border mcd-s-3 mcd-wog"><p>POS 1</p></div>
    <div class="border mcd-s-1 mcd-bow"><p>1</p></div>
    <div class="border mcd-s-1 mcd-bow"><p></p></div>
    <div class="border mcd-s-1 mcd-bow"><p></p></div>
    <div class="border mcd-s-1 mcd-bow"><p></p></div>
    <div class="border mcd-s-1 mcd-bow"><p>4</p></div>
    <div class="border mcd-s-2 mcd-wog"><p>ON</p></div>
    <div class="border mcd-s-1 mcd-bow"><p>N</p></div>
    <div class="border mcd-s-2 mcd-wog"><p>OF</p></div>
    <div class="border mcd-s-1 mcd-bow"><p>8</p></div>
    <div class="border mcd-s-2 mcd-wog"><p></p></div>
    <div class="border mcd-s-2 mcd-wog"><p>MC</p></div>
    <div class="border mcd-s-2 mcd-bow"><p>{{ missionChannel }}</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>

    <div class="border mcd-s-5 mcd-bog"><p>{{ timeOnTarget }}</p></div>
    <div class="border mcd-s-3 mcd-bog"><p>{{ mode1time3 }}</p></div>
    <div class="border mcd-s-2 mcd-bog"><p>{{ mode1code3 }}</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>
    <div class="border mcd-s-3 mcd-wog"><p>POS 2</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>1</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>2</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>3</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>C</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>4</p></div>
    <div class="border mcd-s-2 mcd-wog"><p>ON</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>W</p></div>
    <div class="border mcd-s-2 mcd-wog"><p>OF</p></div>
    <div class="border mcd-s-1 mcd-bog"><p>11</p></div>
    <div class="border mcd-s-2 mcd-wog"><p></p></div>
    <div class="border mcd-s-2 mcd-wog"><p>SC</p></div>
    <div class="border mcd-s-2 mcd-bog"><p>{{ surveillanceChannel }}</p></div>
    <div class="border mcd-s-1 mcd-wog"><p></p></div>

    <div class="border mcd-row-5 mcd-s-1 mcd-wog text-rotate-left"><p>FLIGHT</p></div>
    <div class="border mcd-s-2 mcd-wog"><p></p></div>
    <div class="border mcd-s-9 mcd-wog"><p>NAME</p></div>
    <div class="border mcd-s-2 mcd-wog"><p>A/C</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>SEARCH</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>IDM</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>TCN</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>LSR</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>M2</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>STN</p></div>

    <div class="mcd-s-31 parent" v-for="index in new Array(4).keys()">
      <div class="border mcd-s-2 mcd-wog">
        <p>{{ index + 1 }}</p>
      </div>
      <div :class="`border mcd-s-9 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{  pilotName }}</p>
      </div>
      <div :class="`border mcd-s-2 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{  pilotTailnumber }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{  pilotSearch }}</p class="font500">
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{  pilotIdm }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{  pilotTacan }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{  pilotLaser }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{  pilotMode2 }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{  pilotSourceTrackNumber }}</p>
      </div>
    </div>

    <div class="border mcd-row-6 mcd-s-1 mcd-wog text-rotate-left"><p>PACKAGE</p></div>
    <div class="border mcd-s-6 mcd-wog"><p>CALLSIGN</p></div>
    <div class="border mcd-s-4 mcd-wog"><p>TYPE</p></div>
    <div class="border mcd-s-5 mcd-wog"><p>TASK</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>PRI</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>SEC</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>L16</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>STN</p></div>
    <div class="border mcd-s-4 mcd-wog"><p>PUSH</p></div>

    <div class="mcd-s-31 parent" v-for="index in new Array(5).keys()">
      <div :class="`border mcd-s-6 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ flightCallsign }}</p>
      </div>
      <div :class="`border mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ flightSize }} {{ flightType }}</p>
      </div>
      <div :class="`border mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ flightTask }}</p class="font500">
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ flightPrimaryFrequency }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ flightSecondaryFrequency }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ flightLinkCallsign }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ flightSourceTrackNumber }}</p>
      </div>
      <div :class="`border mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ flightPushTime }}</p>
      </div>
    </div>

    <div class="border mcd-row-6 mcd-s-1 mcd-wog text-rotate-left"><p>SUPPORT</p></div>
    <div class="border mcd-s-6 mcd-wog"><p>AGENCY</p></div>
    <div class="border mcd-s-6 mcd-wog"><p>CALLSIGN</p></div>
    <div class="border mcd-s-5 mcd-wog"><p>TYPE</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>FREQ</p></div>
    <div class="border mcd-s-5 mcd-wog"><p>BULLS</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>ALT</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>TCN</p></div>

    <div class="mcd-s-31 parent" v-for="index in new Array(5).keys()">
      <div :class="`border mcd-s-6 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ supportAgency }}</p>
      </div>
      <div :class="`border mcd-s-6 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ supportCallsign }} {{ supportCallsignNumber }}</p>
      </div>
      <div :class="`border mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ supportType }}</p class="font500">
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ supportFrequency }}</p>
      </div>
      <div :class="`border mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ supportBullseye }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ supportAltitude }}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ supportTacan }}</p>
      </div>
    </div>

    <div class="border mcd-s-32 mcd-wog"><p>AIRSPACE COORDINATION</p></div>
    <div class="border mcd-s-32 mcd-row-7 mcd-bog"><p>{{ airspaceCoordination }}</p></div>

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
