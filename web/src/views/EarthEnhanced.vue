<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IEPIC } from '@/types/epic';
import { useDisplay } from 'vuetify';
import Progress from "@/components/Progress.vue"
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { watch } from 'vue';
import { util } from '@/lib/util';
import { api } from '@/lib/api';

const display = useDisplay();

const dialog = ref(false);
const dateRange = ref<string[]>([]);

const epic = ref<IEPIC[]>([]);
const epicShown = ref<IEPIC[]>([]);

function epicSrc(_epic: IEPIC) {
  const date = _epic.date.slice(0, 10).replaceAll('-', '/');
  const image = _epic.image;
  return api.earthEnhancedSrc(date, image);
}

async function loadMore() {
  const diff = Math.min(epic.value.length - epicShown.value.length, 3);

  if (diff <= 0 && dateRange.value.length !== 2) return;
  if (diff <= 0 && dateRange.value.length === 2) {
    const lastEPIC = epicShown.value[epicShown.value.length - 1];
    if (!lastEPIC) return;

    const date = new Date(lastEPIC.date);
    date.setDate(date.getDate() + 1);

    const result = await api.earthEnhanced(util.dateToISO(date));
    const count = Math.min(result.length, 3, (epic.value.length - 1) % 3);

    epic.value.push(...result);
    epicShown.value.push(...result.slice(0, count));
    return;
  }

  const currentLength = epicShown.value.length;
  epicShown.value.push(...epic.value.slice(currentLength, currentLength + diff));
}

watch(dateRange, async () => {
  const date = dateRange.value[0] ? new Date(dateRange.value[0]) : new Date();
  const dateText = util.dateToISO(date);

  const result = await api.earthEnhanced(dateText);

  epic.value = result;
  epicShown.value = result.slice(1, 3 + 1);
})

onMounted(async () => {
  try {
    const result = await api.earthEnhanced();

    epic.value = result;
    epicShown.value = result.slice(1, 3 + 1);
  } catch (error) {

  }
})
</script>

<template>
  <VSheet class="mx-auto my-4 px-4 bg-transparent" :max-width="display.thresholds.value.md">

    <VSheet class="d-flex justify-center my-2 bg-transparent">
      <VBtn prepend-icon="mdi-calendar" variant="text">
        Change Date

        <VDialog width="auto" scrollable v-model="dialog" activator="parent">
          <VSheet>
            <VDatePicker v-model="dateRange" multiple />
          </VSheet>
        </VDialog>
      </VBtn>
    </VSheet>

    <VImg class="mb-6" height="calc(75vh - 64px)" :src="epic[0] && epicSrc(epic[0])">
      <template v-slot:placeholder><Progress /></template>
    </VImg>

    <VRow>
      <VCol v-for="data in epicShown" :key="data.identifier" cols="4">
        <VCard>
          <VImg :src="epicSrc(data)" aspect-ratio="1" cover>
            <template v-slot:placeholder><Progress /></template>
          </VImg>
        </VCard>
      </VCol>
    </VRow>

    <div class="d-flex align-center my-4">
      <VBtn class="mx-auto" @click="loadMore">Load More</VBtn>
    </div>
  </VSheet>
</template>
