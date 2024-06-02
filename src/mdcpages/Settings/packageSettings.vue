<template>
  <div class="parent" v-if="file">
    <p class="mcd-s-1 mcd-m-a">Selected Package</p>
    <p class="mcd-s-1 mcd-m-a">Package Name</p>
    <!--<select v-model="selectedPKG">
          <option v-for="pkg in packages">{{ pkg.name }}</option>
        </select>-->
    <Dropdown
      v-model="selectedPKG"
      :options="packages"
      optionLabel="name"
      placeholder="Select A Package"
      class="mcd-s-1 c-height"
      style="grid-row: 2"
    />
    <Input
      style="grid-row: 2"
      class="mcd-s-1 c-height"
      v-model="selectedPKG.name"
    ></Input>

    <p style="grid-row: 4 / span 1" class="mcd-s-2 c-height mcd-m-a">
      Order Flights In Package
    </p>

    <DataTable
      class="mcd-s-6 datatable textleft redefSize g-height"
      :value="allFlightsFromPackage"
      showGridlines
      edit-mode="cell"
      @rowReorder="onRowReorder"
      style="grid-row: 5 / span 5"
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
          {{ selectedPKG.flights[index].mycomm.pri.number }}
          <br />{{ selectedPKG.flights[index].mycomm.pri.freq }}
        </template></Column
      >
      <Column headerStyle="width: 8rem" header="SEC" field="comms.radio2">
        <template #body="{ index }">
          {{ selectedPKG.flights[index].mycomm.sec.name }}
          {{ selectedPKG.flights[index].mycomm.sec.number }}<br />{{
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
    <p style="grid-row: 12 / span 1" class="mcd-s-2 c-height mcd-m-a">
      RAMROD (selected)
    </p>

    <p style="grid-row: 12 / span 1" class="mcd-s-2 c-height mcd-m-a">
      Situation
    </p>
    <Dropdown
      style="grid-row: 13 / span 1"
      :options="ramrods"
      v-model="ramrod"
      editable
    />
    <Textarea
      style="grid-row: 13 / span 3; grid-column: 3 / span 3"
      v-model="selectedPKG.situation"
      rows="5"
      draggable="false"
    />
  </div>
</template>
<script setup lang="ts">
import { usePackageStore } from "@/stores/packageStore";
import { useGlobalStore } from "@/stores/theatreStore";
import { storeToRefs } from "pinia";
import { ramrods } from "@/config/ramrod";

import DataTable from "primevue/datatable";
import Textarea from "primevue/textarea";
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
