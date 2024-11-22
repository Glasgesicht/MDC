<script setup lang="ts">
import { useDTCexports } from "./dtcExport";
import Button from "primevue/button";

const { mode, label } = defineProps<{
  mode: "all" | "dmpi" | "waypoints";
  label: string;
}>();
</script>
<template>
  <Button :label="label" @click="useDTCexports().loadSTPS(mode)" />
</template>
