<script setup lang="ts">
import Menu from "primevue/menu";
import { ref, provide, computed, type Ref, toRaw, onMounted } from "vue";
import { usePackageStore } from "./stores/packageStore";
import { useFlightStore } from "./stores/flightStore";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "./stores/theatreStore";
import { processCF } from "./config/parseCF";
import { useDTCexports } from "@/components/DTCExports/dtc";
import Newsteerpoints from "./mdcpages/newsteerpoints.vue";
import Newdatacard from "./mdcpages/newdatacard.vue";
import Newcomms from "./mdcpages/newcomms.vue";
import Newbriefing from "./mdcpages/newbriefing.vue";
import type { MenuItem } from "primevue/menuitem";
import router from "./router";
import { download } from "./utils/download";
import { RouterView } from "vue-router";
import SelectFlight from "./components/PackageFlightSelection/SelectFlight.vue";
import editHistory from "./components/history/editHistory.vue";

const showROE = ref(false);
const { selectedPKG, packages } = storeToRefs(usePackageStore());
const { getFlight } = storeToRefs(useFlightStore());
provide("showROE", showROE);

const globalStore = useGlobalStore();
const { file } = storeToRefs(globalStore);

const filename = ref("Select File");

const onChangedFile = async (payload: any) => {
  globalStore.setFile(true);
  processCF(payload.target.files[0]);
  filename.value = payload.target.files[0].name;
  router.push({ name: "packageSettings" });
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
          router.push({ name: "packageSettings" });
        },
      },
      {
        label: "Flight Settings",
        icon: "pi pi-user-edit",
        command: () => {
          router.push({ name: "flightSettings" });
        },
      },
      {
        label: "Steerpoints",
        icon: "pi pi-user-edit",
        command: () => {
          router.push({ name: "waypointsSettings" });
        },
      },
    ],
  },
  {
    label: "Preview",
    items: [
      {
        label: "Briefing",
        disabled: !getFlight?.value?.callsign,
        command: () => {
          router.push({ name: "briefing" });
        },
      },
      {
        label: "Datacard",
        disabled: !getFlight.value?.callsign,
        command: () => {
          router.push({ name: "datacard" });
        },
      },
      {
        label: "Steerpoints",
        disabled: !getFlight.value?.callsign,
        command: () => {
          router.push({ name: "steerpoints" });
        },
      },
      /*{
        label: "Datacard",
        command: () => {
          pageActive.value = "datacard";
        },
      },*/

      {
        label: "Comms",
        disabled: !getFlight.value?.callsign,
        command: () => {
          router.push({ name: "comms" });
        },
      },
      /*{
        label: "example Page",
        command: () => {
          pageActive.value = "example";
        },
      },*/
    ],
  },
  {
    label: "Export",
    disabled: !getFlight.value?.callsign,
    items: [
      {
        label: "Get DTC",
        disabled: !getFlight.value?.callsign,
        command: () => {
          // handle click
          if (getFlight.value?.callsign)
            useDTCexports().loadDTC({
              CMS: false,
              Datalink: false,
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
        label: "Get PNG",
        disabled: ![
          "briefing",
          "steerpoints",
          "datacard",
          "comms", // TODO, clear this up and use route meta instead
        ].includes(router.currentRoute.value.name as string),
        command: () => {
          // handle click
          download().downloadPageAsImage();
        },
      },
      {
        label: "Get ZIP",
        disabled: !getFlight.value?.callsign,
        command: () => {
          // handle click
          showExport.value = true;
          download()
            .createZip()
            .then(() => {
              showExport.value = false;
            });
        },
      },
      {
        label: "Get JSON",
        disabled: !selectedPKG,
        command: () => {
          // handle click
          console.log("JSON:", toRaw(packages.value));
        },
      },
    ],
  },
]);
// @ts-ignore
const version = `${__APP_VERSION__} (${new Date( // @ts-ignore
  __APP_VERSION_DATE__
).toLocaleDateString("se-SE")})`;

const showExport = ref(false);
</script>

<template>
  <div id="app">
    <div class="split left">
      <div class="logo13" style="height: 150px"></div>

      <Menu :model="items" style="border: none; background-color: #f4f4f4" />

      <hr style="width: 100%" v-if="file" />

      <SelectFlight v-if="file" showFlightSelection showPKGSelection />
    </div>
    <div class="split right" style="padding: 8px 0 0 8px">
      <div v-if="showExport">
        <div
          id="mdcpages"
          style="display: flex; position: absolute; top: -2000px"
        >
          <Newbriefing :pagenr="1" />
          <Newdatacard :pagenr="2" />
          <Newsteerpoints :pagenr="3" />
          <Newcomms :pagenr="4" />
        </div>
      </div>
      <div><RouterView /></div>
      <div style="position: fixed; top: 0px; right: 0px">
        <editHistory />
      </div>
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
  <div style="text-align: center; position: absolute; bottom: 0">
    version: {{ version }}
  </div>
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
