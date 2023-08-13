<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import type { IAPOD } from '@/types/apod'
import { util } from '@/lib/util'
import { computed } from 'vue';
import { watchEffect } from 'vue';
import Progress from "@/components/Progress.vue"
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/app';

const display = useDisplay();
const appStore = useAppStore();

const apod = ref<IAPOD | undefined>(undefined);

const dialog = ref(false);
const date = ref<string>(new Date().toString());
const formattedDate = computed(() => util.formatDate(new Date(date.value)));
const favourited = computed(() => appStore.isImageFavourited(util.dateToISO(new Date(date.value))));

async function favourite() {
  const isoDate = util.dateToISO(new Date(date.value));
  await appStore.favouriteImage(isoDate, !favourited.value);
}

watchEffect(async () => {
  try {
    const isoDate = util.dateToISO(new Date(date.value));
    if (!isoDate) return;

    const result = await api.pictureOfTheDay(isoDate);

    apod.value = result;
  } catch (error) {

  }
})
</script>

<template>
  <VSheet class="mx-4 my-4 bg-transparent">
    <VImg height="calc(75vh - 64px)" :src="apod?.url">
      <template v-slot:placeholder><Progress /></template>
    </VImg>

    <VSheet class="d-flex justify-center my-2 bg-transparent">
      <VBtn :icon="favourited ? 'mdi-star' : 'mdi-star-outline'" @click="favourite" variant="text"
        density="comfortable" />

      <VBtn prepend-icon="mdi-calendar" variant="text">
        {{ formattedDate }}

        <VDialog width="auto" scrollable v-model="dialog" activator="parent">
          <VSheet>
            <VDatePicker v-model="(date as any)" />
          </VSheet>
        </VDialog>
      </VBtn>
    </VSheet>

    <VSheet :max-width="display.thresholds.value.sm" class="mx-auto bg-transparent">
      <h2 class="text-h4 text-center my-2">{{ apod?.title }}</h2>
      <p class="text-body-1 text-center">{{ apod?.explanation }}</p>
      <p v-if="apod?.copyright" class="text-caption text-center">{{ `© ${apod.copyright}` }}</p>
    </VSheet>
  </VSheet>
</template>
