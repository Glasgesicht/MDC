<template>
  <div class="settings-parent" v-if="file">
    <div class="container">
      <div class="box" style="max-width: 250px">
        <p class="" v-if="selectedPKG.name">Selected Package</p>
        <p class="" v-else>Please select a package to edit first</p>
        <!--<select v-model="selectedPKG">
          <option v-for="pkg in packages">{{ pkg.name }}</option>
        </select>-->
        <SelectFlight
          v-if="file"
          showPKGSelection
          :showFlightSelection="false"
        />
      </div>
      <div v-if="selectedPKG.name" class="box" style="max-width: 250px">
        <p class="">Package Name</p>
        <InputText style="height: 28px" v-model="selectedPKG.name"></InputText>
      </div>
      <div v-if="selectedPKG.name" class="box" style="max-width: 250px">
        <p>RAMROD (selected)</p>
        <Select
          :options="ramrods"
          v-model="selectedPKG.ramrod"
          editable
          class="m-5"
        />
      </div>
    </div>

    <div class="container" v-if="selectedPKG.name">
      <div class="box" style="max-width: 1100px">
        <p
          style="grid-row: 4 / span 1; grid-column: 1 / span 2"
          class="textbox-label"
        >
          Order Flights In Package
        </p>

        <DataTable
          :value="selectedPKG.flights"
          showGridlines
          edit-mode="cell"
          @rowReorder="onRowReorder"
          style="min-height: 20px; max-width: 1100px"
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
              <InputText v-model="selectedPKG.flights[index].aircrafttype"
            /></template>
          </Column>
          <Column headerStyle="width: 8rem" header="PRI" field="comms.radio1">
            <template #body="{ index }">
              {{ selectedPKG.flights[index]?.comms.radio1[index + 14]?.name }}
              {{
                selectedPKG.flights[index]?.comms.radio1[index + 14]?.number ||
                ""
              }}
              <br />{{
                selectedPKG.flights[index]?.comms.radio1[index + 14]?.freq
              }}
            </template>
          </Column>
          <Column headerStyle="width: 8rem" header="SEC" field="comms.radio2">
            <template #body="{ index }">
              {{ selectedPKG.flights[index]?.comms.radio2[index + 14]?.name }}
              {{
                selectedPKG.flights[index]?.comms.radio2[index + 14]?.number ||
                ""
              }}<br />{{
                selectedPKG.flights[index]?.comms.radio2[index + 14]?.freq
              }}</template
            >
          </Column>
          <Column header="FLIGHTLEAD">
            <template #body="{ data }">
              {{ data.units[0]?.callsign }}
            </template>
          </Column>
          <Column headerStyle="width: 4.3rem">
            <template #body="{ index }"
              ><Button
                icon="pi pi-trash"
                severity="danger"
                @click="confirmDelete(index)"
                outlined
            /></template>
          </Column>
          <Column headerStyle="width: 4.3rem">
            <template #body="{ index }"
              ><Button
                icon="pi pi-copy"
                severity=""
                @click="copyFlight(index)"
                outlined
            /></template>
          </Column>
        </DataTable>
      </div>
      <div class="box">
        <p>Situation</p>

        <TextArea
          id="situation"
          class="content"
          style="min-width: 800px; min-height: 250px; max-width: 1100px"
          v-model="selectedPKG.situation"
          :draggable="false"
          rows="5"
        />
      </div>
    </div>

    <div class="container">
      <div class="box">
        <p>Aerial Threats Briefing</p>

        <TextArea
          style="min-width: 800px; max-width: 1100px; min-height: 120px"
          v-model="selectedPKG.airThreat"
          :draggable="false"
          rows="3"
          class="content"
        />
      </div>
      <div class="box">
        <p>Surface Threats Briefing</p>

        <TextArea
          style="min-width: 800px; max-width: 1100px; min-height: 120px"
          v-model="selectedPKG.surfaceThreat"
          :draggable="false"
          rows="3"
          class="content"
        />
      </div>
    </div>
  </div>
  <div class="container">
    <div v-if="selectedPKG.name" class="box">
      <p>Agencies</p>
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
        style="max-width: 1100px"
      >
        <Column header="Add" #body="{ data }" style="width: 5%">
          <Checkbox binary v-model="data.active"></Checkbox>
        </Column>

        <Column header="Name" field="name" />
        <Column header="Freq" field="freq" />
        <Column header="Type" field="type" />
        <!--Column header="activity" field="activity" />-->
        <Column header="TACAN" field="tacan" />
        <Column header="Location"
          ><template #body="{ data }">{{ data.location }}</template></Column
        >
      </DataTable>
      <div>
        <Button
          label="All"
          @click="selectedPKG.agencies.every((a) => (a.active = true))"
          style="margin: 4px"
        />
        <Button
          label="None"
          @click="selectedPKG.agencies.forEach((a) => (a.active = false))"
          style="margin: 4px"
        />
      </div>
    </div>
    <div v-if="selectedPKG.name" class="box">
      <p>Threat Classes</p>
      <DataTable
        :value="threats"
        style="min-width: 600px"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
        showGridlines
      >
        <Column header="Active" #body="{ data }" style="width: 5%">
          <Checkbox binary v-model="data.display"></Checkbox>
        </Column>
        <Column field="class" header="Class" style="width: 45%"
          ><template #body="{ data }">{{ data.class }}</template>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="dor" header="DOR" style="width: 15%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" style="max-width: 50px" fluid />
          </template>
        </Column>
        <Column field="dr" header="DR" style="width: 15%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" style="max-width: 50px" fluid />
          </template>
        </Column>
        <Column field="mar" header="MAR" style="width: 15%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid style="max-width: 50px" />
          </template>
        </Column>
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

      <div class="box">
        <p>Codewords</p>
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
              ><InputText v-model="data[field]"
            /></template>
          </Column>
          <!--<Column header="Criteria" field="criteria" style="width: 25%"
          ><template #body="{ data }">{{ data.criteria }}</template
          ><template #editor="{ data, field }"
            ><InputText v-model="data[field]" /></template
        ></Column>-->
          <!--<Column header="Authority" field="authority" style="width: 25%"
          ><template #body="{ data }">{{ data.authority }}</template
          ><template #editor="{ data, field }"
            ><InputText v-model="data[field]" /></template
        ></Column>-->
          <Column header="Action" field="action" style="width: 25%"
            ><template #body="{ data }">{{ data.action }}</template
            ><template #editor="{ data, field }"
              ><InputText v-model="data[field]" /></template
          ></Column>
        </DataTable>
      </div>
    </div>
    <div>
      <h3 style="line-height: 90%">
        Bullseye locations<br /><a
          style="
            font-weight: 400;
            font-style: italic;
            font-size: 13px;
            margin-top: 0px;
          "
          >(These are package-wide but can be overwritten in the flight's
          settings)</a
        >
      </h3>

      <DataTable
        :value="bullseyes"
        edit-mode="cell"
        show-gridlines
        style="max-width: 1000px; min-width: 800px"
      >
        <Column header="Select" style="width: 3rem">
          <template #body="{ data }">
            <Checkbox
              binary
              :trueValue="data.wp"
              v-model="selectedBullseye"
              :value="selectedBullseye || 0"
              :falseValue="null"
            />
          </template>
        </Column>
        <Column header="STP #" style="width: 5rem" field="wp"></Column>
        <Column header="Name" field="name">
          <template #editor="{ index }"
            ><InputText v-model="bullseyes[index].name" /></template
        ></Column>
        <Column header="Latitude" field="lat">
          <template #body="{ data }">{{
            data.location.toLatString()
          }}</template></Column
        >
        <Column header="Longitde" field="long">
          <template #body="{ data }">{{
            data.location.toLongString()
          }}</template></Column
        >
        <Column header="Note" field="note">
          <template #editor="{ index }">
            <InputText v-model:model-value="bullseyes[index].note" />
          </template>
        </Column>
        <Column>
          <template #body="{ index }"
            ><Button
              @click="deleteBullseye(index)"
              severity="danger"
              outlined
              icon="pi pi-trash"
          /></template>
        </Column>
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
</template>
<script setup lang="ts">
import SteerpointsToDTC from "@/components/DTCExports/steerpointsToDTC.vue";
import { threats, usePackageStore } from "@/stores/packageStore";
import { useGlobalStore } from "@/stores/theatreStore";
import { storeToRefs } from "pinia";
import { ramrods } from "@/config/ramrod";
import { computed, ref, toRaw, type WritableComputedRef } from "vue";

