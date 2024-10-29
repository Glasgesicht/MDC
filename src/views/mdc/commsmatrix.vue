<script setup lang="ts">
import { commTables } from "@/config/frequencies"

</script>

<template>
    <div class="bdr mdcpage" name="mdcpage">
        <div class="c36 r bdr">
            NATO SECRET - SHRED AFTER USE
        </div>
        <div v-for="row in Object.entries(commTables[0])" class="c36 child">
            <div class="c4 border">
                {{ row[0] }}
            </div>
            <div v-for="item of row[1]" class="c3 border">
                {{ item }}
            </div>
        </div>
        <div class="c36 r bdr">
            NATO SECRET - SHRED AFTER USE
        </div>
    </div>
</template>

<style scoped>
@import "@/assets/newstyle.css";

.child {
    display: grid;
}

.font500 {
    font-weight: 500;
}
</style>