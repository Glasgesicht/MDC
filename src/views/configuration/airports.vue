<template>

    Selected Theatre: <Dropdown v-model:model-value="selectedTheatre" :options="Object.values(theatres)" />
    <DataTable :value="selectedAirports" show-gridlines>
        <Column header="ICAO" field="ICAO"/>
        <Column header="NAME" field="NAME" />
        <Column header="ATIS" field="ATIS"><template #body="{data,  field, }"><section>
            UHF: {{data[field].uhf }}
        </section><section>VHF: {{data[field].vhf }}</section></template></Column>   
        <Column header="GROUND" field="GROUND"><template #body="{data,  field, }"><section>
            UHF: {{data[field].uhf }}
        </section><section>VHF: {{data[field].vhf }}</section></template></Column>        
        <Column header="TOWER" field="TOWER"><template #body="{data,  field, }"><section>
            UHF: {{data[field].uhf }}
        </section><section>VHF: {{data[field].vhf }}</section></template></Column>         
        <Column header="APPROACH" field="APPR"><template #body="{data,  field, }"><section>
            UHF: {{data[field].uhf }}
        </section><section>VHF: {{data[field].vhf }}</section></template></Column>    
        <Column header="TCN" field="TACAN"/>  
        <Column header="MAP" field="map"/>


        <template #footer><Button label="add entry" /></template>
    </DataTable>
</template>

<script setup lang="ts">

import { airports, airfieldEmpty } from "@/config/defaults/airfields";
import  { theatres, type theatre } from "@/types/theatre";
import { computed, ref, type Ref } from "vue";
const selectedTheatre:Ref<theatre> = ref("Syria")
const selectedAirports = computed(()=> airports.filter(n => n.map === selectedTheatre.value))

</script>
<style lang="css"></style>