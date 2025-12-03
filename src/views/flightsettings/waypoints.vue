<template>
  <div class="block p-4" v-if="getFlight.callsign">
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-3">Waypoints</h3>
      <DataTable
        showGridlines
        edit-mode="cell"
        selectionMode="multiple"
        :metaKeySelection="true"
        sort-field="waypointNr"
        :sortOrder="1"
        v-model:selection="selectedSteerpoints"
        :value="getFlight.waypoints"
        class="max-w-[2050px] text-left"
      >
        <Column field="waypointNr" header="WPN NR" class="w-[100px]">
          <template #editor="{ index }">
            <InputNumber
              v-model:model-value="getFlight.waypoints[index].waypointNr"
            />
          </template>
        </Column>
        <Column field="name" header="Name">
          <template #editor="{ index }">
            <InputText v-model="getFlight.waypoints[index].name" />
          </template>
        </Column>
        <Column field="type" header="Type">
          <template #editor="{ index }">
            <InputText v-model="getFlight.waypoints[index].type" />
          </template>
        </Column>
        <Column field="activity" header="Activity" />
        <Column field="tot" header="Time on Target">
          <template #body="{ data }">{{
            new Date(data.tot).toLocaleTimeString("de-DE")
          }}</template>
        </Column>
        <Column field="mach" header="Mach">
          <template #body="{ data }">{{
            Number(data.mach).toFixed(2)
          }}</template>
        </Column>
        <Column field="groundspeed" header="Groundspeed">
          <template #body="{ data }"
            >{{ Number(data.groundspeed).toFixed(0) }} kts</template
          >
        </Column>
        <Column field="altitude" header="Altitude">
          <template #body="{ data }"
            >{{ data.location.getElevation() }} ft</template
          >
          <template #editor="{ index }">
            <InputNumber
              v-model:model-value="
                getFlight.waypoints[index].location.elevation
              "
            />
          </template>
        </Column>
        <Column header="Hide" field="hideOnMDC" class="w-10">
          <template #body="{ data }">
            <Checkbox binary v-model="data.hideOnMDC" />
          </template>
        </Column>
        <Column header="DMPI" class="w-10">
          <template #body="{ index }">
            <Button @click="toDMPI(index)" outlined icon="pi pi-download" />
          </template>
        </Column>
        <Column class="w-10">
          <template #body="{ index }">
            <Button
              @click="deleteWaypoint(index)"
              severity="danger"
              outlined
              icon="pi pi-trash"
            />
          </template>
        </Column>
        <template #footer>
          <div class="flex flex-wrap gap-2">
            <Button
              label="decrement"
              outlined
              icon="pi pi-angle-up"
              @click="decrSelected()"
            />
            <Button
              label="increment"
              outlined
              icon="pi pi-chevron-down"
              @click="incSelected()"
            />
            <Button label="hide selected" outlined @click="hideSelected()" />
            <Button
              label="unhide selected"
              outlined
              @click="unhideSelected()"
            />
          </div>
        </template>
      </DataTable>
    </div>

    <div class="flex flex-wrap" v-if="getFlight.callsign">
      <div class="pr-12 box-border">
        <h3 class="text-xl font-semibold pb-3 min-w-[400px]">
          Designated Impact Points (DMPIs)
        </h3>
        <DataTable
          showGridlines
          edit-mode="cell"
          :value="getFlight.dmpis"
          class="min-w-[1200px]"
        >
          <Column header="WPN NR" class="w-[100px]">
            <template #body="{ index }">{{ index + 81 }}</template>
          </Column>
          <Column field="type" header="Type">
            <template #editor="{ index }">
              <input
                v-model="getFlight.dmpis[index].type"
                class="w-full px-2 py-1 border rounded"
              />
            </template>
          </Column>
          <Column field="name" header="Name">
            <template #editor="{ index }">
              <input
                v-model="getFlight.dmpis[index].name"
                class="w-full px-2 py-1 border rounded"
              />
            </template>
          </Column>
          <Column field="altitude" header="Altitude">
            <template #body="{ data }"
              >{{ data.location.getElevation() }} ft</template
            >
          </Column>
          <Column field="latitude" header="Latitude">
            <template #body="{ data }">{{
              data.location.toLatString()
            }}</template>
          </Column>
          <Column field="longitude" header="Longitude">
            <template #body="{ data }">{{
              data.location.toLongString()
            }}</template>
          </Column>
          <Column field="note" header="Note">
            <template #editor="{ index }">
              <input
                v-model="getFlight.dmpis[index].note"
                class="w-full px-2 py-1 border rounded"
              />
            </template>
          </Column>
          <template #footer>
            <div class="flex gap-2">
              <SteerpointsToDTC mode="all" label="all to DTC" outlined />
              <SteerpointsToDTC
                mode="waypoints"
                label="waypoints to DTC"
                outlined
              />
              <SteerpointsToDTC mode="dmpi" label="DMPI to DTC" outlined />
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <Dialog v-model:visible="showDia">
      <template #header>
        <span class="font-bold">Copy DMPI to Flights</span>
      </template>
    </Dialog>
  </div>
  <div v-else class="p-4">
    <h2 class="text-2xl">Please select a flight to edit</h2>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useFlightStore } from "@/controller/stores/flightStore";
