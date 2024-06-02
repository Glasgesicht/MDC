<script setup lang="ts">
import Gameplan from "./mdcpages/Gameplan.vue";
import Waypoints from "./mdcpages/waypoints.vue";
import Coordination from "./mdcpages/coordination.vue";
import Dmpi from "./mdcpages/dmpi.vue";
import Datacard from "./mdcpages/datacard.vue";
import NewBriefing from "./mdcpages/newbriefing.vue";
import NewDatacard from "./mdcpages/newdatacard.vue";
import NewSteerpoints from "./mdcpages/newsteerpoints.vue";
import NewComms from "./mdcpages/newcomms.vue";
import NineLine from "./mdcpages/not shared/9Line.vue";
import CheckIn from "./mdcpages/not shared/CASCheckin.vue"; //@ts-ignore
import DTC from "./mdcpages/dtc.vue";

import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";

import { inject, provide, ref } from "vue";
import Settings from "./mdcpages/Settings.vue";
import { usePackageStore } from "./stores/packageStore";
import { useFlightStore } from "./stores/flightStore";
import { storeToRefs } from "pinia";
import { toJpeg } from "html-to-image";

const showROE = ref(false);
const { roe, selectedPKG, packages, allFlightsFromPackage } = storeToRefs(
  usePackageStore()
);
const { selectedFlight } = storeToRefs(useFlightStore());

provide("showROE", showROE);

let pagenr = 0; // I'll rethink this so only exported pages get numbered.
const active = ref(0);

const makejpg = async () => {
  const oldactive = active.value;
  for (let i = 0; i <= 12; i++) {
    active.value = i;
    await new Promise((r) =>
      setTimeout(() => {
        r(true);
      }, 0)
    );
    try {
      await toJpeg(document.getElementsByName("mdcelement" + i)[0])
        .then(function (dataUrl) {
          const img = new Image();
          img.src = dataUrl;
          document.body.getElementsByClassName("mcdimages")[0].append(img);
        })
        .catch();
    } catch (err) {}
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
      v-model="selectedFlight"
      :options="allFlightsFromPackage"
      optionLabel="callsign"
      placeholder="Select A Flight"
    />
  </div>

  <TabView v-model:activeIndex="active"
    ><TabPanel header="Settings"> <Settings /> </TabPanel>
    <TabPanel header="New Briefing">
      <NewBriefing :pagenr="1" name="mdcelement1" />
    </TabPanel>
    <TabPanel header="New Datacard">
      <NewDatacard :pagenr="2" name="mdcelement2" />
    </TabPanel>
    <TabPanel header="New Steerpoints">
      <NewSteerpoints :pagenr="3" name="mdcelement3" />
    </TabPanel>
    <TabPanel header="New Comms">
      <NewComms :pagenr="4" name="mdcelement4" />
    </TabPanel>
    <TabPanel header="Gameplan">
      <Gameplan :pagenr="1" name="mdcelement5" />
      Display ROE:
      <Checkbox label="Show ROE-Box" :binary="true" v-model="showROE" />
    </TabPanel>
    <TabPanel header="Waypoints" name="mdcelement6">
      <Waypoints :pagenr="2" />
    </TabPanel>
    <TabPanel header="Coordination">
      <Coordination :pagenr="3" name="mdcelement7" />
    </TabPanel>
    <TabPanel header="Datacard">
      <Datacard :pagenr="4" name="mdcelement8" />
    </TabPanel>
    <TabPanel header="9Line">
      <NineLine name="mdcelement9" />
    </TabPanel>
    <TabPanel header="Check-In">
      <CheckIn name="mdcelement10" />
    </TabPanel>
    <!--     <TabPanel header="Page 2">
      <Page2 :pagenr="5" name="mcdelement5" />
    </TabPanel>-->>

    <TabPanel header="DMPI">
      <Dmpi :pagenr="5" name="mcdelement6" />
    </TabPanel>
    <TabPanel header="Export to JPG">
      <button @click="makejpg">label="makejpg"</button>
      <div class="mcdimages"></div>
    </TabPanel>
    <TabPanel header="DTC">
      <DTC />
    </TabPanel>
  </TabView>
</template>
