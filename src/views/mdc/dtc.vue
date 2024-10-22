<template>
  <TextArea v-model="dtcparse" />
  <TextArea v-model="dtcparsed" />
  <Button
    @click="
      () => {
        dtcparsed = JSON.stringify(decompressString(dtcparse));
      }
    "
  />
</template>
<script setup lang="ts">
import Button from "primevue/button";
import TextArea from "primevue/textarea";
import { decompressString } from "@/utils/dtc";

import { ref, watch } from "vue";

const dtcparse = ref(
  "oQEAAB+LCAAAAAAAAAqtUD0LwjAU/C9vDlIrOHSTanWJiJ+DODzbJwRjUvMxSOl/N1JTFFe3y91xd3kNTIQpDV4cZFAMxzkw2NVSYwWZ8lIyOOCj1kI5m2PtvKEfPhI530S4xkroIDQdGr7QypCll/vYwNLfzmQgSxks8dZHFobunlT5CFtGaTpIEmhPDDYkqXRUfcidPwpddGRnCs+S5h5N+MMFpSUGXFehJWnf09KvQd9hf2gJNbyYRudisuY93vY3mqJDKdQ1vrmwZcR7MlZoFQ7UPgHJAbb/oQEAAA=="
);
const dtcparsed = ref("");
</script>
