<template>
  <div class="parent" v-if="file">
    <div style="min-width: 100%" class="parent">
      <div class="item" style="padding-right: 15px">
        <p class="">Selected Package</p>
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
      <div style="padding-right: 15px">
        <p class="">Package Name</p>
        <Input class="" v-model="selectedPKG.name"></Input>
      </div>
      <div>
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

    <div>
      <p style="grid-row: 4 / span 1; grid-column: 1 / span 2" class="">
        Order Flights In Package
      </p>

      <DataTable
        class=""
        :value="allFlightsFromPackage"
        showGridlines
        edit-mode="cell"
        @rowReorder="onRowReorder"
        style="grid-row: 5 / span 10; grid-column: 1 / span 7"
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
    </div>
    <div>
      <p style="grid-row: 15 / span 1; grid-column: 1" class="">Situation</p>

      <TextArea
        style="min-width: 700px"
        v-model="selectedPKG.situation"
        :draggable="false"
        rows="5"
        class=""
      />
    </div>
    <div class="parent" style="width: 99%">
      <div>
        <p style="min-width: 500px" class="">Aerial Threats</p>

        <TextArea
          style="min-width: 500px; min-height: 120px"
          v-model="selectedPKG.airThreat"
          :draggable="false"
          rows="3"
          class=""
        />
      </div>
      <div>
        <p style="min-width: 500px" class="">Surface Threats</p>

        <TextArea
          style="min-width: 500px; min-height: 120px"
          v-model="selectedPKG.surfaceThreat"
          :draggable="false"
          rows="3"
          class=""
        />
      </div>
    </div>

    <DataTable
      :value="threats"
      editMode="row"
      v-model:editingRows="editingRows"
      @row-edit-save="onRowEditSave"
    >
      <Column header="Active" #body="{ data }">
        <Checkbox binary v-model="data.display"></Checkbox
      ></Column>
      <Column field="class" header="Class"
        ><template #body="{ data }">{{ data.class }}</template>
        <template #editor="{ data, field }">
          <Input v-model="data[field]" fluid /> </template></Column
      ><Column field="dor" header="DOR">
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" fluid /> </template
      ></Column>
      <Column field="dr" header="DR">
        <template #editor="{ data, field }">
          <Input v-model="data[field]" fluid /> </template
      ></Column>
      <Column field="mar" header="MAR">
        <template #editor="{ data, field }">
          <Input v-model="data[field]" fluid /> </template
      ></Column>
      <Column
        header="editor"
        :rowEditor="true"
        style="width: 10%; min-width: 8rem"
        bodyStyle="text-align:center"
      ></Column>
      <template #footer style="align-items: end"
        ><Button
          label="Add Row"
          @click="
            threats.push({
              class: '',
              display: true,
              dor: null,
              dr: null,
              mar: null,
            })
          "
      /></template>
      <Column>
        <template #body="{ index }"
          ><Button
            @click="deleteThreat(index)"
            severity="danger"
            outlined
            icon="pi pi-trash"
        /></template>
      </Column>
    </DataTable>
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
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Input from "primevue/inputtext";
import Column from "primevue/column";
import Checkbox from "primevue/checkbox";

const { stateChanged } = storeToRefs(useGlobalStore());
const editingRows = ref([]);

const { packages, selectedPKG, allFlightsFromPackage, ramrod, threats } =
  storeToRefs(usePackageStore());

const deleteThreat = (index: number) => {
  threats.value.splice(index, 1);
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
  /* Align items horizontally at the start */
}
.parent > div {
  padding-right: 15px;
  padding-bottom: 5px;
}
</style>
