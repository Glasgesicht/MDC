<script setup lang="ts">
import Gameplan from "./mdcpages/Gameplan.vue";
import Waypoints from "./mdcpages/waypoints.vue";
import Coordination from "./mdcpages/coordination.vue";
import Dmpi from "./mdcpages/dmpi.vue";

import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";

import { inject, provide, ref } from "vue";
import Page2 from "./mdcpages/Page2.vue";
import Settings from "./mdcpages/Settings.vue";
import { usePackageStore } from "./stores/packageStore";
import { useFlightStore } from "./stores/flightStore";
import { storeToRefs } from "pinia";

const showROE = ref(false);
const { roe, selectedPKG, packages, allFlightsFromPackage } = storeToRefs(
  usePackageStore()
);
const { selctedFlight } = storeToRefs(useFlightStore());

provide("showROE", showROE);
</script>

<template>
  <div style="position: absolute; top: 10px; right: 50px; z-index: 99">
    <Dropdown
      v-model="selectedPKG"
      :options="packages"
      optionLabel="name"
      placeholder="Select A Package"
    />
    <Dropdown
      v-model="selctedFlight"
      :options="allFlightsFromPackage"
      optionLabel="callsign"
      placeholder="Select A Flight"
    />
  </div>

  <TabView
    ><TabPanel header="Settings"> <Settings /> </TabPanel>
    <TabPanel header="Gameplan">
      <Gameplan />
      Display ROE:
      <Checkbox label="Show ROE-Box" :binary="true" v-model="showROE" />
    </TabPanel>
    <TabPanel header="Waypoints">
      <Waypoints />
    </TabPanel>
    <TabPanel header="Coordination">
      <Coordination />
    </TabPanel>
    <TabPanel header="Page 2">
      <Page2 />
    </TabPanel>
    <TabPanel header="DMPI">
      <Dmpi />
    </TabPanel>
    <TabPanel header="Export to JPG"></TabPanel>
  </TabView>
</template>
