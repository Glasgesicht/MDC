<script setup lang="ts">
import { commTables } from "@/config/defaults/frequencies";
import { useGlobalStore } from "@/stores/theatreStore";
const globalStore = useGlobalStore();

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});
</script>

<template>
  <div class="bdr mdcpage" name="mdcpage">
    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
    <div class="c3 y bdr ctr">PAGE {{ pagenr }}</div>
    <a class="c33 g bdr ctr"
      >CJTF-13 Frequency Matrix issue 1 -
      {{
        new Date(
          globalStore.time.year +
            "-" +
            globalStore.time.month +
            "-" +
            globalStore.time.day
        ).toDateString()
      }}</a
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
          <div
            v-for="i in new Array(10).keys()"
            class="c4 ctr bdr row-header"
            :style="
              (i ? '' : 'border-right: 2px solid black') +
              '; border-top: 2px solid black;border-bottom: 2px solid black'
            "
          >
            {{ i || "" }}
          </div>
        </div>
        <div
          class="bdr c4 ctr"
          :style="
            (index % 2 ? 'background-color:lightgrey' : '') +
            ';border-right: 2px solid black'
          "
        >
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
      <div v-for="i in new Array(10).keys()" class="c4 ctr bdr row-header">
        {{ i || "" }}
      </div>
    </div>

    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/newstyle.css";

.inner-grid {
  display: inline-grid;
  grid-template-columns: repeat(40, 1fr);
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