import SteerpointsToDTC from "@/components/DTCExports/steerpointsToDTC.vue";
import { ref } from "vue";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";
import { usePackageStore } from "@/controller/stores/packageStore";

const { getFlight } = storeToRefs(useFlightStore());
const { selectedPKG } = storeToRefs(usePackageStore());
const showDia = ref(false);

const selectedSteerpoints = ref(new Array());

const sortSelected = () =>
  selectedSteerpoints.value.sort((a, b) => b.waypointNr - a.waypointNr);

const incSelected = () => {
  if (
    !selectedSteerpoints.value.length ||
    !selectedSteerpoints.value[0]?.waypointNr
  ) {
    return;
  }

  selectedSteerpoints.value.sort((a, b) => a.waypointNr - b.waypointNr);

  for (let i = selectedSteerpoints.value.length - 1; i >= 0; i--) {
    const swapWith = getFlight.value.waypoints.findIndex(
      (n) => n.waypointNr === selectedSteerpoints.value[i].waypointNr + 1
    );
    if (swapWith !== -1) {
      getFlight.value.waypoints[swapWith].waypointNr -= 1;
    }

    selectedSteerpoints.value[i].waypointNr += 1;
  }
};

const decrSelected = () => {
  if (!selectedSteerpoints.value || !selectedSteerpoints.value[0]?.waypointNr)
    return;
  sortSelected();

  for (let i = selectedSteerpoints.value.length - 1; i >= 0; i--) {
    if (selectedSteerpoints.value[i].waypointNr < 2) return;

    const swapWith = getFlight.value.waypoints.findIndex(
      (n) => n.waypointNr === selectedSteerpoints.value[i].waypointNr - 1
    );
    if (swapWith !== -1) getFlight.value.waypoints[swapWith].waypointNr += 1;
    selectedSteerpoints.value[i].waypointNr -= 1;
  }
};

const hideSelected = () => {
  if (!selectedSteerpoints.value) return;
  selectedSteerpoints.value.forEach((n) => (n.hideOnMDC = true));
};

const unhideSelected = () => {
  if (!selectedSteerpoints.value) return;
  selectedSteerpoints.value.forEach((n) => (n.hideOnMDC = false));
};

function toDMPI(i: number) {
  selectedSteerpoints.value = new Array();

  const tdmpi = getFlight.value.waypoints.splice(i, 1);

  getFlight.value.dmpis.push({
    location: tdmpi[0].location,
    name: tdmpi[0].name,
    note: tdmpi[0].activity,
    type: tdmpi[0].type,
  });
}

function deleteWaypoint(i: number) {
  getFlight.value.waypoints.splice(i, 1);
}
</script>
