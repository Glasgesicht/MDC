import { createRouter, createWebHistory } from "vue-router";

import generalSettings from "@/settings_pages/generalSettings.vue";
import flightSettings from "@/settings_pages/flightSettings.vue";
import packageSettings from "@//settings_pages/packageSettings.vue";
import waypointsSettings from "@/settings_pages/waypoints.vue";

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
  ],
});

router.beforeEach((to, from) => {
  const { getFlight } = storeToRefs(useFlightStore());
  if (!getFlight.value) return false;
  return true;
});

export default router;
