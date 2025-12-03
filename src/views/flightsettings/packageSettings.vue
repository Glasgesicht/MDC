<template>
  <div class="p-4" v-if="file">
    <div class="flex flex-wrap gap-5 pr-[5%]">
      <div class="flex flex-col flex-grow max-w-[250px]">
        <p v-if="selectedPKG.name">Selected Package</p>
        <p v-else>Please select a package to edit first</p>
        <SelectFlight
          v-if="file"
          showPKGSelection
          :showFlightSelection="false"
        />
      </div>
      <div
        v-if="selectedPKG.name"
        class="flex flex-col flex-grow max-w-[250px]"
      >
        <p>Package Name</p>
        <InputText class="h-7" v-model="selectedPKG.name" />
      </div>
      <div
        v-if="selectedPKG.name"
        class="flex flex-col flex-grow max-w-[250px]"
      >
        <p>RAMROD (selected)</p>
        <Select
          :options="ramrods"
          v-model="selectedPKG.ramrod"
          editable
          class="m-1"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-5 pr-[5%] mt-4" v-if="selectedPKG.name">
      <div class="flex flex-col flex-grow max-w-[1100px]">
        <p class="font-medium mb-2">Order Flights In Package</p>

        <DataTable
          :value="selectedPKG.flights"
          showGridlines
          edit-mode="cell"
          @rowReorder="onRowReorder"
          class="min-h-[20px] max-w-[1100px]"
        >
          <Column
            rowReorder
            headerStyle="width: 4rem"
            :reorderableColumn="false"
          />
          <Column header="FLIGHT" headerStyle="width: 10rem">
            <template #body="{ index }">FLIGHT #{{ index + 1 }}</template>
          </Column>
          <Column field="callsign" header="Callsign" key="callsign">
            <template #body="props"
              >{{ props.data.callsign }}
              {{ props.data.callsignNumber }}</template
            >
          </Column>
          <Column headerStyle="width: 6rem" header="Type" field="aircrafttype">
            <template #editor="{ index }">
              <InputText v-model="selectedPKG.flights[index].aircrafttype" />
            </template>
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
              }}
              <br />{{
                selectedPKG.flights[index]?.comms.radio2[index + 14]?.freq
              }}
            </template>
          </Column>
          <Column header="FLIGHTLEAD">
            <template #body="{ data }">{{ data.units[0]?.callsign }}</template>
          </Column>
          <Column headerStyle="width: 4.3rem">
            <template #body="{ index }">
              <Button
                icon="pi pi-trash"
                severity="danger"
                @click="confirmDelete(index)"
                outlined
              />
            </template>
          </Column>
          <Column headerStyle="width: 4.3rem">
            <template #body="{ index }">
              <Button icon="pi pi-copy" @click="copyFlight(index)" outlined />
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="flex flex-col flex-grow">
        <p class="font-medium mb-2">Situation</p>
        <TextArea
          id="situation"
          class="min-w-[800px] min-h-[250px] max-w-[1100px] h-full box-border resize-none"
          v-model="selectedPKG.situation"
          :draggable="false"
          rows="5"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-5 pr-[5%] mt-4">
      <div class="flex flex-col flex-grow">
        <p class="font-medium mb-2">Aerial Threats Briefing</p>
        <TextArea
          class="min-w-[800px] max-w-[1100px] min-h-[120px] h-full box-border resize-none"
          v-model="selectedPKG.airThreat"
          :draggable="false"
          rows="3"
        />
      </div>
      <div class="flex flex-col flex-grow">
        <p class="font-medium mb-2">Surface Threats Briefing</p>
        <TextArea
          class="min-w-[800px] max-w-[1100px] min-h-[120px] h-full box-border resize-none"
          v-model="selectedPKG.surfaceThreat"
          :draggable="false"
          rows="3"
        />
      </div>
    </div>
  </div>

  <div class="flex flex-wrap gap-5 pr-[5%] p-4">
    <div v-if="selectedPKG.name" class="flex flex-col flex-grow">
      <p class="font-medium mb-2">Agencies</p>
      <DataTable
        :value="selectedPKG.agencies"
        editMode="cell"
        showGridlines
        @cell-edit-complete="onCellEditComplete"
        class="max-w-[1100px]"
      >
        <Column header="Add" #body="{ data }" class="w-[5%]">
          <Checkbox binary v-model="data.active" />
        </Column>
        <Column header="Name" field="name" />
        <Column header="Freq" field="freq" />
        <Column header="Type" field="type" />
        <Column header="TACAN" field="tacan" />
        <Column header="Location">
          <template #body="{ data }">{{ data.location }}</template>
        </Column>
      </DataTable>
      <div class="flex gap-1 mt-2">
        <Button
          label="All"
          @click="selectedPKG.agencies.every((a) => (a.active = true))"
        />
        <Button
          label="None"
          @click="selectedPKG.agencies.forEach((a) => (a.active = false))"
        />
      </div>
    </div>

    <div v-if="selectedPKG.name" class="flex flex-col flex-grow">
      <p class="font-medium mb-2">Threat Classes</p>
      <DataTable
        :value="threats"
        class="min-w-[600px] max-w-[1100px]"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
        showGridlines
      >
        <Column header="Active" #body="{ data }" class="w-[5%]">
          <Checkbox binary v-model="data.display" />
        </Column>
        <Column field="class" header="Class" class="w-[45%]">
          <template #body="{ data }">{{ data.class }}</template>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="dor" header="DOR" class="w-[15%]">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" class="max-w-[50px]" fluid />
          </template>
        </Column>
        <Column field="dr" header="DR" class="w-[15%]">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" class="max-w-[50px]" fluid />
          </template>
        </Column>
        <Column field="mar" header="MAR" class="w-[15%]">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid class="max-w-[50px]" />
          </template>
        </Column>
        <Column>
          <template #body="{ index }">
            <Button
              @click="deleteThreat(index)"
              severity="danger"
              link
              class="p-0"
              icon="pi pi-eraser"
            />
          </template>
        </Column>
      </DataTable>

      <div class="flex flex-col flex-grow mt-4">
        <p class="font-medium mb-2">Codewords</p>
        <DataTable
          :value="selectedPKG.codewords"
          editMode="cell"
          showGridlines
          @cell-edit-complete="onCellEditComplete"
          class="w-[900px]"
        >
          <Column header="Name" field="name" class="w-[25%]">
            <template #body="{ data }">{{ data.name }}</template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
            </template>
          </Column>
          <Column header="Action" field="action" class="w-[25%]">
            <template #body="{ data }">{{ data.action }}</template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <div>
      <h3 class="leading-[90%]">
        Bullseye locations<br />
        <span class="font-normal italic text-sm mt-0">
          (These are package-wide but can be overwritten in the flight's
          settings)
        </span>
      </h3>

      <DataTable
        :value="bullseyes"
        edit-mode="cell"
        show-gridlines
        class="max-w-[1000px] min-w-[800px] mt-2"
      >
        <Column header="Select" class="w-12">
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
        <Column header="STP #" class="w-20" field="wp" />
        <Column header="Name" field="name">
          <template #editor="{ index }">
            <InputText v-model="bullseyes[index].name" />
          </template>
        </Column>
        <Column header="Latitude" field="lat">
          <template #body="{ data }">{{
            data.location.toLatString()
          }}</template>
        </Column>
        <Column header="Longitude" field="long">
          <template #body="{ data }">{{
            data.location.toLongString()
          }}</template>
        </Column>
        <Column header="Note" field="note">
          <template #editor="{ index }">
            <InputText v-model:model-value="bullseyes[index].note" />
          </template>
        </Column>
        <Column>
          <template #body="{ index }">
            <Button
              @click="deleteBullseye(index)"
              severity="danger"
              outlined
              icon="pi pi-trash"
            />
          </template>
        </Column>
        <template #footer>
          <div class="flex gap-2">
            <SteerpointsToDTC mode="all" label="all to DTC" />
            <SteerpointsToDTC mode="waypoints" label="waypoints to DTC" />
            <SteerpointsToDTC mode="dmpi" label="DMPI to DTC" />
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import SteerpointsToDTC from "@/components/DTCExports/steerpointsToDTC.vue";
import { threats, usePackageStore } from "@/controller/stores/packageStore";
import { useGlobalStore } from "@/controller/stores/theatreStore";
import { storeToRefs } from "pinia";
import { ramrods } from "@/config/defaults/ramrod";
import { computed, toRaw, type WritableComputedRef } from "vue";

import SelectFlight from "@/components/PackageFlightSelection/SelectFlight.vue";

import { useFlightStore } from "@/controller/stores/flightStore";

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
