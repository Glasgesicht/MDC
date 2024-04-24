<script setup lang="ts">
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Input from "primevue/inputtext";

import Column from "primevue/column";
import { flights } from "../config/flights";
import { processCF } from "../config/parseCF";
import { ref, computed, watch } from "vue";
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
  file.value = true;
  processCF(payload.target.files[0]);
};

const groupedFlights = computed(() =>
  flights.reduce((coll, curr) => {
    if (
      packages.value.find((e) =>
        e.flights.find((n) => {
          // Filters out already assigned Callsigns
          return n.callsign.toLowerCase() == curr.callsign.toLowerCase();
        })
      )
    )
      return coll;

    const group = coll.map((n) => n.label).indexOf(curr.type);
    if (group !== -1)
      coll[group].items.push({
        callsign: curr.callsign,
        callsignNumber: curr.number,
        type: curr.type,
      });
    else
      coll.push({
        label: curr.type,
        items: [
          {
            callsign: curr.callsign,
            callsignNumber: curr.number,
            type: curr.type,
          },
        ],
      });

    return coll;
  }, new Array<{ label: string; items: Array<{ callsign: String; callsignNumber: Number; type: String }> }>())
);
</script>

<template>
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
            <p>Change Package Name</p>
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
            <Input style="grid-row: 2" v-model="selectedPKG.name"></Input>

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
              ><template #value="value"
                >{{ value.value.callsign || "Select a Flight" }}
                {{ value.value.callsignNumber || "" }}</template
              >
              <template #option="option"
                >{{ option.option.callsign }} {{ option.option.callsignNumber }}
              </template></Dropdown
            >

            <Dropdown
              placeholder="select new callsign"
              style="grid-row: 2"
              :options="groupedFlights"
              @change="
                (event) => {
                  selctedFlight.callsign = event.value.callsign;
                  selctedFlight.callsignNumber = event.value.callsignNumber;
                  selctedFlight.aircrafttype = event.value.type;
                }
              "
              optionLabel="callsign"
              optionGroupLabel="label"
              optionGroupChildren="items"
            >
              <template #optiongroup="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option.label }}</div>
                </div>
              </template></Dropdown
            >
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
              edit-mode="cell"
            >
              <Column header="#" headerStyle="width: 4rem"
                ><template #body="{ index }">#{{ index + 1 }}</template></Column
              >
              <Column
                header="Callsign"
                field="callsign"
                headerStyle="width: 10rem"
              >
                <template #body="{ data, field }">
                  {{ data[field] }}
                </template>
                <template #editor="{ data, field, index }">
                  <input
                    v-model="selctedFlight.units[index].callsign"
                    autofocus
                  />
                </template>
              </Column>

              <Column field="STN" header="STN" />
              <Column field="tailNr" header="TailNr" />
              <Column field="L16" header="L16" />

              <template #footer
                ><Button label="Add member to flight"
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
  grid-template-columns: repeat(7);
  grid-template-rows: repeat(32);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.datatable * {
  text-align: left;
}
</style>
