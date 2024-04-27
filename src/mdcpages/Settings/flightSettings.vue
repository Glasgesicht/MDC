<script setup lang="ts">
import { flights } from "@/config/flights";
import { rnlaf313members } from "@/config/member";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
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

const { allFlightsFromPackage, packages } = storeToRefs(usePackageStore());
const { selctedFlight } = storeToRefs(useFlightStore());
const { updateFligh } = useFlightStore();
const { file } = storeToRefs(useGlobalStore());

function callsignChangeEvent(event: any) {
  if (event.value.callsign) {
    selctedFlight.value.callsign = event.value.callsign;
    selctedFlight.value.callsignNumber = event.value.callsignNumber;
    selctedFlight.value.aircrafttype = event.value.type;
  }
  updateFligh();
}

function FlightMemberUpdate() {
  selctedFlight.value.units.forEach((unit) => {
    if (unit.callsign.length < 3) return;
    const args = rnlaf313members.find((n) =>
      n.callsign.includes(unit.callsign)
    );
    if (args) {
      unit.tailNr = args.tailnr;
    }
  });
}

const isCustomCalsign = ref(false);
const addFlightMemeber = () => {
  selctedFlight.value.units.push({
    tailNr: undefined,
    callsign: "",
    search: "",
    tacan: "",
    STN: getSTN(
      selctedFlight.value.aircrafttype,
      selctedFlight.value.callsignNumber,
      selctedFlight.value.units.length
    ),
    L16: (() => {
      const callsign = selctedFlight.value.callsign;
      return (
        callsign.charAt(0) +
        callsign.charAt(callsign.length - 1) +
        selctedFlight.value.callsignNumber +
        (selctedFlight.value.units.length + 1)
      );
    })(),
  });
};

function deleteWaypoint(i: number) {
  selctedFlight.value.waypoints.splice(i, 1);
}

function deleteMember(i: number) {
  selctedFlight.value.units.splice(i, 1);

  selctedFlight.value.units.map((n, i) => {
    (n.callsign = n.callsign),
      (n.tailNr = n.tailNr),
      (n.STN = n.STN.substring(0, n.STN.length - 1) + (i + 1));
    n.L16 = n.L16.substring(0, n.L16.length - 1) + (i + 1);
  });
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
      v-model="selctedFlight"
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
      v-model="selctedFlight.callsign"
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
      v-model="selctedFlight.callsignNumber"
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
      :value="selctedFlight.units"
      showGridlines
      @cell-edit-complete="FlightMemberUpdate"
      style="
        grid-row: 5 / span 3;
        align-content: left;
        margin-left: 0;
        text-align: left;
        grid-column: 1 / span 4;
      "
      edit-mode="cell"
    >
      <Column header="n°" headerStyle="width: 4rem"
        ><template #body="{ index }">#{{ index + 1 }}</template></Column
      >
      <Column
        header="Callsign"
        field="callsign"
        style="max-width: 30%; width: 30%; max-height: fit-content"
      >
        <template #body="{ data, field }">
          {{ data[field] }}
        </template>
        <template #editor="{ data, field, index }">
          <Dropdown
            editable
            class="redefSize"
            :options="_313ref"
            v-model="selctedFlight.units[index].callsign"
            autofocus
          />
        </template>
      </Column>

      <Column field="STN" header="STN">
        <template #editor="{ index }">
          <Input :model-value="selctedFlight.units[index].STN" /></template
      ></Column>
      <Column field="tailNr" header="TailNr" />
      <Column field="L16" header="L16" />
      <Column style="min-width: 22px; width: 22px">
        <template #header><i icon="pi pi-trash" /> ></template>
        <template #body="{ index }"
          ><Button
            :disabled="selctedFlight.units.length < 2"
            @click="deleteMember(index)"
            severity="danger"
            outlined
            icon="pi pi-trash" /></template
      ></Column>

      <template #footer
        ><Button
          v-if="selctedFlight.units[0] && selctedFlight.units.length < 4"
          label="Add member to flight"
          @click="addFlightMemeber"
      /></template>
    </DataTable>

    <p style="grid-row: 12" class="mcd-s-2 mcd-m-a">Edit Waypoints</p>
    <DataTable
      showGridlines
      :value="selctedFlight.waypoints"
      class="mcd-s-6 datatable textleft redefSize"
      style="
        grid-row: 13 / span 8;
        align-content: left;
        margin-left: 0;
        text-align: left;
      "
    >
      <Column field="waypointNr" header="n°"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="activity" header="Activity"></Column>
      <Column field="tot" header="Time on Target"></Column>
      <Column field="type" header="Type"></Column>
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
