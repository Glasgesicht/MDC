import { createRouter, createMemoryHistory } from "vue-router";

import generalSettings from "@/views/settings/generalSettings.vue";
import flightSettings from "@/views/settings//flightSettings.vue";
import packageSettings from "@/views/settings/packageSettings.vue";
import waypointsSettings from "@/views/settings/waypoints.vue";

import newbriefing from "@/views/mdc/newbriefing.vue";
import newsteerpoints from "@/views/mdc/newsteerpoints.vue";
import newdatacard from "@/views/mdc/newdatacard.vue";
import newcomms from "@/views/mdc/newcomms.vue";
import Commsmatrix from "@/views/mdc/commsmatrix.vue";
import Flightmap from "@/views/mdc/map.vue";
import pageSettings from "@/views/pageSettings.vue";

import { useFlightStore } from "@/stores/flightStore";
import { storeToRefs } from "pinia";

const router = createRouter({
  history: createMemoryHistory(),

  routes: [
    {
      name: "generalSettings",
      path: "/generalSettings",
      component: generalSettings,
      meta: {
        canExport: false,
        requireLoaded: true,
      },
    },
    {
      name: "packageSettings",
      path: "/packageSettings",
      component: packageSettings,
      meta: {
        canExport: false,
        requireLoaded: true,
      },
    },
    {
      name: "flightSettings",
      path: "/flightSettings",
      component: flightSettings,
      meta: {
        canExport: false,
        requireLoaded: true,
      },
    },
    {
      name: "waypointsSettings",
      path: "/waypointsSettings",
      component: waypointsSettings,
      meta: {
        canExport: false,
        requireLoaded: true,
      },
    },
    {
      name: "briefing",
      path: "/briefing",
      component: newbriefing,
      props: {
        pagenr: 1,
      },
      meta: {
        canExport: true,
        requireLoaded: false,
      },
    },
    {
      name: "datacard",
      path: "/datacard",
      component: newdatacard,
      props: {
        pagenr: 2,
      },
      meta: {
        canExport: true,
        requireLoaded: false,
      },
    },
    {
      name: "steerpoints",
      path: "/steerpoints",
      component: newsteerpoints,
      props: {
        pagenr: 3,
      },
      meta: {
        canExport: true,
        requireLoaded: false,
      },
    },
    {
      name: "comms",
      path: "/comms",
      component: newcomms,
      props: {
        pagenr: 4,
      },
      meta: {
        canExport: true,
        requireLoaded: false,
      },
    },
    {
      name: "flightmap",
      path: "/flightmap",
      component: Flightmap,
      props: {
        pagenr: 5,
      },
      meta: {
        canExport: true,
        requireLoaded: false,
      }, // popupCalc.vue
    },
    {
      name: "commsMatrix",
      path: "/commsMatrix",
      component: Commsmatrix,
      props: {
        pagenr: 6,
      },
      meta: {
        canExport: true,
        requireLoaded: false,
      }, // popupCalc.vue
    },
    {
      name: "Application Settings",
      path: "/settings",
      component: pageSettings,
      meta: {
        canExport: false,
        requireLoaded: false,
      }, // popupCalc.vue
    },

    /* {
      name: "popupCalc",
      path: "/popupCalc",
      component: popupCalc,
      meta: {
        canExport: false,
      }, // popupCalc.vue
    },*/
  ],
});

router.beforeEach((to, from) => {
  const { getFlight } = storeToRefs(useFlightStore());
  if (to.meta.requireLoaded && !getFlight.value) return false;
  return true;
});

export default router;
