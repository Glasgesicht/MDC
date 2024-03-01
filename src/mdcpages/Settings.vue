<script setup lang="ts">
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Column from "primevue/column";
import { processCF } from "../config/parseCF";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMCDStore } from "@/stores/mdcData";

const { packages, selectedPKG, allPackageFlights } = storeToRefs(useMCDStore());

const onRowReorder = (event: any) => {
  allPackageFlights.value = event.value;
};

const file = ref(false);

const selectedFlight = ref(null);

const onChangedFile = async (payload: any) => {
  packages.value = new Array();
  selectedPKG.value = { name: "not selected", flights: new Array() };
  file.value = true;
  processCF(payload.target.files[0]);
  console.log(payload.value);
};
</script>

<template>
  {{ packages }}
  <Card class="base">
    <template #header>
      Use this page to import files and edit genera Settings. Welcome to the
      <br />webdesign nightmare
    </template>
    <template #content>
      <div class="parent" v-if="file">
        <p>Currently Selected Package</p>
        <p class="">Select Flight To Edit</p>
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

        <Dropdown
          v-model="selectedFlight"
          :options="allPackageFlights"
          optionLabel="callsign"
          placeholder="Select A Flight"
          class=""
          style="grid-row: 2"
        />

        <p style="grid-row: 4">Order Flights In Package</p>
        <DataTable
          class="mcd-s-4 datatable"
          :value="allPackageFlights"
          :reorderableColumns="true"
          showGridlines
          @rowReorder="onRowReorder"
          style="
            grid-row: 5 / span 8;
            align-content: left;
            margin-left: 0;
            text-align: start;
          "
        >
          <Column
            rowReorder
            headerStyle="width: 3rem"
            :reorderableColumn="false"
          />
          <Column header="FLIGHT" headerStyle="width: 10rem"
            ><template #body="{ index }"
              >FLIGHT #{{ index + 1 }}</template
            ></Column
          >
          <Column field="callsign" header="callsign" key="callsign">
            <template #body="props"
              >{{ props.data.callsign }}
              {{ props.data.callsignNumber }}</template
            >
          </Column>

          <Column header="FLIGHTLEAD" />
        </DataTable>
      </div>
      <input
        type="file"
        id="input"
        v-on:change="onChangedFile"
        accept=".cf"
        class="mdc-s-2"
        style="grid-row: 2"
      />
    </template>
  </Card>
</template>

<style scoped>
.base {
  align-content: center;
  margin: auto;
  width: 75%;
  max-width: 1980px;
  padding: 10px;
}
.parent {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(16, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.datatable {
  text-align: left;
  align-items: start;
  align-self: first baseline;
}
</style>
