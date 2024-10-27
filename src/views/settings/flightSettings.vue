<script setup lang="ts">
import { flights } from "@/config/flights";
import { rnlaf313members } from "@/config/member";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import { computed, ref, watch, type Ref } from "vue";
import { useGlobalStore } from "@/stores/theatreStore";

import SelectFlight from "@/components/PackageFlightSelection/SelectFlight.vue";

import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import Input from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputMask from "primevue/inputmask";
import TextArea from "primevue/textarea";

import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

import { getSTN } from "@/utils/utilFunctions";

import toDTC from "@/components/DTCExports/commsToDTC.vue";
import { commTables, tacticalFreqs } from "@/config/frequencies";
import { airports, airfieldEmpty } from "@/config/airfields";
import type { WritableComputedRef } from "vue";
import type { Coordinate } from "@/controller/coordinates";

/**
 * Misc
 */
const enableBullz = ref(true);

const packageStore = usePackageStore();
const { packages, selectedPKG } = storeToRefs(packageStore);
const useDefaults = ref(true);

const flightStore = useFlightStore();
const { getFlight } = storeToRefs(flightStore);
const { file, stateChanged, theatre, missionStartTime } = storeToRefs(
  useGlobalStore()
);

function callsignChangeEvent(event: any) {
  if (event.value.callsign) {
    getFlight.value.callsign = event.value.callsign;
    getFlight.value.callsignNumber = event.value.callsignNumber;
    getFlight.value.aircrafttype = event.value.type;
  }
  flightStore.updateFligh();
}

// @ts-ignore
const tanker: WritableComputedRef<
  | {
      name: string;
      freq: string;
      type: string;
      activity: string;
      tacan: string;
      location: Coordinate;
    }
  | undefined
