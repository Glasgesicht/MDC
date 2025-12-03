<template>
  <div class="p-4">
    <div class="flex flex-col items-center gap-4">
      <input
        type="file"
        id="fileUpload"
        class="hidden"
        v-on:change="onChangedFile"
        accept=".cf"
      />
      <label for="fileUpload" class="cursor-pointer">
        <div
          class="bg-gray-200 hover:bg-gray-100 text-gray-600 px-8 py-4 rounded transition-colors text-lg text-center"
        >
          Upload File
        </div>
      </label>
      <span class="text-gray-500">{{ filename }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { processCF } from "@/controller/utils/parseFiles";
import { useGlobalStore } from "@/controller/stores/theatreStore";
import { ref } from "vue";

const globalStore = useGlobalStore();
const { file } = storeToRefs(globalStore);

const filename = ref("no file selected");

const onChangedFile = async (payload: any) => {
  globalStore.setFile(true);
  processCF(payload.target.files[0]);
  filename.value = payload.target.files[0].name;
};
</script>
