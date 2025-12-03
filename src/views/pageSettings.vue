<template>
  <div class="p-6">
    <div class="mb-6">
      <header class="mb-4">
        <h2 class="text-2xl font-semibold">Application Settings</h2>
      </header>
      <Button
        label="Toggle Dark Mode"
        icon="pi pi-moon"
        @click="toggleDarkMode()"
        class="mb-4"
      />
      <div class="mt-4">
        <label for="apikey" class="block font-medium mb-1"
          >OpenAIP API Key</label
        >
        <InputText
          type="text"
          class="w-[350px]"
          id="apikey"
          v-model="apiKey"
          placeholder="Enter your API key"
        />
        <small class="block mt-2 text-gray-500">
          Register an account and get a free API key
          <a
            href="https://www.openaip.net/user/api-clients"
            target="_blank"
            class="text-blue-500 hover:underline"
          >
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
