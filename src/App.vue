<script setup lang="ts">
import GeneralSettings from "./mdcpages/Settings/generalSettings.vue";
import PackageSettings from "./mdcpages/Settings/packageSettings.vue";
import FlightSettings from "./mdcpages/Settings/flightSettings.vue";

import Menu from "primevue/menu";
import Dropdown from "primevue/dropdown";
import { ref, provide, computed, type Ref } from "vue";
import { usePackageStore } from "./stores/packageStore";
import { useFlightStore } from "./stores/flightStore";
import { storeToRefs } from "pinia";
import { toJpeg } from "html-to-image";
import { useGlobalStore } from "./stores/theatreStore";
import { processCF } from "./config/parseCF";
import { useDTCexports } from "@/components/DTCExports/dtc";
// import Waypoints from "./mdcpages/waypoints.vue";
import Datacard from "./mdcpages/datacard.vue";
import Newsteerpoints from "./mdcpages/newsteerpoints.vue";
import Newdatacard from "./mdcpages/newdatacard.vue";
import Newcomms from "./mdcpages/newcomms.vue";
import Dmpi from "./mdcpages/dmpi.vue";
import Gameplan from "./mdcpages/Gameplan.vue";
import Newbriefing from "./mdcpages/newbriefing.vue";
import WaypointsSettings from "./mdcpages/Settings/waypoints.vue";
import examplePage from "./mdcpages/examplePage/examplePage.vue";
import type { MenuItem } from "primevue/menuitem";

const showROE = ref(false);
const { roe, selectedPKG, packages, allFlightsFromPackage } = storeToRefs(
  usePackageStore()
);
const { selectedFlight } = storeToRefs(useFlightStore());

provide("showROE", showROE);

const active = ref(0);
const pageActive = ref("");

const { file } = storeToRefs(useGlobalStore());

const filename = ref("Select File");

const onChangedFile = async (payload: any) => {
  file.value = true;
  processCF(payload.target.files[0]);
  filename.value = payload.target.files[0].name;
  pageActive.value = "setting2";
};

const items: Ref<MenuItem[]> = computed(() => [
  {
    label: "Settings",

    items: [
      {
        icon: "pi pi-upload",
        label: filename.value,

        command: () => {
          document.getElementById("fileUpload")?.click();
        },
      },
      {
        label: "Package Settings",
        icon: "pi pi-users",
        command: () => {
          pageActive.value = "setting2";
        },
      },
      {
        label: "Flight Settings",
        icon: "pi pi-user-edit",
        command: () => {
          pageActive.value = "setting3";
        },
      },
      {
        label: "Steerpoints",
        icon: "pi pi-user-edit",
        command: () => {
          pageActive.value = "setting4";
        },
      },
    ],
  },
  {
    label: "Preview",
    visible: file.value,
    items: [
      /*{
        label: "Gameplan",
        command: () => {
          pageActive.value = "gameplan";
        },
      },*/
      {
        label: "Briefing",
        command: () => {
          pageActive.value = "newbriefing";
        },
      },
      /*{
        label: "Waypoints",
        command: () => {
          pageActive.value = "waypoints";
        },
      },*/
      {
        label: "Steerpoints",
        command: () => {
          pageActive.value = "newsteerpoints";
        },
      },
      /*{
        label: "Datacard",
        command: () => {
          pageActive.value = "datacard";
        },
      },*/
      {
        label: "Datacard",
        command: () => {
          pageActive.value = "newdatacard";
        },
      },
      {
        label: "Comms",
        command: () => {
          pageActive.value = "newcomms";
        },
      },
      {
        label: "DMPI",
        command: () => {
          pageActive.value = "dmpi";
        },
      },
      {
        label: "example Page",
        command: () => {
          pageActive.value = "example";
        },
      },
    ],
  },
  {
    label: "Export",
    visible: file.value,
    items: [
      {
        label: "to DTC",
        command: () => {
          // handle click
          if (selectedFlight.value.callsign)
            useDTCexports().loadDTC({
              CMS: false,
              Datalink: true,
              HARM: false,
              HTS: false,
              MFD: false,
              Misc: false,
              Radios: true,
              Upload: false,
              Waypoints: "all",
            });
        },
      },
      {
        label: "to JPEG",
        command: () => {
          // handle click
          makejpg();
        },
      },
    ],
  },
]);

