<template>
  <div class="parent">
    <input
      type="file"
      id="input"
      v-on:change="onChangedFile"
      accept=".cf"
      style="grid-row: 2 / span 2; grid-column: 1 / span 4"
    />
    <!--
    <b style="grid-row-start: 7">change color preset</b>
    <div style="grid-row: 8 / span 3; grid-column: 1 / span 2"><Styles /></div>
    <div
      style="grid-row: 8 / span 3; grid-column-start: 3; padding: 0"
      class="preview"
    >
      <Datacard :pagenr="4" />
    </div>-->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { processCF } from "@/config/parseCF";
import { useGlobalStore } from "@/stores/theatreStore";
import Styles from "@/mdcpages/Settings/styles.vue";
import Datacard from "@/mdcpages/datacard.vue";

const { file } = storeToRefs(useGlobalStore());

const onChangedFile = async (payload: any) => {
  file.value = true;
  processCF(payload.target.files[0]);
};
</script>

<style scoped>
.preview * {
  padding: 0 0 !important;
}
</style>
