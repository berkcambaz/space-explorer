<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import type { IAPOD } from '@/types/apod'
import { util } from '@/lib/util'
import { computed } from 'vue';
import { watchEffect } from 'vue';

const display = useDisplay();

const apod = ref<IAPOD | undefined>(undefined);

const dialog = ref(false);
const date = ref<any[] | undefined>(new Date().toString() as any);
const formattedDate = computed(
  () => util.formatDate(new Date(date.value as any).getTime())
);

watchEffect(async () => {
  try {
    const isoDate = new Date(formattedDate.value).toISOString().split('T')[0];
    if (!isoDate) return;

    const result = await fetch(`https://api.nasa.gov/planetary/apod?date=${isoDate}&api_key=${import.meta.env.VITE_NASA_API_KEY}`);
    const json = await result.json() as IAPOD;
    apod.value = json;
  } catch (error) {

  }
})
</script>

<template>
  <VSheet class="mx-4 my-4">
    <VImg height="calc(75vh - 64px)" :src="apod?.url" />

    <VSheet class="d-flex justify-center my-2">
      <VBtn prepend-icon="mdi-calendar" variant="text">
        {{ formattedDate }}

        <VDialog width="auto" v-model="dialog" activator="parent">
          <VContainer class="d-flex flex-0-0 justify-center align-center">
            <VDatePicker v-model="date" />
          </VContainer>
        </VDialog>
      </VBtn>
    </VSheet>

    <VSheet :max-width="display.thresholds.value.sm" class="mx-auto">
      <h2 class="text-h4 text-center my-2">{{ apod?.title }}</h2>
      <p class="text-body-1 text-center">{{ apod?.explanation }}</p>
      <p v-if="apod?.copyright" class="text-caption text-center">{{ `© ${apod.copyright}` }}</p>
    </VSheet>
  </VSheet>
</template>
