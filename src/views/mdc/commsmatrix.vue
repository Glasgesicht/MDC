<script setup lang="ts">
import { commTables } from "@/config/frequencies";
</script>

<template>
  <div class="bdr mdcpage" name="mdcpage">
    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>

    <!-- Header Row with Numbering -->
    <div class="c36 child">
      <div class="bdr ctr" v-for="i in new Array(11).keys()" :key="i">
        <div v-if="i > 0" class="c4">{{ i }}</div>
        <div v-else class="c3">{{ i }}</div>
      </div>
    </div>

    <!-- Data Rows -->
    <div
      v-for="([row, items], index) in Object.entries(commTables[0])"
      :key="row"
      class="c36 child"
    >
      <div v-if="index % 8 === 0" class="c36 header-row">
        <div v-for="i in new Array(11).keys()" :key="i" class="bdr ctr">
          <div v-if="i > 0" class="c4">{{ i }}</div>
          <div v-else class="c3">{{ i }}</div>
        </div>
      </div>
      <div class="bdr c4">{{ row }}</div>
      <div v-for="item of items" :key="item" class="c3 bdr ctr">
        {{ item }}
      </div>
    </div>

    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
  </div>
</template>

<style scoped>
@import "@/assets/newstyle.css";

.font500 {
  font-weight: 500;
}
</style>
