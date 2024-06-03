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
import InputMask from "primevue/inputmask"; //@ts-ignore this shouldnt error
import CommsAssignment from "./commsAssignment.vue";
import toDTC from "@/components/commsToDTC.vue";
import {
  commTables,
  isPreset,
  type RadioType,
  type freqNames,
} from "@/config/frequencies";
import { airports, airfieldEmpty } from "@/config/airfields";

function pushRadio(vals: RadioType) {
  // I forgot what I made this for lmao
  let radio = selectedFlight.value.comms[vals.radio][vals.preset + 1];
  if (isPreset(vals)) {
    radio = {
      description: vals.descr,
      freq: commTables[0][vals.name][vals.number - 1],
      name: vals.name,
      number: vals.number + 1,
    };
  } else {
    radio = {
      description: vals.descr,
      freq: vals.freq,
      name: "",
    };
  }
}

const { allFlightsFromPackage, packages } = storeToRefs(usePackageStore());
const { selectedFlight, useDefaults } = storeToRefs(useFlightStore());
const { selectedPKG } = storeToRefs(usePackageStore());
const { updateFligh, updateLadder } = useFlightStore();
const { file, stateChanged } = storeToRefs(useGlobalStore());

function callsignChangeEvent(event: any) {
  if (event.value.callsign) {
    selectedFlight.value.callsign = event.value.callsign;
    selectedFlight.value.callsignNumber = event.value.callsignNumber;
    selectedFlight.value.aircrafttype = event.value.type;
  }
  updateFligh();
  updateLadder();
}

watch(stateChanged, () => {
  {
    updateLadder();
  }
});

