<script setup lang="ts">
import { commTables } from "@/config/frequencies";
</script>

<template>
  <div class="bdr mdcpage" name="mdcpage">
    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
    <a class="c36 bdr ctr"
      >CJTF-13 Frequency Matrix issue 1 - {{ new Date().toDateString() }}</a
    >
    <div class="inner-grid c36 r47">
      <!-- Header Row with Numbering -->
      <!-- Data Rows -->
      <div
        v-for="([row, items], index) in Object.entries(commTables[0])"
        :key="row"
        class="child"
      >
        <div v-if="index % 8 === 0" class="c40 child">
          <div v-for="i in new Array(10).keys()" class="c4 ctr bdr row-header">
            {{ i || "" }}
          </div>
        </div>
        <div class="bdr c4 ctr" :style="`color:${row};background-color:grey`">
          {{ row }}
        </div>
        <div
          v-for="item of items"
          :key="item"
          class="c4 bdr ctr"
          :style="index % 2 ? 'background-color:lightgrey' : ''"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
  </div>
</template>

<style scoped>
@import "@/assets/newstyle.css";

.inner-grid {
  display: inline-grid;
  grid-template-columns: repeat(40, 1fr);
  grid-template-rows: repeat(36, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.row-header {
  background-color: darkgrey;
  color: white;
}

.font500 {
  font-weight: 500;
}
</style>
