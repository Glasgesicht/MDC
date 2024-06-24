<script setup lang="ts">
import { useDTCexports } from "./dtc";
</script>
<template>
  <Button label="to DTC" @click="useDTCexports().loadSTPS()" />
</template>
