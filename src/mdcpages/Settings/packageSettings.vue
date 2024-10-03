<template>
  <div class="parent" v-if="file">
    <div style="min-width: 100%" class="parent">
      <div class="item" style="padding-right: 15px">
        <p class="" v-if="selectedPKG.name">Selected Package</p>
        <p class="" v-else>Please select a package to edit first</p>
        <!--<select v-model="selectedPKG">
          <option v-for="pkg in packages">{{ pkg.name }}</option>
        </select>-->
        <Dropdown
          v-model="selectedPKG"
          :options="packages"
          optionLabel="name"
          placeholder="Select A Package"
          class=""
        />
      </div>
      <div style="padding-right: 15px" v-if="selectedPKG.name">
        <p class="">Package Name</p>
        <Input style="height: 31px" v-model="selectedPKG.name"></Input>
      </div>
      <div v-if="selectedPKG.name">
        <p>RAMROD (selected)</p>
        <Dropdown
          style="grid-row: 2 / span 1; grid-column: 4 / span 2"
          :options="ramrods"
          v-model="ramrod"
          editable
          class=""
        />
      </div>
    </div>

    <div class="container" v-if="selectedPKG.name">
      <div class="box">
        <p
          style="grid-row: 4 / span 1; grid-column: 1 / span 2"
          class="textbox-label"
        >
          Order Flights In Package
        </p>

        <DataTable
          class="content-box"
          :value="allFlightsFromPackage"
          showGridlines
          edit-mode="cell"
          @rowReorder="onRowReorder"
          style="
            grid-row: 5 / span 10;
            grid-column: 1 / span 7;
            min-height: 20px;
          "
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
      </div>
      <div class="box">
        <label for="situation" class="textbox-label">Situation</label>

        <TextArea
          id="situation"
          class="content"
          style="min-width: 800px; min-height: 180px"
          v-model="selectedPKG.situation"
          :draggable="false"
          rows="5"
        />
      </div>
    </div>

    <div class="parent" style="width: 99%" v-if="selectedPKG.name">
      <div>
        <p style="min-width: 500px" class="">Aerial Threats Briefing</p>

        <TextArea
          style="min-width: 800px; min-height: 120px"
          v-model="selectedPKG.airThreat"
          :draggable="false"
          rows="3"
          class=""
        />
      </div>
      <div>
        <p style="min-width: 500px" class="">Surface Threats Briefing</p>

        <TextArea
          style="min-width: 800px; min-height: 120px"
          v-model="selectedPKG.surfaceThreat"
          :draggable="false"
          rows="3"
          class=""
        />
      </div>
    </div>

    <div v-if="selectedPKG.name">
      Threat Classes
      <DataTable
        :value="threats"
        style="min-width: 700px"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
        showGridlines
      >
        <Column header="Active" #body="{ data }" style="width: 5%">
          <Checkbox binary v-model="data.display"></Checkbox
        ></Column>
        <Column field="class" header="Class" style="width: 45%"
          ><template #body="{ data }">{{ data.class }}</template>
          <template #editor="{ data, field }">
            <Input v-model="data[field]" fluid /> </template></Column
        ><Column field="dor" header="DOR" style="width: 15%">
          <template #editor="{ data, field }">
            <Input
              v-model="data[field]"
              style="max-width: 50px"
              fluid
            /> </template
        ></Column>
        <Column field="dr" header="DR" style="width: 15%">
          <template #editor="{ data, field }">
            <Input
              v-model="data[field]"
              style="max-width: 50px"
              fluid
            /> </template
        ></Column>
        <Column field="mar" header="MAR" style="width: 15%">
          <template #editor="{ data, field }">
            <Input
              v-model="data[field]"
              fluid
              style="max-width: 50px"
            /> </template
        ></Column>
        <Column>
          <template #body="{ index }" style="width: 5%"
            ><Button
              @click="deleteThreat(index)"
              severity="danger"
              link
              style="padding: 0px"
              icon="pi pi-eraser"
          /></template>
        </Column>
      </DataTable>
    </div>
    <div v-if="selectedPKG.name">
      Codewords
      <DataTable
        :value="selectedPKG.codewords"
        editMode="cell"
        showGridlines
        @cell-edit-complete="onCellEditComplete"
        style="width: 900px"
      >
        <Column header="Name" field="name" style="width: 25%"
          ><template #body="{ data }">{{ data.name }}</template>
          <template #editor="{ data, field }"
            ><Input v-model="data[field]" /></template
        ></Column>
        <!--<Column header="Criteria" field="criteria" style="width: 25%"
          ><template #body="{ data }">{{ data.criteria }}</template
          ><template #editor="{ data, field }"
            ><Input v-model="data[field]" /></template
        ></Column>-->
        <!--<Column header="Authority" field="authority" style="width: 25%"
          ><template #body="{ data }">{{ data.authority }}</template
          ><template #editor="{ data, field }"
            ><Input v-model="data[field]" /></template
        ></Column>-->
        <Column header="Action" field="action" style="width: 25%"
          ><template #body="{ data }">{{ data.action }}</template
          ><template #editor="{ data, field }"
            ><Input v-model="data[field]" /></template
        ></Column>
      </DataTable>
    </div>
    <div v-if="selectedPKG.name">
      Agencies
      <!--     
    name: string;
    freq: string;
    type: string;
    activity: string;
    tacan: string;
    lat: string;
    lon: string;
    alt: string;
    active: boolean;-->
      <DataTable
        :value="selectedPKG.agencies"
        editMode="cell"
        showGridlines
        @cell-edit-complete="onCellEditComplete"
        style="width: 1100px"
      >
        <Column header="Add" #body="{ data }" style="width: 5%">
          <Checkbox binary v-model="data.active"></Checkbox
        ></Column>

        <Column header="Name" field="name" />
        <Column header="Freq" field="freq" />
        <Column header="Type" field="type" />
        <!--Column header="activity" field="activity" />-->
        <Column header="TACAN" field="tacan" />
        <Column header="Location"
          ><template #body="{ data }"
            >{{ toLatString(data.lat) }} /
            {{ toLongString(data.lon) }}</template
          ></Column
        >
      </DataTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePackageStore } from "@/stores/packageStore";
