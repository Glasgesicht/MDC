<template>
  <div style="display: block" class="parent">
    <h3>Waypoints</h3>
    <DataTable
      showGridlines
      edit-mode="cell"
      selectionMode="multiple"
      :metaKeySelection="true"
      sort-field="waypointNr"
      :sortOrder="1"
      v-model:selection="selectedSteerpoints"
      :value="selectedFlight.waypoints"
      class="item"
      style="
        grid-row: 28;
        align-content: left;
        margin-left: 0;
        text-align: left;
      "
    >
      <Column field="waypointNr" header="n°">
        <template #editor="{ index }">
          <InputNumber
            v-model:model-value="selectedFlight.waypoints[index].waypointNr"
          ></InputNumber>
        </template>
      </Column>
      <Column field="name" header="Name"
        ><template #editor="{ index }">
          <Input v-model="selectedFlight.waypoints[index].name" /></template
      ></Column>
      <Column field="type" header="Type">
        <template #editor="{ index }">
          <Input v-model="selectedFlight.waypoints[index].type"
        /></template>
      </Column>
      <Column field="activity" header="Activity"></Column>
      <Column field="tot" header="Time on Target"
        ><template #body="{ data }">{{
          new Date(data.tot).toLocaleTimeString("de-DE")
        }}</template></Column
      >

      <Column field="mach" header="Mach"></Column>
      <Column field="groundspeed" header="Groundspeed"></Column>
      <Column field="altitude" header="Altitude"></Column>

      <Column header="DMPI">
        <template #body="{ index }"
          ><Button @click="toDMPI(index)" outlined icon="pi pi-download"
        /></template>
      </Column>
      <Column>
        <template #body="{ index }"
          ><Button
            @click="deleteWaypoint(index)"
            severity="danger"
            outlined
            icon="pi pi-trash"
        /></template>
      </Column>
    </DataTable>
    <Button
      label="decrement"
      icon="pi pi-angle-up"
      @click="decrSelected()"
      class="item"
    />
    <Button
      label="increment"
      icon="pi pi-chevron-down"
      @click="incSelected()"
      class="item"
    />
    <h3>Designated Impact Points (DMPIs)</h3>
    <DataTable showGridlines edit-mode="cell" :value="selectedFlight.dmpis">
      <Column field="type" header="Type">
        <template #editor="{ index }"
          ><input v-model="selectedFlight.dmpis[index].type"
        /></template>
      </Column>
      <Column field="name" header="Name">
        <template #editor="{ index }"
          ><input v-model="selectedFlight.dmpis[index].name"
        /></template>
      </Column>
      <Column field="altitude" header="Altitude"></Column>
      <Column field="latitude" header="Latitude"></Column>
      <Column field="longitude" header="Longitude"></Column>
      <Column field="note" header="Note"
        ><template #editor="{ index }"
          ><input v-model="selectedFlight.dmpis[index].note" /></template
      ></Column>
    </DataTable>
    <SteerpointsToDTC class="item" />
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import Column from "primevue/column";
import Input from "primevue/inputtext";

import { storeToRefs } from "pinia";
import { useFlightStore } from "@/stores/flightStore";
import SteerpointsToDTC from "@/components/DTCExports/steerpointsToDTC.vue";
import { ref } from "vue";
import InputNumber from "primevue/inputnumber";
const { selectedFlight } = storeToRefs(useFlightStore());

const selectedSteerpoints = ref(new Array());

/* I want to check for conflicts, so changeing this up
const incSelected = ()=> selectedSteerpoints.value.forEach(n => n.waypointNr +=1 )
const decrSelected = () => selectedSteerpoints.value.sort((a, b) => b.waypointNr - a.waypointNr).some(function (n) {
  console.log(n)
  if (n.waypointNr == 0) return;
  n.waypointNr -= 1
})*/

const sortSelected = () =>
  selectedSteerpoints.value.sort((a, b) => b.waypointNr - a.waypointNr);

const incSelected = () => {
  if (!selectedSteerpoints.value || !selectedSteerpoints.value[0]?.waypointNr)
    return;
  sortSelected();

  for (let i = 0; i < selectedSteerpoints.value.length; i++) {
    const swapWith = selectedFlight.value.waypoints.findIndex(
      (n) => n.waypointNr === selectedSteerpoints.value[i].waypointNr + 1
    );
    if (swapWith !== -1)
      selectedFlight.value.waypoints[swapWith].waypointNr -= 1;

    selectedSteerpoints.value[i].waypointNr += 1;
  }
};

const decrSelected = () => {
  if (!selectedSteerpoints.value || !selectedSteerpoints.value[0]?.waypointNr)
    return;
  sortSelected();

  for (let i = selectedSteerpoints.value.length - 1; i >= 0; i--) {
    if (selectedSteerpoints.value[i].waypointNr < 2) return;

    const swapWith = selectedFlight.value.waypoints.findIndex(
      (n) => n.waypointNr === selectedSteerpoints.value[i].waypointNr - 1
    );
    if (swapWith !== -1)
      selectedFlight.value.waypoints[swapWith].waypointNr += 1;
    selectedSteerpoints.value[i].waypointNr -= 1;
  }
};

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

<style scoped>
.parent {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  /* Align items horizontally at the start */
}

.item {
  margin: 10px;
}
</style>
