<script setup lang="ts">
import Card from "primevue/card";

import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

import generalSettings from "./Settings/generalSettings.vue";
import flightSettings from "./Settings/flightSettings.vue";
import packageSettings from "./Settings/packageSettings.vue";
</script>

<template>
  <Card class="base">
    <template #header>
      Use this page to import files and edit general settings. Welcome to the
      <br />webdesign nightmare
    </template>
    <template #content>
      <TabView>
        <TabPanel header="General Setting">
          <generalSettings />
        </TabPanel>
        <TabPanel header="Configure Package">
          <packageSettings />
        </TabPanel>
        <TabPanel header="Configure Flight">
          <flightSettings />
        </TabPanel>
      </TabView>
    </template>
  </Card>
</template>

<style>
html {
  font: 13px;
}
.base {
  align-content: center;
  margin: auto;
  width: 75%;
  max-width: 1980px;
  min-width: 1080px;
}
.parent {
  display: grid;
  grid-template-columns: repeat(8, 180px);
  grid-template-rows: repeat(64, 25px);
  grid-column-gap: 3px;
  grid-row-gap: 3px;
  text-align: left;
}

.redefSize * {
  padding: 1px 1px;
  font-size: 1em;
}

.base * {
  padding: 1px 1px;
  font-size: 1em;
}

.parent p {
  text-align: left;
  margin: 0;
}

.datatable * {
  text-align: left;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
