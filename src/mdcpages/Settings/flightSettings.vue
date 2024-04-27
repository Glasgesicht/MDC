<script setup lang="ts">
import { flights } from "@/config/flights";
import { rnlaf313members } from "@/config/member";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useGlobalStore } from "@/stores/theatreStore";

import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";

import Input from "primevue/inputtext";
import Column from "primevue/column";
import { getSTN } from "@/utils/utilFunctions";
import { template } from "lodash";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputMask from "primevue/inputmask";

const { allFlightsFromPackage, packages } = storeToRefs(usePackageStore());
const { selectedFlight } = storeToRefs(useFlightStore());
const { updateFligh } = useFlightStore();
const { file } = storeToRefs(useGlobalStore());

function callsignChangeEvent(event: any) {
  if (event.value.callsign) {
    selectedFlight.value.callsign = event.value.callsign;
    selectedFlight.value.callsignNumber = event.value.callsignNumber;
    selectedFlight.value.aircrafttype = event.value.type;
  }
  updateFligh();
}

watch(selectedFlight, () => {});

function tacaninput() {
  const match = selectedFlight.value.units[0].tacan.match(/(\d{1,2})([YX])/);
  if (match && match[2]) {
    if (selectedFlight.value.units[1])
      selectedFlight.value.units[1].tacan =
        ((parseInt(match[1]) + 63) % 126) + match[2];
    if (selectedFlight.value.units[2])
      selectedFlight.value.units[2].tacan =
        ((parseInt(match[1]) + 63) % 126) + "" + (match[2] === "Y" ? "X" : "Y");
    if (selectedFlight.value.units[3])
      selectedFlight.value.units[3].tacan =
        parseInt(match[1]) + "" + (match[2] === "Y" ? "X" : "Y");
  }
}

function FlightMemberUpdate() {
  selectedFlight.value.units.forEach((unit) => {
    if (!unit.callsign) return;
    if (unit.callsign.length < 3) return;
    const args = rnlaf313members.find((n) =>
      n.callsign.includes(unit.callsign)
    );
    if (args) {
      unit.tailNr = args.tailnr;
    }
  }); // corrects TACAN assignment
  tacaninput();
}

const isCustomCalsign = ref(false);
const addFlightMemeber = () => {
  selectedFlight.value.units.push({
    tailNr: undefined,
    callsign: "",
    search: "",
    laser: "",
    m2: "",
    tacan: "",
    STN: getSTN(
      selectedFlight.value.aircrafttype,
      selectedFlight.value.callsignNumber,
      selectedFlight.value.units.length
    ),
    L16: (() => {
      const callsign = selectedFlight.value.callsign;
      return (
        callsign.charAt(0) +
        callsign.charAt(callsign.length - 1) +
        selectedFlight.value.callsignNumber +
        (selectedFlight.value.units.length + 1)
      );
    })(),
  }); // adds TACAN
  tacaninput();
};

function deleteWaypoint(i: number) {
  selectedFlight.value.waypoints.splice(i, 1);
}

function deleteMember(i: number) {
  selectedFlight.value.units.splice(i, 1);

  selectedFlight.value.units.map((n, i) => {
    (n.callsign = n.callsign),
      (n.tailNr = n.tailNr),
      (n.STN = n.STN.substring(0, n.STN.length - 1) + (i + 1));
    n.L16 = n.L16.substring(0, n.L16.length - 1) + (i + 1);
  }); // corrects TACAN
  tacaninput();
}

