<script setup lang="ts">
import { flights } from "@/config/flights";
import { rnlaf313members } from "@/config/member";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import { computed, ref, watch, type Ref } from "vue";
import { useGlobalStore } from "@/stores/theatreStore";

import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";

import Column from "primevue/column";
import { getSTN } from "@/utils/utilFunctions";
import { template } from "lodash";
import Input from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputMask from "primevue/inputmask"; //@ts-ignore this shouldnt error
import CommsAssignment from "./commsAssignment.vue";
import toDTC from "@/components/commsToDTC.vue";
import { commTables, tacticalFreqs } from "@/config/frequencies";
import { airports, airfieldEmpty } from "@/config/airfields";
import type { WritableComputedRef } from "vue";

const { allFlightsFromPackage, packages } = storeToRefs(usePackageStore());
const { selectedFlight, useDefaults } = storeToRefs(useFlightStore());
const { agencies } = storeToRefs(usePackageStore());
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

const tanker: WritableComputedRef<
  | {
      name: string;
      freq: string;
      type: string;
      activity: string;
      tacan: string;
      lat: string;
      lon: string;
      alt: string;
    }
  | undefined
> = computed({
  get() {
    return agencies.value.find(
      (n) =>
        selectedFlight.value.comms.radio1[12].freq === n.freq ||
        selectedFlight.value.comms.radio2[12].freq === n.freq
    );
  },

  set(value) {
    if (!value) return;
    const assignTo = parseFloat(value.freq) > 200 ? "radio1" : "radio2";

    selectedFlight.value.comms[assignTo][12] = {
      description: value.name + " / " + value.tacan,
      freq: value.freq,
      name:
        Object.entries(commTables[0]).find(([name, freqs]) =>
          freqs.find((freq: string) => freq === value!.freq)
        )?.[0] || "",
      number:
        (Object.entries(commTables[0])
          .find(([name, freqs]) =>
            freqs.find((freq: string) => freq === value!.freq)
          )?.[1]
          .map((el) => el + "")
          .indexOf(value?.freq) || 0) + 1,
    };
  },
});

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

const selectedFreqs = computed(() => {
  return {
    checkVHF: selectedFlight.value.comms.radio2[4],
    checkUHF: selectedFlight.value.comms.radio1[4],
    tactVHF: selectedFlight.value.comms.radio2[5],
    tactUHF: selectedFlight.value.comms.radio1[5],
  };
});

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
      selectedFlight.value.callsign,
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
  assignAirport(type, structuredClone(airfieldEmpty));
}

