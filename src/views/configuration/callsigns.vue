<template>

    <Select :options="squadrons" option-label="name" v-model:model-value="activeSquadron" />
    <DataTable :value="activeSquadron.callsigns" edit-mode="cell" @cell-edit-complete="squadrons = squadrons">
        <Column header="Name" field="name"><template #editor="{ index }">
                <InputText v-model:model-value="activeSquadron.callsigns[index].name"></InputText>
            </template>
        </Column>
        <Column header="Number" field="number"><template #editor="{ index }">
                <InputNumber v-model:model-value="activeSquadron.callsigns[index].number" :min="1" :max="9"
                    :max-fraction-digits="0" />
            </template>
        </Column>
        <Column header="STN"><template #body="{ data }">{{ activeSquadron.STN ? activeSquadron.STN : 'XXXXX' }}{{
            data.number }}X</template></Column>
        <Column header="PRI"></Column>
        <Column header="SEC"></Column>
        <Column header="TER"></Column>
        <Column><template #body="{ index }"><Button icon="pi pi-trash"
                    @click="activeSquadron.callsigns.splice(index, 1); squadrons = squadrons" /></template>
        </Column>
        <template #footer><Button label="Add Flight" :disabled="!activeSquadron?.name" @click="activeSquadron.callsigns.push({
            name: 'Viper',
            number: 1,
            PRI: 238.775,
            SEC: 120.000,
            TER: NaN,
            L16: '',
            STN: '',

        })" /></template>
    </DataTable>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSqaudronsCallsigns } from './composables/useSquadronsCallsigns';
const { squadrons } = useSqaudronsCallsigns()

const activeSquadron = ref<typeof squadrons.value[number]>({ name: '', aircraft: 'AH-64D', active: false, callsigns: new Array(), STN: '' });
</script>
<style lang="css"></style>