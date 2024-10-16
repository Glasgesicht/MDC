import { createRouter, createWebHistory } from "vue-router";

import generalSettings from "@/mdcpages/Settings/generalSettings.vue";
import flightSettings from "@/mdcpages/Settings/flightSettings.vue";
import packageSettings from "@/mdcpages/Settings/packageSettings.vue";
import waypointsSettings from "@/mdcpages/Settings/waypoints.vue";

import newbriefing from "@/mdcpages/newbriefing.vue";
import newsteerpoints from "@/mdcpages/newsteerpoints.vue";
import newdatacard from "@/mdcpages/newdatacard.vue";
import newcomms from "@/mdcpages/newcomms.vue";
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
      name: "steerpoints",
      path: "/steerpoints",
      component: newsteerpoints,
      props: {
        pagenr: 2,
      },
    },
    {
      name: "datacard",
      path: "/datacard",
      component: newdatacard,
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
  ],
});

router.beforeEach((to, from) => {
  const { selectedFlight } = storeToRefs(useFlightStore());
  if (!selectedFlight.value) return false;
  return false;
});

export default router;
