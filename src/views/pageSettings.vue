<template>
  <div class="page-settings">
    <div class="menu-container">
      <header class="menu-header">
        <h2>Page Settings</h2>
      </header>
      <Button
        label="Toggle Dark Mode"
        icon="pi pi-moon"
        @click="toggleDarkMode()"
        class="dark-mode-toggle"
      />
      <div class="api-key-section">
        <label for="apikey" class="api-label">OpenAIP API Key</label><br />
        <InputText
          type="text"
          style="width: 350px"
          id="apikey"
          v-model="apiKey"
          placeholder="Enter your API key"
          class="api-input"
        /><br />

        <small class="api-helper-text">
          Register an account and get a free API key
          <a href="https://www.openaip.net/user/api-clients" target="_blank">
            here </a
          >.
        </small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

function toggleDarkMode() {
  localStorage.setItem(
    "darkmode",
    String(document.documentElement.classList.toggle("darkmode"))
  );
}

const apiKey = computed({
  get() {
    return localStorage.getItem("apiKey");
  },

  set(v: string) {
    localStorage.setItem("apiKey", v);
  },
});
</script>

<style scoped>
.menu-container {
  margin-bottom: 1rem;
}
.api-key-section {
  margin-top: 1rem;
}
</style>
