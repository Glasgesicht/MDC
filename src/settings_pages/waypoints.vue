<template>
  <div style="display: block" class="parent" v-if="selectedFlight.callsign">
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
        max-width: 2050px;
        grid-row: 28;
        align-content: left;
        margin-left: 0;
        text-align: left;
      "
    >
      <Column field="waypointNr" header="WPN NR" style="width: 100px">
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
      <Column field="mach" header="Mach">
        <template #body="{ data }">{{ Number(data.mach).toFixed(2) }}</template>
      </Column>
      <Column field="groundspeed" header="Groundspeed">
        <template #body="{ data }"
          >{{ Number(data.groundspeed).toFixed(0) }} kts</template
        >
      </Column>
      <Column field="altitude" header="Altitude">
        <template #body="{ data }"
          >{{ Number(data.altitude).toFixed(0) }} ft</template
        >
        <template #editor="{ index }">
          <InputNumber
            v-model:model-value="selectedFlight.waypoints[index].altitude"
          ></InputNumber>
        </template>
      </Column>
      <Column header="Hide" field="hideOnMDC" style="width: 40px">
        <template #body="{ data }">
          <Checkbox binary v-model="data.hideOnMDC"></Checkbox>
        </template>
      </Column>
      <Column header="DMPI" style="width: 40px">
        <template #body="{ index }"
          ><Button @click="toDMPI(index)" outlined icon="pi pi-download"
        /></template>
      </Column>

      <Column style="width: 40px">
        <template #body="{ index }"
          ><Button
            @click="deleteWaypoint(index)"
            severity="danger"
            outlined
            icon="pi pi-trash"
        /></template>
      </Column>
      <template #footer>
        <Button
          label="decrement"
          icon="pi pi-angle-up"
          @click="decrSelected()"
          class="item" />
        <Button
          label="increment"
          icon="pi pi-chevron-down"
          @click="incSelected()"
          class="item" />
        <Button label="hide selected" @click="hideSelected()" class="item" />
        <Button label="unhide selected" @click="unhideSelected()" class="item"
      /></template>
    </DataTable>
    <div class="content parent" v-if="selectedFlight.callsign">
      <div class="content">
        <h3 style="padding-bottom: 11px; min-width: 400px">
          Designated Impact Points (DMPIs)
        </h3>
        <DataTable
          showGridlines
          edit-mode="cell"
          :value="selectedFlight.dmpis"
          style="min-width: 1200px"
        >
          <Column header="WPN NR" style="width: 100px"
            ><template #body="{ index }">{{ index + 80 }}</template></Column
          >
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
          <Column field="altitude" header="Altitude">
            <template #body="{ data }"
              >{{ Number(data.altitude).toFixed(0) }} ft</template
            >
          </Column>
          <Column field="latitude" header="Latitude">
            <template #body="{ data }">{{
              toLatString(data.latitude)
            }}</template>
          </Column>
          <Column field="longitude" header="Longitude">
            <template #body="{ data }">{{
              toLongString(data.longitude)
            }}</template>
          </Column>
          <Column field="note" header="Note"
            ><template #editor="{ index }"
              ><input v-model="selectedFlight.dmpis[index].note" /></template
          ></Column>
          <template #footer>
            <SteerpointsToDTC class="item" mode="all" label="all to DTC" />
            <SteerpointsToDTC
              class="item"
              mode="waypoints"
              label="waypoints to DTC"
            />
            <SteerpointsToDTC class="item" mode="dmpi" label="DMPI to DTC" />
          </template>
        </DataTable>
      </div>
    </div>

    <Dialog v-model:visible="showDia">
      <template #header>
        <a style="font-weight: bold">Copy DMPI to Flights</a>
      </template>
    </Dialog>
  </div>
  <div v-else><h2>Please select a flight to edit</h2></div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import Column from "primevue/column";
import Input from "primevue/inputtext";
import Checkbox from "primevue/checkbox";

import { storeToRefs } from "pinia";
import { useFlightStore } from "@/stores/flightStore";
import SteerpointsToDTC from "@/components/DTCExports/steerpointsToDTC.vue";
import { computed, ref, watch, type WritableComputedRef } from "vue";
import InputNumber from "primevue/inputnumber";
import { toLatString, toLongString } from "@/utils/utilFunctions";
import Dialog from "primevue/dialog";
import { usePackageStore } from "@/stores/packageStore";
const { selectedFlight } = storeToRefs(useFlightStore());
const { allFlightsFromPackage, selectedPKG } = storeToRefs(usePackageStore());
const showDia = ref(false);

const selectedSteerpoints = ref(new Array());
const selectedCopyDMPI = ref(new Array());

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
  if (
    !selectedSteerpoints.value.length ||
    !selectedSteerpoints.value[0]?.waypointNr
  ) {
    return;
  }

  selectedSteerpoints.value.sort((a, b) => a.waypointNr - b.waypointNr);

  for (let i = selectedSteerpoints.value.length - 1; i >= 0; i--) {
    const swapWith = selectedFlight.value.waypoints.findIndex(
      (n) => n.waypointNr === selectedSteerpoints.value[i].waypointNr + 1
    );
    if (swapWith !== -1) {
      selectedFlight.value.waypoints[swapWith].waypointNr -= 1;
    }

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

const hideSelected = () => {
  if (!selectedSteerpoints.value) return;

  selectedSteerpoints.value.forEach((n) => (n.hideOnMDC = true));
};

const unhideSelected = () => {
  if (!selectedSteerpoints.value) return;

  selectedSteerpoints.value.forEach((n) => (n.hideOnMDC = false));
};

function toDMPI(i: number) {
  selectedSteerpoints.value = new Array();

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

.content {
  box-sizing: border-box;
  resize: none;
  padding-right: 50px;
}

.item {
  margin: 10px;
}
</style>
