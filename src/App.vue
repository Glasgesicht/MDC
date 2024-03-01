<script setup lang="ts">
import Gameplan from "./mdcpages/Gameplan.vue";
import Waypoints from  "./mdcpages/waypoints.vue";

import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Checkbox from "primevue/checkbox";

import { inject, provide, ref } from "vue";
import Page2Vue from "./mdcpages/Page2.vue";

const showROE = ref(false);

provide("showROE", showROE);
</script>

<template>
  <TabView
    ><TabPanel header="Settings"></TabPanel>
    <TabPanel header="Gameplan">
      <Gameplan />
      Display ROE:
      <Checkbox label="Show ROE-Box" :binary="true" v-model="showROE" />
    </TabPanel>
    <TabPanel header="Waypoints">
      <Waypoints />
    </TabPanel>
    <TabPanel header="Page 2">
      <Page2Vue />
    </TabPanel>
    <TabPanel header="Export to JPG"></TabPanel>
  </TabView>
</template>