import SelectFlight from "@/components/PackageFlightSelection/SelectFlight.vue";

import { toLatString, toLongString } from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";

const { stateChanged } = storeToRefs(useGlobalStore());

const { packages, selectedPKG } = storeToRefs(usePackageStore());

const deleteThreat = (index: number) => {
  threats.value[index] = {
    display: false,
    class: "",
    dor: null,
    dr: null,
    mar: null,
  };
};
const flightStore = useFlightStore();

const confirmDelete = (index: number) => {
  selectedPKG.value.flights.splice(index, 1);
  selectedPKG.value.flights.forEach((f) => {
    f.comms.radio1.splice(14 + index, 1);
    f.comms.radio2.splice(14 + index, 1);
  });
};

const copyFlight = (index: number) => {
  selectedPKG.value.flights.push(
    structuredClone(toRaw(selectedPKG.value.flights[index]))
  );
  selectedPKG.value.flights[selectedPKG.value.flights.length - 1].callsign =
    "Copy of " + selectedPKG.value.flights[index].callsign;
};

const onRowReorder = (event: any) => {
  selectedPKG.value.flights = event.value;
  flightStore.updateFligh();
};

const onCellEditComplete = (event: any) => {
  let { data, newValue, field } = event;
  data[field] = newValue;
};

const { file } = storeToRefs(useGlobalStore());

const bullseyes = computed(() => {
  return selectedPKG.value.bullseyes;
});

const selectedBullseye: WritableComputedRef<number | null> = computed({
  get(): number | null {
    if (!selectedPKG.value) return null;
    return selectedPKG.value.flights[0].misc.BullseyeWP;
  },

  set(v: number | null) {
    if (!v) return;
    if (selectedPKG.value.flights[0].misc.BullseyeWP)
      selectedPKG.value.flights[0].misc.BullseyeWP = v;
    selectedPKG.value.flights.forEach((n) => (n.misc.BullseyeWP = v));
  },
});

const deleteBullseye = (index: number) => {
  selectedPKG.value.bullseyes.splice(index, 1);
};
</script>
<style scoped>
td > .p-button {
  font-size: 14px;
}

.container {
  display: flex;
  gap: 20px;
  padding-right: 5%;
  flex-wrap: wrap;
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