function tacaninput() {
  if (!useDefaults.value) return;

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

function clearComms(index: number, radio: "pri" | "sec") {
  if (radio === "pri")
    selectedFlight.value.comms.radio1[index] = {
      description: "",
      freq: "",
      name: "",
    };
  else {
    selectedFlight.value.comms.radio2[index] = {
      description: "",
      freq: "",
      name: "",
    };
  }
}

const depart = ref();
const arr = ref();
const alt = ref();

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

function deleteAirport(type: "DEP" | "ARR" | "ALT") {
  switch (type) {
    case "DEP":
      depart.value = null;
      break;
    case "ARR":
      arr.value = null;
      break;
    case "ALT":
      alt.value = null;
  }

  assignAirport(type, structuredClone(airfieldEmpty));
}

function assignAirport(type: "DEP" | "ARR" | "ALT", ap: (typeof airports)[0]) {
  console.log(ap);

  selectedFlight.value[type] = ap;

  const offset = type === "DEP" ? 1 : type === "ARR" ? 6 : 9;
  const comms = selectedFlight.value.comms;
  if (type === "DEP") {
    comms.radio1[0] = {
      freq: ap.ATIS.uhf,
      description: ap.ATIS.uhf ? ap.ICAO + " " + "ATIS" : "",
      name: "",
    };
    comms.radio2[0] = {
      freq: ap.ATIS.vhf,
      description: ap.ATIS.vhf ? ap.ICAO + " " + "ATIS" : "",
      name: "",
    };
  }

  comms.radio1[offset] = {
    freq: ap.APPR.uhf,
    description: ap.APPR.uhf ? ap.ICAO + " " + "APR" : "",
    name: "",
  };
  comms.radio2[offset] = {
    freq: ap.APPR.vhf,
    description: ap.APPR.vhf ? ap.ICAO + " " + "APR" : "",
    name: "",
  };

  comms.radio1[offset + 1] = {
    freq: ap.TOWER.uhf,
    description: ap.TOWER.uhf ? ap.ICAO + " " + "TWR" : "",
    name: "",
  };
  comms.radio2[offset + 1] = {
    freq: ap.TOWER.vhf,
    description: ap.TOWER.vhf ? ap.ICAO + " " + "TWR" : "",
    name: "",
  };

  comms.radio1[offset + 2] = {
    freq: ap.GROUND.uhf,
    description: ap.GROUND.uhf ? ap.ICAO + " " + "GRND" : "",
    name: "",
  };
  comms.radio2[offset + 2] = {
    freq: ap.GROUND.vhf,
    description: ap.GROUND.vhf ? ap.ICAO + " " + "GRND" : "",
    name: "",
  };
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
  <p class="fitC">Select Flight To Edit</p>
  <Dropdown
    v-model="selectedFlight"
    :options="allFlightsFromPackage"
    optionLabel="callsign"
    style="width: 251px"
    placeholder="Select A Flight"
  />
  <div class="parent" v-if="file && selectedFlight.isActive">
    <Dropdown
      placeholder="select new callsign"
      v-if="!isCustomCalsign && selectedFlight.isActive"
      style="grid-column-start: 1"
      filter
      class="redefSize mcd-s-2 c-height fitC"
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
      style="grid-column-start: 2; text-align: left; height: fit-content"
      v-if="isCustomCalsign"
      class="select mcd-s-1 in mcd-a-0 fitC"
      @blur="updateFligh"
    />
    <InputNumber
      mask="9"
      style="grid-column-start: 3; text-align: left"
      class="select mcd-s-1 c-height in mcd-a-0 fitC"
      v-if="isCustomCalsign && selectedFlight"
      v-model="selectedFlight.callsignNumber"
      @blur="updateFligh"
    />

    <div style="grid-column-start: 1; text-align: left">
      <Checkbox
        v-if="selectedFlight"
        label="Add custom Callsign"
        id="customCheckbox"
        class="c-height"
        v-model="isCustomCalsign"
        :binary="true"
        outlined
      />
      <label for="customCheckbox">custom callsign</label>
      <br />
      <Checkbox
        label="Add custom Callsign"
        id="editDefautls"
        class="c-height"
        v-model="useDefaults"
        :binary="true"
        outlined
      />
      <label for="editDefautls">use defaults</label>
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
        style="width: 5rem; max-width: 5rem"
        header="Callsign"
        field="callsign"
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
        style="width: 5rem; max-width: 5rem"
        field="search"
      >
        <template #body="{ data, field }">
          {{ data[field] }}
        </template>
        <template #editor="{ index }">
          <Input v-model="selectedFlight.units[index].search" /> </template
      ></Column>

      <Column field="STN" header="STN" style="width: 5rem; max-width: 5rem">
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
            :disabled="index > 0 && useDefaults"
            :mask="useDefaults ? '9?*a' : '99?*a'"
            v-model="selectedFlight.units[index].tacan"
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

    <p style="grid-row: 11" class="mcd-s-2 mcd-m-a">COMMS ASSIGNMENT</p>
    <div style="grid-row: 12" class="mcd-s-6 mcd-m-a">
      <CommsAssignment />
    </div>

    <p style="grid-row: 15" class="mcd-s-1 mcd-m-a">DEPART</p>
    <Dropdown
      style="grid-row: 15; color: red"
      :options="airports"
      severity="danger"
      option-label="NAME"
      v-model="depart"
      @change="
        (e) => {
          assignAirport('DEP', e.value);
        }
      "
      placeholder="select"
    />
    <Button
      v-if="depart"
      style="grid-row: 15"
      icon="pi pi-times-circle"
      @click="deleteAirport('DEP')"
      text
    />

    <p style="grid-row: 17" class="mcd-s-1 mcd-m-a">ARRIVE</p>
    <Dropdown
      style="grid-row: 17; color: red"
      :options="airports"
      severity="danger"
      option-label="NAME"
      v-model="arr"
      @change="
        (e) => {
          assignAirport('ARR', e.value);
        }
      "
      placeholder="select"
    />
    <Button
      v-if="arr"
      style="grid-row: 17"
      icon="pi pi-times-circle"
      @click="deleteAirport('ARR')"
      text
    />
    <p style="grid-row: 19" class="mcd-s-1 mcd-m-a">ALTERNATE</p>
    <Dropdown
      style="grid-row: 19; color: red"
      :options="airports"
      severity="danger"
      option-label="NAME"
      v-model="alt"
      @change="
        (e) => {
          assignAirport('ALT', e.value);
        }
      "
      placeholder="select"
    />
    <Button
      v-if="alt"
      style="grid-row: 19"
      icon="pi pi-times-circle"
      @click="deleteAirport('ALT')"
      text
    />
    <p style="grid-row: 21" class="mcd-s-2 mcd-m-a">Edit Waypoints</p>
    <DataTable
      showGridlines
      edit-mode="cell"
      :value="selectedFlight.waypoints"
      class="mcd-s-6 datatable textleft redefSize"
      style="
        grid-row: 22;
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

    <p style="grid-row: 1; grid-column: 7 / span 2" class="mcd-m-a">Radio 1</p>
    <DataTable
      showGridlines
      edit-mode="cell"
      :value="selectedFlight.comms.radio1"
      class="mcd-s-2 datatable textleft redefSize"
      style="
        grid-row: 2 / span 8;
        grid-column: 7 / span 2;
        align-content: left;
        margin-left: 0;
        text-align: left;
      "
    >
      <Column header="#" headerStyle="width: 2rem" style="width: fit-content">
        <template #body="{ index }"> {{ index + 1 }}</template>
      </Column>
      <Column header="Freq" field="freq" headerStyle="width: 2rem">
        <template #body="{ data, index }"> {{ data?.freq }}</template>
        <template #editor="{ data, index }">
          <Input class="fixW" v-model="selectedFlight.comms.radio1[index].freq"
        /></template>
      </Column>
      <Column header="Name" field="name">
        <template #body="{ data }"> {{ data?.name }}</template></Column
      >
      <Column header="n°" field="number">
        <template #body="{ data }"> {{ data?.number }}</template></Column
      >
      <Column header="Description" field="description">
        <template #body="{ data }"> {{ data?.description }}</template></Column
      >
      <Column>
        <template #body="{ index }"
          ><Button
            text
            icon="pi pi-eraser"
            @click="clearComms(index, 'pri')" /></template
      ></Column>
    </DataTable>

    <toDTC style="grid-row: 25; grid-column: 7 / span 2" />

    <p style="grid-row: 1; grid-column: 9 / span 2" class="mcd-m-a">Radio 2</p>
    <DataTable
      showGridlines
      edit-mode="cell"
      :value="selectedFlight.comms.radio2"
      class="mcd-s-2 datatable textleft redefSize"
      style="
        grid-row: 2 / span 8;
        grid-column: 9 / span 2;
        align-content: left;
        margin-left: 0;
        text-align: left;
      "
    >
      <Column header="#">
        <template #body="{ index }"> {{ index + 1 }}</template>
      </Column>
      <Column header="Freq" field="freq">
        <template #body="{ data }"> {{ data?.freq }}</template>
        <template #editor="{ data, index }">
          <Input class="fixW" v-model="selectedFlight.comms.radio1[index].freq"
        /></template>
      </Column>
      <Column header="Name" field="name">
        <template #body="{ data }"> {{ data?.name }}</template></Column
      >
      <Column header="n°" field="number">
        <template #body="{ data }"> {{ data?.number }}</template></Column
      >
      <Column header="Description" field="description">
        <template #body="{ data }"> {{ data?.description }}</template></Column
      >
      <Column>
        <template #body="{ index }"
          ><Button
            text
            icon="pi pi-eraser"
            @click="clearComms(index, 'sec')" /></template
      ></Column>
    </DataTable>
  </div>

  <Button @click="console.log(selectedFlight.units)" />
</template>

<style scoped>
.parent {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.inline {
  display: inline-grid;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.fixW {
  max-width: 100%;
}

.fitC {
  height: fit-content;
}
</style>
