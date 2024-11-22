<template>
  <div class="bdr mdcpage" name="mdcpage">
    <div class="c3 y bdr ctr">PAGE {{ pagenr }}</div>
    <a class="c33 g bdr ctr"
      >Flight Route - {{ selectedPKG.name }} - MSN {{ getFlight.MSNumber }}
    </a>
    <div class="inner-grid c36 r49 bdr ctr">
      <Maps />
    </div>
  </div>
</template>
<script setup lang="ts">
//@ts-ignore
import { useFlightStore } from "@/stores/flightStore";
import Maps from "./child components/map.vue";
import { storeToRefs } from "pinia";
import { usePackageStore } from "@/stores/packageStore";

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});
const { selectedPKG } = storeToRefs(usePackageStore());
const { getFlight } = storeToRefs(useFlightStore());
</script>

<style lang="css" scoped>
@import "@/assets/styles/newstyle.css";
</style>
