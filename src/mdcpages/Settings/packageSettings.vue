<template>
  <div class="parent" v-if="file">
    <p class="">Selected Package</p>
    <p class="">Package Name</p>
    <!--<select v-model="selectedPKG">
          <option v-for="pkg in packages">{{ pkg.name }}</option>
        </select>-->
    <Dropdown
      v-model="selectedPKG"
      :options="packages"
      optionLabel="name"
      placeholder="Select A Package"
      class=""
      style="grid-row: 2"
    />
    <Input style="grid-row: 2" class="" v-model="selectedPKG.name"></Input>

    <p style="grid-row: 1 / span 1; grid-column: 4" class="">
      RAMROD (selected)
    </p>
    <Dropdown
      style="grid-row: 2 / span 1; grid-column: 4"
      :options="ramrods"
      v-model="ramrod"
      editable
      class=""
    />

    <p style="grid-row: 4 / span 1; grid-column: 1 / span 2" class="">
      Order Flights In Package
    </p>

    <DataTable
      class=""
      :value="allFlightsFromPackage"
      showGridlines
      edit-mode="cell"
      @rowReorder="onRowReorder"
      style="grid-row: 5 / span 10; grid-column: 1 / span 5"
    >
      <Column rowReorder headerStyle="width: 4rem" :reorderableColumn="false" />
      <Column header="FLIGHT" headerStyle="width: 10rem"
        ><template #body="{ index }">FLIGHT #{{ index + 1 }}</template></Column
      >
      <Column field="callsign" header="Callsign" key="callsign">
        <template #body="props" style="text-align: unset; align-items: start"
          >{{ props.data.callsign }} {{ props.data.callsignNumber }}</template
        >
      </Column>
      <Column headerStyle="width: 6rem" header="Type" field="aircrafttype">
        <template #editor="{ index }">
          <Input v-model="selectedPKG.flights[index].aircrafttype"
        /></template>
      </Column>
      <Column headerStyle="width: 8rem" header="PRI" field="comms.radio1">
        <template #body="{ index }">
          {{ selectedPKG.flights[index].mycomm.pri.name }}
          {{ selectedPKG.flights[index].mycomm.pri.number || "" }}
          <br />{{ selectedPKG.flights[index].mycomm.pri.freq }}
        </template></Column
      >
      <Column headerStyle="width: 8rem" header="SEC" field="comms.radio2">
        <template #body="{ index }">
          {{ selectedPKG.flights[index].mycomm.sec.name }}
          {{ selectedPKG.flights[index].mycomm.sec.number || "" }}<br />{{
            selectedPKG.flights[index].mycomm.sec.freq
          }}</template
        ></Column
      >
      <Column header="FLIGHTLEAD">
        <template #body="{ data }">
          {{ data.units[0]?.callsign }}
        </template></Column
      >
      <Column headerStyle="width: 4.3rem">
        <template #body="{ index }"
          ><Button
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDelete(index)"
            outlined
        /></template>
      </Column>
    </DataTable>

    <p style="grid-row: 15 / span 1; grid-column: 1" class="">Situation</p>

    <TextArea
      style="grid-row: 16 / span 10; grid-column: 1 / span 7"
      v-model="selectedPKG.situation"
      :draggable="false"
      rows="5"
      class=""
    />
  </div>
</template>
<script setup lang="ts">
import { usePackageStore } from "@/stores/packageStore";
import { useGlobalStore } from "@/stores/theatreStore";
import { storeToRefs } from "pinia";
import { ramrods } from "@/config/ramrod";

import DataTable from "primevue/datatable";
import TextArea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Input from "primevue/inputtext";
import Column from "primevue/column";
import { flights } from "@/config/flights";
const { stateChanged } = storeToRefs(useGlobalStore());

const { packages, selectedPKG, allFlightsFromPackage, ramrod } = storeToRefs(
  usePackageStore()
);

const confirmDelete = (index: number) => {
  allFlightsFromPackage.value.splice(index, 1);
};

const onRowReorder = (event: any) => {
  allFlightsFromPackage.value = event.value;
  stateChanged.value = Date.now();
};

const { file } = storeToRefs(useGlobalStore());
</script>
<style scoped>
* {
  padding: 0 0;
  margin: 0 0;
}
.parent {
  display: grid;
  grid-template-columns: repeat(8, 180px);
  grid-template-rows: repeat(64, 35px);
  text-align: left;
}
</style>
