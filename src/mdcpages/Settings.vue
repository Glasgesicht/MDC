<script setup lang="ts">
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Column from "primevue/column";
import { processCF } from "../config/parseCF";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMCDStore } from "@/stores/mdcData";

const listItems = ref([
  {
    id: 1,
    CALLSIGN: "BEAST 7",
    VHF: "141.70",
    UHF: "267.70",
  },
  { CALLSIGN: "APEX 1", UHF: "267.10", VHF: "141.10", id: 1 },
  { CALLSIGN: "DEMON 8", UHF: "267.80", VHF: "141.80", id: 1 },
  { CALLSIGN: "PLASMA 3", UHF: "267.30", VHF: "141.30", id: 1 },
]);

const { packages, selectedPKG, allPackageFlights } = storeToRefs(useMCDStore());

const onRowReorder = (event: any) => {
  listItems.value = event.value;
};

const file = ref();

const onChangedFile = async (payload: any) => {
  file.value = payload.target.files[0];
  let filedata = processCF(file.value);
  // console.log(filedata);
};
</script>

<template>
  <Card>
    <template #header>
      Use this page to import files and edit genera Settings. Welcome to the
      <br />webdesign nightmare
    </template>
    <template #content v-if="!file">
      <div class="parent">
        <label for="input"></label>
        <input
          type="file"
          id="input"
          v-on:change="onChangedFile"
          accept=".cf"
        />
      </div>
    </template>
    <template #content v-else>
      <div class="parent">
        <label for="input"></label>
        <input
          type="file"
          id="input"
          v-on:change="onChangedFile"
          accept=".cf"
        />
        <p class="">Currently Selected Package</p>
        <p class="mcd-s-3">Order Flights In Package</p>
        <!--<select v-model="selectedPKG">
          <option v-for="pkg in packages">{{ pkg.name }}</option>
        </select>-->

        <Dropdown
          v-model="selectedPKG"
          :options="packages"
          optionLabel="name"
          placeholder="Select A Package"
          class="w-full md:w-14rem"
        />

        <DataTable
          class="mcd-s-3 mcd-row-3"
          :value="allPackageFlights"
          :reorderableColumns="true"
          showGridlines
          @rowReorder="onRowReorder"
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
          <Column field="callsign" header="callsign" key="callsign" />

          <Column header="FLIGHTLEAD" />
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(16, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
</style>
