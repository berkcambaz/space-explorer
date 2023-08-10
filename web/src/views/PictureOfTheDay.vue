<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import type { IAPOD } from '@/types/apod'

const display = useDisplay();

const apod = ref<IAPOD | undefined>(undefined);

onMounted(async () => {
  try {
    const result = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
    const json = await result.json() as IAPOD;
    apod.value = json;
  } catch (error) {

  }
})
</script>

<template>
  <VSheet class="mx-4 my-4">
    <VImg height="calc(75vh - 64px)" :src="apod?.url" />
    <VSheet :max-width="display.thresholds.value.sm" class="mx-auto">
      <h2 class="text-h4 text-center mt-4 mb-2">{{ apod?.title }}</h2>
      <p class="text-body-1 text-center">{{ apod?.explanation }}</p>
    </VSheet>
  </VSheet>
</template>
