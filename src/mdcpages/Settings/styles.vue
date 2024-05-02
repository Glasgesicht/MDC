// lite font -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"

<template>
  <p>Use Preset</p>
  <div class="card flex justify-content-center">
    <Dropdown v-model="presetModel" :options="[]">
      <template #value>313 Default</template></Dropdown
    >
  </div>

  <p>Main Background Color</p>
  <div class="card flex justify-content-center">
    <ColorPicker v-model="mcdgrey" />
  </div>
  <p>Secondary Background Color</p>
  <div class="card flex justify-content-center">
    <ColorPicker v-model="mcdwhite" />
  </div>
  <p>Contrast Color</p>
  <div class="card flex justify-content-center">
    <ColorPicker v-model="mcdhalfgrey" />
  </div>

  <p>ROE Text Color</p>
  <div class="card flex justify-content-center">
    <ColorPicker v-model="mcdred" />
  </div>

  <p>ROE background Color</p>
  <div class="card flex justify-content-center">
    <ColorPicker v-model="mcdred_bg" />
  </div>

  <p>Page Outer Background Color</p>
  <div class="card flex justify-content-center">
    <ColorPicker v-model="mcd_page" />
  </div>

  <p>Font Size</p>
  <div class="card flex justify-content-center">
    <InputNumber v-model="mcd_font_size" />
  </div>

  <p>Header Font Weight</p>
  <div class="card flex justify-content-center">
    <Dropdown
      :value="mcd_header_font_weight"
      v-model="mcd_header_font_weight"
      :options="fonz_weight"
      ><template #value>{{ mcd_header_font_weight }}</template></Dropdown
    >
  </div>

  <p>Item Font Weight</p>
  <div class="card flex justify-content-center">
    <Dropdown
      :value="mcd_font_weight"
      v-model="mcd_font_weight"
      :options="fonz_weight"
      ><template #value>{{ mcd_font_weight }}</template></Dropdown
    >
  </div>
</template>
<script setup lang="ts">
import ColorPicker from "primevue/colorpicker";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import { onMounted, ref } from "vue";

const presetModel = ref("");

const mcdgrey = ref("");
const mcdwhite = ref("");
const mcdhalfgrey = ref("");
// const rnlaforange = ref("");
const mcdred = ref("");
const mcdred_bg = ref("");
const mcd_page = ref("");
const mcd_font_size = ref(0);
const mcd_font_weight = ref("");
const mcd_header_font_weight = ref("");

onMounted(() => {
  const root = getComputedStyle(document.querySelector(":root")!);

  mcdgrey.value = root.getPropertyValue("--mcdgrey");
  mcdwhite.value = root.getPropertyValue("--mcdwhite");
  mcdhalfgrey.value = root.getPropertyValue("--mcdhalfgrey");
  mcdred.value = root.getPropertyValue("--mcdred");
  mcdred_bg.value = root.getPropertyValue("--mcdred-bg");
  mcd_page.value = root.getPropertyValue("--mcd-page");
  mcd_font_size.value = parseFloat(root.getPropertyValue("--mcd-font-size"));
  mcd_header_font_weight.value = root.getPropertyValue(
    "--mcd-header-font-weight"
  );
  mcd_font_weight.value = root.getPropertyValue("--mcd-text-font-weight");

  console.log(mcd_font_size.value);
  console.log(mcd_font_weight.value);
});

const fonz_weight = [
  "Thin",
  "Extra Light",
  "Light",
  "Normal",
  "Medium",
  "Semi Bold",
  "Bold",
  "Extra Bold",
];

const defaultCSS = `
  --mcdgrey: #3a3838;
  --mcdwhite: #f2f2f2;
  --mcdhalfgrey: #d0cece;
  --rnlaforange: #ffc000;
  --mcdred: #ff0000;
  --mcdred-bg: #fce4d6;
  --mcd-page: #ffff00;
  --mcd-font-size: 1.019em;
  --mcd-header-font-weight: bolder;
  --mcd-text-font-weight: 600;
  `;
</script>
