<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <span class="font-medium">Selected Theatre:</span>
      <Dropdown
        v-model:model-value="selectedTheatre"
        :options="Object.values(theatres)"
      />
    </div>
    <DataTable :value="selectedAirports" show-gridlines class="w-full">
      <Column header="ICAO" field="ICAO" />
      <Column header="NAME" field="NAME" />
      <Column header="ATIS" field="ATIS">
        <template #body="{ data, field }">
          <div class="space-y-1">
            <span class="block">UHF: {{ data[field].uhf }}</span>
            <span class="block">VHF: {{ data[field].vhf }}</span>
          </div>
        </template>
      </Column>
      <Column header="GROUND" field="GROUND">
        <template #body="{ data, field }">
          <div class="space-y-1">
            <span class="block">UHF: {{ data[field].uhf }}</span>
            <span class="block">VHF: {{ data[field].vhf }}</span>
          </div>
        </template>
      </Column>
      <Column header="TOWER" field="TOWER">
        <template #body="{ data, field }">
          <div class="space-y-1">
            <span class="block">UHF: {{ data[field].uhf }}</span>
            <span class="block">VHF: {{ data[field].vhf }}</span>
          </div>
        </template>
      </Column>
      <Column header="APPROACH" field="APPR">
        <template #body="{ data, field }">
          <div class="space-y-1">
            <span class="block">UHF: {{ data[field].uhf }}</span>
            <span class="block">VHF: {{ data[field].vhf }}</span>
          </div>
        </template>
      </Column>
      <Column header="TCN" field="TACAN" />
      <Column header="MAP" field="map" />

      <template #footer>
        <Button label="add entry" />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { airports, airfieldEmpty } from "@/config/defaults/airfields";
import { theatres, type theatre } from "@/types/theatre";
import { computed, ref, type Ref } from "vue";

const selectedTheatre: Ref<theatre> = ref("Syria");
const selectedAirports = computed(() =>
  airports.filter((n) => n.map === selectedTheatre.value)
);
</script>
