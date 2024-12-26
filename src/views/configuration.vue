<template>

    <Tabs value="0">
        <TabList>
            <Tab value="0">Callsigns</Tab>
            <Tab value="1">Squadrons</Tab>
            <Tab value="2">Airfields</Tab>
            <Tab value="3">Weather</Tab>
            <!--Tab disabled>Header IV</Tab -->
        </TabList>
        <TabPanels>
            <TabPanel value="0">
                <Callsigns />
            </TabPanel>
            <TabPanel value="1">
                <Squadrons />
            </TabPanel>
            <TabPanel value="2">
                <Airports />
            </TabPanel>
        </TabPanels>
    </Tabs>
</template>

<script setup lang="ts">
import Airports from './configuration/airports.vue';
import Callsigns from './configuration/callsigns.vue';
import Squadrons from './configuration/squadrons.vue';
</script>
<style lang="css"></style>