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
import { useEditHistory } from "./editHistory";
import { onBeforeUnmount, onMounted } from "vue";
const { undo, redo, canRedo, canUndo } = useEditHistory();

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function handleKeydown(e: KeyboardEvent) {
  if (e.ctrlKey && e.key === "y") {
    redo();
  }
  if (e.ctrlKey && e.key === "z") {
    undo();
  }
}
</script>