> = computed({
  get() {
    return selectedPKG.value.agencies.find(
      (n) =>
        getFlight.value.comms.radio1[12].freq === n.freq ||
        getFlight.value.comms.radio2[12].freq === n.freq
    );
  },

  set(value) {
    if (!value) return;
    const assignTo = parseFloat(value.freq) > 200 ? "radio1" : "radio2";

    getFlight.value.comms[assignTo][12] = {
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

function tacaninput() {
  if (!useDefaults.value) return;

  const match = getFlight.value.units[0].tacan.match(/(\d{1,2})([YX])/);
  if (match && match[2]) {
    if (getFlight.value.units[1])
      getFlight.value.units[1].tacan =
        ((parseInt(match[1]) + 63) % 126) + match[2];
    if (getFlight.value.units[2])
      getFlight.value.units[2].tacan =
        ((parseInt(match[1]) + 63) % 126) + "" + (match[2] === "Y" ? "X" : "Y");
    if (getFlight.value.units[3])
      getFlight.value.units[3].tacan =
        parseInt(match[1]) + "" + (match[2] === "Y" ? "X" : "Y");
  }
}

function clearComms(index: number, radio: "pri" | "sec") {
  if (radio === "pri")
    getFlight.value.comms.radio1[index] = {
      description: "",
      freq: "",
      name: "",
    };
  else {
    getFlight.value.comms.radio2[index] = {
      description: "",
      freq: "",
      name: "",
    };
  }
}

const selectedFreqs = computed(() => {
  return {
    checkVHF: getFlight.value.comms.radio2[4],
    checkUHF: getFlight.value.comms.radio1[4],
    tactVHF: getFlight.value.comms.radio2[5],
    tactUHF: getFlight.value.comms.radio1[5],
  };
});

function FlightMemberUpdate() {
  getFlight.value.units.forEach((unit) => {
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
  getFlight.value.units.push({
    tailNr: undefined,
    callsign: "",
    search: "",
    laser: "",
    m2: "",
    tacan: "",
    STN: getSTN(
      getFlight.value.aircrafttype,
      getFlight.value.callsign,
      getFlight.value.callsignNumber,
      getFlight.value.units.length
    ),
    L16: (() => {
      const callsign = getFlight.value.callsign;
      return (
        callsign.charAt(0) +
        callsign.charAt(callsign.length - 1) +
        getFlight.value.callsignNumber +
        (getFlight.value.units.length + 1)
      );
    })(),
  }); // adds TACAN
  tacaninput();
};

function deleteMember(i: number) {
  getFlight.value.units.splice(i, 1);

  getFlight.value.units.map((n, i) => {
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
  getFlight.value[type] = ap;

  const offset = type === "DEP" ? 1 : type === "ARR" ? 6 : 9;
  const comms = getFlight.value.comms;
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
  <div class="parent" style="max-width: 2000px">
    <div class="">
      <p class="" v-if="file && getFlight.isActive">Select Flight To Edit</p>
      <p class="" v-else>Please select a flight first</p>
      <SelectFlight
        v-if="file"
        showFlightSelection
        :show-p-k-g-selection="false"
      />
    </div>
    <div class="" v-if="file && getFlight.isActive">
      <p class="">Assign new Callsign</p>
      <Dropdown
        placeholder="select new callsign"
        v-if="!isCustomCalsign && getFlight.isActive"
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
        </template>
      </Dropdown>
      <div
        v-if="isCustomCalsign && getFlight"
        class="parent"
        style="max-width: 250px"
      >
        <Input v-model="getFlight.callsign" @blur="flightStore.updateFligh()" />
        <InputNumber
          :min="1"
          :max="9"
          v-model="getFlight.callsignNumber"
          class="fixW"
          style="max-width: 75px; margin-left: 5px"
          @blur="useFlightStore().updateFligh()"
        />
      </div>
    </div>
    <div
      style="text-align: left; margin-top: 14px; width: 200px"
      class="parent"
      v-if="file && getFlight.isActive"
    >
      <div class="">
        <Checkbox
          v-if="getFlight"
          label="Add custom Callsign"
          id="customCheckbox"
          v-model="isCustomCalsign"
          :binary="true"
          outlined
        />
        <label for="customCheckbox" class="">Use Custom Callsign</label>
      </div>
      <div class="">
        <Checkbox
          label="Add custom Callsign"
          id="editDefautls"
          v-model="useDefaults"
          :binary="true"
          outlined
        />
        <label class="" for="editDefautls">Use Defaults</label>
      </div>
    </div>
  </div>

  <TabView v-if="file && getFlight.isActive" style="margin-top: 10px">
    <TabPanel header="Common Settings">
      <div class="">
        <p>Member in selected Flight</p>
        <DataTable
          :value="getFlight.units"
          showGridlines
          edit-mode="cell"
          style="width: 800px"
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
                v-model="getFlight.units[index].callsign"
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
              <Input v-model="getFlight.units[index].search" />
            </template>
          </Column>

          <Column field="STN" header="STN" style="width: 5rem; max-width: 5rem">
            <template #body="{ data, field }">
              {{ data[field] }}
            </template>
            <template #editor="{ index }">
              <InputMask
                mask="9?99999"
                :autoClear="false"
                v-model="getFlight.units[index].STN"
              />
            </template>
          </Column>
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
              <Input v-model="getFlight.units[index].tailNr" />
            </template>
          </Column>
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
                v-model="getFlight.units[index].tacan"
                @complete="tacaninput"
              />
            </template>
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
              <InputMask mask="9999" v-model="getFlight.units[index].laser" />
            </template>
          </Column>

          <Column headerStyle="width: 2rem" style="max-height: fit-content">
            <template #header><i icon="pi pi-trash" /> ></template>
            <template #body="{ index }"
              ><Button
                :disabled="getFlight.units.length < 2"
                @click="deleteMember(index)"
                severity="danger"
                outlined
                icon="pi pi-trash"
            /></template>
          </Column>

          <template #footer
            ><Button
              v-if="getFlight.units[0] && getFlight.units.length < 4"
              label="Add member to flight"
              @click="addFlightMemeber"
          /></template>
        </DataTable>
      </div>
    </TabPanel>
    <TabPanel header="Gameplan">
      <TextArea
        style="min-width: 600px; min-height: 200px; resize: none"
        v-model="getFlight.gameplan"
        :draggable="false"
        rows="3"
        class=""
      />
    </TabPanel>
    <TabPanel header="COMMS Settings"></TabPanel>
    <TabPanel header="MISC Settings">
      <div class="miscSettings">
        <Checkbox />
        <a>Bingo</a>
        <InputNumber />
        <Checkbox v-model="enableBullz" binary />
        <a>Enable Bullseye</a>
        <Dropdown
          :options="selectedPKG.bullseyes"
          option-value="wp"
          v-model:model-value="getFlight.misc.BullseyeWP"
        >
          <template #value
            >{{ getFlight.misc.BullseyeWP }}:
            {{
              selectedPKG.bullseyes.find(
                (n) => n.wp === getFlight.misc.BullseyeWP
              )?.name
            }}</template
          ><template #option="{ option }"
            >{{ option.wp }}: {{ option.name }}</template
          >
        </Dropdown>

        <Checkbox /> <a>CARA ALLOW</a>
        <InputNumber />
        <Checkbox /><a> MSL Floor</a>
        <InputNumber />
        <Checkbox /> <a>Laser Settings</a>
        <div />
        <div />
        <a>TGP Code</a>
        <div style="display: flex">
          <Dropdown />
          <Dropdown />
          <Dropdown />
          <Dropdown />
        </div>
        <div />
        <a>LST Code</a>
        <div style="display: flex">
          <Dropdown />
          <Dropdown />
          <Dropdown />
          <Dropdown />
        </div>
        <div />
        <a>Laser Start Time</a>
        <InputNumber />
        <Checkbox /> <a>TACAN</a>

        <div style="display: flex; width: 50%">
          <InputMask mask="9?9" style="width: 50%" />
          <Dropdown style="width: 50%" :options="['X', 'Y']" />
        </div>

        <Checkbox /> <a>ILS</a>
        <div />
        <div />
        <a>Frequency</a>
        <InputNumber />
        <div />
        <a>Course</a>
        <InputNumber />
      </div>
    </TabPanel>
    <TabPanel header="HARM/HTS"> Work in Progress</TabPanel>
  </TabView>
  <div class="parent" v-if="file && getFlight.isActive">
    <!--<div class="item">
        <p>COMMS ASSIGNMENT</p>

        <CommsAssignment />
      </div>-->
    <div class="freqs">
      <div class="item5">
        <p>DEPART</p>
        <Dropdown
          :options="airports.filter((val) => val.map === theatre)"
          class="dropdown"
          severity="danger"
          option-label="NAME"
          v-model="getFlight.DEP"
          @change="(e: any) => {
            assignAirport('DEP', e.value);
          }
            "
          placeholder="select"
        />
        <Button
          style="grid-row: 15"
          v-if="getFlight.DEP.ICAO"
          icon="pi pi-times-circle"
          @click="deleteAirport('DEP')"
          text
        />
      </div>

      <div class="item5">
        <p>ARRIVE</p>
        <Dropdown
          :options="airports.filter((val) => val.map === theatre)"
          severity="danger"
          option-label="NAME"
          v-model="getFlight.ARR"
          @change="(e: any) => {
            assignAirport('ARR', e.value);
          }
            "
          placeholder="select"
        />
        <Button
          v-if="getFlight.ARR.ICAO"
          icon="pi pi-times-circle"
          @click="deleteAirport('ARR')"
          text
        />
      </div>
      <div class="item5">
        <p>ALTERNATE</p>
        <Dropdown
          :options="airports.filter((val) => val.map === theatre)"
          severity="danger"
          option-label="NAME"
          v-model="getFlight.ALT"
          @change="(e: any) => {
            assignAirport('ALT', e.value);
          }
            "
          placeholder="select"
        />
        <Button
          v-if="getFlight.ALT.ICAO"
          icon="pi pi-times-circle"
          @click="deleteAirport('ALT')"
          text
        />
      </div>
      <div class="parent">
        <div class="item5 comm-box">
          <p>CHECK-IN UHF</p>
          <Dropdown
            :options="tacticalFreqs.filter((n) => parseFloat(n.freq) > 200)"
            severity="danger"
            option-label="description"
            :model-value="selectedFreqs.checkUHF"
            @change="(e: any) => {
              getFlight.comms.radio1[4] = {
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
            v-if="getFlight.comms.radio1[4].freq"
            icon="pi pi-times-circle"
            @click="clearComms(4, 'pri')"
            text
          />
        </div>
        <div class="item5">
          <p>CHECK-IN VHF</p>
          <Dropdown
            :options="tacticalFreqs.filter((n) => parseFloat(n.freq) < 200)"
            severity="danger"
            v-model="selectedFreqs.checkVHF"
            option-label="description"
            @change="(e: any) => {
              getFlight.comms.radio2[4] = {
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
            v-if="getFlight.comms.radio2[4].freq"
            icon="pi pi-times-circle"
            @click="clearComms(4, 'sec')"
            text
          />
        </div>
      </div>
      <div class="parent freq">
        <div class="item5 comm-box">
          <p>TACTICAL UHF</p>
          <Dropdown
            :options="tacticalFreqs.filter((n) => parseFloat(n.freq) > 200)"
            severity="danger"
            v-model="selectedFreqs.tactUHF"
            option-label="description"
            @change="(e: any) => {
              getFlight.comms.radio1[5] = {
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
            v-if="getFlight.comms.radio1[5].freq"
            icon="pi pi-times-circle"
            @click="clearComms(5, 'pri')"
            text
          />
        </div>
        <div class="item5">
          <p>TACTICAL VHF</p>
          <Dropdown
            :options="tacticalFreqs.filter((n) => parseFloat(n.freq) < 200)"
            severity="danger"
            v-model="selectedFreqs.tactVHF"
            option-label="description"
            @change="(e: any) => {
              getFlight.comms.radio2[5] = {
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
            v-if="getFlight.comms.radio2[5].freq"
            icon="pi pi-times-circle"
            @click="clearComms(5, 'sec')"
            text
          />
        </div>
      </div>
      <div class="item5">
        <p>TANKER</p>
        <Dropdown
          :options="
            selectedPKG.agencies
              .filter((ag) =>
                ['KC-135', 'KC135MPRS', 'KC130'].includes(ag.type)
              )
              .sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0))
          "
          severity="danger"
          v-model="tanker"
          option-label="name"
          @change="(e: any) => {
            tanker = e.value;
          }
            "
          placeholder="select"
        />
        <Button
          v-if="tanker"
          icon="pi pi-times-circle"
          @click="clearComms(12, parseFloat(tanker.freq) > 200 ? 'pri' : 'sec')"
          text
        />
      </div>
      <div class="parent freq">
        <div class="item5 comm-box">
          <Button
            style="width: 175px"
            label="Copy to other Flights"
            v-if="false"
          />
        </div>
        <div class="item5">
          <Button
            style="width: 175px"
            label="Copy to all Flights"
            v-if="false"
          />
        </div>
      </div>
      <div class="item5">
        <Button
          style="width: 175px"
          label="Copy to other Flights"
          v-if="false"
        />
      </div>
    </div>

    <div class="parent item">
      <div class="item">
        <p>Radio 1</p>
        <DataTable
          showGridlines
          edit-mode="cell"
          :value="getFlight.comms.radio1"
          style="width: 450px"
        >
          <Column
            header="#"
            headerStyle="width: 2rem"
            style="width: fit-content; padding: 2px 5px 2px 5px"
          >
            <template #body="{ index }"> {{ index + 1 }}</template>
          </Column>
          <Column
            header="Freq"
            field="freq"
            headerStyle="width: 2rem"
            style="width: fit-content; padding: 2px 5px 2px 5px"
          >
            <template #body="{ data, index }"> {{ data?.freq }}</template>
            <template #editor="{ data, index }">
              <Input class="fixW" v-model="getFlight.comms.radio1[index].freq"
            /></template>
          </Column>
          <Column
            header="Name"
            field="name"
            style="width: fit-content; padding: 2px 5px 2px 5px"
          >
            <template #body="{ data }"> {{ data?.name }}</template>
            <template #editor="{ data, index }">
              <Input v-model="getFlight.comms.radio1[index].name"
            /></template>
          </Column>

          <Column
            header="n°"
            field="number"
            style="padding: 2px 5px 2px 5px; max-width: 70px"
          >
            <template #body="{ data }"> {{ data?.number || null }}</template>
            <template #editor="{ data, index }">
              <InputNumber
                class="fixW"
                v-model="getFlight.comms.radio1[index].number"
              />
            </template>
          </Column>
          <Column
            header="Description"
            field="description"
            style="padding: 2px 5px 2px 5px"
          >
            <template #body="{ data }"> {{ data?.description }}</template>
            <template #editor="{ data, index }">
              <Input
                class="fixW"
                v-model="getFlight.comms.radio1[index].description"
            /></template>
          </Column>
          <Column style="padding: 2px 5px 2px 5px; width: 20px">
            <template #body="{ index }"
              ><Button
                text
                icon="pi pi-eraser"
                @click="clearComms(index, 'pri')"
            /></template>
          </Column>
        </DataTable>

        <toDTC class="item" />
      </div>

      <div class="item">
        <p>Radio 2</p>
        <DataTable
          showGridlines
          style="width: 450px"
          edit-mode="cell"
          :value="getFlight.comms.radio2"
        >
          <Column header="#" style="padding: 2px 5px 2px 5px">
            <template #body="{ index }"> {{ index + 1 }}</template>
          </Column>
          <Column header="Freq" field="freq" style="padding: 2px 5px 2px 5px">
            <template #body="{ data }"> {{ data?.freq }}</template>
            <template #editor="{ data, index }">
              <Input class="fixW" v-model="getFlight.comms.radio2[index].freq"
            /></template>
          </Column>
          <Column header="Name" field="name" style="padding: 2px 5px 2px 5px">
            <template #body="{ data }"> {{ data?.name }}</template>
            <template #editor="{ data, index }">
              <Input class="fixW" v-model="getFlight.comms.radio2[index].name"
            /></template>
          </Column>
          <Column header="n°" field="number" style="padding: 2px 5px 2px 5px">
            <template #body="{ data }"> {{ data?.number || null }}</template>
            <template #editor="{ data, index }">
              <InputNumber
                class="fixW"
                v-model="getFlight.comms.radio2[index].number"
              />
            </template>
          </Column>
          <Column
            header="Description"
            field="description"
            style="padding: 2px 5px 2px 5px"
          >
            <template #body="{ data }"> {{ data?.description }}</template>
            <template #editor="{ data, index }">
              <Input
                class="fixW"
                v-model="getFlight.comms.radio2[index].description"
            /></template>
          </Column>
          <Column style="padding: 2px 5px 2px 5px; width: 20px">
            <template #body="{ index }"
              ><Button
                text
                icon="pi pi-eraser"
                @click="clearComms(index, 'sec')"
            /></template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  padding: 0 0;
  margin: 0 0;
}

.fixW {
  max-width: 100%;
}

.item {
  margin: 10px;
}

.item5 {
  margin: 5px;
}

.comm-box {
  width: 214px;
}

@media (1700px > width > 1375px) {
  .freqs {
    max-width: 225px;
  }
}

.p-dropdown {
  width: 175px;
}

.input {
  width: 100%;
}

.miscSettings {
  display: grid;
  grid-template-columns: 100px 140px 300px;
  grid-template-rows: repeat(12, 24px);
  grid-column-gap: 1px;
  grid-row-gap: 4px;
}
</style>
