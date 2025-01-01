<template>
    <DataTable edit-mode="cell" :value="squadrons" @cell-edit-complete="squadrons = squadrons">
        <Column header="Squadron Name">
            <template #body="{ data }">{{ data.name }}</template>
            <template #editor="{ data, index, field }">
                <InputText v-model="squadrons[index].name"></InputText>
            </template>
        </Column>
        <Column header="T/O Aircraft"><template #body="{ data }">{{ data.aircraft }}</template><template
                #editor="{ data, index, field }">
                <Select :options="Object.values(aircraft)" v-model="squadrons[index].aircraft"></Select></template>
        </Column>
        <Column header="STN-Prefix"><template #body="{ data }">{{ data.STN ? data.STN + 'XX' : 'automaticially assigned'
                }}</template><template #editor="{ data, index, field }">
                <InputMask mask="?9999X" v-model=squadrons[index].STN></InputMask>
            </template>
        </Column>
        <Column header="Active">
            <template #body="{ data, index }">
                <Checkbox v-model="squadrons[index].active" binary @change="squadrons = squadrons" />
            </template>

        </Column>
        <Column header="Delete"><template #body="{ data, index }">
                <Button icon="pi pi-trash" @click="squadrons.splice(index, 1); squadrons = squadrons" />
            </template>
        </Column>
        <template #footer><Button label="Add Squadron" @click="squadrons = [...squadrons, {
            name: 'A',
            aircraft: 'F/A-18C',
            active: true,
            STN: '',
            callsigns: []
        }]" /></template>
    </DataTable>
</template>

<script setup lang="ts">
import { aircraft } from '@/types/aircraft';
import { useSqaudronsCallsigns } from './composables/useSquadronsCallsigns';
import { ref } from 'vue';

/* There are some reactivity issue here due to the utilization of local storage, 
** these are for now fixed due to explicitly rewriting the value through "squadron = squadron"
** to trigger the rewrite of localstorage
*/
const { squadrons } = useSqaudronsCallsigns()


</script>
<style lang="css"></style>