import { useGlobalStore } from "@/stores/theatreStore";
import { storeToRefs } from "pinia";
import { ramrods } from "@/config/ramrod";
import { ref } from "vue";

import DataTable from "primevue/datatable";
import TextArea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Input from "primevue/inputtext";
import Column from "primevue/column";
import Checkbox from "primevue/checkbox";

import { toLatString, toLongString } from "@/utils/utilFunctions";

const { stateChanged } = storeToRefs(useGlobalStore());
const editingRows = ref([]);

const { packages, selectedPKG, allFlightsFromPackage, ramrod, threats } =
  storeToRefs(usePackageStore());

const deleteThreat = (index: number) => {
  threats.value[index] = {
    display: false,
    class: "",
    dor: null,
    dr: null,
    mar: null,
  };
};

const confirmDelete = (index: number) => {
  allFlightsFromPackage.value.splice(index, 1);
};

const onRowReorder = (event: any) => {
  allFlightsFromPackage.value = event.value;
  stateChanged.value = Date.now();
};

const onRowEditSave = (event: any) => {
  let { newData, index } = event;

  threats.value[index] = newData;
};

const onCellEditComplete = (event: any) => {
  let { data, newValue, field } = event;
  data[field] = newValue;
};

const { file } = storeToRefs(useGlobalStore());
</script>
<style scoped>
* {
  padding: 0 0;
  margin: 0 0;
}
.parent {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.parent > div {
  padding-right: 15px;
  padding-bottom: 5px;
}

td > .p-button {
  font-size: 14px;
}

.container {
  display: flex;
  gap: 20px;
}

.box {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.content {
  height: 110%;
  box-sizing: border-box;
  resize: none;
}
</style>