const _313ref = ref(rnlaf313members.map((n) => n.callsign));

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
  <div class="parent" v-if="file">
    <p class="mcd-s-2 mcd-m-a">Select Flight To Edit</p>
    <Dropdown
      v-model="selectedFlight"
      :options="allFlightsFromPackage"
      optionLabel="callsign"
      placeholder="Select A Flight"
      class="redefSize mcd-s-2 c-height"
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
      v-if="!isCustomCalsign"
      style="grid-row: 2"
      filter
      class="redefSize mcd-s-2 c-height"
      :options="groupedFlights"
      optionLabel="callsign"
      optionGroupLabel="label"
      optionGroupChildren="items"
      @change="callsignChangeEvent"
    >
      <!-- -->
      <template #optiongroup="slotProps">
        <div class="flex align-items-center">
          <div>{{ slotProps.option.label }}</div>
        </div>
      </template></Dropdown
    >

    <InputText
      v-model="selectedFlight.callsign"
      style="grid-row: 2; text-align: left; height: fit-content"
      v-if="isCustomCalsign"
      class="select mcd-s-1 in mcd-a-0"
      @blur="updateFligh"
    />
    <InputNumber
      mask="9"
      style="grid-row: 2; text-align: left"
      class="select mcd-s-1 c-height in mcd-a-0"
      v-if="isCustomCalsign"
      v-model="selectedFlight.callsignNumber"
      @blur="updateFligh"
    />

    <div style="grid-row: 2; text-align: left">
      <Checkbox
        label="Add custom Callsign"
        id="customCheckbox"
        class="c-height"
        v-model="isCustomCalsign"
        :binary="true"
        outlined
      />
      <label for="customCheckbox">custom callsign</label>
    </div>

    <p style="grid-row: 4 / span 1" class="mcd-s-2 mcd-m-a">
      Member in selected Flight
    </p>
    <DataTable
      class="mcd-s-3 datatable textleft redefSize"
      :value="selectedFlight.units"
      showGridlines
      style="
        grid-row: 5 / span 3;
        align-content: left;
        margin-left: 0;
        text-align: left;
        grid-column: 1 / span 4;
      "
      edit-mode="cell"
    >
      <Column header="n°" headerStyle="width: 3rem"
        ><template #body="{ index }">#{{ index + 1 }}</template></Column
      >
      <Column
        headerStyle="width: 10rem"
        header="Callsign"
        field="callsign"
        style="max-height: fit-content"
      >
        <template #body="{ data, field }">
          {{ data[field] }}
        </template>
        <template #editor="{ data, field, index }">
          <Dropdown
            editable
            @change="FlightMemberUpdate"
            class="redefSize"
            :options="_313ref"
            v-model="selectedFlight.units[index].callsign"
            autofocus
          />
        </template>
      </Column>
      <Column
        header="Search"
        field="search"
        headerStyle="min-width: 10rem;max-width: 10rem;"
        style="max-height: fit-content"
      >
        <template #body="{ data, field }">
          {{ data[field] }}
        </template>
        <template #editor="{ index }">
          <Input v-model="selectedFlight.units[index].search" /> </template
      ></Column>

      <Column
        field="STN"
        header="STN"
        headerStyle="width: 4rem"
        style="max-height: fit-content"
      >
        <template #body="{ data, field }">
          {{ data[field] }}
        </template>
        <template #editor="{ index }">
          <InputMask
            mask="9?99999"
            :autoClear="false"
            v-model="selectedFlight.units[index].STN" /></template
      ></Column>
      <Column
        field="tailNr"
        header="TailNr"
        headerStyle="max-width: 4rem"
        style="max-height: fit-content"
      >
        <template #body="{ data, field }">
          {{ data[field] }}
        </template>
        <template #editor="{ index }">
          <Input v-model="selectedFlight.units[index].tailNr" /> </template
      ></Column>
      <Column
        field="L16"
        header="L16"
        headerStyle="max-width: 4rem"
        style="max-height: fit-content"
      />
      <Column
        field="tacan"
        header="TACAN"
        headerStyle="max-width: 4rem"
        style="max-height: fit-content"
      >
        <template #editor="{ index }">
          <InputMask
            mask="9?9a"
            v-model="selectedFlight.units[0].tacan"
            v-if="index === 0"
            @complete="tacaninput"
        /></template>
      </Column>

      <Column
        field="laser"
        header="Laser"
        headerStyle="max-width: 4rem"
        style="max-height: fit-content"
      >
        <template #body="{ data, field }">
          {{ data[field] }}
        </template>
        <template #editor="{ index }">
          <InputMask
            mask="9999"
            v-model="selectedFlight.units[index].laser"
          /> </template
      ></Column>

      <Column headerStyle="width: 2rem" style="max-height: fit-content">
        <template #header><i icon="pi pi-trash" /> ></template>
        <template #body="{ index }"
          ><Button
            :disabled="selectedFlight.units.length < 2"
            @click="deleteMember(index)"
            severity="danger"
            outlined
            icon="pi pi-trash" /></template
      ></Column>

      <template #footer
        ><Button
          v-if="selectedFlight.units[0] && selectedFlight.units.length < 4"
          label="Add member to flight"
          @click="addFlightMemeber"
      /></template>
    </DataTable>

    <p style="grid-row: 12" class="mcd-s-2 mcd-m-a">Edit Waypoints</p>
    <DataTable
      showGridlines
      edit-mode="cell"
      :value="selectedFlight.waypoints"
      class="mcd-s-6 datatable textleft redefSize"
      style="
        grid-row: 13 / span 8;
        align-content: left;
        margin-left: 0;
        text-align: left;
      "
    >
      <Column field="waypointNr" header="n°"></Column>
      <Column field="name" header="Name"
        ><template #editor="{ index }">
          <Input v-model="selectedFlight.waypoints[index].name" /></template
      ></Column>
      <Column field="type" header="Type">
        <template #editor="{ index }">
          <Input v-model="selectedFlight.waypoints[index].type" /></template
      ></Column>
      <Column field="activity" header="Activity"></Column>
      <Column field="tot" header="Time on Target"></Column>

      <Column field="mach" header="Mach"></Column>
      <Column field="groundspeed" header="Groundspeed"></Column>
      <Column field="altitude" header="Altitude"></Column>
      <Column>
        <template #body="{ index }"
          ><Button
            @click="deleteWaypoint(index)"
            severity="danger"
            outlined
            icon="pi pi-trash" /></template
      ></Column>
    </DataTable>
  </div>

  <Button @click="console.log(selectedFlight.units)" />
</template>

<style scoped>
.in * {
  max-width: -moz-available;
  padding: 0 0;
  border: 0 0;
  margin: auto;
}
.in {
  padding: 0 0;
  border: 0 0;
  margin: auto;
  max-width: -moz-available;
}
</style>
