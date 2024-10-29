import { createRouter, createWebHistory } from "vue-router";

import generalSettings from "@/views/settings/generalSettings.vue";
import flightSettings from "@/views/settings//flightSettings.vue";
import packageSettings from "@/views/settings/packageSettings.vue";
import waypointsSettings from "@/views/settings/waypoints.vue";

import newbriefing from "@/views/mdc/newbriefing.vue";
import newsteerpoints from "@/views/mdc/newsteerpoints.vue";
import newdatacard from "@/views/mdc/newdatacard.vue";
import newcomms from "@/views/mdc/newcomms.vue";
import Commsmatrix from "@/views/mdc/commsmatrix.vue";

import { useFlightStore } from "@/stores/flightStore";
import { storeToRefs } from "pinia";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "generalSettings",
      path: "/generalSettings",
      component: generalSettings,
    },
    {
      name: "packageSettings",
      path: "/packageSettings",
      component: packageSettings,
    },
    {
      name: "flightSettings",
      path: "/flightSettings",
      component: flightSettings,
    },
    {
      name: "waypointsSettings",
      path: "/waypointsSettings",
      component: waypointsSettings,
    },
    {
      name: "briefing",
      path: "/briefing",
      component: newbriefing,
      props: {
        pagenr: 1,
      },
    },
    {
      name: "datacard",
      path: "/datacard",
      component: newdatacard,
      props: {
        pagenr: 2,
      },
    },
    {
      name: "steerpoints",
      path: "/steerpoints",
      component: newsteerpoints,
      props: {
        pagenr: 3,
      },
    },
    {
      name: "comms",
      path: "/comms",
      component: newcomms,
      props: {
        pagenr: 4,
      },
    },
    {
      name: "commsMatrix",
      path: "/commsMatrix",
      component: Commsmatrix,
      props: {
        pagenr: 5,
      },
    },
  ],
});

router.beforeEach((to, from) => {
  const { getFlight } = storeToRefs(useFlightStore());
  if (!getFlight.value) return false;
  return true;
});

export default router;