const makejpg = async () => {
  /*const oldactive = active.value;
  for (let i = 0; i <= 12; i++) {
    active.value = i;
    await new Promise((r) => setTimeout(() => r(true), 0));
      await toJpeg(document.getElementsByName("mdcpage" + i)[0])
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          document.body.getElementsByClassName("mcdimages")[0].append(img);
        })
        .catch();
  }
  active.value = oldactive;*/

  await toJpeg(document.getElementsByName("mdcpage")[0], { pixelRatio: 1 })
    .then((dataUrl) => {
      const img = new Image();
      img.src = dataUrl;
      document.body.getElementsByClassName("mcdimages")[0].append(img);
    })
    .catch();
};
</script>

<template>
  <div id="app">
    <div class="split left">
      <div class="logo13" style="height: 150px"></div>

      <Menu :model="items" style="border: none; background-color: #f4f4f4" />

      <hr style="width: 100%" v-if="file" />
      <Dropdown
        v-if="file"
        v-model="selectedPKG"
        :options="packages"
        class="m-5"
        optionLabel="name"
        placeholder="Select A Package"
      />
      <Dropdown
        v-if="file"
        v-model="selectedFlight"
        class="m-5"
        :options="allFlightsFromPackage"
        optionLabel="callsign"
        placeholder="Select A Flight"
        ><template #option="{ option }"
          >{{ option.callsign }} {{ option.callsignNumber }}</template
        ><template #value="{ value }"
          >{{ value.callsign }}
          {{
            value.callsignNumber > 0 ? value.callsignNumber : `Select Flight`
          }}</template
        >
      </Dropdown>
    </div>
    <div class="split right" style="padding: 8px 0 0 8px">
      <GeneralSettings v-if="pageActive === 'setting1'" name="mdcpage" />
      <PackageSettings v-if="pageActive === 'setting2'" name="mdcpage" />
      <FlightSettings v-if="pageActive === 'setting3'" name="mdcpage" />
      <WaypointsSettings v-if="pageActive === 'setting4'" name="mdcpage" />
      <Gameplan v-if="pageActive === 'gameplan'" :pagenr="1" name="mdcpage" />
      <Newbriefing
        v-if="pageActive === 'newbriefing'"
        :pagenr="1"
        name="mdcpage"
      />
      <!--<Waypoints v-if="pageActive === 'waypoints'" :pagenr="3" name="mdcpage" />-->
      <Newsteerpoints
        v-if="pageActive === 'newsteerpoints'"
        :pagenr="2"
        name="mdcpage"
      />
      <Datacard v-if="pageActive === 'datacard'" :pagenr="5" name="mdcpage" />
      <Newdatacard
        v-if="pageActive === 'newdatacard'"
        :pagenr="3"
        name="mdcpage"
      />
      <Newcomms v-if="pageActive === 'newcomms'" :pagenr="3" name="mdcpage" />
      <Dmpi v-if="pageActive === 'dmpi'" :pagenr="8" name="mdcpage" />
      <examplePage v-if="pageActive === 'example'" />
      <div class="mcdimages"></div>
    </div>
  </div>
  <input
    style="display: none"
    type="file"
    id="fileUpload"
    class="file-input"
    v-on:change="onChangedFile"
    accept=".cf"
  />
</template>

<style scoped>
#app {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
  background-color: lightgray;
  box-sizing: border-box;
  padding: 0;
}

.split {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.left {
  min-width: 200px;
  width: 220px;
  max-width: 220px;
  background-color: #f4f4f4;
  border-right: 1px solid #ddd;
}

.right {
  min-width: 1200px;
  height: 100vh;
  overflow-y: auto;
  flex: 1;
}

.right::after {
  max-width: 2000px;
}

.m-5 {
  margin: 3px;
}
</style>
