<template>
  <div style="display: block">
    <p style="grid-row: 27" class="mcd-s-2 mcd-m-a">Edit Waypoints</p>
    <DataTable
      showGridlines
      edit-mode="cell"
      :value="selectedFlight.waypoints"
      class="mcd-s-6 datatable textleft redefSize"
      style="
        grid-row: 28;
        align-content: left;
        margin-left: 0;
        text-align: left;
      "
    >
      <Column field="waypointNr" header="n°"></Column>
      <Column field="name" header="Name"
        ><template #editor="{ index }">
          <Input v-model="selectedFlight.waypoints[index].name" /></template
      ></Column>
      <Column field="type" header="Type">
        <template #editor="{ index }">
          <Input v-model="selectedFlight.waypoints[index].type" /></template
      ></Column>
      <Column field="activity" header="Activity"></Column>
      <Column field="tot" header="Time on Target"></Column>

      <Column field="mach" header="Mach"></Column>
      <Column field="groundspeed" header="Groundspeed"></Column>
      <Column field="altitude" header="Altitude"></Column>
      <Column>
        <template #body="{ index }"
          ><Button
            @click="deleteWaypoint(index)"
            severity="danger"
            outlined
            icon="pi pi-trash" /></template
      ></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import Column from "primevue/column";
import Input from "primevue/inputtext";

import { storeToRefs } from "pinia";
import { useFlightStore } from "@/stores/flightStore";
const { selectedFlight } = storeToRefs(useFlightStore());

function deleteWaypoint(i: number) {
  selectedFlight.value.waypoints.splice(i, 1);
}
</script>
