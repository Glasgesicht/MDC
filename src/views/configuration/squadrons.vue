<template>
    <DataTable edit-mode="cell" :value="squadrons">
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
        <Column header="STN-Prefix"><template #body="{ data }">{{ data.STN ? data.STN + 'X' : 'automaticially assigned'
                }}</template><template #editor="{ data, index, field }">
                <InputMask mask="?9999X" v-model=squadrons[index].STN></InputMask>
            </template>
        </Column>
        <Column header="Active"><template #body="{ data, index }">
                <Checkbox v-model:model-value="squadrons[index].active" />
            </template>
        </Column>
        <Column header="Delete"><template #body="{ data, index }">
                <Button icon="pi pi-trash" @click="squadrons.splice(index, 1)" />
            </template>
        </Column>
        <template #footer><Button label="Add Squadron" @click="squadrons.push({
            name: 'A',
            aircraft: 'F/A-18C',
            active: true,
            STN: ''
        })" /></template>
    </DataTable>
</template>

<script setup lang="ts">
import { aircraft } from '@/types/aircraft';
import { ref, type Ref } from 'vue';
type aircraftType = `${aircraft}`

const squadrons: Ref<{ name: string, aircraft: aircraftType, STN: string, active: boolean }[]> = ref(new Array())

</script>
<style lang="css"></style>