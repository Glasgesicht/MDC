<template>
  <div class="parent">
    <div class="upload-container">
      <input
        type="file"
        id="fileUpload"
        class="file-input"
        v-on:change="onChangedFile"
        accept=".cf"
        style="grid-row: 2 / span 2; grid-column: 1 / span 4"
      />
      <label for="fileUpload" class="file-label">
        <div class="file-button">Upload File</div>
      </label>
      <span id="fileName" class="file-name">{{ filename }}</span>
    </div>
    <!--
    <b style="grid-row-start: 7">change color preset</b>
    <div style="grid-row: 8 / span 3; grid-column: 1 / span 2"><Styles /></div>
    <div
      style="grid-row: 8 / span 3; grid-column-start: 3; padding: 0"
      class="preview"
    >
      <Datacard :pagenr="4" />
    </div>-->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { processCF } from "@/config/parseFiles";
import { useGlobalStore } from "@/stores/theatreStore";
import { ref } from "vue";
import { useEditHistory } from "@/components/history/editHistory";

const globalStore = useGlobalStore();
const { file } = storeToRefs(globalStore);

const filename = ref("no file selected");

const onChangedFile = async (payload: any) => {
  globalStore.setFile(true);
  processCF(payload.target.files[0]);
  filename.value = payload.target.files[0].name;
};
</script>

<style scoped>
.preview * {
  padding: 0 0 !important;
}

.upload-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20px;
}

.file-input {
  display: none;
}

.file-label {
  background-color: #e1e1e1;
  color: #555;
  padding: 15px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  text-align: center;
  transition: background-color 0.3s;
}

.file-label:hover {
  background-color: #f4f4f4;
}

.file-name {
  margin-top: 10px;
  font-size: 16px;
  color: #555;
}
</style>
