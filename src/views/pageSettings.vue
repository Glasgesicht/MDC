<template>
  <Button label="Toggle Dark Mode" @click="toggleDarkMode()" />
</template>

<script setup lang="ts">
function toggleDarkMode() {
  document.documentElement.classList.toggle("darkmode");
}
</script>

<style></style>
