<template>
  <div style="display: block">
    <h3>Waypoints</h3>
    <DataTable
      showGridlines
      edit-mode="cell"
      selectionMode="multiple" :metaKeySelection="false"
      sort-field="waypointNr"
      :sortOrder="1"
      v-model:selection="selectedSteerpoints"
      :value="selectedFlight.waypoints"
      class="mcd-s-6 datatable textleft redefSize"
      style="
        grid-row: 28;
        align-content: left;
        margin-left: 0;
        text-align: left;
      "
    >
      <Column field="waypointNr" header="n°"  >
      <template #editor="{index}"><InputNumber v-model:model-value="selectedFlight.waypoints[index].waypointNr"></InputNumber></template></Column>
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

      <Column header="DMPI">
        <template #body="{ index }"
          ><Button
            @click="toDMPI(index)"
            outlined
            icon="pi pi-download" /></template
      ></Column>
      <Column>
        <template #body="{ index }"
          ><Button
            @click="deleteWaypoint(index)"
            severity="danger"
            outlined
            icon="pi pi-trash" /></template
      ></Column>
    </DataTable>
    <h3>Designated Impact Points (DMPIs)</h3>
    <DataTable showGridlines edit-mode="cell" :value="selectedFlight.dmpis">
      <Column field="type" header="Type">
        <template #editor="{ index }"
          ><input v-model="selectedFlight.dmpis[index].type" /></template
      ></Column>
      <Column field="name" header="Name">
        <template #editor="{ index }"
          ><input v-model="selectedFlight.dmpis[index].name" /></template
      ></Column>
      <Column field="altitude" header="Altitude"></Column>
      <Column field="latitude" header="Latitude"></Column>
      <Column field="longitude" header="Longitude"></Column>
      <Column field="note" header="Note"
        ><template #editor="{ index }"
          ><input v-model="selectedFlight.dmpis[index].note" /></template
      ></Column>
    </DataTable>
    <SteerpointsToDTC />
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import Column from "primevue/column";
import Input from "primevue/inputtext";

import { storeToRefs } from "pinia";
import { useFlightStore } from "@/stores/flightStore";
import SteerpointsToDTC from "@/components/steerpointsToDTC.vue";
import { ref } from "vue";
import InputNumber from "primevue/inputnumber";
const { selectedFlight } = storeToRefs(useFlightStore());

const selectedSteerpoints = ref(null)

function toDMPI(i: number) {
  const tdmpi = selectedFlight.value.waypoints.splice(i, 1);

  selectedFlight.value.dmpis.push({
    altitude: tdmpi[0].altitude,
    latitude: tdmpi[0].latitude,
    longitude: tdmpi[0].longitude,
    name: tdmpi[0].name,
    note: tdmpi[0].activity,
    type: tdmpi[0].type,
  });
}

function deleteWaypoint(i: number) {
  selectedFlight.value.waypoints.splice(i, 1);
}
</script>
