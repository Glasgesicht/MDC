<template>
  <div style="position: fixed; top: 0px; right: 0px">
    <Button
      label="Undo"
      icon="pi pi-undo"
      @click="undo"
      style="margin: 2px; border-radius: 4px"
      outlined
      :disabled="!canUndo"
    />
    <Button
      label="Redo"
      icon="pi pi-forward"
      outlined
      :disabled="!canRedo"
      @click="redo"
      style="margin: 2px; border-radius: 4px"
    />
  </div>
</template>
<script setup lang="ts">
import Button from "primevue/button";
import { useEditHistory } from "./editHistory";
const { undo, redo, canRedo, canUndo } = useEditHistory();
</script>
