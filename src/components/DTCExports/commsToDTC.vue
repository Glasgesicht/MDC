<template>
  <Button @click="useDTCexports().loadComms()" label="Copy DTC" />
</template>
<script setup lang="ts">
import { useDTCexports } from "./dtcExport";
</script>
