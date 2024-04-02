<script setup lang="ts">
import Gameplan from "./mdcpages/Gameplan.vue";
import Waypoints from "./mdcpages/waypoints.vue";
import Coordination from "./mdcpages/coordination.vue";
import Dmpi from "./mdcpages/dmpi.vue";
import Datacard from "./mdcpages/datacard.vue";

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
import { toJpeg } from "html-to-image";
import { resolve } from "path";

const showROE = ref(false);
const { roe, selectedPKG, packages, allFlightsFromPackage } = storeToRefs(
  usePackageStore()
);
const { selctedFlight } = storeToRefs(useFlightStore());

provide("showROE", showROE);

let pagenr = 0; // I'll rethink this so only exported pages get numbered.
const active = ref(0);

const makejpg = async () => {
  const oldactive = active.value;
  for (let i = 1; i < 7; i++) {
    active.value = i;
    await new Promise((r) =>
      setTimeout(() => {
        r(true);
      }, 0)
    );
    await toJpeg(document.getElementsByName("mcdelement" + i)[0]).then(
      function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        document.body.getElementsByClassName("mcdimages")[0].appendChild(img);
      }
    );
  }
  active.value = oldactive;
};
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

  <TabView v-model:activeIndex="active"
    ><TabPanel header="Settings"> <Settings /> </TabPanel>
    <TabPanel header="Gameplan">
      <Gameplan :pagenr="1" name="mcdelement1" />
      Display ROE:
      <Checkbox label="Show ROE-Box" :binary="true" v-model="showROE" />
    </TabPanel>
    <TabPanel header="Waypoints">
      <Waypoints :pagenr="2" />
    </TabPanel>
    <TabPanel header="Coordination">
      <Coordination :pagenr="3" name="mcdelement3" />
    </TabPanel>
    <TabPanel header="Datacard">
      <Datacard :pagenr="4" name="mcdelement4" />
    </TabPanel>
    <TabPanel header="Page 2">
      <Page2 :pagenr="5" name="mcdelement5" />
    </TabPanel>
    <TabPanel header="DMPI">
      <Dmpi :pagenr="6" name="mcdelement6" />
    </TabPanel>
    <TabPanel header="Export to JPG">
      <button @click="makejpg">label="makejpg"</button>
      <div class="mcdimages"></div>
    </TabPanel>
  </TabView>
</template>
