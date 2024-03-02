<script setup lang="ts">
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

import Column from "primevue/column";
import { processCF } from "../config/parseCF";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePackageStore } from "@/stores/packageStore";
import type { Package } from "@/types/mdcDataTypes";
import { useFlightStore } from "@/stores/flightStore";

const confirmDelete = (index: number) => {
  allFlightsFromPackage.value.splice(index, 1);
};

const { packages, selectedPKG, allFlightsFromPackage } = storeToRefs(
  usePackageStore()
);
const { selctedFlight } = storeToRefs(useFlightStore());

const onRowReorder = (event: any) => {
  allFlightsFromPackage.value = event.value;
};

const file = ref(false);

const onChangedFile = async (payload: any) => {
  packages.value = new Array();
  selectedPKG.value = {} as Package;
  file.value = true;
  processCF(payload.target.files[0]);
};
</script>

<template>
  {{ selctedFlight }}
  <Card class="base">
    <template #header>
      Use this page to import files and edit general settings. Welcome to the
      <br />webdesign nightmare
    </template>
    <template #content>
      <TabView>
        <TabPanel header="General Setting"
          ><div class="parent">
            <input
              type="file"
              id="input"
              v-on:change="onChangedFile"
              accept=".cf"
              class="mdc-s-2"
              style="grid-row: 2"
            /></div
        ></TabPanel>
        <TabPanel header="Configure Package"
          ><div class="parent" v-if="file">
            <p>Selected Package</p>
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
              v-model="selctedFlight"
              :options="allFlightsFromPackage"
              optionLabel="callsign"
              placeholder="Select A Flight"
              class=""
              style="grid-row: 2"
            />

            <p style="grid-row: 4">Order Flights In Package</p>
            <DataTable
              class="mcd-s-7 datatable textleft"
              :value="allFlightsFromPackage"
              showGridlines
              @rowReorder="onRowReorder"
              style="grid-row: 5 / span 7"
            >
              <Column
                rowReorder
                headerStyle="width: 4rem"
                :reorderableColumn="false"
              />
              <Column header="FLIGHT" headerStyle="width: 10rem"
                ><template #body="{ index }"
                  >FLIGHT #{{ index + 1 }}</template
                ></Column
              >
              <Column field="callsign" header="Callsign" key="callsign">
                <template
                  #body="props"
                  style="text-align: unset; align-items: start"
                  >{{ props.data.callsign }}
                  {{ props.data.callsignNumber }}</template
                >
              </Column>
              <Column headerStyle="width: 4rem" header="VHF" field="VHF" />
              <Column headerStyle="width: 4rem" header="UHF" field="UHF" />
              <Column header="FLIGHTLEAD" />
              <Column headerStyle="width: 4.3rem">
                <template #body="{ index }"
                  ><Button
                    icon="pi pi-trash"
                    severity="help"
                    @click="confirmDelete(index)"
                    outlined
                /></template>
              </Column>
            </DataTable></div
        ></TabPanel>
        <TabPanel header="Configure Flight"
          ><div class="parent" v-if="file">
            <p class="">Select Flight To Edit</p>
            <Dropdown
              v-model="selctedFlight"
              :options="allFlightsFromPackage"
              optionLabel="callsign"
              placeholder="Select A Flight"
              class=""
              style="grid-row: 2"
            />
            <p style="grid-row: 4">Member in selected Flight</p>
            <DataTable
              class="mcd-s-5 datatable textleft"
              :value="selctedFlight.units"
              :reorderableColumns="true"
              showGridlines
              style="
                grid-row: 5 / span 5;
                align-content: left;
                margin-left: 0;
                text-align: left;
              "
            >
              <Column header="#" headerStyle="width: 4rem"
                ><template #body="{ index }">#{{ index + 1 }}</template></Column
              >
              <Column
                header="Callsign"
                field="callsign"
                headerStyle="width: 10rem"
              />

              <Column field="STN" header="STN" />
              <Column field="tailNr" header="TailNr" />
              <Column field="L16" header="L16" />

              <template #footer
                ><Button label="Add memeber to flight"
              /></template>
            </DataTable></div
        ></TabPanel>
      </TabView>
    </template>
  </Card>
</template>

<style>
.base {
  align-content: center;
  margin: auto;
  width: 75%;
  max-width: 1980px;
  min-width: 1080px;
  padding: 10px;
}
.parent {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(21, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.datatable * {
  text-align: left;
}
</style>
@/stores/packageStore