function assignAirport(type: "DEP" | "ARR" | "ALT", ap: (typeof airports)[0]) {
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

  comms.radio1[offset + (type === "DEP" ? 2 : 0)] = {
    freq: ap.APPR.uhf,
    description: ap.APPR.uhf ? ap.ICAO + " " + "APR" : "",
    name: "",
  };
  comms.radio2[offset + (type === "DEP" ? 2 : 0)] = {
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

  comms.radio1[offset + (type === "DEP" ? 0 : 2)] = {
    freq: ap.GROUND.uhf,
    description: ap.GROUND.uhf ? ap.ICAO + " " + "GRND" : "",
    name: "",
  };
  comms.radio2[offset + (type === "DEP" ? 0 : 2)] = {
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
  <div style="display: block">
    <p class="">Select Flight To Edit</p>
    <br />
    <Dropdown
      v-model="selectedFlight"
      :options="allFlightsFromPackage"
      optionLabel="callsign"
      style="width: 253px"
      placeholder="Select A Flight"
    />

    <Dropdown
      placeholder="select new callsign"
      v-if="!isCustomCalsign && selectedFlight.isActive"
      filter
      :options="groupedFlights"
      optionLabel="callsign"
      style="width: 253px"
      optionGroupLabel="label"
      optionGroupChildren="items"
      @change="callsignChangeEvent"
    >
      <!-- -->
      <template #optiongroup="slotProps">
        <div>{{ slotProps.option.label }}</div>
      </template></Dropdown
    >
  </div>
  <div class="parent" v-if="file && selectedFlight.isActive">
    <Input
      v-model="selectedFlight.callsign"
      style="grid-column: 1 / span 1; text-align: left"
      v-if="isCustomCalsign"
      class="select mcd-s-1 c-height in mcd-a-0 fitC"
      @blur="updateFligh"
    />
    <InputNumber
      mask="9"
      style="grid-column-start: 2 / span 1; text-align: left"
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

    <p style="grid-row: 3 / span 1" class="mcd-s-2 mcd-m-a">
      Member in selected Flight
    </p>
    <DataTable
      class="mcd-s-4 datatable textleft redefSize"
      :value="selectedFlight.units"
      showGridlines
      style="
        grid-row: 4 / span 4;
        align-content: left;
        margin-left: 0;
        text-align: left;
        grid-column: 1 / span 5;
      "
      edit-mode="cell"
    >
      <Column header="n°" headerStyle="width: 3rem"
        ><template #body="{ index }">#{{ index + 1 }}</template></Column
      >
      <Column
        style="width: 8rem; max-width: 8rem"
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
    <div style="grid-row: 12" class="mcd-s-4 mcd-m-a">
      <CommsAssignment />
    </div>

    <p style="grid-row: 15" class="mcd-s-1 mcd-m-a">DEPART</p>
    <Dropdown
      style="grid-row: 15; color: red"
      :options="airports"
      severity="danger"
      option-label="NAME"
      v-model="selectedFlight.DEP"
      @change="
        (e) => {
          assignAirport('DEP', e.value);
        }
      "
      placeholder="select"
    />
    <Button
      v-if="selectedFlight.DEP.ICAO"
      style="grid-row: 15"
      icon="pi pi-times-circle"
      @click="deleteAirport('DEP')"
      text
    />

    <p style="grid-row: 16" class="mcd-s-1 mcd-m-a">ARRIVE</p>
    <Dropdown
      style="grid-row: 16; color: red"
      :options="airports"
      severity="danger"
      option-label="NAME"
      v-model="selectedFlight.ARR"
      @change="
        (e) => {
          assignAirport('ARR', e.value);
        }
      "
      placeholder="select"
    />
    <Button
      v-if="selectedFlight.ARR.ICAO"
      style="grid-row: 16"
      icon="pi pi-times-circle"
      @click="deleteAirport('ARR')"
      text
    />
    <p style="grid-row: 17" class="mcd-s-1 mcd-m-a">ALTERNATE</p>
    <Dropdown
      style="grid-row: 17; color: red"
      :options="airports"
      severity="danger"
      option-label="NAME"
      v-model="selectedFlight.ALT"
      @change="
        (e) => {
          assignAirport('ALT', e.value);
        }
      "
      placeholder="select"
    />
    <Button
      style="grid-row: 17"
      v-if="selectedFlight.ALT.ICAO"
      icon="pi pi-times-circle"
      @click="deleteAirport('ALT')"
      text
    />

    <p style="grid-row: 19" class="mcd-s-1 mcd-m-a">CHECK-IN UHF</p>
    <Dropdown
      style="grid-row: 19; color: red"
      :options="tacticalFreqs.filter((n) => parseFloat(n.freq) > 200)"
      severity="danger"
      option-label="description"
      :model-value="selectedFreqs.checkUHF"
      @change="
        (e) => {
          selectedFlight.comms.radio1[4] = {
            description: e.value.description,
            freq: e.value.freq,
            name: e.value.name,
            number: e.value.number ?? NaN,
          };
        }
      "
      placeholder="select"
    />
    <Button
      v-if="selectedFlight.comms.radio1[4].freq"
      style="grid-row: 19; grid-column: 3"
      icon="pi pi-times-circle"
      @click="clearComms(4, 'pri')"
      text
    />

    <p style="grid-row: 19; grid-column: 3" class="mcd-s-1 mcd-m-a">
      CHECK-IN VHF
    </p>
    <Dropdown
      style="grid-row: 19; color: red"
      :options="tacticalFreqs.filter((n) => parseFloat(n.freq) < 200)"
      severity="danger"
      v-model="selectedFreqs.checkVHF"
      option-label="description"
      @change="
        (e) => {
          selectedFlight.comms.radio2[4] = {
            description: e.value.description,
            freq: e.value.freq,
            name: e.value.name,
            number: e.value.number ?? NaN,
          };
        }
      "
      placeholder="select"
    />
    <Button
      v-if="selectedFlight.comms.radio2[4].freq"
      style="grid-row: 19"
      icon="pi pi-times-circle"
      @click="clearComms(4, 'sec')"
      text
    />

    <p style="grid-row: 20" class="mcd-s-1 mcd-m-a">TACTICAL UHF</p>
    <Dropdown
      style="grid-row: 20; color: red"
      :options="tacticalFreqs.filter((n) => parseFloat(n.freq) > 200)"
      severity="danger"
      v-model="selectedFreqs.tactUHF"
      option-label="description"
      @change="
        (e) => {
          selectedFlight.comms.radio1[5] = {
            description: e.value.description,
            freq: e.value.freq,
            name: e.value.name,
            number: e.value.number ?? NaN,
          };
        }
      "
      placeholder="select"
    />
    <Button
      v-if="selectedFlight.comms.radio1[5].freq"
      style="grid-row: 20; grid-column: 3"
      icon="pi pi-times-circle"
      @click="clearComms(5, 'pri')"
      text
    />

    <p style="grid-row: 20; grid-column: 3" class="mcd-s-1 mcd-m-a">
      TACTICAL VHF
    </p>
    <Dropdown
      style="grid-row: 20; color: red"
      :options="tacticalFreqs.filter((n) => parseFloat(n.freq) < 200)"
      severity="danger"
      v-model="selectedFreqs.tactVHF"
      option-label="description"
      @change="
        (e) => {
          selectedFlight.comms.radio2[5] = {
            description: e.value.description,
            freq: e.value.freq,
            name: e.value.name,
            number: e.value.number ?? NaN,
          };
        }
      "
      placeholder="select"
    />
    <Button
      v-if="selectedFlight.comms.radio2[5].freq"
      style="grid-row: 20"
      icon="pi pi-times-circle"
      @click="clearComms(5, 'sec')"
      text
    />

    <p style="grid-row: 22" class="mcd-s-1 mcd-m-a">TANKER</p>
    <Dropdown
      style="grid-row: 22; color: red"
      :options="
        agencies
          .filter((ag) => ['KC-135', 'KC135MPRS', 'KC130'].includes(ag.type))
          .sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0))
      "
      severity="danger"
      v-model="tanker"
      option-label="name"
      @change="
        (e) => {
          tanker = e.value;
        }
      "
      placeholder="select"
    />
    <Button
      v-if="tanker"
      style="grid-row: 22"
      icon="pi pi-times-circle"
      @click="clearComms(12, parseFloat(tanker.freq) > 200 ? 'pri' : 'sec')"
      text
    />

    <p style="grid-row: 27" class="mcd-s-2 mcd-m-a">Edit Waypoints</p>
    <DataTable
      showGridlines
      edit-mode="cell"
      :value="selectedFlight.waypoints"
      class="mcd-s-6 datatable textleft redefSize"
      style="
        grid-row: 28;
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

    <p style="grid-row: 1; grid-column: 6 / span 1" class="mcd-m-a">Radio 1</p>
    <DataTable
      showGridlines
      edit-mode="cell"
      :value="selectedFlight.comms.radio1"
      class="mcd-s-2 datatable textleft redefSize"
      style="
        grid-row: 2 / span 8;
        grid-column: 6 / span 3;
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
        <template #body="{ data }"> {{ data?.name }}</template>
        <template #editor="{ data, index }">
          <Input
            class="fixW"
            v-model="selectedFlight.comms.radio1[index].name" /></template
      ></Column>

      <Column header="n°" field="number">
        <template #body="{ data }"> {{ data?.number || null }}</template>
        <template #editor="{ data, index }">
          <InputNumber
            class="fixW"
            v-model="selectedFlight.comms.radio1[index].number" /></template
      ></Column>
      <Column header="Description" field="description">
        <template #body="{ data }"> {{ data?.description }}</template>
        <template #editor="{ data, index }">
          <Input
            class="fixW"
            v-model="
              selectedFlight.comms.radio1[index].description
            " /></template
      ></Column>
      <Column>
        <template #body="{ index }"
          ><Button
            text
            icon="pi pi-eraser"
            @click="clearComms(index, 'pri')" /></template
      ></Column>
    </DataTable>

    <toDTC style="grid-row: 25; grid-column: 9 / span 1" />
    <Button
      style="grid-row: 25; grid-column: 10 / span 1"
      label="update Ladder"
      @click="
        updateLadder();
        updateFligh();
      "
    />

    <p style="grid-row: 1; grid-column: 9 / span 1" class="mcd-m-a">Radio 2</p>
    <DataTable
      showGridlines
      edit-mode="cell"
      :value="selectedFlight.comms.radio2"
      class="mcd-s-2 datatable textleft redefSize"
      style="
        grid-row: 2 / span 8;
        grid-column: 9 / span 3;
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
          <Input class="fixW" v-model="selectedFlight.comms.radio2[index].freq"
        /></template>
      </Column>
      <Column header="Name" field="name">
        <template #body="{ data }"> {{ data?.name }}</template>
        <template #editor="{ data, index }">
          <Input
            class="fixW"
            v-model="selectedFlight.comms.radio2[index].name" /></template
      ></Column>
      <Column header="n°" field="number">
        <template #body="{ data }"> {{ data?.number || null }}</template>
        <template #editor="{ data, index }">
          <InputNumber
            class="fixW"
            v-model="selectedFlight.comms.radio2[index].number" /></template
      ></Column>
      <Column header="Description" field="description">
        <template #body="{ data }"> {{ data?.description }}</template>
        <template #editor="{ data, index }">
          <Input
            class="fixW"
            v-model="
              selectedFlight.comms.radio2[index].description
            " /></template
      ></Column>
      <Column>
        <template #body="{ index }"
          ><Button
            text
            icon="pi pi-eraser"
            @click="clearComms(index, 'sec')" /></template
      ></Column>
    </DataTable>
  </div>
  {{ selectedFlight }}
</template>

<style scoped>
* {
  padding: 0 0;
  margin: 0 0;
}
.parent {
  display: inline-grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(69, minmax(auto, 26px));
  gap: 4px;
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

* {
  padding: 0 0;
}

.c-height {
  height: auto;
  width: auto;
}
</style>
