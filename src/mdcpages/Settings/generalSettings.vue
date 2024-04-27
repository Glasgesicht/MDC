<template>
  <div class="parent">
    <input
      type="file"
      id="input"
      v-on:change="onChangedFile"
      accept=".cf"
      class="mdc-s-10"
      style="grid-row: 2 / span2"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { processCF } from "@/config/parseCF";
import { useGlobalStore } from "@/stores/theatreStore";

const { file } = storeToRefs(useGlobalStore());

const onChangedFile = async (payload: any) => {
  file.value = true;
  processCF(payload.target.files[0]);
};
</script>
