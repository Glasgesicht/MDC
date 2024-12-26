<script setup lang="ts">
import Menu from "primevue/menu";
import {
  ref,
  provide,
  computed,
  type Ref,
  toRaw,
  onMounted,
  watch,
  onBeforeUnmount,
} from "vue";
import { usePackageStore } from "./controller/stores/packageStore";
import { useFlightStore } from "./controller/stores/flightStore";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "./controller/stores/theatreStore";
import { processCF, processJSON } from "./controller/utils/parseFiles";
import { useDTCexports } from "@/components/DTCExports/dtcExport";

import Newsteerpoints from "./views/mdc/newsteerpoints.vue";
import Newdatacard from "./views/mdc/newdatacard.vue";
import Newcomms from "./views/mdc/newcomms.vue";
import Newbriefing from "./views/mdc/newbriefing.vue";

import type { MenuItem } from "primevue/menuitem";
import router from "./controller/router";
import { download } from "./controller/utils/download";
import { RouterView, useRoute } from "vue-router";
import SelectFlight from "./components/PackageFlightSelection/SelectFlight.vue";
import editHistory from "./components/history/editHistory.vue";
import Commsmatrix from "./views/mdc/commsmatrix.vue";
import Flightmap from "./views/mdc/map.vue";

const showROE = ref(false);
const { selectedPKG, packages } = storeToRefs(usePackageStore());
const { getFlight } = storeToRefs(useFlightStore());
provide("showROE", showROE);

const route = useRoute();
const meta = computed(() => route.meta);

const globalStore = useGlobalStore();
const { file } = storeToRefs(globalStore);

const filename = ref("Select File");
const onChangedFile = async (payload: any) => {
  filename.value = payload.target.files[0].name;

  globalStore.setFile(true);
  switch (filename.value.split(".")[1]) {
    case "cf":
      processCF(payload.target.files[0]).then(() => {
        router.push({ name: "packageSettings" });
      });
      break;
    case "json":
      processJSON(payload.target.files[0]);
  }

  globalStore.setFilename(payload.target.files[0].name); //payload.target.files[0].name;
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
      /*{ // low priority
        label: "Manage Packages",
        icon: "pi pi-users",
        command: () => {
          router.push({ name: "oraganizePackages" });
        },
      },*/
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
        disabled: !selectedPKG.value,
        command: () => {
          router.push({ name: "flightSettings" });
        },
      },
      {
        label: "Steerpoints",
        icon: "pi pi-user-edit",
        disabled: !getFlight.value?.callsign,
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
        icon: router.currentRoute.value.name === "1" ? "pi pi-angle-right" : "",
        command: () => {
          router.push({ name: "1" });
        },
      },
      {
        label: "Datacard",
        disabled: !getFlight.value?.callsign,
        icon: router.currentRoute.value.name === "2" ? "pi pi-angle-right" : "",
        command: () => {
          router.push({ name: "2" });
        },
      },
      {
        label: "Steerpoints",
        disabled: !getFlight.value?.callsign,
        icon: router.currentRoute.value.name === "3" ? "pi pi-angle-right" : "",
        command: () => {
          router.push({ name: "3" });
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
        icon: router.currentRoute.value.name === "4" ? "pi pi-angle-right" : "",
        command: () => {
          router.push({ name: "4" });
        },
      },
      {
        label: "Flight Map",
        disabled: !getFlight.value?.callsign,
        icon: router.currentRoute.value.name === "5" ? "pi pi-angle-right" : "",
        command: () => {
          router.push({ name: "5" });
        },
      },
      {
        label: "Comms Matrix",
        disabled: !getFlight.value?.callsign,
        icon: router.currentRoute.value.name === "6" ? "pi pi-angle-right" : "",
        command: () => {
          router.push({ name: "6" });
        },
      },
    ],
  },
  {
    label: "Export",
    disabled: !getFlight.value?.callsign,
    items: [
      {
        label: "Get DTC",
        icon: "pi pi-copy",
        disabled: !getFlight.value?.callsign,
        command: () => {
          // handle click
          if (getFlight.value?.callsign)
            useDTCexports().loadDTC({
              CMS: false,
              Datalink: true,
              HARM: false,
              HTS: false,
              MFD: false,
              Misc: true,
              Radios: true,
              Upload: true,
              Waypoints: "all",
            });
        },
      },
      {
        label: "Get PNG",
        icon: "pi pi-download",
        disabled: !meta.value.canExport,
        command: () => {
          download().downloadPageAsImage();
        },
      },
      {
        label: "Get ZIP",
        icon: "pi pi-download",
        disabled: !getFlight.value?.callsign,
        command: () => {
          showExport.value = true;
          download()
            .createZip()
            .then(() => {
              showExport.value = false;
            });
        },
      },
      {
        icon: "pi pi-download",
        label: "Get JSON",
        disabled: !selectedPKG.value,
        command: () => {
          download().toJSON();
        },
      },
    ],
  },
  {
    label: "Other Pages",
    items: [
      {
        icon: "pi pi-cog",
        label: "Configuration",
        command: () => {
          router.push({ name: "Configuration" });
        },
      },
      {
        label: "Application Settings",
        icon: "pi pi-cog",
        command: () => {
          router.push({ name: "Application Settings" });
        },
      },
    ],
  },
]);
// @ts-ignore
const version = `${__APP_VERSION__} (${new Date( // @ts-ignore
  __APP_VERSION_DATE__
).toLocaleDateString("se-SE")})`;

