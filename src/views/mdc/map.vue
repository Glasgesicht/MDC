<template>
  <div class="bdr mdcpage" name="mdcpage">
    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
    <div class="c3 y bdr ctr">PAGE {{ pagenr }}</div>
    <a class="c33 g bdr ctr"
      >CJTF-13 Frequency Matrix issue 1 - {{ new Date().toDateString() }}</a
    >
    <div class="inner-grid c36 r47 bdr ctr">
      <Maps />
    </div>

    <div class="c36 r bdr ctr">NATO SECRET - SHRED AFTER USE</div>
  </div>
</template>
<script setup lang="ts">
//@ts-ignore
import Maps from "./child components/map.vue";

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});
</script>

<style lang="css" scoped>
@import "@/assets/newstyle.css";
</style>
