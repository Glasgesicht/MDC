<template>
  <div style="position: fixed; top: 0px; right: 0px">
    <Button label="Undo" icon="pi pi-undo" @click="undo" style="margin: 2px" />
    <Button
      label="Redo"
      icon="pi pi-forward"
      @click="redo"
      style="margin: 2px"
    />
  </div>
</template>
<script setup lang="ts">
import Button from "primevue/button";
import { useRefHistory } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { usePackageStore } from "@/stores/packageStore";

const { packages } = storeToRefs(usePackageStore());
const { history, undo, redo } = useRefHistory(packages, {
  deep: true,
});
const resetHistory = () => {
  history.value = [];
};
</script>
