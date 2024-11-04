<script setup lang="ts">
import { commTables } from "@/config/frequencies";
</script>

<template>
  <div class="bdr mdcpage" name="mdcpage">
    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
    <div class="c36 child">
      <div class="bdr ctr" v-for="i in new Array(11).keys()">
        <div v-if="i > 0" class="c4">{{ i }}</div>
        <div v-else class="c3">{{ i }}</div>
      </div>
    </div>
    <div v-for="row in Object.entries(commTables[0])" class="c36 child">
      <div class="bdr c4">
        {{ row[0] }}
      </div>
      <div v-for="item of row[1]" class="c3 bdr ctr">
        {{ item }}
      </div>
    </div>
    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
  </div>
</template>

<style scoped>
@import "@/assets/newstyle.css";

.child {
  display: inline-grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}

.font500 {
  font-weight: 500;
}
</style>