const handleKeypress = (event: KeyboardEvent) => {
  if (!meta.value.canExport) return;

  const currentRouteName = parseInt(router.currentRoute.value.name as string);

  if (event.key === "ArrowLeft" && currentRouteName > 1) {
    router.push({ name: (currentRouteName - 1).toString() });
  } else if (event.key === "ArrowRight" && currentRouteName < 6) {
    router.push({ name: (currentRouteName + 1).toString() });
  }
};

/**
 * idk why CSS media queries don't work, use this ungodly workaround for now
 */
const isSmallScreen = ref(window.innerWidth <= 1310);
const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 1310;
};
// Add and remove the keypress event listener
onMounted(() => {
  window.addEventListener("keydown", handleKeypress);
  window.addEventListener("resize", updateScreenSize);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeypress);
  window.removeEventListener("resize", updateScreenSize);
});

const showExport = ref(false);
</script>

<template>
  <div id="app">
    <div class="split left" style="background-color: var(--p-menu-background)">
      <div class="logo13" style="height: 150px"></div>

      <Menu :model="items" style="border: none" />

      <hr style="width: 100%" v-if="file" />

      <SelectFlight v-if="file" showFlightSelection showPKGSelection />
    </div>
    <div class="split right" style="padding: 8px 0 0 8px">
      <div v-if="showExport">
        <div id="mdcpages" style="display: flex; position: absolute; top: -2000px">
          <Newbriefing :pagenr="1" />
          <Newdatacard :pagenr="2" />
          <Newsteerpoints :pagenr="3" />
          <Newcomms :pagenr="4" />
          <Commsmatrix :pagenr="5" />
        </div>
      </div>
      <div>
        <div :style="meta.canExport ? 'display: flex; align-items: center' : ''">
          <Button v-if="meta.canExport && !isSmallScreen" :disabled="router.currentRoute.value.name === '1'" @click="
            router.push({
              name:
                parseInt(router.currentRoute.value.name as string) - 1 + '',
            })
            " style="height: 100vh; width: 28%; border: none; font-size: 32px" outlined icon="pi pi-chevron-left" />
          <RouterView />
          <Button v-if="meta.canExport && !isSmallScreen" style="height: 100vh; width: 32%; border: none"
            :disabled="router.currentRoute.value.name == '6'" @click="
              router.push({
                name:
                  parseInt(router.currentRoute.value.name as string) + 1 + '',
              })
              " outlined icon="pi pi-chevron-right" />
        </div>
      </div>
      <div style="position: fixed; top: 0px; right: 0px; border: none">
        <editHistory />
      </div>
    </div>
  </div>
  <input style="display: none" type="file" id="fileUpload" class="file-input" v-on:change="onChangedFile"
    accept=".cf,.json" />
  <div style="text-align: center; position: absolute; bottom: 0">
    version: {{ version }}
  </div>
</template>

<style>
#app {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
  box-sizing: border-box;
  padding: 0;
}

.split {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pi-chevron-left,
.pi-chevron-right {
  font-size: 18px !important;
  opacity: 0.8;
}

/** 
html.darkmode body div#app div#app div.split.right div div button.p-button.p-component.p-button-icon-only.p-button-outlined.page-button 
*/

.left {
  min-width: 200px;
  width: 220px;
  max-width: 220px;
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
