<template>
  <div class="c36 g bdr ctr">AGENCIES</div>
  <a class="c1 g bdr ctr">NR</a>
  <a class="c5 g bdr ctr">CALLSIGN</a>
  <a class="c4 g bdr ctr">TYPE</a>
  <a class="c2 g bdr ctr">TCN</a>
  <a class="c3 g bdr ctr">COLOR</a>
  <a class="c1 g bdr ctr">NR</a>
  <a class="c3 g bdr ctr">FREQ</a>
  <a class="c2 g bdr ctr">PRE</a>
  <a class="c5 g bdr ctr">POSITION</a>
  <a class="c8 g bdr ctr">LAT / LONG</a>
  <a class="c2 g bdr ctr">ALT</a>
  <div class="c36 sub" v-for="index in new Array(24).keys()">
    <div class="g bdr ctr c1">{{ index + 1 }}</div>
    <div class="bdr ctr w c5">{{ agencies.at(index)?.name.toUpperCase() }}</div>
    <div class="bdr ctr w c4">{{ agencies.at(index)?.type }}</div>
    <div class="bdr ctr w c2">{{ agencies.at(index)?.tacan }}</div>
    <div class="bdr ctr w c3">
      {{ fromFreqency(agencies.at(index)?.freq)[0] }}
    </div>
    <div class="bdr ctr w c1">
      {{ fromFreqency(agencies.at(index)?.freq)[1] }}
    </div>
    <div class="bdr ctr c3 hr">
      {{ agencies.at(index)?.freq }}
    </div>
    <div class="bdr ctr c2 w">{{ findInRadios(agencies.at(index)?.freq) }}</div>
    <div class="bdr ctr c5 hr">
      {{ agencies.at(index)?.location.toBRA() }}
    </div>
    <div class="bdr ctr w c8">
      {{ agencies.at(index)?.location.toString() }}
    </div>
    <div class="bdr ctr w c2">
      {{ agencies.at(index)?.location.getElevation("FL") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { fromFreqency } from "@/config/defaults/frequencies";
import { useFlightStore } from "@/stores/flightStore";

const packageStore = usePackageStore();
const { getFlight } = storeToRefs(useFlightStore());
const findInRadios = (freq?: string) => {
  if (!freq) return "";
  return getFlight.value.comms.radio1.findIndex((n) => n.freq === freq) > -1
    ? "UHF " +
        (getFlight.value.comms.radio1.findIndex((n) => n.freq === freq) + 1)
    : getFlight.value.comms.radio2.findIndex((n) => n.freq === freq) > -1
    ? "VHF " +
      (getFlight.value.comms.radio2.findIndex((n) => n.freq === freq) + 1)
    : "";
};

const { selectedPKG } = storeToRefs(packageStore);

const agencies = computed(() =>
  selectedPKG.value.agencies
    .filter((n) => n.active)
    .sort((n, m) =>
      n.name.localeCompare(m.name, undefined, { sensitivity: "base" })
    )
);
</script>

<style scoped>
@import "@/assets/styles/newstyle.css";
</style>
